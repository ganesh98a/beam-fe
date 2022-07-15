export const Fake_BACKEND_URL = "http://localhost:4000";
function backEndConstant() {
    var backendObject = {};
    console.log('CUSTOM_NODE_ENV', process.env.REACT_APP_CUSTOM_NODE_ENV)
    console.log('REACT_APP_ETHNICITY_ID', process.env.REACT_APP_ETHNICITY_ID)
    console.log('AWS_BUCKET', process.env.REACT_APP_AWS_BUCKET)
    if (process.env.REACT_APP_CUSTOM_NODE_ENV === 'production')  //production environment variables
    {
        backendObject.backend_url = "https://api.beamfeelgood.com";
        backendObject.frontend_url = "https://beamfeelgood.com";
        backendObject.facebook_key = "789418147812194";
        backendObject.tracking_id = process.env.REACT_APP_GOOGLE_TRACK_ID;
        backendObject.s3_url = "https://pactstercdn.s3-eu-west-1.amazonaws.com";
    } else if (process.env.REACT_APP_CUSTOM_NODE_ENV === 'staging') { //production environment variables
        backendObject.backend_url = "https://stagingapi.beamfeelgood.com";
        backendObject.frontend_url = "https://staging.beamfeelgood.com";
        backendObject.facebook_key = "1291347647619239";
        backendObject.tracking_id = process.env.REACT_APP_GOOGLE_TRACK_ID;
        backendObject.s3_url = "https://devpactstercdn.s3-eu-west-1.amazonaws.com";
    } else if (process.env.REACT_APP_CUSTOM_NODE_ENV === 'develop') { //production environment variables
        backendObject.backend_url = "https://devapi.beamfeelgood.com";
        backendObject.frontend_url = "https://dev.beamfeelgood.com";
        backendObject.facebook_key = "945555309365361";
        backendObject.tracking_id = process.env.REACT_APP_GOOGLE_TRACK_ID;
        backendObject.s3_url = "https://devpactstercdn.s3-eu-west-1.amazonaws.com";
    }
    else { //local environment variables
        backendObject.backend_url = "http://localhost:3001";
        backendObject.frontend_url = "http://localhost:9500";
        backendObject.facebook_key = "873445879669989";
        backendObject.tracking_id = process.env.REACT_APP_GOOGLE_TRACK_ID;
        backendObject.s3_url = "https://devpactstercdn.s3-eu-west-1.amazonaws.com";
    }
    return backendObject;
}

export const FRONTEND_URL = backEndConstant().frontend_url;
export const BACKEND_URL = backEndConstant().backend_url;
export const FACEBOOK_APP_KEY = backEndConstant().facebook_key;
export const IMAGE_BACKEND_URL = backEndConstant().backend_url;
export const GOOGLE_TRACK_ID = backEndConstant().tracking_id;
export const S3_URL = backEndConstant().s3_url;
export const AWS_ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY;
export const AWS_SECRET_KEY = process.env.REACT_APP_AWS_SECRET_KEY;
export const AWS_BUCKET = process.env.REACT_APP_AWS_BUCKET;
export const AWS_REGION = process.env.REACT_APP_AWS_REGION;
export const AWS_URL = "https://dj0ap86zvqttz.cloudfront.net";
export const Workout_PactsterS3_URL = "https://pactstercdn.s3-eu-west-1.amazonaws.com";
export const Workout_PactsterS3_BUCKET = "https://pactstercdn.s3.eu-west-1.amazonaws.com";
export const CMS_PAGES = ['on-demand', 'instructor', 'liveclasses', 'liveClasses', 'Instructor', 'groups', 'group', 'teensonbeam'];
export const GROUP_PAGE = ['group'];
export const HOME_PAGE = ['cystic fibrosis', 'kidney disease', "prostate cancer", "asthma kids", "cystic fibrosis youth"];
export const CONDITION = "cystic fibrosis";
export const CFY_CONDITION = "cystic fibrosis youth";
export const MENO_CONDITION = "menopause";
export const KR_CONDITION = "kidney disease";
export const CANCER_CONDITION = "prostate cancer";
export const POSTNATAL_CONDITION = "postnatal";
export const RESEARCH_CONDITION = "Research";
export const CREATEC_CONDITION = "create";
export const IREHAB_CONDITION = "irehab";
export const ASTHMA_CONDITION = "asthma kids";
export const KD_COMORBIDITIES = "comorbidities";
export const CF_DISEASE_SEVERITY = "cf-disease-severity";
export const KIDNEY_CARE_PROVIDER = "kidney-care-provider";
export const PC_TREATMENT = "pc-treatment";
export const PC_COMORBIDITIES = "pc-comorbidities";
export const CF_COMORBIDITIES = "cf-comorbidities";
export const CF_MOVEMENT_PREFS = "movementPrefs";
export const usCountry = 231;
export const ukCountry = 230;
export const livingCondition = 1;
export const adultAge = 18;
export const S3_API_IMGES = S3_URL + "/api/images";
export const S3_API = S3_URL + "/api";
export const S3_API_IMG = S3_URL + "/api/img";
export const S3_WEB_IMGES = S3_URL + "/web/images";
export const WORKOUT_IMG_PATH = S3_API_IMG + '/workout/';
export const USER_IMAGE_PATH = S3_API_IMG + '/instructor/';
export const PROFILE_IMAGE_PATH = S3_API_IMG + '/profile/'; //BACKEND_URL + '/_/img/profile/';
export const GROUP_IMAGE_PATH = S3_API_IMG + '/group/';
export const WEB_IMAGES = S3_WEB_IMGES + '/';
export const POST_IMG_PATH = S3_API_IMG + '/post/'; //BACKEND_URL + '/_/img/post/'; //
export const PROGRAM_IMG_PATH = S3_API_IMG + '/program/';


