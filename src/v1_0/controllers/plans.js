const {
  ok,
} = require('service-claire/helpers/responses');
const logger = require('service-claire/helpers/logger');
const {
  Plan,
} = require('../../models');

const plans = {
  standard: {
    id: 'standard',
    name: 'Standard (Monthly)',
    availableSeats: 100,
    price: 24,
  },
  trial: {
    id: 'trial',
    name: 'Trial',
    availableSeats: 20,
    price: 0,
  },
};

const getPlans = (req, res) => {
  ok(res)(plans);
};

const getPlansPromise = () => {
  return plans;
};

const getPlanPromise = (accountId) => {
  return Plan.findOne({
    where: {
      accountId,
    },
  }).then((plan) => {
    const planId = plan.plan;

    return plans[planId];
  }).catch((err) => {
    logger.error(err);
  });
};

module.exports = {
  getPlans,
  getPlansPromise,
  getPlanPromise,
};
