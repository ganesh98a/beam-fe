import {
    WORKOUT_DETAIL, SCHEDULE_MODEL_OPEN, WORKOUT_LIST, CLEAR_WORKOUT_LIST, ONDEMAND_WORKOUT_SAVE, ONDEMAND_WORKOUT_UNSAVE,
    ONDEMAND_DETAIL_SAVEVIDEO, UPDATE_SCHEDULE_MODEL_OPEN, ONDEMAND_DETAIL_SUB_SAVEVIDEO, UPDATE_AFTER_STATE, CLEAR_AFTER_STATE, UPDATE_OFFSET, SET_GOBACK, SET_CURRENT_POSITION, LIVECLASS_DETAIL_SUB_SAVEVIDEO, LIVECLASS_DETAIL, SCHEDULE_MODEL_TYPE, PUSH_HISTORY, GROUP_ONDEMAND_WORKOUT_SAVE, GROUP_ONDEMAND_WORKOUT_UNSAVE, GROUP_ONDEMAND_LIST, CLEAR_GROUP_ONDEMAND_LIST, ONDEMAND_CMS_MODEL_OPEN, CLEAR_WORKOUT_DETAIL, IMAGE_CROP_MODEL_OPEN, SET_CROPPED_IMAGE, SET_FILE_DATA, SET_AFTER_POPUP, SET_ENABLE_VIDEO, SET_END_VIDEO, SET_BEFORE_POPUP, SET_POST_POLL_MODAL, SET_RESEARCH_MODAL, SET_SAFETY_MODAL, SET_SURVEY_MODAL, SET_WARNING_MODAL, SET_CONDITION_MODAL, SET_PLAY_ONDEMAND_MODAL, UPDATE_WORKOUT_DETAIL
} from '../utilities';
import { stat } from 'fs';

