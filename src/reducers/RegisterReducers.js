import {
    REGISTER_NEXT_STEP,
    REGISTER_SET_STEP,
    REGISTER_PREV_STEP,
    REGISTER_PROCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    REGISTERFORM_UPDATE,
    UPDATE_COUNTRIESLIST,
    UPDATE_HEALTHCONDITION,
    UPDATE_CLINIC,
    UPDATE_PROMOCODEDATA,
    REGISTER_GOTO_STEP,
    ASSIGN_FACEBOOK_VALUES,
    UPDATE_CONDITION_RELATION,
    UPDATE_MEMBERSHIP_PLANS,
    INNER_REGISTER_NEXT_STEP,
    INNER_REGISTER_PREV_STEP,
    PACKSTER_GOTO_REGISTER,
    RESET_REGISTER,
    UPDATE_HEARABOUT,
    UPDATE_WARNING_BANNER,
    REGISTER_GET_INSTRUCTOR,
    REGISTER_SET_CONDITION_INDEX,
    UPDATE_LICENSE_LIST,
    UPDATE_COUNTRY_PLANS,
    CLEAR_REGISTERFORM,
    CHECK_CONDITION_CODE,
    SET_LOADING,
    SET_PAGE_TITLE,
    SET_NEW_USER
} from '../utilities';

