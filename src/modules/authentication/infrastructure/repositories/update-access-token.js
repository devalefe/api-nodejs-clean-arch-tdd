const { MissingParamError } = require('../../../../modules/@shared/utils/errors')
const MongoHelper = require('../../../../modules/@shared/infrastructure/helpers/mongo-connection-helper')
const parseId = require('../../../../modules/@shared/infrastructure/helpers/mongo-id-parser-helper')

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
      _id: parseId(userId)
    }, {
      $set: {
        accessToken
      }
    })
  }
}
