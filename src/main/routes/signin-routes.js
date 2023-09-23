const ExpressRouterAdapter = require('../adapters/express-router-adapter')
const SignInRouterComposer = require('../composers/signin-router-composer')

module.exports = (router) => {
  const signInRouter = SignInRouterComposer.compose()
  router.post('/signin', ExpressRouterAdapter.adapt(signInRouter))
}
