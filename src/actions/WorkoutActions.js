import * as constand from '../constant';
import { postData, getData } from '../_helpers/api-helper';
import handleResponse from '../_services/handle.service';
import {
  WORKOUT_DETAIL, SCHEDULE_MODEL_OPEN, WORKOUT_LIST, CLEAR_WORKOUT_LIST, UPDATE_SCHEDULE_MODEL_OPEN, ONDEMAND_DETAIL_SUB_SAVEVIDEO,
  ONDEMAND_WORKOUT_SAVE, ONDEMAND_WORKOUT_UNSAVE, ONDEMAND_DETAIL_SAVEVIDEO, INSTRUCTOR_DETAIL_SAVEVIDEO, UPDATE_AFTER_STATE, CLEAR_AFTER_STATE, UPDATE_OFFSET, SET_GOBACK, SET_CURRENT_POSITION, LIVECLASS_DETAIL_SUB_SAVEVIDEO, SCHEDULE_MODEL_TYPE, PUSH_HISTORY, GROUP_ONDEMAND_WORKOUT_UNSAVE, GROUP_ONDEMAND_WORKOUT_SAVE, CLEAR_GROUP_ONDEMAND_LIST, ONDEMAND_CMS_MODEL_OPEN, CLEAR_WORKOUT_DETAIL,
  IMAGE_CROP_MODEL_OPEN, SET_CROPPED_IMAGE, CHECK_VIDEO_EXIST, SET_FILE_DATA, SET_AFTER_POPUP, SET_ENABLE_VIDEO, SET_END_VIDEO, SET_BEFORE_POPUP, SET_POST_POLL_MODAL, SET_RESEARCH_MODAL, SET_SAFETY_MODAL, SET_SURVEY_MODAL, SET_WARNING_MODAL, SET_CONDITION_MODAL, SET_PLAY_ONDEMAND_MODAL, UPDATE_WORKOUT_DETAIL
} from '../utilities';
import { commonService } from "../_services";

/* push previous path */
export function pushHistory(path) {
  return (dispatch, getState) => {
    dispatch({
      type: PUSH_HISTORY,
      payload: path
    });
  }
}
/* Just clear the ondemand list */
export function clearOndemandList() {
  return (dispatch, getState) => {
    dispatch({
      type: CLEAR_WORKOUT_LIST
    });
  }
}
/* Just clear the ondemand list */
export function clearOndemandDetail() {
  return (dispatch, getState) => {
    dispatch({
      type: CLEAR_WORKOUT_DETAIL
    });
  }
}

/* fetch ondemand details */
export function ondemandDetail(id, condition) {
  condition = (condition) ? commonService.replaceChar(condition, true) : condition;
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/ondemand/getDetail/' + id + '/' + condition, requestOptions)
      //return fetch(constand.BACKEND_URL+'/api/ondemand/getDetail/'+id, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        if (response) {
          dispatch({
            type: WORKOUT_DETAIL,
            payload: response.onDemandVideo
          })
        }
        return response;
      });
  }
}

/* check user have membership for play video */
export function hasMembership() {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/account/hasMembership', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

/* backend entry for user started the video */
export function startVideo(workoutObj) {
  return (dispatch, getState) => {
    const requestOptions = postData(workoutObj);
    return fetch(constand.BACKEND_URL + '/api/ondemand/startVideo', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        dispatch({
          type: CLEAR_AFTER_STATE
        })
        return response;
      });
  }
}

