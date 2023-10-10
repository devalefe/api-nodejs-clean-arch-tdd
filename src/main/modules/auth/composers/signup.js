const SignUpUseCase = require('../../../../modules/auth/domain/usecases/signup')
const SignUpRouter = require('../../../../modules/auth/presentation/routers/signup')
const SignUpValidator = require('../../../../utils/validators/signup-validator')
const TokenGenerator = require('../../../../utils/helpers/token-generator')
const Encrypter = require('../../../../utils/helpers/encrypter')
const CreateAccountRepository = require('../../../../modules/account/infrastructure/repositories/create')
const LoadUserByEmailRepository = require('../../../../infrastructure/repositories/account/load-by-email')
const UpdateAccessTokenRepository = require('../../../../infrastructure/repositories/account/update-access-token')
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
