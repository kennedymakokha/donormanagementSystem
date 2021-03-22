const express = require('express');
const router = express.Router();
const Donation = require('../models/donations');
const { validateInput } = require('./../validations/donations');
const { authMiddleware, authorized } = require('./helpers/authorized')

router.get('/donations', async (req, res) => {

    try {
        /* 	#swagger.tags = ['Donation']
  #swagger.description = 'Endpoint to fetch  a categories' */
        const Donations = await Donation.find({ deletedAt: null }).populate('category_id');

        return res.status(200).json({ success: true, message: 'retrieved successfully ', Donations });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'retrieval failed ', error });

    }

});
router.post('/donation', [authMiddleware, authorized], async (req, res) => {

    try {

        /* 	#swagger.tags = ['Donation']
     #swagger.description = 'Endpoint to add a Donation' */

        /*	#swagger.parameters['obj'] = {
                in: 'body',
                description: 'Donation information.',
                required: true,
                schema: { $ref: "#/definitions/AddDonation" }
        } */

        /* #swagger.security = [{
                "apiKeyAuth": []
        }] */
        const { errors, isValid } = validateInput(req.body);
        if (!isValid) {
            const errObj = errors;
            return res.status(400).json({ success: false, message: `${Object.values(errObj)[0]}` });

        }
        const cati = await Donation.findOne({ name: req.body.name })
        if (cati) {
            return res.status(400).json({ success: false, message: `Donation ${req.body.name} already exists` });
        }
        const body = req.body
        body.createdBy = req.user._id
        const don = new Donation(body);
        await don.save()
        return res.status(200).json({ success: true, message: 'Donation saved successfully', don });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'retrieval failed ', error });

    }

});
router.get('/donation/:id', [authMiddleware, authorized], async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Donation']
 #swagger.description = 'Endpoint to get a Donation' */
        const cat = await Donation.findOne({ _id: req.params.id }).populate('category_id')
        return res.status(200).json({ success: true, message: 'successfull', cat });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
router.get('/donation/category/:id', async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Donation']
 #swagger.description = 'Endpoint to get a Donation' */
        const donations = await Donation.find({ category_id: req.params.id }).populate('category_id')
        return res.status(200).json({ success: true, message: 'successfull', donations });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});

router.put('/donation/:id/deactivate', [authMiddleware, authorized], async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Donation']
 #swagger.description = 'Endpoint to delete a donation' */
        const cat = await Donation.findOneAndUpdate({ _id: req.params.id }, { deletedAt: Date(), deletedBy: req.user._id }, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: 'Donation deleted successfully', cat });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
router.put('/donation/:id/edit', [authMiddleware, authorized], async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Donation']
  #swagger.description = 'Endpoint to edit a donation' */

        /*	#swagger.parameters['obj'] = {
                in: 'body',
                description: 'Donation information.',
                required: true,
                schema: { $ref: "#/definitions/UpdateDonation" }
        } */

        /* #swagger.security = [{
                "apiKeyAuth": []
        }] */
        const body = req.body;
        body.updatedBy = req.user._id
        // body.updatedBy = req.user._id
        body.updatedAt = Date.now()
        console.log(body)
        const cat = await Donation.findOneAndUpdate({ _id: req.params.id }, body, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: 'Donation edited successfull', cat });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});

router.put('/donation/:id/activate', [authMiddleware, authorized], async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Donation']
  #swagger.description = 'Endpoint to activate a Donation' */

        const cat = await Donation.findOneAndUpdate({ _id: req.params.id }, { deletedAt: null, restoredBy: req.user._id }, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: 'Donation edited successfull', cat });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
module.exports = router