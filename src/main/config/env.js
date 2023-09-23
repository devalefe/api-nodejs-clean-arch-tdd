module.exports = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://dev:dev@localhost:27017',
  dbName: 'e_prester',
  tokenSecret: process.env.TOKEN_SECRET || 'secret',
  port: process.env.PORT || 5050
}
