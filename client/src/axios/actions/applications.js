import axios, { setAuthToken } from './axiosService'
export const post = (data) => async dispatch => {
    try {
        const response = await axios.post(`/applicantionPost`, data);

        return response;
    } catch (error) {
        throw error;
    }

};
export const fetchOne = (id) => async dispatch => {

    try {
        const response = await axios.get(`/applicant/${id}`);
        let payload = response.data.applicant
        alert(JSON.stringify(payload))
        await dispatch({ type: 'FETCH_APPLICANT', payload })
        return payload;

    } catch (error) {
        throw error;
    }

};

export const deleteType = (id) => async dispatch => {
    try {
        const response = await axios.put(`/category/${id}/deactivate`);
        return response;
    } catch (error) {
        throw error;
    }

};
export const EditType = (data) => async dispatch => {

    try {
        const response = await axios.put(`/category/${data.id}/edit`, data);
        return response;
    } catch (error) {
        throw error;
    }

};

export const fetch = () => async dispatch => {
    try {

        setAuthToken(axios);
        const response = await axios.get(`/applications-list`);
        let payload = response.data.Applications

        await dispatch({ type: 'FETCH_APPLICANTS', payload })
        return payload;

    } catch (error) {
        throw error;
    }

};
export const approve = (id) => async dispatch => {
    try {
        const response = await axios.put(`/applicant/${id}/approve`);
        return response;
    } catch (error) {
        throw error;
    }

};


