import React from "react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import * as constand from "../../constant";
import { commonService } from "../../_services";
import { toast } from "react-toastify";
import {
    fetchClassList, start_loader, stop_loader, joinClass, loginModelOpen, cancelClass, fetchGroupWorkout, fetchDashboardSchedule, ondemandCMSModelOpen, clearOndemandList, addLiveclassNotes, deleteLiveclassNotes, liveclassDetail, clearLiveclassDetail,
    setConditionIndex,
    registerformUpdate, attendeesClassList
} from "../../actions";
import moment from 'moment';
import AnimateLoaderComponent from "../../_layoutComponents/AnimateLoaderComponent";
import JoinClassComponent from "../LiveClasses/LiveClassJoinModel";
import LiveclassCMSComponent from "./LiveclassCMSComponent";
import EventCalendarComponent from "../DashboardPage/EventCalendarComponent";
import ResearchStudyPollPopup from "../WorkoutDetailPage/ResearchStudyPollPopup";
import { Helmet } from "react-helmet";
import { Cookies } from "react-cookie-consent";
import CKEditor from 'ckeditor4-react';
import ReactGA from 'react-ga';
import WarningModal from "../Common/WarningModal";
import _ from 'lodash';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import EmergencyContactModal from "../LiveClasses/EmergencyContactModal";
import LiveClassAttendeesModal from "../LiveClasses/LiveClassAttendeesModal";

const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
        { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
        { label: 'Italic', style: 'ITALIC' },
        { label: 'Underline', style: 'UNDERLINE' }
    ],
    BLOCK_TYPE_BUTTONS: [
        { label: 'UL', style: 'unordered-list-item' },
        { label: 'OL', style: 'ordered-list-item' }
    ]
};

class ListViewComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Loading: true,
            signupLoader: false,
            offset: 0,
            count: 0,
            show_more_cnt: constand.CLASS_LIST_CNT,
            liveClassList: [],
            allLiveClassData: [],
            displayLayout: true,
            type: this.props.params, //(matchPath(this.props.location.pathname, '/liveClasses/:type')) ? matchPath(this.props.location.pathname, '/liveClasses/:type').params.type : '', //this.props.params.type,
            modelState: false,
            modelData: {},
            firstScheduleDate: '',
            total_tags: [],
            total_levels: [],
            total_videotype: [],
            is_toggled: false,
            currentPageName: '',
            is_add_note: {},
            is_edit_note: [],
            //editorValue: RichTextEditor.createEmptyValue(),
            editorValue: [],
            notes: [],
            headerUrl: '',
            openResearchModel: false,
            current_attendee: {},
            redirectUrl: '',
            workoutId: '',
            condition: this.props.params,
            currentClass: {},
            isConditionModalOpen: false,
            isWarningModal: false,
            isEmergencyModalOpen: false,
            isAttendeesModelOpen: false,
            attendeesClassList: [],
            isPhysioLed: false
        };

        this.fetchLiveClassList = this.fetchLiveClassList.bind(this);
        this.submitStartNow = this.submitStartNow.bind(this);
        this.modelClose = this.modelClose.bind(this);
        this.joinClassService = this.joinClassService.bind(this);
        this.toggleClasses = this.toggleClasses.bind(this);
        this.getLiveClassList = this.getLiveClassList.bind(this);
        this.getGroupLiveClassList = this.getGroupLiveClassList.bind(this);
        this.getDashboardLiveclassList = this.getDashboardLiveclassList.bind(this);
        this.recallLiveclass = this.recallLiveclass.bind(this);
        this.handleChangeTextEdit = this.handleChangeTextEdit.bind(this);
        this.saveLiveclassNotes = this.saveLiveclassNotes.bind(this);
        this.deleteLiveclassNotes = this.deleteLiveclassNotes.bind(this);
        this.initiateNotesFlag = this.initiateNotesFlag.bind(this);
        this.getLiveClassDetail = this.getLiveClassDetail.bind(this);
        this.closeResearchModel = this.closeResearchModel.bind(this);
        this.viewPrepoll = this.viewPrepoll.bind(this);
        this.beforeReview = this.beforeReview.bind(this);
        this.authData = JSON.parse(localStorage.getItem('userDetails')) || this.props.logged_userData;
        this.lastState = this.props.params;
    }
    /** fetch live class list on page did mount */
    componentDidMount() {
        var headerUrl = this.props.location.pathname;
        var splitter = headerUrl.split('/')[1];
        this.setState({ currentPageName: splitter, headerUrl: headerUrl })

        this.props.clearOndemandList();
        this.props.ondemandCMSModelOpen({ open: false })
        this.fetchLiveClassList();
    }
    getLiveClassDetail(workoutId) {

        this.props.liveclassDetail(workoutId, this.state.type, null, this.props.groupId).then(
            response => {
                this.props.ondemandCMSModelOpen({ open: true, type: 'edit' })
            }, error => {
                console.log('err', error)
            });
    }
    submitStartNow(item) {
        if (this.props.is_auth) {

            this.hasMembership(item);
        } else {
            this.props.loginModelOpen(true);
        }
    }

    closeResearchModel() {
        this.setState({ openResearchModel: false });
    }

    beforeReview() {
        window.open(this.state.redirectUrl);
    }

    /**
     * call after sign in
     */
    componentWillReceiveProps(nextProps) {
        var headerUrl = this.props.location.pathname;
        var splitter = headerUrl.split('/')[1];
        this.setState({ currentPageName: splitter })
        if (this.props.liveclass_filter_instructor != nextProps.liveclass_filter_instructor) {
            this.setState({ liveClassList: [], allLiveClassData: [] }, function () { this.getLiveClassList(nextProps.liveclass_filter_instructor); });
        }
        if (!this.props.is_auth && nextProps.is_auth) {
            this.setState({ liveClassList: [] });
            this.fetchLiveClassList();
        } else {
            this.setState({ liveClassList: [] }, function () { this.toggleLiveClasses(); });
        }
        if (this.lastState != nextProps.params) {
            this.lastState = nextProps.params;
            this.setState(
                {
                    type: nextProps.params
                },
                function () {
                    this.setState({ liveClassList: [] });
                    this.fetchLiveClassList();
                }
            );
        }
    }
    handleChangeTextEdit = (value, key, index) => {
        var tempEditor = this.state.editorValue;
        var tempNotes = this.state.notes;
        tempEditor[key][index] = value.editor.getData();
        tempNotes[key][index] = value.editor.getData();

        this.setState({
            editorValue: tempEditor,
            notes: tempNotes
        });
    };
    saveLiveclassNotes(roomId, key, index) {
        var notes_data = this.state.notes[key][index] ? this.state.notes[key][index].toString('html').replace(/<a /g, '<a target="_blank" ') : this.state.liveClassList[key][index].RoomExtension['notes'].toString('html').replace(/<a /g, '<a target="_blank" ');
        var params = { roomId, notes: notes_data, };
        this.props.addLiveclassNotes(params).then(
            response => {
                const newItems = [...this.state.liveClassList];
                const tempAdd = this.state.is_add_note;
                const tempEdit = this.state.is_edit_note;
                newItems[key][index].RoomExtension = newItems[key][index].RoomExtension ? newItems[key][index].RoomExtension : [];
                newItems[key][index].RoomExtension['notes'] = notes_data;
                tempAdd[key][index] = false;
                tempEdit[key][index] = false;
                this.setState({
                    liveClassList: newItems,
                    is_add_note: tempAdd,
                    is_edit_note: tempEdit
                })
                toast.success(response.message);
            }, error => {
                toast.error(error);
            }
        );
    }
    deleteLiveclassNotes(roomId, key, index) {
        var params = { roomId };
        this.props.deleteLiveclassNotes(params).then(
            response => {
                const newItems = [...this.state.liveClassList];
                newItems[key][index].RoomExtension.notes = '';
                this.setState({
                    liveClassList: newItems
                })
                toast.success(response.message);
            }, error => {
                toast.error(error);
            }
        );
    }
    initiateNotesFlag() {
        var editArr = this.state.editorValue;
        var notesArr = this.state.notes;
        var arrayFlags = []
        _.forEach(this.state.liveClassList, function (list, keys) {
            arrayFlags[keys] = [];
            editArr[keys] = [];
            notesArr[keys] = [];
            _.forEach(list, function (list2, keys2) {
                arrayFlags[keys][keys2] = false;
                editArr[keys][keys2] = '';
                notesArr[keys][keys2] = '';
            })
        })
        this.setState({ editorValue: editArr, notes: notesArr });
    }
    /**
     *
     * @param {*} 
     */
    joinClassService() {
        var item = this.state.currentClass;
        var dataObj = { "roomId": item.id, "condition": commonService.replaceChar(this.state.type, true) };
        this.setState({ signupLoader: true });
        this.props.joinClass(dataObj).then(
            response => {
                if (response) {
                    this.setState({
                        signupLoader: false,
                        modelState: true,
                        modelData: item,
                        isRejoin: response.isRejoin
                    });
                }
                ReactGA.event({
                    category: "Live Class",
                    action: "Signed Up - List Page",
                    label: Cookies.get('condition') + '-' + item.Workout.title + '-' + item.Workout.id
                })
            },
            error => {
                this.setState({
                    signupLoader: false,
                    modelState: false,
                    modelData: {}
                });
                toast.error(error);
            }
        );
    }

    modelClose() {
        this.setState({
            Loading: false,
            offset: 0,
            count: 0,
            show_more_cnt: constand.CLASS_LIST_CNT,
            liveClassList: [],
            displayLayout: true,
            type: this.props.params,
            modelState: false,
            modelData: {}
        }, function () { this.fetchLiveClassList(); });
    }
    recallLiveclass() {
        this.setState({ allLiveClassData: [] });
        this.getLiveClassList();
    }
    getLiveClassList(filterValue = '') {
        this.setState({ Loading: true });
        var dataObj = {
            "offset": this.state.offset,
            "limit": constand.CLASS_LIST_CNT,
            "condition": commonService.replaceChar(this.state.type, true),
            "filter": filterValue
        };

        this.props.fetchClassList(dataObj).then(
            response => {
                if (response) {
                    var list = response.list;
                    if (list && list.liveClasses) {
                        var liveClassData = list.liveClasses;
                        this.setState({ allLiveClassData: liveClassData });
                        this.toggleLiveClasses();
                    }
                    this.setState({
                        Loading: false,
                        count: list.count,
                        total_tags: (response.list.tags) ? response.list.tags : [],
                        total_levels: (response.list.levelTags) ? response.list.levelTags : [],
                        total_videotype: (response.list.videotype) ? response.list.videotype : []
                    });
                }
            },
            error => {
                this.setState({
                    Loading: false
                });
                this.props.stop_loader();
            }
        );
    }
    getGroupLiveClassList() {

        this.setState({ Loading: true });
        var dataObj = {
            "offset": this.state.offset,
            "limit": constand.CLASS_LIST_CNT,
            "condition": commonService.replaceChar(this.state.type, true),
            "group": this.props.group
        };
        this.props.fetchGroupWorkout(dataObj).then(
            response => {
                if (response) {
                    var list = response.list;
                    if (list && list.liveClasses) {
                        var liveClassData = list.liveClasses;
                        this.setState({ allLiveClassData: liveClassData });
                        this.toggleLiveClasses();
                    }
                    this.setState({
                        Loading: false,
                        count: list.count,
                        total_tags: (response.list.tags) ? response.list.tags : [],
                        total_levels: (response.list.levelTags) ? response.list.levelTags : [],
                        total_videotype: (response.list.videotype) ? response.list.videotype : []
                    });
                }
            },
            error => {
                this.setState({
                    Loading: false
                });
                this.props.stop_loader();
            }
        );
    }
    getDashboardLiveclassList() {

        this.setState({ Loading: true });
        var dataObj = {
            "offset": this.state.offset,
            "limit": constand.CLASS_LIST_CNT,
            "condition": commonService.replaceChar(this.state.type, true)
        };
        this.props.fetchDashboardSchedule(dataObj).then(
            response => {
                if (response) {
                    var list = response.list;
                    if (list && list.liveClasses) {
                        var liveClassData = list.liveClasses;
                        this.setState({ allLiveClassData: liveClassData });
                        this.toggleLiveClasses();
                    }
                    this.setState({
                        Loading: false,
                        count: list.count,
                        total_tags: (response.list.tags) ? response.list.tags : [],
                        total_levels: (response.list.levelTags) ? response.list.levelTags : [],
                        total_videotype: (response.list.videotype) ? response.list.videotype : []
                    });
                }
            },
            error => {
                this.setState({
                    Loading: false
                });
                this.props.stop_loader();
            }
        );
    }
    /**
     * fetch class list data
     */
    fetchLiveClassList() {
        switch (this.props.componentType) {
            case 'Liveclass':
                this.getLiveClassList(this.props.liveclass_filter_instructor)
                break;
            case 'Group':
                this.getGroupLiveClassList();
                break;
            case 'Dashboard':
                this.getDashboardLiveclassList();
                break;
            default:
                this.getLiveClassList();
                break;
        }
    }

    toggleClasses(toggled) {
        this.setState({ is_toggled: toggled, liveClassList: [] }, function () { this.toggleLiveClasses(); });
    }
    toggleLiveClasses() {
        var liveClassData = this.state.allLiveClassData;
        var is_toggled = Cookies.get('is_toggled');
        if (is_toggled === 'true') {
            //show all
            this.groupListResult(liveClassData);

        } else {
            //waking hrs only
            var exceptArray = []
            liveClassData.map(function (liveclass, key) {
                var schedule = moment(liveclass.scheduledFor).toDate();
                var midnight12 = moment(moment(liveclass.scheduledFor).hour('0').minute('01').second('0')).toDate();
                var morninig5 = moment(moment(liveclass.scheduledFor).hour('4').minute('59').second('0')).toDate();

                if (!(schedule >= midnight12 && schedule <= morninig5)) {
                    exceptArray.push(liveclass)
                }
            });
            this.groupListResult(exceptArray);
        }
    }
    closeModel = () => {
        this.setState({ isConditionModalOpen: false, isWarningModal: false, isUpgradeModalOpen: false });
    }
    closeEmergencyModel = () => {
        this.setState({ isEmergencyModalOpen: false });
    }
    afterUpgrade = () => {
        if (this.state.isGoToClass) {
            //go to class
            window.open(this.state.currentClass.Attendees[0].reference);
        } else {
            //sign up class
            this.joinClassService();
        }
    }
    hasMembership = (item, isGoToClass = false) => {
        if (this.props.is_auth) {
            var tagCondition = commonService.replaceChar(Cookies.get('condition'), true).toLowerCase();
            if (item.Workout.isPhysioLed && this.props.logged_userData && !this.props.logged_userData.hasEmergencyContact) {
                //for first time signup with isphysioled
                this.setState({ isEmergencyModalOpen: true, liveclassItem: item })
                return;
            }
            this.authData = this.props.logged_userData;
            var hasMembership = commonService.checkUserHasMembership(this.authData, tagCondition);
            if (tagCondition.includes('research')) {
                //RS
                if (hasMembership != 1) {
                    this.setState({ enable_video: false, isWarningModal: true });
                } else {
                    this.setState({ enable_video: false, isWarningModal: false, isGoToClass: isGoToClass, currentClass: item, }, function () {
                        this.afterUpgrade();
                    });
                }
            } else {

                var me = this;
                var selectedHealth_condition = _.filter(this.props.healthcondition_list, function (list) {
                    return list.tag === (commonService.replaceChar(me.state.condition, true));
                });
                var currentPlan = commonService.returnCurrentPlan(this.authData, tagCondition);
                var health_conditionId = selectedHealth_condition[0].id;
                this.props.registerFormvalues.health_condition = selectedHealth_condition;
                this.setState({ hasMembership: hasMembership, health_conditionId: health_conditionId, currentPlanId: currentPlan.length ? currentPlan[0].id : 0, currentClass: item, isGoToClass: isGoToClass })
                if (!item.isFree) {
                    switch (hasMembership) {
                        case 0:
                            this.props.setConditionIndex(0);
                            this.props.registerformUpdate(this.props.registerFormvalues)
                            this.setState({ enable_video: false, isWarningModal: true });
                            break;
                        case 1:
                            this.setState({ isConditionModalOpen: false, isWarningModal: false }, function () {
                                this.afterUpgrade();
                            });
                            break;
                        case 2:
                            this.props.setConditionIndex(0);
                            this.props.registerformUpdate(this.props.registerFormvalues)
                            this.setState({ enable_video: false, isWarningModal: true });
                            break;
                    }
                } else {
                    this.setState({ isConditionModalOpen: false, isWarningModal: false }, function () {
                        this.afterUpgrade();
                    });
                }
            }
        } else {
            this.props.loginModelOpen(true);
        }
    }
    /**
    * render discipline list
    */
    renderDisciplineList(item, label) {
        var getDiscipline = commonService.returnTag("discipline", this.state.total_tags, item.WorkoutId);
        if (getDiscipline === 'None') {
            return (
                <div className={label === 'desktop' ? "col-md-12 col-lg-12 col-sm-6 small-device float-left p-0" : "col-12 float-left p-0"} ></div>
            )
        } else {
            return (
                <div className={label === 'desktop' ? "col-md-12 col-lg-12 col-sm-6 small-device float-left p-0" : "col-12 float-left p-0"}>
                    <span className="w-40 font-16 font-semibold black-txt float-left">
                        Discipline:
                    </span>
                    <span className="font-16 orangefont w-60 float-left font-medium p-l-5">
                        <span className="orangefont w-60 float-left font-medium p-l-5 capitalize_text">
                            {getDiscipline}
                        </span>
                    </span>
                </div>
            )
        }
    }
    /**
     * renderDificulty
     */
    renderDificulty(item, label) {
        var getDifficulty = commonService.returnTag("level", this.state.total_levels, item.WorkoutId);
        if (getDifficulty !== 'None') {
            return (
                <div className={label === 'desktop' ? "col-md-12 col-lg-12 col-sm-6 small-device float-left p-0" : "col-12 float-left p-0"}>
                    <span className="w-40 font-16 font-semibold black-txt float-left">
                        Difficulty:
                    </span>
                    <span className="font-16 orangefont w-60 float-left font-medium p-l-5 capitalize_text">
                        {getDifficulty}
                    </span>
                </div>
            )
        } else {
            return (
                <div className={label === 'desktop' ? "col-md-12 col-lg-12 col-sm-6 small-device float-left p-0" : "col-12 float-left p-0"}></div>
            )
        }
    }

    viewPrepoll(live) {
        var redirecturl = '';
        live.Attendees.forEach((item) => {
            if (item.UserId === this.props.logged_userData.id) {
                redirecturl = item.reference;
                this.setState({ redirectUrl: item.reference, current_attendee: item });
            }
        })
        if (!(commonService.returnTag("videoType", this.state.total_videotype, live.WorkoutId) == 'Education')) {
            this.setState({ openResearchModel: true, workoutId: live.WorkoutId })
        } else {
            window.open(redirecturl);
        }
    }
    /**
    * render start now or go to class
    */
    renderSchedule(item) {
        let authData = JSON.parse(localStorage.getItem('userDetails')) || this.props.logged_userData;
        var communityDetails = '';
        if (Object.keys(authData).length) {
            communityDetails = authData.Members.length ? authData.Members[0].Community : '';
        }
        var now = new Date();
        var isShowPoll = false;
        if (communityDetails && communityDetails.endDate) {
            var endDate = moment(communityDetails.endDate).utc().format('YYYY-MM-DD');
            var endDated = new Date(endDate);
            if (endDated.getTime() < now.getTime()) {
                isShowPoll = false;
            } else {
                isShowPoll = true;
            }
        } else {
            isShowPoll = true;
        }

        var isExceedCutOffTime = false;
        if (item.scheduledFor && item.Workout.cutoffTime) {
            var calcCutOffTime = new Date(moment(item.scheduledFor).subtract(item.Workout.cutoffTime, "minutes").format('YYYY-MM-DD HH:mm:ss'));
            if (now > calcCutOffTime) {
                isExceedCutOffTime = true;
            } else {
                isExceedCutOffTime = false;
            }
        }

        if (item.reference && (item.reference.toLowerCase() === 'coming soon')) {
            return (
                <a className="btn-purple-inverse pad_list_btn clearfix"> {item.reference} </a>
            );
        } else {
            var tagCondition = commonService.replaceChar(Cookies.get('condition'), true).toLowerCase();

            if (item.Signedup && this.props.logged_userData.isStudyParticipant && constand.RESEARCH_STUDY_LIST.includes(tagCondition)) {
                if (item.type == 'Live') {
                    if (isShowPoll) {
                        return (
                            <a className="btn btn-purple-inverse w-100 pad_list_btn font-medium m-b-10" onClick={() => this.viewPrepoll(item)} > Go to class </a>
                        );
                    } else {
                        return (
                            /* <a className="btn btn-purple-inverse w-100 pad_list_btn font-medium m-b-10" href={item.Attendees[0].reference || '#'} target="_blank" > Go to class ss</a> */
                            <a className="btn btn-purple-inverse w-100 pad_list_btn font-medium m-b-10" onClick={() => this.hasMembership(item, true)}> Go to class</a>
                        );
                    }
                }
                else {
                    return (
                        <a className="btn btn-purple-inverse w-100 font-medium m-b-10" href={"/detail/" + item.Workout.id + "/" + commonService.replaceChar(commonService.replaceChar(Cookies.get('condition'), true), false)} onClick={() => { localStorage.setItem('scheduleRoomId', item.id); }}>Start Now</a>
                    )
                }
            } else if ((item.Signedup && !this.props.logged_userData.isStudyParticipant)) {
                //core membership check
                if (item.type == 'Live') {
                    return (
                        <a className="btn btn-purple-inverse w-100 pad_list_btn font-medium m-b-10" onClick={() => this.hasMembership(item, true)} > Go to class </a>
                    );
                } else {
                    return (
                        <a className="btn btn-purple-inverse w-100 font-medium m-b-10" href={"/detail/" + item.Workout.id + "/" + commonService.replaceChar((commonService.replaceChar(Cookies.get('condition'), true)), false)} onClick={() => { localStorage.setItem('scheduleRoomId', item.id); }}>Start Now</a>
                    )
                }
            } else if ((item.Signedup && this.props.logged_userData.isStudyParticipant && !constand.RESEARCH_STUDY_LIST.includes(tagCondition))) {
                if (item.type == 'Live') {
                    return (
                        //<a className="btn btn-purple-inverse w-100 pad_list_btn font-medium m-b-10" href={item.Attendees[0].reference || '#'} target="_blank" > Go to class </a>
                        <a className="btn btn-purple-inverse w-100 pad_list_btn font-medium m-b-10" onClick={() => this.hasMembership(item, true)} > Go to class </a>
                    );
                } else {
                    return (
                        <a className="btn btn-purple-inverse w-100 font-medium m-b-10" href={"/detail/" + item.Workout.id + "/" + commonService.replaceChar(commonService.replaceChar(Cookies.get('condition'), true), false)} onClick={() => { localStorage.setItem('scheduleRoomId', item.id); }}>Start Now</a>
                    )
                }
            }
            else {
                if (isExceedCutOffTime) {
                    return (
                        <button disabled={true} className="btn btn-gray w-100 font-medium m-b-10 pad_list_btn" > {"Registration ended"} </button>
                    );
                }
                return (
                    <button disabled={this.state.signupLoader} onClick={() => this.submitStartNow(item)} className="btn btn-purple-inverse w-100 font-medium m-b-10 pad_list_btn" > {"Sign up"} </button>
                );
            }
        }
    }
    //cancel class
    cancelCalss(item, index, key) {
        if (!this.state.cancelLoading) {
            this.setState({ cancelLoading: true });
            var dataObj = {
                "roomId": item.id
            };
            this.props.cancelClass(dataObj).then(
                response => {
                    if (response) {
                        toast.success(response.message);
                    }

                    const newItems = [...this.state.liveClassList];
                    newItems[index][key].Signedup = false;
                    if (this.props.componentType == 'Dashboard') {
                        newItems[index].splice(key, 1);
                        var filtered = newItems.filter(function (el) {
                            return el.length > 0;
                        });
                        this.setState({
                            liveClassList: filtered,
                            cancelLoading: false
                        });
                    } else {
                        //other pages
                        this.setState({
                            liveClassList: newItems,
                            cancelLoading: false
                        });
                    }
                },
                error => {
                    this.setState({
                        cancelLoading: false
                    });
                }
            );
        }
    }
    /**
     * render item list
     */
    renderSubItemList(data, key) {
        var { editorValue } = this.state;
        var is_add_note = this.state.is_add_note;
        is_add_note[key] = is_add_note[key] ? is_add_note[key] : [];
        var is_edit_note = this.state.is_edit_note;
        is_edit_note[key] = is_edit_note[key] ? is_edit_note[key] : [];
        return data.map((item, index) => (
            <div className="list-group-item liveclass-listing" key={index}>
                <div className="col-md-12 desktop-view-live">
                    <div className="row">
                        <div className="media col-md-3 col-lg-3 p-0">
                            <figure className="pull-left position-relative">
                                <Link to={"/liveClass/" + this.state.type + "/" + item.Workout.id} onClick={() => {
                                    Cookies.set('workoutId', item.id);
                                    localStorage.setItem('group', this.props.group);
                                    localStorage.setItem('groupId', this.props.groupId)
                                }}>
                                    <img className="media-object image-size img-rounded img-fluid"
                                        src={constand.WORKOUT_IMG_PATH + item.Workout.id + "-img.png"}
                                        onError={(e) => commonService.checkImageCrop(e, 'ondemand-placeholder.png')} />
                                    {/* <ImageTag className="media-object image-size img-rounded img-fluid" src={constand.WORKOUT_IMG_PATH + item.Workout.id + "-img.png"}
                                    /> */}
                                </Link>

                                {/* <div className="time-box">
                                    <i className="fa fa-clock-o w-100"></i>
                                    <div className="w-100">{item.Workout.length} mins</div>
                                </div> */}
                                <span class="position-absolute vid_time"><span>{item.Workout.length} mins</span></span>
                                {item.isFree &&
                                    <div className="time-box free-icon">
                                        <img className="w-100" src={constand.WEB_IMAGES + "FreeClassIcon.png"} />
                                    </div>
                                }
                            </figure>
                        </div>
                        <div className="col-md-9 col-lg-9 p-0">
                            <div className="col-md-9 col-lg-9 col-sm-9 float-left pl-20">

                                <div className="col-md-12 col-lg-12 col-sm-6 small-device float-left m-b-10 p-0">
                                    <div className="p-0 border-0 float-left w-100">
                                        <img
                                            className="img-fluid rounded-circle w-20 m-r-20 pull-left"
                                            src={item.Workout && item.Workout.Instructor && item.Workout.Instructor.img ? constand.USER_IMAGE_PATH + item.Workout.Instructor.img : constand.WEB_IMAGES + 'instructor-placeholder.png'}
                                            onError={(e) => commonService.checkImageCrop(e, 'instructor-placeholder.png')}
                                            alt="" width="75" height="75"
                                        />
                                        <div className="font-24 font-medium orangefont m-b-5 w-80">
                                            <Link to={"/liveClass/" + this.state.type + "/" + item.Workout.id} onClick={() => { Cookies.set('workoutId', item.id); localStorage.setItem('group', this.props.group); localStorage.setItem('groupId', this.props.groupId) }}>  {item.Workout.title}
                                            </Link>
                                        </div>
                                        {(this.props.logged_userData.isStudyLeader || this.props.logged_userData.isGroupLeader || this.props.logged_userData.isStudyInstructor) &&
                                            <div className="w-80">
                                                {item.Community && item.Community.community_name &&
                                                    <span className="font-16 font-semibold black-txt">
                                                        Group : {item.Community.community_name}
                                                    </span>
                                                }
                                            </div>
                                        }
                                        <div className="w-80">with
                                            {item.Workout.Instructor.hasProfile &&
                                                <span>
                                                    <Link to={"/instructor/" + item.Workout.Instructor.id + '/' + this.state.type} className="font-16 font-semibold black-txt p-l-5">
                                                        {item.Workout.Instructor.User.name} {item.Workout.Instructor.User.lastName}
                                                    </Link>
                                                    {(this.props.group && this.props.props.groupState && this.props.props.groupState.groupLeader.id === this.props.logged_userData.id) &&
                                                        <CopyToClipboard text={constand.FRONTEND_URL + '/group/liveclasses/list/' + commonService.decodeUrl(this.props.group) + '/' + commonService.decodeUrl(commonService.replaceChar(this.state.type, true)) + '/' + item.id + '/pollReview'}
                                                            onCopy={() => this.setState({ copied: true })}>
                                                            <span title="Copy link to post class questionnaire"><i className="p-l-15 fa fa-clipboard fa-2x blue-text p-r-15 pointer"></i></span>
                                                        </CopyToClipboard>
                                                    }
                                                </span>
                                            }
                                            {/* Beam Kidney with education */}
                                            {(item.Workout.Instructor.UserId == this.props.logged_userData.id && commonService.replaceChar(this.props.params, true).toLowerCase() === constand.KR_CONDITION && (commonService.returnTag("discipline", this.state.total_tags, item.WorkoutId) == constand.Tag_Education) &&
                                                <CopyToClipboard text={constand.FORM_URL_BEAMKIDNEY_WITH_EDUCATION}
                                                    onCopy={() => this.setState({ copied: true })}>
                                                    <span title="Copy link to post class questionnaire"><i className="p-l-15 fa fa-clipboard fa-2x blue-text p-r-15 pointer"></i></span>
                                                </CopyToClipboard>

                                            )}
                                            {/* Beam Kidney without education */}
                                            {(item.Workout.Instructor.UserId == this.props.logged_userData.id && commonService.replaceChar(this.props.params, true).toLowerCase() === constand.KR_CONDITION &&
                                                (commonService.returnTag("discipline", this.state.total_tags, item.WorkoutId) != constand.Tag_Education) &&
                                                <CopyToClipboard text={constand.FORM_URL_BEAMKIDNEY_WITHOUT_EDUCATION}
                                                    onCopy={() => this.setState({ copied: true })}>
                                                    <span title="Copy link to post class questionnaire"><i className="p-l-15 fa fa-clipboard fa-2x blue-text p-r-15 pointer"></i></span>
                                                </CopyToClipboard>
                                            )}
                                            {/* Beam Cystic with education */}
                                            {(item.Workout.Instructor.UserId == this.props.logged_userData.id && commonService.replaceChar(this.props.params, true).toLowerCase() === constand.CONDITION &&
                                                (commonService.returnTag("discipline", this.state.total_tags, item.WorkoutId) == constand.Tag_Education) &&
                                                <CopyToClipboard text={constand.FORM_URL_BEAMCYSTIC_WITH_EDUCATION}
                                                    onCopy={() => this.setState({ copied: true })}>
                                                    <span title="Copy link to post class questionnaire"><i className="p-l-15 fa fa-clipboard fa-2x blue-text p-r-15 pointer"></i></span>
                                                </CopyToClipboard>

                                            )}
                                            {/* Beam Cystic without education */}
                                            {(item.Workout.Instructor.UserId == this.props.logged_userData.id && commonService.replaceChar(this.props.params, true).toLowerCase() === constand.CONDITION &&
                                                (commonService.returnTag("discipline", this.state.total_tags, item.WorkoutId) != constand.Tag_Education) &&
                                                <CopyToClipboard text={constand.FORM_URL_BEAMCYSTIC_WITHOUT_EDUCATION}
                                                    onCopy={() => this.setState({ copied: true })}>
                                                    <span title="Copy link to post class questionnaire"><i className="p-l-15 fa fa-clipboard fa-2x blue-text p-r-15 pointer"></i></span>
                                                </CopyToClipboard>
                                            )}

                                            {!item.Workout.Instructor.hasProfile &&
                                                <span className="font-16 font-semibold black-txt p-l-5">
                                                    {item.Workout.Instructor.User.name} {item.Workout.Instructor.User.lastName}
                                                    {(this.props.group && this.props.props.groupState && this.props.props.groupState.groupLeader.id === this.props.logged_userData.id) &&
                                                        <CopyToClipboard text={constand.FRONTEND_URL + '/group/liveclasses/list/' + commonService.decodeUrl(this.props.group) + '/' + commonService.decodeUrl(commonService.replaceChar(this.state.type, true)) + '/' + item.id + '/pollReview'}
                                                            onCopy={() => this.setState({ copied: true })}>
                                                            <span title="Copy link to post class questionnaire"><i className="p-l-15 fa fa-clipboard fa-2x blue-text p-r-15 pointer"></i></span>
                                                        </CopyToClipboard>
                                                    }
                                                </span>
                                            }
                                        </div>
                                    </div>
                                </div>
                                {this.renderDisciplineList(item, 'desktop')}
                                {this.renderDificulty(item, 'desktop')}
                                {item.RoomExtension && item.RoomExtension.notes && !is_edit_note[key][index] &&
                                    <div>
                                        <div className="col-md-12 col-lg-12 col-sm-6 small-device float-left p-0 m-t-10">
                                            <span className="w-40 font-16 font-bold black-txt float-left">
                                                A note about this class</span>
                                            {this.props.is_auth && this.props.is_create_mode &&
                                                <span className="font-16 float-right font-medium p-l-5 capitalize_text">
                                                    <span className="flow-text note-actions" onClick={() => {
                                                        var temp = this.state.is_edit_note;
                                                        temp[key][index] = true;
                                                        var tempEditor = this.state.editorValue;
                                                        tempEditor[key][index] = item.RoomExtension.notes;
                                                        this.setState({ is_edit_note: temp, editorValue: tempEditor })
                                                    }}>Edit</span>
                                                    <span className="m-l-10 flow-text note-actions" onClick={() => { this.deleteLiveclassNotes(item.id, key, index) }}>Delete</span>
                                                </span>
                                            }
                                        </div>
                                        <div className="col-md-12 col-lg-12 col-sm-6 small-device float-left p-0 liveclass-notes">
                                            <span className="w-40 font-16 font-medium flow-text float-left" dangerouslySetInnerHTML={{
                                                __html: item.RoomExtension.notes
                                            }}>
                                            </span>
                                        </div>
                                    </div>
                                }
                                {item.Workout.cutoffTime != 0 &&
                                    <div className="col-md-12 col-lg-12 col-sm-6 small-device float-left p-0 m-t-10">
                                        <span className="font-16 float-left font-medium " >
                                            Please note that registration to this class ends 30 minutes prior to the class beginning
                                        </span>
                                    </div>
                                }
                                {(!item.RoomExtension || !item.RoomExtension.notes) && !is_add_note[key][index] && this.props.is_auth && this.props.is_create_mode &&
                                    <div className="col-md-12 col-lg-12 col-sm-6 small-device float-left p-0 m-t-10">
                                        <span className="font-16 float-left font-medium note-actions flow-text" onClick={() => {
                                            var temp = this.state.is_add_note;
                                            temp[key][index] = true;
                                            this.setState({ is_add_note: temp })
                                        }}>
                                            Add a short note about this class
                                        </span>
                                    </div>
                                }
                                {(!item.RoomExtension || !item.RoomExtension.notes) && is_add_note[key][index] &&
                                    <div>
                                        <div className="col-md-12 col-lg-12 col-sm-6 small-device float-left p-0">
                                            <span className="w-40 font-16 font-bold gray-txt float-left">
                                                Add a short note about this class</span>
                                            {is_add_note[key][index] &&
                                                <span className="font-16 float-right font-medium p-l-5 capitalize_text">
                                                    <span className="flow-text note-actions" onClick={() => {
                                                        var temp = this.state.is_add_note;
                                                        temp[key][index] = false;
                                                        this.setState({ is_add_note: temp })
                                                    }}>Cancel</span>
                                                    <span className="m-l-10 flow-text note-actions" onClick={() => { this.saveLiveclassNotes(item.id, key, index) }}>Save</span>
                                                </span>
                                            }
                                        </div>
                                        <div className="col-md-12 col-lg-12 col-sm-6 small-device float-left p-0">
                                            <span className="w-100 font-16 font-semibold float-left">
                                                <CKEditor
                                                    data={editorValue[key][index]}
                                                    config={{
                                                        toolbar: [
                                                            ['Bold', 'Italic'],
                                                            ['NumberedList', 'BulletedList'],
                                                            ['Link', 'Unlink'],
                                                            ['Image', 'Table']
                                                        ],
                                                        height: '70px',
                                                        resize_enabled: false,
                                                        font_defaultLabel: 'Qregular',
                                                        fontSize_defaultLabel: '28px',
                                                        //addCss: ('body {font-size: 10px}'),
                                                        contentsCss: '../../../ckeditor.css',
                                                        stylesSet: [
                                                            {
                                                                element: 'p',
                                                                styles: { 'font-family': '#(Qregular)' },
                                                                overrides: [{ element: 'font', attributes: { 'face': null } }]
                                                            }
                                                        ],
                                                        font_style:
                                                            [{
                                                                element: 'p',
                                                                styles: { 'font-family': '#(Qregular)' },
                                                                overrides: [{ element: 'font', attributes: { 'face': null } }]
                                                            }
                                                            ],
                                                        font_names: 'Qregular'
                                                    }}
                                                    onChange={(val) => this.handleChangeTextEdit(val, key, index)}
                                                    onBeforeLoad={(CKEDITOR) => CKEDITOR.on('dialogDefinition', ev => {
                                                        if (ev.data.name == 'link') {
                                                            ev.data.definition.getContents('target').get('linkTargetType')['default'] = '_blank';
                                                            ev.data.definition.getContents('info').get('protocol')['default'] = 'https://';
                                                        }
                                                    })}

                                                />

                                                {/*                                                 <RichTextEditor
                                                    className=" font-qregular"
                                                    toolbarConfig={toolbarConfig}
                                                    value={editorValue[key][index]}
                                                    onChange={(val) => this.handleChangeTextEdit(val, key, index)}
                                                />
 */}                                            </span>
                                        </div>
                                    </div>
                                }
                                {is_edit_note[key][index] &&
                                    <div>
                                        <div className="col-md-12 col-lg-12 col-sm-6 small-device float-left p-0">
                                            <span className="w-40 font-16 font-bold gray-txt float-left">
                                                Edit a short note about this class</span>
                                            {is_edit_note[key][index] &&
                                                <span className="font-16 float-right font-medium p-l-5 capitalize_text">
                                                    <span className="flow-text note-actions" onClick={() => {
                                                        var temp = this.state.is_edit_note;
                                                        temp[key][index] = false;
                                                        this.setState({ is_edit_note: temp })
                                                    }}>Cancel</span>
                                                    <span className="m-l-10 flow-text note-actions" onClick={() => { this.saveLiveclassNotes(item.id, key, index) }}>Save</span>
                                                </span>
                                            }
                                        </div>
                                        <div className="col-md-12 col-lg-12 col-sm-6 small-device float-left p-0">
                                            <span className="w-100 font-16 font-semibold float-left">
                                                <CKEditor
                                                    data={this.state.editorValue[key][index]}
                                                    config={{
                                                        toolbar: [
                                                            ['Bold', 'Italic'],
                                                            ['NumberedList', 'BulletedList'],
                                                            ['Link', 'Unlink'],
                                                            ['Image', 'Table']
                                                        ],
                                                        height: '50px',
                                                        resize_enabled: false,
                                                        font_defaultLabel: 'Qregular',
                                                        fontSize_defaultLabel: '28px',
                                                        //addCss: ('body {font-size: 10px}'),
                                                        contentsCss: '../../../ckeditor.css',
                                                        stylesSet: [
                                                            {
                                                                element: 'p',
                                                                styles: { 'font-family': '#(Qregular)' },
                                                                overrides: [{ element: 'font', attributes: { 'face': null } }]
                                                            }
                                                        ],
                                                        font_style:
                                                            [{
                                                                element: 'p',
                                                                styles: { 'font-family': '#(Qregular)' },
                                                                overrides: [{ element: 'font', attributes: { 'face': null } }]
                                                            }
                                                            ],
                                                        font_names: 'Qregular'
                                                    }}
                                                    onChange={(val) => this.handleChangeTextEdit(val, key, index)}
                                                    onBeforeLoad={(CKEDITOR) => CKEDITOR.on('dialogDefinition', ev => {
                                                        if (ev.data.name == 'link') {
                                                            ev.data.definition.getContents('target').get('linkTargetType')['default'] = '_blank';
                                                            ev.data.definition.getContents('info').get('protocol')['default'] = 'https://';
                                                        }
                                                    })}

                                                />

                                                {/* <RichTextEditor
                                                    className=" font-qregular"
                                                    toolbarConfig={toolbarConfig}
                                                    value={this.state.editorValue[key][index]}
                                                    onChange={(val) => this.handleChangeTextEdit(val, key, index)}
                                                /> */}
                                            </span>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="col-lg-3 float-left col-md-3 p-0 text-center">
                                {this.renderSchedule(item)}
                                {(item.Signedup) &&
                                    <a href="javascript:void(0)"
                                        className="btn btn-purple w-100 pad_list_btn font-medium m-b-10 joinclass-blue-btn" onClick={() => this.cancelCalss(item, key, index)}
                                    >
                                        Oops, I can't make it
                                    </a>}
                                <span
                                    className="btn btn-default-list-blue w-100 clearfix pad_list_btn"
                                >
                                    {moment(item.scheduledFor).format("hh:mm A")}
                                </span>
                                {item.type == 'Live' && <span
                                    className="btn btn-default-list-orange w-100 clearfix pad_list_btn"
                                >
                                    Live Session
                                </span>
                                }
                                {(this.props.logged_userData.id == item.Workout.Instructor.UserId || this.props.logged_userData.isCreator || this.props.is_group_admin) &&
                                    <button disabled={this.state.signupLoader} onClick={() => this.renderClassListModel(item)} className="btn btn-orange-inverse button-filter close-btn  font-medium font-14 pointer w-100" > {"Class list"} </button>
                                }
                                {this.props.componentType == 'Dashboard' &&
                                    <EventCalendarComponent item={item} type={item.type} title={item.Workout.title} length={item.Workout.length} />
                                }
                                {this.props.is_auth && this.props.is_create_mode && constand.CMS_PAGES.includes(this.state.currentPageName) && !this.props.logged_userData.isStudyLeader &&
                                    <div className="pointer" onClick={() => { this.getLiveClassDetail(item.Workout.id) }}>
                                        <img src={constand.WEB_IMAGES + "edit-pencil.png"} class="float-right" />
                                    </div>
                                }
                                {this.props.is_auth && this.props.is_create_mode && constand.CMS_PAGES.includes(this.state.currentPageName) && this.props.logged_userData.isStudyLeader && !this.props.group &&
                                    <span className="btn btn-darkblue-inverse w-100 clearfix pad_list_btn"
                                        onClick={() => { this.getLiveClassDetail(item.Workout.id) }}>
                                        Edit Template</span>
                                }
                                {this.props.is_auth && (this.props.is_group_mode || this.props.is_create_mode) && (this.props.logged_userData.isGroupLeader || this.props.logged_userData.isStudyLeader) && this.props.group &&
                                    <span className="btn btn-default-list-orange w-100 clearfix pad_list_btn"
                                        onClick={() => { this.getLiveClassDetail(item.Workout.id) }}>
                                        Manage Class</span>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 mobile-view-live">
                    <div className="row">
                        <div className="media col-12 p-0">
                            <figure className="pull-left position-relative">
                                <Link to={"/liveClass/" + this.state.type + "/" + item.Workout.id} onClick={() => { Cookies.set('workoutId', item.id); localStorage.setItem('group', this.props.group); localStorage.setItem('groupId', this.props.groupId) }}>
                                    {/* <ImageTag
                                        className="media-object image-size img-rounded img-fluid"
                                        src={constand.WORKOUT_IMG_PATH + item.Workout.id + "-img.png"}
                                    /> */}
                                    <img className="media-object image-size img-rounded img-fluid"
                                        src={constand.WORKOUT_IMG_PATH + item.Workout.id + "-img.png"}
                                        onError={(e) => commonService.checkImageCrop(e, 'ondemand-placeholder.png')} />
                                </Link>
                                {/* <div className="time-box">
                                    <i className="fa fa-clock-o w-100"></i>
                                    <div className="w-100">{item.Workout.length} mins</div>
                                </div> */}
                                <span class="position-absolute vid_time"><span>{item.Workout.length} mins</span></span>
                                {item.isFree &&
                                    <div className="time-box free-icon">
                                        <img className="w-100" src={constand.WEB_IMAGES + "FreeClassIcon.png"} />
                                    </div>
                                }
                            </figure>
                        </div>
                        <div className="col-12 p-0">
                            <div className="col-12 float-left p-0 ">
                                <div className="col-12  float-left p-0">
                                    <div className="p-0 border-0 float-left w-100 m-t-5 m-b-5">
                                        <img
                                            className="img-fluid rounded-circle w-20 m-r-20 pull-left"
                                            src={item.Workout && item.Workout.Instructor && item.Workout.Instructor.img ? constand.USER_IMAGE_PATH + item.Workout.Instructor.img : constand.WEB_IMAGES + 'instructor-placeholder.png'}
                                            onError={(e) => commonService.checkImageCrop(e, 'instructor-placeholder.png')}
                                            alt="" width="75" height="75"
                                        />
                                        <div className="font-24 font-medium orangefont m-b-5 w-80">
                                            <Link to={"/liveClass/" + this.state.type + "/" + item.Workout.id} onClick={() => { Cookies.set('workoutId', item.id); localStorage.setItem('group', this.props.group); localStorage.setItem('groupId', this.props.groupId) }}> {item.Workout.title}</Link>
                                        </div>
                                        {(this.props.logged_userData.isStudyLeader || this.props.logged_userData.isGroupLeader || this.props.logged_userData.isStudyInstructor) &&
                                            <div className="w-80">
                                                {item.Community && item.Community.community_name &&
                                                    <span className="font-16 font-semibold black-txt">
                                                        Group : {item.Community.community_name}
                                                    </span>
                                                }
                                            </div>
                                        }
                                        <div className="w-80">with
                                            {item.Workout.Instructor.hasProfile &&
                                                <span>
                                                    <Link to={"/instructor/" + item.Workout.Instructor.id + '/' + this.state.type} className="font-16 font-semibold black-txt p-l-5">
                                                        {item.Workout.Instructor.User.name} {item.Workout.Instructor.User.lastName}
                                                    </Link>
                                                    {(this.props.group && this.props.props.groupState && this.props.props.groupState.groupLeader.id === this.props.logged_userData.id) &&
                                                        <CopyToClipboard text={constand.FRONTEND_URL + '/group/liveclasses/list/' + commonService.decodeUrl(this.props.group) + '/' + commonService.decodeUrl(commonService.replaceChar(this.state.type, true)) + '/' + item.id + '/pollReview'}
                                                            onCopy={() => this.setState({ copied: true })}>
                                                            <span title="Copy link to post class questionnaire"><i className="p-l-15 fa fa-clipboard fa-2x blue-text p-r-15 pointer"></i></span>
                                                        </CopyToClipboard>
                                                    }
                                                </span>
                                            }
                                            {!item.Workout.Instructor.hasProfile &&
                                                <span className="font-16 font-semibold black-txt p-l-5">
                                                    {item.Workout.Instructor.User.name} {item.Workout.Instructor.User.lastName}
                                                    {(this.props.group && this.props.props.groupState && this.props.props.groupState.groupLeader.id === this.props.logged_userData.id) &&
                                                        <CopyToClipboard text={constand.FRONTEND_URL + '/group/liveclasses/list/' + commonService.decodeUrl(this.props.group) + '/' + commonService.decodeUrl(commonService.replaceChar(this.state.type, true)) + '/' + item.id + '/pollReview'}
                                                            onCopy={() => this.setState({ copied: true })}>
                                                            <span title="Copy link to post class questionnaire"><i className="p-l-15 fa fa-clipboard fa-2x blue-text p-r-15 pointer"></i></span>
                                                        </CopyToClipboard>
                                                    }
                                                </span>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="font-medium col-12 p-0 m-b-10 float-left ">
                                    {this.renderDisciplineList(item, 'mobile')}
                                    {this.renderDificulty(item, 'mobile')}
                                    {/* <div className="col-md-4 col-sm-4 float-left p-0">
                                    <span className="w-40 float-left font-13 font-qregular black-txt">
                                        Language:
                                        </span>
                                    <span className="w-60 float-left">
                                        {" "}
                                        <img
                                            className="img-fluid p-l-5 p-b-10"
                                            src="/images/flag.png"
                                            alt=""
                                        />
                                    </span>
                                </div> */}
                                    {item.RoomExtension && item.RoomExtension.notes &&
                                        <div className=" liveclass-notes">
                                            <span className="w-40 font-16 font-bold black-txt float-left m-t-10">A note about this class</span>
                                            <span className="w-40 font-16 font-medium flow-text float-left" dangerouslySetInnerHTML={{
                                                __html: item.RoomExtension.notes
                                            }}>
                                            </span>
                                        </div>
                                    }
                                </div>
                            </div>

                        </div>
                        <div className="col-12 float-left p-0 text-center">
                            {this.renderSchedule(item)}
                            {(item.Signedup) &&
                                <a href="javascript:void(0)"
                                    className="btn btn-purple w-100 pad_list_btn font-medium m-b-10 joinclass-blue-btn" onClick={() => this.cancelCalss(item, key, index)}
                                >
                                    Oops, I can't make it
                                </a>}
                            <span
                                className="w-100 btn btn-default-list-blue clearfix pad_list_btn"
                            >
                                {moment(item.scheduledFor).format("hh:mm A")} {" " + commonService.localTimeZone()}
                            </span>
                            {item.type == 'Live' && <span
                                className="w-100 btn btn-default-list-orange clearfix pad_list_btn"
                            >
                                Live Session
                            </span>
                            }
                            {this.props.componentType == 'Dashboard' &&
                                <EventCalendarComponent item={item} type={item.type} title={item.Workout.title} length={item.Workout.length} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        ));
    }
    /**
     * render create live class list
     */
    renderCreateLiveclass() {

        return (
            <div>
                <div class="list-group-item liveclass-listing">
                    <div class="col-md-12 desktop-view-live">
                        <div class="row">
                            <div class="media col-md-3 col-lg-3 p-0">
                                <figure class="pull-left position-relative">
                                    <img class="media-object image-size img-rounded img-fluid" src={
                                        constand.WEB_IMAGES + "ondemand-placeholder.png"
                                    } />
                                </figure>
                            </div>
                            <div class="col-md-9 col-lg-9 p-0">
                                <div class="col-12 col-md-9 col-lg-12 col-sm-9 float-left pl-20">
                                    <div class="col-md-12 col-lg-12 col-sm-6 small-device float-left m-b-10 p-0">
                                        <div class="p-0 border-0 float-left w-100">
                                            <div class="font-24 font-medium m-b-5 w-80">New Live Beam Class
                                            </div>
                                            <p class="w-80 font-16 font-qregular black-txt">Click the plus sign to create a new Live Class!
                                            </p>
                                            <p class="w-80 font-16 font-qregular black-txt">You will need...
                                            </p>
                                            <div className="font-qregular w-100">
                                                <ul className="col-md-12 col-sm-12 float-left black-txt">
                                                    <li><span className="w-40 font-16 font-qregular float-left">
                                                        Beam Live Class Details Google Form Response</span></li>
                                                    <li>
                                                        <span className="w-40 font-16 font-qregular float-left col-11 p-0">
                                                            Class Image</span>
                                                        <div onClick={() => { this.props.ondemandCMSModelOpen({ open: true, type: 'add' }); this.props.clearLiveclassDetail() }} className="pointer">
                                                            <img src={constand.WEB_IMAGES + "add-plus.png"} class="float-right" />
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div class="col-md-12 mobile-view-live">
                        <div class="row">
                            <div class="media col-12 p-0">
                                <figure class="pull-left position-relative"><a href="/liveClass/kidney-disease/317">
                                    <img class="media-object image-size img-rounded img-fluid" src="https://devpactstercdn.s3-eu-west-1.amazonaws.com/api/img/workout/317-img.png" />
                                </a>
                                    <div class="time-box"><i class="fa fa-clock-o w-100"></i>
                                        <div class="w-100">40 mins</div>
                                    </div>
                                </figure>
                            </div>
                            <div class="col-12 p-0">
                                <div class="col-12 float-left p-0 ">
                                    <div class="col-12  float-left p-0">
                                        <div class="p-0 border-0 float-left w-100 m-t-5 m-b-5">
                                            <img class="img-fluid rounded-circle w-20 m-r-20 pull-left" src="https://devpactstercdn.s3-eu-west-1.amazonaws.com/api/img/instructor/JulesMayes.png" alt="" width="75" height="75" />
                                            <div class="font-24 font-medium orangefont m-b-5 w-80"><a href="/liveClass/kidney-disease/317"> Keep Moving</a></div>
                                            <div class="w-80">with<a class="font-16 font-semibold black-txt p-l-5" href="/instructor/41/undefined">Juliet Mayes</a></div>
                                        </div>
                                    </div>
                                    <div class="font-medium col-12 p-0 m-b-10 float-left ">
                                        <div class="col-12 float-left p-0"><span class="w-40 font-16 font-semibold black-txt float-left">Discipline:</span><span class="font-16 orangefont w-60 float-left font-medium p-l-5"><span class="orangefont w-60 float-left font-medium p-l-5 capitalize_text">cardio, resistance training, warm up, cool down, Strength and conditioning</span></span>
                                        </div>
                                        <div class="col-12 float-left p-0"><span class="w-40 font-16 font-semibold black-txt float-left">Difficulty:</span><span class="font-16 orangefont w-60 float-left font-medium p-l-5">beginner</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 float-left p-0 text-center"><button class="btn btn-purple-inverse w-100 font-medium m-b-10 pad_list_btn"> Sign up </button><span class="w-100 btn btn-default-list-blue clearfix pad_list_btn">03:30 PM  IST</span><span class="w-100 btn btn-default-list-orange clearfix pad_list_btn">Live Session</span>
                            </div>
                        </div>
                    </div>
                 */}</div>
            </div>
        );
    }
    /**
     * render live class list
     */
    renderLiveClassList() {

        return this.state.liveClassList.map((item, index) => (
            <div key={index}>
                <p className="section_header font-semibold">
                    {commonService.getDayNameFromDate(item[0].scheduledFor)}
                </p>
                {this.renderSubItemList(item, index)}
            </div>
        ));
    }
    /**
     * render load more option
     */
    renderLoadMore() {
        if (this.state.count > constand.CLASS_LIST_CNT) {
            return (
                <div className="col-md-12 col-lg-12 col-sm-12 text-center float-left">
                    <span
                        onClick={() => { this.incrementShowmoreCnt() }}
                        className="btn btn-orange m-t-40 m-b-40 font-book pointer"
                    >
                        Show more live classes
                    </span>
                </div>
            );
        }
    }

    /**
    * render list
    */
    renderListData() {
        return (
            <div >
                {/* this.props.is_auth && this.props.is_create_mode && constand.CMS_PAGES.includes(this.state.currentPageName) && !this.state.headerUrl.includes('/group/liveclasses') &&
                    <div id="products" className="row">
                        <div className="list-group w-100">
                            {this.renderCreateLiveclass()}
                        </div>
                    </div>
                 */}
                <div className="text-center w-100">
                    {(this.state.Loading) && (<AnimateLoaderComponent />)}
                </div>
                <React.Fragment>
                    {this.renderLiveClassComponent()}
                </React.Fragment>

            </div>
        );

    }
    /**
     * load more class list
     */
    incrementShowmoreCnt() {
        this.setState({
            offset: this.state.offset + constand.CLASS_LIST_CNT
        }, function () {
            this.getLiveClassList(this.props.liveclass_filter_instructor);
        });
    }
    /**
     * for pagination result grouping
     */
    groupListResult(originalList) {
        let classList = [];
        let existingData = this.state.liveClassList;
        let newData = originalList;
        var helper = {};
        let results = [];
        let firstScheduleDate = '';
        newData.map(function (item, key) {
            if (key === constand.CONSTZERO) {
                firstScheduleDate = item.scheduledFor;
            }
            if (existingData && existingData.length > 0 && newData && item && moment(existingData[existingData.length - 1][0].scheduledFor).format("DD/MM/YYYY") === moment(item.scheduledFor).format("DD/MM/YYYY")) {
                existingData[existingData.length - 1].push(item);
                classList = existingData;
            } else {
                var key = moment(item.scheduledFor).format("DD/MM/YYYY");
                if (!helper[key]) {
                    helper[key] = [];
                    helper[key].push(item)
                    results.push(helper[key]);
                }
                else {
                    helper[key].push(item)
                }
                classList = [...existingData, ...results];
            }
        });
        var me = this;
        this.setState({ liveClassList: classList, firstScheduleDate: firstScheduleDate }, function () {
            var headerUrl = this.props.location.pathname;
            var roomid = headerUrl.split('/')[6];
            var paramUrl = headerUrl.split('/')[7]; //prePollReview
            if (paramUrl == 'prePollReview' && me.props.logged_userData.isStudyParticipant && me.state.liveClassList.length && constand.RESEARCH_STUDY_LIST.includes(me.state.type.toLowerCase())) {
                var newArra = _.filter(this.state.liveClassList, function (list) {
                    return list[0].id === parseInt(roomid);
                });
                if (newArra.length)
                    this.viewPrepoll(newArra[0][0])
            }

        });
        this.initiateNotesFlag();
    }
    /**
     * renderLiveClassComponent
     */
    renderLiveClassComponent() {
        return (
            <React.Fragment>
                <ResearchStudyPollPopup
                    is_model_open={this.state.openResearchModel}
                    closeResearchModel={this.closeResearchModel}
                    classType="Live"
                    beforeReview={this.beforeReview}
                    workoutId={this.state.workoutId}
                    current_attendee={this.state.current_attendee}
                />
                {(this.state.liveClassList && this.state.liveClassList.length > 0) &&
                    <div id="products" className="row">
                        <div className="list-group w-100">
                            {this.renderLiveClassList()}
                        </div>
                    </div>}
            </React.Fragment>
        );

    }

    /**
     * change Layout
     */
    changeViewLayout() {
        var layout = this.state.displayLayout;
        this.setState({
            displayLayout: !layout
        })
    }

    closeLiveClassAttendeesModel = () => {
        this.setState({ isAttendeesModelOpen: false });
    }

    renderClassListModel = (item) => {
        if (this.props.is_auth) {
            this.classListModel(item);
        } else {
            this.props.loginModelOpen(true);
        }
    }

    classListModel = (item) => {
        this.setState({ isPhysioLed: item.Workout.isPhysioLed })
        this.props.attendeesClassList({ workoutId: item.Workout.id, roomId: item.id }).then(
            response => {
                if (response) {
                    this.setState({ attendeesClassList: response })
                    this.setState({ isAttendeesModelOpen: true })
                }
            },
            error => {
                this.setState({
                    Loading: false
                });
                this.props.stop_loader();
            }
        );
    }

    //main render
    render() {
        return (
            <div
                className=""
            >
                <Helmet>
                    <title>{constand.LIVECLASS_TITLE}{this.state.type}{constand.BEAM}</title>
                    <meta property="og:title" content={constand.LIVECLASS_TITLE + this.state.type + constand.BEAM} />
                    <meta property="og:description" content={constand.LIVECLASS_DESC} />
                    <meta property="og:image" content={constand.LIVECLASS_PAGE_IMAGE} />
                    <meta property="og:url" content={window.location.href} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta property="og:site_name" content="Beam" />
                    <meta name="twitter:image:alt" content={constand.LIVECLASS_PAGE_IMAGE_ALT} />
                </Helmet>
                {this.renderListData()}

                <JoinClassComponent is_model_open={this.state.modelState} modelData={this.state.modelData} modelClose={this.modelClose} isRejoin={this.state.isRejoin} condition={commonService.replaceChar(this.state.type, true)} />
                {this.props.is_cms_model &&
                    <LiveclassCMSComponent getList={this.recallLiveclass} group={this.props.group} groupId={this.props.groupId} />
                }
                {
                    <WarningModal
                        isConditionModalOpen={this.state.isConditionModalOpen}
                        conditionName={this.state.condition}
                        isWarningModal={this.state.isWarningModal}
                        closeModel={this.closeModel}
                        hasMembership={this.state.hasMembership}
                        health_conditionId={this.state.health_conditionId}
                        afterUpgrade={this.afterUpgrade}
                    />
                }
                {this.state.isEmergencyModalOpen &&
                    <EmergencyContactModal
                        is_model_open={this.state.isEmergencyModalOpen}
                        closeModel={this.closeEmergencyModel}
                        successAction={() => {
                            this.hasMembership(this.state.liveclassItem)
                        }}
                    />
                }
                {this.state.isAttendeesModelOpen &&
                    <LiveClassAttendeesModal
                        is_model_open={this.state.isAttendeesModelOpen}
                        closeModel={this.closeLiveClassAttendeesModel}
                        attendeesClassList={this.state.attendeesClassList}
                        isPhysioLed={this.state.isPhysioLed}
                    />
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        is_auth: state.auth.is_auth,
        is_create_mode: state.header.is_create_mode,
        is_cms_model: state.workout.is_cms_model,
        logged_userData: state.header.logged_userData,
        liveclass_filter_instructor: state.liveclass.liveclass_filter_instructor,
        is_group_mode: state.header.is_group_mode,
        healthcondition_list: state.register.healthcondition_list,
        registerFormvalues: state.register.registerFormValues,
        is_group_admin: state.group.is_group_admin
    };
};

const mapDispatchToProps = {
    fetchClassList, start_loader, stop_loader, joinClass, loginModelOpen, cancelClass, fetchGroupWorkout, fetchDashboardSchedule, ondemandCMSModelOpen, clearOndemandList, addLiveclassNotes, deleteLiveclassNotes, liveclassDetail, clearLiveclassDetail,
    setConditionIndex,
    registerformUpdate, attendeesClassList,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ListViewComponent);
