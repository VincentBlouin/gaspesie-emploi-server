const config = require('../config')
config.setEnvironment('development')
const Promise = require('bluebird')
const {
    sequelize,
    Users,
    Employers,
    Offers,
    Appraisals
} = require('../model')

const users = require('./Users.json')
const employers = require('./Employer.json')
const offers = require('./Offers.json')
const appraisals = require('./Appraisals.json')

module.exports = {
  run: function () {
    return sequelize.sync({force: true})
            .then(() => {
              return Promise.all(
                    users.map(user => {
                      return Users.create(user)
                    })
                )
            }).then(() => {
              return Promise.all(
                employers.map(employer => {
                  return Employers.create(employer)
                })
            )
            }).then(() => {
              return Promise.all(
                    offers.map(offer => {
                      return Offers.create(offer)
                    })
                )
            }).then(() => {
              return Promise.all(
                    appraisals.map(appraisal => {
                      return Appraisals.create(appraisal)
                    })
                )
            }).catch(function (err) {
              console.log(err)
            })
  }
}
