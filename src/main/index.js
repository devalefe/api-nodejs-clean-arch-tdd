const MongoHelper = require('../infra/helpers/mongo-connection-helper')
const { mongoUrl, dbName, port } = require('./config/env')

console.log(mongoUrl)

MongoHelper.connect(mongoUrl, dbName)
  .then(() => {
    const app = require('./config/app')
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`))
  })
  .catch(console.error)
