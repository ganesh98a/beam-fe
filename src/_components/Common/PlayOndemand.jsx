import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Cookies } from "react-cookie-consent";
import moment from 'moment';
import { toast } from "react-toastify";
import _ from 'lodash';

import {
    ondemandDetail,
    loginModelOpen,
    hasMembership,
    scheduleModelOpen,
    startVideo,
    saveTimeSpent,
    updateAfterModelState,
    setGoback,
    checkCron,
    registerformUpdate,
    updateMyConditions,
    setConditionIndex,
    updateUserdataRedex,
    changePlan,
    getPlanByCountry,
    isOpenAfterModel,
    isEnableVideo,
    isEndVideo,
    isOpenBeforeModel,
    isOpenPostPollModel,
    isOpenResearchModel,
    isOpenSafetyModel,
    isOpenProgramSurveyModel,
    isWarningModal,
    isConditionModalOpen,
    isPlayOndemand,
    joinToProgram,
    start_loader,
    stop_loader
} from "../../actions";
import * as constand from "../../constant";
import { ImageTag } from "../../tags";
import { commonService } from "../../_services";
import BeforeVideoPopup from "../WorkoutDetailPage/BeforeVideoPopup";
import AfterVideoPopup from "../WorkoutDetailPage/AfterVideoPopup";
import WorkoutPlayer from "../WorkoutDetailPage/WorkoutPlayer";
import SafetyDisclaimerComponent from "./SafetyDisclaimerComponent";
import ProgramSurveyComponent from "./ProgramSurveyComponent";
import ResearchStudyPollPopup from "../WorkoutDetailPage/ResearchStudyPollPopup";
import ResearchPostPopup from '../WorkoutDetailPage/ResearchPostPopup';
import WarningModal from "./WarningModal";

