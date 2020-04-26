class AppError extends Error {
  constructor (msg) {
    super(msg)
  }
}

module.exports = { AppError }
