const cors = require('cors');
const { getPlans } = require('../v1_0/controllers/plans');

module.exports = (router) => {
  router.use(cors());

  router.route('/plans')
    .options(cors())
    .get(
      cors(),
      getPlans
    );
};
