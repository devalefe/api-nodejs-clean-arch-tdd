const SignInUseCase = require('../../domain/usecases/auth/signin')
const SignInRouter = require('../../presentation/routers/auth/signin')
const EmailValidator = require('../../utils/validators/email-validator')
const TokenGenerator = require('../../utils/helpers/token-generator')
const Encrypter = require('../../utils/helpers/encrypter')
const LoadUserByEmailRepository = require('../../infra/repositories/account/load-by-email')
const UpdateAccessTokenRepository = require('../../infra/repositories/account/update-access-token')
const { tokenSecret } = require('../config/env')

module.exports = class SignInRouterComposer {
  static compose () {
    const encrypter = new Encrypter()
    const tokenGenerator = new TokenGenerator(tokenSecret)
    const loadUserByEmailRepository = new LoadUserByEmailRepository()
    const updateAccessTokenRepository = new UpdateAccessTokenRepository()
    const signInUseCase = new SignInUseCase({
      loadUserByEmailRepository,
      updateAccessTokenRepository,
      tokenGenerator,
      encrypter
    })
    const emailValidator = new EmailValidator()
    const signInRouter = new SignInRouter({
      signInUseCase,
      emailValidator
    })
    return signInRouter
  }
}
