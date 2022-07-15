import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
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
	isOpenBeforeModel,
	isOpenPostPollModel,
	isOpenResearchModel,
	isOpenSafetyModel,
	isWarningModal,
	isConditionModalOpen,
	isPlayOndemand,
	likeMoreOndemand
} from "../../actions";
import { commonService } from "../../_services";
import BeforeVideoPopup from "./BeforeVideoPopup";
import AfterVideoPopup from "./AfterVideoPopup";
import WorkoutPlayer from "./WorkoutPlayer";
import { toast } from "react-toastify";
import * as constand from "../../constant";
import * as Errors from "../../Errors";
import WorkoutScheduleComponent from "../WorkoutsPage/WorkoutScheduleComponent";
import WorkoutSaveComponent from "../WorkoutsPage/workoutSaveComponent";
import { ImageTag } from "../../tags";
import StarRatings from "react-star-ratings";
import { Cookies } from "react-cookie-consent";
import {
	FacebookShareButton,
	LinkedinShareButton,
	TwitterShareButton,
	WhatsappShareButton,
	EmailShareButton,
	FacebookIcon,
	TwitterIcon,
	LinkedinIcon,
	WhatsappIcon,
	EmailIcon,
} from "react-share";
import Slider from "react-slick";
import moment from 'moment';
import { Helmet } from "react-helmet";
import SafetyDisclaimerComponent from "../Common/SafetyDisclaimerComponent";
import ResearchStudyPollPopup from "./ResearchStudyPollPopup";
import ResearchPostPopup from './ResearchPostPopup';
import _ from 'lodash';
import WarningModal from "../Common/WarningModal";
import PlayOndemand from "../Common/PlayOndemand";

