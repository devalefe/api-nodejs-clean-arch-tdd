const ExpressRouterAdapter = require('../adapters/express-router-adapter')
const SignUpRouterComposer = require('../composers/signup-router-composer')

module.exports = (router) => {
  const signUpRouter = SignUpRouterComposer.compose()
  router.post('/signup', ExpressRouterAdapter.adapt(signUpRouter))
}
