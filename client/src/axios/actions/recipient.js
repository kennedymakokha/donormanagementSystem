import axios, { setAuthToken } from './axiosService'
export const post = (data) => async dispatch => {
    try {

        var form_Data = new FormData();
        form_Data.append('type', data.type);
        form_Data.append('name', data.name);
        form_Data.append('funds', data.funds);
        form_Data.append('category', data.category);
        form_Data.append('registrationNo', data.registrationNo);
        form_Data.append('country', data.country);
        form_Data.append('physical_address', data.physical_address);
        form_Data.append('postal_address', data.postal_address);
        form_Data.append('postal_code', data.postal_code);
        form_Data.append('tel', data.tel);
        form_Data.append('email', data.email);
        form_Data.append('password', data.password);
        form_Data.append('tax_cert', data.tax_cert);
        const response = await axios.post(`/reciepient`, form_Data);

        return response;
    } catch (error) {
        throw error;
    }

};

export const validate = (id) => async dispatch => {
    try {
        const response = await axios.put(`/reciepient/${id}/validate`);
        return response;
    } catch (error) {
        throw error;
    }

};

export const reject = (data) => async dispatch => {
    try {
        const response = await axios.put(`/reciepient/${data.id}/reject`, data);
        return response;
    } catch (error) {
        throw error;
    }

};

export const fetch = () => async dispatch => {
    try {
        setAuthToken(axios);
        const response = await axios.get(`/reciepients`);
        let payload = response.data.Reciepients
        await dispatch({ type: 'FETCH_RECIPIENTS', payload })
        return payload;
    } catch (error) {
        throw error;
    }

};

export const fetchOne = (id) => async dispatch => {
    try {
        setAuthToken(axios);

        const response = await axios.get(`/reciepient/${id}`);
        let payload = response.data.Reciepien

        await dispatch({ type: 'FETCH_RECIPIENT', payload })
        return payload;

    } catch (error) {
        throw error;
    }

};
