import axios, { setAuthToken } from './axiosService'
export const post = (data) => async dispatch => {
    try {
        const response = await axios.post(`/doner`, data);
        return response;
    } catch (error) {
        throw error;
    }

};

export const fetch = () => async dispatch => {
    try {
        setAuthToken(axios);
        const response = await axios.get(`/doners`);
        let payload = response.data.Doners
        await dispatch({ type: 'FETCH_DONERS', payload })
        return payload;

    } catch (error) {
        throw error;
    }

};
export const fetchOne = (id) => async dispatch => {
    
    
    try {
        setAuthToken(axios);
        const response = await axios.get(`/doner/${id}`);
        let payload = response.data.Don
        await dispatch({ type: 'FETCH_DONER', payload })
        return payload;

    } catch (error) {
        throw error;
    }

};