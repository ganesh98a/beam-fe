import * as constand from "../constant";
import { getData } from '../_helpers/api-helper';
import handleResponse from '../_services/handle.service';


/**
 * To get help text
 * @param {*} data 
 */
export function fetchHelp(condition) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        let url = constand.BACKEND_URL + '/api/help/'+condition;
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}


