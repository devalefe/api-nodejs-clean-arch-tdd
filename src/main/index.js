const MongoHelper = require('../infra/helpers/mongo-connection-helper')
const { mongoUrl } = require('./config/env')

console.log(mongoUrl)

MongoHelper.connect(mongoUrl, '')
  .then(() => {
    const app = require('./config/app')
    app.listen(5050, () => console.log('Server running'))
  })
  .catch(console.error)
