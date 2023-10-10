const ExpressRouterAdapter = require('../adapters/express-router-adapter')
const FindAccountRouterComposer = require('../composers/find-account-router-composer')
const UpdateAccountRouterComposer = require('../composers/update-account-router-composer')

module.exports = (router) => {
  const findAccountRouter = FindAccountRouterComposer.compose()
  const updateAccountRouter = UpdateAccountRouterComposer.compose()
  router.get('/account', ExpressRouterAdapter.adapt(findAccountRouter))
  router.put('/account', ExpressRouterAdapter.adapt(updateAccountRouter))
}
