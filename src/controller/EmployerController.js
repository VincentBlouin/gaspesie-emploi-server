const {Employers} = require('../model')
module.exports = {
  list (req, res) {
    return Employers.findAll().then(function (employers) {
      res.send(employers)
    })
  }
  // add (req, res) {
  //   return Offers.create(req.body).then(function (offer) {
  //     res.send(offer)
  //   })
  // },
  // edit (req, res) {
  //   const offer = req.body
  //   Offers.update({
  //     title: offer.title,
  //     employer: offer.employer,
  //     dateOfHiring: offer.dateOfHiring,
  //     salary: offer.salary,
  //     hoursType: offer.hoursType,
  //     type: offer.hoursType,
  //     nbHours: offer.nbHours,
  //     requirements: offer.requirements,
  //     detail: offer.details
  //   }, {
  //     where: {
  //       id: offer.id
  //     }
  //   }).then(function (offer) {
  //     res.send(offer)
  //   })
  // },
  // get (req, res) {
  //   const offerId = parseInt(req.params['offerId'])
  //   return Offers.findOne({
  //     where: {
  //       id: offerId
  //     }
  //   }).then(function (offer) {
  //     res.send(offer)
  //   })
  // }
}
