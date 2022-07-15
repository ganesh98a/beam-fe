import * as constand from '../constant';
import { postData, getData } from '../_helpers/api-helper';
import handleResponse from '../_services/handle.service';
import {
    PROGRAM_DETAIL,
    SET_PROGRAM_ACTIVE_SLIDER,
    SET_PROGRAM_ACTIVE_TYPE
} from '../utilities';
/* programme  list */

export function fetchProgrammeList(params) {
    console.log("get-pro-api", params);
    return (dispatch, getState) => {
        const requestOptions = getData();
        return fetch(constand.BACKEND_URL + '/api/programmes/' + params.condition + '?offset=' + params.offset + '&limit=' + params.limit + '&programType=' + params.programType + '&sortby=' + params.sortby + '&isShowAll=' + params.isShowAll, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

/* Programme detail */
export function ProgrammeDetail(params) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        return fetch(constand.BACKEND_URL + '/api/programmes/detail/' + params.programId, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                dispatch({
                    type: PROGRAM_DETAIL,
                    payload: response.programmeDetail
                });
                return response;
            });
    }
}
/* Programme detail */
export function ProgrammeDetailWorkouts(params) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        var url = constand.BACKEND_URL + '/api/programmes/workouts/' + params.programId;
        if (params.userProgramId) {
            url = url + '/' + params.userProgramId;
        }

        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

/* join into program */
export function joinToProgram(params) {
    return (dispatch, getState) => {
        const requestOptions = postData(params);
        return fetch(constand.BACKEND_URL + '/api/programmes/joinProgram', requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

export function programDetailData(data) {
    return (dispatch, getState) => {
        dispatch({
            type: PROGRAM_DETAIL,
            payload: data
        });
    }
}

export function setActiveSlider(key) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_PROGRAM_ACTIVE_SLIDER,
            payload: key
        });
    }
}

export function setProgramType(type) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_PROGRAM_ACTIVE_TYPE,
            payload: type
        });
    }
}