export const ASYNIC_NOTIFICATION_CALL_TIME = 60000; //ms for call notification api
export const BELL_ALERT_TIMEOUT = 3000;

export const Input_Text_Limit = 255;
export const Desc_Text_Limit = 3500;
export const CLASS_LIST_CNT = 10;
export const CONSTTEN = 10;
export const LEVEL_LIST = [{ id: 1, value: 'Beginner' }, { id: 2, value: 'Intermediate' }, { id: 3, value: 'Advanced' }];
export const INSTRUCTOR_LIST_CNT = 12;
export const VIDEO_RANGE_MIN = 0;
export const VIDEO_RANGE_MAX = 60;
export const DIFFICULTY_STATE = ['', 'Beginner', 'Intermediate', 'Advanced'];
export const CONSTFIVE = 5;
export const CONSTSIX = 6;
export const ONDEMAND_GROUP_COUND = 12;
export const Liveclass_Weeks = 8;
export const WEEK_DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const MONTH_LIST = [{ 'id': '1', 'value': 'January', 'short': 'Jan' }, { 'id': '2', 'value': 'February', 'short': 'Feb' }, { 'id': '3', 'value': 'March', 'short': 'Mar' }, { 'id': '4', 'value': 'April', 'short': 'Apr' }, { 'id': '5', 'value': 'May', 'short': 'May' }, { 'id': '6', 'value': 'June', 'short': 'Jun' }, { 'id': '7', 'value': 'July', 'short': 'Jul' }, { 'id': '8', 'value': 'August', 'short': 'Aug' }, { 'id': '9', 'value': 'September', 'short': 'Sep' }, { 'id': '10', 'value': 'October', 'short': 'Oct' }, { 'id': '11', 'value': 'November', 'short': 'Nov' }, { 'id': '12', 'value': 'December', 'short': 'Dec' }]
export const YEAR_START = 1900;
export const YEAR_END = new Date().getFullYear() - 1;
export const REGISTER_HEARABOUT = [{ id: 1, value: "Social Media" }, { id: 2, value: "Friend Suggestion" }, { id: 3, value: "Advertisement" }];
export const CONSTZERO = 0
export const CONSTONE = 1
export const CONSTTWO = 2
export const CONSTTHREE = 3
export const CONSTTWELVE = 12
export const CONSTEIGHT = 8
export const CONSTNINE = 9
export const SAFETY_CONDITION_LIST = ['menopause', 'postnatal'];
export const CONDITION_LIST = ['cystic fibrosis', 'Menopause', 'Postnatal', 'kidney disease', 'prostate cancer', 'asthma kids', 'cystic fibrosis youth'];
export const CONDITION_CLASS_LIST = ['cond_cystic-fibrosis-youth','cond_general', 'cond_prostate-cancer', 'cond_kidney-disease', 'cond_menopause', 'cond_postnatal', 'cond_cystic-fibrosis'];
export const MOBILE_VIEW_AXIS = { 'width': 920, 'height': 650 };
/* Header */
//export const SL_MENU = ['liveclasses', 'liveClasses', 'Instructor', 'groups', 'group'];
export const SL_MENU = ['on-demand', 'instructor', 'liveclasses', 'liveClasses', 'Instructor', 'groups', 'group'];
export const CORE_MENU = ['on-demand', 'programs', 'liveclasses', 'liveClasses', 'groups', 'group'];
export const HOME_CONDITION_LIST = ['cystic fibrosis', 'kidney disease', 'prostate cancer', 'asthama kids'];
export const SP_NOT_MENU = ['on-demand', 'instructor', 'liveclasses', 'liveClasses', 'Instructor'];
export const MAIN_LISTING = ['on-demand', 'instructor', 'liveclasses'];
export const Beamer_Gender = ['', 'Male', 'Female', 'Neither'];
// export const Beamer_Relationship = [{ "Living with condition": "LivingWithCondition" }, { "A medical or exercise professional": "MedicalExerciseProf" }, { "A caregiver to someone with a health condition": "Caregiver" }, { "Other": "Other" }];

