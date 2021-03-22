
const initialState = {

    donations: [],
    donation: {},
    loading: true
}

 const doantionReducer = function (state = initialState, action) {
    switch (action.type) {
        case 'FETCH_DONATION':
            return {
                ...state,
                donation: action.payload,
                loading: false
            }
        case 'FETCH_DONATIONS':
            return {
                ...state,
                donations: action.payload,
                loading: false
            }
        case 'FETCH_DONATIONS_PER_CATEGORY':
            return {
                ...state,
                donations: action.payload,
                loading: false
            }
        default:
            return state;
    }
}
export default doantionReducer