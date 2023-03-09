import { combineReducers } from "redux";
import authReducer from "./user";
import alertReducer from "./alert";
export default combineReducers({
  auth: authReducer,
  alert: alertReducer,
});