export const Beamer_Relationship = { "Living with condition": "LivingWithCondition", "A medical or exercise professional": "MedicalExerciseProf", "A caregiver to someone with a health condition": "Caregiver", "Other": "Other" };

export const Beamer_condidtion_Tag = { "cystic fibrosis": "CysticFibrosis", "asthma kids": "AsthmaKids", "Postnatal": "Postnatal", "Menopause": "Menopause", "kidney disease": "KidneyDisease", "prostate cancer": "ProstateCancer", "Research Studies: REGAIN": "ResearchRegain", "Research Studies: PULSE": "ResearchPulse", "Research Studies: SPHERe": "ResearchSphere", "Research Studies: CREATE-C": "ResearchCreateC","Research Studies: iREHAB": "ResearchiREHAB" };
export const NO_PARTNERSHIP_CONDITIONS = ['Postnatal', 'asthma kids', 'Menopause'];

/* Ondemand page */
export const INSTRUCTOR_ONDEMAND_CNT = 4;
export const ONDEMAND_LIST_CNT = 12;
export const ONDEMAND_SORT_FILTERLIST = ['Duration', 'Difficulty', 'Instructor', 'Newest first', 'Highest rated', 'Most viewed'];
export const ASYNIC_API_CALL_DURAION = 1000; //for video time update in backend api
export const BEFORE_VIDEO_REVIEW_LIMIT = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const AFTER_VIDEO_REVIEW_LIMIT = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const RESEARCH_STUDY_LIST = ['research studies: regain'];
export const RESEARCH_STUDY_PRE_POLL = ['Injured', 'Unwell', 'Admitted to hospital (unplanned)']
export const RESEARCH_STUDY_POST_POLL = [
    { id: 0, value: 'No exertion at all', class: 'cl', roundClass: 'c' },
    { id: 0.5, value: 'Very, very slight (just noticable)', class: 'cl0', roundClass: 'c' },
    { id: 1, value: 'Very slight', class: 'cl1', roundClass: 'c1' },
    { id: 2, value: 'Slight', class: 'cl2', roundClass: 'c2' },
    { id: 3, value: 'Moderate', class: 'cl3', roundClass: 'c3' },
    { id: 4, value: 'Somewhat severe', class: 'cl4', roundClass: 'c4' },
    { id: 5, value: 'Severe', class: 'cl5', roundClass: 'c5' },
    { id: 6, value: '', class: 'cl6', roundClass: 'c6' },
    { id: 7, value: 'Very severe', class: 'cl7', roundClass: 'c7' },
    { id: 8, value: '', class: 'cl8', roundClass: 'c8' },
    { id: 9, value: 'Very, very severe (almost maximal)', class: 'cl9', roundClass: 'c9' },
    { id: 10, value: 'Maximal', class: 'cl10', roundClass: 'c10' }
];
export const RESEARCH_STUDY_POST_POLL_CREATEC = [
    { id: 6, value: 'No exertion at all', class: 'cl', roundClass: 'c' },
    { id: 7, value: 'Extremely light', class: 'cl0', roundClass: 'c' },
    { id: 8, value: '', class: 'cl1', roundClass: 'c1' },
    { id: 9, value: 'Very light', class: 'cl2', roundClass: 'c2' },
    { id: 10, value: '', class: 'cl3', roundClass: 'c3' },
    { id: 11, value: 'Light', class: 'cl4', roundClass: 'c4' },
    { id: 12, value: '', class: 'cl11', roundClass: 'c11' },
    { id: 13, value: 'Somewhat hard', class: 'cl12', roundClass: 'c12' },
    { id: 14, value: '', class: 'cl13', roundClass: 'c12' },
    { id: 15, value: 'Hard(heavy)', class: 'cl5', roundClass: 'c5' },
    { id: 16, value: '', class: 'cl6', roundClass: 'c6' },
    { id: 17, value: 'Very hard', class: 'cl7', roundClass: 'c7' },
    { id: 18, value: '', class: 'cl8', roundClass: 'c8' },
    { id: 19, value: 'Extremely hard', class: 'cl9', roundClass: 'c9' },
    { id: 20, value: 'Maximum exertion', class: 'cl10', roundClass: 'c10' }
];
export const STAR_RATING = [5, 4, 3, 2, 1];
export const TAB_HIDE_CONDITONS = ["Women's-Health"];
export const REVIEW_TEXT = ['bad', 'good', 'excellent'];
export const VIDEO_PERCENTAGE = 50;
export const DISCIPLINE = 'discipline';
export const Video_Type_Liveclass = "Live Class Recording";
export const Tag_Education = "Education";

