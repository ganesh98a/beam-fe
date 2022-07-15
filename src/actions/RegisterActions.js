import * as constand from '../constant';
import {
  getData,
  postData
} from '../_helpers/api-helper';
import handleResponse from '../_services/handle.service';
import {
  REGISTER_NEXT_STEP,
  REGISTER_SET_STEP,
  REGISTER_PREV_STEP,
  REGISTER_PROCESS,
  REGISTER_SUCCESS,
  PACKSTER_GOTO_REGISTER,
  UPDATE_COUNTRIESLIST,
  REGISTERFORM_UPDATE,
  UPDATE_HEALTHCONDITION,
  UPDATE_CLINIC,
  UPDATE_PROMOCODEDATA,
  REGISTER_GOTO_STEP,
  ASSIGN_FACEBOOK_VALUES,
  UPDATE_CONDITION_RELATION,
  SET_CONDITION,
  UPDATE_MEMBERSHIP_PLANS,
  INNER_REGISTER_PREV_STEP,
  INNER_REGISTER_NEXT_STEP,
  CHECK_ISAUTH,
  LOGIN_SUCCESS,
  RESET_REGISTER,
  UPDATE_HEARABOUT,
  UPDATE_WARNING_BANNER,
  REGISTER_GET_INSTRUCTOR,
  SET_CHALLENGE_TAG,
  REGISTER_SET_CONDITION_INDEX,
  UPDATE_LICENSE_LIST,
  UPDATE_COUNTRY_PLANS,
  CLEAR_REGISTERFORM,
  CHECK_CONDITION_CODE,
  SET_LOADING,
  SET_PAGE_TITLE,
  SET_NEW_USER
} from '../utilities';
import {
  commonService
} from "../_services";
require('es6-promise').polyfill();
require('isomorphic-fetch');
var moment = require('moment-timezone');

export function saveValues(formData) {

  return (dispatch, getState) => {
    dispatch({
      type: REGISTER_PROCESS,
      payload: true
    });

    dispatch({
      type: REGISTER_SUCCESS,
      payload: formData
    });
  }
}

export function nextStep() {
  return (dispatch, getState) => {
    dispatch({
      type: REGISTER_NEXT_STEP
    });
  }
}
export function setStep(step, type) {
  return (dispatch, getState) => {
    dispatch({
      type: REGISTER_SET_STEP,
      payload: {
        step: step,
        type: type
      }
    });
  }
}
export function prevStep() {
  return (dispatch, getState) => {
    dispatch({
      type: REGISTER_PREV_STEP
    });
  }
}
export function gotoStep(step) {
  return (dispatch, getState) => {
    dispatch({
      type: REGISTER_GOTO_STEP,
      payload: step
    });
  }
}
export function packsterGotoRegister(userid = 0, membershipObj = {}, facebookData) {
  return (dispatch, getState) => {
    dispatch({
      type: PACKSTER_GOTO_REGISTER,
      payload: userid,
      memberObj: membershipObj,
      facebookData: (facebookData) ? facebookData : {}
    });
  }
}
export function registerformUpdate(formData) {
  return (dispatch, getState) => {
    dispatch({
      type: REGISTERFORM_UPDATE,
      payload: formData
    });
  }
}
export function getCountriesList() {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/country', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        dispatch({
          type: UPDATE_COUNTRIESLIST,
          payload: response.country
        });
        return response;
      });
  }
}

export function getRegionList(countryId) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/region?countryId=' + countryId, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        // dispatch({
        //     type: UPDATE_COUNTRIESLIST,
        //     payload: response.region
        // });
        return response;
      });
  }
}

export function healthCondition() {
  console.log('healthCondition')

  return (dispatch, getState) => {
    const requestOptions = getData();
    console.log('healthCondition-step1', requestOptions)

    return fetch(constand.BACKEND_URL + '/api/healthCondition', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        console.log('healthCondition response', response)
        dispatch({
          type: UPDATE_HEALTHCONDITION,
          payload: (response.condition) ? response.condition : []
        });
        return response;
      });
  }
}
export function warningBanner() {

  return (dispatch, getState) => {
    const requestOptions = getData();

    return fetch(constand.BACKEND_URL + '/api/blog/banner', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        dispatch({
          type: UPDATE_WARNING_BANNER,
          payload: (response.data) ? response.data.warning_text : []
        });
        return response;
      });
  }
}
export function privacyPage() {

  return (dispatch, getState) => {
    const requestOptions = getData();

    return fetch(constand.BACKEND_URL + '/api/blog/privacy', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        /* dispatch({
          type: PRIVACY_PAGE,
          payload: (response.data) ? response.data.warning_text : []
        }); */
        return response;
      });
  }
}

