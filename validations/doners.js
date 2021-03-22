const Validator = require('validator');
const isEmpty = require('./is-empty');
const { emailIsValid, } = require('./is-email');
module.exports.validateInput = (data) => {
    let errors = {};
    data.name = !isEmpty(data.name) && data.name !== undefined ? data.name : '';
    data.dob = !isEmpty(data.dob) && data.dob !== undefined ? data.dob : '';
    data.email = !isEmpty(data.email) && data.email !== undefined ? data.email : '';
    data.mobile = !isEmpty(data.mobile) && data.mobile !== undefined ? data.mobile : '';
    data.password = !isEmpty(data.password) && data.password !== undefined ? data.password : '';
    data.area = !isEmpty(data.area) && data.area !== undefined ? data.area : '';
    // data.contact = !isEmpty(data.contact) && data.contact !== undefined ? data.contact : '';
    data.area = !isEmpty(data.area) && data.area !== undefined ? data.area : '';
    data.area = !isEmpty(data.area) && data.area !== undefined ? data.area : '';


    if (Validator.isEmpty(data.dob)) {
        errors.dob = 'Date field is required';
    }
    if (Validator.isEmpty(data.name)) {
        errors.name = ' Name  field is required';
    }
    
    if (Validator.isEmpty(data.mobile)) {
        errors.mobile = 'Mobile number field is required';
    }

    if (!emailIsValid(data.email)) {
        errors.email = 'Email is invalid';
    }
    if (Validator.isEmpty(data.area)) {
        errors.area = 'Area is required';
    }
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    }
    if (!Validator.isLength(data.password, { min: 8, })) {
        errors.password = 'Password must be at least 8 characters';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }
    

    if (!Validator.isLength(data.mobile, { min: 10, max: 14 })) {
        errors.mobile = 'Mobile Number  must have at least  10 characters ';
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}