/* Register constands */
export const NameComponent = 1;
export const UsernameComponent = 2;
export const EmailComponent = 3;
export const PasswordComponent = 4;
export const GenderComponent = 5;
export const CountryComponent = 6;
export const ProfessionComponent = 7;
export const HealthConditionComponent = 8;
export const ClinicComponent = 9;
export const PurposeComponent = 10;
export const AlmostDoneComponent = 11;
export const DobComponent = 12;
export const HearAboutComponent = 13;
export const PromocodeAppliedComponent = 14;
export const FirstMonthComponent = 15;
export const TrialComponent = 16;
export const AlldoneComponent = 19;
export const DOB_SWAP_COUNTYID = ['231'];

export const Resgister_useage = ['', 'self', 'other', 'both'];
export const Resgister_condition_relationship = ['', 'Living with condition', 'A caregiver to someone with a health condition', 'A medical or exercise professional', 'Other'];
export const Resgister_caregiver_type = ['', 'Parent/guardian', 'Partner', 'Other family member', 'Friend', 'Professional caregiver', 'Other'];
export const clinician_type = ['', 'Physiotherapist or physical therapist', 'Respiratory therapist', 'Exercise physiologist', 'Doctor', 'Nurse', 'Fitness professional/personal trainer', 'Other'];
export const INSTRUCTOR_WORD_LIMIT = 175;
export const ONDEMAND_WORD_LIMIT = 90;

export const ethnicity_white = ['White British', 'White Irish', 'Any other white background'];
export const ethnicity_mixed = ['White and Black Caribbean', 'White and Black African', 'White and Asian', 'Any other mixed background'];
export const ethnicity_asian = ['Indian', 'Asian'];
export const ethnicity_asian_contd = ['Pakistani', 'Bangladeshi', 'Any other Asian background'];
export const ethnicity_black = ['Caribbean', 'African', 'Any other black background'];
export const ethnicity_other = ['Chinese', 'Any other ethnic groups', 'Rather not say'];
export const comorbidities = ['High blood pressure', 'Heart conditions', 'Diabetes treated with insulin', 'Diabetes treated with diet and exercise', 'Depression', 'Lung condition', 'Condition involving joints and/or muscles', 'Recovering from a COVID-19 related hospital admission'];
export const kidney_care_provider = ['GP', 'General Nephrology Clinic', 'Low Clearance Clinic', 'Peritoneal Dialysis Clinic', 'Haemodialysis Clinic', 'Kidney Transplant Clinic', 'Other'];

