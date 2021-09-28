import { combineReducers } from 'redux';

// Front
import Layout from './layout/reducer';

// Authentication Module
import Login from './auth/login/reducer';


//ecommerce
import RightSideModal from "./rightSideModal/reducer"
import APICall from "./apiCall/reducer";
import Diagram from "../pages/diagram/reducer";


const rootReducer = combineReducers({

    // public
    Layout,

    // Authentication
    Login,
    RightSideModal,
    APICall,
    Diagram

});

export default rootReducer;