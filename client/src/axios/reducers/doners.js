
const initialState = {

    doners: [],
    doner: {},
    loading: true
}

const donersReducer = function (state = initialState, action) {
    switch (action.type) {
        case 'FETCH_DONER':
            return {
                ...state,
                doner: action.payload,
                loading: false
            }
        case 'FETCH_DONERS':
            return {
                ...state,
                doners: action.payload,
                loading: false
            }
        
        default:
            return state;
    }
}
export default donersReducer