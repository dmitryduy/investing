import { combineReducers } from "redux";
import userReducer from "./userReducer";
import stockReducer from "./stockReducer";

const rootReducer = combineReducers({
    user: userReducer,
    stock: stockReducer
});


export default rootReducer;