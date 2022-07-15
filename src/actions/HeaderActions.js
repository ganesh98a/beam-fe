import * as constand from '../constant';
import { postData, getData } from '../_helpers/api-helper';
import handleResponse from '../_services/handle.service';
import { LOGIN_MODEL_OPEN, START_LOADER, STOP_LOADER, FORGOT_MODEL_OPEN, UPDATE_NOTIFICATION_MSG, CUSTOM_NOTIFICATION_UPDATE, CANCEL_BANNER, CANCEL_BANNER_KD, CHANGE_CMS_MODE, CHANGE_GROUP_CMS_MODE, CANCEL_BANNER_PC, GET_FOOTER, GET_FEATURES, CHECK_MENU_HAS_DATA, IS_OPEN_POLICY, SET_MODULE_DATA_COUNT, SET_FAQ_DATA, URL_ROUTING, IS_OPEN_CLINIC, SET_CLINIC_POPUP_RESPOND } from '../utilities';

export function loginModelOpen(arg) {
  return (dispatch, getState) => {
    dispatch({
      type: LOGIN_MODEL_OPEN,
      payload: arg
    });
  }
}

export function forgotModelOpen(arg) {
  return (dispatch, getState) => {
    dispatch({
      type: FORGOT_MODEL_OPEN,
      payload: arg
    });
  }
}

export function start_loader() {
  return (dispatch, getState) => {
    dispatch({
      type: START_LOADER
    });
  }
}

export function stop_loader() {
  return (dispatch, getState) => {
    dispatch({
      type: STOP_LOADER
    });
  }
}
export function cancelBanner() {
  return (dispatch, getState) => {
    dispatch({
      type: CANCEL_BANNER
    });
  }
}
export function cancelBannerKD() {
  return (dispatch, getState) => {
    dispatch({
      type: CANCEL_BANNER_KD
    });
  }
}
export function cancelBannerPC() {
  return (dispatch, getState) => {
    dispatch({
      type: CANCEL_BANNER_PC
    });
  }
}

export function updateNotification(arg) {
  return (dispatch, getState) => {
    dispatch({
      type: CUSTOM_NOTIFICATION_UPDATE,
      payload: arg
    });
  }
}
export function changeCMSMode(arg) {
  return (dispatch, getState) => {
    dispatch({
      type: CHANGE_CMS_MODE,
      payload: arg
    });
  }
}

export function changeCMSGroupMode(arg) {
  return (dispatch, getState) => {
    dispatch({
      type: CHANGE_GROUP_CMS_MODE,
      payload: arg
    });
  }
}
/* fetch notifications */
export function fetchNotifications() {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/notification', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        dispatch({
          type: UPDATE_NOTIFICATION_MSG,
          payload: response
        })
        return response;
      });
  }
}

/* read notifications */
export function readNotifications(dataObj) {
  return (dispatch, getState) => {
    const requestOptions = postData(dataObj);
    return fetch(constand.BACKEND_URL + '/api/notification/read', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

/* confirm notifications */
export function confirmNotifications(dataObj) {
  return (dispatch, getState) => {
    const requestOptions = postData(dataObj);
    return fetch(constand.BACKEND_URL + '/api/notification/acceptReject', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

/* get footer section */
export function getFooter(condition) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/getFooter?conditionName=' + condition, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        console.log('getFooter', JSON.parse(response.data))
        dispatch({
          type: GET_FOOTER,
          payload: JSON.parse(response.data)
        })
        return response;
      });
  }
}

/* get features section */
export function getFeatures() {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/getFeatures', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        console.log('getFeatures', JSON.parse(response.data))
        dispatch({
          type: GET_FEATURES,
          payload: JSON.parse(response.data)
        })
        return response;
      });
  }
}

/* check menu data */
export function checkMenuData(menuCondition) {
  console.log('checkMenuData-menu', menuCondition)
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/checkMenuData?conditionName=' + menuCondition, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        console.log('checkMenuData', response)
        dispatch({
          type: CHECK_MENU_HAS_DATA,
          payload: response.count
        })
      });
  }
}

export function openPolicy(arg) {
  return (dispatch, getState) => {
    dispatch({
      type: IS_OPEN_POLICY,
      payload: arg
    });
  }
}

export function savePolicy(isPolicyAccept) {
  return (dispatch, getState) => {
    const requestOptions = postData({ policy: isPolicyAccept });
    return fetch(constand.BACKEND_URL + '/api/saveUserPolicy', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        openPolicy(false)
        return response;
      });
  }
}

export function getCountOfData(conditionName) {
  console.log('getCountOfData=', conditionName)
  var zone = new Date().getTimezoneOffset();

  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/getCountOf/' + conditionName + '/' + zone, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        dispatch({
          type: SET_MODULE_DATA_COUNT,
          payload: response.data
        })
        return response;
      });
  }
}

export function getFaqContent() {

  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/faq', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        dispatch({
          type: SET_FAQ_DATA,
          payload: response.list.faq
        })
        return response;
      });
  }
}

export function getURLCondition() {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/URLRouting', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        dispatch({
          type: URL_ROUTING,
          payload: response.data
        })
        return response;
      });
  }
}

export function openClinic(arg) {
  return (dispatch, getState) => {
    dispatch({
      type: IS_OPEN_CLINIC,
      payload: arg
    });
  }
}

export function updateClinicResponse() {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/updateClinicRespond', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        dispatch({
          type: SET_CLINIC_POPUP_RESPOND,
          payload: true
        })
        return response;
      });
  }
}