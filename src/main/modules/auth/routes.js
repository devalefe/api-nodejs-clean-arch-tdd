const ExpressRouterAdapter = require('../../adapters/express-router-adapter')
const SignInRouterComposer = require('./composers/signin')
const SignUpRouterComposer = require('./composers/signup')

module.exports = (router) => {
  const signInRouter = SignInRouterComposer.compose()
  const signUpRouter = SignUpRouterComposer.compose()
  router.post('/signin', ExpressRouterAdapter.adapt(signInRouter))
  router.post('/signup', ExpressRouterAdapter.adapt(signUpRouter))
}
