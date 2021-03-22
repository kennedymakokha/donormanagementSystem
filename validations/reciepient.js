const Validator = require('validator');
const isEmpty = require('./is-empty');
module.exports.validateInput = (data) => {
    let errors = {};
    data.name = !isEmpty(data.name) && data.name !== undefined ? data.name : '';
    data.type = !isEmpty(data.type) && data.type !== undefined ? data.type : '';
    data.tel = !isEmpty(data.tel) && data.tel !== undefined ? data.tel : '';
    data.registrationNo = !isEmpty(data.registrationNo) && data.registrationNo !== undefined ? data.registrationNo : '';
    data.country = !isEmpty(data.country) && data.country !== undefined ? data.country : '';
    data.physical_address = !isEmpty(data.physical_address) && data.physical_address !== undefined ? data.physical_address : '';
    data.postal_address = !isEmpty(data.postal_address) && data.postal_address !== undefined ? data.postal_address : '';
    data.category = !isEmpty(data.category) && data.category !== undefined ? data.category : '';
    data.funds = !isEmpty(data.funds) && data.funds !== undefined ? data.funds : '';
    data.registrationNo = !isEmpty(data.registrationNo) && data.registrationNo !== undefined ? data.registrationNo : '';

    if (Validator.isEmpty(data.name)) {
        errors.name = ' name is required';
    }
    if (Validator.isEmpty(data.type)) {
        errors.type = 'Kindly select the type of reciepient';
    }
    if (Validator.isEmpty(data.funds)) {
        errors.funds = 'Kindly select the source of funds ';
    }
    if (Validator.isEmpty(data.category)) {
        errors.category = 'Kindly select the type of donation ';
    }
    if (Validator.isEmpty(data.country)) {
        errors.country = 'Kindly select country ';
    }
    if (Validator.isEmpty(data.tel)) {
        errors.tel = 'Mobile Number is required';
    }
    if (Validator.isEmpty(data.physical_address)) {
        errors.physical_address = 'Physical Address is required';
    }
    if (Validator.isEmpty(data.registrationNo)) {
        errors.registrationNo = 'Registration No is required';
    }
    if (Validator.isEmpty(data.postal_address)) {
        errors.postal_address = 'Postal Address is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}