export function teensOnBeam() {

  return (dispatch, getState) => {
    const requestOptions = getData();

    return fetch(constand.BACKEND_URL + '/api/blog/teensOnBeam', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

export function getDynamicPage(data) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    var pageId = data;
    console.log("pageId",pageId)
    let url = constand.BACKEND_URL + '/api/blog/dynamicPage/' + pageId;
    return fetch(url, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

export function hearabout() {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/hearAbout', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        dispatch({
          type: UPDATE_HEARABOUT,
          payload: (response.hearddata) ? response.hearddata : []
        });
        return response;
      });
  }
}

export function getClinic(country_id, health_condition_id) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/clinics?countryId=' + country_id + '&conditionId=' + health_condition_id, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        dispatch({
          type: UPDATE_CLINIC,
          payload: response.clinics
        });
        return response;
      });
  }
}

export function innerGoState(flag) {
  return (dispatch, getState) => {
    if (flag === "backward") {
      dispatch({
        type: INNER_REGISTER_PREV_STEP
      });
    } else {
      dispatch({
        type: INNER_REGISTER_NEXT_STEP
      });
    }
  }
}

export function getPromocodePaln(promoCode, conditionId = 0) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    var url = constand.BACKEND_URL + '/api/plan/promo?code=' + promoCode;
    if (conditionId) {
      url = constand.BACKEND_URL + '/api/plan/promo?code=' + promoCode + '&conditionId=' + conditionId;
    }
    return fetch(url, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        dispatch({
          type: UPDATE_PROMOCODEDATA,
          payload: response.plans
        });
        return response;
      });
  }
}

export function isUserSubscribed() {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/checkUserSubscribed', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}
/**
 *Assign facebook values in register reducer
 */
export function assignFacebookValues(user) {
  return async (dispatch, getState) => {
    if (user) {
      dispatch({
        type: ASSIGN_FACEBOOK_VALUES,
        payload: user
      })
    } else {
      dispatch({
        type: ASSIGN_FACEBOOK_VALUES
      })
    }
  }
}

/**
get condition relationships values
**/
export function fetchConditionRelationships() {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/getConditionRelationships')
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        dispatch({
          type: UPDATE_CONDITION_RELATION,
          payload: response.relations
        });
        return response;
      });
  }
}

