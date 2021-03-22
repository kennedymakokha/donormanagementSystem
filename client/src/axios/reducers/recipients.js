
const initialState = {

    reciepients: [],
    recipient: {},
    loading: true
}

const recipientReducer = function (state = initialState, action) {
    switch (action.type) {
        case 'FETCH_RECIPIENT':
            return {
                ...state,
                recipient: action.payload
            }
        case 'FETCH_RECIPIENTS':
            return {
                ...state,
                reciepients: action.payload,
                loading: false
            }
        default:
            return state;
    }
}
export default recipientReducer