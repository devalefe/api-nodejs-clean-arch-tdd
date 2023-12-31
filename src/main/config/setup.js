const express = require('express')

module.exports = (app) => {
  app.disable('x-powered-by')
  app.use((req, res, next) => {
    res.set('access-control-allow-origin', '*')
    res.set('access-control-allow-methods', '*')
    res.set('access-control-allow-headers', '*')
    next()
  })
  app.use((req, res, next) => {
    res.type('json')
    next()
  })
  app.use(express.json())
}
