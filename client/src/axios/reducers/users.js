const initialState = {

    users: [],
    user: {},
    loading: true,
    authorised: false
}

const userReducer = function (state = initialState, { type, payload, errors, error }) {
    switch (type) {
        case 'SET_CURRENT_USER':
            return {
                ...state,
                user: payload,
                loading: false,
                authorised: true
            }
        case 'LOGOUT':
            return {
                ...state,
                user: {},
                loading: false,
                authorised: false
            }

        default:
            return state;
    }
}
export default userReducer