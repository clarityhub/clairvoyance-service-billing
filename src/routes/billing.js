const versionRouter = require('express-version-route');
const makeMap = require('service-claire/helpers/makeMap');
const authMiddleware = require('service-claire/middleware/auth');
const { isAdminMiddleware } = require('service-claire/middleware/auth');
const emailMiddleware = require('service-claire/middleware/email');
const rateLimitMiddleware = require('../rate-limits');
const cors = require('cors');
const v1_0 = require('../v1_0/controllers/billing');

const { oneSecondRateLimit } = rateLimitMiddleware;

module.exports = (router) => {
  router.use(cors());

  router.route('/me')
    .options(cors())
    .get(
      cors(),
      rateLimitMiddleware,
      authMiddleware,
      versionRouter.route(makeMap({
        '1.0': v1_0.getMyAccount,
        default: v1_0.getMyAccount,
      }))
    )
    .put(
      cors(),
      oneSecondRateLimit,
      isAdminMiddleware,
      emailMiddleware,
      versionRouter.route(makeMap({
        '1.0': v1_0.updateMyAccount,
        default: v1_0.updateMyAccount,
      }))
    );
};
