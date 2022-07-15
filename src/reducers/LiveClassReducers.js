import {
    LIVECLASS_DETAIL, LIVECLASS_DETAIL_SUB_SAVEVIDEO, CLEAR_LIVECLASS_DETAIL, LIVECLASS_PRISMIC_PARAM, SET_POLL_MODAL, UPDATE_POLL_VALUES, LIVECLASS_FILTER_INSTRUCTOR
} from '../utilities';
import { stat } from 'fs';

const INITIAL_STATE = {
    liveclass_detail_data: {
        liveClasses: {
            liveclass: {
                description: ''
            },
            Polls:{
                
            }
        }
    },
    liveclass_prismic_data: {},
    is_poll_modal_open: false,
    liveclass_filter_instructor: 0

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case LIVECLASS_DETAIL:
            return {
                ...state,
                liveclass_detail_data: action.payload
            };
        case LIVECLASS_DETAIL_SUB_SAVEVIDEO:
            var workoutData = { ...state.liveclass_detail_data.liveClasses };
            var index = workoutData.likeMore.findIndex(x => x.id === action.payload.workoutId);
            if (action.flag) {
                workoutData.likeMore[index].WorkoutSaves = [{ workoutId: action.payload.workoutId }];
            } else {
                workoutData.likeMore[index].WorkoutSaves = [];
            }
            return {
                ...state,
                workout_detail_data: workoutData
            };
        case CLEAR_LIVECLASS_DETAIL:
            return {
                ...state,
                liveclass_detail_data: {
                    liveClasses: {
                        liveclass: {
                            description: ''
                        },
                        Polls:{

                        }
                    }
                }
            };
        case LIVECLASS_PRISMIC_PARAM:
            return {
                ...state,
                liveclass_prismic_data: action.payload
            };
        case LIVECLASS_FILTER_INSTRUCTOR:
            return {
                ...state,
                liveclass_filter_instructor: action.payload
            };
        case SET_POLL_MODAL:
            return {
                ...state,
                is_poll_modal_open: action.payload
            };
        case UPDATE_POLL_VALUES:
            console.log('UPDATE_POLL_VALUES', action.payload)
            var liveclass_detail_data = { ...state.liveclass_detail_data };
            //var pollData = { ...state.liveclass_detail_data.liveClasses.liveclass };
            liveclass_detail_data.liveClasses.liveclass.Polls = action.payload;
            return {
                ...state,
                liveclass_detail_data: liveclass_detail_data
            }
        default:
            return state;
    }
};