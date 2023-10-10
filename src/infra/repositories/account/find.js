const { MissingParamError } = require('../../../utils/errors')
const MongoHelper = require('../../helpers/mongo-connection-helper')

module.exports = class LoadUserByIdRepository {
  async load (id) {
    if (!id) {
      throw new MissingParamError('id')
    }
    const userModel = await MongoHelper.getCollection('users')
    const user = await userModel.findOne({ _id: id })
    if (user) {
      const parsedData = Object.assign({}, user, { id: user._id.toString() })
      delete parsedData._id
      return parsedData
    }
    return null
  }
}
