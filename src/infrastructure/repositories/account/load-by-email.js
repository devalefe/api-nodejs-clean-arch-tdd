const MissingParamError = require('../../../utils/errors/missing-param-error')
const MongoHelper = require('../../helpers/mongo-connection-helper')

module.exports = class LoadUserByEmailRepository {
  async load (email) {
    if (!email) {
      throw new MissingParamError('email')
    }
    const userModel = await MongoHelper.getCollection('users')
    const user = await userModel.findOne({
      email
    }, {
      projection: {
        password: true
      }
    })
    if (user) {
      const parsedData = Object.assign({}, user, { id: user._id.toString() })
      delete parsedData._id
      return parsedData
    }
    return null
  }
}
