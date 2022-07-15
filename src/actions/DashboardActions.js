import * as constand from '../constant';
import { postData, getData } from '../_helpers/api-helper';
import handleResponse from '../_services/handle.service';
import {
    LOGGED_USERDATA_UPDATE, SET_INITIAL_CONDITION, SET_SLIDER_VALUE, SET_DATEPICKER_VALUE, SET_DATE_VALUE, SET_TIME_VALUE, CLEAR_ACTIVITY_LIST, SET_ACTIVITY_LIST, UPDATE_JSON_SCHEMA_FORM_DATA,
    GET_USER_PROGRAMS, UPDATE_USER_PROGRAMS
} from '../utilities';

export function updateInitialCondition(data) {
    console.log('updateInitialCondition', data)
    return (dispatch, getState) => {
        dispatch({
            type: SET_INITIAL_CONDITION,
            payload: data
        });
    }
}
export function updateUserdataRedex(userData) {
    return (dispatch, getState) => {
        dispatch({
            type: LOGGED_USERDATA_UPDATE,
            payload: userData
        });
    }
}

/**
 * To get saved video list
 * @param {*} data 
 */
export function fetchSavedList(data) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        let url = constand.BACKEND_URL + '/api/account/dashboard/saved/' + data.condition + '?offset=' + data.offset + '&limit=' + data.limit;
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

/**
 * To get more saved blog list
 * @param {*} data 
 */
export function fetchSavedBlogList(data) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        let url = constand.BACKEND_URL + '/api/account/loadmore/blogs/?offset=' + data.offset + '&limit=' + data.limit;
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}


/**
 * To remove saved video list
 * @param {*} data 
 */
export function unSaveVideo(params) {
    return (dispatch, getState) => {
        const requestOptions = postData(params);
        let url = constand.BACKEND_URL + '/api/ondemand/unSave';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

export function fetchDashboardSchedule(data) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        var url;
        var offset = new Date().getTimezoneOffset();
        if (data.dateChosen) {
            url = constand.BACKEND_URL + '/api/account/dashboard/schedule/' + data.condition + '/' + data.dateChosen + '?offset=' + data.offset + '&limit=' + data.limit + '&zone=' + offset;
        } else {
            url = constand.BACKEND_URL + '/api/account/dashboard/schedule/' + data.condition + '?offset=' + data.offset + '&limit=' + data.limit + '&zone=' + offset;
        }
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

export function getDashboardGroups(data) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        var url;
        if (data.dateChosen) {
            url = constand.BACKEND_URL + '/api/account/dashboard/groups?limit=' + data.limit + '&offset=' + data.offset + '&search=' + data.search;
        } else {
            url = constand.BACKEND_URL + '/api/account/dashboard/groups?limit=' + data.limit + '&offset=' + data.offset;
        }
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}
/**
 * To get recently watched list
 */
export function fetchRecentlyWatched(data) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        var url;
        if (data.dateChosen) {
            url = constand.BACKEND_URL + '/api/account/dashboard/history/' + data.condition + '/' + data.dateChosen + '?offset=' + data.offset + '&limit=' + data.limit;
        } else {
            url = constand.BACKEND_URL + '/api/account/dashboard/history/' + data.condition + '?offset=' + data.offset + '&limit=' + data.limit;
        }
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

/**
 * To get form fields
 */
export function getForm(data) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        var url;
        url = constand.BACKEND_URL + '/api/getFormFields/' + data.name;
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

//to save user activity
export function saveUserActivity(params) {
    return (dispatch, getState) => {
        const requestOptions = postData(params);
        let url = constand.BACKEND_URL + '/api/account/saveActivity';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

//to get user activity
export function getActivityDetails(id) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        let url = constand.BACKEND_URL + '/api/account/getUserActivity/' + id;
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

//to delete user activity
export function deleteUserActivity(params) {
    return (dispatch, getState) => {
        const requestOptions = postData(params);
        let url = constand.BACKEND_URL + '/api/account/deleteActivity';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

export function setSliderValue(value) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_SLIDER_VALUE,
            payload: value
        });
    }
}

export function setDateValue(value) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_DATE_VALUE,
            payload: value
        });
        return value;
    }
}

export function setTimeValue(value) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_TIME_VALUE,
            payload: value
        });
        return value;
    }
}

export function setDatepickerValue() {
    console.log('setDatepickerValue-')
    return (dispatch, getState) => {
        dispatch({
            type: SET_DATEPICKER_VALUE,
        });
        return 1009;
    }
}

export function clearActivityList() {
    return (dispatch, getState) => {
        dispatch({
            type: CLEAR_ACTIVITY_LIST,
        });
    }
}

//to get user activity
export function getAllActivity(params) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        var zoneOffset = new Date().getTimezoneOffset();
        let url = constand.BACKEND_URL + '/api/account/getAllActivity?limit=' + params.limit + '&offset=' + params.offset + '&showAll=' + params.showAll + '&zone=' + zoneOffset + '&filter=' + params.filter;
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                dispatch({
                    type: SET_ACTIVITY_LIST,
                    payload: response.data.list
                });
                return response;
            });
    }
}

export function updateJsonFormData(data) {
    return (dispatch, getState) => {
        dispatch({
            type: UPDATE_JSON_SCHEMA_FORM_DATA,
            payload: data
        });
    }
}

export function fetchDashboardPrograms(data) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        var url;
        var offset = new Date().getTimezoneOffset();
        url = constand.BACKEND_URL + '/api/account/dashboard/programs/' + data.condition + '?offset=' + data.offset + '&limit=' + data.limit + '&zone=' + offset + '&isShowAll=' + data.isShowAll;

        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                dispatch({
                    type: GET_USER_PROGRAMS,
                    payload: response.programmeList
                });
                return response;
            });
    }
}

export function updateUserProgramList(data) {
    return (dispatch, getState) => {
        dispatch({
            type: UPDATE_USER_PROGRAMS,
            payload: data
        });
    }
}