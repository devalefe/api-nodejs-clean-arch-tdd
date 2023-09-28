module.exports = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://dev:devpass@localhost:27017',
  dbName: 'e_prester',
  tokenSecret: process.env.TOKEN_SECRET || 'secret',
  hashSalt: 12,
  port: process.env.PORT || 5050
}