class WorkoutDetailComponent extends React.Component {
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
			openPostPollModel: false,
			showReadMore: false,
			condition: this.props.match.params.condition,
			health_conditionId: 0,
			currentPlanId: 0,
			planData: {},
			countryPlans: [],
			payment_data: {},
			isWarningModal: false,
			programId: this.props.match.params.programid,
			isCreateCSafety: false
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
		let authData = this.props.logged_userData || JSON.parse(localStorage.getItem('userDetails'));
		window.scrollTo(0, 0);
		if (this.state.condition.includes('-')) {
			this.setState({ condition: commonService.replaceChar(this.state.condition, true) })
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
		this.getOnDemandDetail();
		this.getLikeMore();

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
				this.setState({ countryPlans: response.plans })
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
				this.getOnDemandDetail();
				this.getLikeMore();
			}
		);
	}
	_handleContextMenu = event => {
		event.preventDefault();
	};
	getOnDemandDetail() {
		this.setState({ Loading: true });
		this.props.ondemandDetail(this.props.match.params.id, this.props.match.params.condition).then(
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
					//this.incrementShowmoreCnt();
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

	getLikeMore = () => {
		this.setState({ Loading: true });
		this.props.likeMoreOndemand(this.props.match.params.id, this.props.match.params.condition).then(
			response => {
				if (response) {
					var totalRating = this.calculateTotalRating(
						this.props.workout_detail_data.reviews
					);
					/* var temp = this.state.ondemand_detail_data;
					temp.isExist = this.props.workout_detail_data.isExist;
					temp.reviews = this.props.workout_detail_data.reviews;
					temp.reviewCount = this.props.workout_detail_data.reviewCount; */
					this.setState({
						Loading: false,
						//ondemand_detail_data: temp,
						ondemand_detail_data: this.props.workout_detail_data,
						totalRating: totalRating,
						all_tags: (response.onDemandVideo.tags) ? response.onDemandVideo.tags : [],
						all_levels: (response.onDemandVideo.levelTags) ? response.onDemandVideo.levelTags : [],
						ondemand_paging: this.props.workout_detail_data.likeMore
					});
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
		if (!this.state.play_loader) {
			var roomid = localStorage.getItem('scheduleRoomId');
			this.setState({ play_loader: true });
			this.props.startVideo({ workoutId: this.props.match.params.id, roomId: roomid, programId: this.state.programId }).then(
				response => {
					if (response) {
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
									//openSafetyModel: true, 
									isCreateCSafety: true
								});
							} else {
								//SP login users
								this.checkPollToShow(tagCondition);
							}
						} else {
							//core beam users
							if (!constand.SAFETY_CONDITION_LIST.includes(tagCondition) && !(commonService.returnUserTags("safetyInfoConfirmed", tagCondition, this.props.logged_userData.Tags ? this.props.logged_userData.Tags : []).toLowerCase() == tagCondition.toLowerCase()) && (commonService.returnTagName("videoType", "Exercise", this.props.workout_detail_data.workout.WorkoutTags ? this.props.workout_detail_data.workout.WorkoutTags : []) == 'Exercise' || commonService.returnTagName("videoType", "Live Class Recording", this.props.workout_detail_data.workout.WorkoutTags ? this.props.workout_detail_data.workout.WorkoutTags : []) == 'Live Class Recording')) {
								console.log('periyaif')
								//show safety popup
								//	this.setState({ openSafetyModel: true });
								this.props.isOpenSafetyModel(true);

							} else if (commonService.returnTagName("videoType", "Education", this.props.workout_detail_data.workout.WorkoutTags ? this.props.workout_detail_data.workout.WorkoutTags : []) == 'Education') {
								console.log('Elsif-1')
								//dont show before feedback popup
								this.beforeReview()
							}
							else {
								console.log('Els')
								//show before feedback popup
								//this.setState({ openModel: true })
								this.props.isOpenBeforeModel(true);
							}
						}
					}
				},
				error => {
					this.props.isOpenBeforeModel(false);
					this.setState({
						play_loader: false,
						//	openModel: false, 
						current_attendee: {}
					});
					toast.error(error);
				}
			);
		}
	}
	safetyProcess() {
		this.setState({ openSafetyModel: false, isCreateCSafety: false });
		this.goback();
	}
	closeSafetyModel() {
		this.setState({ openSafetyModel: false, isCreateCSafety: false });

		var tagCondition = commonService.replaceChar(Cookies.get('condition'), true).toLowerCase();
		if (tagCondition.includes('research')) {
			this.checkPollToShow(tagCondition);
		} else {
			if (commonService.returnTagName("videoType", "Education", this.props.workout_detail_data.workout.WorkoutTags ? this.props.workout_detail_data.workout.WorkoutTags : []) == 'Education') {
				//dont show before feedback popup
				this.beforeReview()
			} else {
				//show before feedback popup
				this.setState({ openModel: true })
			}
		}
		//this.setState({openSafetyModel:false,openModel: false, enable_video: true});
	}
	closeModel() {
		console.log('closemodel')
		this.setState({ openModel: false, isConditionModalOpen: false, isWarningModal: false, isUpgradeModalOpen: false });
	}
	closeResearchModel() {
		this.setState({ openResearchModel: false });
	}
	closeResearchPostModel() {
		this.setState({ openPostPollModel: false });
	}
	closeVideoModel(time, show_after_review) {
		this.saveTimeSpent(time, show_after_review);
		this.setState({ enable_video: false });
	}
	closeAfterModel() {
		this.props.updateAfterModelState({ step: 1 });
		this.setState({ openAfterModel: false });
	}
	beforeReview() {
		//this.setState({ openModel: false, enable_video: true });
		this.props.isOpenBeforeModel(false)
		this.props.isEnableVideo(true)
		console.log('vvbeforeReview')
	}
	saveTimeSpent(time, show_after_review) {
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
										this.setState({ openAfterModel: false, stepVideo: 0 });
									} else {
										console.log('preclasspoll-condiition')
										console.log('openpost poll')
										this.setState({ openPostPollModel: true })
									}
								}
								else {
									console.log('openpost poll')
									this.setState({ openPostPollModel: true })
								}
							} else {
								//dont show any popup after video
								this.setState({ openAfterModel: false, stepVideo: 0 });
							}
						} else {
							//core beam
							if (commonService.returnTagName(
								"videoType",
								"Education",
								this.props.workout_detail_data.workout.WorkoutTags
									? this.props.workout_detail_data.workout.WorkoutTags
									: []
							) == 'Education') {
								this.setState({ openAfterModel: show_after_review, stepVideo: 4 });
							}
							else {
								this.setState({ openAfterModel: show_after_review, stepVideo: 0 });
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
			var hasMembership = commonService.checkUserHasMembership(this.authData, this.state.condition);
			console.log('hasMembership-wo-detail', hasMembership)


			if (this.props.match.params.condition.toLowerCase().includes('research')) {
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
				console.log('healthcondition_list', this.props.healthcondition_list)
				var selectedHealth_condition = _.filter(this.props.healthcondition_list, function (list) {
					return list.tag === (commonService.replaceChar(me.state.condition, true));
				});
				var currentPlan = commonService.returnCurrentPlan(this.authData, this.state.condition);

				console.log('selectedHealth_condition', selectedHealth_condition)
				var health_conditionId = selectedHealth_condition[0].id;
				this.props.registerFormvalues.health_condition = selectedHealth_condition;
				this.setState({ hasMembership: hasMembership, health_conditionId: health_conditionId, currentPlanId: currentPlan.length ? currentPlan[0].id : 0 })

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
				//window.location.href = '/group/ondemand/list/'+community+'/'+this.props.match.params.condition;
				const { from } = { from: { pathname: '/group/ondemand/list/' + community + '/' + this.props.match.params.condition } };
				this.props.history.push(from);
			} else if (this.props.match.params.condition.toLowerCase().includes('research') && community) {
				//window.location.href = '/group/ondemand/list/'+community+'/'+this.props.match.params.condition;
				const { from } = { from: { pathname: '/group/ondemand/list/' + community + '/' + this.props.match.params.condition } };
				this.props.history.push(from);
				// const { from } = { from: { pathname: '/on-demand/' + this.props.match.params.condition } };
				// this.props.history.push(from);
			} else if (this.props.match.params.condition.toLowerCase().includes('research') && this.props.prevPath && (this.props.prevPath.indexOf('/group/ondemand/list/') != -1))
				window.history.back();
			else if (this.state.programId) {
				// const { from } = { from: { pathname: '/on-demand/' + this.props.match.params.condition } };
				// this.props.history.push(from);
				//window.location.href = '/on-demand/'+this.props.match.params.condition
				window.history.back();
			} else {
				const { from } = { from: { pathname: '/on-demand/' + this.props.match.params.condition } };
				this.props.history.push(from);
			}
		} else {
			if (this.state.ondemand_detail_data.workout && this.state.ondemand_detail_data.workout.CommunityId) {
				var community = this.state.ondemand_detail_data.workout.CommunityId ? this.state.ondemand_detail_data.workout.Community.community_name : '';
				//window.location.href = '/group/ondemand/list/'+community+'/'+this.props.match.params.condition;
				const { from } = { from: { pathname: '/group/ondemand/list/' + community + '/' + this.props.match.params.condition } };
				this.props.history.push(from);
			}
			else {
				const { from } = { from: { pathname: '/on-demand/' + this.props.match.params.condition } };
				this.props.history.push(from);
				//window.location.href = '/on-demand/'+this.props.match.params.condition
			}
		}
	}

	getMoreTextDiv(expanded) {
		this.setState({ expanded: expanded });
	}
	playOndemand = () => {
		//	this.props.isPlayOndemand(false);
		this.props.isPlayOndemand(true);
		//this.setState({ isPlayOndemand: true })
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
						onClick={() => this.playOndemand()}
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
						onClick={() => this.playOndemand()}
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
					//this.setState({ openResearchModel: true });
					this.props.isOpenResearchModel(true)
				}
			}
			else {
				//this.setState({ openResearchModel: true });
				this.props.isOpenResearchModel(true)

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
		console.log('this.props.match.params.condition', this.props.match.params.condition)
		return (
			<React.Fragment>
				{/* <AfterVideoPopup
					openModel={this.state.openAfterModel}
					closeModel={this.closeAfterModel}
					workoutId={this.props.match.params.id}
					workoutTitle={this.state.ondemand_detail_data}
					current_attendee={this.state.current_attendee}
					stepVideo={this.state.stepVideo}
				/> */}
				{/* (this.state.enable_video === true) &&
					<WorkoutPlayer
						enable_video={this.state.enable_video}
						closeVideoModel={this.closeVideoModel}
						ondemandData={this.state.ondemand_detail_data}
						current_attendee={this.state.current_attendee}
					/> */}
				{/* <BeforeVideoPopup
					is_model_open={this.state.openModel}
					closeModel={this.closeModel}
					beforeReview={this.beforeReview}
					workoutId={this.props.match.params.id}
					workoutTitle={this.state.ondemand_detail_data}
					current_attendee={this.state.current_attendee}
				/> */}
				{/* <ResearchPostPopup
					is_model_open={this.state.openPostPollModel}
					closeResearchPostModel={this.closeResearchPostModel}
					classType="On-demand"
					beforeReview={this.beforeReview}
					workoutId={this.props.match.params.id}
					current_attendee={this.state.current_attendee}
					condition={this.props.match.params.condition}
					history={this.props.history}
				/> */}
				{/* <ResearchStudyPollPopup
					is_model_open={this.state.openResearchModel}
					closeResearchModel={this.closeResearchModel}
					classType="On-demand"
					beforeReview={this.beforeReview}
					workoutId={this.props.match.params.id}
					current_attendee={this.state.current_attendee}
				/> */}
				{/* <SafetyDisclaimerComponent
					is_model_open={this.state.openSafetyModel}
					modelClose={this.closeSafetyModel}
					safetyProcess={this.safetyProcess}
					type={this.state.isCreateCSafety ? 'createc' : 'core'}
				/> */}
				<section className="demand-page m-t-100">
					<Helmet>
						<title>{title ? title : ''}{constand.ONDEMAND_DETAIL_TITLE}{constand.BEAM}</title>
						<meta property="og:title" content={title ? title : '' + constand.ONDEMAND_DETAIL_TITLE + constand.BEAM} />
						<meta property="og:description" content={ondemand_view_detail.description} />
						<meta property="og:image" content={classThumb} />
						<meta property="og:url" content={window.location.href} />
						<meta name="twitter:card" content="summary_large_image" />
						<meta property="og:site_name" content="Beam" />
						<meta name="twitter:image:alt" content={title + ' by ' + instructorName} />
					</Helmet>
					{/* mobile view */}
					<div className="demand-section-mobile">
						<div className="container-fluid">
							<div className="demand-title">
								<div className="row">
									<a
										href="javascript:void(0)"
										onClick={this.props.setGoback(true), this.goback}
										className="font-15 font-book m-b-10 font-normal black-txt p-l-10 p-r-0"
									>
										{" "}
										<i className="fa fa-chevron-left"></i>
										<span className="font-21 black-txt font-medium capitalize_text p-l-5 col-11">
											back to on demand videos
										</span>
									</a>
								</div>
							</div>
						</div>
						{this.videoSection('row demand-img', 'mobile')}
						<div className="container-fluid video-detail-bg">
							<div className="col-md-12">
								<div className="row p-10">
									<div className="col-md-8 col-lg-8 col-sm-8 col-9 video-details-left pl-0 p-r-60">
										<div className="w-100">
											<div className="font-semibold font-15 black-txt">
												Duration: {ondemand_view_detail.length} minutes
											</div>
											<div className="font-semibold font-15 black-txt w-100">
												<div>
													Discipline:
													<span className="font-semibold font-15 black-txt m-l-5 capitalize_text">
														{commonService.returnLabelData(
															"discipline",
															ondemand_view_detail.WorkoutTags
																? ondemand_view_detail.WorkoutTags
																: []
														)}
													</span>
												</div>
												{(this.state.ondemand_detail_data.reviews && (this.state.ondemand_detail_data.reviews.filter(item => parseFloat(item.avg_ratings) > constand.CONSTZERO)).length > 0) &&
													<div>
														Rating:
														<span className="font-weight-bold m-l-5">
															{/* <span className="fa fa-star checked text-warning"></span>
                            <span className="fa fa-star checked text-warning"></span>
                            <span className="fa fa-star checked text-warning"></span>
                            <span className="fa fa-star text-secondary"></span>
                            <span className="fa fa-star text-secondary"></span> */}
															<StarRatings
																rating={this.state.ondemand_detail_data.overAllAvg || 0}
																starRatedColor="#ffc107"
																starDimension="0.875rem"
																starSpacing="0rem"
																numberOfStars={5}
																name="rating"
															/>
														</span>
													</div>}
												<div>
													Level:
													<span className="font-semibold font-15 black-txt m-l-5 capitalize_text">
														{commonService.returnLabelData(
															"level",
															ondemand_view_detail.WorkoutTags
																? ondemand_view_detail.WorkoutTags
																: []
														)}
													</span>
												</div>
											</div>
										</div>
									</div>
									<div className="col-md-4 col-lg-4 col-sm-4 col-3 pr-0 video-details-right">
										<div className="bookmark-left m-l-20 float-right">
											<span
												className="pointer"
												onClick={() =>
													this.setState({
														share_enable: !this.state.share_enable
													})
												}
											>
												<em className="fa fa-share pointer"></em>
												<span className="font-qmedium font-13 black-txt m-l-10">
													Share
												</span>
											</span>
											{this.state.share_enable && (
												<div className="position-absolute zindex">
													<span>
														<EmailShareButton
															url={shareUrl}
															subject={title}
															body="body"
															className="pointer"
														>
															<EmailIcon size={32} round />
														</EmailShareButton>
													</span>
													<span>
														<FacebookShareButton
															url={shareUrl}
															quote={title}
															className="pointer"
														>
															<FacebookIcon size={32} round />
														</FacebookShareButton>
													</span>
													<span>
														<WhatsappShareButton
															url={shareUrl}
															title={title}
															separator=":: "
															className="pointer"
														>
															<WhatsappIcon size={32} round />
														</WhatsappShareButton>
													</span>
													<span>
														<TwitterShareButton
															url={shareUrl}
															title={title}
															className="pointer"
														>
															<TwitterIcon size={32} round />
														</TwitterShareButton>
													</span>
													<span>
														<LinkedinShareButton
															url={shareUrl}
															windowWidth={750}
															windowHeight={600}
															className="pointer"
														>
															<LinkedinIcon size={32} round />
														</LinkedinShareButton>
													</span>
												</div>
											)}
										</div>
										<div className="bookmark-left m-l-20 float-right">
											<WorkoutScheduleComponent
												pageName="ondemand-detail"
												ondemand_data={this.state.ondemand_detail_data.workout}
												location={this.props.location}
												history={this.props.history}
											/>
										</div>

										<div className="bookmark-left m-l-20 float-right">
											<WorkoutSaveComponent
												page="ondemand_detail"
												workoutData={this.state.ondemand_detail_data.workout}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="container">
							<div className="w-100 on-demand-filter-sm-value" id="accordion">
								<div className="card">
									<div className="card-header" id="heading-1">
										<h5 className="mb-0">
											<a
												role="button"
												data-toggle="collapse"
												href="#collapse-1"
												aria-expanded="true"
												aria-controls="collapse-1"
												className="collapsed"
											>
												Description
												<i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>
											</a>
										</h5>
									</div>
									<div
										id="collapse-1"
										className="collapse show"
										data-parent="#accordion"
										aria-labelledby="heading-1"
									>
										<div className="card-body">
											<div id="accordion-1">
												<div className="w-100 m-t-20">
													<p
														className="font-qregular font-14 black-txt m-0 instruct_details overflow-hidden text-left"
														dangerouslySetInnerHTML={{
															__html: ondemand_view_detail.description
														}}
													></p>
													{/*<div className="w-100 position-relative text-center ">
                            {ondemand_view_detail.Instructor && (
                              <Link
                                to={
                                  "/instructor/" +
                                  ondemand_view_detail.Instructor.id
                                }
                                className="redtext text-underline font-qregular font-14"
                              >
                                Readmore
                              </Link>
                            )}
                          </div>*/}
												</div>
												{commonService.returnTagName(
													"condition", constand.CONDITION,
													ondemand_view_detail.WorkoutTags
														? ondemand_view_detail.WorkoutTags
														: []
												) && (commonService.replaceChar(this.props.match.params.condition, true) == constand.CONDITION) &&
													<div className="w-100 m-t-20 summary_div">
														<h3 className="heading_3 font-22 black-txt font-medium">
															Head's Up!
														</h3>
														<p
															className={`font-qregular font-14 black-txt m-0 `}
															id="instructor_details"

														>We hope you enjoy this and all our sessions on Beam, but please remember that we are not able to offer you personalised exercise sessions programs and that participating in any live or on-demand Beam sessions is at your own risk. Changes to your airway clearance and exercise regime should be discussed with your clinical team.</p>
													</div>
												}
												{commonService.returnTagName(
													"condition", constand.KR_CONDITION,
													ondemand_view_detail.WorkoutTags
														? ondemand_view_detail.WorkoutTags
														: []
												) && (commonService.replaceChar(this.props.match.params.condition, true) == constand.KR_CONDITION) &&
													<div className="w-100 m-t-20 summary_div">
														<h3 className="heading_3 font-22 black-txt font-medium">
															Head's Up!
														</h3>
														<p
															className={`font-qregular font-14 black-txt m-0 `}
															id="instructor_details"

														>We hope you enjoy this and all our sessions on Beam, but please remember that we are not able to offer you personalised exercise programs and that participating in any live or on-demand Beam sessions is at your own risk. </p>
													</div>
												}
												{!constand.SAFETY_CONDITION_LIST.includes(commonService.replaceChar(this.props.match.params.condition, true).toLowerCase()) && !(commonService.replaceChar(this.props.match.params.condition, true).toLowerCase()).includes('research') &&
													<div className="w-100 m-t-20 summary_div">
														<p
															className="font-qregular font-14 black-txt m-0"
															id="instructor_details"
														>Here is some <Link to={'/blogs/safety-info-' + this.props.match.params.condition.replace(/ /g, '-')}>important safety information</Link> to make sure you keep safe and feel your best before and after your class.</p>
													</div>
												}
											</div>
										</div>
									</div>
								</div>


								<div className="card">
									<div className="card-header" id="heading-7">
										<h5 className="mb-0">
											<a
												className="collapsed"
												role="button"
												data-toggle="collapse"
												href="#collapse-7"
												aria-expanded="false"
												aria-controls="collapse-7"
											>
												Instructor{" "}
												<i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>
											</a>
										</h5>
									</div>
									<div
										id="collapse-7"
										className="collapse"
										data-parent="#accordion"
										aria-labelledby="heading-7"
									>
										<div className="w-100 m-t-15">
											<div className="card border-0 flex-row flex-wrap">
												<div className="card-header p-0 rounded-circle border-0">
													<img
														src={
															ondemand_view_detail.Instructor &&
																ondemand_view_detail.Instructor.img
																? constand.USER_IMAGE_PATH +
																ondemand_view_detail.Instructor.img
																: constand.WEB_IMAGES + "no-image.png"
														}
														alt="NoImage"
														className="img-fluid rounded-circle"
													/>
												</div>
												<div className="card-block px-2">
													{ondemand_view_detail.Instructor &&
														ondemand_view_detail.Instructor.User && ondemand_view_detail.Instructor.hasProfile && !this.props.logged_userData.isStudyParticipant && (
															<a href={"/instructor/" +
																ondemand_view_detail.InstructorId + '/' + this.props.match.params.condition}><h4 className="card-title font-15 black-txt font-semibold m-t-10">
																	{ondemand_view_detail.Instructor.User.name +
																		" " +
																		ondemand_view_detail.Instructor.User.lastName}
																	{ondemand_view_detail.Instructor.title && " / " + ondemand_view_detail.Instructor.title}
																</h4>
															</a>
														)}
													{ondemand_view_detail.Instructor &&
														ondemand_view_detail.Instructor.User && (!ondemand_view_detail.Instructor.hasProfile || this.props.logged_userData.isStudyParticipant) && (
															<h4 className="card-title font-15 black-txt font-semibold m-t-10">
																{ondemand_view_detail.Instructor.User.name +
																	" " +
																	ondemand_view_detail.Instructor.User.lastName}
																{ondemand_view_detail.Instructor.title && " / " + ondemand_view_detail.Instructor.title}

															</h4>
														)}
													{ondemand_view_detail.Instructor &&
														ondemand_view_detail.Instructor.User && ondemand_view_detail.Instructor.title && <p className="font-qmedium silver-txt font-16 m-b-0">{ondemand_view_detail.Instructor.title}</p>}
													{ondemand_view_detail.Instructor && ondemand_view_detail.Instructor.hasProfile && !this.props.logged_userData.isStudyParticipant &&
														<div className="card-text redtext text-underline">
															<Link
																className="orangefont font-14 font-book"
																to={
																	"/instructor/" +
																	ondemand_view_detail.InstructorId + '/' + this.props.match.params.condition
																}
															>
																More videos with this instructor
															</Link>
														</div>
													}
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="card">
									<div className="card-header" id="heading-2">
										<h5 className="mb-0">
											<a
												className="collapsed"
												role="button"
												data-toggle="collapse"
												href="#collapse-2"
												aria-expanded="false"
												aria-controls="collapse-2"
											>
												Recommended equipment
												<i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>
											</a>
										</h5>
									</div>
									<div
										id="collapse-2"
										className="collapse"
										data-parent="#accordion"
										aria-labelledby="heading-2"
									>
										<div className="w-100 m-t-20">
											<p className="font-qregular font-14 m-0">
												{commonService.returnLabelData(
													"equipment",
													ondemand_view_detail.WorkoutTags
														? ondemand_view_detail.WorkoutTags
														: []
												)}
											</p>
										</div>
									</div>
								</div>

								<div className="card">
									<div className="card-header" id="heading-3">
										<h5 className="mb-0">
											<a
												className="collapsed"
												role="button"
												data-toggle="collapse"
												href="#collapse-3"
												aria-expanded="false"
												aria-controls="collapse-3"
											>
												Reviews
												<i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>
											</a>
										</h5>
									</div>
									<div
										id="collapse-3"
										className="collapse"
										data-parent="#accordion"
										aria-labelledby="heading-3"
									>
										<div className="demand-section--2">
											<div className="card w-100">
												<h4 className=" p-t-20 p-b-20 font-semibold font-24 text-center text-white bg-red">
													Most Recent Reviews
												</h4>
												{(this.state.ondemand_detail_data && this.state.ondemand_detail_data.reviews) &&
													<div className="col-md-12 col-lg-12 col-sm-12">
														<div className="w-100 text-center m-t-30 m-b-30 rating-stars">
															<span className="font-weight-bold">
																<StarRatings
																	rating={this.state.ondemand_detail_data.overAllAvg || 0}
																	starRatedColor="#ffc107"
																	starDimension="3rem"
																	starSpacing="0rem"
																	numberOfStars={5}
																	name="rating"
																/>
															</span>
															<p className="font-14 black-txt font-qregular m-t-5">
																Based on{" "}
																{this.state.ondemand_detail_data.reviewCount}{" "}
																reviews
															</p>
														</div>
														{this.state.ondemand_detail_data.reviews
															//.reverse()
															.filter(item => parseFloat(item.avg_ratings) > constand.CONSTZERO)
															.slice(
																0,
																this.state.reviewLimit
																	? 5
																	: this.state.ondemand_detail_data.reviews.length
															)
															.map((item, key) => {
																return (
																	<React.Fragment key={key}>
																		<hr />
																		<div className="w-100  card-body pl-0 pr-0 pt-0">
																			<div className="card border-0 flex-row flex-wrap">
																				<div className="col-md-12 col-lg-12 col-sm-12 p-0 border-0">
																					<ImageTag
																						className="demand-profimg img-fluid rounded-circle float-left"
																						src={
																							item.User.profilePic
																								? constand.PROFILE_IMAGE_PATH +
																								item.User.profilePic
																								: constand.WEB_IMAGES + "no-profile-pic.png"
																						}
																					/>
																					<div className="card-text font-13 font-qregular black-txt float-left p-l-5 m-t-10">
																						{commonService.bindUsername(
																							item.User
																						)}
																					</div>
																					{/*}<span className="date-time float-right font-12 font-qregular">
                                          {moment(item.updatedAt).fromNow()}
                                        </span>*/}
																				</div>
																			</div>
																		</div>
																		<div className="card-body pl-0 pt-0 pb-0">
																			<span className="font-weight-bold">
																				<StarRatings
																					rating={parseFloat(item.avg_ratings) ? parseFloat(item.avg_ratings) : 0}
																					starRatedColor="#ffc107"
																					starDimension="0.9375rem"
																					starSpacing="0rem"
																					numberOfStars={5}
																					name="rating"
																				/>
																			</span>
																			<p className="card-text font-14 black-txt font-qregular">
																				{item.comments}
																			</p>
																		</div>

																	</React.Fragment>
																);
															})}
														<hr />
														<div className="w-100 text-center">
															<button
																onClick={() => {
																	this.setState({
																		reviewLimit: !this.state.reviewLimit
																	});
																}}
																className="btn btn-orange m-t-20 m-b-30 font-medium font-14 pointer"
															>
																Read {this.state.reviewLimit ? "more" : "fewer"}{" "}
																reviews
															</button>
														</div>
													</div>}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/* web view */}
					<div className="container offset-lg-2 col-lg-8 offset-md-3 col-md-6 col-xs-10 col-10 mx-auto ">
						<div className="demand-section-1 m-l-30 m-r-30">
							<div className=" demand-back video-detail-desktop">
								<a
									href="javascript:void(0)"
									onClick={this.props.setGoback(true), this.goback}
									className="font-15 font-book m-b-10 font-normal black-txt capitalize_text"
								>
									{" "}
									<i className="fa fa-chevron-left"></i>
									{!this.state.programId ? "back to on demand videos" : "back to program"}
								</a>
							</div>
							{this.videoSection('row demand-img video-detail-desktop', 'desktop')}
							<div className="row m-t-20 video-detail-desktop">
								<div className="col-md-8 col-lg-7 col-sm-8 col-9 video-details-left pl-0 p-r-60">
									<h3 className="font-21 black-txt font-medium capitalize_text ">
										{ondemand_detail.title}
									</h3>
								</div>
								<div className="col-md-4 col-lg-5 col-sm-4 col-3 pr-0 video-details-right">
									<div className="bookmark-left m-l-20 float-right">
										<span
											className="pointer"
											onClick={() =>
												this.setState({
													share_enable: !this.state.share_enable
												})
											}
										>
											<em className="fa fa-share pointer"></em>
											<span className="font-qmedium font-13 black-txt m-l-10">
												Share
											</span>
										</span>
										{this.state.share_enable && (
											<div className="position-absolute zindex">
												<span>
													<EmailShareButton
														url={shareUrl}
														subject={title}
														body="body"
														className="pointer"
													>
														<EmailIcon size={32} round />
													</EmailShareButton>
												</span>
												<span>
													<FacebookShareButton
														url={shareUrl}
														quote={title}
														className="pointer"
													>
														<FacebookIcon size={32} round />
													</FacebookShareButton>
												</span>
												<span>
													<WhatsappShareButton
														url={shareUrl}
														title={title}
														separator=":: "
														className="pointer"
													>
														<WhatsappIcon size={32} round />
													</WhatsappShareButton>
												</span>
												<span>
													<TwitterShareButton
														url={shareUrl}
														title={title}
														className="pointer"
													>
														<TwitterIcon size={32} round />
													</TwitterShareButton>
												</span>
												<span>
													<LinkedinShareButton
														url={shareUrl}
														windowWidth={750}
														windowHeight={600}
														className="pointer"
													>
														<LinkedinIcon size={32} round />
													</LinkedinShareButton>
												</span>
											</div>
										)}
									</div>
									<div className="bookmark-left m-l-20 float-right">
										<WorkoutScheduleComponent
											pageName="ondemand-detail"
											ondemand_data={this.state.ondemand_detail_data.workout}
											location={this.props.location}
											history={this.props.history}
										/>
									</div>

									<div className="bookmark-left m-l-20 float-right">
										<WorkoutSaveComponent
											page="ondemand_detail"
											workoutData={this.state.ondemand_detail_data.workout}
										/>
									</div>
								</div>
							</div>
							<div className="row m-t-30 desktop-ondemand-view">
								<div className="col-md-8 col-lg-8 col-sm-6 pl-0">
									<div className="w-100">
										<div className="font-semibold font-15 black-txt">
											Time: {ondemand_view_detail.length} minutes
										</div>
										<div className="font-semibold font-15 black-txt w-100">
											<div>
												Discipline:
												<span className="font-semibold font-15 black-txt m-l-5 capitalize_text">
													{commonService.returnLabelData(
														"discipline",
														ondemand_view_detail.WorkoutTags
															? ondemand_view_detail.WorkoutTags
															: []
													)}
												</span>
											</div>
											{(this.state.ondemand_detail_data.reviews && (this.state.ondemand_detail_data.reviews.filter(item => parseFloat(item.avg_ratings) > constand.CONSTZERO)).length > 0) &&
												<div>
													Rating:
													<span className="font-weight-bold m-l-5">
														<StarRatings
															rating={this.state.ondemand_detail_data.overAllAvg || 0}
															starRatedColor="#ffc107"
															starDimension="0.9375rem"
															starSpacing="0rem"
															numberOfStars={5}
															name="rating"
														/>
													</span>
												</div>}
											<div>
												Level:
												<span className="font-semibold font-15 black-txt m-l-5 capitalize_text">
													{commonService.returnLabelData(
														"level",
														ondemand_view_detail.WorkoutTags
															? ondemand_view_detail.WorkoutTags
															: []
													)}
												</span>
											</div>
										</div>
									</div>
									<div className="w-100 m-t-30 desktop-ondemand-view">
										<h3 className="heading_3 font-21 black-txt font-medium">
											Description
										</h3>
										<div className="w-100 m-t-20 summary_div">
											<p ref={(div) => this.Wrapper = div}
												className={`font-qregular font-14 black-txt m-0 ${!this.state.expanded
													? "overflow-hidden instruct_details"
													: ""
													}`}
												id="instructor_details"
												dangerouslySetInnerHTML={{
													__html: ondemand_view_detail.description
												}}
											></p>
											<div className="w-100 m-b-30">
												{ondemand_view_detail.Instructor && this.state.showReadMore && (
													<a href="javascript:void(0)"
														onClick={() =>
															this.getMoreTextDiv(!this.state.expanded)
														}
														className="redtext text-underline font-qregular font-14"
													>
														{!this.state.expanded ? "Read More" : "Less"}
													</a>
												)}
											</div>
										</div>
									</div>
									{(commonService.returnTagName("condition", constand.CONDITION, ondemand_view_detail.WorkoutTags ? ondemand_view_detail.WorkoutTags : []) && (commonService.replaceChar(this.props.match.params.condition, true) == constand.CONDITION)) &&
										<div className="w-100 m-t-30 desktop-ondemand-view headsup-section">
											<h3 className="heading_3 font-21 black-txt font-medium">
												Head's Up!</h3>
											<div className="w-100 m-t-20 summary_div">
												<p className="font-qregular font-14 black-txt m-0" id="instructors_details">
													We hope you enjoy this and all our sessions on Beam, but please remember that we are not able to offer you personalised exercise sessions programs and that participating in any live or on-demand Beam sessions is at your own risk. Changes to your airway clearance and exercise regime should be discussed with your clinical team. </p>
											</div>
										</div>
									}
									{commonService.returnTagName(
										"condition", constand.KR_CONDITION,
										ondemand_view_detail.WorkoutTags
											? ondemand_view_detail.WorkoutTags
											: []
									) && (commonService.replaceChar(this.props.match.params.condition, true) == constand.KR_CONDITION) &&
										<div className="w-100 m-t-30 desktop-ondemand-view headsup-section">
											<h3 className="heading_3 font-21 black-txt font-medium">
												Head's Up!
											</h3>
											<div className="w-100 m-t-20 summary_div">
												<p
													className={`font-qregular font-14 black-txt m-0`}
													id="instructors_details"

												>We hope you enjoy this and all our sessions on Beam, but please remember that we are not able to offer you personalised exercise programs and that participating in any live or on-demand Beam sessions is at your own risk.
												</p>
											</div>
										</div>
									}
									{!constand.SAFETY_CONDITION_LIST.includes(commonService.replaceChar(this.props.match.params.condition, true).toLowerCase()) && !(commonService.replaceChar(this.props.match.params.condition, true).toLowerCase()).includes('research') &&
										<div className="w-100 m-t-30 desktop-ondemand-view">
											<div className="w-100 m-t-20 summary_div">
												<p
													className="font-qregular font-16 black-txt m-0"
													id="instructor_details"
												>Here is some <Link to={'/blogs/safety-info-' + this.props.match.params.condition.replace(/ /g, '-')}>important safety information</Link> to make sure you keep safe and feel your best before and after your class.</p>
											</div>
										</div>
									}
								</div>
								<div className="col-md-4 col-lg-4 col-sm-6 ">
									<div className="w-100 m-b-20">
										<h3 className="black-txt font-21 font-medium">
											Instructor
										</h3>
										<div className="w-100 m-t-15">
											<div className="card border-0 flex-row flex-wrap">
												<div className="card-header p-0 rounded-circle border-0">
													<img
														src={
															ondemand_view_detail.Instructor &&
																ondemand_view_detail.Instructor.img
																? constand.USER_IMAGE_PATH +
																ondemand_view_detail.Instructor.img
																: constand.WEB_IMAGES + "no-image.png"
														}
														alt="NoImage"
														className="img-fluid rounded-circle"
													/>
												</div>
												<div className="card-block px-2">
													{ondemand_view_detail.Instructor &&
														ondemand_view_detail.Instructor.User && (!ondemand_view_detail.Instructor.hasProfile || this.props.logged_userData.isStudyParticipant) && (
															<p className="font-semibold font-18 m-b-0">
																{ondemand_view_detail.Instructor.User.name +
																	" " +
																	ondemand_view_detail.Instructor.User.lastName}
															</p>
														)}
													{ondemand_view_detail.Instructor &&
														ondemand_view_detail.Instructor.User && ondemand_view_detail.Instructor.hasProfile && !this.props.logged_userData.isStudyParticipant && (
															<a href={
																"/instructor/" +
																ondemand_view_detail.InstructorId + '/' + this.props.match.params.condition
															}><p className="font-semibold font-18 m-b-0">
																	{ondemand_view_detail.Instructor.User.name +
																		" " +
																		ondemand_view_detail.Instructor.User.lastName}
																</p>

															</a>
														)}
													{ondemand_view_detail.Instructor &&
														ondemand_view_detail.Instructor.User && ondemand_view_detail.Instructor.title && <p className="font-qmedium silver-txt font-16 m-b-0">{ondemand_view_detail.Instructor.title}</p>}

													{ondemand_view_detail.Instructor && ondemand_view_detail.Instructor.hasProfile && !this.props.logged_userData.isStudyParticipant &&
														<div className="card-text redtext text-underline">
															<Link
																className="orangefont font-14 font-book"
																to={
																	"/instructor/" +
																	ondemand_view_detail.InstructorId + '/' + this.props.match.params.condition
																}
															>
																More videos with this instructor
															</Link>
														</div>
													}
												</div>
											</div>
										</div>
									</div>

									<div className="w-100 p-t-35">
										<h3 className=" black-txt font-21 font-medium">
											Recommended equipment
										</h3>
										<div className="w-100 m-t-20">
											<p className="font-qregular font-14 m-0">
												{commonService.returnLabelData(
													"equipment",
													ondemand_view_detail.WorkoutTags
														? ondemand_view_detail.WorkoutTags
														: []
												)}
											</p>x
										</div>
									</div>
								</div>

							</div>
						</div>
						{!(commonService.replaceChar(this.props.match.params.condition, true).toLowerCase()).includes('research') &&
							<div className="demand-section--2 m-t-80 m-l-30 m-r-30 desktop-ondemand-view">
								<div className="row">
									<div className="card w-100">
										<h4 className="card-header p-t-20 p-b-20 font-semibold font-24 text-center text-white bg-red">
											Most Recent Reviews
										</h4>
										{this.state.ondemand_detail_data &&
											this.state.ondemand_detail_data.reviews && (
												<div className="col-md-12 col-lg-12 col-sm-12">
													<div className="w-100 text-center m-t-30 m-b-30 rating-stars">
														<span className="font-weight-bold">
															<StarRatings
																rating={this.state.ondemand_detail_data.overAllAvg || 0}
																starRatedColor="#ffc107"
																starDimension="3rem"
																starSpacing="0rem"
																numberOfStars={5}
																name="rating"
															/>
														</span>
														<p className="font-14 black-txt font-qregular">
															Based on{" "}
															{this.state.ondemand_detail_data.reviewCount}{" "}
															reviews
														</p>
													</div>
													{this.state.ondemand_detail_data.reviews
														//.reverse()
														.filter(item => parseFloat(item.avg_ratings) > constand.CONSTZERO)
														.slice(
															0,
															this.state.reviewLimit
																? 5
																: this.state.ondemand_detail_data.reviews.length
														)
														.map((item, key) => {
															return (
																<React.Fragment key={key}>
																	<hr />
																	<div className="w-100  card-body pl-0 pr-0 pt-0">
																		<div className="card border-0 flex-row flex-wrap">
																			<div className="col-md-12 col-lg-12 col-sm-12 p-0 border-0">
																				<ImageTag
																					className="demand-profimg img-fluid rounded-circle float-left"
																					src={
																						item.User.profilePic
																							? constand.PROFILE_IMAGE_PATH +
																							item.User.profilePic
																							: constand.WEB_IMAGES + "no-profile-pic.png"
																					}
																				/>
																				<div className="card-text font-13 font-qregular black-txt float-left p-l-5 m-t-10">
																					{commonService.bindUsername(item.User)}
																				</div>
																				{/*}<span className="date-time float-right font-12 font-qregular">
                            {moment(item.updatedAt).fromNow()}
                          </span>*/}
																			</div>
																		</div>
																	</div>
																	<div className="card-body pl-0 pt-0 pb-15">
																		<span className="font-weight-bold">
																			<StarRatings
																				rating={parseFloat(item.avg_ratings) ? parseFloat(item.avg_ratings) : 0}
																				starRatedColor="#ffc107"
																				starDimension="0.9375rem"
																				starSpacing="0rem"
																				numberOfStars={5}
																				name="rating"
																			/>
																		</span>
																		<p className="card-text font-14 black-txt font-qregular">
																			{item.comments}
																		</p>
																	</div>

																</React.Fragment>
															);
														})}
													{((this.state.ondemand_detail_data.reviews
														//.reverse()
														.filter(item => parseFloat(item.avg_ratings) > constand.CONSTZERO)).length >= 5) &&
														<React.Fragment>
															<hr />
															<div className="w-100 text-center">
																<button
																	onClick={() => {
																		this.setState({
																			reviewLimit: !this.state.reviewLimit
																		});
																	}}
																	className="btn btn-orange m-t-20 m-b-30 font-medium font-14 pointer"
																>
																	Read {this.state.reviewLimit ? "more" : "fewer"}{" "}
																	reviews
																</button>
															</div></React.Fragment>}
												</div>
											)}
									</div>
								</div>
							</div>
						}
						{!(commonService.replaceChar(this.props.match.params.condition, true).toLowerCase()).includes('research') &&
							<div className="demand-section--3 mobile-slider m-t-40 m-b-40 p-l-15 p-r-15">
								<div className="row">
									<h3 className="clearfix float-left m-b-40 text-center font-semibold font-24 darkblue-text w-100">
										More like this
									</h3>
									<div className="col-md-12 col-lg-12 col-sm-12 p-0">
										<Slider {...settings}>
											{this.state.ondemand_paging.map(item => {
												return (
													<div
														key={item.id}
														className="col-lg-4 col-md-4 col-sm-12 float-left p-b-30 p-0"
													>
														<div className="card h-100">
															<Link
																to={"/detail/" + item.id + "/" + this.props.match.params.condition}
																className="position-relative">
																<ImageTag
																	className="card-img-top img-fluid"
																	src={
																		constand.WORKOUT_IMG_PATH +
																		item.id +
																		"-img.png"
																	}
																	thumb={constand.WEB_IMAGES + "ondemand-placeholder.png"}
																/>

																<span className="position-absolute vid_time">
																	<span>{item.length} minutes</span>
																</span>
															</Link>
															<div className="card-body">
																<div className="w-100 float-left m-b-10">
																	<div className="col-10 col-md-10 col-lg-10 col-sm-10 float-left pl-0">
																		<h3 className="black-txt font-12 font-semibold capitalize_text w-75 float-left">
																			{item.title}
																		</h3>
																	</div>
																	<div className="col-2 col-md-2 col-lg-2 col-sm-2 float-left pl-0 pr-0">
																		<div className="bookmark-left float-left">
																			<WorkoutScheduleComponent
																				ondemand_data={item}
																				location={this.props.location}
																				history={this.props.history}
																			/>
																		</div>
																		<div className="bookmark-left m-l-10 float-left">
																			<WorkoutSaveComponent
																				page="ondemand_detail_sub"
																				workoutData={item}
																			/>
																		</div>
																	</div>
																</div>
																<div className="w-100">
																	<div className="col-12 col-lg-12 col-sm-12 float-left m-b-10 p-0">
																		<div className="p-0 border-0 float-left">
																			<img
																				className="demand-profimg img-fluid rounded-circle"
																				src={
																					item.Instructor && item.Instructor.img
																						? constand.USER_IMAGE_PATH +
																						item.Instructor.img
																						: constand.WEB_IMAGES + "no-image.png"
																				}
																				alt=""
																			/>
																		</div>
																		<p className="float-left m-t-5 font-10 black-txt font-qregular p-l-10">
																			{item.Instructor && item.Instructor.User
																				? item.Instructor.User.name +
																				" " +
																				item.Instructor.User.lastName
																				: ""}

																		</p>
																	</div>
																	<div className="col-12 col-lg-12 col-sm-12 float-left pr-0 pl-0">
																		<div className="font-medium w-100 font-light--weight">
																			<div className="col-md-12 col-sm-12 float-left p-0">
																				<span className="col-4 col-sm-4 float-left font-10 black-txt  font-qregular p-0">
																					Discipline:
																				</span>
																				<span className="redtext col-8 col-sm-8 p-0 float-left font-10  font-qregular capitalize_text">
																					{commonService.returnTag(
																						"discipline", this.state.all_tags, item.id
																					)}
																				</span>
																			</div>
																			<div className="col-md-12 col-sm-12 float-left p-0">
																				<span className="col-4 col-sm-4 p-0 float-left font-10 black-txt  font-qregular">
																					Level:
																				</span>
																				<span className="redtext col-8 col-sm-8 p-0 float-left font-10  font-qregular capitalize_text">
																					{commonService.returnTag(
																						"level", this.state.all_levels, item.id
																					)}
																				</span>
																			</div>
																			{/* <div className="col-md-12 col-sm-12 float-left p-0">
                  <span className="w-40 float-left font-10 black-txt font-qregular">Language:</span>
                  <span className="w-60 float-left">
                    {" "}
                    <img
                      className="img-fluid"
                      src="/images/flag.png"
                      alt=""
                    />
                  </span>
                </div> */}
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												);
											})}
										</Slider>
									</div>
								</div>
							</div>
						}
						{!(commonService.replaceChar(this.props.match.params.condition, true).toLowerCase()).includes('research') &&
							<div className="demand-section--3 demand-section--desk m-t-80 m-l-30 m-r-30">
								<div className="row">
									<h3 className="clearfix float-left m-b-40 text-center font-semibold font-24 darkblue-text w-100">
										More like this
									</h3>
									<div className="col-md-12 col-lg-12 col-sm-12 p-0">
										<div className="row">
											{this.state.ondemand_paging.map(item => {
												return (
													<div
														key={item.id}
														className="col-lg-4 col-md-4 col-sm-12 float-left p-b-30"
													>
														<div className="card h-100">
															<Link
																to={"/detail/" + item.id + "/" + this.props.match.params.condition}
																className="position-relative"
															>
																<ImageTag
																	className="card-img-top img-fluid"
																	src={
																		constand.WORKOUT_IMG_PATH +
																		item.id +
																		"-img.png"
																	}
																	thumb={constand.WEB_IMAGES + "ondemand-placeholder.png"}
																/>
																<span className="position-absolute vid_time">
																	<span>{item.length} mins</span>
																</span>
															</Link>
															<div className="card-body">
																<div className="w-100 float-left m-b-10">
																	<div className="col-md-12 col-lg-12 col-sm-12 float-left p-0">
																		<h3 className="black-txt font-16 font-semibold capitalize_text float-left w-75">
																			{item.title}
																		</h3>
																		<div className="bookmark-left float-right text-right w-25">
																			<WorkoutScheduleComponent
																				from="ondemand"
																				ondemand_data={item}
																				location={this.props.location}
																				history={this.props.history}
																			/>
																			<b className="m-l-10">
																				<WorkoutSaveComponent
																					className="m-l-10"
																					page="ondemand_detail_sub"
																					workoutData={item}
																				/>
																			</b>
																		</div>
																		<div className="bookmark-left m-l-10 float-left"></div>
																	</div>

																	{/* <div className="col-2 col-md-2 col-lg-2 col-sm-12 float-left pl-0 pr-0">
                    <div className="bookmark-left float-left m-l-5">
                      <WorkoutScheduleComponent
                        ondemand_data={item}
                        location={this.props.location}
                        history={this.props.history}
                      />
                    </div>
                    <div className="bookmark-left m-l-10 float-left">
                      <WorkoutSaveComponent
                        page="ondemand_detail_sub"
                        workoutData={item}
                      />
                    </div>
                  </div> */}
																</div>
																<div className="w-100">
																	<div className="col-md-12 col-lg-12 col-sm-12 float-left m-b-10 p-0">
																		<div className="left-image leftwidth-set p-0 border-0 float-left">
																			<img
																				className="demand-profimg img-fluid rounded-circle"
																				src={
																					item.Instructor && item.Instructor.img
																						? constand.USER_IMAGE_PATH +
																						item.Instructor.img
																						: constand.WEB_IMAGES + "no-image.png"
																				}
																				alt=""
																			/>
																		</div>
																		<p className="float-left m-t-5 font-14 black-txt font-qregular p-l-10">
																			{item.Instructor && item.Instructor.User
																				? item.Instructor.User.name +
																				" " +
																				item.Instructor.User.lastName
																				: ""}

																		</p>
																	</div>
																	<div className="col-md-12 col-lg-12 col-sm-12 float-left p-0">
																		<div className="font-medium w-100 font-light--weight">
																			<div className="col-md-12 col-sm-12 float-left p-0">
																				<span className="w-45 float-left font-14 black-txt font-qbold">
																					Discipline:
																				</span>
																				<span className="redtext w-50 float-left font-14 p-l-5 font-qregular capitalize_text">
																					{commonService.returnTag(
																						"discipline", this.state.all_tags, item.id
																					)}
																				</span>
																			</div>
																			<div className="col-md-12 col-sm-12 float-left p-0">
																				<span className="w-45 float-left font-14 black-txt font-qbold">
																					Difficulty:
																				</span>
																				<span className="redtext w-50 float-left font-14 p-l-5 font-qregular capitalize_text">
																					{commonService.returnTag(
																						"level", this.state.all_levels, item.id
																					)}
																				</span>
																			</div>
																			{/* <div className="col-md-12 col-sm-12 float-left p-0">
                  <span className="w-40 float-left font-10 black-txt font-qregular">Language:</span>
                  <span className="w-60 float-left">
                    {" "}
                    <img
                      className="img-fluid"
                      src="/images/flag.png"
                      alt=""
                    />
                  </span>
                </div> */}
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												);
											})}
										</div>
										<div className="col-md-12 col-lg-12 col-sm-12 text-center float-left">
											<Link
												onClick={() => { this.goback() }}
												//to={"/on-demand/" + this.props.match.params.condition}
												className="btn btn-orange m-t-40 m-b-40 font-medium font-14"
											>
												View all on demand session
											</Link>
										</div>
									</div>
								</div>
							</div>
						}
					</div>
				</section>
				{(this.props.match.params.condition) &&
					<WarningModal
						isConditionModalOpen={this.state.isConditionModalOpen}
						conditionName={this.props.match.params.condition}
						isWarningModal={this.state.isWarningModal}
						closeModel={this.closeModel}
						hasMembership={this.state.hasMembership}
						health_conditionId={this.state.health_conditionId}
						afterUpgrade={this.startVideo}
					/>
				}
				{//this.props.openPlayOndemand &&
					<PlayOndemand
						condition={this.props.match.params.condition}
						programId={this.state.programId}
						workoutId={this.props.match.params.id}
						history={this.props.history}
						ondemand_detail_data={this.state.ondemand_detail_data}
					//openPlayOndemand={this.props.openPlayOndemand}
					/>
				}
			</React.Fragment>
		)
	}
}

const mapStateToProps = state => {
	return {
		is_auth: state.auth.is_auth,
		condition: state.auth.condition,
		workout_detail_data: state.workout.workout_detail_data,
		logged_userData: state.header.logged_userData,
		scheduleRoomId: state.workout.scheduleRoomId,
		prevPath: state.workout.prevPath,
		healthcondition_list: state.register.healthcondition_list,
		registerFormvalues: state.register.registerFormValues,
		openPlayOndemand: state.workout.openPlayOndemand,

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
	isOpenBeforeModel,
	isOpenPostPollModel,
	isOpenResearchModel,
	isOpenSafetyModel,
	isWarningModal,
	isConditionModalOpen,
	isPlayOndemand,
	likeMoreOndemand
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WorkoutDetailComponent);