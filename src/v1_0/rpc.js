const { subscribe, unsubscribe } = require('service-claire/rpc/listen');
const { getPlansPromise, getPlanPromise } = require('./controllers/plans');
const { getBillingAccountPromise } = require('./controllers/billing');

subscribe('getPlans', () => {
  return getPlansPromise();
});

subscribe('getPlan', (data) => {
  const { meta } = data;

  const { accountId } = meta;

  if (accountId) {
    return getPlanPromise(accountId);
  }
  return {
    type: 'error',
    reason: 'Unsupported type',
  };
});

subscribe('getBillingAccount', (data) => {
  const { accountId } = data;

  if (accountId) {
    return getBillingAccountPromise(accountId);
  }
  return {
    type: 'error',
    reason: 'Unsupported type',
  };
});

process.on('exit', () => {
  unsubscribe('getPlan');
  unsubscribe('getPlans');
});