/* review before video start */
export function beforePlay(dataObj) {
  return (dispatch, getState) => {
    const requestOptions = postData(dataObj);
    return fetch(constand.BACKEND_URL + '/api/ondemand/beforePlay', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

/* research study pre poll */
export function submitPrePoll(dataObj) {
  return (dispatch, getState) => {
    const requestOptions = postData(dataObj);
    return fetch(constand.BACKEND_URL + '/api/ondemand/submitPrePoll', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

/* research study post poll */
export function submitPostPoll(dataObj) {
  return (dispatch, getState) => {
    const requestOptions = postData(dataObj);
    return fetch(constand.BACKEND_URL + '/api/ondemand/submitPostPoll', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

export function checkCron(dataObj) {
  return (dispatch, getState) => {
    const requestOptions = postData(dataObj);
    return fetch(constand.BACKEND_URL + '/api/ondemand/checkCron', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

/* review after video  */
export function afterPlay(params) {
  return (dispatch, getState) => {
    const requestOptions = postData(params);
    return fetch(constand.BACKEND_URL + '/api/ondemand/afterPlay', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

/* sent how much time user watched the video for every 10 secs */
export function saveTimeSpent(workoutObj) {
  return (dispatch, getState) => {
    const requestOptions = postData(workoutObj);
    return fetch(constand.BACKEND_URL + '/api/ondemand/saveTimeSpent', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

/* fetch ondemand list */
export function ondemandList(datObj, typeFilter) {
  return (dispatch, getState) => {
    const requestOptions = postData(datObj);
    return fetch(constand.BACKEND_URL + '/api/ondemand/' + typeFilter + '/list', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        if (response) {
          dispatch({
            type: WORKOUT_LIST,
            payload: response.data ? response.data.list : [] //(response.list && response.list.workout) ? response.list.workout : []
          })
        }
        return response;
      });
  }
}

/* workout video save */
export function saveVideo(params, page) {
  return (dispatch, getState) => {
    const requestOptions = postData(params);
    return fetch(constand.BACKEND_URL + '/api/ondemand/addSave', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        switch (page) {
          case "ondemand_list":
            dispatch({
              type: ONDEMAND_WORKOUT_SAVE,
              payload: params
            })
            break;
          case "ondemand_detail":
            dispatch({
              type: ONDEMAND_DETAIL_SAVEVIDEO,
              payload: params,
              flag: true
            })
            break;
          case "instructor_detail":
            dispatch({
              type: INSTRUCTOR_DETAIL_SAVEVIDEO,
              payload: params,
              flag: true
            })
            break;
          case "ondemand_detail_sub":
            dispatch({
              type: ONDEMAND_DETAIL_SUB_SAVEVIDEO,
              payload: params,
              flag: true
            })
            break;
          case "liveclass_detail_sub":
            dispatch({
              type: LIVECLASS_DETAIL_SUB_SAVEVIDEO,
              payload: params,
              flag: true
            })
            break;
          case "group_ondemand":
            dispatch({
              type: GROUP_ONDEMAND_WORKOUT_SAVE,
              payload: params
            })
            break;
          default:
            break;
        }
        return response;
      });
  }
}

/* workout video un-save */
export function unSaveVideo(params, page) {
  return (dispatch, getState) => {
    const requestOptions = postData(params);
    return fetch(constand.BACKEND_URL + '/api/ondemand/unSave', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        switch (page) {
          case "ondemand_list":
            dispatch({
              type: ONDEMAND_WORKOUT_UNSAVE,
              payload: params
            })
            break;
          case "ondemand_detail":
            dispatch({
              type: ONDEMAND_DETAIL_SAVEVIDEO,
              payload: params,
              flag: false
            })
            break;
          case "instructor_detail":
            dispatch({
              type: INSTRUCTOR_DETAIL_SAVEVIDEO,
              payload: params,
              flag: false
            })
            break;
          case "ondemand_detail_sub":
            dispatch({
              type: ONDEMAND_DETAIL_SUB_SAVEVIDEO,
              payload: params,
              flag: false
            })
            break;
          case "liveclass_detail_sub":
            dispatch({
              type: LIVECLASS_DETAIL_SUB_SAVEVIDEO,
              payload: params,
              flag: false
            })
            break;
          case "group_ondemand":
            dispatch({
              type: GROUP_ONDEMAND_WORKOUT_UNSAVE,
              payload: params
            })
            break;
          default:
            break;
        }
        return response;
      });
  }
}
/* Just clear the group ondemand list */
export function clearGroupOndemandList() {
  return (dispatch, getState) => {
    dispatch({
      type: CLEAR_GROUP_ONDEMAND_LIST
    });
  }
}
export function setTypeSchedulePopup(flag) {
  return (dispatch, getState) => {
    dispatch({
      type: SCHEDULE_MODEL_TYPE,
      payload: flag
    });
  }
}
export function scheduleModelOpen(flag, data = {}) {
  return (dispatch, getState) => {
    dispatch({
      type: SCHEDULE_MODEL_OPEN,
      payload: flag,
      payloadData: data
    });
  }
}

export function updateScheduleModelDate(date) {
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_SCHEDULE_MODEL_OPEN,
      payload: date
    });
  }
}

/* workout schedulevideo */
export function scheduleVideo(params) {
  return (dispatch, getState) => {
    const requestOptions = postData(params);
    return fetch(constand.BACKEND_URL + '/api/ondemand/workoutschedule', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

/* local state update */
export function updateAfterModelState(data) {
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_AFTER_STATE,
      payload: data
    });
  }
}

/* offset update */
export function updateOffset(data) {
  console.log('data', data)
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_OFFSET,
      payload: data
    });
  }
}

export function setGoback(val) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_GOBACK,
      payload: val
    });
  }
}

export function setCurrentPosition(val) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_CURRENT_POSITION,
      payload: val
    });
  }
}
/* get tags  */
export function getTags(type, workoutId) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/ondemand/getTags?type=' + type + '&workoutId=' + workoutId, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}
/* get instructor  */
export function getInstructor(instructorId, tagConditionArray, groupId, conditionName) {

  return (dispatch, getState) => {
    const requestOptions = getData();
    if (groupId == null) {
      var url = constand.BACKEND_URL + '/api/ondemand/getInstructor?id=' + instructorId + '&tag_conditions=' + tagConditionArray + '&conditionName=' + conditionName;
    } else {
      var url = constand.BACKEND_URL + '/api/ondemand/getInstructor/' + groupId + '?id=' + instructorId + '&tag_conditions=' + tagConditionArray + '&conditionName=' + conditionName;

    }
    return fetch(url, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}
/* get recording of  */
export function getRecordingOf(instructor, workoutId) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/ondemand/getRecordingOf?instructorId=' + instructor + '&workoutId=' + workoutId, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}
/* get recording of details */
export function getRecordingOfDetails(workoutId) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/ondemand/getRecordingOfDetails?workoutId=' + workoutId, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

/* create on demand data */
export function ondemandCMSModelOpen(data) {
  console.log('ondemandCMSModelOpen', data)
  return (dispatch, getState) => {
    dispatch({
      type: ONDEMAND_CMS_MODEL_OPEN,
      payload: data
    })
  }
}

/* backend entry for create new tag */
export function createNewTag(data) {
  return (dispatch, getState) => {
    const requestOptions = postData(data);
    return fetch(constand.BACKEND_URL + '/api/ondemand/createTag', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}
/* backend entry for remove tag */
export function removeTag(data) {
  return (dispatch, getState) => {
    const requestOptions = postData(data);
    return fetch(constand.BACKEND_URL + '/api/ondemand/removeTag', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

export function imageCropOpenPopup(data) {
  return (dispatch, getState) => {
    dispatch({
      type: IMAGE_CROP_MODEL_OPEN,
      payload: data
    })
  }
}

export function setCroppedImage(data) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_CROPPED_IMAGE,
      payload: data
    })
  }
}
/* backend entry for user tag */
export function saveDisclaimer(params) {
  return (dispatch, getState) => {
    const requestOptions = postData(params);
    return fetch(constand.BACKEND_URL + '/api/ondemand/safetyDisclaimer', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        /* dispatch({
          type: CLEAR_AFTER_STATE
        }) */
        return response;
      });
  }
}

/* get all filters  */
export function getAllFilters(condition) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/ondemand/allfilters/' + condition, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

/* check video exists in s3  */
export function checkVideoUrlExists(pathname) {
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/ondemand/checkS3FileExist/' + pathname, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

/* push file */
export function setFile(file) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_FILE_DATA,
      payload: file
    });
  }
}