const INITIAL_STATE = {
    sending_data: false,
    is_auth: false,
    user_data: {},
    step: 0,
    condition_index: 0,
    clinic_direction: 'forward',
    countries_list: [],
    healthcondition_list: [],
    warning_banner_text: [],
    heard_from: [],
    clinic_list: [],
    promo_plans: [],
    conditionRelationshipList: [],
    registerFormValues: { ispackster: false, userid: 0, terms: false, firstname: '', lastname: '', username: '', email: '', password: '', confirm_password: '', gender: '', profession: '', midicalcondition_livewith: '', country: '', health_condition: [], region: '', clinic_status: '', conditional_clinic: [], healthcondition_livewith: '', purpose: '', is_newfeature_updates: false, is_research_opportunities: false, dob_day: '', dob_month: '', dob_year: '', know_via: '', promocode: '', card_name: '', card_number: '', card_exp_year: '', card_exp_month: '', card_security_code: '', card_zipcode: '', membershipPlan: {}, facebookAccessToken: '', facebookId: '', facebookPicture: '', age: 0, usUser: false, krUser: false, shareKRUK: false, emailKRUK: false, ethnicity: '', comorbidities: [], kidney_care_provider: [], is_clinic_found: false, referee: '', beamchallenging: '', condition_professions: [], cancer_treatment: [], cancer_comordities: [], research: false, research_groupname: '', research_condition: '', research_share: '', isKBResearcheUser: false, condition_membership: [], eligible_license: {}, tagCode: {}, movement_prefs: [], cf_comordities: [], cf_disease_severity: [] },
    membershipPlan: [],
    instructorList: [],
    licenseList: [],
    countryPlans: {},
    isConditionHasCode: false,
    isLoading: false,
    page_title: "Choose your membership plan",
    is_new_user: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case RESET_REGISTER:
            console.log('RESET_REGISTER.registerFormValues')

            var registerFormValues = { ispackster: false, userid: 0, terms: false, firstname: '', lastname: '', username: '', email: '', password: '', confirm_password: '', gender: '', profession: '', midicalcondition_livewith: '', country: '', health_condition: [], region: '', clinic_status: '', conditional_clinic: [], healthcondition_livewith: '', purpose: '', is_newfeature_updates: false, is_research_opportunities: false, dob_day: '', dob_month: '', dob_year: '', know_via: '', promocode: '', card_name: '', card_number: '', card_exp_year: '', card_exp_month: '', card_security_code: '', card_zipcode: '', membershipPlan: {}, facebookAccessToken: '', facebookId: '', facebookPicture: '', age: 0, usUser: false, krUser: false, shareKRUK: false, emailKRUK: false, ethnicity: '', comorbidities: [], kidney_care_provider: [], is_clinic_found: false, referee: '', beamchallenging: '', condition_professions: [], cancer_treatment: [], cancer_comordities: [], research: false, research_groupname: '', research_condition: '', research_share: '', isKBResearcheUser: false, condition_membership: [], eligible_license: {}, tagCode: {}, movement_prefs: [], cf_comordities: [] };
            return {
                ...state,
                step: 0,
                clinic_direction: 'forward',
                registerFormValues: registerFormValues /* { ispackster: false, userid: 0, terms: false, firstname: '', lastname: '', username: '', email: '', password: '', confirm_password: '', gender: '', profession: '', midicalcondition_livewith: '', country: '', health_condition: [], region: '', clinic_status: '', conditional_clinic: [], healthcondition_livewith: '', purpose: '', is_newfeature_updates: false, is_research_opportunities: false, dob_day: '', dob_month: '', dob_year: '', know_via: '', promocode: '', card_name: '', card_number: '', card_exp_year: '', card_exp_month: '', card_security_code: '', card_zipcode: '', membershipPlan: {}, facebookAccessToken: '', facebookId: '', facebookPicture: '' } */
            };
        case PACKSTER_GOTO_REGISTER:
            var user = action.facebookData;
            var pic = user.picture && user.picture.data && user.picture.data.url ? user.picture.data.url : '';
            var firstname = (user.name) ? user.name : '';
            var username = (user.username) ? user.username : '';
            var email = (user.email) ? user.email : '';
            var facebookAccessToken = (user.accessToken) ? user.accessToken : '';
            var facebookId = (user.id) ? user.id : '';
            return {
                ...state,
                step: 3,
                clinic_direction: 'forward',
                registerFormValues: { ispackster: true, memberObj: action.memberObj, userid: action.payload, terms: false, firstname: firstname, lastname: '', username: username, email: '', password: '', confirm_password: '', gender: '', profession: '', midicalcondition_livewith: '', country: '', health_condition: [], region: '', clinic_status: '', conditional_clinic: [], healthcondition_livewith: '', purpose: '', is_newfeature_updates: false, is_research_opportunities: false, dob_day: '', dob_month: '', dob_year: '', know_via: '', promocode: '', card_name: '', card_number: '', card_exp_year: '', card_exp_month: '', card_security_code: '', card_zipcode: '', membershipPlan: {}, facebookAccessToken: facebookAccessToken, facebookId: facebookId, facebookPicture: pic }
            };
        case REGISTER_PROCESS:
            return {
                ...state,
                sending_data: action.payload
            };
        case REGISTER_SUCCESS:
            return {
                ...state,
                user_data: action.payload
            };
        case REGISTER_FAIL:
            return {
                ...state,
                sending_data: false
            };
        case REGISTER_NEXT_STEP:
            return {
                ...state,
                step: state.step + 1,
                //step: (state.step + 1 == 12) ? state.step + 2 : state.step + 1,
                clinic_direction: 'forward'
            };
        case REGISTER_SET_STEP:
            return {
                ...state,
                step: action.payload.step,
                clinic_direction: action.payload.type
            };
        case REGISTER_PREV_STEP:
            return {
                ...state,
                //step: state.step-1,
                step: (state.step - 1 == 12) ? state.step - 2 : state.step - 1,
                clinic_direction: 'backward'
            };
        case INNER_REGISTER_NEXT_STEP:
            return {
                ...state,
                clinic_direction: 'forward'
            };
        case INNER_REGISTER_PREV_STEP:
            return {
                ...state,
                clinic_direction: 'backward'
            };
        case REGISTER_GOTO_STEP:
            return {
                ...state,
                step: action.payload
            };
        case REGISTERFORM_UPDATE:
            return {
                ...state,
                registerFormValues: action.payload
            };
        case UPDATE_COUNTRIESLIST:
            return {
                ...state,
                countries_list: action.payload
            };
        case UPDATE_HEALTHCONDITION:
            return {
                ...state,
                healthcondition_list: action.payload
            };
        case UPDATE_WARNING_BANNER:
            return {
                ...state,
                warning_banner_text: action.payload
            };
        case UPDATE_HEARABOUT:
            return {
                ...state,
                heard_from: action.payload
            };
        case UPDATE_CLINIC:
            let clinic_list = action.payload;
            clinic_list.sort(function (a, b) {
                if (a.clinicName < b.clinicName) { return -1; }
                if (a.clinicName > b.clinicName) { return 1; }
                return 0;
            });
            return {
                ...state,
                clinic_list: clinic_list
            };
        case UPDATE_PROMOCODEDATA:
            return {
                ...state,
                promo_plans: action.payload
            };
        case ASSIGN_FACEBOOK_VALUES:
            var user = action.payload;
            var pic = user.picture && user.picture.data && user.picture.data.url ? user.picture.data.url : '';
            return {
                ...state,
                registerFormValues: { ...state.registerFormValues, firstname: user.first_name, lastname: user.last_name, email: user.email, facebookAccessToken: user.accessToken, facebookId: user.id, facebookPicture: pic }
            };
        case UPDATE_CONDITION_RELATION:
            return {
                ...state,
                conditionRelationshipList: action.payload
            };
        case UPDATE_MEMBERSHIP_PLANS:
            return {
                ...state,
                membershipPlan: action.payload.plans
            };
        case REGISTER_GET_INSTRUCTOR:
            return {
                ...state,
                instructorList: action.payload.instructors
            };
        case REGISTER_SET_CONDITION_INDEX:
            return {
                ...state,
                condition_index: action.payload,
            };
        case UPDATE_LICENSE_LIST:
            return {
                ...state,
                licenseList: action.payload,
            };
        case UPDATE_COUNTRY_PLANS:
            return {
                ...state,
                countryPlans: action.payload,
            };
        case CLEAR_REGISTERFORM:
            console.log('INITIAL_STATE.registerFormValues', INITIAL_STATE)
            var registerFormValues = { ispackster: false, userid: 0, terms: false, firstname: '', lastname: '', username: '', email: '', password: '', confirm_password: '', gender: '', profession: '', midicalcondition_livewith: '', country: '', health_condition: [], region: '', clinic_status: '', conditional_clinic: [], healthcondition_livewith: '', purpose: '', is_newfeature_updates: false, is_research_opportunities: false, dob_day: '', dob_month: '', dob_year: '', know_via: '', promocode: '', card_name: '', card_number: '', card_exp_year: '', card_exp_month: '', card_security_code: '', card_zipcode: '', membershipPlan: {}, facebookAccessToken: '', facebookId: '', facebookPicture: '', age: 0, usUser: false, krUser: false, shareKRUK: false, emailKRUK: false, ethnicity: '', comorbidities: [], kidney_care_provider: [], is_clinic_found: false, referee: '', beamchallenging: '', condition_professions: [], cancer_treatment: [], cancer_comordities: [], research: false, research_groupname: '', research_condition: '', research_share: '', isKBResearcheUser: false, condition_membership: [], eligible_license: {}, tagCode: {}, movement_prefs: [], cf_comordities: [] };
            return {
                ...state,
                registerFormValues: registerFormValues,
            };
        case CHECK_CONDITION_CODE:
            console.log('CHECK_CONDITION_CODE', action.payload.length)
            return {
                ...state,
                isConditionHasCode: action.payload.length ? true : false,
            };
        case SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }
        case SET_PAGE_TITLE:
            console.log('SET_PAGE_TITLE', action.payload)
            return {
                ...state,
                page_title: action.payload,
            };
        case SET_NEW_USER:
            return {
                ...state,
                is_new_user: action.payload,
            };
        default:
            return state;
    }
};
