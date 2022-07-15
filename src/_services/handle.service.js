import { toast } from 'react-toastify';
import { logoutTokenExpired, isAuth } from '../actions'
import { CHECK_ISAUTH, LOGIN_PROCESS } from '../utilities';
function handleResponse(response, dispatch) {

  return response.text().then(text => {
    console.log('handleResponse', response.status)
    //toast.dismiss();
    if (!response.ok && response.status == 401) {
      console.log('vijiif')
      localStorage.clear();
      dispatch({
        type: CHECK_ISAUTH,
        payload: false
      });
      dispatch({
        type: LOGIN_PROCESS,
        payload: false
      });
      toast.error('Token expired. Please login again.')
      //return Promise.reject(response.statusText);
      return Promise.reject()
    }
    let data = "";
    if (response.status !== 401) {
      data = text && JSON.parse(text);
    }

    if (!response.ok || (data && (data.status === false || data.success === false))) {
      console.log('elseif')

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    } else {
      console.log('else')
      return data;
    }
    /* const data = text && JSON.parse(text);
    if (!response.ok || (data.status === false || data.success === false)) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data; */
  });
}

export default handleResponse;