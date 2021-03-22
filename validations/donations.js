const Validator = require('validator');
const isEmpty = require('./is-empty');
module.exports.validateInput = (data) => {
    let errors = {};
    data.name = !isEmpty(data.name) && data.name !== undefined ? data.name : '';
    data.category_id = !isEmpty(data.category_id) && data.category_id !== undefined ? data.category_id : '';


    if (Validator.isEmpty(data.name)) {
        errors.name = 'Category name is required';
    }

    if (Validator.isEmpty(data.category_id)) {
        errors.category_id = 'Kindly select a category';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}


