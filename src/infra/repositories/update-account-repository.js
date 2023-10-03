const { ObjectId } = require('mongodb')
const { MissingParamError } = require('../../utils/errors')
const MongoHelper = require('../helpers/mongo-connection-helper')

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
      _id: new ObjectId(accountId)
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