export const ethnicity_id = process.env.REACT_APP_ETHNICITY_ID;
export const comorbidities_id = process.env.REACT_APP_COMORBIDITIES_ID;
export const kc_provider_id = process.env.REACT_APP_KC_PROVIDER_ID;
export const pulse_org = 'UHCW NHS Trust and Coventry University';
export const other_org = 'UHCW NHS Trust and University of Warwick';
export const createc_org = 'University of Cambridge and oncology physiotherapist';
export const cancer_clinic_type = ['NHS', 'Private', 'Other'];
export const KD_BEAM_RESEARCH = 'KIDNEY-BEAM-RESEARCH';
export const KD_STUDY_NAME = 'Kidney Beam';
export const KD_ORG_NAME = `King's College Hospital NHS Trust`;
export const SHARE_NONE = 'None';
export const SHARE_MANDATORY = 'Mandatory';
export const SHARE_OPTIONAL = 'Optional';
export const SEVERITY_TAGS = { "None": "Not limited by breathlessness, not required oral or IV antibiotics over the past 12months, CF doesn't interfere with everyday life", "Occasional": "Occasionally limited by breathlessness, oral antibiotics and/or minimum of 1 course of IVs over the past 12months, CF related symptoms interfere a little with everyday life", "Moderate": "Moderate-severely breathless, may require oxygen overnight, and/or on exertion, and/or at rest, CF related symptoms limit participation in everyday activities such as housework", "TransplantReferral": "I’ve been referred for lung transplant", "TransplantReceived": "I’ve received a lung transplant" };

/* login redirection data */
export const LOGIN_REDIRECTION_URL = "https://www.pactster.com/cystic-fibrosis";
export const PACSTERUSER_ERRORMSG = "Authentication failed. Pactster user."

/* bloglist constant */
export const BLOG_LIST_CNT = 15;
export const BLOGLIST_TITLE_LIMIT = 68;
export const BLOGLIST_MSG_LIMIT = 120;
export const BLOG_TAGS = ["all", "news", "cystic fibrosis", "Postnatal", "asthma kids", "Menopause", "kidney disease", "prostate cancer", "cystic fibrosis youth", "Help"];
export const BLOG_TAGS_EXCEPT = ["all", "news", "Help"];
/* blogdetail constant */
export const BLOGDETAIL_LIST_LIMIT = 100;

/* account - membership */
export const ADMIN_EMAIL_ID = "hello@beamfeelgood.com";
export const Default_Symbol = '$';
export const Currency_Symbol = { 'USD': '$', 'GBP': '£', 'AUD': '$AUD' };

/* Liveclass */
export const FORM_URL_BEAMKIDNEY_WITH_EDUCATION = "https://docs.google.com/forms/d/e/1FAIpQLScIA8M2bK97KmzlU3tPDZa5waUfE6UB7pxqKP0JIKRpxw5pRA/viewform?usp=sf_link";
export const FORM_URL_BEAMKIDNEY_WITHOUT_EDUCATION  = "https://docs.google.com/forms/d/e/1FAIpQLSdqWnzI0Oaaz9scOtH8_f74AcOsNSyvpk4HWb0j91QedUMXCQ/viewform?usp=sf_link";
export const FORM_URL_BEAMCYSTIC_WITH_EDUCATION = "https://docs.google.com/forms/d/e/1FAIpQLSekWssdjwRJSGPV5ssCOoJnS8nAjOYSmVjQ9PP_ariVHLB5XA/viewform?usp=sf_link";
export const FORM_URL_BEAMCYSTIC_WITHOUT_EDUCATION = "https://docs.google.com/forms/d/e/1FAIpQLSebBKKkkWAqTAcB_Hf1eGQudjr_DZM30jl2ADktRtn4LOZdpA/viewform?usp=sf_link";

/* groups */
export const BEAM_CREATOR = ["Beam Team", "Study Leader", "Group Leader", "Group Admin", "Group Member", "User"];
export const OWNER = ["Group Leader", "Group Admin", "Group Member", "User"]
export const ADMIN = ["Group Admin", "Group Member", "User"]
export const GROUP_MEMBER = ["Group Member", "User"]
export const USER = ["User"];

/* Error Message */
export const ERROR_RESTRICTED_PAGE = 'Oops, you are not authorised to see this page!';
export const ERROR_BEAM_RESTRICTED_PAGE = 'Oops you are not authorised to see this area of Beam.';

/* Program Constant */
export const PROGRAM_SORT_FILTERLIST = ['Default', 'Newest first', 'Oldest first'];

