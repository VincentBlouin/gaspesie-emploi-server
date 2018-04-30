const passport = require('passport')

module.exports = function (req, res, next) {
  passport.authenticate('jwt', function (err, user) {
    if (err || !user || user.status !== 'ardoise') {
      res.status(401).send({
        error: 'you do not have access to this resource'
      })
    } else {
      req.user = user
      next()
    }
  })(req, res, next)
}
