import { authHeader } from '../_helpers';
import * as constand from '../constant';
import { getData, postData } from '../_helpers/api-helper';
import handleResponse from '../_services/handle.service';
import {
  LOGIN_PROCESS, LOGIN_SUCCESS, CHECK_ISAUTH, SET_CONDITION, SET_MENU_CONDITION, SET_CHALLENGE_TAG, SET_INITIAL_CONDITION
} from '../utilities';

export function login(email, password) {
  return (dispatch, getState) => {
    const requestOptions = postData({ email, password });
    dispatch({
      type: LOGIN_PROCESS,
      payload: true
    })
    return fetch(constand.BACKEND_URL + '/api/login', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(user => {
        if (!user.isPactsterUser) {
          dispatch({
            type: LOGIN_PROCESS,
            payload: false
          })
          dispatch({
            type: LOGIN_SUCCESS,
            payload: user
          })
          dispatch({
            type: SET_CONDITION,
            payload: constand.CONDITION
          });
          user.authdata = window.btoa(email + ':' + password);
          localStorage.setItem('user', JSON.stringify(user));
        }
        return user;
      });
  }
}

export function forgotPassword(email) {
  return (dispatch, getState) => {
    const requestOptions = postData({ email });
    return fetch(constand.BACKEND_URL + '/api/forgot', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

export function resetPassword(dataObj) {
  return (dispatch, getState) => {
    const requestOptions = postData(dataObj);
    return fetch(constand.BACKEND_URL + '/api/reset', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

export function checkResetToken(token) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/reset/' + token, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

export function isAuth() {
  var is_auth = (localStorage.getItem('user') || localStorage.getItem('userAuthToken')) ? true : false;
  return (dispatch, getState) => {
    dispatch({
      type: CHECK_ISAUTH,
      payload: is_auth
    });
  }
}

export function logout() {

  // remove user from local storage to log user out
  return (dispatch, getState) => {
    var showWelcomePopup = localStorage.getItem('firstTimeUser');
    // remove all
    localStorage.clear();
    localStorage.setItem('firstTimeUser', showWelcomePopup);
    isAuth();
    dispatch({
      type: LOGIN_PROCESS,
      payload: false
    });
  }
}

export function getAll() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return (dispatch, getState) => {
    return fetch(`{constand.BACKEND_URL}/users`, requestOptions).then((response) => handleResponse(response, dispatch));
  }
}

export function setCondition(condition) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_CONDITION,
      payload: condition
    });
  }
}

export function setMenuCondition(condition) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_MENU_CONDITION,
      payload: condition
    });
  }
}

export function facebookLogin(socialUser) {
  return async (dispatch, getState) => {
    const requestOptions = postData({ facebookId: socialUser.id });
    dispatch({
      type: LOGIN_PROCESS,
      payload: true
    })
    return fetch(constand.BACKEND_URL + '/api/login', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(user => {
        if (!user.isPactsterUser) {
          dispatch({
            type: LOGIN_PROCESS,
            payload: false
          })
          dispatch({
            type: LOGIN_SUCCESS,
            payload: user
          })
          dispatch({
            type: SET_CONDITION,
            payload: constand.CONDITION
          });
          user.authdata = window.btoa(user.id);
          localStorage.setItem('user', JSON.stringify(user));
        }
        return user;
      });
  }
}

export function updateUserChallengeTag() {
  console.log('updateUserChallengeTag')
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/updateUserTag', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        dispatch({
          type: SET_CHALLENGE_TAG,
          payload: response.foundTags && response.foundTags.TagId ? true : false
        });
        return response;
      });
  }
}

export function setInitialCondition(condition) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_INITIAL_CONDITION,
      payload: condition
    });
  }
}