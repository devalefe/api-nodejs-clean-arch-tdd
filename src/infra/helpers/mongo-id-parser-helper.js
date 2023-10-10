const { ObjectId } = require('mongodb')

module.exports = (id) => {
  try {
    return new ObjectId(id)
  } catch (error) {
    return undefined
  }
}
