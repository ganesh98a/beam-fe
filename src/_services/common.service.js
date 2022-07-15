import * as constand from '../constant';
import { postData } from '../_helpers/api-helper';
import handleResponse from './handle.service';
import moment from 'moment';
import _ from 'lodash';
var local_moment = require('moment-timezone');

export const commonService = {
    sendFeedback, returnLabelData, getDayNameFromDate, getWeekDays, dateDiff, bindUsername, addMintues, localTimeZone, cysticFibro, postantal, returnDays,
    returnUnderLineLabelData, condition_implode, condition_explode, returnTag, returnTagName,
    checkValidVideoURL, checkSocialUrl, checkImageCrop, removeHtml, imageError, localTimeZoneName, kFormatter, localTimeZoneOffset, returnUserTags, removeTimestampFilename, checkRegisterSpecificCondition, mailPatternCheck, calculateAge, formatDateFromString, formatTimeFromSelector, replaceChar, checkUserHasMembership, returnCurrentPlan, returnCurrency, checkMembershipCases, getColor, replaceValidBucketURL, decodeUrl, returnTagId, returnListOfTag, returnTagCheck, toCapitalize, toUpperEachWord
};

function sendFeedback(feedbackData) {

    var dataObject = { type: feedbackData.type, email: feedbackData.email, message: feedbackData.message, phone: feedbackData.phone, message_type: 'test' };
    dataObject.name = feedbackData.firstname + ' ' + feedbackData.lastname;
    const requestOptions = postData(dataObject);

    return fetch(constand.BACKEND_URL + '/api/contact/send', requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function returnLabelData(label, ondemandData) {
    var returnData = '';
    if (ondemandData) {
        var dataObj = ondemandData;
        dataObj.map(function (item) {
            if (item.Tag && item.Tag.type === label) {
                returnData += item.Tag.tag + ", ";
            }
        });
        returnData = returnData.trim();
        returnData = returnData.substring(0, returnData.length - 1);
    }
    returnData = (returnData && returnData != '') ? returnData : 'None';
    return returnData;
}

function returnTag(label, Tags, workout_id) {
    var returnData = '';
    if (Tags) {
        var dataObj = Tags;
        dataObj.filter(e => (e.workoutId.toString() === workout_id.toString())).map(function (item) {
            if (item.Tag && item.Tag.type === label) {
                returnData += item.Tag.tag + ", ";
            }
        });
        returnData = returnData.trim();
        returnData = returnData.substring(0, returnData.length - 1);
    }
    returnData = (returnData && returnData != '') ? returnData : 'None';
    return returnData;
}

function returnTagCheck(Name, label, workout_id, Tags) {
    var returnData = '';
    if (Tags) {
        var dataObj = Tags;
        dataObj.filter(e => (e.workoutId.toString() === workout_id.toString())).map(function (item) {
            if (item.Tag && item.Tag.type === label && item.Tag.tag == Name) {
                returnData = item.Tag.tag;
            }
        });
    }
    returnData = (returnData && returnData != '') ? returnData : '';
    return returnData;
}

function returnUnderLineLabelData(label, ondemandData) {
    var returnData = '';
    if (ondemandData) {
        var dataObj = ondemandData;
        dataObj.map(function (item) {
            if (item.Tag && item.Tag.type === label) {
                returnData += "<u>" + item.Tag.tag + "</u> , ";
            } else {
                returnData += item.Tag.tag + ", ";
            }
        });
        returnData = returnData.trim();
        returnData = returnData.substring(0, returnData.length - 1);
    }
    returnData = (returnData && returnData != '') ? returnData : 'None';
    return returnData;
}

function returnTagName(label, tagname, ondemandData) {
    var returnData = '';
    if (ondemandData) {
        var dataObj = ondemandData;
        dataObj.map(function (item) {
            if (item.Tag && item.Tag.type === label && item.Tag.tag == tagname) {
                returnData = item.Tag.tag;
            }
        });
    }
    returnData = (returnData && returnData != '') ? returnData : '';
    return returnData;
}

function imageError(ev, imageName) {
    return ev.target.src = constand.WEB_IMAGES + imageName;
}
/**
 * to get day name and day number from date
 */
function getDayNameFromDate(date) {
    var dt = moment(date, "YYYY-MM-DD")
    var day = moment(date).format('dddd');
    var monthName = moment(date).format('MMMM');
    var weekDay = moment(date).format('DD');
    weekDay = weekDay; //weekDay < constand.CONSTTEN ? '0' + weekDay : weekDay;
    return day + ' ' + monthName + ' ' + weekDay;
}

/**
     * get current week days
     */
function getWeekDays(startDate, endDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(endDate);
    while (currentDate <= stopDate) {
        dateArray.push(moment(currentDate).format('YYYY-MM-DD'))
        currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
}

function dateDiff(trialEnd) {
    var returnValue = 0;
    if (new Date() <= new Date(trialEnd)) {
        const date1 = new Date();
        const date2 = new Date(trialEnd);
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        returnValue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return returnValue;
}

/* return logged user name */
function bindUsername(user = {}) {
    var returnName = "";
    if (user) {
        if (user.nickname && user.nickname.trim() && (user.nickname.trim() !== 'null')) {
            returnName = user.nickname;
        } else {
            returnName = user.name && user.lastName ? user.name + ' ' + user.lastName : ''; //+ ' ' + user.lastName;
        }
    }
    return returnName;
}

/* add current time to particular mintus */
function addMintues(actualTime = new Date(), addTime = 0) {
    var dt = new Date(actualTime);
    dt.setMinutes(dt.getMinutes() + addTime);
    return dt;
}

/* get local timezone abbrivation */
function localTimeZone() {
    let sone = local_moment.tz.guess();
    return local_moment.tz(sone).zoneAbbr();
}
/* get local timezone full name */
function localTimeZoneName() {
    return local_moment.tz.guess();
}
/* get local timezone full name */
function localTimeZoneOffset(zonename) {
    //zonename = 'Europe/London';
    return local_moment.tz(zonename).format('Z');
}

/* condition implode */
function condition_implode(item) {
    return item.replace(/ /g, "-");
}

/* condition explode */
function condition_explode(item) {
    return item.replace(/-/g, " ");
}

/* return number of days */
function returnDays(date) {
    const date1 = new Date(date);
    const date2 = new Date();
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function checkValidVideoURL(url) {
    console.log('includes-url')

    if (is_url(url)) {
        if (url.includes("s3.")) {
            var s3bucket = constand.Workout_PactsterS3_BUCKET;
        } else if (url.includes("s3-")) {
            var s3bucket = constand.Workout_PactsterS3_URL;
        }
        console.log('includes-is_url')
        if (url.includes(s3bucket)) {
            console.log('includes-viji')
            return !(url.match(/\.(mp4|mov)$/) != null);
        }
        return true;
    }

    return true;
}
function is_url(str) {
    var regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    console.log('Is_URL', regexp.test(str))
    if (regexp.test(str)) {
        return true;
    }
    else {
        return false;
    }
}
function checkSocialUrl(url, type) {
    switch (type) {
        case 'twitter':
            return !(url.match(/http(?:s)?:\/\/(?:www\.)?twitter\.com\//) != null);
        case 'facebook':
            return !(url.match(/http(?:s)?:\/\/(?:www\.)?facebook\.com\//) != null);
        case 'instagram':
            return !(url.match(/http(?:s)?:\/\/(?:www\.)?instagram\.com\//) != null);

        case 'linkedin':
            return !(url.match(/http(?:s)?:\/\/(?:www\.)?linkedin\.com\//) != null);
        case 'tiktok':
            return !(url.match(/http(?:s)?:\/\/(?:www\.)?tiktok\.com\//) != null);
        case 'web':
            return !(url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) != null);
    }
    //return !(url.match(/^((?:http|https)):\/\/(?=[a-z\d])((?:(?:(?!_|\.\.|-\.|\.-|\.\/|-\/)[\w-\.])+?)(?:[\.](?:twitter|linkedin|facebook|tiktok|instagram)))\/([\w-\.~:\/?#\[\]@!$&\'\(\)*+,;=]*)$/i) != null);

}
function checkImageCrop(ev, imageName) {
    return ev.target.src = constand.WEB_IMAGES + imageName;
}
function removeHtml(html) {
    const regex = /(<([^>]+)>)/ig;
    return html.replace(regex, '');
}
function kFormatter(x, max = 999) {
    //return 
    if (isNaN(x)) return x;
    if (max == 9999) {
        if (x < 9999)
            return x;
    } else {
        if (x < 999)
            return x;
        if (x < 9999 && x > 999) {
            return Math.sign(x) * ((Math.abs(x) / 1000).toFixed(1)) + 'k';
        }
    }

    if (x < 1000000) {
        return Math.sign(x) * ((Math.abs(x) / 1000).toFixed(1)) + 'k';
    }
    if (x < 10000000) {
        return Math.sign(x) * ((Math.abs(x) / 1000000).toFixed(1)) + 'm';
    }
    if (x < 1000000000) {
        return Math.sign(x) * ((Math.abs(x) / 1000000).toFixed(1)) + 'm';
    }
    if (x < 1000000000000) {
        return Math.sign(x) * ((Math.abs(x) / 1000000000).toFixed(1)) + 'b';
    }
    return "1t+";
}

function returnUserTags(label, tagname, userTagsData) {
    console.log('userTagsData', userTagsData)
    console.log('userTagsData-t', tagname)
    console.log('userTagsData-l', label)
    var returnData = '';
    if (userTagsData) {
        var dataObj = userTagsData;
        dataObj.map(function (item) {
            console.log('item', item)
            if (item.type === label && item.tag == tagname) {
                returnData = item.tag;
            }
        });
    }
    returnData = (returnData && returnData != '') ? returnData : '';
    return returnData;
}
function checkRegisterSpecificCondition(health_condition, condParam) {
    var Cond_temp = [];
    Cond_temp = health_condition.filter(function (item) {
        console.log('condParam', condParam)
        console.log('item.tag', item.tag)
        return (item.tag == condParam)
    })
    console.log('KR_Cond_temp', Cond_temp)
    return Cond_temp;
}
function removeTimestampFilename(filename) {
    var lastIndex = filename.lastIndexOf('-');
    var finalName = filename;
    if (lastIndex > -1) {
        var splitDot = filename.substr(lastIndex + 1).split('.');
        finalName = filename.substr(0, lastIndex) + '.' + splitDot[1];
    }
    return finalName;
}

function mailPatternCheck(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function calculateAge(inputDate) { //dd-mm-yyyy
    console.log('calculateAge', inputDate)
    var bits = inputDate.split('-');
    var dob = new Date(bits[2], bits[1] - 1, bits[0]);
    var today = new Date();
    var birthDate = dob;  // create a date object directly from `dob1` argument
    console.log('birthDate', birthDate)
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age_now--;
    }
    return age_now;
}

/**
 * 
 * @param {*} date Sun Mar 21 2021 12:00:00 GMT+0530 (India Standard Time)
 * @returns 
 */
function formatDateFromString(date) {
    console.log('formatDateFromString ' + date)
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('/');
}

/**
 * 
 * @param {*} time 1:00AM
 * @returns 
 */
function formatTimeFromSelector(time) {
    console.log('formatTimeFromSelector', time)
    var returnvalue = "";
    if (time) {
        var temp = time.split(" ");
        var extractTime = temp[0].split(":");
        var hrs = extractTime[0];
        var mins = extractTime[1];
        if (temp[1] === 'PM') {
            hrs = parseInt(hrs);
            hrs = hrs + 12;
            if (hrs === 24) {
                hrs = '12';
            }
            hrs = hrs.toString();
            if (hrs.length < 2) {
                hrs = '0' + hrs;
            }
        } else if (temp[1] == 'AM' && hrs == '12') {
            hrs = '00';
        }
        returnvalue = hrs + ':' + mins + ':' + '00';
    }
    return returnvalue;
}

/**
 * Replace all space to space in url
 * @param {*} data 
 * @param {*} isRevert 
 * @returns 
 */
function replaceChar(data, isRevert, urlCondition) {
    //return data.replace(/[-](?=.*[-])/g, "-");
    var temp = data;
    if (data.includes('-') && !temp.toLowerCase().includes(constand.CREATEC_CONDITION)) {
        //replace existing url
        if (isRevert) {
            return data.replace(/-/g, ' ');
        } else {
            return data.replace(/ /g, ' ');
        }
    } else {
        //new condition url
        if (isRevert) {
            return data.replace(/ /g, ' ');
        } else {
            return data.replace(/ /g, ' ');
        }
    }
}
/**
 * To check user has membership for the current condition or not
 * @param {*} authData 
 * @param {*} condition 
 * @returns 
 */
function checkUserHasMembership(authData, condition) {

    if (authData) {
        var currentConditionPlan = this.returnCurrentPlan(authData, condition);
        console.log('currentConditionPlan', currentConditionPlan)
        if (currentConditionPlan.length) {
            var item = currentConditionPlan[0];
            /*  var now = new Date();
             var trialEnds = new Date(item.trialEnds); */
            var now = moment().format('YYYY-MM-DD');
            var trialEnds = moment(item.trialEnds).utc().format('YYYY-MM-DD');
            console.log('checkUserHasMembership-item', item)
            if ((item.subcriptionId && item.subcriptionId.includes('sub_'))) {
                var cancelDate = moment(item.cancellationDate).utc().format('YYYY-MM-DD');
                console.log('checkUserHasMembership-cancelDate', cancelDate)

                if (item.cancellationDate == null || (item.cancellationDate && cancelDate < now && trialEnds >= now)) {
                    return 1; //plan not expiry
                } else if (item.cancellationDate && cancelDate < now && trialEnds < now) {
                    return 0; //plan expired
                }
                return 0; //plan expired

                /* if ((item.cancellationDate == null || cancelDate < now) && (trialEnds >= now)) {
                    return 1; //plan not expiry
                } else if (cancelDate < now && trialEnds < now) {
                    return 0; //plan expired
                } */
            }
            else if ((trialEnds >= now)) { //(item.subcriptionId && !item.subcriptionId.includes('sub_')) ||
                return 1; //plan not expiry
            }
            return 0; //plan expired
        }
    }
    return 2; //no plan
}
/**
 * To get current plan among all plans
 * @param {*} authData 
 * @param {*} condition 
 * @returns 
 */
function returnCurrentPlan(authData, condition, newp) {
    console.log('returnCurrentPlan-authData', authData)
    console.log('returnCurrentPlan-condition=', condition)
    console.log('returnCurrentPlan-newp=', newp)

    if (Object.keys(authData).length) {
        var currentConditionPlan = _.filter(authData.membershipData.userPlanDetails, function (list) {
            console.log('returnCurrentPlan-replaceChar==>', replaceChar(condition, true))
            if (list.Tag) {
                var tagCases = list.Tag.tag.toLowerCase();
                var conditionCases = condition.toLowerCase();
                console.log('conditionCases==>', conditionCases)
                console.log('tagCases==>', tagCases)
                console.log('list.Tag.tag==>condcheck', tagCases === (replaceChar(conditionCases, true)))
                return tagCases === (replaceChar(conditionCases, true));
            } else
                return [];
        });
        return currentConditionPlan;
    }
    return [];
}
/**
 * Return currency value based on countries
 * @param {*} countryPlans 
 * @returns 
 */
function returnCurrency(countryPlans) {
    var currency = constand.Default_Symbol;
    if (Object.keys(countryPlans).length) {
        if (constand.Currency_Symbol[countryPlans.Country.currency]) {
            currency = constand.Currency_Symbol[countryPlans.Country.currency];
        } else if (countryPlans.Country.currency) {
            currency = countryPlans.Country.currency
        }
        return currency;
    }
    return currency;
}
/**
 * To check user has valid membership or not
 * @param {*} item 
 * @returns 
 */
function checkMembershipCases(authData, condition) {
    var currentConditionPlan = this.returnCurrentPlan(authData, condition);
    var content = `You don't have a valid membership to view this class.`;
    var now = moment().format('YYYY-MM-DD');

    if (currentConditionPlan.length) {
        var item = currentConditionPlan[0];
        // var trialEnds = new Date(item.trialEnds);
        var trialEnds = moment(item.trialEnds).utc().format('YYYY-MM-DD');
        var conditionName = item.Tag ? item.Tag.tag : '';
        var hasMember = true;
        console.log('checkMembershipCases', item);
        if (item.licenseId && trialEnds < now) {
            content = "Your FREE Beam membership courtesy of " + item.License.Organisation.organisationName + " expired on " + moment(trialEnds).format('Do MMMM YYYY') + "."
            if (!condition.toLowerCase().includes('research'))
                content = content + " To continue using Beam " + conditionName + " you need to upgrade your membership.";
            hasMember = false;
        } else if (item.promoId && trialEnds < now) {
            content = "Your FREE Beam membership";
            if (item.Promo.courtesyName)
                content = content + " courtesy of " + item.Promo.courtesyName;
            content = content + " expired on " + moment(trialEnds).format('Do MMMM YYYY') + "."
            if (!condition.toLowerCase().includes('research'))
                content = content + " To continue using Beam " + conditionName + " you need to upgrade your membership.";
            hasMember = false;

        } else if (!item.promoId && !item.licenseId && ((item.subcriptionId && !item.subcriptionId.includes('sub_')) || !item.subcriptionId) && trialEnds < now) {
            content = "Your free trial period ended on " + moment(trialEnds).format('Do MMMM YYYY') + "."
            if (!condition.toLowerCase().includes('research'))
                content = content + " To continue using Beam " + conditionName + " you need to upgrade your membership.";
            hasMember = false;

        } else if (item.subcriptionId && item.subcriptionId.includes('sub_') && item.customerId && item.cancellationDate && trialEnds < now) {
            var cancelDate = moment(item.cancellationDate).utc().format('YYYY-MM-DD');
            content = "Your membership was cancelled on " + moment(cancelDate).format('Do MMMM YYYY') + ".";
            if (!condition.toLowerCase().includes('research'))
                content = content + " To continue using Beam " + conditionName + " you need to upgrade your membership.";
            hasMember = false;
        }
        return content;
    }
    return content;

}
/**
 * 
 * @param {*} cond 
 * @returns 
 */
function getColor(cond) {
    var index = constand.CONDITION_CLASS_LIST.indexOf('cond_' + cond);
    if (index > -1) {
        return constand.CONDITION_CLASS_LIST[index]
    } else {
        return constand.CONDITION_CLASS_LIST[0]
    }
}
/**
 * 
 * @param {*} videoS3Url
 * @returns 
 */
function replaceValidBucketURL(videoS3Url, isFolder = false) {
    if (videoS3Url.includes("s3.")) {
        var replaceText = isFolder ? constand.Workout_PactsterS3_BUCKET + '/_/video/workouts/' : constand.Workout_PactsterS3_BUCKET;
    } else if (videoS3Url.includes("s3-")) {
        var replaceText = isFolder ? constand.Workout_PactsterS3_URL + '/_/video/workouts/' : constand.Workout_PactsterS3_URL;
    }
    return videoS3Url.replace(replaceText, '');

}
/* constant  service for cystic-fibro */
function cysticFibro() {
    return ({
        "id": 104,
        "title": "Pre-physio yoga stretch for better chest clearance",
        "videoUrl": "/_/video/workouts/Pamela_Scarborough_Seated_Yoga2.mp4",
        "shortDescription": "A short, seated sequence for cystic fibrosis to prepare you for an effective airway clearance session.",
        "description": "<p>This short seated yoga sequence has been designed to practice before your chest physio session. By helping to improve your posture, spine and chest wall mobility, and breathing pattern, it has the potential to improve your airway clearance.</p>\r\n\r\n<p>Exercises:\r\n<ul>\r\n<li>Sitting in chair</li>\r\n<li>Upper back stretch</li>\r\n<li>Cowface arms</li>\r\n<li>Mountain arms</li>\r\n<li>Seated side flexion</li>\r\n<li>Spinal twist</li>\r\n<li>Seated backbend/pec stretch</li>\r\n</ul>\r\n</p>\r\n<p>Pamela's tips for this session:<br>\r\n\"In your relaxed sitting position, try and take a deep breath in... Now, sit up straight and take a deep breath in - you should feel you have greater capacity to breathe in deeply as your chest is more open. This practice is to help you get a better seated posture and more mobility through your spine and ribcage before you commence your airway clearance to help chest wall biomechanics.\"</p>\r\n\r\n<p>This session is suitable for:<br>\r\nAnyone who can sit unsupported</p>\r\n\r\n<p>Benefits of this session include:\r\n<ul>\r\n<li>Airway clearance</li>\r\n<li>Posture</li>\r\n<li>Mobility and flexibility</li>\r\n<li>Breathing control</li>\r\n</ul>\r\n</p>\r\n\r\n<p>Equipment required:\r\n<ul><li>Chair</li>\r\n<li>Strap, belt or towel</li>\r\n</ul>\r\n</p>",
        "length": 6,
        "Instructor": {
            "id": 16,
            "bio": "<p>Pamela is a physiotherapist, yoga teacher and co-founder of Pactster. Since qualifying as a physiotherapist in 2001, she has spent over 15 years working as a physiotherapist in the NHS, predominantly working with adults with cystic fibrosis. Pamela is passionate about the role of exercise in improving both physical and emotional well-being, and looking at ways to help people manage treatments more effectively so they can live their best life.</p> \r <p>\r Having personally benefited from a regular yoga practice, Pamela trained as a yoga teacher to share the practice and benefits with people with CF directly. Pamela researched 'Yoga for Thoracic Kyphosis and Low Back Pain in adults with CF' for her Masters dissertation, has gone on to present internationally on 'Yoga and CF' and co-authored the 'Complementary therapies' chapter in the UK 'Standards of Care and Good Clinical Practice for the Physiotherapy Management of Cystic Fibrosis'. Here on Pactster, Pamela has created tailored yoga classes to benefit the CF community. Her practice is alignment focused and is specifically sims to improve breathing pattern, relaxation, posture and continence.</p>\r <p>\r As well as through her yoga practice, Pamela keeps active by running after her two young children, enjoying running and HIIT workouts at the gym, and enjoying an adventurous outdoor lifestyle in Australia where she now resides.</p>\r  ",
            "img": "PamelaScarborough.png",
            "User": {
                "id": 145,
                "name": "Pamela",
                "lastName": "Scarborough",
                "nickname": ""
            }
        }
    });
}

/* constant  service for postnatal */
function postantal() {
    return ({
        "id": 41,
        "title": "Foundation to Fitness: Stretch and Relax",
        "videoUrl": "/_/video/workouts/Amanda-Savage-Stretch.mp4",
        "videoImg": "",
        "shortDescription": "This routine will lead you through some gorgeous Pilates stretching exercises ending with a few minutes of guided relaxation.",
        "description": "<p>Welcome to this stretch and relax Pilates sequence.</p>\n\n<p>If your body is feeling sore, or you had a bad night, or you are feeling exhausted or a bit under the weather you may not be in the mood for a full on exercise routine.  But don’t underestimate the power of taking 10 minutes to stretch out, loosen your spine, stretch your limbs and have a breathing space.</p>\n\n<p>This routine will lead you through some gorgeous Pilates stretching exercises ending with a few minutes of guided relaxation.  </p>\n\n<p>I promise at the end of it you will feel re-energised and ready to face the rest of your day.</p>",
        "length": 15,
        "Instructor": {
            "id": 9,
            "bio": "<p>Amanda Savage is a women's health physiotherapist, working for over 20 years with antenatal and postnatal women, helping to sort out problems with pelvic floors, abdominal muscles and back pain.  She is also an experienced Pilates Instructor, teaching popular classes 2 nights a week.  She recently launched Supported Mums a website that provides new mothers with advice about improving pelvic floor and abdominal support (<a href=\"http://supportedmums.com\" target=\"_blank\">www.supportedmums.com</a>).</p>\r\n\r\n<p>\"I believe that if your body is in a good place you will cope better with the physical and emotional demands of motherhood.  My mission is to encourage you to take time to care for yourself, with effective safe exercises for your back, abdominals and pelvic floor.  With the right exercises you can quickly feel truly supported again.\"</p>\r\n\r\n<p>In the <b>New Mother Foundations</b> Amanda guides you through gentle, safe and effective exercises, commonly taught by physiotherapists on the postnatal wards.  These exercises will carry you from returning home through the first 6 weeks postnatal.  </p>\r\n\r\n<p>The <b>Foundation to Fitness</b> series has been designed by Amanda to bring you pilates-based exercise sequences with emphasis on abdominal and pelvic floor techniques.  Great foundations will ensure that you get the best results as you progress to following all the other postnatal exercise programs on Pactster.</p>\r\n\r\n<p><img src=\"/_/img/qualifications/POGP.png\" height=\"80px\"></p>",
            "img": "amandasavage.png",
            "User": {
                "id": 635,
                "name": "Amanda",
                "lastName": "Savage",
                "nickname": ""
            }
        }
    });
}
function decodeUrl(data) {
    if (data) {
        return data.replace(/ /g, '%20');
    }
}

function returnTagId(label, dataObj) {
    var returnData = [];
    if (dataObj) {
        dataObj.map(function (item) {
            if (item.type === label) {
                var id = item.id.toString();
                returnData.push(id);
            }
        });
    }
    return returnData;
}

function returnListOfTag(label, Tags, workout_id) {
    var returnData = '';
    if (Tags) {
        var dataObj = Tags;
        dataObj.filter(e => (e.workoutId.toString() === workout_id.toString())).map(function (item) {
            if (label == constand.DISCIPLINE) {
                returnData = item.disciplineTag;
            } else {
                //level tags
                returnData = item.levelTag;
            }
        });
    }
    returnData = (returnData && returnData != '') ? returnData : 'None';
    return returnData;
}

function toCapitalize(inputString) {
    inputString = inputString.toLowerCase();
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

function toUpperEachWord(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}
