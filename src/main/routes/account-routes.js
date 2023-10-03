const ExpressRouterAdapter = require('../adapters/express-router-adapter')
const UpdateAccountRouterComposer = require('../composers/update-account-router-composer')

module.exports = (router) => {
  const updateAccountRouter = UpdateAccountRouterComposer.compose()
  router.patch('/account', ExpressRouterAdapter.adapt(updateAccountRouter))
}