/* all page meta tags */
export const HOME_TITLE = 'Home';
export const BEAM = ' | Beam';
export const HOME_DESC = 'At Beam, we help people with a health condition to move more in a way that makes them feel good, with on-demand and live classes, group support and handy resources.';
export const HOME_PAGE_IMAGE = FRONTEND_URL + '/images/health_blog1.png';
export const HOME_PAGE_IMAGE_ALT = 'Beam home scene with characters keeping active and feeling good';

export const ONDEMAND_TITLE = 'On-demand classes - ';
export const ONDEMAND_DESC = `Access what you need, whenever you feel like it. Beam's library of on-demand sessions include short, targeted activities to full classes to help you get active at any time.`;
export const ONDEMAND_PAGE_IMAGE = FRONTEND_URL + '/images/aboutclass-banner.png';
export const ONDEMAND_PAGE_IMAGE_ALT = 'Character exercising in living room in front of TV';


export const LIVECLASS_TITLE = 'Live classes - ';
export const LIVECLASS_DESC = 'Experience the feel-good energy of a live class wherever you are. Real-time, interactive, online classes give you the accountability and support that you may need to get moving more.';
export const LIVECLASS_PAGE_IMAGE = FRONTEND_URL + '/images/live_classes.png';
export const LIVECLASS_PAGE_IMAGE_ALT = 'Characters exercising in hospital room with instructor';

export const ABOUT_TITLE = 'Keeping active with ';
export const ABOUT_DESC = '';
export const ABOUT_PAGE_IMAGE = FRONTEND_URL + '/images/health_blog1.png';
export const ABOUT_PAGE_IMAGE_ALT = 'Characters exercising in gym setting';

export const GROUPS_TITLE = 'Groups - ';
export const GROUPS_DESC = 'Joining a group on Beam allows you to ask questions, celebrate successes, receive feedback, seek motivation, encourage others, pick up tips to use during class and grow friendships.';
export const GROUPS_PAGE_IMAGE = FRONTEND_URL + '/images/blog_img_04.png';
export const GROUPS_PAGE_IMAGE_ALT = 'Characters in yoga balance in bedroom setting';

export const INSTRUCTORS_TITLE = 'Instructors - ';
export const INSTRUCTORS_DESC = 'All classes on Beam are led by specialist instructors who are trained in your health condition or live with the condition themselves.';
export const INSTRUCTORS_PAGE_IMAGE = FRONTEND_URL + '/images/live_classes.png';
export const INSTRUCTORS_PAGE_IMAGE_ALT = 'Characters exercising in hospital room with instructor';

export const PROGRAMS_TITLE = 'Programs - ';
export const PROGRAMS_DESC = 'Programs on Beam are collections of classes designed to help you reach a specific goal.';
export const PROGRAMS_PAGE_IMAGE = FRONTEND_URL + '/images/afterlog.png';
export const PROGRAMS_PAGE_IMAGE_ALT = 'Beam hospital scene with characters keeping active';

export const ONDEMAND_DETAIL_TITLE = ' - on-demand class';
export const ONDEMAND_DETAIL_DESC = '';
export const ONDEMAND_DETAIL_PAGE_IMAGE = 'Class thumbnail';

//not applied
export const LIVECLASS_DETAIL_TITLE = ' - live class';
export const LIVECLASS_DETAIL_DESC = '';
export const LIVECLASS_DETAIL_PAGE_IMAGE = 'Class thumbnail';

export const INSTRUCTOR_DETAIL_TITLE = ' - Instructor';
export const INSTRUCTOR_DETAIL_DESC = '';
export const INSTRUCTOR_DETAIL_PAGE_IMAGE = 'Instructor headshot';
export const INSTRUCTOR_DETAIL_PAGE_IMAGE_ALT = ' - Instructor on Beam';

export const BLOG_TITLE = 'Blog';
export const BLOG_DESC = 'The Beam blog is bursting with inspiration to help you move more. Find yourself a good read that aligns with your interests while covering your medical needs.';
export const BLOG_PAGE_IMAGE = FRONTEND_URL + '/images/no-profile-pic.png';
export const BLOG_PAGE_IMAGE_ALT = 'Yellow character waving with blue background';

export const BLOG_DETAIL_TITLE = ' - Blog';
export const BLOG_DETAIL_DESC = '';
export const BLOG_DETAIL_PAGE_IMAGE = 'Blog post thumbnail or first image';

