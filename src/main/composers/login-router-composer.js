const AuthUseCase = require('../../domain/auth-usecase')
const LoginRouter = require('../../presentation/routers/login-router')
const EmailValidator = require('../../utils/helpers/email-validator')
const TokenGenerator = require('../../utils/helpers/token-generator')
const Encrypter = require('../../utils/helpers/encrypter')
const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const UpdateAccessTokenRepository = require('../../infra/repositories/update-access-token-repository')
const { tokenSecret } = require('../config/env')

const encrypter = new Encrypter()
const tokenGenerator = new TokenGenerator(tokenSecret)
const loadUserByEmailRepository = new LoadUserByEmailRepository()
const updateAccessTokenRepository = new UpdateAccessTokenRepository()
const authUseCase = new AuthUseCase({
  loadUserByEmailRepository,
  updateAccessTokenRepository,
  tokenGenerator,
  encrypter
})
const emailValidator = new EmailValidator()
const loginRouter = new LoginRouter({
  authUseCase,
  emailValidator
})

module.exports = loginRouter
