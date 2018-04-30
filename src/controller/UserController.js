const {Users} = require('../model')

module.exports = {
  changeLocale (req, res) {
    const userId = parseInt(req.params['ownerId'])
    const locale = req.body.locale
    if (!userId || !locale) {
      return res.sendStatus(400)
    }
    Users.findOne({
      where: {
        id: userId
      }
    }).then(function (user) {
      user.locale = locale
      return user.save()
    }).then(function () {
      res.sendStatus(200)
    })
  },
  list (req, res) {
    return Users.findAll({
      attributes: ['id', 'firstName', 'lastName', 'status', 'createdAt']
    }).then(function (users) {
      res.send(users)
    })
  },
  listCandidates (req, res) {
    return Users.findAll({
      where: {
        status: 'recruitee'
      },
      attributes: ['id', 'firstName', 'lastName', 'status', 'candidateProfile', 'telephone', 'email', 'createdAt']
    }).then(function (users) {
      res.send(users)
    })
  },
  getUserDetails (req, res) {
    const userId = parseInt(req.params['userId'])
    return Users.findOne({
      where: {
        id: userId
      },
      attributes: ['id', 'email', 'firstName', 'lastName', 'status', 'telephone', 'candidateProfile']
    }).then(function (client) {
      res.send(client)
    })
  },
  createClient (req, res) {
    const client = req.body
    client.status = 'subscribed'
    return Users.create({
      email: client.email,
      firstName: client.firstName,
      lastName: client.lastName,
      ardoiseIdentifier: client.ardoiseIdentifier,
      status: client.status,
      locale: client.locale
    }).then(function (client) {
      res.send(client)
    })
  },
  updateUser (req, res) {
    const user = req.body
    return Users.update({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      candidateProfile: user.candidateProfile
    }, {
      where: {
        id: user.id
      }
    }).then(function (client) {
      res.send(client)
    })
  }
}
