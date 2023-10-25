const { MissingParamError } = require('../../../@shared/utils/errors')
const MongoHelper = require('../../../@shared/infrastructure/helpers/mongo-connection-helper')
const parseId = require('../../../@shared/infrastructure/helpers/mongo-id-parser-helper')

module.exports = class UpdateAccountRepository {
  async update (accountId, accountData) {
    if (!accountId) {
      throw new MissingParamError('accountId')
    }
    if (!accountData) {
      throw new MissingParamError('accountData')
    }
    const accountModel = await MongoHelper.getCollection('users')
    const result = await accountModel.updateOne({
      _id: parseId(accountId)
    }, {
      $set: {
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        phone: accountData.phone,
        email: accountData.email
      }
    })
    return result.modifiedCount
  }
}
