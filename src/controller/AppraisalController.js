const {Offers, Employers, Appraisals} = require('../model')
module.exports = {
  listForEmployerUser (req, res) {
    const userId = parseInt(req.params['userId'])
    Employers.findAll({
      where: {
        UserId: userId
      }
    }).then(function (userEmployers) {
      return Offers.findAll({
        where: {
          EmployerId: {
            $in: userEmployers.map(function (employer) {
              return employer.id
            })
          }
        }
      })
    }).then(function (offers) {
      return Appraisals.findAll({
        where: {
          OfferId: {
            $in: offers.map(function (offer) {
              return offer.id
            })
          }
        }
      })
    }).then(function (appraisals) {
      res.send(appraisals)
    })
  },
  add (req, res) {
    const appraisal = req.body
    appraisal.judgeId = req.user.id
    return Appraisals.create(appraisal).then(function (appraisal) {
      res.send(appraisal)
    })
  }
}
