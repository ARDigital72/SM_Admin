const express = require('express')

const routes = express.Router()

const functionalityCtrl = require('../controlers/Functionality')

const StateModel = require('../models/State')

// routes.get('/', functionalityCtrl.addstateforall)

//State
routes.get('/addstatepage',(req,res)=>{
    res.render('area/CreateState',{user: req.user})
})

routes.post('/addstate',functionalityCtrl.AddState)

routes.get('/viewstate', functionalityCtrl.ViewState)

routes.get('/updatestatepage',functionalityCtrl.UpdateStatePage)

routes.post('/editstate',functionalityCtrl.UpdateState)

routes.get('/deletestate',functionalityCtrl.DeleteState)

routes.get('/sstatus',functionalityCtrl.SStatus)


//city
routes.get('/addcitypage', async (req, res) => {
    let state = await StateModel.find({ status: true })
    res.render('area/CreateCity', {
        user: req.user,
        state
    })
})
routes.post('/addcity', functionalityCtrl.AddCity)

routes.get('/viewcity', functionalityCtrl.ViewCity)

routes.get('/updatecitypage',functionalityCtrl.UpdateCityPage)

routes.post('/editcity',functionalityCtrl.UpdateCity)

routes.get('/deletecity',functionalityCtrl.DeleteCity)

routes.get('/cstatus',functionalityCtrl.CStatus)

module.exports = routes