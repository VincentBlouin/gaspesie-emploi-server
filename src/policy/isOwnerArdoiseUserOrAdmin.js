const passport = require('passport')

module.exports = function (req, res, next) {
  passport.authenticate('jwt', function (err, user) {
    if (err || !user || (user.status !== 'admin' && user.status !== 'ardoise' && user.id !== parseInt(req.params['ownerId']))) {
      res.status(401).send(JSON.stringify({
        error: 'you do not have access to this resource'
      }))
    } else {
      req.user = user
      next()
    }
  })(req, res, next)
}
