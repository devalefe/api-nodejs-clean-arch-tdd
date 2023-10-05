const ExpressRouterAdapter = require('../adapters/express-router-adapter')
const UpdateAccountRouterComposer = require('../composers/update-account-router-composer')

module.exports = (router) => {
  const updateAccountRouter = UpdateAccountRouterComposer.compose()
  router.put('/account', ExpressRouterAdapter.adapt(updateAccountRouter))
}