/**
get cargiver Types
**/
export function cargiverTypes() {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/getCaregiverTypes')
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

/**
get Professions list
**/
export function getProfessions() {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/getProfessions')
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

/**
 validate username and mail
**/
export function checkUserExist(dataObject) {
  return (dispatch, getState) => {
    const requestOptions = postData(dataObject);
    return fetch(constand.BACKEND_URL + '/api/checkUserExist', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

/**
 validate promocode
**/
export function checkMaxUsagePromo(dataObject) {
  return (dispatch, getState) => {
    const requestOptions = postData(dataObject);
    return fetch(constand.BACKEND_URL + '/api/checkMaxUsagePromo', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}
/**
fetch Membership Plans
**/
export function fetchMembershipPlans(code) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/plans?countryCode=' + code)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        dispatch({
          type: UPDATE_MEMBERSHIP_PLANS,
          payload: response
        });
        return response;
      });
  }
}

/*
 *register new user
 */
export function registerNewUser(params) {
  console.log('registerNewUser', params)
  var tags = [];
  if (params.shareKRUK)
    tags.push('shareKRUK');
  if (params.emailKRUK)
    tags.push('emailKRUK');

  var healcondition = params.health_condition.length > 1 ? constand.CONDITION : (params.health_condition.length > 0 ? params.health_condition[0].tag : constand.CONDITION);
  var finalCondition = (/\s/.test(healcondition)) ? commonService.replaceChar(healcondition.trim(), false) : healcondition;
  console.log('finalcondition', finalCondition)
  for (var n = 0; n < params.health_condition.length; n++) {
    var health_conditionId = params.health_condition[
      n
    ].id;
    var test_CC = params.conditional_clinic.filter((e) => e.conditionId === health_conditionId).map((value, index) => {
      return (
        index
      );
    });
    if (test_CC.length <= 0) {
      var createObject = {
        conditionId: health_conditionId,
        clinicId: ''
      };
      params.conditional_clinic.push(createObject);
    }
  }

  return (dispatch, getState) => {
    let dataObj = {
      userid: params.userid,
      email: params.email,
      password: params.password,
      // postcode: params.postcode,
      name: params.firstname,
      lastname: params.lastname,
      zoneName: moment.tz.guess(true),
      facebookId: params.facebookId,
      facebookAccessToken: params.facebookAccessToken,
      facebookPicture: params.facebookPicture,
      nickname: params.username,
      permission_newFeatures: params.is_newfeature_updates ? 1 : 0,
      permission_research: params.is_research_opportunities ? 1 : 0,
      terms: params.terms ? 1 : 0,
      gender: params.gender,
      country: params.country,
      region: params.region,
      promo: params.promocode,
      usage: params.purpose ?
        constand.Resgister_useage[parseInt(params.purpose)] :
        null,
      dob: params.dob_year + "-" + params.dob_month + "-" + params.dob_day,
      howHeard: null,
      source: params.know_via ? params.know_via : null,
      planId: params.membershipPlan.id ? params.membershipPlan.id : null,
      conditionId: params.health_condition.length > 0 ?
        params.health_condition.map(value => value.id) :
        null,
      condition_relationship: params.profession ?
        constand.Resgister_condition_relationship[parseInt(params.profession)] :
        null,
      caregiver_type: params.healthcondition_livewith ?
        constand.Resgister_caregiver_type[
          parseInt(params.healthcondition_livewith)
        ] :
        null,
      clinician_type: params.midicalcondition_livewith ?
        constand.clinician_type[parseInt(params.midicalcondition_livewith)] :
        null,
      //clinicId:params.clinic_status.length > 0 ? params.clinic_status[0].id : null,
      number: params.card_number,
      exp_month: params.card_exp_month,
      exp_year: params.card_exp_year,
      cvc: params.card_security_code,
      conditions: params.conditional_clinic,
      usUser: params.usUser,
      krUser: params.krUser,
      tags: tags,
      ethnicity: params.ethnicity,
      comorbidities: params.comorbidities,
      kidney_care_provider: params.kidney_care_provider,
      referee: params.referee,
      beamchallenging: params.beamchallenging,
      research: params.research,
      research_groupname: params.research_groupname,
      research_condition: params.research_condition,
      research_share: params.research_share,
      condition_professions: params.condition_professions,
      cancer_treatment: params.cancer_treatment,
      cancer_comordities: params.cancer_comordities,
      condition_membership: params.condition_membership,
      isKBResearcheUser: params.isKBResearcheUser,
      tagCode: params.tagCode,
      movement_prefs: params.movement_prefs,
      cf_comordities: params.cf_comordities,
      cf_disease_severity: params.cf_disease_severity,
      kd_other_clinic:params.other_clinic
    };
    //console.log(JSON.stringify(dataObj));
    const requestOptions = postData(dataObj);
    let url;
    if (params.ispackster && (dataObj.userid > 0)) {
      url = constand.BACKEND_URL + '/api/user/update';
    } else {
      url = constand.BACKEND_URL + '/api/signup';
    }
    return fetch(url, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(user => {

        return user;
      });
  }
}

/**
 validate username and mail
**/
export function getConditionBasedInstructor(dataObject) {
  return (dispatch, getState) => {
    const requestOptions = postData(dataObject);
    return fetch(constand.BACKEND_URL + '/api/getConditionBasedInstructor', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        dispatch({
          type: REGISTER_GET_INSTRUCTOR,
          payload: response
        });
        return response;
      });
  }
}

export function setConditionIndex(step) {
  return (dispatch, getState) => {
    dispatch({
      type: REGISTER_SET_CONDITION_INDEX,
      payload: step
    });
  }
}

export function getQuickLinks(condition) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/ondemand/quicklinks/' + condition, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}


export function getTagsBasedOnType(type) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/getTagsByType?type=' + type, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

export function getLicenseList() {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/license', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        dispatch({
          type: UPDATE_LICENSE_LIST,
          payload: response.license
        });
        return response;
      });
  }
}

