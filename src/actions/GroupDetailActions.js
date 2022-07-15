import * as constand from '../constant';
import { postData, getData, postFileData } from '../_helpers/api-helper';
import handleResponse from '../_services/handle.service';
import { SAVED_LIST_SUCCESS, UPDATE_OFFSET, GROUP_ONDEMAND_LIST, GROUP_IS_LEADER, GROUP_IS_ADMIN, GROUP_ABOUT_DETAILS, CLEAR_GROUP_ABOUT_DETAILS } from '../utilities';

/**
 * to get group  details
 * @param {*} data 
 */
export function fetchAboutGroup(data) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        let url = constand.BACKEND_URL + '/api/groups/about/' + data.group;

        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                if (response) {
                    dispatch({
                        type: GROUP_ABOUT_DETAILS,
                        payload: (response && response.groups) ? response.groups : []
                    })
                }
                return response;
            });
    }
}

/**
 * to get group members
 * @param {*} data 
 */
export function fetchGroupMembers(data) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        let url = constand.BACKEND_URL + '/api/groups/members/' + data.group;
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

/**
 * to get group workout 
 * @param {*} data 
 */
export function fetchGroupWorkout(data) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        var offset = new Date().getTimezoneOffset();
        let url;
        if (data.dateChosen) {
            url = constand.BACKEND_URL + '/api/groups/workout/' + data.condition + '/' + data.group + '/' + data.dateChosen + '?zone=' + offset;
        } else {
            url = constand.BACKEND_URL + '/api/groups/workout/' + data.condition + '/' + data.group + '?zone=' + offset;
        }
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}
/**
 * to get group workout 
 * @param {*} data 
 */
export function fetchGroupOndemand(data) {
    return (dispatch, getState) => {
        //const requestOptions = getData();
        //let url = constand.BACKEND_URL + '/api/groups/ondemand/' + data.condition + '/' + data.group + '?limit=' + data.limit + '&offset=' + data.offset+'&showAll='+data.showAll;
        const requestOptions = postData(data);
        let url = constand.BACKEND_URL + '/api/groups/ondemand/' + data.condition + '/' + data.group;
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                if (response) {
                    dispatch({
                        type: GROUP_ONDEMAND_LIST,
                        payload: (response && response.list) ? response.list : []
                    })
                }
                return response;
            });
    }
}


/**
 * to join group
 * @param {*} data 
 */
export function joinGroup(data) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        let url = constand.BACKEND_URL + '/api/groups/joinrequest/' + data.groupId;
        if (data.groupType === 'open') {
            url = constand.BACKEND_URL + '/api/groups/joingroup/' + data.groupId;
        } else {
            url = constand.BACKEND_URL + '/api/groups/joinrequest/' + data.groupId;
        }
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

/**
 * to get all feeds againt group
 * @param {*} data 
 */
