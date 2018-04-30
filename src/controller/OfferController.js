const {Offers, Employers, Appraisals} = require('../model')
module.exports = {
  listAvailable (req, res) {
    return Offers.findAll({
      include: [{
        model: Employers
      }, {
        required: false,
        model: Appraisals,
        // where: {
        //   $or: [{
        //     judgeId: req.user.id,
        //     subjectId: req.user.id
        //   }]
        // },
        as: 'appraisals'
      }]
    }).then(function (offers) {
      res.send(offers.map(function (offer) {
        offer.appraisals.filter(function (appraisal) {
          return [
            appraisal.judgeId,
            appraisal.subjectId
          ].indexOf(req.user.id) !== -1
        })
        return offer
      }))
    })
  },
  add (req, res) {
    return Offers.create(req.body).then(function (offer) {
      res.send(offer)
    })
  },
  edit (req, res) {
    const offer = req.body
    Offers.update({
      title: offer.title,
      employer: offer.employer,
      dateOfHiring: offer.dateOfHiring,
      salary: offer.salary,
      hoursType: offer.hoursType,
      type: offer.hoursType,
      nbHours: offer.nbHours,
      requirements: offer.requirements,
      detail: offer.details,
      EmployerId: offer.EmployerId
    }, {
      where: {
        id: offer.id
      }
    }).then(function (offer) {
      res.send(offer)
    })
  },
  get (req, res) {
    const offerId = parseInt(req.params['offerId'])
    return Offers.findOne({
      where: {
        id: offerId
      }
    }).then(function (offer) {
      res.send(offer)
    })
  },
  listForUser (req, res) {
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
      res.send(offers)
    })
  }
}
