const Validator = require('validator');
const isEmpty = require('./is-empty');
module.exports.validateInput = (data) => {
    let errors = {};
    data.category_id = !isEmpty(data.category_id) && data.category_id !== undefined ? data.category_id : '';
    data.applicants_id = !isEmpty(data.applicants_id) && data.applicants_id !== undefined ? data.applicants_id : '';
    data.donation_id = !isEmpty(data.donation_id) && data.donation_id !== undefined ? data.donation_id : '';


    if (Validator.isEmpty(data.category_id)) {
        errors.category_id = 'Kindly select a catagory';
    }

    if (Validator.isEmpty(data.applicants_id)) {
        errors.applicants_id = 'Kindly input the applicant';
    }
    if (Validator.isEmpty(data.donation_id)) {
        errors.donation_id = 'Kindly select a donation';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
