const ExpressRouterAdapter = require('../adapters/express-router-adapter')
const SignInRouterComposer = require('../composers/auth/signin')

module.exports = (router) => {
  const signInRouter = SignInRouterComposer.compose()
  router.post('/signin', ExpressRouterAdapter.adapt(signInRouter))
}