/* send s3 file upload notification */
export function sendFileuploadNotification(params) {
  return (dispatch, getState) => {
    const requestOptions = postData(params);
    return fetch(constand.BACKEND_URL + '/api/ondemand/asyncFileUpload', requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        return response;
      });
  }
}

export function isOpenAfterModel(flag) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_AFTER_POPUP,
      payload: flag
    });
  }
}

export function isEnableVideo(flag) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_ENABLE_VIDEO,
      payload: flag
    });
  }
}

export function isEndVideo(flag) {
  console.log("flag", flag)
  return (dispatch, getState) => {
    dispatch({
      type: SET_END_VIDEO,
      payload: flag
    });
  }
}

export function isOpenBeforeModel(flag) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_BEFORE_POPUP,
      payload: flag
    });
  }
}

export function isOpenPostPollModel(flag) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_POST_POLL_MODAL,
      payload: flag
    });
  }
}

export function isOpenResearchModel(flag) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_RESEARCH_MODAL,
      payload: flag
    });
  }
}

export function isOpenSafetyModel(flag) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_SAFETY_MODAL,
      payload: flag
    });
  }
}

export function isOpenProgramSurveyModel(flag) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_SURVEY_MODAL,
      payload: flag
    });
  }
}

export function isWarningModal(flag) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_WARNING_MODAL,
      payload: flag
    });
  }
}

export function isConditionModalOpen(flag) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_CONDITION_MODAL,
      payload: flag
    });
  }
}

export function isPlayOndemand(flag) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_PLAY_ONDEMAND_MODAL,
      payload: flag
    });
  }
}

/* fetch ondemand details */
export function likeMoreOndemand(id, condition) {
  condition = (condition) ? commonService.replaceChar(condition, true) : condition;
  return (dispatch, getState) => {
    const requestOptions = getData();
    return fetch(constand.BACKEND_URL + '/api/ondemand/likeMore/' + id + '/' + condition, requestOptions)
      .then((response) => handleResponse(response, dispatch))
      .then(response => {
        if (response) {
          dispatch({
            type: UPDATE_WORKOUT_DETAIL,
            payload: response.onDemandVideo
          })
        }
        return response;
      });
  }
}
