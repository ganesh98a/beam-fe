import * as constand from '../constant';
import { getData, postData } from '../_helpers/api-helper';
import handleResponse from '../_services/handle.service';
import {
  GROUP_JOIN_MODAL_OPEN, GROUP_CMS_MODEL_OPEN
} from '../utilities';


export function ondemandGroupList(dataObj, typeFilter) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    var url;
    if (dataObj.search && dataObj.search !== "") {
      url = constand.BACKEND_URL + '/api/groups/' + typeFilter + '?limit=' + dataObj.limit + '&offset=' + dataObj.offset + '&search=' + dataObj.search;
    } else {
      url = constand.BACKEND_URL + '/api/groups/' + typeFilter + '?limit=' + dataObj.limit + '&offset=' + dataObj.offset;
    }
    return fetch(url, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

export function joinrequest(data, id) {
  return (dispatch, getState) => {
    const requestOptions = postData(data);
    return fetch(constand.BACKEND_URL + '/api/groups/joinrequest/' + id, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

export function joingroup(id) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/groups/joingroup/' + id, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

export function joinModelOpen(flag, data = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_JOIN_MODAL_OPEN,
      payload: flag,
      payloadData: data
    });
  }
}
export function showMoreGroups(data, condition) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/groups/showMore/' + condition + '?offset=' + data.offset + '&limit=' + data.limit + '&type=' + data.type + '&groupType=' + data.groupType + '&isFullRecord=' +data.isFullRecord, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}


/* create on group data */
export function groupCMSOpen(data) {
  console.log('groupCMSOpen', data)
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_CMS_MODEL_OPEN,
      payload: data
    })
  }
}

export function getGroupLeader(condition, search) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/groups/leaderlist/' + condition + '?name=' + search, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

/* create new group */
export function createGroup(data) {
  return (dispatch, getState) => {
    const requestOptions = postData(data);
    return fetch(constand.BACKEND_URL + '/api/groups/new/create', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

/* send group invitations  */
export function sendGroupInvitation(data) {
  return (dispatch, getState) => {
    const requestOptions = postData(data);
    return fetch(constand.BACKEND_URL + '/api/groups/sendInvitation', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}