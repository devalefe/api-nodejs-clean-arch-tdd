const ExpressRouterAdapter = require('../adapters/express-router-adapter')
const SignUpRouterComposer = require('../composers/auth/signup')

module.exports = (router) => {
  const signUpRouter = SignUpRouterComposer.compose()
  router.post('/signup', ExpressRouterAdapter.adapt(signUpRouter))
}
