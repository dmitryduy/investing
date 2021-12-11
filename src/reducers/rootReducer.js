import { combineReducers } from "redux";
import userReducer from "./userReducer";
import stockReducer from "./stockReducer";
import settingsReducer from "./settingsReducer";

const rootReducer = combineReducers({
    user: userReducer,
    stock: stockReducer,
    settings: settingsReducer
});


export default rootReducer;