const TokenValidator = require('../../../modules/@shared/utils/helpers/token-validator')
const AuthValidator = require('../../middlewares/auth-validator')
const ExpressRouterAdapter = require('../../adapters/express-router-adapter')
const FindAccountRouterComposer = require('./composers/find')
const UpdateAccountRouterComposer = require('./composers/update')
const { tokenSecret } = require('../../config/env')

module.exports = (router) => {
  const tokenValidator = new TokenValidator(tokenSecret)
  const findAccountRouter = FindAccountRouterComposer.compose()
  const updateAccountRouter = UpdateAccountRouterComposer.compose()
  router.get('/account', AuthValidator.validate(tokenValidator), ExpressRouterAdapter.adapt(findAccountRouter))
  router.put('/account', AuthValidator.validate(tokenValidator), ExpressRouterAdapter.adapt(updateAccountRouter))
}
