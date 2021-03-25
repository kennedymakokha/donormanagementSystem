const express = require('express');
const router = express.Router();
const Application = require('../models/applications')
const Donations = require('../models/donations')
const Donors = require('../models/doners')
const User = require('../models/user')
const { authMiddleware, authorized } = require('./helpers/authorized')
var bcrypt = require('bcrypt');
var transporter = require('./helpers/transporter');
const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');
router.get('/applications-list', [authMiddleware, authorized], async (req, res) => {

    try {
        /* 	#swagger.tags = ['Applicant']
  #swagger.description = 'Endpoint to fetch  a apllications' */
        const Applications = await Application.find({ deletedAt: null }).populate(['category_id', 'donation_id', 'applicants_id']);

        return res.status(200).json({ success: true, message: 'retrieved successfully ', Applications });

    } catch (error) {

        return res.status(400).json({ success: false, message: ' failed ', error });

    }

});
router.post('/applicantionPost', [authMiddleware, authorized], async (req, res) => {

    try {

        /* 	#swagger.tags = ['Applicant']
     #swagger.description = 'Endpoint to add a Doner' */

        /*	#swagger.parameters['obj'] = {
                in: 'body',
                description: 'Doner information.',
                required: true,
                schema: { $ref: "#/definitions/AddDoner" }
        } */

        /* #swagger.security = [{
                "apiKeyAuth": []
        }] */

        const appl = await Application.findOne({ applicants_id: req.body.applicants_id, donation_id: req.body.donation_id, category_id: req.body.category_id, deletedAt: null })

        if (appl) {
            return res.status(400).json({ success: false, message: 'You seem to have applied for this donnation kindly contact the admin for way forward' });
        }
        console.log(req.body)
        const application = new Application(req.body);
        await application.save()

        // const user = await User.findById(req.body.applicants_id)
        // const donation = await Donations.findById(req.body.donation_id)

        // const mailOptions = {
        //     from: '"Octagon Dynamics" <bradcoupers@gmail.com>',
        //     to: `katchibo2@gmail.com`,
        //     subject: 'Octagon Dynamics  Donner Account',
        //     template: 'application',

        //     context: {
        //         email: `${user.email}`,
        //         name: `${user.surname}`,
        //         donations: `${donation.name}`
        //     }
        // };
        // transporter.sendMail(mailOptions, function (error, info) {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log('Email sent: ' + info.response);
        //     }
        // });

        return res.status(200).json({ success: true, message: 'Application done successfully', application });

    } catch (error) {
        return res.status(400).json({ success: false, message: 'Saving failed ', error });

    }

});
router.get('/applicant/:id', async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Doner']
 #swagger.description = 'Endpoint to get a Doner' */
        const applicant = await Application.findOne({ _id: req.params.id })
        return res.status(200).json({ success: true, message: 'successfull', applicant });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});

router.put('/applicant/:id/approve', [authMiddleware, authorized], async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Doner']
 #swagger.description = 'Endpoint to delete a doner' */
        const applivant = await Application.findOneAndUpdate({ _id: req.params.id }, { status: "secondary", approvedBy: req.user._id }, { new: true, useFindAndModify: false })

        const Donners = await Donors.find();
        var i;
        for (i = 0; i < Donners.length; i++) {
            var j;
            for (j = 0; j < Donners[i].donations.length; j++) {

                if (`${applivant.donation_id}` === `${Donners[i].donations[j]}`) {

                    const D = await Donors.findOne({ _id: Donners[i]._id })
                    let V = D.applicants
                    let vo = [...V, applivant.applicants_id]
                    const Donor = await Donors.findOneAndUpdate({ _id: Donners[i]._id }, { applicants: vo, }, { new: true, useFindAndModify: false })

                }

            }

        }
        return res.status(200).json({ success: true, message: 'applicant approved successfully', applivant });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
// router.put('/doner/:id/edit', [authMiddleware, authorized], async (req, res, next) => {

//     try {
//         /* 	#swagger.tags = ['Doner']
//   #swagger.description = 'Endpoint to edit a Doner' */

//         /*	#swagger.parameters['obj'] = {
//                 in: 'body',
//                 description: 'Doner information.',
//                 required: true,
//                 schema: { $ref: "#/definitions/UpdateDoner" }
//         } */

//         /* #swagger.security = [{
//                 "apiKeyAuth": []
//         }] */
//         const body = req.body;
//         body.updatedBy = req.user._id
//         // body.updatedBy = req.user._id
//         body.updatedAt = Date.now()

//         const cat = await Doner.findOneAndUpdate({ _id: req.params.id }, body, { new: true, useFindAndModify: false })
//         return res.status(200).json({ success: true, message: 'Donor edited successfull', cat });
//     } catch (error) {
//         return res.status(400).json({ success: false, message: 'operation failed ', error });
//     }

// });

// router.put('/doner/:id/activate', [authMiddleware, authorized], async (req, res, next) => {

//     try {
//         /* 	#swagger.tags = ['Doner']
//   #swagger.description = 'Endpoint to activate a Doner' */

//         const cat = await Doner.findOneAndUpdate({ _id: req.params.id }, { deletedAt: null, restoredBy: req.user._id }, { new: true, useFindAndModify: false })
//         return res.status(200).json({ success: true, message: 'Donor edited successfull', cat });
//     } catch (error) {
//         return res.status(400).json({ success: false, message: 'operation failed ', error });
//     }

// });
module.exports = router