const express = require('express')
const router = express.Router()
const AuthenticationController = require('../controller/AuthenticationController')
const AuthenticationControllerPolicy = require('../policy/AuthenticationControllerPolicy')

const UserController = require('../controller/UserController')
const OfferController = require('../controller/OfferController')
const EmployerController = require('../controller/EmployerController')
const AppraisalController = require('../controller/AppraisalController')

const isAuthenticated = require('../policy/isAuthenticated')
const isOwnerOrAdmin = require('../policy/isOwnerOrAdmin')
const isArdoiseUser = require('../policy/isArdoiseUser')
const isOwnerArdoiseUserOrAdmin = require('../policy/isOwnerArdoiseUserOrAdmin')
const isAdmin = require('../policy/isAdmin')

router.post(
    '/register',
    AuthenticationControllerPolicy.register,
    AuthenticationController.register
)
router.post(
    '/login',
    AuthenticationController.login
)

router.post(
    '/login/ardoise',
    AuthenticationController.ardoiseLogin
)

router.post(
    '/reset-password',
    AuthenticationController.resetPassword
)

router.post(
    '/token-valid',
    AuthenticationController.isTokenValid
)

router.post(
    '/change-password',
    AuthenticationController.changePassword
)

router.post(
    '/email-exists',
    AuthenticationController.emailExists
)

router.post(
    '/user/:ownerId/locale',
    isOwnerOrAdmin,
    UserController.changeLocale
)

router.get(
    '/users',
    isAdmin,
    UserController.list
)

// router.post(
//     '/users',
//     isAdmin,
//     UserController.createClient
// )

router.put(
    '/users',
    isAdmin,
    UserController.updateUser
)

router.get(
    '/users/:userId',
    isAdmin,
    UserController.getUserDetails
)

router.get(
    '/candidates',
    isAuthenticated,
    UserController.listCandidates
)

router.get(
    '/offers',
    isAuthenticated,
    OfferController.listAvailable
)

router.post(
    '/offers',
    isAdmin,
    OfferController.add
)

router.put(
    '/offers/:offerId',
    isAdmin,
    OfferController.edit
)

router.get(
    '/offers/:offerId',
    isAuthenticated,
    OfferController.get
)

router.get(
    '/user-offers/:userId',
    isAuthenticated,
    OfferController.listForUser
)

router.get(
    '/employers',
    isAdmin,
    EmployerController.list
)

router.get(
    '/user-employer-appraisals/:userId',
    isAuthenticated,
    AppraisalController.listForEmployerUser
)

router.post(
    '/appraisals',
    isAuthenticated,
    AppraisalController.add
)

module.exports = router
