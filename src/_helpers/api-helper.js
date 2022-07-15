import * as constand from '../constant';

export function postData(data = {}) {
    // return authorization header with basic auth credentials
    // Default options are marked with *
    if (localStorage.getItem('userAuthToken')) {
        let authData = JSON.parse(localStorage.getItem('userAuthToken'));
        return ({
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': authData.token
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
    } else if (localStorage.getItem('user')) {
        let authData = JSON.parse(localStorage.getItem('user'));
        return ({
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': authData.token
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
    } else {
        return ({
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
    }
}

export function getData(data = {}) {
    // return authorization header with basic auth credentials
    // Default options are marked with *
    if (localStorage.getItem('userAuthToken')) {
        let authData = JSON.parse(localStorage.getItem('userAuthToken'));
        return ({
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': authData.token
            },
            dataType: 'json'
        });
    }
    else if (localStorage.getItem('user')) {

        let authData = JSON.parse(localStorage.getItem('user'));
        return ({
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': authData.token
            },
            dataType: 'json'
        });
    }
    else {
        return ({
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            dataType: 'json'

        });
    }
}

export function authPostData(data = {}) {
    // return authorization header with basic auth credentials
    // Default options are marked with *
    let authData = {};
    if (localStorage.getItem('user')) {
        authData = JSON.parse(localStorage.getItem('user'));
    }
    return ({
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
}