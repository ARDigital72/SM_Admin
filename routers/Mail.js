const express = require('express')

const passport = require('passport')

const routes = express.Router()

const SendMailCtrl = require('../controlers/Mail')

routes.get('/', passport.checkAuthUser, SendMailCtrl.ViewEmail)

routes.get('/addemailpage', passport.checkAuthUser, SendMailCtrl.AddMailPage)

routes.post('/addmail', passport.checkAuthUser, SendMailCtrl.AddMail)

routes.get('/viewemail', passport.checkAuthUser, SendMailCtrl.ViewEmail)

routes.get('/deletemail', passport.checkAuthUser, SendMailCtrl.DeleteMail)


// ajex
routes.get('/findcity', SendMailCtrl.FindCity)
routes.get('/numberofcity', SendMailCtrl.NumberOfMail)

module.exports = routes