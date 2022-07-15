import {
    LOGIN_MODEL_OPEN,
    START_LOADER,
    STOP_LOADER,
    LOGGED_USERDATA,
    LOGGED_USERDATA_UPDATE,
    FORGOT_MODEL_OPEN,
    UPDATE_NOTIFICATION_MSG,
    CUSTOM_NOTIFICATION_UPDATE,
    CANCEL_BANNER,
    CANCEL_BANNER_KD,
    CHANGE_CMS_MODE,
    CHANGE_GROUP_CMS_MODE,
    CANCEL_BANNER_PC,
    GET_FOOTER,
    GET_FEATURES,
    CHECK_MENU_HAS_DATA,
    IS_OPEN_POLICY,
    SET_MODULE_DATA_COUNT,
    SET_FAQ_DATA,
    URL_ROUTING,IS_OPEN_CLINIC, SET_CLINIC_POPUP_RESPOND
} from '../utilities';
import * as constand from '../constant';
import {
    commonService
} from '../_services';

const INITIAL_STATE = {
    is_loginModelOpen: false,
    is_forgotModelOpen: false,
    loader_state: false,
    logged_userData: {},
    notification_data: {
        notification: [],
        userDetails: []
    },
    close_banner: false,
    close_banner_kd: false,
    is_create_mode: false,
    is_group_mode: false,
    close_banner_pc: false,
    footer_content: [],
    features_list: [],
    beamer_filter: "",
    is_menu_has_data: true,
    is_policy_open: false,
    module_data: [],
    faq_data: [],
    url_conditon: [],
    is_clinic_model_open: false,
    is_clinic_popup_respond: false,
};

function returnConditionalList(userData) {
    var returnData = [];
    if (userData && userData.UserConditions) {
        var dataObj = userData.UserConditions;
        dataObj.map(function (item) {
            if (item.Tag.type === "condition") {
                returnData.push(item.conditionId);
            }
        });
    }
    return returnData;
}

