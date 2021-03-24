const express = require('express');
const router = express.Router();
const Doner = require('../models/doners');
const UserK = require('../models/user');
const { validateInput } = require('./../validations/doners');
const { authMiddleware, authorized } = require('./helpers/authorized')
var bcrypt = require('bcrypt');
router.get('/doners', [authMiddleware, authorized], async (req, res) => {

    try {
        /* 	#swagger.tags = ['Doner']
  #swagger.description = 'Endpoint to fetch  a categories' */
        const Doners = await Doner.find({ deletedAt: null }).populate('donations');

        return res.status(200).json({ success: true, message: 'retrieved successfully ', Doners });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'retrieval failed ', error });

    }

});
router.post('/doner', async (req, res) => {

    try {

        /* 	#swagger.tags = ['Doner']
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
        const { errors, isValid } = validateInput(req.body);
        if (!isValid) {
            const errObj = errors;
            return res.status(400).json({ success: false, message: `${Object.values(errObj)[0]}` });

        }
        const UsedEmail = await Doner.findOne({ email: req.body.email })
        if (UsedEmail) {
            return res.status(400).json({ success: false, message: `${req.body.email} already exists` });
        }

        const reqdonations = [];
        if (req.body.donations !== undefined) {
            let donations = [];
            if (typeof req.body.donations == "string") {
                donations = [req.body.donations];
            } else {
                donations = req.body.donations;
            }
            for (var i = 0; i < donations.length; i++) {
                reqdonations.push(donations[i])
            }
        }

        const body = req.body
        body.donations = reqdonations
        const don = new Doner(body);
        await don.save()

        const newuser = {
            firstname: `Donner`,
            email: `${req.body.email}`,
            surname: req.body.name,
            phone: req.body.mobile,
            role: "donner",
            donnerId: don._id,
            hashPassword: bcrypt.hashSync(req.body.password, 10)

        }
        console.log(newuser)
        const userRecord = new UserK(newuser)
        await userRecord.save()

        return res.status(200).json({ success: true, message: 'Donor saved successfully', don });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'retrieval failed ', error });

    }

});
router.get('/doner/:id', async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Doner']
 #swagger.description = 'Endpoint to get a Doner' */
        const Don = await Doner.findOne({ _id: req.params.id }).populate('donations')
        return res.status(200).json({ success: true, message: 'successfull', Don });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});

router.put('/doner/:id/deactivate', [authMiddleware, authorized], async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Doner']
 #swagger.description = 'Endpoint to delete a doner' */
        const cat = await Doner.findOneAndUpdate({ _id: req.params.id }, { deletedAt: Date(), deletedBy: req.user._id }, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: 'Donor deleted successfully', cat });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
router.put('/doner/:id/edit', [authMiddleware, authorized], async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Doner']
  #swagger.description = 'Endpoint to edit a Doner' */

        /*	#swagger.parameters['obj'] = {
                in: 'body',
                description: 'Doner information.',
                required: true,
                schema: { $ref: "#/definitions/UpdateDoner" }
        } */

        /* #swagger.security = [{
                "apiKeyAuth": []
        }] */
        const body = req.body;
        body.updatedBy = req.user._id
        // body.updatedBy = req.user._id
        body.updatedAt = Date.now()
        console.log(body)
        const cat = await Doner.findOneAndUpdate({ _id: req.params.id }, body, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: 'Donor edited successfull', cat });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});

router.put('/doner/:id/activate', [authMiddleware, authorized], async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Doner']
  #swagger.description = 'Endpoint to activate a Doner' */

        const cat = await Doner.findOneAndUpdate({ _id: req.params.id }, { deletedAt: null, restoredBy: req.user._id }, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: 'Donor edited successfull', cat });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
module.exports = router