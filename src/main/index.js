const MongoHelper = require('../modules/@shared/infrastructure/helpers/mongo-connection-helper')
const { mongoUrl, dbName, port } = require('./config/env')

MongoHelper.connect(mongoUrl, dbName)
  .then(() => {
    const app = require('./config/app')
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`))
  })
  .catch(console.error)
