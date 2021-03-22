
const initialState = {
    categories: [],
    category: {},
    loading: true
}

const categoryReducer = function (state = initialState, action) {
    switch (action.type) {
        case 'FETCH_CATEGORY':
            return {
                ...state,
                category: action.payload,
                loading:false
            }
        case 'FETCH_CATEGORIES':
            return {
                ...state,
                categories: action.payload,
                loading: false
            }
        default:
            return state;
    }
}
export default categoryReducer