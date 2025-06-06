const StateModel = require('../models/State')
const CityModel = require('../models/City')
const EmailModel = require('../models/EmailModel')


//state
// module.exports.addstateforall = async (req, res) => {
//     try {
//         const indiaStates = [
//             "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
//             "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
//             "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
//             "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
//             "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
//             "Uttar Pradesh", "Uttarakhand", "West Bengal"
//         ];


//         indiaStates.map(async (item, i) => {
//             let checkState = await StateModel.find({ state: item }).countDocuments()
//             if (!checkState) {
//                 let CreateState = await StateModel.create({ state: item, status: true })
//                 if (CreateState) {
//                     console.log('state add successfully');
//                 }
//                 else {
//                     console.log('something wrong');
//                 }
//             }
//             else {
//                 console.log('state alredy created');
//             }
//         })

//         return res.redirect('back')

//     }
//     catch (err) {
//         console.log(err);
//         return res.redirect('back')
//     }
// }

// module.exports.AddCity = async (req, res) => {
//     try {
//         const allDistricts = [
//             "Ahmedabad",
//             "Amreli",
//             "Anand",
//             "Aravalli",
//             "Banaskantha",
//             "Bharuch",
//             "Bhavnagar",
//             "Botad",
//             "Chhota Udaipur",
//             "Dahod",
//             "Dang",
//             "Devbhoomi Dwarka",
//             "Gandhinagar",
//             "Gir Somnath",
//             "Jamnagar",
//             "Junagadh",
//             "Kheda",
//             "Kutch",
//             "Mahisagar",
//             "Mehsana",
//             "Morbi",
//             "Narmada",
//             "Navsari",
//             "Panchmahal",
//             "Patan",
//             "Porbandar",
//             "Rajkot",
//             "Sabarkantha",
//             "Surat",
//             "Surendranagar",
//             "Tapi",
//             "Vadodara",
//             "Valsad"
//         ];

//         for(i=0;i<allDistricts.length;i++){
//             console.log(allDistricts[i],'==' ,i);
//             req.body.city = allDistricts[i]

//             let CreateCity = await CityModel.create(req.body)
//             if (CreateCity) {
//                 let allstatecity = await StateModel.findById(req.body.state)
//                 addcity = allstatecity.city
//                 addcity.push(CreateCity.id)

//                 await StateModel.findByIdAndUpdate(req.body.state, { city: addcity })

//                 console.log('City add successfully');
//             }
//             else {
//                 console.log('City alredy created');
//                 // return res.redirect('back')
//             }
//         }
//         console.log('complate');
//     }
//     catch (err) {
//         console.log(err);
//         return res.redirect('back')
//     }
// }


module.exports.AddState = async (req, res) => {
    try {
        let checkState = await StateModel.find({ state: req.body.state }).countDocuments()
        if (!checkState) {
            req.body.status = true
            let CreateState = await StateModel.create(req.body)
            if (CreateState) {
                console.log('state add successfully');
                return res.redirect('/fun/viewstate')
            }
            else {
                console.log('something wrong');
                return res.redirect('back')
            }
        }
        else {
            console.log('state alredy created');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.ViewState = async (req, res) => {
    try {
        let state = await StateModel.find()
        let email = await EmailModel.find().populate('city').populate('state').exec()
        state.forEach((item, i) => {
            let NumberOfMail = 0
            email.forEach(eitem => {
                if (item.id == eitem.state.id) {
                    NumberOfMail++;
                }
            })
            state[i].mail =NumberOfMail
        });
        await res.render('area/state', {
            user: req.user, state
        })
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.UpdateStatePage = async (req, res) => {
    try {
        let StateData = await StateModel.findById(req.query.id)
        return res.render('area/editstate', {
            user: req.user,
            StateData
        })
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.UpdateState = async (req, res) => {
    try {
        let UpdateState = await StateModel.findByIdAndUpdate(req.body.id, req.body)
        if (UpdateState) {
            console.log('Update successfully');
            return res.redirect('/fun/viewstate')
        } else {
            console.log('Not Updated');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.DeleteState = async (req, res) => {
    try {
        await EmailModel.deleteMany({ state: { $in: req.query.id } })
        await CityModel.deleteMany({ state: { $in: req.query.id } })

        let DeleteState = await StateModel.findByIdAndDelete(req.query.id)
        if (DeleteState) {
            console.log('Delete State');
            return res.redirect('back')
        }
        else {
            console.log('not Delete State');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.SStatus = async (req, res) => {
    try {
        let status = true
        if (req.query) {
            status = req.query.status
        }
        let ChangStatus = await StateModel.findByIdAndUpdate(req.query.id, { status: status })

        if (ChangStatus) {
            console.log('State status chang');
            return res.redirect('back')
        } else {
            console.log('State Status not Chang');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}


//city
module.exports.AddCity = async (req, res) => {
    try {
        let CreateCity = await CityModel.create(req.body)
        if (CreateCity) {
            let allstatecity = await StateModel.findById(req.body.state)
            addcity = allstatecity.city
            addcity.push(CreateCity.id)
            await StateModel.findByIdAndUpdate(req.body.state, { city: addcity })

            console.log('City add successfully');
            return res.redirect('/fun/viewcity')
        }
        else {
            console.log('City alredy created');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.ViewCity = async (req, res) => {

    let city = await CityModel.find().populate('state').exec()
    let email = await EmailModel.find().populate('city').exec()

    for (i = 0; i < city.length; i++) {
        let NumberOfMail = 0;
        for (j = 0; j < email.length; j++) {
            if (city[i].id == email[j].city.id) {
                NumberOfMail++;
            }
            city[i].mail = NumberOfMail
        }
    }

    res.render('area/city', {
        user: req.user,
        city
    })
}

module.exports.UpdateCityPage = async (req, res) => {
    try {
        let state = await StateModel.find().populate('state').exec()
        let CityData = await CityModel.findById(req.query.id)
        return res.render('area/editcity', {
            user: req.user,
            CityData, state
        })
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.UpdateCity = async (req, res) => {
    try {
        let UpdateCity = await CityModel.findByIdAndUpdate(req.body.id, req.body)
        if (UpdateCity) {
            console.log('city Update successfully');
            return res.redirect('/fun/viewcity')
        }
        else {
            console.log('not Updated');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.DeleteCity = async (req, res) => {
    try {
        await EmailModel.deleteMany({ city: { $in: req.query.id } })

        let cityData = await CityModel.findById(req.query.id).populate('state').exec()

        let checkstate = await StateModel.findById(cityData.state)

        let deletecityid = checkstate.city.indexOf(req.query.id.toString())
        checkstate.city.splice(deletecityid - 1, 1)
        await StateModel.findByIdAndUpdate(checkstate.id, { city: checkstate.city })

        let DeleteCity = await CityModel.findByIdAndDelete(req.query.id)
        if (DeleteCity) {
            console.log('city Delete');
            return res.redirect('back')
        }
        else {
            console.log('city is not delete');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.CStatus = async (req, res) => {
    try {
        let status = true
        if (req.query) {
            status = req.query.status
        }
        let ChangStatus = await CityModel.findByIdAndUpdate(req.query.id, { status: status })

        if (ChangStatus) {
            console.log('City status chang');
            return res.redirect('back')
        } else {
            console.log('City Status not Chang');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}