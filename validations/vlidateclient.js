const Validator = require('validator');
const isEmpty = require('./is-empty');
module.exports.validate = (data) => {
    let errors = {};
    data.reasons = !isEmpty(data.reasons) && data.reasons !== undefined ? data.reasons : '';


    if (Validator.isEmpty(data.reasons)) {
        errors.email = 'Kindly give a reason to reject';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}


