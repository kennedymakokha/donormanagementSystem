const express = require('express');
const router = express.Router();
const Reciepient = require('../models/reciepient');
const { validateInput } = require('./../validations/reciepient');
var multer = require('multer');
var { v4 } = require('uuid');
const { authMiddleware, authorized } = require('./helpers/authorized')
var bcrypt = require('bcrypt');
var path = require('path');
const UserK = require('../models/user');
var transporter = require('./helpers/transporter');
const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + './../public/uploads/cert');
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, v4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "application/pdf") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Pdf format allowed!'));
        }
    }
});


router.get('/reciepients', [authMiddleware, authorized], async (req, res) => {

    try {
        /* 	#swagger.tags = ['Reciepient']
  #swagger.description = 'Endpoint to fetch  a categories' */
        const Reciepients = await Reciepient.find({ deletedAt: null }).populate('category');

        return res.status(200).json({ success: true, message: 'retrieved successfully ', Reciepients });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'retrieval failed ', error });

    }

});
router.post('/reciepient', [upload.single('tax_cert')], async (req, res) => {

    try {

        /* 	#swagger.tags = ['Reciepient']
     #swagger.description = 'Endpoint to add a Reciepient' */

        /*	#swagger.parameters['obj'] = {
                in: 'body',
                description: 'Reciepient information.',
                required: true,
                schema: { $ref: "#/definitions/AddReciepient" }
        } */

        /* #swagger.security = [{
                "apiKeyAuth": []
        }] */
        const url = req.protocol + '://' + req.get('host');
        console.log(req.file)
        if (!req.file) {

            return res.status(400).json({ success: false, message: " Kindly upload a tax-compliance certificatte !" });

        }
        const { errors, isValid } = validateInput(req.body);
        if (!isValid) {
            const errObj = errors;
            return res.status(400).json({ success: false, message: `${Object.values(errObj)[0]}` });

        }

        const UsedREg = await Reciepient.findOne({ registrationNo: req.body.registrationNo })
        const Usedemail = await Reciepient.findOne({ email: req.body.email })
        if (UsedREg) {
            return res.status(400).json({ success: false, message: `Reciepient  with Registration ${req.body.registrationNo} already exists` });
        }
        if (Usedemail) {
            return res.status(400).json({ success: false, message: `${req.body.email} already exists` });
        }

        let body = req.body

        body.tax_cert = url + '/uploads/cert/' + req.file.filename
        // body.createdBy = {req.user._id ?:'self'}
        const cat = new Reciepient(body);
        await cat.save()
        const newuser = {
            firstname: `Client`,
            email: `${req.body.email}`,
            surname: req.body.name,
            phone: req.body.tel,
            role: "reciever",
            recieverId: cat._id,
            hashPassword: bcrypt.hashSync(req.body.password, 10)

        }
        const userRecord = new UserK(newuser)
        await userRecord.save()
        return res.status(200).json({ success: true, message: 'Reciepient saved successfully', cat });

    } catch (error) {

        return res.status(400).json({ success: false, message: ' failed ', error });

    }

});
router.get('/reciepient/:id', [authMiddleware, authorized], async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Reciepient']
 #swagger.description = 'Endpoint to get a Reciepient' */
        const Reciepien = await Reciepient.findOne({ _id: req.params.id }).populate('category')
        return res.status(200).json({ success: true, message: 'successfull', Reciepien });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});

router.put('/reciepient/:id/validate', [authMiddleware, authorized], async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Reciepient']
 #swagger.description = 'Endpoint to delete a Reciepient' */
        const user = await Reciepient.findOne({ _id: req.params.id })
        const rec = await UserK.findOne({ recieverId: req.params.id })
        const activate = await Reciepient.findOneAndUpdate({ _id: req.params.id }, { validatedAt: Date(), validatedBy: req.user._id, valid: 'on' }, { new: true, useFindAndModify: false })
        const mailOptions = {
            from: '"Octagon Dynamics" <bradcoupers@gmail.com>',
            to: `${rec.email}`,
            subject: 'Octagon Dynamics Account activations',
            template: 'activation',

            context: {
                email: `${user.email}`,
                name: `${user.name}`,
            }
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        return res.status(200).json({ success: true, message: 'Reciepient validated successfully', activate });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});

router.put('/reciepient/:id/reject', [authMiddleware, authorized], async (req, res, next) => {

    try {
       
        /* 	#swagger.tags = ['Reciepient']
 #swagger.description = 'Endpoint to reject a Reciepient application' */
        const user = await Reciepient.findOne({ _id: req.params.id })
        const rec = await UserK.findOne({ recieverId: req.params.id })
        const activate = await Reciepient.findOneAndUpdate({ _id: req.params.id }, { validatedAt: Date(), validatedBy: req.user._id, rejected: 'on',reasons:req.body.reasons }, { new: true, useFindAndModify: false })
        const mailOptions = {
            from: '"Octagon Dynamics" <bradcoupers@gmail.com>',
            to: `${rec.email}`,
            subject: 'Octagon Dynamics Application Recejction',
            template: 'turndown',

            context: {
                email: `${user.email}`,
                name: `${user.name}`,
                reasons: `${req.body.reasons}`
            }
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        return res.status(200).json({ success: true, message: 'Reciepient validated successfully', activate });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});


router.put('/reciepient/:id/deactivate', [authMiddleware, authorized], async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Reciepient']
 #swagger.description = 'Endpoint to delete a Reciepient' */
        const cat = await Reciepient.findOneAndUpdate({ _id: req.params.id }, { deletedAt: Date(), deletedBy: req.user._id }, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: 'Reciepient deleted successfully', cat });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
router.put('/reciepient/:id/edit', [authMiddleware, authorized], async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Reciepient']
  #swagger.description = 'Endpoint to edit a Reciepient' */

        /*	#swagger.parameters['obj'] = {
                in: 'body',
                description: 'Reciepient information.',
                required: true,
                schema: { $ref: "#/definitions/UpdateReciepient" }
        } */

        /* #swagger.security = [{
                "apiKeyAuth": []
        }] */
        const body = req.body;
        body.updatedBy = req.user._id
        // body.updatedBy = req.user._id
        body.updatedAt = Date.now()
        console.log(body)
        const cat = await Reciepient.findOneAndUpdate({ _id: req.params.id }, body, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: 'Reciepient edited successfull', cat });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});

router.put('/reciepient/:id/activate', [authMiddleware, authorized], async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Reciepient']
  #swagger.description = 'Endpoint to activate a Reciepient' */

        const cat = await Reciepient.findOneAndUpdate({ _id: req.params.id }, { deletedAt: null, restoredBy: req.user._id }, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: 'Reciepient edited successfull', cat });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
module.exports = router