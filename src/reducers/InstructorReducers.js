import {
    INSTRUCTOR_LIST, INSTRUCTOR_DETAIL, INSTRUCTOR_DETAIL_SAVEVIDEO, CLEAR_INSTRUCTOR_LIST, CLEAR_INSTRUCTOR_DETAIL
} from '../utilities';

const INITIAL_STATE = {
    instructor_list: [],
    instructor_detail: {
        title:'',
        img: '',
        speciality: '',
        movement: '',
        qualifications: '',
        feelGoodFormula: '',
        location: '',
        bio: '',
        twitterLink: '',
        instagramLink: '',
        facebookLink: '',
        webLink: '',
        tiktokLink: '',
        linkedinLink: '',
        isLive:0
    },
    is_cms_model: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case INSTRUCTOR_LIST:
            return {
                ...state,
                instructor_list: action.payload
            };
        case CLEAR_INSTRUCTOR_LIST:
            return {
                ...state,
                instructor_list: []
            };
        case INSTRUCTOR_DETAIL:
            return {
                ...state,
                instructor_detail: action.payload
            };
        case CLEAR_INSTRUCTOR_DETAIL:
            return {
                ...state,
                instructor_detail: {
                    title:'',
                    img: '',
                    speciality: '',
                    movement: '',
                    qualifications: '',
                    feelGoodFormula: '',
                    location: '',
                    bio: '',
                    twitterLink: '',
                    instagramLink: '',
                    facebookLink: '',
                    webLink: '',
                    tiktokLink: '',
                    linkedinLink: '',
                    hasProfile: 1,
                    isLive:0
                }
            };
        case INSTRUCTOR_DETAIL_SAVEVIDEO:
            var instructorData = { ...state.instructor_detail };
            var index = instructorData.Workouts.findIndex(x => x.id === action.payload.workoutId);
            if (action.flag) {
                instructorData.Workouts[index].WorkoutSaves = [{ workoutId: action.payload.workoutId }];
            } else {
                instructorData.Workouts[index].WorkoutSaves = [];
            }
            return {
                ...state,
                instructor_detail: instructorData
            };
        default:
            return state;
    }
};