export const GROUP_DETAIL_ABOUT_TITLE = ' - About - Group';
export const GROUP_DETAIL_ABOUT_DESC = '';
export const GROUP_DETAIL_ABOUT_PAGE_IMAGE = FRONTEND_URL + '/images/small_banner_img.png';

export const GROUP_DETAIL_FEED_TITLE = ' - Feed - Group';
export const GROUP_DETAIL_FEED_DESC = 'The group feed is a place to share thoughts, ask questions, receive feedback, post pictures and encourage one another.';
export const GROUP_DETAIL_FEED_PAGE_IMAGE = FRONTEND_URL + '/images/small_banner_img.png';

export const GROUP_DETAIL_LIVE_TITLE = ' - Live class schedule - Group';
export const GROUP_DETAIL_LIVE_DESC = 'Live class schedules within a group enable you to find classes led for you by the group leader. Join with your friends from the group to support one another.';
export const GROUP_DETAIL_LIVE_PAGE_IMAGE = FRONTEND_URL + '/images/small_banner_img.png';

export const GROUP_DETAIL_MEMBER_TITLE = ' - Members - Group';
export const GROUP_DETAIL_MEMBER_DESC = 'Members of a group can be involved as much or as little as they wish. Some want to sit back and observe, while others love taking full advantage of access to specialist knowledge and peer support.';
export const GROUP_DETAIL_MEMBER_PAGE_IMAGE = FRONTEND_URL + '/images/small_banner_img.png';

export const PROGRAM_DETAIL_TITLE = ' - Program';
export const PROGRAM_DETAIL_DESC = 'Programs on Beam are collections of classes designed to give you a little more direction or to help you reach a specific goal.';
export const PROGRAM_DETAIL_PAGE_IMAGE = FRONTEND_URL + '/images/thanks.png';
export const PROGRAM_DETAIL_PAGE_IMAGE_ALT = 'Character exercising';

export const ABOUT_LIVE_TITLE = 'About our live classes';
export const ABOUT_LIVE_DESC = 'A guide containing all of the need-to-knows of taking part in a live class on Beam to experience the feel-good energy of a real-time session wherever you are.';
export const ABOUT_LIVE_PAGE_IMAGE = FRONTEND_URL + '/images/aboutclass-banner.png';
export const ABOUT_LIVE_PAGE_IMAGE_ALT = 'Character exercising in living room in front of TV';

export const ABOUT_US_TITLE = 'About us';
export const ABOUT_US_DESC = 'Learn about Beam and our dedication to helping people with a health condition to move more in a way that makes them feel good.';
export const ABOUT_US_PAGE_IMAGE = FRONTEND_URL + '/images/no-profile-pic.png';
export const ABOUT_US_PAGE_IMAGE_ALT = 'Yellow character waving with blue background';

export const ABOUT_HOW_TITLE = 'How it works';
export const ABOUT_HOW_DESC = 'Learn how Beam works including the features we have built, how you can sign up, and what pricing plan may suit you best.';
export const ABOUT_HOW_PAGE_IMAGE = FRONTEND_URL + '/images/Asset-4.png';
export const ABOUT_HOW_PAGE_IMAGE_ALT = 'Purple and orange character with looking glass';

export const ABOUT_HEALTH_TITLE = 'Partner with us';
export const ABOUT_HEALTH_DESC = 'From patients to clinicians, to healthcare commissioners, insurers, charities and employers - we work with anybody who believes that exercise can improve health outcome.';
export const ABOUT_HEALTH_PAGE_IMAGE = FRONTEND_URL + '/images/health_blog1.png';
export const ABOUT_HEALTH_PAGE_IMAGE_ALT = 'Characters riding a tandem bicycle';

export const HELP_TITLE = 'Contact us';
export const HELP_DESC = 'Want to reach the Beam Team? Whether you have a specific question or just want to share some thoughts, find us on social media or slip into our email inbox.';
export const HELP_PAGE_IMAGE = FRONTEND_URL + '/images/bottom.png';
export const HELP_PAGE_IMAGE_ALT = 'Mountains with character skiing';

export const TERMS_TITLE = 'T&Cs';
export const TERMS_DESC = `We know they're not an easy read, but we've gotta have 'em. Here are the terms and conditions of using Beam.`;
export const TERMS_PAGE_IMAGE = FRONTEND_URL + '/images/help_bg.png';
export const TERMS_PAGE_IMAGE_ALT = 'Clouds';

