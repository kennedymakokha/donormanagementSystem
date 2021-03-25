import { combineReducers } from 'redux';
import userReducer from './users';
import categoryReducer from './categories'
import donationReducer from './donations'
import donerReducer from './doners'
import recipientReducer from './recipients'
import applicantsReducer from './applicants'

export default combineReducers({
    userData: userReducer,
    applicantsData: applicantsReducer,
    categoryData: categoryReducer,
    donationData: donationReducer,
    donerData: donerReducer,
    recipientData: recipientReducer,

});