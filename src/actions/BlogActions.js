import * as constand from '../constant';
import { getData, postData } from '../_helpers/api-helper';
import handleResponse from '../_services/handle.service';


/**
 * To get blog list
 * @param {*} data 
 */
export function fetchBlogs(dataObj={}) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        let url = constand.BACKEND_URL + '/api/blog?cat='+dataObj.condition+'&search='+dataObj.search+'&limit='+dataObj.limit+'&offset='+dataObj.offset;
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

/**
 * To get recent blog list
 * @param {*} data 
 */
export function fetchRecentBlogs(tag) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        let url = constand.BACKEND_URL + '/api/blog/about/recent/blogs?cat='+tag;
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

/**
 * To get blog detail
 * @param {*} data 
 */
export function fetchBlogDetail(blogName) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        let url = constand.BACKEND_URL + '/api/blog/'+blogName;
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

/**
 * To save and unsave blog
 * @param {*} data 
 */
export function saveBlog(dataObj, flag) {
    return (dispatch, getState) => {
        const requestOptions = postData(dataObj);
        let url;
        if(flag)
            url = constand.BACKEND_URL + '/api/blog/unSave';
        else
            url = constand.BACKEND_URL + '/api/blog/addSave';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}