function getBeamer(authData) {
    var Beamer_Relationship = '';
    var beamerGender = constand.Beamer_Gender[authData.gender];
    var beamerCountry = authData.country ? authData.Country.countryName : '';
    if (beamerGender != undefined) {
        Beamer_Relationship = beamerGender;
    }

    if (beamerCountry) {
        beamerCountry = (commonService.toUpperEachWord(beamerCountry)).replace(/ /g, '');
        Beamer_Relationship = Beamer_Relationship + ';' + beamerCountry;
        Beamer_Relationship = Beamer_Relationship + ';' + beamerCountry + beamerGender;
    }

    authData.UserConditions.map(element => {

        if (Beamer_Relationship) {
            //conditions 
            Beamer_Relationship = Beamer_Relationship + ';' + constand.Beamer_condidtion_Tag[element.Tag.tag];
            Beamer_Relationship = Beamer_Relationship + ';' + constand.Beamer_condidtion_Tag[element.Tag.tag] + constand.Beamer_Gender[authData.gender];
            Beamer_Relationship = Beamer_Relationship + ';' + beamerCountry + constand.Beamer_condidtion_Tag[element.Tag.tag];
            Beamer_Relationship = Beamer_Relationship + ';' + beamerCountry + constand.Beamer_condidtion_Tag[element.Tag.tag] + constand.Beamer_Gender[authData.gender];

            //relationship
            if (constand.Beamer_Relationship[element.conditionRelationship] != undefined) {
                Beamer_Relationship = Beamer_Relationship + ';' + constand.Beamer_Relationship[element.conditionRelationship];
                Beamer_Relationship = Beamer_Relationship + ';' + constand.Beamer_condidtion_Tag[element.Tag.tag] + constand.Beamer_Relationship[element.conditionRelationship];

                Beamer_Relationship = Beamer_Relationship + ';' + constand.Beamer_Relationship[element.conditionRelationship] + constand.Beamer_Gender[authData.gender];
                Beamer_Relationship = Beamer_Relationship + ';' + constand.Beamer_condidtion_Tag[element.Tag.tag] + constand.Beamer_Relationship[element.conditionRelationship] + constand.Beamer_Gender[authData.gender];

                Beamer_Relationship = Beamer_Relationship + ';' + beamerCountry + constand.Beamer_Relationship[element.conditionRelationship];
                Beamer_Relationship = Beamer_Relationship + ';' + beamerCountry + constand.Beamer_condidtion_Tag[element.Tag.tag] + constand.Beamer_Relationship[element.conditionRelationship];

                Beamer_Relationship = Beamer_Relationship + ';' + beamerCountry + constand.Beamer_Relationship[element.conditionRelationship] + constand.Beamer_Gender[authData.gender];
                Beamer_Relationship = Beamer_Relationship + ';' + beamerCountry + constand.Beamer_condidtion_Tag[element.Tag.tag] + constand.Beamer_Relationship[element.conditionRelationship] + constand.Beamer_Gender[authData.gender];
            }
            //Beamer_Relationship = Beamer_Relationship + ';' + 'UnitedKingdomLivingwithConditionFemale';
            // Beamer_Relationship = 'Australia;AustraliaKidneyDiseaseLivingwithCondition';
        }
    });
    console.log("Beamer_Relationship", Beamer_Relationship);
    return Beamer_Relationship;
}
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN_MODEL_OPEN:
            return {
                ...state,
                is_loginModelOpen: action.payload
            };
        case CHANGE_CMS_MODE:
            console.log('CHANGE_CMS_MODE', action.payload)
            localStorage.setItem('isCreateMode', JSON.stringify(action.payload))
            return {
                ...state,
                is_create_mode: action.payload
            };
        case CHANGE_GROUP_CMS_MODE:
            return {
                ...state,
                is_group_mode: action.payload,
                    is_create_mode: action.payload
            };
        case FORGOT_MODEL_OPEN:
            return {
                ...state,
                is_forgotModelOpen: action.payload
            }
        case START_LOADER:
            return {
                ...state,
                loader_state: true
            };
        case STOP_LOADER:
            return {
                ...state,
                loader_state: false
            };
        case CANCEL_BANNER:
            return {
                ...state,
                close_banner: true
            };
        case CANCEL_BANNER_KD:
            return {
                ...state,
                close_banner_kd: true
            };
        case CANCEL_BANNER_PC:
            return {
                ...state,
                close_banner_pc: true
            };
        case LOGGED_USERDATA:
            var userData = action.payload;
            /*  userData.profilePic = userData.profilePic
                 ? constand.PROFILE_IMAGE_PATH + userData.profilePic
                 : constand.WEB_IMAGES + "no-profile-pic.png"; */
            userData.conditionList = returnConditionalList(userData);
            userData.membershipData = action.membershipData;
            var beamer_data = getBeamer(userData);
            return {
                ...state,
                logged_userData: userData,
                beamer_filter: beamer_data
            };
        case LOGGED_USERDATA_UPDATE:
            console.log('LOGGED_USERDATA_UPDATE', action.payload)
            var user_data = { ...state.logged_userData, ...action.payload }
            localStorage.setItem('userDetails', JSON.stringify(user_data))
            return {
                ...state,
                logged_userData: user_data
            };
        case UPDATE_NOTIFICATION_MSG:
            let response = action.payload;
            let notification = (response.notifcation) ? response.notifcation : [];
            let userDetails = (response.userDetails) ? response.userDetails : [];
            return {
                ...state,
                notification_data: { notification: notification, userDetails: userDetails }
            };
        case CUSTOM_NOTIFICATION_UPDATE:
            return {
                ...state,
                notification_data: { ...state.notification_data, ...action.payload }
            };
        case GET_FOOTER:
            console.log('GET_FOOTER', action.payload)
            return {
                ...state,
                footer_content: action.payload.length ? action.payload[0] : {}
            };
        case GET_FEATURES:
            return {
                ...state,
                features_list: action.payload ? action.payload : {}
            };
        case CHECK_MENU_HAS_DATA:
            console.log('CHECK_MENU_HAS_DATA', action.payload)
            return {
                ...state,
                is_menu_has_data: action.payload ? true : false
            };
        case IS_OPEN_POLICY:
            return {
                ...state,
                is_policy_open: action.payload
            };
        case SET_MODULE_DATA_COUNT:
            return {
                ...state,
                module_data: action.payload
            };
        case SET_FAQ_DATA:
            return {
                ...state,
                faq_data: action.payload
            };
        case URL_ROUTING:
            console.log("action url_condition", action.payload)
            var url_condition = []
            action.payload.forEach((val) => {
                val.value = JSON.parse(val.value)
                url_condition.push(val)
            })
            localStorage.setItem('url_alias_condition', JSON.stringify(url_condition))

            return {
                ...state,
                url_condition: url_condition
            }
        case IS_OPEN_CLINIC:
            return {
                ...state,
                is_clinic_model_open: action.payload
            };
        case SET_CLINIC_POPUP_RESPOND:
            return {
                ...state,
                is_clinic_popup_respond: action.payload
            };
        default:
            return state;
    }
};