const {
  ok, notFound, error, badRequest,
} = require('service-claire/helpers/responses');
const pick = require('lodash/pick');
const Stripe = require('stripe');
const { settings } = require('service-claire/helpers/config');
const logger = require('service-claire/helpers/logger');

const stripe = Stripe(settings.stripe.secret_key);

const {
  Plan,
} = require('../../models');

// XXX move to a config file
const planIds = ['standard', 'trial'];
const seatMapping = {
  standard: 100,
  trial: 20,
};

const getMyAccount = async (req, res) => {
  const { accountId } = req.user;

  try {
    const plan = await Plan.findOne({
      where: {
        accountId,
      },
    });

    if (!plan) {
      notFound(res)({
        reason: 'The plan for your account could not be found',
      });
      return;
    }

    ok(res)(pick(plan, Plan.cleanAttributes));
  } catch (err) {
    logger.error(err);
    error(res)(err);
  }
};

const getBillingAccountPromise = (accountId) => {
  return Plan.findOne({
    where: {
      accountId,
    },
  }).catch((err) => {
    logger.error(err);
  });
};

// Change the plan, does not update credit cards etc
// So this is a little tricky, how do we allow someone to change their plan
// if they don't already have billing set up?
const updateMyAccount = async (req, res) => {
  try {
    const { accountId } = req.user;
    const {
      plan,
      stripeToken,

      addressLineOne,
      addressLineTwo,
      city,
      region,
      postalCode,
    } = req.body;

    const dbPlan = await Plan.findOne({
      where: {
        accountId,
      },
    });

    const updatingPlan = dbPlan.plan !== plan;
    const updatingCard = Boolean(stripeToken);
    const updatingPaymentInfo = addressLineOne ||
      addressLineTwo ||
      city ||
      region ||
      postalCode;

    const customer = await stripe.customers.retrieve(dbPlan.customer);

    if (updatingCard) {
      await stripe.customers.update(dbPlan.customer, {
        source: stripeToken,
      });

      await dbPlan.update({
        allowedSeats: seatMapping[plan],
      });
    }

    if (updatingPaymentInfo) {
      await dbPlan.update({
        addressLineOne,
        addressLineTwo,
        city,
        region,
        postalCode,
      });
    }

    if (updatingPlan) {
      const hasCards = customer.sources.total_count > 0 || updatingCard;
      const hasAddressInformation = dbPlan.addressLineOne !== '' || updatingPaymentInfo;

      if (hasCards && hasAddressInformation) {
        // A ok
        const subscription = await stripe.subscriptions.retrieve(dbPlan.subscription);

        await stripe.subscriptions.update(dbPlan.subscription, {
          items: [{
            id: subscription.items.data[0].id,
            plan,
            quantity: dbPlan.seats,
          }],
        });

        await dbPlan.update({
          plan,
        });
      } else {
        return badRequest(res)({
          reason: 'You must add a card in order to change your plan',
        });
      }
    }

    req.services.email.send({
      to: dbPlan.billingEmail,
      subject: 'You billing information has changed',
      template: 'billing-change',
      data: {
        plan: dbPlan.plan,
      },
    });

    return ok(res)({
      plan: dbPlan.plan,
      allowedSeats: dbPlan.allowedSeats,
    });
  } catch (err) {
    logger.error(err);
    return error(res)(err);
  }
};


/*
{ name: 'Clarity Hub, Inc',
accountId: '12',
stripeToken: '12341234',
addressLineOne: '7520 S 13th Pl',
addressLineTwo: '',
city: 'Phoenix',
region: 'AZ',
postalCode: '85042',
plan: 'starter',
seats: 3,
email: 'ivan@clarityhub.io' }
*/

const createBilling = async (data) => {
  const {
    accountId,
    coupon,
    plan,
    email,
    seats,
    stripeToken,
    trialLength,
    trialStart,
  } = data;

  try {
    // create an account upfront, and then fill it in with details later
    const dbPlan = await Plan.create({
      accountId,
      seats,
      allowedSeats: 100,
      billingEmail: email,

      plan: 'trial',
      trialLength,
      trialStart,
    });

    if (planIds.indexOf(plan) === -1) {
      logger.error(new Error(`Plan Not Found: ${plan}`));
      return;
    }

    if (stripeToken) {
      // Stripe already has some of our customer info
      const customer = await stripe.customers.create({
        source: stripeToken,
        email,
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        plan,
        coupon,
        quantity: seats,
      });

      dbPlan.update({
        allowedSeats: seatMapping[plan],
        plan,
        customer: customer.id,
        subscription: subscription.id,
      });
    } else {
      // Make the customer from scratch
      const customer = await stripe.customers.create({
        email,
        metadata: {
          accountId,
        },
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        plan: 'trial',
        coupon,
        quantity: seats,
      });

      dbPlan.update({
        allowedSeats: seatMapping[plan],
        plan: 'trial',
        customer: customer.id,
        subscription: subscription.id,
      });
    }
  } catch (err) {
    logger.error(err);
  }
};

const addSeat = async (data) => {
  const { accountId } = data;

  try {
    const plan = await Plan.findOne({
      where: {
        accountId,
      },
    });

    await stripe.subscriptions.update(plan.subscription, {
      quantity: plan.seats + 1,
    });

    Plan.update({
      seats: Plan.sequelize.literal('seats + 1'),
    }, {
      where: {
        id: plan.id,
      },
    });
  } catch (err) {
    logger.error(err);
  }
};

const removeSeat = async (data) => {
  const { accountId } = data;

  try {
    const plan = await Plan.findOne({
      where: {
        accountId,
      },
    });

    await stripe.subscriptions.update(plan.subscription, {
      quantity: plan.seats - 1,
    });

    Plan.update({
      seats: Plan.sequelize.literal('seats - 1'),
    }, {
      where: {
        id: plan.id,
      },
    });
  } catch (err) {
    logger.error(err);
  }
};

module.exports = {
  getMyAccount,
  getBillingAccountPromise,
  updateMyAccount,
  createBilling,
  addSeat,
  removeSeat,
};
