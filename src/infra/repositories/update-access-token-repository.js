const { ObjectId } = require('mongodb')
const MissingParamError = require('../../utils/errors/missing-param-error')
const MongoHelper = require('../helpers/mongo-connection-helper')

module.exports = class UpdateAccessTokenRepository {
  async update (userId, accessToken) {
    if (!userId) {
      throw new MissingParamError('userId')
    }
    if (!accessToken) {
      throw new MissingParamError('accessToken')
    }
    const userModel = await MongoHelper.getCollection('users')
    await userModel.updateOne({
      _id: new ObjectId(userId)
    }, {
      $set: {
        accessToken
      }
    })
  }
}