/**
Get Plans by country id
**/
export function getPlanByCountry(country) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/plans/country?countryId=' + country)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        dispatch({
          type: UPDATE_COUNTRY_PLANS,
          payload: response.plans
        });
        return response;
      });
  }
}
/**
 * To clear form data
 * @param {*} formData 
 * @returns 
 */
export function clearRegisterFormUpdate() {
  return (dispatch, getState) => {
    /* dispatch({
      type: CLEAR_REGISTERFORM
    }); */
    dispatch({
      type: RESET_REGISTER
    });
  }
}
/**
 * 
 * @param {*} condition 
 * @returns 
 */
export function checkConditionHasTagCode(condition) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/getConditionTagCode?conditionId=' + condition, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        dispatch({
          type: CHECK_CONDITION_CODE,
          payload: response.tagCode
        });
        return response;
      });
  }
}

export function validateTagCodes(promoCode, conditionId = 0) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    var url = constand.BACKEND_URL + '/api/checkTagCodes?code=' + promoCode;
    if (conditionId) {
      url = constand.BACKEND_URL + '/api/checkTagCodes?code=' + promoCode + '&conditionId=' + conditionId;
    }
    return fetch(url, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        /* dispatch({
          type: UPDATE_PROMOCODEDATA,
          payload: response.plans
        }); */
        return response;
      });
  }
}
//General / membership user signup 
export function afterSignupComplete() {
  console.log('afterSignupComplete', localStorage.getItem('userMidSignup'));
  var user = JSON.parse(localStorage.getItem('userMidSignup'));
  return (dispatch, getState) => {
    dispatch({
      type: RESET_REGISTER
    });
    if (user) {
      dispatch({
        type: CHECK_ISAUTH,
        payload: true
      })
      dispatch({
        type: LOGIN_SUCCESS,
        payload: user
      })
      /* dispatch({
        type: SET_CONDITION,
        payload: finalCondition //constand.CONDITION
      }); */
      dispatch({
        type: SET_CHALLENGE_TAG,
        payload: user.beamchallenging ? false : true //constand.CONDITION
      });
      console.log('Register SET_CHALLENGE_TAG');
      // user.authdata = window.btoa(dataObj.email + ':' + dataObj.password);
      // localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('user', localStorage.getItem('userMidSignup'));

    }
  }
}

export function set_loading(param) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_LOADING,
      payload: param
    });
  }
}
//Other user signup 
export function afterSignupOtherUsers() {
  console.log('afterSignupOtherUsers', localStorage.getItem('user'));
  var user = JSON.parse(localStorage.getItem('user'));
  return (dispatch, getState) => {
    dispatch({
      type: RESET_REGISTER
    });
    if (user) {
      dispatch({
        type: CHECK_ISAUTH,
        payload: true
      })
      dispatch({
        type: LOGIN_SUCCESS,
        payload: user
      })
      /* dispatch({
        type: SET_CONDITION,
        payload: finalCondition //constand.CONDITION
      }); */
      dispatch({
        type: SET_CHALLENGE_TAG,
        payload: user.beamchallenging ? false : true //constand.CONDITION
      });
      console.log('Register SET_CHALLENGE_TAG');
      // user.authdata = window.btoa(dataObj.email + ':' + dataObj.password);
      // localStorage.setItem('user', JSON.stringify(user));
      // localStorage.setItem('user', localStorage.getItem('userMidSignup'));

    }
  }
}

export function setPageTitle(title) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_PAGE_TITLE,
      payload: title
    });
  }
}

export function getOnboardingTags(type) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/getOnboardingTags', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

export function setNewUser(flag) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_NEW_USER,
      payload: flag
    });
  }
}