const INITIAL_STATE = {
    liveclass_detail_data: {},
    workout_detail_data: {
        workout: {
            title: '',
            videoUrl: '',
            length: '',
            description: '',
        }
    },
    schedule_model_open: false,
    schedule_model_data: {},
    workout_list: [],
    group_ondemand_list: [],
    AfterModelState: { step: 1, rating: 0, comment: '' },
    offset: 0,
    isGoback: false,
    currentPosition: 0,
    schedule_model_type: '',
    prevPath: '',
    is_cms_model: false,
    cms_model_type: '',
    is_image_crop_open: false,
    cropped_image: '',
    cropped_file: '',
    workout_list_tags: [],
    workout_list_level: [],
    fileData: '',
    openAfterModel: false,
    enable_video: false,
    openBeforeModel: false,
    openPostPollModel: false,
    openResearchModel: false,
    openSafetyModel: false,
    openSurveyModel: false,
    openWarningModal: false,
    openConditionModalOpen: false,
    openPlayOndemand: false,
    get_program_detail: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CLEAR_WORKOUT_LIST:
            return {
                ...state,
                workout_list: [],
                workout_list_level: [],
                workout_list_tags: []
            };
        case CLEAR_WORKOUT_DETAIL:
            return {
                ...state,
                workout_detail_data: {
                    workout: {
                        title: '',
                        videoUrl: '',
                        length: '',
                        description: '',
                    }
                }
            };
        case WORKOUT_DETAIL:
            return {
                ...state,
                workout_detail_data: action.payload
            };
        case WORKOUT_LIST:
            var new_list = [...state.workout_list];
            var new_list_dicipline = [...state.workout_list_tags];
            var new_list_level = [...state.workout_list_level];
            if (action.payload) {
                new_list = [...state.workout_list, ...action.payload.workout];
                new_list_dicipline = [...state.workout_list_tags, ...action.payload.tags];
                new_list_level = [...state.workout_list_level, ...action.payload.tags];
            }
            return {
                ...state,
                workout_list: new_list,
                workout_list_tags: new_list_dicipline,
                workout_list_level: new_list_level,
            };
        case ONDEMAND_WORKOUT_SAVE:
            var list_data = [...state.workout_list];
            var index = list_data.findIndex(x => x.id === action.payload.workoutId);
            list_data[index].WorkoutSaves = [{ workoutId: action.payload.workoutId }];
            return {
                ...state,
                workout_list: list_data
            };
        case ONDEMAND_WORKOUT_UNSAVE:
            var list_data = [...state.workout_list];
            var index = list_data.findIndex(x => x.id === action.payload.workoutId);
            list_data[index].WorkoutSaves = [];
            return {
                ...state,
                workout_list: list_data
            };

        case ONDEMAND_DETAIL_SAVEVIDEO:
            var workoutData = { ...state.workout_detail_data };
            if (action.flag) {
                workoutData.workout.WorkoutSaves = [{ workoutId: action.payload.workoutId }];
            } else {
                workoutData.workout.WorkoutSaves = [];
            }
            return {
                ...state,
                workout_detail_data: workoutData
            };
        case ONDEMAND_DETAIL_SUB_SAVEVIDEO:
            var workoutData = { ...state.workout_detail_data };
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
        case LIVECLASS_DETAIL:
            return {
                ...state,
                liveclass_detail_data: action.payload
            };
        case SCHEDULE_MODEL_OPEN:
            return {
                ...state,
                schedule_model_open: action.payload,
                schedule_model_data: action.payloadData
            }
        case SCHEDULE_MODEL_TYPE:
            return {
                ...state,
                schedule_model_type: action.payload
            }
        case UPDATE_SCHEDULE_MODEL_OPEN:
            var handler = { ...state.schedule_model_data };
            handler.scheduledFor = action.payload;
            return {
                ...state,
                schedule_model_data: handler
            }
        case CLEAR_AFTER_STATE:
            return {
                ...state,
                AfterModelState: { step: 1, rating: 0, comment: '' }
            }
        case UPDATE_AFTER_STATE:
            return {
                ...state,
                AfterModelState: { ...state.AfterModelState, ...action.payload }
            }
        case UPDATE_OFFSET:
            console.log('UPDATE_OFFSET', action.payload)
            return {
                ...state,
                offset: action.payload
            }
        case SET_GOBACK:
            return {
                ...state,
                isGoback: action.payload
            }
        case SET_CURRENT_POSITION:
            return {
                ...state,
                currentPosition: action.payload
            }
        case PUSH_HISTORY:
            return {
                ...state,
                prevPath: action.payload
            }
        case CLEAR_GROUP_ONDEMAND_LIST:
            return {
                ...state,
                group_ondemand_list: []
            };
        case GROUP_ONDEMAND_LIST:
            var new_list = [...state.group_ondemand_list, ...action.payload];
            return {
                ...state,
                group_ondemand_list: new_list
            };
        case GROUP_ONDEMAND_WORKOUT_SAVE:
            var list_data = [...state.group_ondemand_list];
            var index = list_data.findIndex(x => x.id === action.payload.workoutId);
            list_data[index].WorkoutSaves = [{ workoutId: action.payload.workoutId }];
            return {
                ...state,
                group_ondemand_list: list_data
            };
        case GROUP_ONDEMAND_WORKOUT_UNSAVE:
            var list_data = [...state.group_ondemand_list];
            var index = list_data.findIndex(x => x.id === action.payload.workoutId);
            list_data[index].WorkoutSaves = [];
            return {
                ...state,
                group_ondemand_list: list_data
            };
        case ONDEMAND_CMS_MODEL_OPEN:
            return {
                ...state,
                is_cms_model: action.payload.open,
                cms_model_type: action.payload.type,

            }
        case IMAGE_CROP_MODEL_OPEN:
            return {
                ...state,
                is_image_crop_open: action.payload
            }
        case SET_CROPPED_IMAGE:
            return {
                ...state,
                cropped_image: action.payload.croppedImageUrl,
                cropped_file: action.payload.blobFile
            }
        case SET_FILE_DATA:
            console.log('SET_FILE_DATA', action.payload)
            return {
                ...state,
                fileData: action.payload
            }
        case SET_AFTER_POPUP:
            console.log('SET_AFTER_POPUP', action.payload)

            return {
                ...state,
                openAfterModel: action.payload
            }
        case SET_ENABLE_VIDEO:
            console.log('SET_ENABLE_VIDEO', action.payload)

            return {
                ...state,
                enable_video: action.payload
            }
        case SET_END_VIDEO:
            console.log('SET_END_VIDEO', action.payload)

            return {
                ...state,
                end_video: action.payload
            }
        case SET_BEFORE_POPUP:
            console.log('SET_BEFORE_POPUP', action.payload)

            return {
                ...state,
                openBeforeModel: action.payload
            }
        case SET_POST_POLL_MODAL:
            console.log('SET_POST_POLL_MODAL', action.payload)

            return {
                ...state,
                openPostPollModel: action.payload
            }
        case SET_RESEARCH_MODAL:
            console.log('SET_RESEARCH_MODAL', action.payload)

            return {
                ...state,
                openResearchModel: action.payload
            }
        case SET_SAFETY_MODAL:
            console.log('SET_SAFETY_MODAL', action.payload)

            return {
                ...state,
                openSafetyModel: action.payload
            }
        case SET_SURVEY_MODAL:
            console.log('SET_SURVEY_MODAL', action.payload)

            return {
                ...state,
                openSurveyModel: action.payload
            }
        case SET_WARNING_MODAL:
            console.log('SET_WARNING_MODAL', action.payload)

            return {
                ...state,
                openWarningModal: action.payload
            }
        case SET_CONDITION_MODAL:
            console.log('SET_CONDITION_MODAL', action.payload)

            return {
                ...state,
                openConditionModalOpen: action.payload
            }
        case SET_PLAY_ONDEMAND_MODAL:
            console.log('SET_PLAY_ONDEMAND_MODAL', action.payload)

            return {
                ...state,
                openPlayOndemand: action.payload
            }
        case UPDATE_WORKOUT_DETAIL:
            var temp_data = { ...state.workout_detail_data };
            console.log('temp_data', temp_data)
            temp_data = { ...state.workout_detail_data, ...action.payload };
            console.log('temp_data1', temp_data)
            return {
                ...state,
                workout_detail_data: temp_data
            };
        default:
            return state;
    }
};
