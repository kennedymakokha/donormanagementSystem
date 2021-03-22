import { combineReducers } from 'redux';
import userReducer from './users';
import categoryReducer from './categories'
import donationReducer from './donations'
import donerReducer from './doners'
import recipientReducer from './recipients'

export default combineReducers({
    userData: userReducer,
    categoryData: categoryReducer,
    donationData: donationReducer,
    donerData: donerReducer,
    recipientData: recipientReducer,

});