export function fetchAllFeeds(data) {
    console.log('Datt', data)
    return (dispatch, getState) => {
        const requestOptions = getData();
        var limit = data.limit; 
        console.log("limit", limit)
        let url = constand.BACKEND_URL + '/api/groups/feed/' + data.group + '/' + data.type +'/' + data.limit+ "?offset=" + data.offset;

        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

/*
*load More Feeds 
*/
export function loadMoreFeeds(data) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        let url = constand.BACKEND_URL + '/api/groups/loadPosts/' + data.groupId + "?offset=" + data.offset;

        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

/*
*like or unlike the post 
*/
export function likeThePost(params) {
    return (dispatch, getState) => {
        var postParam = { postId: params.postId }
        const requestOptions = postData(postParam);
        let url = constand.BACKEND_URL + '/api/groups/feed/likePost';
        if (params.isLike === 'like') {
            url = constand.BACKEND_URL + '/api/groups/feed/likePost';
        } else {
            url = constand.BACKEND_URL + '/api/groups/feed/unlikePost';
        }

        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

// like or unlike TheComments 
export function likeTheComments(params) {
    return (dispatch, getState) => {
        var postParam = { postId: params.postId,
             commentId: params.commentId, 
             isLike: params.isLike
            }
        const requestOptions = postData(postParam);
        let url = constand.BACKEND_URL + '/api/groups/feed/likeComments';
        if (params) {
            url = constand.BACKEND_URL + '/api/groups/feed/likeComments';
         }
        //   else {
        //     url = constand.BACKEND_URL + '/api/groups/feed/unlikeComments';
        // }
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}
//pinned post
export function pinnedPost(params) {
    return (dispatch, getState) => {
        var postParam = { postId: params.postId, pin:params.value }
        const requestOptions = postData(postParam);
        let url = constand.BACKEND_URL + '/api/groups/feed/pin';
        if (params) {
            url = constand.BACKEND_URL + '/api/groups/feed/pin';
        }
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}



/*
*follow or unfollow the post 
*/
export function followPost(params) {
    return (dispatch, getState) => {
        var postParam = { postId: params.postId }
        const requestOptions = postData(postParam);
        let url = constand.BACKEND_URL + '/api/groups/feed/followpost';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

/**
delete post or comments 
**/
export function deletePostItem(params) {
    return (dispatch, getState) => {
        if (params.itemType === 'post') {
            var postParam = { postId: params.postId }
        } else {
            var postParam = { postId: params.postId, commentId: params.commentId }
        }
        const requestOptions = postData(postParam);
        let url = constand.BACKEND_URL + '/api/groups/feed/deletepost';
        if (params.itemType === 'post') {
            url = constand.BACKEND_URL + '/api/groups/feed/deletepost';
        } else {
            url = constand.BACKEND_URL + '/api/groups/feed/deletecomment';
        }

        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}


/**
edit comments 
**/
export function updateComments(data) {
    return (dispatch, getState) => {
        const requestOptions = postData(data);
        let url = constand.BACKEND_URL + '/api/groups/feed/editcomment';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}


/**
create comments 
**/
export function createComments(data) {
    return (dispatch, getState) => {
        const requestOptions = postData(data);
        let url = constand.BACKEND_URL + '/api/groups/feed/comment';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

/*
*load More comments 
*/
export function loadComments(data) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        let url = constand.BACKEND_URL + '/api/groups/feed/loadcomments/' + data.postId + "?offset=" + data.offset;

        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}

/**
 * to leave from group
 * @param {*} data 
 */
export function leaveGroup(data) {
    return (dispatch, getState) => {
        const requestOptions = postData(data);
        let url = constand.BACKEND_URL + '/api/groups/group/leave';
        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}
/* set admin */
export function isAdmin(flag) {
    console.log('GROUP_IS_ADMIN', flag)
    return (dispatch, getState) => {
        dispatch({
            type: GROUP_IS_ADMIN,
            payload: flag
        });
    }
}
/* set leader */
export function isLeader(flag) {
    console.log('GROUP_IS_LEADER', flag)

    return (dispatch, getState) => {
        dispatch({
            type: GROUP_IS_LEADER,
            payload: flag
        });
    }
}
/* clear about details */
export function clearAboutDetails() {
    return (dispatch, getState) => {
        dispatch({
            type: CLEAR_GROUP_ABOUT_DETAILS
        });
    }
}

/**
 * to get group past workout 
 * @param {*} data 
 */
export function fetchGroupPastWorkout(data) {
    return (dispatch, getState) => {
        const requestOptions = getData();
        var offset = new Date().getTimezoneOffset();
        let url;
        url = constand.BACKEND_URL + '/api/groups/pastliveclass/' + data.condition + '/' + data.group + '?offset=' + data.offset + '&limit=' + data.limit + '&zone=' + offset;

        return fetch(url, requestOptions)
            .then((response) => handleResponse(response, dispatch))
            .then(response => {
                return response;
            });
    }
}