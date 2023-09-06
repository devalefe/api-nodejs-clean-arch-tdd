const bcrypt = require('bcrypt')

module.exports = class Encrypter {
  async compare (value, hash) {
    const valueMatch = await bcrypt.compare(value, hash)
    return valueMatch
  }
}