class PlayOndemand extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Loading: false,
            play_loader: false,
            share_enable: false,
            ondemand_detail_data: {},
            ondemand_paging: [],
            show_more_cnt: constand.INSTRUCTOR_ONDEMAND_CNT,
            enable_video: false,
            expanded: false,
            currentVideoTime: 0,
            current_attendee: {},
            openModel: false,
            openAfterModel: false,
            totalRating: 0,
            reviewLimit: true,
            all_tags: [],
            all_levels: [],
            stepVideo: 0,
            openSafetyModel: false,
            openSurveyModel: false,
            openPostPollModel: false,
            showReadMore: false,
            condition: this.props.condition,
            health_conditionId: 0,
            currentPlanId: 0,
            planData: {},
            countryPlans: [],
            payment_data: {},
            isWarningModal: false,
            programId: this.props.programid,
            isCreateCSafety: false,
            getProgramDetail: [],
            joinedUserProgramId: 0
        };
        this.props.history.listen((location, action) => {
            this.clearDatas();
        });
        this.clearDatas = this.clearDatas.bind(this);
        this.getOnDemandDetail = this.getOnDemandDetail.bind(this);
        this.updateSchedule = this.updateSchedule.bind(this);
        this.incrementShowmoreCnt = this.incrementShowmoreCnt.bind(this);
        this.getMoreTextDiv = this.getMoreTextDiv.bind(this);
        this.startVideo = this.startVideo.bind(this);
        this.saveTimeSpent = this.saveTimeSpent.bind(this);
        this.closeModel = this.closeModel.bind(this);
        this.closeResearchModel = this.closeResearchModel.bind(this);
        this.beforeReview = this.beforeReview.bind(this);
        this.closeVideoModel = this.closeVideoModel.bind(this);
        this.closeAfterModel = this.closeAfterModel.bind(this);
        this.goback = this.goback.bind(this);
        this.closeSafetyModel = this.closeSafetyModel.bind(this);
        this.safetyProcess = this.safetyProcess.bind(this);
        this.closeResearchPostModel = this.closeResearchPostModel.bind(this);
        this.authData = this.props.logged_userData || JSON.parse(localStorage.getItem('userDetails'));
    }

    componentDidMount() {
        console.log("playOndemand", this.props);
        let authData = this.props.logged_userData || JSON.parse(localStorage.getItem('userDetails'));
        window.scrollTo(0, 0);
        if (this.props.condition.includes('-')) {
            this.setState({
                condition: this.props.condition.replace(/-/g, ' '),
            })
        }
        document.addEventListener("contextmenu", this._handleContextMenu);
        setTimeout(() => {
            var inst_details = document.getElementById('instructor_details');
            if (inst_details) {
                var ht = document.getElementById('instructor_details').clientHeight;
                if (ht >= 180)
                    this.setState({ showReadMore: true })
            }
        }, 4000);

        this.enable_video = false;
        //  this.getOnDemandDetail();

        if (authData) {
            //upgrader
            this.props.registerFormvalues.userid = authData.id;
            this.props.registerFormvalues.firstname = authData.name;
            this.props.registerFormvalues.age = commonService.calculateAge(moment(authData.dob).format("DD-MM-YYYY"));
            this.props.registerFormvalues.health_condition = authData.UserConditions;
            this.props.registerFormvalues.country = authData.country;
            this.props.registerFormvalues.region = authData.region;
            //this.props.registerFormvalues.condition_professions = authData.UserConditions;
            this.props.registerformUpdate(this.props.registerFormvalues);

            this.props.getPlanByCountry(authData.country).then(response => {

                this.setState({ countryPlans: response.plans, ondemand_detail_data: this.props.workout_detail_data })
                if (this.props.openPlayOndemand)
                    this.hasMembership();
            });
        }
    }
    componentDidUpdate() {
        this.authData = JSON.parse(localStorage.getItem('userDetails')) || this.props.logged_userData;
    }
    checkCronfun() {
        var dataObj = {
            roomId: 39891
        }
        this.props.checkCron(dataObj).then(
            response => {
                if (response) {
                }
            },
            error => {
                toast.error(error);
            }
        );
    }

    componentWillUnmount() {
        document.removeEventListener("contextmenu", this._handleContextMenu);
        this.setState({
            Loading: false,
            share_enable: false,
            ondemand_detail_data: {},
            ondemand_paging: [],
            show_more_cnt: constand.INSTRUCTOR_ONDEMAND_CNT,
            enable_video: false,
            current_attendee: {}
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log('playondemand-nextProps', nextProps)
        this.setState({ getProgramDetail: nextProps.program_detail })
        if (nextProps.openPlayOndemand && this.props.openPlayOndemand != nextProps.openPlayOndemand) {
            this.hasMembership();
        }
    }
    /*  shouldComponentUpdate(nextProps) {
         if (this.props.openPlayOndemand != nextProps.openPlayOndemand) {
             this.hasMembership();
         }
     } */
    clearDatas() {
        window.scrollTo(0, 0);
        this.setState(
            {
                Loading: false,
                share_enable: false,
                ondemand_detail_data: {},
                ondemand_paging: [],
                show_more_cnt: constand.INSTRUCTOR_ONDEMAND_CNT,
                enable_video: false,
                expanded: false,
                currentVideoTime: 0,
                current_attendee: {}
            },
            function () {
                // this.getOnDemandDetail();
            }
        );
    }
    _handleContextMenu = event => {
        event.preventDefault();
    };
    getOnDemandDetail() {
        this.setState({ Loading: true });
        this.props.ondemandDetail(this.props.workoutId, this.props.condition).then(
            response => {
                if (response) {
                    var totalRating = this.calculateTotalRating(
                        this.props.workout_detail_data.reviews
                    );
                    this.setState({
                        Loading: false,
                        ondemand_detail_data: this.props.workout_detail_data,
                        totalRating: totalRating,
                        all_tags: (response.onDemandVideo.tags) ? response.onDemandVideo.tags : [],
                        all_levels: (response.onDemandVideo.levelTags) ? response.onDemandVideo.levelTags : []
                    });
                    this.incrementShowmoreCnt();
                }
            },
            error => {
                this.setState({
                    Loading: false,
                    ondemand_detail_data: this.props.workout_detail_data
                });
                toast.error(error);
            }
        );
    }
    calculateTotalRating(reviewList = []) {
        var returnValue = 0;
        if (reviewList) {
            for (var i = 0; i < reviewList.length; i++) {
                if (reviewList[i].avg_ratings && reviewList[i].avg_ratings > constand.CONSTZERO) {
                    returnValue = returnValue + parseInt(reviewList[i].avg_ratings);
                }
            }
            if (returnValue > 0) {
                returnValue = returnValue / reviewList.length;
            }
        }
        return returnValue;
    }
    startVideo() {
        //Backend entry for start the video
        console.log("startVideo--", this.props.isStartProgram);

        if (!this.state.play_loader) {
            var roomid = localStorage.getItem('scheduleRoomId');
            this.setState({ play_loader: true });
            this.props.isEndVideo(false);
            if (this.props.isStartProgram == true) {
                var params = { programId: this.props.programId }
                this.props.start_loader();
                this.props.joinToProgram(params).then(
                    response => {
                        //this.setState({ isJoinedNow: true })
                        this.setState({ joinedUserProgramId: response.data.id })
                        this.props.stop_loader();

                        console.log('joinToProgram-response', response)
                        if (response.status) {
                            //this.setState({ userProgramId: response.data.id })
                            //this.startNextClass(programId, item, programWorkoutsRecent, keyIndex)
                            //toast.success(response.message);
                            this.startVideoAction(roomid, response.data);
                        } else {
                            toast.error(response.message);
                        }
                    }, error => {
                        //this.setState({ isJoinedNow: false })
                        toast.error(error);
                    });
            } else {
                //start next classes
                this.startVideoAction(roomid);
            }
        }
    }

    startVideoAction = (roomid, userProgramData = null) => {
        this.props.startVideo({ workoutId: this.props.workoutId, roomId: roomid, programId: this.props.programId }).then(
            response => {
                if (response) {
                    console.log("program-details", response);
                    localStorage.setItem('scheduleRoomId', 0);
                    this.setState({
                        play_loader: false,
                        current_attendee: response.attendee ? response.attendee : {}
                    });

                    var tagCondition = commonService.replaceChar(Cookies.get('condition'), true).toLowerCase();
                    console.log('tagCondition', tagCondition)
                    // Research-Studies:-SPHERE
                    if (tagCondition.includes('research')) {

                        if (tagCondition.includes(constand.CREATEC_CONDITION) && commonService.returnTagName("videoType", "Exercise", this.props.workout_detail_data.workout.WorkoutTags ? this.props.workout_detail_data.workout.WorkoutTags : []) == 'Exercise') {
                            console.log('research-periyaif')
                            //show safety popup
                            this.props.isOpenSafetyModel(true);
                            this.setState({
                                //   openSafetyModel: true,
                                isCreateCSafety: true
                            });
                        } else {
                            //SP login users
                            this.checkPollToShow(tagCondition);
                        }
                    } else {
                        if(userProgramData && userProgramData.id){
                            console.log('userProgramData.id',userProgramData)
                            this.props.closeWithProgram(userProgramData)
                        }
                        //core beam users
                        console.log('this.props.program_detail', this.props.program_detail);
                        let programWorkoutsRecent = _.sortBy(this.props.program_detail.ProgramWorkouts, (e) => {
                            return e.workoutNum
                        });
                        console.log('this.props.programWorkoutsRecent', programWorkoutsRecent);

                        if (this.props.program_detail && this.props.program_detail.preSurvey && this.props.programId && programWorkoutsRecent[0].workoutId == this.props.workoutId) {
                            this.props.isOpenProgramSurveyModel(true);
                        }
                        else if (!constand.SAFETY_CONDITION_LIST.includes(tagCondition) && !(commonService.returnUserTags("safetyInfoConfirmed", tagCondition, this.props.logged_userData.Tags ? this.props.logged_userData.Tags : []).toLowerCase() == tagCondition.toLowerCase()) && (commonService.returnTagName("videoType", "Exercise", this.props.workout_detail_data.workout.WorkoutTags ? this.props.workout_detail_data.workout.WorkoutTags : []) == 'Exercise' || commonService.returnTagName("videoType", "Live Class Recording", this.props.workout_detail_data.workout.WorkoutTags ? this.props.workout_detail_data.workout.WorkoutTags : []) == 'Live Class Recording')) {
                            console.log('periyaif')
                            //show safety popup
                            this.props.isOpenSafetyModel(true);
                            //this.setState({ openSafetyModel: true });

                        } else if (commonService.returnTagName("videoType", "Education", this.props.workout_detail_data.workout.WorkoutTags ? this.props.workout_detail_data.workout.WorkoutTags : []) == 'Education') {
                            console.log('Elsif-1')
                            //dont show before feedback popup
                            this.beforeReview()
                        }
                        else {
                            console.log('Els')
                            //show before feedback popup
                            this.props.isOpenBeforeModel(true);
                            //this.setState({ openModel: true })
                        }
                    }
                }
            },
            error => {
                this.props.isOpenBeforeModel(false);

                this.setState({
                    play_loader: false,
                    // openModel: false, 
                    current_attendee: {}
                });
                toast.error(error);
            }
        );
    }

    safetyProcess() {
        this.props.isOpenProgramSurveyModel(false);
        // this.props.isOpenSafetyModel(false);
        this.setState({
            // openSafetyModel: false,
            isCreateCSafety: false
        });
        this.goback();
    }
    closeSafetyModel() {
        this.props.isOpenSafetyModel(false);
        this.setState({
            // openSafetyModel: false, 
            isCreateCSafety: false
        });

        var tagCondition = commonService.replaceChar(Cookies.get('condition'), true).toLowerCase();
        if (tagCondition.includes('research')) {
            this.checkPollToShow(tagCondition);
        } else {
            if (commonService.returnTagName("videoType", "Education", this.props.workout_detail_data.workout.WorkoutTags ? this.props.workout_detail_data.workout.WorkoutTags : []) == 'Education') {
                //dont show before feedback popup
                this.beforeReview()
            } else {
                //show before feedback popup
                //this.setState({ openModel: true })
                this.props.isOpenBeforeModel(true);

            }
        }
        this.clearPlayOndemand();
    }
    closeProgramSurveyModel = () => {
        this.props.isOpenProgramSurveyModel(false);
        if (!this.props.end_video) {
            //start video survey
            var tagCondition = commonService.replaceChar(Cookies.get('condition'), true).toLowerCase();
            if (!constand.SAFETY_CONDITION_LIST.includes(tagCondition) && !(commonService.returnUserTags("safetyInfoConfirmed", tagCondition, this.props.logged_userData.Tags ? this.props.logged_userData.Tags : []).toLowerCase() == tagCondition.toLowerCase()) && (commonService.returnTagName("videoType", "Exercise", this.props.workout_detail_data.workout.WorkoutTags ? this.props.workout_detail_data.workout.WorkoutTags : []) == 'Exercise' || commonService.returnTagName("videoType", "Live Class Recording", this.props.workout_detail_data.workout.WorkoutTags ? this.props.workout_detail_data.workout.WorkoutTags : []) == 'Live Class Recording')) {
                console.log('periyaif')
                //show safety popup
                this.props.isOpenSafetyModel(true);
                //this.setState({ openSafetyModel: true });

            } else if (commonService.returnTagName("videoType", "Education", this.props.workout_detail_data.workout.WorkoutTags ? this.props.workout_detail_data.workout.WorkoutTags : []) == 'Education') {
                console.log('Elsif-1')
                //dont show before feedback popup
                this.beforeReview()
            }
            else {
                console.log('Els')
                //show before feedback popup
                this.props.isOpenBeforeModel(true);
                //this.setState({ openModel: true })
            }
        } else {
            //end video survey
            if (commonService.returnTagName(
                "videoType",
                "Education",
                this.props.workout_detail_data.workout.WorkoutTags
                    ? this.props.workout_detail_data.workout.WorkoutTags
                    : []
            ) == 'Education') {
                this.props.isOpenAfterModel(this.state.show_after_review);

                this.setState({
                    stepVideo: 4
                });
            }
            else {
                this.props.isOpenAfterModel(this.state.show_after_review);

                this.setState({
                    stepVideo: 0
                });
            }
        }
    }
    closeModel() {
        console.log('closemodel')
        this.props.isOpenBeforeModel(false);
        this.props.isConditionModalOpen(false);
        this.props.isWarningModal(false);
        this.props.isPlayOndemand(false);
        this.clearPlayOndemand();
        // this.setState({ openModel: false, isConditionModalOpen: false, isWarningModal: false, isUpgradeModalOpen: false });
    }
    closeResearchModel() {
        this.props.isOpenResearchModel(false)
        //this.setState({ openResearchModel: false });
        this.clearPlayOndemand();

    }
    closeResearchPostModel() {
        this.props.isOpenPostPollModel(false);
        //  this.setState({ openPostPollModel: false });
        this.clearPlayOndemand();

    }
    closeVideoModel(time, show_after_review) {
        console.log('closeVideoModel', show_after_review)
        this.saveTimeSpent(time, show_after_review);
        //this.setState({ enable_video: false });
        this.props.isEnableVideo(false)
        this.props.isEndVideo(false);
        this.clearPlayOndemand();

    }
    closeAfterModel() {
        this.props.updateAfterModelState({ step: 1 });
        this.props.isOpenAfterModel(false);
        //this.setState({ openAfterModel: false });
        this.clearPlayOndemand();
    }
    clearPlayOndemand = () => {
        console.log('this.props.openSurveyModel**', this.props.openSurveyModel)
        console.log('this.props.openAfterModel**', this.props.openAfterModel)
        console.log('this.props.openBeforeModel**', this.props.openBeforeModel)
        console.log('this.props.openPostPollModel**', this.props.openPostPollModel)
        console.log('this.props.openResearchModel**', this.props.openResearchModel)
        console.log('this.props.openSafetyModel**', this.props.openSafetyModel)
        console.log('this.props.openWarningModal**', this.props.openWarningModal)
        console.log('this.props.openConditionModalOpen**', this.props.openConditionModalOpen)
        if (!this.props.openSurveyModel && !this.props.openAfterModel && !this.props.openBeforeModel && !this.props.openPostPollModel && !this.props.openResearchModel && !this.props.openSafetyModel && (!this.props.openWarningModal || !this.props.openConditionModalOpen)) {
            this.props.isPlayOndemand(false);
        }
    }
    beforeReview() {
        this.props.isOpenBeforeModel(false);
        this.props.isEnableVideo(true);
        // this.setState({ openModel: false, enable_video: true });

    }
    saveTimeSpent(time, show_after_review) {
        this.setState({ show_after_review: show_after_review })
        //Video watching time update
        if (this.state.current_attendee.RoomId) {
            var dataObj = {
                roomId: this.state.current_attendee.RoomId,
                time: time
            };
            if (time && time > 0) {
                this.props.saveTimeSpent(dataObj).then(
                    response => {
                        var tagCondition = commonService.replaceChar(Cookies.get('condition'), true).toLowerCase();
                        if (tagCondition.includes('research')) {
                            console.log('Tag-Class', commonService.returnTagName("videoType", "Education", this.props.workout_detail_data.workout.WorkoutTags ? this.props.workout_detail_data.workout.WorkoutTags : []));
                            if (this.props.logged_userData.isStudyParticipant && (commonService.returnTagName("videoType", "Education", this.props.workout_detail_data.workout.WorkoutTags ? this.props.workout_detail_data.workout.WorkoutTags : []) != 'Education')) {
                                //SP
                                var community = this.state.ondemand_detail_data.workout.CommunityId ? this.state.ondemand_detail_data.workout.Community : {};
                                console.log('startvideo-community', community)
                                var now = new Date();
                                if (community && community.endDate) {
                                    var endDate = moment(community.endDate).utc().format('YYYY-MM-DD');
                                    var endDated = new Date(endDate);
                                    if (endDated.getTime() < now.getTime()) {
                                        //dont show any popup after video
                                        this.props.isOpenAfterModel(false);
                                        this.setState({
                                            //openAfterModel: false, 
                                            stepVideo: 0
                                        });
                                    } else {
                                        console.log('preclasspoll-condiition')
                                        console.log('openpost poll')
                                        this.props.isOpenPostPollModel(true);
                                        // this.setState({ openPostPollModel: true })
                                    }
                                }
                                else {
                                    console.log('openpost poll')
                                    this.props.isOpenPostPollModel(true);

                                    //this.setState({ openPostPollModel: true })
                                }
                            } else {
                                //dont show any popup after video
                                this.props.isOpenAfterModel(false);

                                this.setState({
                                    // openAfterModel: false, 
                                    stepVideo: 0
                                });
                            }
                        } else {
                            //core beam
                            let programWorkoutsRecent = _.sortBy(this.props.program_detail.ProgramWorkouts, (e) => {
                                return e.workoutNum
                            });
                            console.log('this.props.programWorkoutsRecent', programWorkoutsRecent);
                            if (this.props.program_detail && this.props.program_detail.preSurvey && this.props.programId && programWorkoutsRecent[programWorkoutsRecent.length - 1].workoutId == this.props.workoutId && show_after_review) {
                                this.props.isEndVideo(true);
                                this.props.isOpenProgramSurveyModel(true);
                            } else if (commonService.returnTagName(
                                "videoType",
                                "Education",
                                this.props.workout_detail_data.workout.WorkoutTags
                                    ? this.props.workout_detail_data.workout.WorkoutTags
                                    : []
                            ) == 'Education') {
                                this.props.isOpenAfterModel(show_after_review);

                                this.setState({
                                    //  openAfterModel: show_after_review, 
                                    stepVideo: 4
                                });
                            }
                            else {
                                this.props.isOpenAfterModel(show_after_review);

                                this.setState({
                                    //  openAfterModel: show_after_review, 
                                    stepVideo: 0
                                });
                            }
                        }

                    },
                    error => {
                        toast.error(error);
                    }
                );
            }
        }
    }

    hasMembership() {
        var status_flag = this.props.logged_userData.membershipData
            ? this.props.logged_userData.membershipData.hasmembership
            : false;
        if (this.props.is_auth) {
            var hasMembership = commonService.checkUserHasMembership(this.authData, this.props.condition);
            console.log('hasMembership-wo-detail', hasMembership)

            if (this.props.condition.toLowerCase().includes('research')) {
                //only RS
                if (hasMembership != 1) {
                    this.props.isConditionModalOpen(false);
                    this.props.isWarningModal(true);
                    //this.setState({ isConditionModalOpen: false, isWarningModal: true });
                } else {
                    this.startVideo();
                    this.props.isConditionModalOpen(false);
                    this.props.isWarningModal(false);
                    //	this.setState({ isConditionModalOpen: false, isWarningModal: false });
                }
            } else {
                //core
                console.log('this.authData', this.authData)
                var me = this;
                console.log('all-props', this.props)
                console.log('healthcondition_list', this.props.healthcondition_list)
                var selectedHealth_condition = _.filter(this.props.healthcondition_list, function (list) {
                    return list.tag === (commonService.replaceChar(me.props.condition, true));
                });
                var currentPlan = commonService.returnCurrentPlan(this.authData, this.props.condition);

                console.log('selectedHealth_condition', selectedHealth_condition)
                var health_conditionId = selectedHealth_condition[0].id;
                this.props.registerFormvalues.health_condition = selectedHealth_condition;
                this.setState({ hasMembership: hasMembership, health_conditionId: health_conditionId, currentPlanId: currentPlan.length ? currentPlan[0].id : 0 })
                console.log('selectedHealth_condition-ondemand', this.props.workout_detail_data)
                
                if (this.props.workout_detail_data.workout.isFree) {
                    //isfree open the video with no restrictions
                    this.startVideo();
                    this.props.isConditionModalOpen(false);
                    this.props.isWarningModal(false);
                } else {
                    switch (hasMembership) {
                        case 0:
                            //toast.info(Errors.membership_playvideo);
                            this.props.setConditionIndex(0);
                            this.props.registerformUpdate(this.props.registerFormvalues)
                            this.props.isEnableVideo(false);
                            this.props.isWarningModal(true);
                            //this.setState({ enable_video: false, isWarningModal: true });
                            break;
                        case 1:
                            this.startVideo();
                            this.props.isConditionModalOpen(false);
                            this.props.isWarningModal(false);
                            //this.setState({ isConditionModalOpen: false, isWarningModal: false });
                            break;
                        case 2:
                            this.props.setConditionIndex(0);
                            this.props.registerformUpdate(this.props.registerFormvalues)
                            this.props.isEnableVideo(false);
                            this.props.isWarningModal(true);
                            //this.setState({ enable_video: false, isWarningModal: true });
                            break;
                    }
                }
            }
        } else {
            this.props.loginModelOpen(true);
        }
    }

    updateSchedule(scheduleData) {
        var onDemandDetail = this.state.ondemand_detail_data;
        onDemandDetail.scheduleData = scheduleData;
        this.setState({ ondemand_detail_data: onDemandDetail });
    }
    incrementShowmoreCnt() {
        if (
            this.state.ondemand_detail_data.likeMore &&
            this.state.ondemand_detail_data.likeMore.length > 0
        ) {
            var Ondemand_overviewData = this.state.ondemand_detail_data.likeMore;
            var paginatedData = this.state.ondemand_paging;
            for (
                var i = this.state.show_more_cnt - constand.INSTRUCTOR_ONDEMAND_CNT;
                i < this.state.show_more_cnt &&
                i < this.state.ondemand_detail_data.likeMore.length;
                i++
            ) {
                paginatedData.push(Ondemand_overviewData[i]);
            }
            this.setState({
                show_more_cnt:
                    this.state.show_more_cnt + constand.INSTRUCTOR_ONDEMAND_CNT,
                ondemand_paging: paginatedData
            });
        } else {
            this.setState({ ondemand_paging: [] });
        }
    }

    goback() {

        let authData = this.props.logged_userData || JSON.parse(localStorage.getItem('userDetails'));
        if (Object.keys(authData).length) {
            var community = authData.Members.length ? authData.Members[0].Community.community_name : '';
            if (this.state.ondemand_detail_data.workout && this.state.ondemand_detail_data.workout.CommunityId) {
                community = this.state.ondemand_detail_data.workout.CommunityId ? this.state.ondemand_detail_data.workout.Community.community_name : '';
                const { from } = { from: { pathname: '/group/ondemand/list/' + community + '/' + this.props.condition } };
                this.props.history.push(from);
            } else if (this.props.condition.toLowerCase().includes('research') && community) {
                const { from } = { from: { pathname: '/group/ondemand/list/' + community + '/' + this.props.condition } };
                this.props.history.push(from);
            } else if (this.props.condition.toLowerCase().includes('research') && this.props.prevPath && (this.props.prevPath.indexOf('/group/ondemand/list/') != -1))
                window.history.back();
            else {
                const { from } = { from: { pathname: '/on-demand/' + this.props.condition } };
                this.props.history.push(from);
            }
        } else {
            if (this.state.ondemand_detail_data.workout && this.state.ondemand_detail_data.workout.CommunityId) {
                var community = this.state.ondemand_detail_data.workout.CommunityId ? this.state.ondemand_detail_data.workout.Community.community_name : '';
                const { from } = { from: { pathname: '/group/ondemand/list/' + community + '/' + this.props.condition } };
                this.props.history.push(from);
            }
            else {
                const { from } = { from: { pathname: '/on-demand/' + this.props.condition } };
                this.props.history.push(from);
            }
        }
    }

    getMoreTextDiv(expanded) {
        this.setState({ expanded: expanded });
    }

    videoSection(div_class, type) {
        const ondemand_detail = this.state.ondemand_detail_data
            ? this.state.ondemand_detail_data
            : {};
        const ondemand_view_detail =
            Object.keys(ondemand_detail).length > 0 &&
                ondemand_detail.constructor === Object
                ? ondemand_detail.workout
                : {};
        if (type == 'desktop') {
            return (<div className={div_class}>
                {ondemand_view_detail.id && (
                    <ImageTag
                        src={
                            constand.WORKOUT_IMG_PATH +
                            ondemand_view_detail.id +
                            "-img.png"
                        }
                        className="img-fluid img-responsive"
                        width="100%"
                        thumb={constand.WEB_IMAGES + "ondemand-placeholder.png"}
                    />
                )}
                {!ondemand_view_detail.id && (
                    <img
                        src={constand.WEB_IMAGES + "no-image.png"}
                        className="img-fluid img-responsive"
                        width="100%"
                    />
                )}
                {(!this.state.play_loader) && this.state.ondemand_detail_data.isExist &&
                    (<img
                        onClick={() => this.hasMembership()}
                        className="img-fluid play-img pointer"
                        src={constand.WEB_IMAGES + "b-play-btn.png"}
                        alt="play"
                    />)}
                {!this.state.ondemand_detail_data.isExist && ondemand_view_detail.id &&
                    <div className="img-fluid play-img white-txt font-bold font-30 available-soon">Available soon...</div>
                }
            </div>);
        } else {
            return (<div className={div_class}>
                {ondemand_view_detail.id && (
                    <ImageTag
                        src={
                            constand.WORKOUT_IMG_PATH +
                            ondemand_view_detail.id +
                            "-img.png"
                        }
                        thumb={constand.WEB_IMAGES + "ondemand-placeholder.png"}
                        className=" img-responsive"
                        width="100%" height="200px"
                    />
                )}
                {!ondemand_view_detail.id && (
                    <img
                        src={constand.WEB_IMAGES + "no-image.png"}
                        className=" img-responsive"
                        width="100%" height="200px"
                    />
                )}
                {(!this.state.play_loader) && this.state.ondemand_detail_data.isExist &&
                    (<img
                        onClick={() => this.hasMembership()}
                        className="img-fluid play-img pointer"
                        src={constand.WEB_IMAGES + "b-play-btn.png"}
                        alt="play"
                    />)}
                {!this.state.ondemand_detail_data.isExist && ondemand_view_detail.id &&
                    <div className="img-fluid play-img white-txt font-bold font-16 available-soon w-100">Available soon...</div>
                }
            </div>);
        }
    }

    checkPollToShow = (tagCondition) => {

        var community = this.state.ondemand_detail_data.workout.CommunityId ? this.state.ondemand_detail_data.workout.Community : {};
        console.log('startvideo-community', community)
        var now = new Date();

        if (this.props.logged_userData.isStudyParticipant && constand.RESEARCH_STUDY_LIST.includes(tagCondition) && (commonService.returnTagName("videoType", "Education", this.props.workout_detail_data.workout.WorkoutTags ? this.props.workout_detail_data.workout.WorkoutTags : []) != 'Education')) {

            if (community.endDate) {
                var endDate = moment(community.endDate).utc().format('YYYY-MM-DD');
                var endDated = new Date(endDate);
                if (endDated.getTime() < now.getTime()) {
                    // show research study poll popup
                    this.beforeReview();
                } else {
                    console.log('preclasspoll-condiition')
                    this.props.isOpenResearchModel(true);
                    //  this.setState({ openResearchModel: true });
                }
            }
            else {
                this.props.isOpenResearchModel(true);
                //  this.setState({ openResearchModel: true });
            }
        } else { //if(constand.RESEARCH_STUDY_LIST.includes(tagCondition)) {
            console.log('not-regain-condiition')
            //dont show before feedback/research study popup
            this.beforeReview();
        }
    }

    render() {
        const ondemand_detail = this.state.ondemand_detail_data
            ? this.state.ondemand_detail_data
            : {};
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };
        let ondemand_view_detail =
            Object.keys(ondemand_detail).length > 0 &&
                ondemand_detail.constructor === Object
                ? ondemand_detail.workout
                : {};
        const shareUrl = window.location.href;//ondemand_view_detail.videoUrl;
        const title = ondemand_view_detail.title;
        const prev_state =
            this.state.ondemand_detail_data && this.state.ondemand_detail_data.isSaved
                ? this.state.ondemand_detail_data.isSaved
                : false;

        const instructorName = ondemand_view_detail.Instructor ? ondemand_view_detail.Instructor.User.name + ' ' + ondemand_view_detail.Instructor.User.lastName : '';
        const classThumb = constand.WORKOUT_IMG_PATH + ondemand_view_detail.id + "-img.png";
        console.log('this.props.workout_detail_data', this.props.workout_detail_data)
        return (
            <React.Fragment>
                <AfterVideoPopup
                    openModel={this.props.openAfterModel}
                    closeModel={this.closeAfterModel}
                    workoutId={this.props.workoutId}
                    workoutTitle={this.props.ondemand_detail_data}
                    current_attendee={this.state.current_attendee}
                    stepVideo={this.state.stepVideo}
                />
                {(this.props.enable_video === true) &&
                    <WorkoutPlayer
                        enable_video={this.props.enable_video}
                        closeVideoModel={this.closeVideoModel}
                        ondemandData={this.props.ondemand_detail_data}
                        current_attendee={this.state.current_attendee}
                    />}
                <BeforeVideoPopup
                    is_model_open={this.props.openBeforeModel}
                    closeModel={this.closeModel}
                    beforeReview={this.beforeReview}
                    workoutId={this.props.workoutId}
                    workoutTitle={this.props.ondemand_detail_data}
                    current_attendee={this.state.current_attendee}
                />
                <ResearchPostPopup
                    is_model_open={this.props.openPostPollModel}
                    closeResearchPostModel={this.closeResearchPostModel}
                    classType="On-demand"
                    beforeReview={this.beforeReview}
                    workoutId={this.props.workoutId}
                    current_attendee={this.state.current_attendee}
                    condition={this.props.condition}
                    history={this.props.history}
                />
                <ResearchStudyPollPopup
                    is_model_open={this.props.openResearchModel}
                    closeResearchModel={this.closeResearchModel}
                    classType="On-demand"
                    beforeReview={this.beforeReview}
                    workoutId={this.props.workoutId}
                    current_attendee={this.state.current_attendee}
                />
                <SafetyDisclaimerComponent
                    is_model_open={this.props.openSafetyModel}
                    modelClose={this.closeSafetyModel}
                    safetyProcess={this.safetyProcess}
                    type={this.state.isCreateCSafety ? 'createc' : 'core'}
                />

                <ProgramSurveyComponent
                    is_model_open={this.props.openSurveyModel}
                    modelClose={this.closeProgramSurveyModel}
                    programDetail={this.state.getProgramDetail}
                />

                {(this.props.condition) &&
                    <WarningModal
                        isConditionModalOpen={this.props.openConditionModalOpen}
                        conditionName={this.props.condition}
                        isWarningModal={this.props.openWarningModal}
                        closeModel={this.closeModel}
                        hasMembership={this.state.hasMembership}
                        health_conditionId={this.state.health_conditionId}
                        afterUpgrade={this.startVideo}
                    />
                }
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        is_auth: state.auth.is_auth,
        // condition: state.auth.condition,
        workout_detail_data: state.workout.workout_detail_data,
        logged_userData: state.header.logged_userData,
        scheduleRoomId: state.workout.scheduleRoomId,
        prevPath: state.workout.prevPath,
        healthcondition_list: state.register.healthcondition_list,
        registerFormvalues: state.register.registerFormValues,
        openAfterModel: state.workout.openAfterModel,
        enable_video: state.workout.enable_video,
        openBeforeModel: state.workout.openBeforeModel,
        openPostPollModel: state.workout.openPostPollModel,
        openResearchModel: state.workout.openResearchModel,
        openSafetyModel: state.workout.openSafetyModel,
        openSurveyModel: state.workout.openSurveyModel,
        openWarningModal: state.workout.openWarningModal,
        openConditionModalOpen: state.workout.openConditionModalOpen,
        openPlayOndemand: state.workout.openPlayOndemand,
        program_detail: state.programme.program_detail,
        end_video: state.workout.end_video,

    };
};

const mapDispatchToProps = {
    ondemandDetail,
    scheduleModelOpen,
    hasMembership,
    loginModelOpen,
    startVideo,
    saveTimeSpent,
    updateAfterModelState,
    setGoback,
    checkCron,
    registerformUpdate,
    updateMyConditions,
    setConditionIndex,
    updateUserdataRedex,
    changePlan,
    getPlanByCountry,
    isOpenAfterModel,
    isEnableVideo,
    isEndVideo,
    isOpenBeforeModel,
    isOpenPostPollModel,
    isOpenResearchModel,
    isOpenSafetyModel,
    isOpenProgramSurveyModel,
    isWarningModal,
    isConditionModalOpen,
    isPlayOndemand,
    joinToProgram,
    start_loader,
    stop_loader
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayOndemand);