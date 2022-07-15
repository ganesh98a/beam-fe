import * as constand from '../constant';
import { getData, postData } from '../_helpers/api-helper';
import handleResponse from '../_services/handle.service';
import { INSTRUCTOR_LIST, INSTRUCTOR_DETAIL, CLEAR_INSTRUCTOR_LIST, CLEAR_INSTRUCTOR_DETAIL } from '../utilities';

export function getInstructorDetails(id) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/instructors/' + id, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        var instrutorData = (response.instructors) ? response.instructors : {};
        instrutorData.group = (response.group) ? response.group : [];
        dispatch({
          type: INSTRUCTOR_DETAIL,
          payload: instrutorData
        })
        return response;
      });
  }
}

export function getInstructorsList(dataObj, typeFilter) {
  return (dispatch, getState) => {
    const requestOptions = postData(dataObj);
    return fetch(constand.BACKEND_URL + '/api/instructors/' + typeFilter, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        if (response) {
          dispatch({
            type: INSTRUCTOR_LIST,
            payload: (response.list && response.list.instructors) ? response.list.instructors : []
          })
        }
        return response;
      });
  }
}

/* get instructor  */
export function getBeamUser(instructorId,tagConditionArray,searchData) {
  return (dispatch, getState) => {
    const requestOptions = getData();
      // if (id)
      //   var url = constand.BACKEND_URL + '/api/instructors/getBeamUser?id=' + id;
      // else
      //   var url = constand.BACKEND_URL + '/api/instructors/getBeamUser?name='+data+'&type='+type;
    return fetch(constand.BACKEND_URL + '/api/instructors/getBeamUser?id=' + instructorId+'&tag_conditions='+tagConditionArray+'&name='+searchData, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

export function getUserForStudyInstructor(data) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    var url = constand.BACKEND_URL + '/api/instructors/getListForInstructors?conditionName='+data;

    return fetch(url, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}
/* get tags  */
export function getInstTags(type, instructorId) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/instructors/get/Tags?type=' + type + '&instructorId=' + instructorId, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}
/* Just clear the inst list */
export function clearInstructorList() {
  return (dispatch, getState) => {
    dispatch({
      type: CLEAR_INSTRUCTOR_LIST
    });
  }
}
/* Just clear the inst detail */
export function clearInstructorDetail() {
  return (dispatch, getState) => {
    dispatch({
      type: CLEAR_INSTRUCTOR_DETAIL
    });
  }
}