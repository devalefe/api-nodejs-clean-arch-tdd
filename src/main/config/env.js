module.exports = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://dev:devpass@localhost:27017',
  dbName: process.env.DB_NAME || 'e_prester',
  tokenSecret: process.env.TOKEN_SECRET || 'secret',
  hashSalt: Number(process.env.HASH_SALT) || 12,
  port: Number(process.env.PORT) || 5050
}
