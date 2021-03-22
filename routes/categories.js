const express = require('express');
const router = express.Router();
const Category = require('../models/categories');
const { validateInput } = require('./../validations/category');
const { authMiddleware, authorized } = require('./helpers/authorized')

router.get('/categories',  async (req, res) => {

    try {
        /* 	#swagger.tags = ['Category']
  #swagger.description = 'Endpoint to fetch  a categories' */
        const Categorys = await Category.find({ deletedAt: null });

        return res.status(200).json({ success: true, message: 'retrieved successfully ', Categorys });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'retrieval failed ', error });

    }

});
router.post('/category', [authMiddleware, authorized], async (req, res) => {

    try {

        /* 	#swagger.tags = ['Category']
     #swagger.description = 'Endpoint to add a category' */

        /*	#swagger.parameters['obj'] = {
                in: 'body',
                description: 'Category information.',
                required: true,
                schema: { $ref: "#/definitions/AddCategory" }
        } */

        /* #swagger.security = [{
                "apiKeyAuth": []
        }] */
        const { errors, isValid } = validateInput(req.body);
        if (!isValid) {
            const errObj = errors;
            return res.status(400).json({ success: false, message: `${Object.values(errObj)[0]}` });

        }
        const cati = await Category.findOne({ name: req.body.name })
        if (cati) {
            return res.status(400).json({ success: false, message: `Category ${req.body.name} already exists` });
        }
        const body = req.body

        body.createdBy = req.user._id
        const cat = new Category(body);
        await cat.save()
        return res.status(200).json({ success: true, message: 'Category saved successfully', cat });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'retrieval failed ', error });

    }

});
router.get('/category/:id', async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Category']
 #swagger.description = 'Endpoint to get a category' */
        const cat = await Category.findOne({ _id: req.params.id })
        return res.status(200).json({ success: true, message: 'successfull', cat });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});

router.put('/category/:id/deactivate', [authMiddleware, authorized], async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Category']
 #swagger.description = 'Endpoint to delete a category' */
        const cat = await Category.findOneAndUpdate({ _id: req.params.id }, { deletedAt: Date(), deletedBy: req.user._id }, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: 'Category deleted successfully', cat });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
router.put('/category/:id/edit', [authMiddleware, authorized], async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Category']
  #swagger.description = 'Endpoint to edit a category' */

        /*	#swagger.parameters['obj'] = {
                in: 'body',
                description: 'Category information.',
                required: true,
                schema: { $ref: "#/definitions/UpdateCategory" }
        } */

        /* #swagger.security = [{
                "apiKeyAuth": []
        }] */
        const body = req.body;
        body.updatedBy = req.user._id
        // body.updatedBy = req.user._id
        body.updatedAt = Date.now()
        console.log(body)
        const cat = await Category.findOneAndUpdate({ _id: req.params.id }, body, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: 'Category edited successfull', cat });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});

router.put('/category/:id/activate', [authMiddleware, authorized], async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['Category']
  #swagger.description = 'Endpoint to activate a category' */

        const cat = await Category.findOneAndUpdate({ _id: req.params.id }, { deletedAt: null, restoredBy: req.user._id }, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: 'Category edited successfull', cat });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
module.exports = router