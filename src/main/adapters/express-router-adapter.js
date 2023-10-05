module.exports = class ExpressRouterAdapter {
  static adapt (router) {
    return async (req, res) => {
      const httpRequest = {
        headers: req.headers,
        body: req.body
      }
      const httpResponse = await router.route(httpRequest)
      return res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}
