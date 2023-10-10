const { MissingParamError } = require('../../../@shared/utils/errors')
const MongoHelper = require('../../../@shared/infrastructure/helpers/mongo-connection-helper')

module.exports = class CreateAccountRepository {
  async create (accountData) {
    if (!accountData) {
      throw new MissingParamError('accountData')
    }
    const userModel = await MongoHelper.getCollection('users')
    const account = await userModel.insertOne({
      firstName: accountData.firstName,
      lastName: accountData.lastName,
      phone: accountData.phone,
      email: accountData.email,
      password: accountData.password
    })

    return Object.assign({}, account, { id: account.insertedId })
  }
}
