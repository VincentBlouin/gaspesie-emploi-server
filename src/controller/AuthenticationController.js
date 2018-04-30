const {Users} = require('../model')
const jwt = require('jsonwebtoken')
const config = require('../config')
const crypto = require('crypto')
const sprintf = require('sprintf-js').sprintf
const EmailClient = require('../EmailClient')

const resetPasswordEn = {
  from: 'noreply@app.potagerspartages.ca',
  subject: 'Change your password',
  content: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.<br><br>' +
  'Please click on the following link, or paste this into your browser to continue the process:<br><br>' +
  '%s/change-password/%s<br><br>' +
  'If you did not request this, please ignore this email and your password will remain unchanged.<br><br>'
}

const resetPasswordFr = {
  from: 'nepasrepondre@app.potagerspartages.ca',
  subject: 'Modifier votre mot de passe',
  content: 'Vous reçevez ce courriel, parce que vous (ou quelqu\'un d\'autre) a demandé la réinitialisation du mot de passe de votre compte.<br><br>' +
  'Cliquez sur le lien suivant, ou coller le dans votre navigateur pour poursuivre le processus:<br><br>' +
  '%s/change-password/%s<br><br>' +
  'Si vous n\'avez pas fait cette demande, ignorez ce courriel et votre mot de passe demeurera inchangé.<br>'
}
const ONE_YEAR = 60 * 60 * 24 * 7 * 12

function jwtSignUser (user) {
  return jwt.sign(user, config.getConfig().authentication.jwtSecret, {
    expiresIn: ONE_YEAR
  })
}

module.exports = {
  register (req, res) {
    return Users.create(req.body).then(function (user) {
      const userJson = user.toJSON()
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    }).catch(function (err) {
      console.log(err)
      res.status(400).send({
        error: 'This account is already in use'
      })
    })
  },
  login (req, res) {
    const {email, password} = req.body
    if (!password || password.trim() === '') {
      return res.status(403)
    }
    let user
    return Users.findOne({
      where: {
        email: email
      }
    }).then(function (_user) {
      user = _user
      if (!user) {
        return res.status(403).send({
          error: 'Login information is incorrect'
        })
      }
      return user.comparePassword(password)
    }).then(function (isPasswordValid) {
      if (!isPasswordValid) {
        return res.status(403).send({
          error: 'Login information is incorrect'
        })
      }
      res.send({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          status: user.status
        },
        token: jwtSignUser(user.toJSON())
      })
    }).catch(function (err) {
      console.log(err)
      return res.status(500).send({
        error: 'An error has occured trying to login'
      })
    })
  },
  ardoiseLogin: function (req, res) {
    const ardoiseIdentifier = req.body.ardoiseIdentifier
    if (!ardoiseIdentifier) {
      return res.status(400)
    }
    Users.findOne({
      where: {
        'status': 'subscribed',
        'ardoiseIdentifier': ardoiseIdentifier
      },
      attributes: ['id', 'firstName', 'lastName', 'locale']
    }).then(function (user) {
      if (!user) {
        return res.status(403).send({
          error: 'Login information is incorrect'
        })
      }
      return res.send(user)
    })
  },
  resetPassword (req, res) {
    const {email, locale} = req.body
    const token = crypto.randomBytes(32).toString('hex')
    return Users.findOne({
      where: {
        email: email
      }
    }).then(function (user) {
      if (!user) {
        return res.sendStatus(200)
      }
      user.resetPasswordToken = token
      user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
      return user.save()
    }).then(function () {
      const emailText = locale === 'fr' ? resetPasswordFr : resetPasswordEn
      const emailContent = {
        from: EmailClient.buildFrom(emailText.from),
        to: email,
        subject: emailText.subject,
        html: sprintf(emailText.content, config.getConfig().baseUrl, token)
      }
      EmailClient.addEmailNumber(emailContent, locale, '7401e739')
      return EmailClient.send(emailContent)
    }).then(function () {
      res.sendStatus(200)
    }).catch(function (error) {
      console.log(error)
      return res.status(500).send({
        error: 'An error has occured trying to send reset password'
      })
    })
  },
  isTokenValid: function (req, res) {
    Users.findOne({
      where: {
        resetPasswordToken: req.body.token,
        resetPasswordExpires: {$gt: Date.now()}
      }
    }).then(function (user) {
      return res.sendStatus(
        user ? 200 : 403
      )
    }).catch(function (err) {
      console.log(err)
      res.status(500).send({
        error: 'error'
      })
    })
  },
  changePassword: function (req, res) {
    const {token, newPassword} = req.body
    if (!token) {
      return res.sendStatus(
        403
      )
    }
    Users.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {$gt: Date.now()}
      }
    }).then(function (user) {
      if (!user) {
        return res.sendStatus(
          403
        )
      }
      user.password = newPassword
      user.resetPasswordToken = null
      user.resetPasswordExpires = null
      return user.save()
    }).then(function () {
      return res.sendStatus(
        200
      )
    }).catch(function (err) {
      console.log(err)
      res.status(500).send({
        error: 'error'
      })
    })
  },
  emailExists: function (req, res) {
    const {email} = req.body
    if (!email) {
      return res.sendStatus(
        403
      )
    }
    Users.findOne({
      where: {
        email: email
      },
      attributes: ['email', 'id', 'locale', 'firstName', 'lastName']
    }).then(function (user) {
      if (!user) {
        return res.sendStatus(
          204
        )
      }
      res.send(
        user
      )
    }).catch(function (err) {
      console.log(err)
      res.status(500).send({
        error: 'error'
      })
    })
  }
}
