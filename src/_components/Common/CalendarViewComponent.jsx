import React from "react";
import { connect } from "react-redux";
import * as constand from "../../constant";
import { commonService } from "../../_services";
import { toast } from "react-toastify";
import { fetchClassList, start_loader, stop_loader, joinClass, loginModelOpen, cancelClass, fetchGroupWorkout, fetchDashboardSchedule, setConditionIndex, registerformUpdate, attendeesClassList } from "../../actions";
import moment from 'moment';
import { Link } from 'react-router-dom';
import JoinClassComponent from "../LiveClasses/LiveClassJoinModel";
import AnimateLoaderComponent from "../../_layoutComponents/AnimateLoaderComponent";
import EventCalendarComponent from "../DashboardPage/EventCalendarComponent";
import ResearchStudyPollPopup from "../WorkoutDetailPage/ResearchStudyPollPopup";
import { Helmet } from "react-helmet";
import { Cookies } from "react-cookie-consent";
import WarningModal from "../Common/WarningModal";
import _ from 'lodash';
import EmergencyContactModal from "../LiveClasses/EmergencyContactModal";
import LiveClassAttendeesModal from "../LiveClasses/LiveClassAttendeesModal";

class CalendarViewComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signupLoader: false,
            Loading: true,
            offset: 0,
            count: 0,
            show_more_cnt: constand.CLASS_LIST_CNT,
            calenderLiveClassList: [],
            selectDate: this.props.firstScheduleDate,
            isCurrentWeek: 0,
            type: this.props.params, //(matchPath(this.props.location.pathname, '/liveClasses/:type')) ? matchPath(this.props.location.pathname, '/liveClasses/:type').params.type : '',
            isMobileView: false,
            modelState: false,
            modelData: {},
            total_tags: [],
            total_levels: [],
            total_videotype: [],
            init_weeks_days: [],
            Liveclass_Weeks: constand.Liveclass_Weeks,
            openResearchModel: false,
            current_attendee: {},
            redirectUrl: '',
            workoutId: '',
            condition: this.props.params,
            currentClass: {},
            isConditionModalOpen: false,
            isWarningModal: false,
            isAttendeesModelOpen: false,
            attendeesClassList: [],
            isPhysioLed: false

        };
        this.submitStartNow = this.submitStartNow.bind(this);
        this.modelClose = this.modelClose.bind(this);
        this.joinClassService = this.joinClassService.bind(this);
        this.getLiveClassList = this.getLiveClassList.bind(this);
        this.getGroupLiveClassList = this.getGroupLiveClassList.bind(this);
        this.getDashboardLiveclassList = this.getDashboardLiveclassList.bind(this);
        this.closeResearchModel = this.closeResearchModel.bind(this);
        this.viewPrepoll = this.viewPrepoll.bind(this);
        this.beforeReview = this.beforeReview.bind(this);
        this.lastState = this.props.params;

    }

    closeResearchModel() {
        this.setState({ openResearchModel: false });
    }

    beforeReview() {
        window.open(this.state.redirectUrl);
    }

    viewPrepoll(live) {
        live.Attendees.forEach((item) => {
            if (item.UserId === this.props.logged_userData.id) {
                this.setState({ redirectUrl: item.reference, current_attendee: item });
            }
        })
        if (!(commonService.returnTag("videoType", this.state.total_videotype, live.WorkoutId) == 'Education')) {
            this.setState({ openResearchModel: true, workoutId: live.WorkoutId })
        } else {
            this.beforeReview();
        }
    }

    /** fetch live class list on page did mount */
    componentDidMount() {

        this.setState({ allLiveClassData: this.props.allLiveClassData })
        var date = new Date();
        var startDate = date;
        var endDate = moment().add(6, 'd');
        var temp = [commonService.getWeekDays(startDate, endDate)];
        for (var i = 1; i < this.state.Liveclass_Weeks; i++) {
            startDate = moment(endDate).add(1, 'd');
            endDate = moment(endDate).add(7, 'd');
            temp.push(commonService.getWeekDays(startDate, endDate));
        }
        this.setState({ init_weeks_days: temp });
        let selectedLiveClassDate = temp[0];
        let isCurrentWeek = 0;
        let liveSelectedDate = new Date();
        if (this.props.firstScheduleDate) {
            let liveClassDate = moment(this.props.firstScheduleDate).format('YYYY-MM-DD');
            for (var j = 0; j < this.state.Liveclass_Weeks; j++) {

                if (temp[j].indexOf(liveClassDate) >= constand.CONSTZERO) {
                    selectedLiveClassDate = temp[j];
                    isCurrentWeek = j;
                }
                liveSelectedDate = this.props.firstScheduleDate;
            }

        }
        this.setState({
            selectDate: liveSelectedDate,
            selectedWeek: selectedLiveClassDate,
            isCurrentWeek: isCurrentWeek
        }, () => {
            this.fetchLiveClassList();
        })

    }
    toggleLiveClasses() {
        var liveClassData = this.state.allLiveClassData;
        var is_toggled = Cookies.get('is_toggled');
        if (is_toggled === 'true') {
            //show all
            this.groupListResult(liveClassData);

        } else {
            var exceptArray = []
            liveClassData.map(function (liveclass, key) {
                //liveclass.scheduledFor
                var schedule = moment(liveclass.scheduledFor).toDate();
                var midnight12 = moment(moment(liveclass.scheduledFor).hour('0').minute('01').second('0')).toDate();
                var morninig5 = moment(moment(liveclass.scheduledFor).hour('4').minute('59').second('0')).toDate();

                if (!(schedule >= midnight12 && schedule <= morninig5)) {
                    exceptArray.push(liveclass)
                }
            })
            this.groupListResult(exceptArray);
        }
    }

    getLiveClassList() {
        this.setState({ Loading: true });
        var dataObj = {
            "offset": this.state.offset,
            "limit": constand.CLASS_LIST_CNT,
            "condition": commonService.replaceChar(this.state.type, true),
            "dateChosen": moment(this.state.selectDate).format('YYYY-MM-DD')
        };
        this.props.fetchClassList(dataObj).then(
            response => {
                if (response) {
                    var list = response.list;
                    if (list && list.liveClasses) {
                        var liveClassData = list.liveClasses;
                        this.setState({ allLiveClassData: liveClassData });
                        this.toggleLiveClasses()
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
            }
        );
    }
    getGroupLiveClassList() {
        this.setState({ Loading: true });
        var dataObj = {
            "offset": this.state.offset,
            "limit": constand.CLASS_LIST_CNT,
            "condition": commonService.replaceChar(this.state.type, true),
            "dateChosen": moment(this.state.selectDate).format('YYYY-MM-DD'),
            "group": this.props.group

        };
        this.props.fetchGroupWorkout(dataObj).then(
            response => {
                if (response) {
                    var list = response.list;
                    if (list && list.liveClasses) {
                        var liveClassData = list.liveClasses;
                        this.setState({ allLiveClassData: liveClassData });
                        this.toggleLiveClasses()
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
            }
        );
    }
    getDashboardLiveclassList() {
        this.setState({ Loading: true });
        var dataObj = {
            "offset": this.state.offset,
            "limit": constand.CLASS_LIST_CNT,
            "condition": commonService.replaceChar(this.state.type, true),
            "dateChosen": moment(this.state.selectDate).format('YYYY-MM-DD'),
        };
        this.props.fetchDashboardSchedule(dataObj).then(
            response => {
                if (response) {
                    var list = response.list;
                    if (list && list.liveClasses) {
                        var liveClassData = list.liveClasses;
                        this.setState({ allLiveClassData: liveClassData });
                        this.toggleLiveClasses()
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
            }
        );
    }
    /**
     * fetch class list data
     */
    fetchLiveClassList() {
        switch (this.props.componentType) {
            case 'Liveclass':
                this.getLiveClassList()
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
    /**
        * call after sign in
        */
    componentWillReceiveProps(nextProps) {
        if (!this.props.is_auth && nextProps.is_auth) {
            this.setState({ calenderLiveClassList: [] });
            this.fetchLiveClassList();
        } else {
            this.setState({ calenderLiveClassList: [] }, function () { this.toggleLiveClasses(); });
        }
        if (this.lastState != nextProps.params) {
            this.lastState = nextProps.params;
            this.setState(
                {
                    type: nextProps.params
                },
                function () {
                    this.setState({ calenderLiveClassList: [] });
                    this.fetchLiveClassList();
                }
            );
        }
    }
    /**
   * render discipline list
   */
    renderDisciplineList(item) {
        var getDiscipline = commonService.returnTag("discipline", this.state.total_tags, item.WorkoutId);
        if (getDiscipline === 'None') {
            return (
                <div className="col-md-12 col-lg-12 col-sm-6 small-device float-left p-0"></div>
            )
        } else {
            return (
                <div className="col-md-12 col-lg-12 col-sm-6 small-device float-left p-0">
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
                <div className="col-md-12 col-lg-12 col-sm-6 small-device float-left p-0">
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
                            //<a className="btn btn-purple-inverse w-100 pad_list_btn font-medium m-b-10" href={item.Attendees[0].reference || '#'} target="_blank"> Go to class</a>
                            <a className="btn btn-purple-inverse w-100 pad_list_btn font-medium m-b-10" onClick={() => this.hasMembership(item, true)}> Go to class</a>
                        );
                    }
                } else {
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
                        //<a className="btn btn-purple-inverse w-100 pad_list_btn font-medium m-b-10" href={item.Attendees[0].reference || '#'} target="_blank"> Go to class</a>
                        <a className="btn btn-purple-inverse w-100 pad_list_btn font-medium m-b-10" onClick={() => this.hasMembership(item, true)} > Go to class </a>
                    );
                } else {
                    return (
                        <a className="btn btn-purple-inverse w-100 font-medium m-b-10" href={"/detail/" + item.Workout.id + "/" + commonService.replaceChar((commonService.replaceChar(Cookies.get('condition'), true)), false)} onClick={() => { localStorage.setItem('scheduleRoomId', item.id); }}>Start Now</a>
                    )
                }
            } else {
                if (isExceedCutOffTime) {
                    return (
                        <button disabled={true} className="btn btn-gray w-100 font-medium m-b-10 pad_list_btn" > {"Registration ended"} </button>
                    );
                }
                return (
                    <button disabled={this.state.signupLoader} onClick={() => this.submitStartNow(item)} className="btn btn-purple-inverse w-100 font-medium m-b-10 pad_list_btn" > Sign up </button>
                );
            }
        }
    }

    cancelCalss(item, index) {
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
                    const newItems = [...this.state.calenderLiveClassList];
                    newItems[index].Signedup = false;
                    if (this.props.componentType == 'Dashboard') {
                        newItems.splice(index, 1);
                        this.setState({
                            calenderLiveClassList: newItems,
                            cancelLoading: false
                        });
                    } else {
                        this.setState({
                            calenderLiveClassList: newItems,
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

    closeLiveClassAttendeesModel = () => {
        this.setState({ isAttendeesModelOpen: false });
    }

    /**
     * render item list
     */
    renderSubItemList() {
        return this.state.calenderLiveClassList.map((item, index) => (
            <div className={"list-group-item liveclass-listing"} key={index}>
                <div className="col-md-12">
                    <div className="row">
                        <div className="media col-md-3 col-lg-3 p-0">
                            <figure className="pull-left position-relative">
                                <Link to={"/liveClass/" + this.state.type + "/" + item.Workout.id} onClick={() => { Cookies.set('workoutId', item.id) }}>
                                    <img
                                        className="media-object image-size img-rounded img-fluid"
                                        src={constand.WORKOUT_IMG_PATH + item.Workout.id + "-img.png"}
                                        onError={(e) => commonService.checkImageCrop(e, 'ondemand-placeholder.png')}
                                    />
                                    {/* <ImageTag
                                        className="media-object image-size img-rounded img-fluid"
                                        src={constand.WORKOUT_IMG_PATH + item.Workout.id + "-img.png"}
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
                                <h3 className=" font-24 font-medium orangefont m-b-5">
                                    <Link to={"/liveClass/" + this.state.type + "/" + item.Workout.id} onClick={() => { Cookies.set('workoutId', item.id) }}> {item.Workout.title}</Link>
                                </h3>
                                <div className="col-md-12 col-lg-12 col-sm-6 small-device float-left m-b-10 p-0">
                                    <div className="p-0 border-0 float-left w-100">
                                        <img
                                            className="img-fluid rounded-circle"
                                            src={item.Workout && item.Workout.Instructor && item.Workout.Instructor.img ? constand.USER_IMAGE_PATH + item.Workout.Instructor.img : constand.WEB_IMAGES + 'instructor-placeholder.png'}
                                            onError={(e) => commonService.checkImageCrop(e, 'instructor-placeholder.png')}
                                            alt="" width="75" height="75"
                                        />
                                        {item.Workout.Instructor.hasProfile &&
                                            <Link to={"/instructor/" + item.Workout.Instructor.id + '/' + this.state.type} className="font-16 font-semibold black-txt p-l-5">
                                                {item.Workout.Instructor.User.name} {item.Workout.Instructor.User.lastName}
                                            </Link>
                                        }
                                        {!item.Workout.Instructor.hasProfile &&
                                            <span className="font-16 font-semibold black-txt p-l-5">
                                                {item.Workout.Instructor.User.name} {item.Workout.Instructor.User.lastName}
                                            </span>
                                        }
                                    </div>
                                </div>
                                {this.renderDisciplineList(item)}
                                {this.renderDificulty(item)}
                                {item.Workout.cutoffTime != 0 &&
                                    <div className="col-md-12 col-lg-12 col-sm-6 small-device float-left p-0 m-t-10">
                                        <span className="font-16 float-left font-medium " >
                                            Please note that registration to this class ends 30 minutes prior to the class beginning
                                        </span>
                                    </div>
                                }
                                {item.RoomExtension && item.RoomExtension.notes &&
                                    <div>
                                        <div className="col-md-12 col-lg-12 col-sm-6 small-device float-left p-0">
                                            <span className="w-40 font-16 font-bold black-txt float-left">
                                                A note about this class:</span>

                                        </div>
                                        <div className="col-md-12 col-lg-12 col-sm-6 small-device float-left p-0 liveclass-notes">
                                            <span className="w-40 font-16 font-semibold flow-text float-left" dangerouslySetInnerHTML={{
                                                __html: item.RoomExtension.notes
                                            }}>
                                            </span>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="col-lg-3 float-left col-md-3 p-0 text-center">
                                {this.renderSchedule(item)}
                                {(item.Signedup) &&
                                    <a href="javascript:void(0)"
                                        className="btn btn-purple w-100 pad_list_btn font-medium m-b-10 joinclass-blue-btn" onClick={() => this.cancelCalss(item, index)}
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
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        ));
    }
    /**
     * render live class list
     */
    renderLiveClassList() {
        return (
            <div>
                {this.renderSubItemList()}
            </div>
        );
    }
    /**
     * render load more option
     */
    renderLoadMore() {
        if (this.state.calenderLiveClassList && this.state.count > this.state.calenderLiveClassList.length) {
            return (
                <div className="w-100 text-center">
                    <a onClick={() => { this.incrementShowmoreCnt() }} className="btn btn-orange m-t-40 m-b-40 text-center font-book">Load more live classes</a>
                </div>
            );
        }
    }
    /**
    * render list
    */
    renderListData() {
        if (this.state.calenderLiveClassList && this.state.calenderLiveClassList.length > 0) {
            return (
                <div className="w-100">
                    {this.renderLiveClassList()}
                </div>
            );
        } else {
            return (
                <h3 className="w-100 text-center m-t-20 m-b-20">
                    Oh no!  There are no live classes scheduled for this day, try selecting another day or schedule an
                    {(this.props.group || (this.props.location.pathname.includes('dashboard') && this.props.logged_userData.isStudyParticipant)) &&
                        <Link to={"/group/ondemand/list/" + this.props.group + "/" + this.state.type}> on-demand class </Link>
                    }
                    {(!this.props.group && !this.props.logged_userData.isStudyParticipant) &&
                        <Link to={"/on-demand/" + this.state.type}> on-demand class </Link>
                    }
                </h3>
            );
        }
    }
    /**
     * load more class list
     */
    incrementShowmoreCnt() {
        this.setState({
            offset: this.state.offset + constand.CLASS_LIST_CNT
        }, function () {
            this.fetchLiveClassList();
        });
    }
    /**
     * for pagination result grouping
     */
    groupListResult(originalList) {
        let classList = [];
        let existingData = this.state.calenderLiveClassList;
        let newData = originalList;
        classList = [...existingData, ...newData];
        this.setState({ calenderLiveClassList: classList })
    }

    /**
    * setSelectedDate
    */
    changeSelectedDate(item) {
        this.setState({
            selectDate: item,
            calenderLiveClassList: [],
            offset: 0
        }, () => {
            this.fetchLiveClassList()
        })
    }
    /**
     * get day
     */
    getDate(item) {
        var weekDay = moment(item).format('DD');
        var dt = moment(item, "YYYY-MM-DD HH:mm:ss")
        var dayName = dt.format('ddd');
        weekDay = ((weekDay.toString()).length === 1) ? '-' + weekDay : weekDay;
        return dayName + ' ' + weekDay;
    }
    /**
     * render week days
     */
    renderWeekDays(weeks) {
        if (weeks) {
            var selectedDate = this.state.selectDate;
            var currentDate = moment(selectedDate).format('YYYY-MM-DD');
            return weeks.map((item, index) => (
                <div className="months-list float-left" key={index}>
                    <span onClick={() => { this.changeSelectedDate(item) }}
                        className={item === currentDate ? 'active' : '' + " pointer"}>{this.getDate(item)}
                    </span>
                </div>
            ));
        }
    }
    /**
     * selected month & day
     */
    seletedMonthDay() {
        var selectDate = this.state.selectDate;
        var monthName = moment(selectDate).format('MMMM');
        return monthName;
    }
    /**
     * goToPreviousWeek
     */
    goToPreviousWeek(week) {
        this.setState({
            selectedWeek: this.state.init_weeks_days[week],
            isCurrentWeek: week,
            calenderLiveClassList: [],
            selectDate: this.state.init_weeks_days[week][0],//new Date(),
            offset: 0
        }, () => {
            this.fetchLiveClassList()
        })
    }
    /**
     * goToNextWeek
     */
    goToNextWeek(week) {

        this.setState({
            selectedWeek: this.state.init_weeks_days[week],
            isCurrentWeek: week,
            calenderLiveClassList: [],
            selectDate: this.state.init_weeks_days[week][0],
            offset: 0
        }, () => {
            this.fetchLiveClassList()
        })
    }
    /**
     * render previous week icon
     */
    renderPreviousWeekIcon() {
        if (this.state.isCurrentWeek > 0) {
            return (
                <i onClick={() => { this.goToPreviousWeek(this.state.isCurrentWeek - 1) }} className="fa fa-angle-left float-left pointer"></i>
            )
        }
    }
    /**
     *  render NextWeek Icon
     */
    renderNextWeekIcon() {
        if (this.state.isCurrentWeek < constand.Liveclass_Weeks - 1) {

            return (
                <i onClick={() => { this.goToNextWeek(this.state.isCurrentWeek + 1) }} className="fa fa-angle-right float-right pointer"></i>
            )
        }
    }

    submitStartNow(item) {
        if (this.props.is_auth) {
            if (item.Workout.isPhysioLed && this.props.logged_userData && !this.props.logged_userData.hasEmergencyContact) {
                //for first time signup with isphysioled
                this.setState({ isEmergencyModalOpen: true, liveclassItem: item })
            } else {
                this.hasMembership(item);
            }
        } else {
            this.props.loginModelOpen(true);
        }
    }

    joinClassService() {
        var item = this.state.currentClass;
        var dataObj = { "roomId": item.id, "condition": (commonService.replaceChar(this.state.type, true)) };
        this.setState({ signupLoader: true }, function () {
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
                },
                error => {
                    this.setState({
                        signupLoader: false,
                        modelState: false,
                        modelData: {}
                    });
                    toast.error(error);
                }
            )
        });
    }
    hasMembership = (item, isGoToClass = false) => {
        if (this.props.is_auth) {
            var tagCondition = commonService.replaceChar(Cookies.get('condition'), true).toLowerCase();

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
    modelClose() {
        this.setState({
            Loading: false,
            offset: 0,
            count: 0,
            show_more_cnt: constand.CLASS_LIST_CNT,
            calenderLiveClassList: [],
            selectDate: new Date(),
            isCurrentWeek: 0,
            type: this.props.params, //(matchPath(this.props.location.pathname, '/liveClasses/:type')) ? matchPath(this.props.location.pathname, '/liveClasses/:type').params.type : '',
            isMobileView: false,
            modelState: false,
            modelData: {}
        }, function () { this.componentDidMount(); });
    }
    /**
    * get day
    */
    getMobileDate(item) {
        var dt = moment(item, "YYYY-MM-DD HH:mm:ss");
        var dayName = dt.format('dd');
        return dayName.charAt(0);
    }
    getMobileDay(item) {
        var weekDay = moment(item).format('DD');
        return weekDay;
    }
    /**
    * render week days
    */
    renderMobileWeekDays(weeks) {
        if (weeks) {
            var selectedDate = this.state.selectDate;
            var currentDate = moment(selectedDate).format('YYYY-MM-DD');
            return weeks.map((item, index) => (

                <div className="months-list float-left" key={index}>
                    <span onClick={() => { this.changeSelectedDate(item) }}
                        className={item === currentDate ? 'active' : 'pointer'}><div className="text-center">{this.getMobileDate(item)}</div><div className="text-center">{this.getMobileDay(item)}</div>
                    </span>
                </div>
            ));
        }
    }
    //main render
    render() {
        return (
            <div>
                <ResearchStudyPollPopup
                    is_model_open={this.state.openResearchModel}
                    closeResearchModel={this.closeResearchModel}
                    classType="Live"
                    beforeReview={this.beforeReview}
                    workoutId={this.state.workoutId}
                    current_attendee={this.state.current_attendee}
                />
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
                <div className="row border-box m-b-50">
                    <h4 className="card-header section_header date-heading w-100 font-medium text-center text-white">{this.seletedMonthDay()}</h4>
                    <div className="listname w-100 desktop-view">
                        {this.renderPreviousWeekIcon()}
                        {this.renderWeekDays(this.state.selectedWeek)}
                        {this.renderNextWeekIcon()}
                    </div>
                    <div className="listname w-100 mobile-view">
                        {this.renderPreviousWeekIcon()}
                        {this.renderMobileWeekDays(this.state.selectedWeek)}
                        {this.renderNextWeekIcon()}
                    </div>
                    <div className="text-center w-100">
                        {(this.state.Loading) && (<AnimateLoaderComponent />)}
                    </div>
                    {(!this.state.Loading) && this.renderListData()}
                </div>
                <JoinClassComponent is_model_open={this.state.modelState} modelData={this.state.modelData} modelClose={this.modelClose} isRejoin={this.state.isRejoin} condition={commonService.replaceChar(this.state.type, true)} />
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
                        successAction={() => { this.hasMembership(this.state.liveclassItem) }}
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
        logged_userData: state.header.logged_userData,
        healthcondition_list: state.register.healthcondition_list,
        registerFormvalues: state.register.registerFormValues,
        is_group_admin: state.group.is_group_admin
    };
};

const mapDispatchToProps = {
    fetchClassList, start_loader, stop_loader, joinClass, loginModelOpen, cancelClass, fetchGroupWorkout, fetchDashboardSchedule, setConditionIndex, registerformUpdate, attendeesClassList,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CalendarViewComponent);
