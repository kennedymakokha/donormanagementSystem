import axios, { setAuthToken } from './axiosService';
import { base } from './baseUrl'



export const loginUser = (data) => async dispatch => {

    try {
        const response = await axios.post(`${base}/login`, data);
        if (response) {
            let id = response.data._id
            let token = response.data.token
            localStorage.setItem('user_id', id);
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const responseg = await axios.get(`${base}/user/${id}`);
            let payload = responseg.data.usr
            localStorage.setItem('role', responseg.data.usr.role);
            await dispatch({ type: 'SET_CURRENT_USER', payload })
            return payload
            // await authorised(`${response.data._id}`, `${response.data.token}`)
        }
        return response;
    } catch (error) {

        throw error;
    }

};

export const logout = () => async dispatch => {

    try {


        await dispatch({ type: 'LOGOUT' })
        return

    } catch (error) {

        throw error;
    }

};

export const authorised = (id) => async dispatch => {

    try {
    
        setAuthToken(axios);
        const response = await axios.get(`/user/${id}`)
        let payload = response.data.usr
        console.log(payload)
        await dispatch({ type: 'SET_CURRENT_USER', payload })
        return

    } catch (error) {

        throw error;
    }

};

export const post = (data) => async dispatch => {

    try {
        console.log(data.avatar);
        let formData = new FormData();
        formData.append('avatar', data.avatar);
        formData.append('email', data.email);
        formData.append('name', data.name);
        formData.append('phone', data.phone);
        formData.append('ID_no', data.ID_no);
        formData.append('residence', data.residence);
        formData.append('password', data.password);

        // console.log(JSON.stringify(formData))

        console.log(JSON.stringify(data))
        const response = await axios.post(`/auth/register`, formData);
        return response.data;

    } catch (error) {

        throw error;
    }

};

export const fetch = () => async dispatch => {
    try {
        setAuthToken(axios);
        const response = await axios.get(`/employees`);
        const payload = response.data
        console.log(payload)
        await dispatch({ type: 'FETCH_EMPLOYEES', payload })
        return payload;
    } catch (error) {

        throw error;
    }

};

export const upload = (data) => async dispatch => {
    try {

        var formData = new FormData();

        formData.append('file', data.file);

        formData.append('branch', data.branch);

    } catch (error) {
        throw error;
    }

};



