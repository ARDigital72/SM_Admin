const AdminModel = require('../models/AdminModel')
const EmailModel = require('../models/EmailModel')
const EmailActivity = require('../models/EmailActivity')
const StateModle = require('../models/State')
const CityModle = require('../models/City')

// const ExtraCounting = require('../models/ExtraCounting')
const nodemailer = require("nodemailer");
const Email = require('../models/EmailModel');


// add Mail Adress
module.exports.AddMailPage = async (req, res) => {
    try {
        let State = await StateModle.find({ status: true })

        return res.render('Mail/AddMail', {
            user: req.user,
            State
        })
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.AddMail = async (req, res) => {
    try {
        // let abc = ['arpitguna150@gmail.com', 'arpitguna150@gmail.com', 'arpitguna150@gmail.com']

        // abc = [...new Set(abc)]

        // abc.map(async (item, i) => {
        //     let Data = {
        //         email: item,
        //         state: req.body.state,
        //         city: req.body.city
        //     }
        //     let EmailData = await EmailModel.create(Data)
        // })

        let EmailData = await EmailModel.create(req.body)
        if (EmailData) {
            console.log('Email add succesfully');
            return res.redirect('back')
        } else {
            console.log('something wrong');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.ViewEmail = async (req, res) => {
    try {
        let TotalEmail = await EmailModel.find().countDocuments()

        let per_page = 1500
        let page = 1
        let totalPage = Math.ceil(TotalEmail / per_page)

        if (req.query.page) {
            page = req.query.page
        }


        let EmailData = await EmailModel.find().skip((page - 1) * per_page).limit(per_page).populate('city').populate('state').exec()

        return res.render('Mail/Viewmail', {
            user: req.user, EmailData, totalPage, page, per_page
        })
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.DeleteMail = async (req, res) => {
    try {
        let DeleteAdmin = await EmailModel.findByIdAndDelete(req.query.id)
        if (DeleteAdmin) {
            console.log('delete admin');
            return res.redirect('back')
        }
        else {
            console.log('something wrong');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

//ajex

module.exports.FindCity = async (req, res) => {
    let City = await CityModle.find({ state: req.query.State, status: true }).populate('state').exec()
    let options = `<option>--select city--</option>`
    City.map((item, i) => {
        options += `<option value=${item.id}>${item.city}</option>`
    })

    return res.json(options)
}

module.exports.NumberOfMail = async (req, res) => {
    let CountMail = await EmailModel.countDocuments({ city: req.query.City, state: req.query.State }).populate('city').populate('state').exec()
    return res.json(CountMail)
}