export const PRIVACY_TITLE = 'Privacy policy';
export const PRIVACY_DESC = 'At Beam, the privacy of our website visitors is super important to us and we are committed to protecting it. Here are all the details of our privacy policy.';
export const PRIVACY_PAGE_IMAGE = FRONTEND_URL + '/images/help_bg.png';
export const PRIVACY_PAGE_IMAGE_ALT = 'Clouds';

export const DASHBOARD_SCHEDULE_TITLE = 'My schedule';
export const DASHBOARD_SCHEDULE_DESC = 'Your personal class schedule on Beam shows you on an easy-to-view calendar what sessions you have coming up, so you never miss out on a dose of feel-good.';
export const DASHBOARD_SCHEDULE_PAGE_IMAGE = FRONTEND_URL + '/images/Dash_bg.png';
export const DASHBOARD_SCHEDULE_PAGE_IMAGE_ALT = 'Mountains with purple sky';

export const DASHBOARD_HISTORY_TITLE = 'My Activity Diary';
export const DASHBOARD_HISTORY_DESC = `Your personal record of all of the classes that you've completed on Beam. Every minute matters and we want to acknowledge every session that's made you feel good.`;
export const DASHBOARD_HISTORY_PAGE_IMAGE = FRONTEND_URL + '/images/Dash_bg.png';
export const DASHBOARD_HISTORY_PAGE_IMAGE_ALT = 'Mountains with purple sky';

export const DASHBOARD_SAVED_TITLE = 'My saved classes and blog posts';
export const DASHBOARD_SAVED_DESC = `Your curated lists of classes and blog posts. The ones you love. The ones that you're curious to explore later. The ones that have been recommended to you. They're here for you to revisit any time.`;
export const DASHBOARD_SAVED_PAGE_IMAGE = FRONTEND_URL + '/images/Dash_bg.png';
export const DASHBOARD_SAVED_PAGE_IMAGE_ALT = 'Mountains with purple sky';

export const DASHBOARD_GROUPS_TITLE = 'My groups';
export const DASHBOARD_GROUPS_DESC = `Easy access to all of the groups that you are a member of on Beam so that you never miss an exclusive class or a dose of feel-good in your group's feed.`;
export const DASHBOARD_GROUPS_PAGE_IMAGE = FRONTEND_URL + '/images/Dash_bg.png';
export const DASHBOARD_GROUPS_PAGE_IMAGE_ALT = 'Mountains with purple sky';

export const ACCOUNT_BASIC_TITLE = 'Your information - account details';
export const ACCOUNT_BASIC_DESC = 'It’s all about you! In this section of your dashboard you can upload a profile image, update your contact details or set yourself a username.';
export const ACCOUNT_BASIC_PAGE_IMAGE = FRONTEND_URL + '/images/banner_accounts.png';
export const ACCOUNT_BASIC_PAGE_IMAGE_ALT = 'Blue mountains with blue sky';

export const ACCOUNT_CONDITION_TITLE = 'Your health conditions - account details';
export const ACCOUNT_CONDITION_DESC = 'The health conditions that you told us you use Beam for are listed here so that you have easy access to all of our resources for each condition at the click of a button.';
export const ACCOUNT_CONDITION_PAGE_IMAGE = FRONTEND_URL + '/images/banner_accounts.png';
export const ACCOUNT_CONDITION_PAGE_IMAGE_ALT = 'Blue mountains with blue sky';

export const ACCOUNT_MEMBERSHIP_TITLE = 'Your membership - account details';
export const ACCOUNT_MEMBERSHIP_DESC = 'Check details of your membership plan, change your membership plan, check how many days are left in your current cycle, or apply a promocode in this section of your account.';
export const ACCOUNT_MEMBERSHIP_PAGE_IMAGE = FRONTEND_URL + '/images/banner_accounts.png';
export const ACCOUNT_MEMBERSHIP_PAGE_IMAGE_ALT = 'Blue mountains with blue sky';

export const FAQ_TITLE = 'FAQ';
export const FAQ_DESC = `We know they're not an easy read, but we've gotta have 'em. Here are the terms and conditions of using Beam.`;
export const FAQ_PAGE_IMAGE = FRONTEND_URL + '/images/help_bg.png';
export const FAQ_PAGE_IMAGE_ALT = 'Clouds';