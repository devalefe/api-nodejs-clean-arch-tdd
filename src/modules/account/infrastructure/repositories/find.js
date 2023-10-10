const { MissingParamError } = require('../../../@shared/utils/errors')
const MongoHelper = require('../../../@shared/infrastructure/helpers/mongo-connection-helper')
const parseId = require('../../../@shared/infrastructure/helpers/mongo-id-parser-helper')

module.exports = class LoadUserByIdRepository {
  async load (id) {
    if (!id) {
      throw new MissingParamError('id')
    }
    const userModel = await MongoHelper.getCollection('users')
    const user = await userModel.findOne({
      _id: parseId(id)
    })
    if (user) {
      const parsedData = Object.assign({}, user, { id: user._id.toString() })
      delete parsedData._id
      return parsedData
    }
    return null
  }
}
