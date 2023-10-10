const SignUpUseCase = require('../../../../domain/usecases/auth/signup')
const SignUpValidator = require('../../../../utils/validators/signup-validator')
const SignUpRouter = require('../../../../presentation/routers/auth/signup')
const TokenGenerator = require('../../../../utils/helpers/token-generator')
const Encrypter = require('../../../../utils/helpers/encrypter')
const LoadUserByEmailRepository = require('../../../../infra/repositories/account/load-by-email')
const CreateAccountRepository = require('../../../../infra/repositories/account/create')
const UpdateAccessTokenRepository = require('../../../../infra/repositories/account/update-access-token')
const { tokenSecret, hashSalt } = require('../../../config/env')

module.exports = class SignUpRouterComposer {
  static compose () {
    const encrypter = new Encrypter(hashSalt)
    const tokenGenerator = new TokenGenerator(tokenSecret)
    const loadUserByEmailRepository = new LoadUserByEmailRepository()
    const updateAccessTokenRepository = new UpdateAccessTokenRepository()
    const createAccountRepository = new CreateAccountRepository()
    const signUpUseCase = new SignUpUseCase({
      loadUserByEmailRepository,
      updateAccessTokenRepository,
      createAccountRepository,
      tokenGenerator,
      encrypter
    })
    const signUpValidator = new SignUpValidator()
    const signUpRouter = new SignUpRouter({
      signUpUseCase,
      signUpValidator
    })
    return signUpRouter
  }
}
