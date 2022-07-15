import {
    SET_SLIDER_VALUE, SET_DATEPICKER_VALUE, SET_TIME_VALUE, SET_DATE_VALUE, CLEAR_ACTIVITY_LIST, SET_ACTIVITY_LIST, UPDATE_JSON_SCHEMA_FORM_DATA, GET_USER_PROGRAMS, UPDATE_USER_PROGRAMS
} from '../utilities';
import { commonService } from "../_services";

const INITIAL_STATE = {
    sliderValue: '',
    selectedDate: new Date(),
    selectedTime: '',
    datePickerValue: '',
    all_activity_list: [],
    json_form_data: {},
    program_list: {},

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_SLIDER_VALUE:
            return {
                ...state,
                sliderValue: action.payload
            };
        case SET_DATE_VALUE:
            return {
                ...state,
                selectedDate: action.payload
            };
        case SET_TIME_VALUE:
            console.log('SET_TIME_VALUE', action.payload)
            return {
                ...state,
                selectedTime: action.payload
            };
        case SET_DATEPICKER_VALUE:
            var stateValue = { ...state };
            console.log('SET_DATEPICKER_VALUE', stateValue)
            var selectedDay = stateValue.selectedDate
            var selectedTime = stateValue.selectedTime
            var comb = commonService.formatDateFromString(selectedDay) + ' ' + commonService.formatTimeFromSelector(selectedTime);
            var dateObj = new Date(comb);
            var datetime = new Date(dateObj).toISOString()
            return {
                ...state,
                datePickerValue: datetime,
            };
        case CLEAR_ACTIVITY_LIST:
            return {
                ...state,
                all_activity_list: [],
                sliderValue: ''
            };
        case SET_ACTIVITY_LIST:
            var new_list = [...state.all_activity_list, ...action.payload];
            return {
                ...state,
                all_activity_list: new_list
            };
        case UPDATE_JSON_SCHEMA_FORM_DATA:
            //var new_list = {}...state.json_form_data, ...action.payload];
            return {
                ...state,
                json_form_data: action.payload
            };
        case GET_USER_PROGRAMS:
            //var new_list = {}...state.json_form_data, ...action.payload];
            return {
                ...state,
                program_list: action.payload
            };
        case UPDATE_USER_PROGRAMS:
            console.log('UPDATE_USER_PROGRAMS', action.payload)
            var program_list = { ...state.program_list, ...action.payload }
            return {
                ...state,
                program_list: program_list
            };
        default:
            return state;
    }
};

