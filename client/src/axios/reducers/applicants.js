
const initialState = {
    applicants: [],
    applicant: {},
    loading: true
}

const applicantsReducer = function (state = initialState, action) {
    switch (action.type) {
        case 'FETCH_APPLICANT':
            return {
                ...state,
                applicant: action.payload,
                loading: false
            }
        case 'FETCH_APPLICANTS':
            return {
                ...state,
                applicants: action.payload,
                loading: false
            }
        default:
            return state;
    }
}
export default applicantsReducer