function response(res, status, message="", params) {
  return res.status(status).json({
    message: message,
    ...params,
  })
}

module.exports = response