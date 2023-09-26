const MissingParamError = require('../../utils/errors/missing-param-error')
const MongoHelper = require('../helpers/mongo-connection-helper')

module.exports = class CreateAccountRepository {
  async create (accountData, accessToken) {
    if (!accountData) {
      throw new MissingParamError('account')
    }
    if (!accessToken) {
      throw new MissingParamError('accessToken')
    }
    const userModel = await MongoHelper.getCollection('users')
    return await userModel.insertOne({
      firstName: accountData.firstName,
      lastName: accountData.lastName,
      phone: accountData.phone,
      email: accountData.email,
      password: accountData.password
    })
  }
}
