const path = require('path')
const fs = require('fs')

const bcrypt = require('bcrypt')

const AdminModel = require('../models/AdminModel')
const EmailModel = require('../models/EmailModel')
const EmailActivity = require('../models/EmailActivity')
const StateModel = require('../models/State')
const CityModel = require('../models/City')
const error = require('../models/Error')

// auth
module.exports.loginpage = async (req, res) => {
    try {
        if (req.cookies.login) {
            return res.redirect('/')
        }
        else {
            return res.render('auth/login')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.login = async (req, res) => {
    try {
        return res.redirect('/')
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.Register = async (req, res) => {
    try {
        const State = await StateModel.find({ status: true })
        res.render('auth/Register', { State })
    } catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.ChangPasswordPage = async (req, res) => {
    try {
        return res.render('auth/ChangPassword')
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.ChangPassword = async (req, res) => {
    try {
        let currentpassword = await bcrypt.compare(req.body.current_password, req.user.password)
        if(currentpassword){
            if(req.body.current_password != req.body.password){
                if(req.body.password == req.body.conform_password){
                    req.body.password = await bcrypt.hash(req.body.password,10)
                    let changpassword = await AdminModel.findByIdAndUpdate(req.user.id, { password: req.body.password })
                    if(changpassword){
                        console.log('password chang successfully');
                        return res.redirect('/signout')
                    }else{
                        console.log('password not chang');
                        return res.redirect('back')
                    }
                }else{
                    console.log('password and conform password is not match');
                    return res.redirect('back')
                }
            }else{
                console.log('current and new password is match');
                return res.redirect('back')
            }
        }else{
            console.log('current password is wrong');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.SignOut = async (req, res) => {
    try {
        req.session.destroy(function (err) {
            if (err) {
                return false
            }
            return res.redirect('/')
        })
    } catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}


// admin routes
module.exports.Deshbord = async (req, res) => {
    try {
        //Mail counting
        let CountMail = await EmailModel.find().countDocuments()
        let CountState = await StateModel.find().countDocuments()
        let CountCity = await CityModel.find().countDocuments()

        // Sending Mail
        let today = new Date()
        let Mail = await EmailActivity.find()
        let TodaySend = 0
        Mail.map((item,i)=>{
            if(item.updatedAt.toLocaleDateString() == today.toLocaleDateString()) {
            TodaySend = TodaySend + parseInt(item.today)
            }
        })
        Mail = await EmailActivity.findById(Mail.id)

    const State = await StateModel.find({ status: true })
    return res.render('Deshbord', { user: req.user, CountMail, CountState, CountCity, TodaySend,State })
}
    catch (err) {
    console.log(err);
    return res.redirect('back')
}
}

module.exports.Profile = async (req, res) => {
    try {
        let user = await AdminModel.findById(req.user.id).populate('city').populate('state').exec()
        return res.render('Profile', { user })
    } catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.AddData = async (req, res) => {
    try {
        const State = await StateModel.find({ status: true })

        return res.render('Admin/AddAdmin', { user: req.user, State })
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.InsertAdmin = async (req, res) => {
    try {
        let checkmail = await AdminModel.find({ email: req.body.email }).countDocuments()
        if (checkmail == 0) {
            if (req.body.password == req.body.conform_password) {
                req.body.status = true
                req.body.role = 'user'

                req.body.password = await bcrypt.hash(req.body.password, 10)
                let addadmin = await AdminModel.create(req.body)
                if (addadmin) {
                    await EmailActivity.create({ user: addadmin.id, year: 0, today: 0 })
                    await error.create({ user: addadmin.id, error: 200 })
                    console.log('admin is added');
                    return res.redirect('/signout')
                }
                else {
                    console.log('admin not add');
                    return res.redirect('/')
                }
            }
            else {
                console.log('password is not match');
                return res.redirect('back')
            }
        }
        else {
            console.log('email is alredy register');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.ViewAdmin = async (req, res) => {
    try {
        let AdminData = await AdminModel.find()

        for (i = 0; i < AdminData.length; i++) {
            AdminData[i].err = (await error.find({ user: AdminData[i].id }))[0].error
        }

        return res.render('Admin/ViewAdmin', {
            user: req.user,
            AdminData
        })
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}


module.exports.DeleteAdmin = async (req, res) => {
    try {
        try{
            let singledata = await AdminModel.findById(req.query.id)
            let oldpath = ''
            if (singledata.image) {
                oldpath = path.join(__dirname, '..', singledata.image);
                await fs.unlinkSync(oldpath)
            }
        }catch(err){
            console.log('something wrong');
        }

        let DeleteAdmin = await AdminModel.findByIdAndDelete(req.query.id)
        if (DeleteAdmin) {
            console.log('Delete Admin');
            return res.redirect('back')
        } else {
            console.log('Admin not Delete');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.AdminStatus = async (req, res) => {
    try {
        let status = true
        if (req.query) {
            status = req.query.status
        }

        let ChangStatus = await AdminModel.findByIdAndUpdate(req.query.id, { status: status })
        if (ChangStatus) {
            console.log('Admin status chang');
            return res.redirect('back')
        } else {
            console.log('Admin Status not Chang');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.SetError = async (req, res) => {
    try {
        await error.updateOne({ user: req.query.id }, { error: parseInt(req.query.port) })
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}