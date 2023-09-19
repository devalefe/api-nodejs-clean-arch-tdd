const express = require('express')
const cors = require('../middlewares/cors')

module.exports = (app) => {
  app.disable('x-powered-by')
  app.use(cors)
  app.use(express.json())
}
