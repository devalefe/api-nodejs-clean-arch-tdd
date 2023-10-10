const ExpressRouterAdapter = require('../adapters/express-router-adapter')
const FindAccountRouterComposer = require('../composers/account/find')
const UpdateAccountRouterComposer = require('../composers/account/update')

module.exports = (router) => {
  const findAccountRouter = FindAccountRouterComposer.compose()
  const updateAccountRouter = UpdateAccountRouterComposer.compose()
  router.get('/account', ExpressRouterAdapter.adapt(findAccountRouter))
  router.put('/account', ExpressRouterAdapter.adapt(updateAccountRouter))
}
