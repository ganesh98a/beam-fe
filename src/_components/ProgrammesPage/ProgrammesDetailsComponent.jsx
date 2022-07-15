import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Cookies } from "react-cookie-consent";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Virtual, Navigation, Pagination, Autoplay } from "swiper/core";
import { floor } from 'mathjs';
import moment from 'moment';
import _ from 'lodash';

import {
    ProgrammeDetail,
    ProgrammeDetailWorkouts,
    loginModelOpen,
    joinToProgram,
    isPlayOndemand,
    setActiveSlider
} from "../../actions";
import * as constand from "../../constant";
import { ImageTag } from "../../tags";
import { commonService } from "../../_services";
import WorkoutSaveComponent from "../WorkoutsPage/workoutSaveComponent";
import WorkoutScheduleComponent from "../WorkoutsPage/WorkoutScheduleComponent";
import PlayOndemand from "../Common/PlayOndemand";
import ProgramPlayer from "./ProgramPlayer";
import AnimateLoaderComponent from "../../_layoutComponents/AnimateLoaderComponent";

SwiperCore.use([Pagination, Autoplay, Navigation, Virtual]);

class ProgrammesDetailComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            programmeDetail: {},
            programmeTags: [],
            programWorkouts: [],
            offset: constand.CONSTZERO,
            limit: constand.CONSTTHREE,
            workoutList: [],
            count: constand.CONSTZERO,
            condition: this.props.match.params.condition,
            programId: this.props.match.params.programId,
            isJoinedNow: false,
            completedClass: 0,
            completedPrograms: 0,
            enable_player: false,
            programTrailerURL: '',
            loader: false
        };
        this.goback = this.goback.bind(this);
        this.activeSlideKey = 0;
        this.swiperRef = React.createRef();
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        this.fetchProgrammeDetail();
        this.scrollToBottom();
    }
    componentDidUpdate() {
        this.scrollToBottom();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.active_slider != this.props.active_slider) {
            this.swiperRef.current.slideTo(nextProps.active_slider)
        }
    }
    // Start trailerVideo player
    startTrailerVideo = (trailerURL) => {
        this.setState({ enable_player: true, programTrailerURL: trailerURL })
    }

    // Close trailerVideo player
    closeVideoModel() {
        this.setState({ enable_player: false })
    }
    /**
     * fetch programme detail
     */
    fetchProgrammeDetail = () => {
        var data = { programId: this.state.programId }
        this.setState({ loader: true })
        this.props.ProgrammeDetail(data).then(
            response => {
                if (response) {
                    var detail = response.programmeDetail ? response.programmeDetail : {};
                    this.setState({
                        programmeDetail: detail,
                        programmeTags: detail.ProgramTags,
                        programWorkouts: detail.ProgramWorkouts
                    })
                    this.fetchProgrammeWorkouts(response.programmeDetail);
                }
            },
            error => {
                this.setState({
                    loader: false
                });
                toast.error(error);
            }
        );
    }
    /**
     * fetch programme detail
     */
    fetchProgrammeWorkouts = (programDetails) => {
        var data = { programId: this.props.match.params.programId }
        if (programDetails.UserPrograms && programDetails.UserPrograms.length) {
            let programWorkoutsRecent = _.sortBy(programDetails.UserPrograms, (e) => {
                return e.id
            }).reverse();
            data.userProgramId = programWorkoutsRecent[0].id;
        }
        this.props.ProgrammeDetailWorkouts(data).then(
            response => {
                this.setState({ loader: false })

                if (response) {
                    this.setState({
                        workoutList: response.list,
                        count: response.count,
                        completedClass: response.completedClass,
                        completedPrograms: response.completedPrograms,
                    })
                }
            },
            error => {
                this.setState({
                    loader: false
                });
                toast.error(error);
            }
        );
    }
    startNextClass = (programId = 0, programWorkoutsRecent, key = 0) => {
        var index = 0;
        if (!programId) {
            //var index = this.state.completedClass || 0;
            var index = key || 0;
        }
        var workout = { workout: programWorkoutsRecent[index].Workout };
        this.setState({
            workoutId: programWorkoutsRecent[index].workoutId,
            ondemand_detail_data: workout,
            isStartProgram: programId ? true : false
        }, function () {
            this.props.isPlayOndemand(true)
        })
    }

    joinProgram(programId, playClass = false, programWorkoutsRecent) {
        if (this.props.is_auth) {
            var params = { programId: programId }
            this.props.joinToProgram(params).then(
                response => {
                    this.setState({ isJoinedNow: true })
                    if (response.status) {
                        this.fetchProgrammeDetail();
                        this.setState({ userProgramId: response.data.id })
                        if (playClass) {
                            this.startNextClass(programId, programWorkoutsRecent)
                        }
                        toast.success(response.message);

                    } else {
                        toast.error(response.message);
                    }
                }, error => {
                    this.setState({ isJoinedNow: false })
                    toast.error(error);
                });
        } else {
            this.props.loginModelOpen(true);
        }
    }
    /**
     * To render equipment details
     * @param {*} programWorkouts 
     */
    renderEquipments(programWorkouts) {
        let returnVal = [];
        if (programWorkouts && programWorkouts.length > constand.CONSTZERO) {
            programWorkouts.map((item, keys) => {
                if (item.Workout.WorkoutTags && item.Workout.WorkoutTags.length > constand.CONSTZERO) {
                    item.Workout.WorkoutTags.map((val, keys) => {
                        if (val.Tag) {
                            if ((!returnVal || returnVal.indexOf(val.Tag.tag) === -1) && val.Tag.type === 'equipment' && val.Tag.tag && val.Tag.tag !== 'None') {
                                returnVal.push(val.Tag.tag);
                            }
                        }
                    })
                }
            });
        }
        if (returnVal && returnVal.length > constand.CONSTZERO) {
            return returnVal.map((item, index) => (
                <p key={"ep_" + index}>
                    {item}
                </p>
            ));
        }
    }
    goback() {
        window.history.back();
        /* const { from } = { from: { pathname: '/programs/' + (commonService.replaceChar((typeof Cookies.get('condition') != 'undefined' ? Cookies.get('condition') : this.props.match.params.condition), false)) } };
        this.props.history.push(from); */
    }
    savePageUrl = (url) => {
        if (url) {
            var pathnameTemp = url;
            Cookies.set("current-page-url", pathnameTemp);
        }
    }
    scrollToBottom = () => {
        if (this.props.location.hash === '#classes') {
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        } else {
            window.scrollTo(0, 0)
        }
    }
    render() {
        var userProgramId = 0;
        if (this.state.programmeDetail.UserProgram || (this.state.userProgramId && this.state.isJoinedNow)) {
            userProgramId = (this.state.programmeDetail.UserProgram && this.state.programmeDetail.UserProgram.id) ? this.state.programmeDetail.UserProgram.id : this.state.userProgramId;
        }
        let programWorkoutsRecent = _.sortBy(this.state.workoutList, (e) => {
            return e.workoutNum
        });
        console.log('this.state.programWorkoutsRecent', programWorkoutsRecent)

        /* let programWorkoutsRecentDate = _.sortBy(this.state.workoutList, (e) => {
            return e.completedAt && e.isCompleted
        }).reverse(); */
        var programWorkoutsRecentDate = _.orderBy(this.state.workoutList, function (o) { return new moment(o.completedAt) }, ['desc']);
        console.log('this.state.programWorkoutsRecent', programWorkoutsRecentDate)

        var completedWorkout = _.find(programWorkoutsRecentDate, { 'isCompleted': true });
        console.log('this.state.completedWorkout', completedWorkout)
        var completedWorkoutOrder = 0;
        if (completedWorkout && Object.keys(completedWorkout).length) {
            completedWorkoutOrder = completedWorkout.workoutNum;
        }
        console.log('this.state.completedWorkoutOrder', completedWorkoutOrder)

        return (
            <div className="program_detailcontent m-t-80">
                <Helmet>
                    <title>{this.state.programmeDetail.title ? this.state.programmeDetail.title : ''}{constand.PROGRAM_DETAIL_TITLE}{this.props.match.params.condition}{constand.BEAM}</title>
                    <meta property="og:title" content={this.state.programmeDetail.title ? this.state.programmeDetail.title : '' + constand.PROGRAM_DETAIL_TITLE + this.props.match.params.condition + constand.BEAM} />
                    <meta property="og:description" content={constand.PROGRAM_DETAIL_DESC} />
                    <meta property="og:image" content={constand.PROGRAM_DETAIL_PAGE_IMAGE} />
                    <meta property="og:url" content={window.location.href} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta property="og:site_name" content="Beam" />
                    <meta name="twitter:image:alt" content={constand.PROGRAM_DETAIL_PAGE_IMAGE} />
                </Helmet>
                {!this.state.loader &&
                    <div className="col-lg-8 offset-lg-2 col-md-8 offset-md-2 detailpage-width mobile_mr_align">
                        <div className="row">
                            <div className="program_heading p-t-40 p-b-5 col-lg-12">
                                <div className="m-b-10">
                                    <a
                                        href="javascript:void(0)"
                                        onClick={this.goback}
                                        className="font-15 font-book m-b-10 font-normal black-txt"
                                    >
                                        {" "}
                                        <i className="fa fa-chevron-left"></i> back to all programs</a>
                                </div>
                                <div className="row col-md-12 mobile_view_hide mobileview_center align-items-center">
                                    <h4 className="font-semibold font-24 darkblue-text col-md-8 d-flex align-items-center">{this.state.programmeDetail.title}
                                        {this.state.programmeDetail.trailerURL &&
                                            <button className={"ml-3 btn button-filter  font-medium font-14 pointer btn-purple-inverse d-flex align-items-center pl-1 pr-1 mb-0 justify-content-center mw_150"}
                                                onClick={() => {
                                                    this.startTrailerVideo(this.state.programmeDetail.trailerURL)
                                                }}
                                            > <img src={constand.WEB_IMAGES + 'play-purple-icon.png'} width="18px" className="mr-2" /> Watch trailer
                                            </button>
                                        }
                                    </h4>
                                    <h4 className="font-semibold font-24 orangefont col-md-4 text-right">{this.state.workoutList.length} Classes</h4>
                                </div>
                                <div className="mobile_view_show">
                                    <div className="row col-md-12 mobileview_center align-items-center">
                                        <h4 className="font-semibold font-24 darkblue-text col-md-12 text-center mx-auto my-3">{this.state.programmeDetail.title}</h4>
                                        <h4 className="font-semibold font-24 orangefont col-md-12 mx-auto text-center">{this.state.workoutList.length} Classes</h4>
                                        {this.state.programmeDetail.trailerURL &&
                                            <button className={"ml-3 btn button-filter  font-medium font-14 pointer mx-auto my-3 btn-purple-inverse d-flex align-items-center pl-1 pr-1 mb-0 justify-content-center"}
                                                onClick={() => {
                                                    this.startTrailerVideo(this.state.programmeDetail.trailerURL)
                                                }}
                                            > <img src={constand.WEB_IMAGES + 'play-purple-icon.png'} width="18px" className="mr-2" /> Watch trailer
                                            </button>
                                        }
                                    </div>
                                </div>
                                {/* <p className="black-txt font-21 font-medium">Sessions: {this.state.workoutList.length}</p> */}
                                {/* <Link onClick={() => this.savePageUrl("#classes")} to={"#classes"} class="btn btn-orange m-t-20 m-b-20 font-book nav-item ">View all {this.state.workoutList.length} Classes in the program</Link> */}
                                {/* <p className="black-txt font-21 font-medium">Level: All Levels</p> */}

                            </div>
                            {/* <div className="col-lg-4 p-t-40 p-b-5 align-self-center">
                            {this.state.programmeDetail.shortcode && !this.state.programmeDetail.UserProgram && !this.state.isJoinedNow &&
                                <button onClick={() => this.joinProgram(this.state.programmeDetail.id)}
                                    className="w-50 btn float-right dblog_btn font-14 btn-purple position-relative"
                                >
                                    Start{" "}
                                </button>
                            }
                            {this.state.programmeDetail.shortcode && (this.state.programmeDetail.UserProgram || this.state.isJoinedNow) &&
                                <button disabled={true}
                                    className="w-50 btn float-right dblog_btn font-14 btn-purple position-relative"
                                >
                                    {(this.state.programmeDetail.UserProgram && this.state.programmeDetail.UserProgram.startedDate && this.state.programmeDetail.UserProgram.completedDate && !this.state.isJoinedNow) ? 'Completed' : 'Started'}
                                </button>
                            }
                        </div> */}
                        </div>

                        <div className="demand-section--3  m-t-30 ">
                            <div className="row position-relative landing_swiper swipernavDetail">

                                {/* <h3 className="clearfix float-left m-b-40 text-center font-semibold font-24 darkblue-text w-100">Classes</h3> */}
                                <Swiper
                                    containerModifierClass="w-90 "
                                    breakpoints={{ 1: { slidesPerView: 1, spaceBetweenSlides: 0 }, 1000: { slidesPerView: 3, spaceBetweenSlides: 40 } }}
                                    // slidesPerView={3}
                                    spaceBetween={10}
                                    initialSlide={this.props.active_slider}
                                    observeParents={true}
                                    observer={true}
                                    observeSlideChildren={true}
                                    watchSlidesProgress={true}
                                    onSlideChange={() => { }}
                                    //autoplay={{ delay: 6000, disableOnInteraction: false }}
                                    loop={false}
                                    //pagination={{ clickable: true }}
                                    // centeredSlides={true}
                                    //  showsPagination={false}
                                    //breakpoints={{ 1: { slidesPerView: 1, spaceBetweenSlides: 30 }, 1000: { slidesPerView: 3, spaceBetweenSlides: 30 } }} 
                                    navigation={{ nextEl: '.swipernavDetail .swiper-button-next', prevEl: '.swipernavDetail .swiper-button-prev' }}
                                    className="mySwiper"
                                    onSwiper={(swiper) => {
                                        this.swiperRef.current = swiper;
                                    }}
                                >
                                    {programWorkoutsRecent && programWorkoutsRecent.length > constand.CONSTZERO && (
                                        <div className="col-md-12 col-lg-12 col-sm-12 p-0">
                                            <div className="row">
                                                {programWorkoutsRecent.map((item, key) => {
                                                    var playClass = false;
                                                    if (completedWorkoutOrder) { //existing video completed
                                                        if (key == 0 && key < completedWorkoutOrder && !programWorkoutsRecent[0].isCompleted) {
                                                            playClass = true;
                                                            this.activeSlideKey = 0;
                                                            this.props.setActiveSlider(key);
                                                        } else if (key && (key == completedWorkoutOrder) && programWorkoutsRecent[completedWorkoutOrder - 1].isCompleted && (!programWorkoutsRecent[completedWorkoutOrder].isCompleted) && programWorkoutsRecent[0].isCompleted) {
                                                            playClass = (key + 1) <= this.state.count ? true : false;
                                                            this.activeSlideKey = key;
                                                            this.props.setActiveSlider(key);
                                                        } else if (key && key > completedWorkoutOrder && key - 1 == completedWorkoutOrder && !programWorkoutsRecent[completedWorkoutOrder + 1].isCompleted && programWorkoutsRecent[completedWorkoutOrder].isCompleted && !programWorkoutsRecent[completedWorkoutOrder + 1].isCompleted) {
                                                            playClass = (key + 1) <= this.state.count ? true : false;
                                                            this.activeSlideKey = key;
                                                            this.props.setActiveSlider(key);
                                                        }
                                                    } else { //new videos 
                                                        var playClass = false;
                                                        if (key && programWorkoutsRecent[key - 1].isCompleted && !programWorkoutsRecent[key].isCompleted) {
                                                            playClass = (key + 1) <= this.state.count ? true : false;
                                                            this.activeSlideKey = key;
                                                            //this.props.setActiveSlider(key - 1);
                                                            this.props.setActiveSlider(key);
                                                        } else if (!item.isCompleted && key == 0) {
                                                            playClass = true;
                                                            this.activeSlideKey = key;
                                                            //this.props.setActiveSlider(key - 1);
                                                            this.props.setActiveSlider(key);
                                                        }
                                                    }



                                                    return (
                                                        <SwiperSlide >
                                                            {/* 'play=' + playClass +
                                                                'k=' + key
                                                                + 'orde=' + completedWorkoutOrder
                                                                + 'activeSlideKey=' + this.activeSlideKey
                                                                + "compl=" + item.isCompleted */}
                                                            <div className="card h-100 p-b-30 complet_items_an" key={"session_" + key}>
                                                                <div className="">

                                                                    <a
                                                                        //to={(!playClass) ? "#" : "/detail/" + item.Workout.id + '/' + this.props.match.params.condition + '/' + userProgramId}
                                                                        className={"pointer class-anchor position-relative d-block " + (!playClass ? "default-cursor" : "")}
                                                                        onClick={() => {
                                                                            if (key == 0 && !this.state.programmeDetail.UserPrograms.length) {
                                                                                this.startNextClass(this.state.programmeDetail.id, programWorkoutsRecent, key);
                                                                                //this.joinProgram(this.state.programmeDetail.id, playClass, programWorkoutsRecent)
                                                                            } else {
                                                                                if (playClass) {
                                                                                    this.startNextClass(0, programWorkoutsRecent,key)
                                                                                }
                                                                            }
                                                                        }
                                                                        }

                                                                    >
                                                                        <ImageTag
                                                                            className="img-fluid image-size-new rounded img-responsive"
                                                                            src={constand.WORKOUT_IMG_PATH + item.Workout.id + "-img.png"}
                                                                        />
                                                                        <span className="position-absolute vid_time"><span>{item.Workout.length} mins</span></span>

                                                                        {item.isCompleted && <span className=" font-semibold font-18 floatings_items" ><span> Completed </span><span> {moment(item.completedAt).format('ddd Do MMM YYYY')} </span></span>
                                                                        }
                                                                        {playClass &&

                                                                            <img src={constand.WEB_IMAGES + 'play-purple-icon.png'} width="50px" className="play-icon-purple" />
                                                                        }
                                                                    </a>
                                                                </div>
                                                                <div className="card-body swipercard">
                                                                    <div className="w-100 float-left m-b-10">
                                                                        <div className="col-md-12 col-lg-12 col-sm-12 float-left p-0">
                                                                            <h3 className="black-txt font-16 font-semibold capitalize_text float-left w-75">{item.Workout.title}</h3>
                                                                            <div className="bookmark-left float-right text-right w-25">

                                                                                <WorkoutScheduleComponent
                                                                                    ondemand_data={item.Workout}
                                                                                    location={this.props.location}
                                                                                    history={this.props.history}
                                                                                    pageName="programme_detail"
                                                                                />
                                                                                <b className="m-l-10">
                                                                                    <WorkoutSaveComponent
                                                                                        className="m-l-10"
                                                                                        page="programme_detail"
                                                                                        workoutData={item.Workout}
                                                                                    />
                                                                                </b>
                                                                            </div>
                                                                            <div className="bookmark-left m-l-10 float-left">

                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                    <div className="w-100 float-left">
                                                                        <div className="col-12 float-left m-b-10 p-0">
                                                                            <div className="left-image leftwidth-set p-0 border-0 float-left">
                                                                                <ImageTag
                                                                                    className="img-fluid rounded-circle"
                                                                                    src={item.Workout && item.Workout.Instructor && item.Workout.Instructor.img ? constand.USER_IMAGE_PATH + item.Workout.Instructor.img : constand.WEB_IMAGES + 'no-image.png'}
                                                                                    alt=""
                                                                                />
                                                                            </div>
                                                                            <p className="float-left m-t-5 font-14 black-txt font-qregular p-l-10">
                                                                                {item.Workout.Instructor.hasProfile &&
                                                                                    <Link to={"/instructor/" + item.Workout.Instructor.id + '/' + this.props.match.params.condition} className="font-14 font-qregular black-txt p-l-5">
                                                                                        {item.Workout.Instructor.User.name} {item.Workout.Instructor.User.lastName}
                                                                                    </Link>
                                                                                }
                                                                                {!item.Workout.Instructor.hasProfile &&
                                                                                    <span className="font-14 font-qregular black-txt p-l-5">
                                                                                        {item.Workout.Instructor.User.name} {item.Workout.Instructor.User.lastName}
                                                                                    </span>
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                        <div className="col-12 float-left p-0">
                                                                            <div className="font-medium row">
                                                                                <div className="col-lg-12 col-md-12 col-sm-12">
                                                                                    <div className="col-md-12 col-sm-12 d-flex p-0">
                                                                                        <span className="font-16 black-txt font-qbold">Discipline:</span>
                                                                                        <span className=" orangefont font-16 font-qregular p-l-5 capitalize_text"> {(item.Workout && item.Workout.WorkoutTags) ? commonService.returnTag(
                                                                                            "discipline", item.Workout.WorkoutTags, item.workoutId
                                                                                        ) : 'None'}</span></div>
                                                                                    <div className="col-md-12 col-sm-12 d-flex p-0">
                                                                                        <span className="font-16 black-txt font-qbold">Difficulty:</span>
                                                                                        <span className="font-16 font-qregular capitalize_text orangefont p-l-5 capitalize_text">  {(item.Workout && item.Workout.WorkoutTags) ? commonService.returnTag(
                                                                                            "level", item.Workout.WorkoutTags, item.workoutId
                                                                                        ) : 'None'}</span></div>
                                                                                </div>
                                                                                <div className="col-lg-6 col-md-12 col-sm-12 p-0 align-self-center text-center m-t-10">
                                                                                    {/* item.isCompleted && <span className="w-80 dblog_btn font-14 btn-darkblue position-relative">Completed</span>
                                                                                    */}
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-12 float-left p-0 text-center">
                                                                                {!playClass ?
                                                                                    <Link to={"/detail/" + item.Workout.id + '/' + this.props.match.params.condition + '/' + 0}
                                                                                        className="w-50 btn  dblog_btn font-14 btn-purple-inverse "
                                                                                    > Learn More </Link>
                                                                                    :
                                                                                    <Link to={"/detail/" + item.Workout.id + '/' + this.props.match.params.condition + '/' + this.state.programmeDetail.id}
                                                                                        className="w-50 btn  dblog_btn font-14 btn-purple-inverse "
                                                                                    > Learn More </Link>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </SwiperSlide>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </Swiper>
                                <div class="swiper-button-prev "></div>
                                <div class="swiper-button-next "></div>
                            </div>
                            <div className="mobile_view_show  mt-5">
                                <hr />
                                <h4 className="black-txt font-21 fontsize21 font-medium m-t-10 text-center mb-4">Your progress</h4>
                                {((this.state.isJoinedNow) || (this.state.programmeDetail.UserPrograms && this.state.completedPrograms != this.state.programmeDetail.UserPrograms.length)) &&
                                    <div class="line-bar pb-3 font-16 progressbar_star">
                                        {(this.state.programmeDetail.UserPrograms || this.state.isJoinedNow) &&
                                            <div className="staralignset mb-3">
                                                <svg width="150" height="150" id="Layer_1" data-name="Layer 1" xmlns={constand.WEB_IMAGES + "b-star-icon.svg"} viewBox="0 0 409.08 389.89"><path style={{ fill: "#0073C2", stroke: "#FFCA4F", strokeWidth: "10px" }} d="M292.65,495.1c7-27.39,13.75-53.91,20.51-80.42,5.26-20.6,10.43-41.22,15.85-61.77.83-3.15.36-5-2.17-7.12q-53.79-45.33-107.41-90.87c-.88-.75-1.88-1.36-2.83-2l.55-1q16.11-1.08,32.21-2.17,46.69-3.09,93.39-6.15c5.85-.38,11.71-1,17.57-1,3.31,0,4.84-1.25,6-4.29q26-65.79,52.32-131.49c.54-1.34,1.15-2.66,2.07-4.78.82,1.88,1.4,3.13,1.91,4.4Q449,172.36,475.19,238.29c1.22,3.07,2.74,4.11,6,4.31,31.14,1.91,62.26,4,93.39,6.07,14.11.92,28.21,1.79,42.32,2.7,2.51.16,5,.4,7.54.6l1,1.19a16.81,16.81,0,0,0-3,1.66q-53.6,45.27-107.18,90.53c-2.79,2.34-3.59,4.29-2.62,8,11.88,45.79,23.52,91.64,35.21,137.47.29,1.14.51,2.3.91,4.14-1.84-1.1-3.16-1.85-4.45-2.66q-60-37.85-119.92-75.74c-2.61-1.66-4.37-1.78-7.07-.07Q357.23,454.6,297,492.45C295.8,493.23,294.54,494,292.65,495.1Z" transform="translate(-216.6 -102.05)" /></svg>

                                                <span className="font-qbold">Completed {this.state.completedPrograms} times</span>
                                            </div>
                                        }
                                        <div class="progress">
                                            <div class="progress-bar p-l-10 p-r-10" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style={{ width: floor((this.state.completedClass * 100) / this.state.count) + '%' }}>
                                                {floor((this.state.completedClass * 100) / this.state.count) >= 50 &&
                                                    <span class="font-semibold font-18">{this.state.completedClass} out of {this.state.count} classes completed</span>
                                                }<span class="font-semibold font-18">{floor((this.state.completedClass * 100) / this.state.count)}%</span>
                                            </div>

                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        {
                            <>
                                <div className="mobile_view_hide"><hr /></div>
                                <div className="row">
                                    <div className="col-lg-12 col-md-8">
                                        <h4 className="black-txt  font-21 fontsize21 font-medium m-t-40 mobile_view_hide">Your progress</h4>
                                        {((!this.state.programmeDetail.UserPrograms && !this.state.isJoinedNow) || (this.state.completedPrograms == this.state.programmeDetail.UserPrograms.length)) && <p className="black-txt font-18 font-medium m-t-40 m-b-40">
                                            To start this program, just click play on the first class!
                                        </p>
                                        }
                                        <div className="mobile_view_hide mt_minus_top">
                                            {((this.state.isJoinedNow) || (this.state.programmeDetail.UserPrograms && this.state.completedPrograms != this.state.programmeDetail.UserPrograms.length)) &&
                                                <div class="line-bar font-16 progressbar_star">
                                                    <div class="progress">
                                                        <div class="progress-bar p-l-10 p-r-10" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style={{ width: floor((this.state.completedClass * 100) / this.state.count) + '%' }}>
                                                            {floor((this.state.completedClass * 100) / this.state.count) >= 50 &&
                                                                <span class="font-semibold font-18">{this.state.completedClass} out of {this.state.count} classes completed</span>
                                                            }<span class="font-semibold font-18">{floor((this.state.completedClass * 100) / this.state.count)}%</span>
                                                        </div>

                                                    </div>
                                                    {(this.state.programmeDetail.UserPrograms || this.state.isJoinedNow) &&
                                                        <div className="staralignset">
                                                            <svg width="150" height="150" id="Layer_1" data-name="Layer 1" xmlns={constand.WEB_IMAGES + "b-star-icon.svg"} viewBox="0 0 409.08 389.89"><path style={{ fill: "#0073C2", stroke: "#FFCA4F", strokeWidth: "10px" }} d="M292.65,495.1c7-27.39,13.75-53.91,20.51-80.42,5.26-20.6,10.43-41.22,15.85-61.77.83-3.15.36-5-2.17-7.12q-53.79-45.33-107.41-90.87c-.88-.75-1.88-1.36-2.83-2l.55-1q16.11-1.08,32.21-2.17,46.69-3.09,93.39-6.15c5.85-.38,11.71-1,17.57-1,3.31,0,4.84-1.25,6-4.29q26-65.79,52.32-131.49c.54-1.34,1.15-2.66,2.07-4.78.82,1.88,1.4,3.13,1.91,4.4Q449,172.36,475.19,238.29c1.22,3.07,2.74,4.11,6,4.31,31.14,1.91,62.26,4,93.39,6.07,14.11.92,28.21,1.79,42.32,2.7,2.51.16,5,.4,7.54.6l1,1.19a16.81,16.81,0,0,0-3,1.66q-53.6,45.27-107.18,90.53c-2.79,2.34-3.59,4.29-2.62,8,11.88,45.79,23.52,91.64,35.21,137.47.29,1.14.51,2.3.91,4.14-1.84-1.1-3.16-1.85-4.45-2.66q-60-37.85-119.92-75.74c-2.61-1.66-4.37-1.78-7.07-.07Q357.23,454.6,297,492.45C295.8,493.23,294.54,494,292.65,495.1Z" transform="translate(-216.6 -102.05)" /></svg>

                                                            <span className="font-qbold">Completed {this.state.completedPrograms} times</span>
                                                        </div>
                                                    }
                                                </div>
                                            }
                                        </div>
                                        {(this.state.completedClass == this.state.count) &&
                                            <button className="btn dblog_btn font-14 btn-purple w-20" onClick={() => {
                                                this.startNextClass(this.state.programmeDetail.id, programWorkoutsRecent);
                                                //this.joinProgram(this.state.programmeDetail.id, false, programWorkoutsRecent)
                                            }}
                                            >
                                                {'Restart'}
                                            </button>
                                        }
                                    </div>
                                </div>
                            </>
                        }
                        {/* <hr /> */}
                        <div className="row">
                            <div className="col-lg-8 col-md-8">
                                <h4 className="black-txt font-21 font-medium m-b-10">Summary</h4>
                                <p className="black-txt font-14 font-qregular m-b-20" dangerouslySetInnerHTML={{
                                    __html: this.state.programmeDetail.description
                                }}>
                                </p><p className="black-txt font-14 font-qregular ">
                                </p>
                            </div>
                            <div className="col-lg-3 offset-lg-1 col-md-3 offset-md-1">
                                <h4 className="black-txt font-21 font-medium m-b-10">Benefits</h4>
                                <div className="black-txt font-14 font-qregular m-b-60">
                                    {this.state.programmeTags.map((item, key) => {
                                        return (
                                            <p key={"ptag_" + key}>
                                                {item.Tag ? item.Tag.tag : ''}
                                            </p>
                                        )
                                    })}
                                </div>
                                <h4 className="black-txt font-21 font-medium m-b-10">Equipment</h4>
                                <div className="black-txt font-14 font-qregular m-b-30">
                                    {this.renderEquipments(this.state.programWorkouts)}
                                </div>
                            </div>
                        </div>
                        <div ref={(el) => { this.messagesEnd = el; }}></div>
                    </div>
                }
                {
                    <PlayOndemand
                        condition={this.props.match.params.condition}
                        programId={this.state.programmeDetail.id}
                        workoutId={this.state.workoutId}
                        history={this.props.history}
                        ondemand_detail_data={this.state.ondemand_detail_data}
                        closeWithProgram={() => { this.fetchProgrammeDetail(this.state.programId) }}
                        isStartProgram={this.state.isStartProgram}
                    />
                }
                {
                    this.state.enable_player &&
                    <ProgramPlayer
                        enable_video={this.state.enable_player}
                        closeVideoModel={() => { this.closeVideoModel() }}
                        ProgramTrailerURL={this.state.programTrailerURL}
                    />
                }
                <div className="text-center w-100">
                    {(this.state.loader) && (<AnimateLoaderComponent />)}
                </div>
            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        is_auth: state.auth.is_auth,
        logged_userData: state.header.logged_userData,
        active_slider: state.programme.active_slider
    };
};

const mapDispatchToProps = {
    ProgrammeDetail,
    ProgrammeDetailWorkouts,
    loginModelOpen,
    joinToProgram,
    isPlayOndemand,
    setActiveSlider
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProgrammesDetailComponent);
export { ProgrammesDetailComponent };
