const express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var multer = require('multer');
var { v4 } = require('uuid');
var jwt = require('jsonwebtoken');
var { validateRegisterInput } = require('./../validations/user')
const { authMiddleware, authorized } = require('./helpers/authorized')
const User = require('./../models/user')
const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + './../public/uploads/avatars');
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, v4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});


router.post('/register', [upload.single('avatar')], async (req, res) => {


    /* 	#swagger.tags = ['User']
       #swagger.description = 'Endpoint to sign in a specific user' */

    /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'User information.',
            required: true,
            schema: { $ref: "#/definitions/AddUser" }
    } */

    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */

    const url = req.protocol + '://' + req.get('host');

    if (!req.file) {

        return res.status(400).json({ success: false, message: "Avatar Is Required !" });

    }

    const { errors, isValid } = validateRegisterInput(req.body);

    const useremail = await User.findOne({ email: req.body.email })
    if (!isValid) {
        return res.status(400).json(errors);
    }

    if (useremail) {
        return res.status(400).json({ message: 'Email already Taken try another email' })
    }

    let body = req.body
    body.avatar = url + '/uploads/avatars/' + req.file.filename
    body.active = 'on'
    
    const newUser = new User(body)

    newUser.hashPassword = bcrypt.hashSync(req.body.password, 10);

    newUser.save((err, user) => {
        if (err) {
            return res.status(400).send({ message: err })
        } else {
            user.hashPassword = undefined;

            return res.json(user)
        }

    })
});

function compare(password, hashedPassword) {
    // Cannot bcrypt compare when one is undefined
    if (!password || !hashedPassword) {
        return Promise.resolve(false);
    }

    return bcrypt.compare(password, hashedPassword);
}
router.post('/login', async (req, res) => {

    try {
        /* 	#swagger.tags = ['User']
       #swagger.description = 'Endpoint to sign in a specific user' */

        /*	#swagger.parameters['obj'] = {
                in: 'body',
                description: 'User information.',
                required: true,
                schema: { $ref: "#/definitions/LoginUser" }
        } */


        const user = await User.findOne({ email: req.body.email });

        if (user.active === "off") {
            return res.status(401).json({ message: 'Your account is inactive kindly  contact the admin to activate !!' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed.User Not found !!' });
        }
        const password_match = await compare(req.body.password, user.hashPassword);

        if (!password_match) {
            return res.status(401).json({ message: 'Authentication failed with wrong credentials!!' });
        }
        const token = await jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_KEY);
        return res.status(200).json({ token, key: process.env.JWT_KEY, email: user.email, _id: user._id });
    } catch (error) {
        return res.status(400).json(error);
    }

});

router.get('/user/:id', [authMiddleware, authorized], async (req, res, next) => {

    try {
        /* 	#swagger.tags = ['User']
 #swagger.description = 'Endpoint to get a user' */
        const usr = await User.findOne({ _id: req.params.id })
        return res.status(200).json({ success: true, message: 'successfull', usr });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});

module.exports = router