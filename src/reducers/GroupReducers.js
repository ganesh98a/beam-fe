import {
    GROUP_JOIN_MODAL_OPEN,
    GROUP_IS_LEADER,
    GROUP_IS_ADMIN,
    GROUP_CMS_MODEL_OPEN,
    GROUP_ABOUT_DETAILS,
    CLEAR_GROUP_ABOUT_DETAILS
} from '../utilities';

const INITIAL_STATE = {
    is_join_modal: false,
    group_details: [],
    is_group_admin: false,
    is_group_leader: false,
    is_group_cms_open: false,
    group_about_details: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GROUP_JOIN_MODAL_OPEN:
            return {
                ...state,
                is_join_modal: action.payload,
                group_details: action.payloadData
            };
        case GROUP_IS_ADMIN:
            return {
                ...state,
                is_group_admin: action.payload
            }
        case GROUP_IS_LEADER:
            return {
                ...state,
                is_group_leader: action.payload
            }
        case GROUP_CMS_MODEL_OPEN:
            return {
                ...state,
                is_group_cms_open: action.payload
            };
        case GROUP_ABOUT_DETAILS:
            return {
                ...state,
                group_about_details: action.payload
            };
        case CLEAR_GROUP_ABOUT_DETAILS:
            return {
                ...state,
                group_about_details: []
            };
        default:
            return state;
    }
};