import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import { combineReducers } from "redux";
import post from "./post";
export default combineReducers({ alert, auth, profile });
