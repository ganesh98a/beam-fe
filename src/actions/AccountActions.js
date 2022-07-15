import * as constand from '../constant';
import { postData, getData } from '../_helpers/api-helper';
import handleResponse from '../_services/handle.service';
import { LOGGED_USERDATA, IP_DATA, UPDATE_MEMBERSHIP_PLANS, SET_INITIAL_CONDITION, SET_EXPLORE_CONDITION } from '../utilities';

/**
 * to get user details
 * @param {*} data 
 */
export function fetchUserDetails() {
    return (dispatch, getState) => {
        const requestOptions = getData();
        let url = constand.BACKEND_URL + '/api/account/userDetails';

        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                console.log('responseacc', response)

                dispatch({
                    type: LOGGED_USERDATA,
                    payload: (response.user) ? response.user : {},
                    membershipData: { hasmembership: response.hasmembership, accounttype: response.accounttype, countryCode: response.countryCode, country: response.country, userPlanDetails: response.userPlanDetails },
                    isTeensOnBeam: response.isTeensOnBeam
                });
                var userConditions = (response.user) ? (response.user.UserConditions ? response.user.UserConditions : {}) : {};
                response.user.isTeensOnBeam = response.isTeensOnBeam ? response.isTeensOnBeam : '';
                var singleConditions = (userConditions.length == 0 || userConditions.length > 1) ? constand.CONDITION : userConditions[0].Tag.tag;

                if (response.user.isStudyUser || response.user.isStudyInstructor || response.user.isStudyLeader || response.user.isGroupLeader) {
                    singleConditions = userConditions.length ? userConditions[0].Tag.tag : '';
                }

                dispatch({
                    type: SET_INITIAL_CONDITION,
                    payload: singleConditions
                });
                localStorage.setItem('country', response.countryCode);
                localStorage.setItem('userDetails', JSON.stringify(response.user));

                getUserCountryPlan(response.countryCode, dispatch);

                //return response;
            });
    }
}

function getUserCountryPlan(code, dispatch) {
    return fetch(constand.BACKEND_URL + '/api/plans?countryCode=' + code)
        .then((response) => handleResponse(response, dispatch))
        .then(response => {
            dispatch({
                type: UPDATE_MEMBERSHIP_PLANS,
                payload: response
            });
        });
}
export function putIPdata(ip_data) {
    return (dispatch, getState) => {
        dispatch({
            type: IP_DATA,
            payload: ip_data
        });
    }
}

export function updateMyConditions(params) {
    return (dispatch, getState) => {
        const requestOptions = postData(params);
        let url = constand.BACKEND_URL + '/api/account/myConditions';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

export function cancelSubscription(params) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        let url = constand.BACKEND_URL + '/api/account/cancelSubscription?isMemberCondition=' + params.isMemberCondition + '&planId=' + params.currentPlanId + '&conditionName=' + params.conditionName;
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

export function changePlan(planObj) {
    return (dispatch, getState) => {
        const requestOptions = postData(planObj);
        let url = constand.BACKEND_URL + '/api/changePlan';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

export function get_membership() {
    return (dispatch, getState) => {
        const requestOptions = getData();
        let url = constand.BACKEND_URL + '/api/account/membership';

        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                console.log('response-members', response)
                return response;
            }).catch(err => {
                console.log('error-actoion', err)
            });
    }
}

export function setExploreConditions(myConditions, healthConditions) {
    console.log('setExploreConditions', myConditions, healthConditions)
    console.log('setExploreConditions-hc', healthConditions)
    var params = { myConditions, healthConditions }
    return (dispatch, getState) => {
        dispatch({
            type: SET_EXPLORE_CONDITION,
            payload: params
        });
    }
}

export function communicationPreferences(data) {
  return (dispatch, getState) => {
    const requestOptions = postData(data);
    return fetch(constand.BACKEND_URL + "/api/account/communicationPreferences", requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

export function saveEmergencyContact(data) {
  return (dispatch, getState) => {
    const requestOptions = postData(data);
    return fetch(constand.BACKEND_URL + "/api/account/saveEmergencyContact", requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

export function updateEmergencyContact(data) {
    return (dispatch, getState) => {
        const requestOptions = postData(data);
        return fetch(constand.BACKEND_URL + "/api/account/updateEmergencyContact", requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

export function updateMovementPrefs(params) {
    return (dispatch, getState) => {
        const requestOptions = postData(params);
        let url = constand.BACKEND_URL + '/api/account/updateMovementPrefs';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

export function updateUserConditions(params) {
    return (dispatch, getState) => {
        const requestOptions = postData(params);
        let url = constand.BACKEND_URL + '/api/account/updateUserTags';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

export function updateUserClinic(params) {
    return (dispatch, getState) => {
        const requestOptions = postData(params);
        let url = constand.BACKEND_URL + '/api/account/updateUserClinic';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}
