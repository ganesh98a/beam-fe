import * as constand from '../constant';
import { getData, postData } from '../_helpers/api-helper';
import handleResponse from '../_services/handle.service';
import {
    LIVECLASS_DETAIL,
    CLEAR_LIVECLASS_DETAIL,
    LIVECLASS_PRISMIC_PARAM,
    SET_POLL_MODAL,
    UPDATE_POLL_VALUES,
    LIVECLASS_FILTER_INSTRUCTOR
} from '../utilities';
import { commonService } from "../_services";

export function fetchClassList(data) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        var offset = new Date().getTimezoneOffset();
        var url;
        if (data.dateChosen) {
            url = constand.BACKEND_URL + '/api/liveclass/' + data.condition + '/' + data.dateChosen + '?offset=' + data.offset + '&limit=' + data.limit + '&zone=' + offset;
        } else {
            url = constand.BACKEND_URL + '/api/liveclass/' + data.condition + '?offset=' + data.offset + '&limit=' + data.limit + '&zone=' + offset + '&filter=' + data.filter;
        }
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                if (response) {
                    dispatch({
                        type: LIVECLASS_PRISMIC_PARAM,
                        payload: response.list.prismic_params
                    })
                }
                return response;
            });
    }
}

export function joinClass(data) {
    return (dispatch, getState) => {
        const requestOptions = postData(data);
        let url = constand.BACKEND_URL + '/api/liveclass/join';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

export function cancelClass(data) {
    return (dispatch, getState) => {
        const requestOptions = postData(data);
        let url = constand.BACKEND_URL + '/api/liveclass/cancel';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

/* fetch ondemand details */
export function liveclassDetail(id, condition, roomId = null, groupId = null) {
    condition = (condition) ? commonService.replaceChar(condition, true) : condition;
    return (dispatch, getState) => {
        const requestOptions = getData();
        return fetch(constand.BACKEND_URL + '/api/liveclass/details/' + condition + '/' + id + '/' + roomId + '/' + groupId, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                if (response) {
                    dispatch({
                        type: LIVECLASS_DETAIL,
                        payload: response.list
                    })
                }
                return response;
            });
    }
}


/* get beam users */
export function getZoomUsers(conditionName, groupId) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        if (groupId == null) {
            var url = constand.BACKEND_URL + '/api/liveclass/get/zoom/users/' + conditionName;
        } else {
            var url = constand.BACKEND_URL + '/api/liveclass/get/zoom/users/' + conditionName + '/' + groupId;
        }
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}
export function addLiveclassNotes(data) {
    return (dispatch, getState) => {
        const requestOptions = postData(data);
        let url = constand.BACKEND_URL + '/api/liveclass/addNotes';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

export function deleteLiveclassNotes(data) {
    return (dispatch, getState) => {
        const requestOptions = postData(data);
        let url = constand.BACKEND_URL + '/api/liveclass/deleteNotes';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}
/* Just clear the liveclass details */
export function clearLiveclassDetail() {
    return (dispatch, getState) => {
        dispatch({
            type: CLEAR_LIVECLASS_DETAIL
        });
    }
}
export function checkWatchPartyWorkoutId(data){
    return (dispatch, getState) => {
        const requestOptions = postData(data);  
        if(data){
            var url = constand.BACKEND_URL + '/api/liveclass/checkWorkoutId'
        }
        return fetch(url, requestOptions)
        .then(response => handleResponse(response, dispatch))
        .then(response => {
            return response;
        });
    }
}

export function createZoomMeeting(data, type) {
    return (dispatch, getState) => {
        const requestOptions = postData(data);
        if (type == 'add')
            var url = constand.BACKEND_URL + '/api/liveclass/createZoom';
        else
            var url = constand.BACKEND_URL + '/api/liveclass/updateZoom';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

export function cancelZoomMeeting(data) {
    return (dispatch, getState) => {
        const requestOptions = postData(data)
        var url = constand.BACKEND_URL + '/api/liveclass/cancelZoomMeeting';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

export function getPastClassList(data) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        var offset = new Date().getTimezoneOffset();
        var url;
        /* if (data.dateChosen) {
            url = constand.BACKEND_URL + '/api/liveclass/getPastLiveclass/' + data.condition + '/' + data.dateChosen + '?offset=' + data.offset + '&limit=' + data.limit + '&zone=' + offset;
        } else { */
        url = constand.BACKEND_URL + '/api/liveclass/get/PastLiveclass/' + data.condition + '?offset=' + data.offset + '&limit=' + data.limit + '&zone=' + offset + '&filter=' + data.filter;
        //}
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                if (response) {
                    dispatch({
                        type: LIVECLASS_PRISMIC_PARAM,
                        payload: response.list.prismic_params
                    })
                }
                return response;
            });
    }
}
export function getUnscheduledClassList(data) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        var offset = new Date().getTimezoneOffset();
        var url;
        /* if (data.dateChosen) {
            url = constand.BACKEND_URL + '/api/liveclass/getPastLiveclass/' + data.condition + '/' + data.dateChosen + '?offset=' + data.offset + '&limit=' + data.limit + '&zone=' + offset;
        } else { */
        url = constand.BACKEND_URL + '/api/liveclass/get/UnscheduledLiveclass/' + data.condition + '?offset=' + data.offset + '&limit=' + data.limit + '&zone=' + offset + '&filter=' + data.filter + '&communityId=' + data.communityId;
        //}
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                if (response) {
                    dispatch({
                        type: LIVECLASS_PRISMIC_PARAM,
                        payload: response.list.prismic_params
                    })
                }
                return response;
            });
    }
}
export function updateFreeLiveclass(data) {
    return (dispatch, getState) => {
        const requestOptions = postData(data)
        var url = constand.BACKEND_URL + '/api/liveclass/updateFreeLiveclass';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}
export function applyLiveclassFilter(data) {
    console.log('applyLiveclassFilter', data)
    return (dispatch, getState) => {
        dispatch({
            type: LIVECLASS_FILTER_INSTRUCTOR,
            payload: data
        });
    }
}

/* set polls modal open/close  */
export function setPollModal(flag) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_POLL_MODAL,
            payload: flag
        });
    }
}
/* to save polls to database */
export function savePoll(data) {
    return (dispatch, getState) => {
        const requestOptions = postData(data)
        var url = constand.BACKEND_URL + '/api/liveclass/savePoll';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                console.log('response-savepoll', response)
                dispatch({
                    type: UPDATE_POLL_VALUES,
                    payload: response.polls
                })
                return response;
            });
    }
}

/* to delete polls to database */
export function deletePoll(data) {
    return (dispatch, getState) => {
        const requestOptions = postData(data)
        var url = constand.BACKEND_URL + '/api/liveclass/deletePoll';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                console.log('response-deletepoll', response)
                return response;
            });
    }
}
//attendees class list
export function attendeesClassList(data) {
    return (dispatch, getState) => {
        const requestOptions = getData()
        let url = constand.BACKEND_URL + '/api/liveclass/get/attendeeList/' + data.roomId;
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}
