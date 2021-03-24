import axios, { setAuthToken } from './axiosService'
export const post = (data) => async dispatch => {
    try {
        const response = await axios.post(`/category`, data);
        return response;
    } catch (error) {
        throw error;
    }

};
export const fetchOne = (data) => async dispatch => {
    try {
        const response = await axios.get(`/category/${data}`);
        let payload = response.data.cat
        await dispatch({ type: 'FETCH_CATEGORY', payload })
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
        const response = await axios.get(`/categories`);
        let payload = response.data.Categorys
        await dispatch({ type: 'FETCH_CATEGORIES', payload })
        return payload;

    } catch (error) {
        throw error;
    }

};