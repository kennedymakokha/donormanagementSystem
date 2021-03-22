import axios, { setAuthToken } from './axiosService'

export const post = (data) => async dispatch => {

    try {
        const response = await axios.post(`/donation`, data);
        return response;
    } catch (error) {


        throw error;
    }

};

export const fetchdonations = () => async dispatch => {
    try {
        setAuthToken(axios);
        const response = await axios.get(`/donations`);
        let payload = response.data.Donations
        await dispatch({ type: 'FETCH_DONATIONS', payload })
        return payload;

    } catch (error) {

        alert(error)
        throw error;
    }

};

export const deleteDonation = (id) => async dispatch => {
    try {
        const response = await axios.put(`/donation/${id}/deactivate`);
        return response;
    } catch (error) {

        // alert(error)
        throw error;
    }

};
export const EditDonation = (data) => async dispatch => {

    try {
        const response = await axios.put(`/donation/${data.id}/edit`, data);
        return response;
    } catch (error) {

        // alert(error)
        throw error;
    }

};

export const fetchdonationpercategory = (id) => async dispatch => {
    try {

        setAuthToken(axios);
        const response = await axios.get(`/donation/category/${id}`);
        let payload = response.data.donations

        await dispatch({ type: 'FETCH_DONATIONS_PER_CATEGORY', payload })
        return payload;

    } catch (error) {


        throw error;
    }

};
