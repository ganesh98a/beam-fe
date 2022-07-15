import {
    PROGRAM_DETAIL,
    SET_PROGRAM_ACTIVE_SLIDER,
    SET_PROGRAM_ACTIVE_TYPE
} from '../utilities';

const INITIAL_STATE = {
   program_detail:[],
   active_slider:0,
   active_type:'core'
};

export default (state = INITIAL_STATE, action) => {
   switch (action.type) {
       case PROGRAM_DETAIL:
        return {
               ...state,
               program_detail: action.payload
           }
       case SET_PROGRAM_ACTIVE_SLIDER:
        return {
               ...state,
               active_slider: action.payload
           }
       case SET_PROGRAM_ACTIVE_TYPE:
        return {
               ...state,
               active_type: action.payload
           }
       default:
           return state;
   }
};
