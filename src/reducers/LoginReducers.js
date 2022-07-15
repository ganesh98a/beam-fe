import {
    LOGIN_PROCESS,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    CHECK_ISAUTH,
    SET_CONDITION,
    SET_MENU_CONDITION,
    SET_INITIAL_CONDITION,
    SET_CHALLENGE_TAG
} from '../utilities';
import * as constand from '../constant';
import { commonService } from "../_services";

const INITIAL_STATE = {
    sending_data: false,
    is_auth: localStorage.getItem('user') || localStorage.getItem('userAuthToken') ? true : false,
    condition: constand.CONDITION,
    initial_condition: '',
    menu_condition: '',
    user_data: {},
    challenge_tag: true
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN_PROCESS:
            return {
                ...state,
                sending_data: action.payload
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                user_data: action.payload
            };
        case LOGIN_FAIL:
            return {
                ...state,
                sending_data: false
            };
        case CHECK_ISAUTH:
            console.log('CHECK_ISAUTH', action.payload)
            return {
                ...state,
                is_auth: action.payload
            };
        case SET_CONDITION:
            return {
                ...state,
                condition: action.payload.trim()
            };
        case SET_INITIAL_CONDITION:
            return {
                ...state,
                initial_condition: commonService.replaceChar(action.payload.trim(), false)
            }
        case SET_MENU_CONDITION:
            return {
                ...state,
                menu_condition: action.payload.trim()
            }
        case SET_CHALLENGE_TAG:
            return {
                ...state,
                challenge_tag: action.payload ? true : false
            }
        default:
            return state;
    }
};