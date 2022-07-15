import React, { useRef } from "react";
import { matchPath } from "react-router";
import { connect } from "react-redux";
import {
  loginModelOpen,
  fetchUserDetails,
  isAuth,
  logout,
  start_loader,
  stop_loader,
  updateUserdataRedex,
  setCondition,
  setMenuCondition,
  healthCondition,
  fetchNotifications,
  readNotifications,
  confirmNotifications,
  updateNotification,
  warningBanner,
  changeCMSMode,
  updateUserChallengeTag,
  changeCMSGroupMode,
  getFooter,
  getFeatures,
  fetchConditionRelationships,
  setExploreConditions,
  gotoStep,
  clearRegisterFormUpdate,
  checkMenuData,
  openPolicy,
  savePolicy,
  getCountriesList,
  getCountOfData,
  getFaqContent,
  getURLCondition
} from "../actions";
import LoginComponent from "../_components/LoginPage/LoginComponent";
import ForgotPasswordComponent from "../_components/LoginPage/ForgotPasswordComponent";
import WorkoutSchedulePopup from "../_components/WorkoutsPage/workoutSchedulePopup";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-responsive-modal";
import * as constand from "../constant";
import { ImageTag } from "../tags";
import CookieConsent, { Cookies } from "react-cookie-consent";
import CffBanner from "../_components/HomePage/CffBanner";
import { createRef } from "react";
import ChallengingModal from "../_components/HomePage/ChallengingModal";
import { commonService } from "../_services";
import { Helmet } from "react-helmet";
import ConfirmationPopup from "../_components/Common/ConfirmationPopup";
import ClinicConfirmationPopup from "../_components/Common/ClinicConfirmationPopup"
import ConditionalModalComponent from "../_components/Common/ConditionalModalComponent";
import LandingModalComponent from "../_components/Common/LandingModalComponent";

const MENO_CONDITION = constand.MENO_CONDITION;
const KIDNEY_CONDITION = constand.KR_CONDITION.replace(/ /g, '-');
var accountAriaExpand = true;
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutAriaExpand: false,
      condition: '', //constand.CONDITION,
      is_menu_open: false,
      header_open: false,
      condition_dd_open: false,
      maintance_model: false,
      selected_notification: {},
      notification: [],
      userDetails: [],
      active_bell: false,
      condition_model: false,
      currentPageName: '',
      isAdmin: false,
      isOwner: false,
      view: false,
      Filters: ''
    };
    //  this.conditonClassList = [...constand.CONDITION_CLASS_LIST];
    this.loginClick = this.loginClick.bind(this);
    this.logoutClick = this.logoutClick.bind(this);
    this.changeDrowndownArrow = this.changeDrowndownArrow.bind(this);
    this.changeHeaderClass = this.changeHeaderClass.bind(this);
    this.changeConditionClass = this.changeConditionClass.bind(this);
    this.getConditionPopup = this.getConditionPopup.bind(this);
    this.maintance_model_state = this.maintance_model_state.bind(this);
    this.open = false;
    //  this.conditonClassList = [...constand.CONDITION_CLASS_LIST];
    //this.returnClass = this.conditonClassList.reverse();
    this.aboutRef = React.createRef()
  }

  componentWillReceiveProps() {
    //  this.conditonClassList = [...constand.CONDITION_CLASS_LIST];
  }

  /*  getColorClass(key) {
     if (this.returnClass.length > 0)
       return this.returnClass[key];
   } */
  componentDidMount() {
    this.props.getURLCondition();
    this.props.getFaqContent();
    console.log('this.props.match.params', this.props)
    this.props.getCountriesList()
    this.props.gotoStep(0); //to clear the signup steps
    this.props.clearRegisterFormUpdate(); //to clear the signup steps
    this.getConditions();
    this.props.fetchConditionRelationships();
    this.props.warningBanner();
    this.props.isAuth();
    this.is_auth = this.props.is_auth;
    console.log('this.props.is_auth', this.props.is_auth)
    if (this.props.is_auth) {
      this.getUserDetail();
    }
    var authData = JSON.parse(localStorage.getItem('userDetails'));
    var menuCondition = Cookies.get('condition') ? Cookies.get('condition') : this.props.menu_condition;
    var createmode;
    if (authData && authData.isStudyLeader) {
      createmode = (authData.SLCondition.indexOf(commonService.replaceChar(menuCondition, true)) != -1 && JSON.parse(localStorage.getItem('isCreateMode'))) ? true : false;
    }
    else
      createmode = JSON.parse(localStorage.getItem('isCreateMode')) ? true : false;

    if (JSON.parse(localStorage.getItem('user'))) {
      var user = JSON.parse(localStorage.getItem('user'));
      setTimeout(() => {
        this.setState({
          isAdmin: user.adminDetails,
          isOwner: user.ownerdetails
        })
      }, 300)
    }
    console.log('CrEATEviji', createmode)
    this.props.changeCMSMode(createmode);

    setInterval(async () => {
      if (this.props.is_auth) {
        this.fetchNotifications();
      }
    }, constand.ASYNIC_NOTIFICATION_CALL_TIME);
    this.showForFirstTime();
    var headerUrl = this.props.history.location.pathname;
    this.setState({ headerUrl: headerUrl })
    if (this.props.history.location.search && this.props.history.location.search.indexOf('token=') !== -1) {
      var splittedToken = this.props.history.location.search.split('token=')[1];
      var temp = { token: splittedToken ? splittedToken.replace('%20', ' ') : '' }
      localStorage.setItem('userAuthToken', JSON.stringify(temp));
      this.props.isAuth();
      this.getUserDetail();
    }
    this.props.getFooter(commonService.replaceChar(menuCondition, true))
    this.savePageUrl(headerUrl);

   /*  if (this.props.url_condition) {
      console.log('this.props.url_condition',this.props.url_condition)
      console.log('header-props',this.props)
     // this.props.history.push();
    } */
  }

  componentWillReceiveProps(nextProps) {
    var headerUrl = nextProps.history.location.pathname;
    console.log('headerUrl',headerUrl)
    // if(this.state.headerUrl!=headerUrl){
    var splitter = headerUrl.split('/')[1];
    this.setState({ currentPageName: splitter })
    //}
    var createmode = JSON.parse(localStorage.getItem('isCreateMode')) ? true : false;
    // this.props.changeCMSMode(createmode);
    if (this.props.init_condition == '' && this.props.init_condition != nextProps.init_condition) {
      if (Cookies.get('condition')) {
        if (nextProps.init_condition != commonService.replaceChar(Cookies.get('condition'), false))
          this.props.getCountOfData(commonService.replaceChar(Cookies.get('condition'), false));
      }
      else
        this.props.getCountOfData(commonService.replaceChar(nextProps.init_condition, false));
    }
  }
  /**
   * set first time user visit
   */
  showForFirstTime() {
    var firstTimeUser = localStorage.getItem("firstTimeUser");
    if (parseInt(firstTimeUser) !== 1) {
      //this.maintance_model_state(true);
      localStorage.setItem("firstTimeUser", 1);
    }
  }
  maintance_model_state(state) {
    this.setState({ maintance_model: state, condition_model: state });
  }

  onCloseModal() { }

  changeDrowndownArrow() {
    if (this.state.is_menu_open === true) {
      this.setState({ is_menu_open: false });
    } else {
      this.setState({ is_menu_open: true });
    }
  }

  changeHeaderClass(url) {
    this.setState({ condition_dd_open: false });
    if (this.state.header_open === true) {
      this.setState({ header_open: false });
    } else {
      this.setState({ header_open: true });
    }
    if (url) {
      this.savePageUrl(url);
    }
  }

  savePageUrl = (url) => {
    console.log('savePageUrl', url)
    if (url) {
      var pathnameTemp = url;

      Cookies.set("current-page-url", pathnameTemp);
    }
  }

  changeConditionClass() {
    this.setState({ header_open: false });
    if (this.state.condition_dd_open === true) {
      this.setState({ condition_dd_open: false });
    } else {
      this.setState({ condition_dd_open: true });
    }
  }
  getPathFromUrl(isSetcondition, conditionCheck = false) {
    console.log('getPathFromUrl')
    var pathnameTemp = this.props.location.pathname;
    console.log('location.pathname', pathnameTemp)
    var lastOccurrence = pathnameTemp.lastIndexOf('/');
    var splitPath = pathnameTemp.split('/');
    var urlCondition = pathnameTemp.substr(lastOccurrence + 1);
    var url = '';
    console.log('isSetcondition', isSetcondition)
    console.log('splitPath.length', splitPath.length)
    console.log('constand.CONDITION_LIST', constand.CONDITION_LIST.includes(commonService.replaceChar(urlCondition, true)))
    if (isSetcondition && splitPath.length == 3 && constand.CONDITION_LIST.includes(commonService.replaceChar(urlCondition, true))) {
      url = pathnameTemp.substr(0, lastOccurrence) + '/';
    }
    return url;
  }
  getConditionPopup(url, isSetcondition = false, conditions = "") {

    let authData = JSON.parse(localStorage.getItem('userDetails')) || this.props.logged_userData;
    console.log('authData-getConditionPopup', authData)
    if (Object.keys(authData).length && !authData.terms) {
      this.props.openPolicy(true);
    }

    console.log('url-actual', url)
    var urlPath = this.getPathFromUrl(isSetcondition, true);
    url = isSetcondition ? (urlPath || url) : url;

    if (!isSetcondition) {
      if (Cookies.get('condition')) {
        this.conditionalGoto(Cookies.get('condition'), url, isSetcondition);
      } else if (this.props.is_auth && this.props.init_condition) {
        this.conditionalGoto(this.props.init_condition, url, isSetcondition);
      } else {
        this.setState({ condition_model: true, pageUrl: url });
      }
    } else {
      //get liveclass counts
      this.props.getCountOfData(commonService.replaceChar(conditions, false))
        .then(response => {
          console.log('getCountOfDataresponse', response)
          console.log('module_data', this.props.module_data.liveclass)
          this.conditionalGoto(conditions, url, isSetcondition);
        }, error => {
          this.conditionalGoto(conditions, url, isSetcondition);
        });
    }
  }

  loginClick() {
    Cookies.remove('condition')
    this.props.loginModelOpen(true);
  }

  conditionalGoto(condition, url, isSetcondition = false) {
    var current_url = url;
    console.log('conditionalGoto', condition)
    console.log('conditionalGoto-current_url', current_url)
    var formatCondition = commonService.replaceChar(condition, false);
    this.props.checkMenuData(formatCondition);
    this.props.setCondition(condition);
    this.props.setMenuCondition(condition);
    if (condition == constand.KR_CONDITION || condition == constand.CONDITION || condition == constand.CANCER_CONDITION || condition == constand.ASTHMA_CONDITION) {
      console.log('yesmatchingcondition=', url)
      if (url) {
        current_url = url + formatCondition;
        if (url.toLowerCase().includes('liveclasses') && this.props.module_data.liveclass == 0) {
          current_url = '/on-demand/' + formatCondition;
        }
      } else {
        current_url = '/' + formatCondition;
      }
      console.log('if-current_url=',current_url)

      const { from } = { from: { pathname: current_url } };
      this.props.history.push(from);
    } else {
      console.log('nomatchingcondition=', url)
      var pathnameTemp = this.props.location.pathname;
      console.log('location.pathname', pathnameTemp)
      var splitPath = pathnameTemp.split('/');
      if (splitPath.length > 3) {
        console.log('ifsplitpath=')

        //redirect to listing page other than main listing page
        current_url = '/on-demand/' + formatCondition;
        if (this.props.module_data.liveclass)
          current_url = '/liveClasses/' + formatCondition;

        const { from } = { from: { pathname: current_url } };
        this.props.history.push(from);
      } else {
        console.log('elsesplitpath=')

        //  current_url = '/on-demand/' + formatCondition;
        current_url = url + formatCondition;
        console.log('includesof', url.toLowerCase().includes('liveclasses'))
        console.log('liveclasscount=', this.props.module_data.liveclass)
        if (url.toLowerCase().includes('liveclasses') && this.props.module_data.liveclass == 0) {
          current_url = '/on-demand/' + formatCondition;
        }
        console.log('includesof-current_url=', current_url)
        //current_url = '/liveClasses/' + formatCondition;
        const { from } = { from: { pathname: current_url } };
        this.props.history.push(from);
      }
    }
    Cookies.set("condition", formatCondition);
    this.savePageUrl(current_url);
    this.setState({ condition_model: false, condition: formatCondition, header_open: false })

  }

  async logoutClick() {
    Cookies.remove('condition')
    this.props.updateNotification({ notification: [], userDetails: [] });
    await this.props.logout();
    this.props.isAuth();
    /* const { from } = { from: { pathname: "/home" } };
    this.props.history.push(from); */
    window.location.href = "/home";

  }

getUserDetail=()=> {
    this.props.fetchUserDetails().then(
      response => {
        console.log('getuserdetails-header')
        let authData = JSON.parse(localStorage.getItem('userDetails')) || this.props.logged_userData;
        this.props.setExploreConditions(authData.UserConditions, this.props.healthcondition_list) 

        //var beamChallenge = this.props.match.params.beamchallenging && this.props.match.params.beamchallenging.includes('keepbeaming-signup') ? 'keepbeaming-signup' : '';
        //localStorage.setItem('beamchallenging', beamChallenge)
        var temp = commonService.returnTagName('condition', constand.CONDITION, this.props.logged_userData.UserConditions);
        if (localStorage.getItem('beamchallenging') && this.props.is_auth && temp) {
          this.props.updateUserChallengeTag();
        }

        this.fetchNotifications();
        this.props.getFeatures()
        //this.getBeamer();
        if (!authData.terms && this.state.currentPageName != 'terms') {
          this.props.openPolicy(true);
        }
        this.props.getCountOfData(commonService.replaceChar(this.props.init_condition, false));
      },
      error => {
        console.log('fetchUserDetails-err', error)
        /* if (error === "Unauthorized") {
          this.logoutClick()
          toast.error(error + " :Token expired. Please login again.");
        } else */
        toast.error(error);
      }
    );
  }

  getConditions() {
    this.props.healthCondition().then(
      response => { },
      error => {
        toast.error(error);
      }
    );
  }

  fetchNotifications() {
    this.props.fetchNotifications().then(
      response => {
        let notification = (response.notification) ? response.notification : [];
        let alert_status = (response.count > 0) ? true : false;
        let userDetails = (response.userDetails) ? response.userDetails : [];
        this.setState({ notification: notification, userDetails: userDetails, active_bell: alert_status });
        setTimeout(() => {
          this.setState({ active_bell: false });
        }, constand.BELL_ALERT_TIMEOUT);
      },
      error => {
        /* if (error === 'Unauthorized') {
          this.logoutClick()
          toast.error(error + " :Token expired. Please login again.");
        } else */
        toast.error(error);
      }
    );
  }

  readNotifications(item) {
    let params = { notifyId: item.id };
    this.props.readNotifications(params).then(
      response => {
        this.spliceGroupContent(item.id);
      },
      error => {
        toast.error(error);
      }
    );
  }

  confirmNotifications(isAccept, notifyId) {
    let params = {
      isAccept: isAccept,
      notifyId: notifyId
    };
    this.props.confirmNotifications(params).then(
      response => {
        this.spliceGroupContent(notifyId);
        toast.success(response.message);
      },
      error => {
        toast.error(error);
      }
    );
  }

  viewNotification(key) {

    let temp_notification = [...this.props.notification];
    temp_notification[key].extented = (temp_notification[key].extented === true) ? false : true;
    let current_notification = temp_notification[key];
    let squalizeObj = { notification: temp_notification, userDetails: this.props.userDetails };
    this.setState({ selected_notification: current_notification, notification: temp_notification });
    this.props.updateNotification(squalizeObj);
  }

  gotoGroup(item) {
    this.changeHeaderClass();
    if (item.Community && item.Community.community_name) {
      const { from } = { from: { pathname: ("/group/feed/" + item.Community.community_name + "/" + commonService.replaceChar(Cookies.get('condition'), false)) } };
      this.props.history.push(from);
    } else if (item.Workout && item.Workout.title) {
      const { from } = { from: { pathname: ("/detail/" + item.Workout.id + "/" + commonService.replaceChar(Cookies.get('condition'), false)) } };
      this.props.history.push(from);
    }
  }

  spliceGroupContent(notifyId) {
    let temp_notification = [...this.props.notification];
    let temp_userDetail = [...this.props.userDetails];
    let index = temp_notification.findIndex(x => parseInt(x.id) === parseInt(notifyId));
    if (index > -1) {
      temp_notification.splice(index, 1);
      temp_userDetail.splice(index, 1);
    }
    let squalizeObj = { notification: temp_notification, userDetails: temp_userDetail };
    this.setState({ notification: temp_notification });
    this.props.updateNotification(squalizeObj)
  }

  _renderNotification() {
    return (<li>
      <h5 className="col-md-12 font-14 black-txt font-qmedium p-t-5 p-b-5 m-b-0  border-bottom">
        Notifications
      </h5>
      <ul className="noti_list">
        {this.props.notification && this.props.notification.map((item, key) => {
          var reference = item.Room ? (item.Room.Attendees && item.Room.Attendees.length > 0 ? item.Room.Attendees[0].reference : '#') : '';
          var prequest = (item.Room && item.Room.Questionnaire) ? item.Room.Questionnaire.preQuestionnaire : ''
          return (
            <li key={key} className="border-bottom">
              <div className=" col-md-12 p-t-10 p-b-10 ">
                <div className=" row">
                  <div className="col-md-3 col-sm-3 col-xs-3">
                    <div className="notify-img text-center">
                      <ImageTag width="36" className="img-fluid rounded-circle"
                        src={(this.props.userDetails[key].profilePic) ? constand.PROFILE_IMAGE_PATH + this.props.userDetails[key].profilePic : constand.WEB_IMAGES + 'no-profile-pic.png'}
                      />
                    </div>
                  </div>
                  <div className="col-md-9 col-sm-9 col-xs-9 p-0 row">
                    <span
                      className="pull-left ltext p-l-0 black-txt font-14 font-qregular"
                    >
                      {(item.type === 'liveclassRemind' || item.type === 'ondemandRemind') && item.bespokeMsg}

                      {(item.type === 'joinrequest' || item.type === 'join') && this.processGroupMsg(item, 'group')}
                      {(item.type == 'fileUploadSuccess' || item.type == 'fileUploadFail') && this.processGroupMsg(item, 'file')}
                    </span>
                    {" "}
                    <span
                      className="p-0 pull-right text-right"
                    >
                      <i className="fa fa-times pointer text-muted" aria-hidden="true" onClick={() => this.readNotifications(item)}></i>
                      {/* <i className="fa fa-ellipsis-v pointer" aria-hidden="true" onClick={()=>this.viewNotification(key)}></i> */}
                    </span>
                    {/*<div className="w-100 text-left m-t-10 m-b-10">*/}
                    {(item.type === 'joinrequest' && item.reqUserId) &&
                      <React.Fragment>
                        <button className="btn  dblog_btn notifify_confirm_btn font-12 font-medium btn-purple m-r-5" onClick={() => this.confirmNotifications(1, item.id)}>
                          Accept
                        </button>
                        <button className="btn deny_btn black-txt font-12 font-medium" onClick={() => this.confirmNotifications(0, item.id)}>
                          Reject
                        </button>
                      </React.Fragment>}
                    {item.type === 'liveclassRemind' &&
                      <React.Fragment>
                        {prequest != '' && <a className="btn preclass_btn notifify_confirm_btn font-12 font-medium btn-purple m-r-5" href={prequest} target="_blank" > pre-class survey </a>}
                        {/* <button className="btn  dblog_btn notifify_confirm_btn font-12 font-medium btn-purple m-r-5" onClick={() => this.readNotifications(item)}>
                          pre-class survey
                  </button> */}
                        {/* <button className="btn deny_btn black-txt font-12 font-medium" onClick={() => this.confirmNotifications(0, item.id)}>
                          go to class
                  </button> */}
                        <a className="btn deny_btn black-txt font-12 font-medium" href={reference} target="_blank"> go to class </a>

                      </React.Fragment>
                    }
                    {
                      item.type === 'ondemandRemind' &&
                      <React.Fragment>
                        <a className="btn deny_btn black-txt font-12 font-medium" href={"/detail/" + item.workoutId + "/" + commonService.replaceChar(this.state.condition, false)} >start class</a>

                        {/* <button className="btn deny_btn black-txt font-12 font-medium" onClick={() => this.confirmNotifications(0, item.id)}>
                          start class
                   </button> */}
                      </React.Fragment>
                    }
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </li>)
        })}
      </ul>
    </li>);
  }

  processGroupMsg(item, type) {
    let return_msg;
    let raw_message = (item.bespokeMsg) ? item.bespokeMsg : '';
    switch (type) {
      case 'group':
        let group_name = (item.Community && item.Community.community_name) ? item.Community.community_name : '';
        var row_message = raw_message.split(group_name);
        if (row_message.length > 1) {
          return_msg = <React.Fragment>{row_message[0]}<u className="pointer font-semibold purplefont" onClick={() => this.gotoGroup(item)}>{group_name}</u>{row_message[1]}</React.Fragment>;
        } else {
          return_msg = row_message[0];
        }
        break;
      case 'file':
        let workout_name = (item.Workout && item.Workout.title) ? item.Workout.title : '';
        var row_message = raw_message.split(workout_name);
        if (row_message.length > 1) {
          return_msg = <React.Fragment>{row_message[0]}<u className="pointer font-semibold purplefont" onClick={() => this.gotoGroup(item)}>{workout_name}</u>{row_message[1]}</React.Fragment>;
        } else {
          return_msg = row_message[0];
        }
        break;
    }
    return return_msg;
  }


  _renderMobileNotification() {

    return (<ul className={this.state.notifyAriaExpand ? "dropdown-menu noti_list show" : "dropdown-menu noti_list"} >
      {this.props.notification && this.props.notification.map((item, key) => {
        return (
          <li key={key}>
            <div className="notifi_list">
              <div className=" col-md-12 p-t-10 p-b-10 border-bottom">
                <div className=" row">
                  <div className="col-10">
                    <span className="font-14 font-book noti-text pull-left">

                      {(item.type === 'liveclassRemind' || item.type === 'ondemandRemind') && item.bespokeMsg}

                      {(item.type === 'joinrequest' || item.type === 'join') && this.processGroupMsg(item, 'group')}
                      {(item.type == 'fileUploadSuccess' || item.type == 'fileUploadFail') && this.processGroupMsg(item, 'file')}
                    </span>{" "}
                  </div>
                  <div className="col-2 p-0">
                    {(item.type === 'joinrequest' && item.reqUserId) &&
                      <React.Fragment>
                        <span className="text-right green-batch"><img src={constand.WEB_IMAGES + "notitick.png"} onClick={() => this.confirmNotifications(1, item.id)} /></span>
                        <span className="text-right red-batch "><img src={constand.WEB_IMAGES + "cancel.png"} onClick={() => this.confirmNotifications(0, item.id)} /></span>
                      </React.Fragment>
                    }
                  </div>
                </div>
                <i className="fa fa-times pointer" aria-hidden="true" onClick={() => this.readNotifications(item)}></i>
              </div>
            </div>
          </li>)
      })}</ul>);
  }

  handleClickRef(ref) {
    console.log('handleClick-ref', ref)
    switch (ref) {
      case 'aboutRef':
        var expa = this.state.aboutAriaExpand;
        this.setState({ aboutAriaExpand: !expa })
        break;
      case 'workRef':
        var expa = this.state.workAriaExpand;
        this.setState({ workAriaExpand: !expa })
        break;
      case 'notificationRef':
        var expa = this.state.notifyAriaExpand;
        this.setState({ notifyAriaExpand: !expa })
        break;
      case 'accountRef':
        var expa = this.state.accountAriaExpand;
        this.setState({ accountAriaExpand: !expa })
        break;
    }
    /* this.refs[ref].scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    }); */
    var me = this;
    setTimeout(() => {
      console.log('Hello, World!', ref);
      me.refs[ref].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 500);


  }

  saveUserPolicy = (terms) => {
    this.setState({ submitted: true });
    if (terms) {
      this.props.savePolicy(terms).then(response => {
        toast.success(response.message)
        this.props.openPolicy(false);
      }, error => {
        toast.error(error)
      })
    }
  }

  handleCheckboxChange = (e) => //for twoway binding checkbox
  {
    /*  const { name } = e.target;
     this.state.terms = !this.state.terms; */
    this.setState({ terms: !this.state.terms })
  }

  closeConditionModal = () => {
    this.setState({ condition_model: false })
  }
  
  render() {

    let authData = this.props.logged_userData || JSON.parse(localStorage.getItem('userDetails'));
    var logoUrl = '/home';
    var headerUrl = this.props.history.location.pathname;
    var menuCondition = Cookies.get('condition') ? Cookies.get('condition') : this.props.menu_condition;
    var cookieCondition = Cookies.get('condition') ? commonService.replaceChar(Cookies.get('condition'), true) : commonService.replaceChar(this.props.init_condition, true);
    if (authData && authData.isStudyLeader) {
      logoUrl = '/on-demand/' + commonService.replaceChar(cookieCondition, false);
    } else if (authData && (authData.isGroupLeader || authData.isStudyInstructor)) {
      logoUrl = '/groups/' + commonService.replaceChar(cookieCondition, false);
    } else if (authData && authData.isStudyUser) {
      var community = authData.Members.length ? authData.Members[0].Community.community_name : '';
      logoUrl = '/group/feed/' + community + '/' + commonService.replaceChar(cookieCondition, false);
    }
    console.log('header-this.props.history', this.props.history)
    var currentPath = this.props.history ? this.props.history.location.pathname : '/home';
    currentPath = currentPath.indexOf('/reset') != -1 ? '/home' : currentPath;
    var logo_name = "logo.png";
    if (authData && authData.isStudyUser) {
      var trialName = (commonService.replaceChar(cookieCondition, true).toLowerCase()).replace('research studies: ', '');
      logo_name = trialName.charAt(0).toUpperCase() + trialName.slice(1) + '-lock-up.png';
    }
    /* const accountRef = React.createRef();

    function handleClickRefLocal(ref) {
      accountAriaExpand = !accountAriaExpand;
      return ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } */
    return (
      <React.Fragment>
        <Helmet>
          <script type="text/javascript">{`
        var beamer_config ={
          product_id: "${process.env.REACT_APP_PRODUCT_ID}",
          filter: "${this.props.beamer_filter}",
        };
    `}</script>
          <script type="text/javascript" src="https://app.getbeamer.com/js/beamer-embed.js" defer="defer"></script>
        </Helmet>
        <header className="header header-custom" >
          {/* 
          <CookieConsent
            buttonText="Okay - I'm happy with this"
            disableStyles={true}
            buttonClasses="btn btn-orange font-medium font-14 m-t-20"
            containerClasses="cookieConsentContainer"
            expires={150}
            onAccept={({ acceptedByScrolling }) => {
              if (acceptedByScrolling) {
                // triggered if user scrolls past threshold
                //alert("Accept was triggered by user scrolling");
              } else {
                Cookies.set('Username', me.props.logged_userData.name + ' ' + me.props.logged_userData.lastName, { path: '/' })
              }
            }}
          >
            <div className="cookieTitle"><a>Cookies 🍪</a>
            </div>
            <div className="cookieDesc">
              <p>Our website uses cookies to ensure you get the best experience while you're here
              </p>
            </div>

          </CookieConsent> */}
          <div id="content"></div>

          <nav
            className={
              (matchPath(this.props.location.pathname, "/instructor/:id")
                ? "border-bottom"
                : "") +
              " navbar navbar-expand-lg navbar-light bg-white fixed-top " + (this.props.warning_banner_text.length > 0 ? "header-with-info" : "")
            }
          >
            {this.props.warning_banner_text.length > 0 &&
              <div class="blue-info font-qmedium">

                {this.props.warning_banner_text.map((item, key) => {
                  return (
                    <p> {item.text}</p>
                  )
                })
                }
              </div>
            }
            <div className="  container-fluid mx-auto pl-3 pr-3">
              {/* <div className="col-md-12 bg-purple-color loadtime-banner">
                  <p className="font-18 font-qmedium white-txt pt-3">
                    *** Beam is experiencing slow page loading speeds at the moment.  While we’re working hard to fix it please give pages extra time to load and email hello@beamfeelgood.com if you’re unable to get to a class. Thanks for bearing with us. *** </p>
                </div> */}
              <Link className={("navbar-brand pointer ") + (authData && authData.isStudyUser ? 'w-25' : '')} to={logoUrl} >
                <img src={constand.WEB_IMAGES + logo_name} alt="beam" className={(authData && authData.isStudyUser ? 'w-100' : '')} />
              </Link>
              {(Cookies.get('condition') || (this.props.is_auth && this.props.init_condition)) &&
                <div className="left-cyber">
                  {/* <span class="float-left for-txt font-semibold">for </span> */}
                  {/*web view*/}
                  {(!authData || (authData && !authData.isStudyUser)) &&
                    < ul className="navbar-nav ml-auto align-items-start align-items-lg-center float-left cyber-txt navbar-collapse" >
                      <li className="dropdown nav-item webmenu">
                        <a
                          className="dropdown-toggle nav-link link-scroll font-semibold navalign cyber-link"
                          role="button"
                          aria-expanded="false"
                          aria-haspopup="true"
                          href="#"
                          data-toggle="dropdown"
                        >
                          {Cookies.get('condition') && commonService.replaceChar(Cookies.get('condition'), true) || (this.props.is_auth && this.props.init_condition && commonService.replaceChar(this.props.init_condition, true))}
                          {(!cookieCondition.toLowerCase().includes('research') || (cookieCondition.toLowerCase().includes('research') && authData && authData.UserConditions && authData.UserConditions.length > 1)) &&
                            <span class=" caret"></span>
                          }
                        </a>
                        {(!cookieCondition.toLowerCase().includes('research') || (cookieCondition.toLowerCase().includes('research') && authData && authData.UserConditions && authData.UserConditions.length > 1)) &&
                          <ul className="dropdown-menu cyber-menu">
                            {(this.props.is_auth && authData && authData.UserConditions && authData.UserConditions.length > 0) &&
                              <li className="nav-item">
                                <Link className="nav-link link-scroll font-medium navalign add_purple_bg top-section-condition" >
                                  My conditions
                                </Link>
                              </li>
                            }
                            {(authData && authData.UserConditions &&
                              authData.UserConditions.map((item, key) => {
                                return (
                                  <li className="nav-item" >
                                    <a
                                      className="nav-link link-scroll font-medium navalign pointer"
                                      onClick={() => {
                                        var url = ((authData.isGroupLeader || authData.isStudyLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('on-demand')) ? '/on-demand/' : '/liveClasses/';

                                        this.getConditionPopup(url, true, item.Tag.tag);
                                        this.props.getFooter(item.Tag.tag)
                                      }}
                                    >
                                      <p className="purplefont capitalize_text m-0">
                                        {item.Tag.tag}
                                      </p>
                                    </a>
                                  </li>
                                )
                              }))
                              ||
                              this.props.healthcondition_list.map((item, key) => {
                                return (
                                  <li className="nav-item" >
                                    <a
                                      className="nav-link link-scroll font-medium navalign pointer"
                                      onClick={() => {
                                        var url = '/on-demand/';
                                        this.getConditionPopup(url, true, item.tag);
                                        this.props.getFooter(item.tag)
                                      }}
                                    >
                                      <p className="purplefont capitalize_text m-0">
                                        {item.tag}
                                      </p>
                                    </a>
                                  </li>
                                )
                              })
                            }
                            {this.props.is_auth && authData && authData.UserConditions && (this.props.healthcondition_list.length != authData.UserConditions.length) &&
                              <li className="nav-item">
                                <Link className="nav-link link-scroll font-medium navalign add_purple_bg" >
                                  Explore conditions
                                </Link>
                              </li>
                            }
                            {this.props.is_auth && authData && authData.UserConditions && (this.props.healthcondition_list.length != authData.UserConditions.length) &&
                              this.props.explore_conditions.length && this.props.explore_conditions.map((item, key) => {
                                return (
                                  <li className="nav-item" >
                                    <a
                                      className="nav-link link-scroll font-medium navalign pointer"
                                      onClick={() => {
                                        var url = '/on-demand/';
                                        this.getConditionPopup(url, true, item.tag);
                                        this.props.getFooter(item.tag)
                                      }}
                                    >
                                      <p className="purplefont capitalize_text m-0">
                                        {item.tag}
                                      </p>
                                    </a>
                                  </li>
                                )
                              })
                            }
                          </ul>
                        }
                      </li>
                    </ul>
                  }
                  {/*mobile view*/}
                  {/* {(!authData || (authData && !authData.isStudyUser)) &&
                    < ul className="navbar-nav ml-auto align-items-start align-items-lg-center float-left cyber-txt mobile-condition-dd" >
                      <li className="nav-item">
                        <a
                          className="dropdown-toggle nav-link link-scroll font-semibold navalign cyber-link"
                          role="button"
                          aria-expanded="false"
                          aria-haspopup="true"
                          href="#"
                          onClick={this.changeConditionClass}
                        >
                          {Cookies.get('condition') && commonService.replaceChar(Cookies.get('condition'), true) || (this.props.is_auth && this.props.init_condition && commonService.replaceChar(this.props.init_condition, true))} {" "}
                          {(!cookieCondition.toLowerCase().includes('research') || (cookieCondition.toLowerCase().includes('research') && authData && authData.UserConditions && authData.UserConditions.length > 1)) &&
                            <span class=" caret"></span>
                          }
                        </a>
                      </li>
                    </ ul>
                  } */}
                  {/* {(!cookieCondition.toLowerCase().includes('research') || (cookieCondition.toLowerCase().includes('research') && authData && authData.UserConditions && authData.UserConditions.length > 1)) &&
                    <div
                      className={
                        "mobile-nav " +
                        (this.state.condition_dd_open === true ? "clicked" : " ")
                      }
                    >
                      <ul className="navbar-nav ml-auto align-items-start align-items-lg-center text-capitalize">

                        {(this.props.is_auth && authData && authData.UserConditions && authData.UserConditions.length > 0) &&
                          <li className="dropdown nav-item" >
                            <a
                              className="dropdown-toggle nav-link link-scroll font-book navalign"
                              role="button"
                              aria-expanded="false"
                              aria-haspopup="true"
                              href="#"
                              data-toggle="dropdown"

                            >
                              My Conditions{" "}
                              <i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>
                            </a>
                            <ul className="dropdown-menu">
                              {(authData && authData.UserConditions &&
                                authData.UserConditions.map((item, key) => {
                                  return (
                                    <li className="nav-item" >
                                      <Link
                                        className="nav-link link-scroll font-medium navalign"
                                        onClick={() => {
                                          var url = ((authData.isGroupLeader || authData.isStudyLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('on-demand')) ? '/on-demand/' : '/liveClasses/';

                                          this.changeConditionClass();
                                          this.getConditionPopup(url, true, item.Tag.tag)
                                        }}
                                      >
                                        {item.Tag.tag}
                                      </Link>
                                    </li>
                                  )
                                })
                              )}
                            </ul>
                          </li>
                        }
                        {this.props.is_auth && authData && authData.UserConditions && (this.props.healthcondition_list.length != authData.UserConditions.length) &&
                          <li className="dropdown nav-item" >
                            <a
                              className="dropdown-toggle nav-link link-scroll font-book navalign"
                              role="button"
                              aria-expanded="false"
                              aria-haspopup="true"
                              href="#"
                              data-toggle="dropdown"

                            >
                              Explore conditions{" "}
                              <i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>
                            </a>
                            <ul className="dropdown-menu">
                              {(this.props.explore_conditions.length &&
                                this.props.explore_conditions.map((item, key) => {
                                  return (
                                    <li className="nav-item" >
                                      <Link
                                        className="nav-link link-scroll font-medium navalign"
                                        onClick={() => {
                                          var url = '/on-demand/';

                                          this.changeConditionClass();
                                          this.getConditionPopup(url, true, item.tag)
                                        }}
                                      >
                                        {item.tag}
                                      </Link>
                                    </li>
                                  )
                                })
                              )}
                            </ul>
                          </li>
                        }
                        {(!this.props.is_auth &&

                          this.props.healthcondition_list.map((item, key) => {
                            return (
                              <li className="nav-item" >
                                <Link
                                  className="nav-link link-scroll font-medium navalign"
                                  onClick={() => {
                                    var url = '/on-demand/';

                                    this.changeConditionClass();
                                    this.getConditionPopup(url, true, item.tag)
                                  }}
                                >
                                  {item.tag}
                                </Link>
                              </li>
                            )
                          })
                        )
                        }
                      </ul>
                    </div>
                  } */}
                </div>
              }
              <button
                className={
                  "navbar-toggler menu " +
                  (this.state.header_open === true ? "clicked" : " ")
                }
                type="button"
                data-toggle="collapse"
                data-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup"
                aria-expanded="false"
                aria-label="Toggle navigation"
                onClick={this.changeHeaderClass}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              {/* start mobile view */}
              <div
                className={
                  "mobile-nav " +
                  (this.state.header_open === true ? "clicked" : " ")
                }

              >
                <ul className="navbar-nav ml-auto align-items-start align-items-lg-center">
                  {!this.props.is_auth && (
                    <li className="nav-item cursor">
                      <span
                        className="nav-link navalign font-book  pointer"
                        onClick={() => { this.changeHeaderClass(); this.loginClick(); }}
                      >
                        Sign In
                      </span>
                    </li>
                  )}
                  {this.props.is_auth &&
                    <li className="dropdown nav-item profile">
                      <Link className="btn navbar-btn btn-shadow font-medium font-14 btn-gradient button-style w-100 my-beam" to={"/account/dashboard/schedule/" + commonService.replaceChar(menuCondition, false)}>My Beam
                      </Link>
                    </li>
                  }

                  {(this.props.is_auth && authData && authData.UserConditions && authData.UserConditions.length > 0) &&
                    <li className="dropdown nav-item text-capitalize" >
                      <a
                        className="dropdown-toggle nav-link link-scroll font-book navalign"
                        role="button"
                        aria-expanded="false"
                        aria-haspopup="true"
                        href="#"
                        data-toggle="dropdown"

                      >
                        My Conditions{" "}
                        <i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>
                      </a>
                      <ul className="dropdown-menu">
                        {(authData && authData.UserConditions &&
                          authData.UserConditions.map((item, key) => {
                            return (
                              <li className="nav-item" >
                                <a
                                  className="nav-link link-scroll font-medium navalign pointer"
                                  onClick={() => {
                                    var url = ((authData.isGroupLeader || authData.isStudyLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('on-demand')) ? '/on-demand/' : '/liveClasses/';

                                    this.changeHeaderClass();
                                    this.getConditionPopup(url, true, item.Tag.tag)
                                  }}
                                >
                                  {item.Tag.tag}
                                </a>
                              </li>
                            )
                          })
                        )}
                      </ul>
                    </li>
                  }
                  {this.props.is_auth && authData && authData.UserConditions && (this.props.healthcondition_list.length != authData.UserConditions.length) &&
                    <li className="dropdown nav-item text-capitalize" >
                      <a
                        className="dropdown-toggle nav-link link-scroll font-book navalign"
                        role="button"
                        aria-expanded="false"
                        aria-haspopup="true"
                        href="#"
                        data-toggle="dropdown"

                      >
                        Explore conditions{" "}
                        <i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>
                      </a>
                      <ul className="dropdown-menu">
                        {(this.props.explore_conditions.length &&
                          this.props.explore_conditions.map((item, key) => {
                            return (
                              <li className="nav-item" >
                                <a
                                  className="nav-link link-scroll font-medium navalign pointer"
                                  onClick={() => {
                                    var url = '/on-demand/';

                                    this.changeHeaderClass();
                                    this.getConditionPopup(url, true, item.tag)
                                  }}
                                >
                                  {item.tag}
                                </a>
                              </li>
                            )
                          })
                        )}
                      </ul>
                    </li>
                  }
                  {(!this.props.is_auth &&
                    <li className="dropdown nav-item text-capitalize" >
                      <a
                        className="dropdown-toggle nav-link link-scroll font-book navalign"
                        role="button"
                        aria-expanded="false"
                        aria-haspopup="true"
                        href="#"
                        data-toggle="dropdown"

                      >
                        Conditions{" "}
                        <i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>
                      </a>
                      <ul className="dropdown-menu">
                        {(this.props.healthcondition_list.length &&
                          this.props.healthcondition_list.map((item, key) => {
                            return (
                              <li className="nav-item" >
                                <a
                                  className="nav-link link-scroll font-medium navalign pointer"
                                  onClick={() => {
                                    var url = '/on-demand/';

                                    this.changeHeaderClass();
                                    this.getConditionPopup(url, true, item.tag)
                                  }}
                                >
                                  {item.tag}
                                </a>
                              </li>
                            )
                          })
                        )}
                      </ul>
                    </li>
                  )
                  }
                  {/* (!this.props.is_auth || (this.props.is_auth && authData && ((!authData.isStudyUser && !authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyInstructor && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.ASTHMA_CONDITION)))) &&
                    <li className="dropdown nav-item" >
                      <a
                        className="dropdown-toggle nav-link link-scroll font-book navalign"
                        role="button"
                        aria-expanded="false"
                        aria-haspopup="true"
                        href="#"
                        data-toggle="dropdown"
                        ref={'ondemandRef'}

                      >
                        On-Demand{" "}
                        <i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>
                      </a>
                      <ul className="dropdown-menu">

                        <li className="nav-item" >
                          <Link
                            className="nav-link link-scroll font-book navalign"
                            onClick={() => { this.changeHeaderClass(); this.getConditionPopup('/on-demand/') }}
                          >
                            <p className="purplefont capitalize_text">
                              On-demand classes
                            </p>
                          </Link>
                        </li>
                        {(!this.props.is_auth || (this.props.is_auth && authData && ((!authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyInstructor) || ((authData.isStudyLeader || authData.isGroupLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('programs'))))) &&
                          <li className="nav-item" >
                            <Link
                              className="nav-link link-scroll font-book navalign"
                              onClick={() => { this.getConditionPopup('/programs/') }}
                            >
                              <p className="purplefont capitalize_text">
                                Programs
                              </p>
                            </Link>

                          </li>
                        }

                      </ul>
                    </li>
                  */ }
                  {(!this.props.is_auth || (this.props.is_auth && !authData.isStudyUser && (((authData.isGroupLeader || authData.isStudyLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('on-demand')) || (constand.CORE_MENU.includes('on-demand'))))) &&
                    <li className="nav-item">
                      <Link
                        onClick={() => { this.changeHeaderClass(); this.getConditionPopup('/on-demand/') }}
                        className="nav-link link-scroll font-book navalign"
                      > On-demand Classes
                      </Link>
                    </li>}
                  {(!this.props.is_auth || (this.props.is_auth && !authData.isStudyUser && (((authData.isGroupLeader || authData.isStudyLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('programs')) || (constand.CORE_MENU.includes('programs') && this.props.is_menu_has_data)))) &&
                    <li className="nav-item">
                      <Link
                        onClick={() => { this.changeHeaderClass(); this.getConditionPopup('/programs/') }}
                        className="nav-link link-scroll font-book navalign"
                      > Programs
                      </Link>
                    </li>}
                  {((!this.props.is_auth && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.CANCER_CONDITION && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.POSTNATAL_CONDITION && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.MENO_CONDITION) || (this.props.is_auth && !authData.isStudyUser && ((!authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyInstructor && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.CANCER_CONDITION && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.POSTNATAL_CONDITION && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.MENO_CONDITION) || ((authData.isGroupLeader || authData.isStudyLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('liveClasses'))))) &&
                    <li className="nav-item">
                      <Link
                        onClick={() => { this.changeHeaderClass(); this.getConditionPopup('/liveClasses/') }}
                        className="nav-link link-scroll font-book navalign"

                      >
                        Live Classes
                      </Link>
                    </li>}
                  {((!this.props.is_auth && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.POSTNATAL_CONDITION && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.MENO_CONDITION) || (this.props.is_auth && !authData.isStudyUser && ((!authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyInstructor && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.POSTNATAL_CONDITION && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.MENO_CONDITION) || ((authData.isGroupLeader || authData.isStudyLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('groups'))))) &&
                    <li className="nav-item">
                      <Link
                        onClick={() => { this.changeHeaderClass(); this.getConditionPopup('/groups/') }}
                        className="nav-link link-scroll font-book navalign"
                      >
                        Groups
                      </Link>
                    </li>
                  }
                  {(!this.props.is_auth || (this.props.is_auth && !authData.isStudyUser && ((!authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyInstructor && constand.CORE_MENU.includes('instructor')) || ((authData.isGroupLeader || authData.isStudyLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('instructor'))))) &&
                    <li className="nav-item">
                      <Link
                        onClick={() => { this.changeHeaderClass(); this.getConditionPopup('/instructor/') }}
                        className="nav-link link-scroll font-book navalign"
                      >
                        Instructors
                      </Link>
                    </li>
                  }
                  {(!this.props.is_auth || (this.props.is_auth && !authData.isStudyUser && ((!authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyInstructor) || ((authData.isGroupLeader || authData.isStudyLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('blog'))))) &&
                    <li className="nav-item">
                      <a
                        onClick={() => { this.changeHeaderClass(); this.getConditionPopup('/blog/') }}
                        className="nav-link link-scroll font-book navalign"

                      >
                        Blog
                      </a>
                    </li>
                  }
                  {(!this.props.is_auth || (this.props.is_auth && !authData.isStudyUser && ((!authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyInstructor) || ((authData.isGroupLeader || authData.isStudyLeader || !authData.isStudyInstructor) && constand.SL_MENU.includes('howitworks'))))) &&
                    <li className={this.state.aboutAriaExpand ? "dropdown nav-item show" : "dropdown nav-item"} onClick={this.handleClickRef.bind(this, 'aboutRef')} >
                      <a
                        className="dropdown-toggle nav-link link-scroll font-book navalign"
                        ref={'aboutRef'}
                      >
                        About{" "}
                        <i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>
                      </a>
                      <ul className={this.state.aboutAriaExpand ? "dropdown-menu show" : "dropdown-menu"} >
                        <li className="nav-item" >
                          <Link
                            onClick={() => this.changeHeaderClass("/howitworks")}
                            className="nav-link link-scroll font-book navalign"
                            to={"/howitworks"}
                          >
                            <p className="purplefont capitalize_text">
                              How it works
                            </p>
                          </Link>

                        </li>

                        <li className="nav-item" >
                          <Link
                            onClick={() => this.changeHeaderClass("/howitworks/#pricing")}
                            className="nav-link link-scroll font-book navalign"
                            to={"/howitworks/#pricing"}
                          >
                            <p className="purplefont capitalize_text">
                              Pricing
                            </p>
                          </Link>

                        </li>

                        <li className="nav-item" >

                          <Link
                            onClick={() => this.changeHeaderClass("/about-us")}
                            className="nav-link link-scroll font-book navalign"
                            to={"/about-us"}
                          >
                            <p className="purplefont capitalize_text">
                              About us
                            </p>
                          </Link>
                        </li>
                        {commonService.replaceChar(menuCondition, true).toLowerCase() == constand.CONDITION_LIST[0] &&
                          <li className="nav-item" >
                            <a
                              onClick={() => { this.changeHeaderClass(); this.getConditionPopup('/about/') }}
                              className="nav-link link-scroll font-book navalign"
                            >
                              <p className="purplefont capitalize_text text_wrap">

                                About exercise for cystic fibrosis
                              </p>
                            </a>
                          </li>
                        }
                        <li className="nav-item" >
                          <Link
                            onClick={() => this.changeHeaderClass("/blog/Help")}
                            className="nav-link link-scroll font-book navalign"
                            to={"/blog/Help"}
                          >
                            <p className="purplefont capitalize_text">
                              Help
                            </p>
                          </Link>
                        </li>

                        <li className="nav-item" tabIndex="-1">
                          <Link
                            onClick={() => this.changeHeaderClass("/contact-us")}
                            className="nav-link link-scroll font-book navalign"
                            to={"/contact-us"}
                          >
                            <p className="purplefont capitalize_text">
                              Contact
                            </p>
                          </Link>
                        </li>
                        <li className="nav-item" tabIndex="-1">
                          <Link
                            onClick={() => this.changeHeaderClass("/faq")}
                            className="nav-link link-scroll font-book navalign"
                            to={"/faq"}
                          >
                            <p className="purplefont capitalize_text">
                              FAQ
                            </p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  }
                  {(!this.props.is_auth || (this.props.is_auth && !authData.isStudyUser && ((!authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyInstructor) || ((authData.isStudyLeader || authData.isGroupLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('partnerships'))))) && menuCondition != constand.POSTNATAL_CONDITION && menuCondition != constand.MENO_CONDITION && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.ASTHMA_CONDITION && <li className="nav-item">
                    <a
                      onClick={() => { this.changeHeaderClass(); this.getConditionPopup('/partnerships/') }}
                      className="nav-link link-scroll font-book navalign"

                    >
                      For clinicians
                    </a>
                  </li>
                  }
                  {this.props.is_auth && authData.isTeensOnBeam && constand.CMS_PAGES.includes('teensonbeam') &&<li className="nav-item">
                          <Link
                            onClick={() => { this.changeHeaderClass();this.savePageUrl("/teens-on-beam") }}
                            className={"pointer nav-link link-scroll font-book navalign " + ((headerUrl.indexOf('/teens-on-beam') !== -1)
                              ? "active"
                              : "")}
                              to={"/teens-on-beam"}
                          >
                            Teens on Beam
                          </Link>
                        </li>
                        }
                  {!this.props.is_auth && (
                    <li className="nav-item trail-btn-show">
                      <Link
                        onClick={this.changeHeaderClass}
                        className="nav-link navalign font-book  pointer"
                        to="/register"
                      >
                        Start trial
                      </Link>
                    </li>
                  )}
                  {this.props.is_auth && (
                    <li className={this.state.notifyAriaExpand ? "dropdown nav-item show" : "dropdown nav-item"} onClick={this.handleClickRef.bind(this, 'notificationRef')} >
                      <a
                        className="dropdown-toggle nav-link link-scroll font-book navalign"
                        /* role="button"
                        aria-expanded="false"
                        aria-haspopup="true"
                        href="#"
                        data-toggle="dropdown" */
                        ref={'notificationRef'}
                      >
                        Notifications{" "}
                        <span class="label label-primary">{this.props.notification.length}</span>
                        {(this.props.notification.length > 0) &&
                          <i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>}
                      </a>
                      {(this.props.notification.length > 0) && this._renderMobileNotification()}
                    </li>
                  )}
                  {this.props.is_auth && (
                    <li className={this.state.accountAriaExpand ? "dropdown nav-item show" : "dropdown nav-item"} onClick={this.handleClickRef.bind(this, 'accountRef')}  >
                      <a
                        className="dropdown-toggle nav-link link-scroll font-book navalign"
                      >
                        My beam{" "}
                        <i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>
                      </a>
                      <ul className={this.state.accountAriaExpand ? "dropdown-menu show" : "dropdown-menu"} ref={'accountRef'} >
                        <li className="nav-item">
                          <Link
                            onClick={() => { this.changeHeaderClass(); this.getConditionPopup('/account/dashboard/schedule/') }}
                            className={
                              (matchPath(
                                this.props.location.pathname,
                                "/account/dashboard/"
                              )
                                ? "orangefont "
                                : "") +
                              "nav-link link-scroll font-book navalign"
                            }
                          >
                            <div className="purplefont">Dashboard</div>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            onClick={() => this.changeHeaderClass("/accounts/basicInformation")}
                            className={
                              (matchPath(
                                this.props.location.pathname,
                                "/accounts/basicInformation"
                              )
                                ? "orangefont "
                                : "") +
                              "nav-link link-scroll font-book navalign"
                            }
                            to="/accounts/basicInformation"
                          >
                            <div className="purplefont">Account Details</div>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            onClick={() => { this.changeHeaderClass(); this.logoutClick() }}
                            className="nav-link link-scroll font-book navalign"
                          >
                            <div className="purplefont">Logout</div>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  )}
                </ul>
              </div>
              {/* start web view */}
              <div className="collapse navbar-collapse float-right" id="navbarNavAltMarkup">
                {this.props.is_auth && authData && (
                  <React.Fragment>
                    {!authData.isStudyUser &&
                      <ul className="navbar-nav ml-auto align-items-start  align-items-lg-center">
                        {/* {((!authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyInstructor && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.ASTHMA_CONDITION)) &&
                          <li className="dropdown nav-item">
                            <a
                              className={"dropdown-toggle nav-link link-scroll font-book navalign " + ((headerUrl.indexOf('/on-demand') !== -1) || (headerUrl.indexOf('/programs') !== -1)
                                ? "active"
                                : "")}
                              role="button"
                              aria-expanded="false"
                              aria-haspopup="true"
                              href="#"
                              data-toggle="dropdown"
                            >
                              On-Demand<span className="arrow-std caret"></span>{" "}
                              <i
                                className={
                                  "fa  fa-2x pull-right small-arrow " +
                                  (this.state.is_menu_open === true
                                    ? "fa-angle-down"
                                    : "fa-angle-up")
                                }
                                onClick={this.changeDrowndownArrow}
                              ></i>
                            </a>
                            <ul className="dropdown-menu">

                              <li className="nav-item" >
                                <Link
                                  className="nav-link link-scroll font-medium navalign"
                                  onClick={() => { this.getConditionPopup('/on-demand/') }}
                                >
                                  <p className="purplefont capitalize_text m-0">
                                    On-demand classes
                                  </p>
                                </Link>

                              </li>

                              {((!authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyInstructor) || ((authData.isGroupLeader || authData.isStudyLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('programs'))) &&
                                <li className="nav-item" >
                                  <Link
                                    className="nav-link link-scroll font-medium navalign"
                                    onClick={() => { this.getConditionPopup('/programs/') }}
                                  >
                                    <p className="purplefont capitalize_text m-0">
                                      Programs
                                    </p>
                                  </Link>

                                </li>
                              }
                            </ul>
                          </li>
                        } */}

                        {(((authData.isGroupLeader || authData.isStudyLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('on-demand')) || (!authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyInstructor)) &&
                          <li className="nav-item">
                            <span
                              className={"pointer nav-link link-scroll font-book navalign " + ((headerUrl.indexOf('/on-demand/') !== -1)
                                ? "active"
                                : "")}
                              onClick={() => { this.getConditionPopup('/on-demand/') }}
                            >
                              On-demand Classes
                            </span>
                          </li>
                        }
                        {(((authData.isGroupLeader || authData.isStudyLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('programs')) || (!authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyInstructor && constand.CORE_MENU.includes('programs') && this.props.is_menu_has_data)) &&
                          <li className="nav-item">
                            <span
                              className={"pointer nav-link link-scroll font-book navalign " + ((headerUrl.indexOf('/programs/') !== -1)
                                ? "active"
                                : "")}
                              onClick={() => { this.getConditionPopup('/programs/') }}
                            >
                              Programs
                            </span>
                          </li>
                        }
                        {((!authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyInstructor && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.CANCER_CONDITION && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.POSTNATAL_CONDITION && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.MENO_CONDITION) || ((authData.isGroupLeader || authData.isStudyLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('liveClasses'))) &&
                          <li className="nav-item">
                            <span
                              className={"pointer nav-link link-scroll font-book navalign " + ((headerUrl.indexOf('/liveClasses/') !== -1)
                                ? "active"
                                : "")}
                              onClick={() => { this.getConditionPopup('/liveClasses/') }}
                            >
                              Live Classes
                            </span>
                          </li>
                        }

                        {((!authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyInstructor && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.POSTNATAL_CONDITION && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.MENO_CONDITION) || ((authData.isGroupLeader || authData.isStudyLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('groups'))) &&
                          <li className="nav-item">
                            <span
                              onClick={() => { this.getConditionPopup('/groups/') }}
                              className={"pointer nav-link link-scroll font-book navalign " + ((headerUrl.indexOf('/groups/') !== -1)
                                ? "active"
                                : "")}
                            >
                              Groups
                            </span>
                          </li>
                        }
                        {((!authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyInstructor && (constand.CORE_MENU.includes('instructor'))) || ((authData.isGroupLeader || authData.isStudyLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('instructor'))) &&
                          <li className="nav-item">
                            <span
                              onClick={() => { this.getConditionPopup('/instructor/') }}
                              className={"pointer nav-link link-scroll font-book navalign " + ((headerUrl.indexOf('/instructor/') !== -1)
                                ? "active"
                                : "")}
                            >
                              Instructors
                            </span>
                          </li>
                        }
                        {((!authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyInstructor) || ((authData.isGroupLeader || authData.isStudyLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('blog'))) &&
                          <li className="nav-item">
                            <span
                              onClick={() => { this.changeHeaderClass(); this.getConditionPopup('/blog/') }}

                              className={"pointer nav-link link-scroll font-book navalign " + ((headerUrl.indexOf('/blog/') !== -1)
                                ? "active"
                                : "")}
                            >
                              Blog
                            </span>
                          </li>
                        }
                        {((!authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyInstructor) || ((authData.isGroupLeader || authData.isStudyLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('howitworks'))) &&
                          <li className="dropdown nav-item">
                            <a
                              className={"dropdown-toggle nav-link link-scroll font-book navalign " + ((headerUrl.indexOf('/howitworks') !== -1) || (headerUrl.indexOf('/about-us') !== -1) || (headerUrl.indexOf('/about/') !== -1) || (headerUrl.indexOf('/blog/Help') !== -1) || (headerUrl.indexOf('/contact-us') !== -1) || (headerUrl.indexOf('/faq') !== -1)
                                ? "active"
                                : "")}
                              role="button"
                              aria-expanded="false"
                              aria-haspopup="true"
                              href="#"
                              data-toggle="dropdown"
                            >
                              About<span className="arrow-std caret"></span>{" "}
                              <i
                                className={
                                  "fa  fa-2x pull-right small-arrow " +
                                  (this.state.is_menu_open === true
                                    ? "fa-angle-down"
                                    : "fa-angle-up")
                                }
                                onClick={this.changeDrowndownArrow}
                              ></i>
                            </a>
                            <ul className="dropdown-menu long-length">

                              <li className="nav-item" >
                                <Link
                                  onClick={() => this.savePageUrl("/howitworks")}
                                  className="pointer nav-link link-scroll font-medium navalign"
                                  to={"/howitworks"}
                                >
                                  <p className="purplefont capitalize_text m-0">
                                    How it works
                                  </p>
                                </Link>

                              </li>
                              <li className="nav-item" >
                                <Link
                                  onClick={() => this.savePageUrl("/howitworks/#pricing")}
                                  className="pointer nav-link link-scroll font-medium navalign"
                                  to={"/howitworks/#pricing"}
                                >
                                  <p className="purplefont capitalize_text m-0">
                                    Pricing
                                  </p>
                                </Link>
                              </li>
                              <li className="nav-item" >
                                <Link
                                  onClick={() => this.savePageUrl("/about-us")}
                                  className="pointer nav-link link-scroll font-medium navalign"
                                  to={"/about-us"}
                                >
                                  <p className="purplefont capitalize_text m-0">
                                    About us
                                  </p>
                                </Link>
                              </li>
                              {commonService.replaceChar(menuCondition, true).toLowerCase() == constand.CONDITION_LIST[0] &&
                                <li className="nav-item" >
                                  <span
                                    onClick={() => { this.changeHeaderClass(); this.getConditionPopup('/about/') }}
                                    className="pointer nav-link link-scroll font-medium navalign"
                                  >
                                    <p className="purplefont capitalize_text m-0">

                                      About exercise for cystic fibrosis
                                    </p>
                                  </span>
                                </li>
                              }
                              <li className="nav-item" >
                                <Link
                                  onClick={() => this.savePageUrl("/blog/Help")}
                                  className="pointer nav-link link-scroll font-medium navalign"
                                  to={"/blog/Help"}
                                >
                                  <p className="purplefont capitalize_text m-0">
                                    Help
                                  </p>
                                </Link>
                              </li>
                              <li className="nav-item" >
                                <Link
                                  onClick={() => this.savePageUrl("/contact-us")}
                                  className="pointer nav-link link-scroll font-medium navalign"
                                  to={"/contact-us"}
                                >
                                  <p className="purplefont capitalize_text m-0">
                                    Contact
                                  </p>
                                </Link>
                              </li>
                              <li className="nav-item" >
                                <Link
                                  onClick={() => this.savePageUrl("/faq")}
                                  className="pointer nav-link link-scroll font-medium navalign"
                                  to={"/faq"}
                                >
                                  <p className="purplefont capitalize_text m-0">
                                    FAQ
                                  </p>
                                </Link>
                              </li>
                            </ul>
                          </li>
                        }
                        {menuCondition != constand.POSTNATAL_CONDITION && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.ASTHMA_CONDITION && menuCondition != constand.MENO_CONDITION && ((!authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyInstructor) || ((authData.isGroupLeader || authData.isStudyLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('partnerships'))) && <li className="nav-item">
                          <span
                            onClick={() => { this.changeHeaderClass(); this.getConditionPopup('/partnerships/') }}
                            className={"pointer nav-link link-scroll font-book navalign " + ((headerUrl.indexOf('/partnerships/') !== -1)
                              ? "active"
                              : "")}
                          >
                            For clinicians
                          </span>
                        </li> 
                        }
                        {this.props.is_auth && authData.isTeensOnBeam && constand.CMS_PAGES.includes('teensonbeam') &&<li className="nav-item">
                          <Link
                            onClick={() => { this.changeHeaderClass();this.savePageUrl("/teens-on-beam") }}
                            className={"pointer nav-link link-scroll font-book navalign " + ((headerUrl.indexOf('/teens-on-beam') !== -1)
                              ? "active"
                              : "")}
                              to={"/teens-on-beam"}
                          >
                            Teens on Beam
                          </Link>
                        </li>
                        }
                        {<li className="bell-sub dropdown nav-item">
                          <a
                            className="dropdown-toggle icon-info  nav-link link-scroll font-book navalign"
                            role="button"
                            aria-expanded="false"
                            aria-haspopup="true"
                            href="#"
                            data-toggle="dropdown"
                          >
                            <i
                              className={(this.state.active_bell) ? "bell fa fa-bell-o black-txt medium-text" : "fa fa-bell-o black-txt medium-text"}
                              aria-hidden="true"
                            ></i>
                            <span className="label label-primary">{this.props.notification.length}</span>
                            {(this.props.notification.length > 0) && <React.Fragment>
                              <span className="arrow-std caret nocaret"></span>{" "}
                              <i className="fa  fa-2x pull-right small-arrow fa-angle-up"></i></React.Fragment>}
                          </a>
                          {(this.props.notification.length > 0) &&
                            <ul className="dropdown-menu">
                              {this._renderNotification()}
                            </ul>}
                        </li>}
                        {this.props.is_auth && !this.props.is_create_mode && (((authData.isCreator || (authData.isStudyLeader && authData.SLCondition.indexOf(commonService.replaceChar(menuCondition, true)) != -1)) && constand.CMS_PAGES.includes(this.state.currentPageName))) &&
                          <li>
                            <i class="fa fa-pencil fa-2x orangefont p-r-15 pointer" aria-hidden="true" onClick={() => this.props.changeCMSMode(true)}></i>
                          </li>
                        }
                        {this.props.is_auth && this.props.is_create_mode && (((authData.isCreator || (authData.isStudyLeader && authData.SLCondition.indexOf(commonService.replaceChar(menuCondition, true)) != -1)) && constand.CMS_PAGES.includes(this.state.currentPageName))) &&
                          <li>
                            <i class="fa fa-eye fa-2x orangefont p-r-15 pointer" aria-hidden="true" onClick={() => this.props.changeCMSMode(false)}></i>
                          </li>
                        }
                        {(this.props.is_group_admin || this.props.is_group_leader) && constand.GROUP_PAGE.includes(this.state.currentPageName) && (!authData.isCreator && (!authData.isStudyLeader || (authData.isStudyLeader && authData.SLCondition.indexOf(commonService.replaceChar(menuCondition, true)) == -1 && authData.isGroupLeader && authData.GLCondition.indexOf(commonService.replaceChar(menuCondition, true)) != -1))) && !this.props.is_group_mode && this.props.is_auth &&
                          <li>
                            <i class="fa fa-pencil fa-2x orangefont p-r-15 pointer" aria-hidden="true" onClick={() => this.props.changeCMSGroupMode(true)}></i>
                          </li>
                        }
                        {(this.props.is_group_admin || this.props.is_group_leader) && constand.GROUP_PAGE.includes(this.state.currentPageName) && (!authData.isCreator && (!authData.isStudyLeader || (authData.isStudyLeader && authData.SLCondition.indexOf(commonService.replaceChar(menuCondition, true)) == -1 && authData.isGroupLeader && authData.GLCondition.indexOf(commonService.replaceChar(menuCondition, true)) != -1))) && this.props.is_auth && !authData.isCreator && this.props.is_group_mode &&
                          <li>
                            <i class="fa fa-eye fa-2x orangefont p-r-15 pointer" aria-hidden="true" onClick={() => this.props.changeCMSGroupMode(false)}></i>
                          </li>
                        }
                      </ul>
                    }
                    <ul className={" navbar-nav  profile-img-sec align-items-lg-center "}>
                      <li className="dropdown nav-item profile">
                        <Link className="pointer btn navbar-btn btn-shadow font-medium font-14 btn-gradient button-style" to={"/account/dashboard/schedule/" + commonService.replaceChar(menuCondition, false)} >My Beam
                        </Link>
                      </li>
                      <li className="dropdown nav-item profile">
                        <a
                          href="#"
                          data-toggle="dropdown"
                          className="toggle  nav-link "
                          role="button"
                          aria-expanded="false"
                          aria-haspopup="true"
                        >
                          <img
                            src={
                              this.props.logged_userData.profilePic
                                ? constand.S3_API_IMG + '/profile/' + this.props.logged_userData.profilePic
                                : constand.WEB_IMAGES + "no-image.png"
                            }
                            className="rounded-circle img-fluid"
                          />
                          <span className="arrow-std caret nocaret"></span>{" "}
                          <i
                            className={
                              "fa  fa-2x pull-right small-arrow " +
                              (this.state.is_menu_open === true
                                ? "fa-angle-down"
                                : "fa-angle-up")
                            }
                            onClick={this.changeDrowndownArrow}
                          ></i>
                        </a>
                        <ul className="dropdown-menu">
                          <li className="nav-item">
                            <Link
                              //onClick={() => { this.getConditionPopup('/account/dashboard/schedule/') }}
                              to={"/account/dashboard/schedule/" + commonService.replaceChar(menuCondition, false)}
                              className={
                                (matchPath(
                                  this.props.location.pathname,
                                  "/account/dashboard/"
                                )
                                  ? "orangefont "
                                  : "") +
                                "nav-link link-scroll font-book navalign"
                              }
                            >
                              <div className="purplefont">My Beam</div>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link
                              className={
                                (matchPath(
                                  this.props.location.pathname,
                                  "/accounts/basicInformation"
                                )
                                  ? "orangefont "
                                  : "") +
                                "nav-link link-scroll font-book navalign"
                              }
                              to="/accounts/basicInformation"
                            >
                              <div className="purplefont">Account Details</div>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link
                              className="nav-link link-scroll font-book navalign"
                              to=""
                              onClick={this.logoutClick}
                            >
                              <div className="purplefont">Logout</div>
                            </Link>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </React.Fragment>
                )}
                {!this.props.is_auth && (
                  <ul className="navbar-nav ml-auto align-items-start align-items-lg-center">
                    {/* commonService.replaceChar(menuCondition, true).toLowerCase() != constand.CANCER_CONDITION && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.ASTHMA_CONDITION &&
                      <li className="dropdown nav-item">
                        <a
                          className={"dropdown-toggle nav-link link-scroll font-book navalign " + ((headerUrl.indexOf('/list') !== -1) || (headerUrl.indexOf('/programs') !== -1)
                            ? "active"
                            : "")}
                          role="button"
                          aria-expanded="false"
                          aria-haspopup="true"
                          href="#"
                          data-toggle="dropdown"
                        >
                          On-Demand<span className="arrow-std caret"></span>{" "}
                          <i
                            className={
                              "fa  fa-2x pull-right small-arrow " +
                              (this.state.is_menu_open === true
                                ? "fa-angle-down"
                                : "fa-angle-up")
                            }
                            onClick={this.changeDrowndownArrow}
                          ></i>
                        </a>
                        <ul className="dropdown-menu">

                          <li className="nav-item" >
                            <Link
                              className="nav-link link-scroll font-medium navalign"
                              onClick={() => { this.getConditionPopup('/on-demand/') }}
                            >
                              <p className="purplefont capitalize_text m-0">
                                On-demand classes
                              </p>
                            </Link>
                          </li>
                        
                          <li className="nav-item" >
                            <Link
                              className="nav-link link-scroll font-medium navalign"
                              onClick={() => { this.getConditionPopup('/programs/') }}
                            >
                              <p className="purplefont capitalize_text m-0">
                                Programs
                              </p>
                            </Link>

                          </li>
                        </ul>
                      </li>
                     */}
                    {/* (commonService.replaceChar(menuCondition, true).toLowerCase() == constand.CANCER_CONDITION || commonService.replaceChar(menuCondition, true).toLowerCase() == constand.ASTHMA_CONDITION) && */
                      <li className="nav-item">
                        <span
                          className={"pointer nav-link link-scroll font-book navalign " + ((headerUrl.indexOf('/on-demand/') !== -1)
                            ? "active"
                            : "")}
                          onClick={() => { this.getConditionPopup('/on-demand/') }}
                        >
                          On-demand Classes
                        </span>
                      </li>
                    }
                    {constand.CORE_MENU.includes('programs') && this.props.is_menu_has_data &&
                      <li className="nav-item">
                        <span
                          className={"pointer nav-link link-scroll font-book navalign " + ((headerUrl.indexOf('/programs/') !== -1)
                            ? "active"
                            : "")}
                          onClick={() => { this.getConditionPopup('/programs/') }}
                        >
                          Programs
                        </span>
                      </li>
                    }
                    {(commonService.replaceChar(menuCondition, true).toLowerCase() != constand.CANCER_CONDITION && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.POSTNATAL_CONDITION && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.MENO_CONDITION) &&
                      <li className="nav-item">
                        <span
                          onClick={() => { this.changeHeaderClass(); this.getConditionPopup('/liveClasses/') }}

                          className={"pointer nav-link link-scroll font-book navalign " + ((headerUrl.indexOf('/liveClasses') !== -1)
                            ? "active"
                            : "")}
                        >
                          Live Classes
                        </span>
                      </li>
                    }
                    {commonService.replaceChar(menuCondition, true).toLowerCase() != constand.POSTNATAL_CONDITION && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.MENO_CONDITION &&
                      <li className="nav-item">
                        <span
                          onClick={() => { this.changeHeaderClass(); this.getConditionPopup('/groups/') }}
                          className={"pointer nav-link link-scroll font-book navalign " + ((headerUrl.indexOf('/groups') !== -1)
                            ? "active"
                            : "")}
                        >
                          Groups
                        </span>
                      </li>
                    }
                    {constand.CORE_MENU.includes('instructor') &&
                      <li className="nav-item">
                        <span
                          onClick={() => { this.changeHeaderClass(); this.getConditionPopup('/instructor/') }}
                          className={"pointer nav-link link-scroll font-book navalign " + ((headerUrl.indexOf('/instructor/') !== -1)
                            ? "active"
                            : "")}
                        >
                          Instructors
                        </span>
                      </li>
                    }
                    <li className="nav-item">
                      <span
                        onClick={() => { this.changeHeaderClass(); this.getConditionPopup('/blog/') }}
                        className={"pointer nav-link link-scroll font-book navalign " + ((headerUrl.indexOf('/blog/') !== -1)
                          ? "active"
                          : "")}
                      >
                        Blog
                      </span>
                    </li>
                    <li className="dropdown nav-item">
                      <a
                        className={"dropdown-toggle nav-link link-scroll font-book navalign " + (headerUrl.indexOf('/group/about/') === -1 && ((headerUrl.indexOf('/howitworks') !== -1) || (headerUrl.indexOf('/about-us') !== -1) || (headerUrl.indexOf('/about/') !== -1) || (headerUrl.indexOf('/blog/Help') !== -1) || (headerUrl.indexOf('/contact-us') !== -1) || (headerUrl.indexOf('/faq') !== -1))
                          ? "active"
                          : "")}
                        role="button"
                        aria-expanded="false"
                        aria-haspopup="true"
                        href="#"
                        data-toggle="dropdown"
                      >
                        About<span className="arrow-std caret"></span>{" "}
                        <i
                          className={
                            "fa  fa-2x pull-right small-arrow " +
                            (this.state.is_menu_open === true
                              ? "fa-angle-down"
                              : "fa-angle-up")
                          }
                          onClick={this.changeDrowndownArrow}
                        ></i>
                      </a>
                      <ul className="dropdown-menu long-length">

                        <li className="nav-item" >
                          <Link
                            onClick={() => this.savePageUrl("/howitworks")}
                            className="pointer nav-link link-scroll font-medium navalign"
                            to={"/howitworks"}
                          >
                            <p className="purplefont capitalize_text m-0">
                              How it works
                            </p>
                          </Link>

                        </li>

                        <li className="nav-item" >
                          <Link
                            onClick={() => this.savePageUrl("/howitworks/#pricing")}
                            className="pointer nav-link link-scroll font-medium navalign"
                            to={"/howitworks/#pricing"}
                          >
                            <p className="purplefont capitalize_text m-0">
                              Pricing
                            </p>
                          </Link>

                        </li>

                        <li className="nav-item" >
                          <Link
                            onClick={() => this.savePageUrl("/about-us")}
                            className="pointer nav-link link-scroll font-medium navalign"
                            to={"/about-us"}
                          >
                            <p className="purplefont capitalize_text m-0">
                              About us
                            </p>
                          </Link>
                        </li>
                        {commonService.replaceChar(menuCondition, true).toLowerCase() == constand.CONDITION_LIST[0] &&
                          <li className="nav-item" >
                            <Link
                              onClick={() => { this.getConditionPopup('/about/') }}
                              className="pointer nav-link link-scroll font-medium navalign"
                            >
                              <p className="purplefont capitalize_text m-0">

                                About exercise for cystic fibrosis
                              </p>
                            </Link>

                          </li>
                        }
                        <li className="nav-item" >
                          <Link
                            onClick={() => this.savePageUrl("/blog/Help")}
                            className="pointer nav-link link-scroll font-medium navalign"
                            to={"/blog/Help"}
                          >
                            <p className="purplefont capitalize_text m-0">
                              Help
                            </p>
                          </Link>
                        </li>

                        <li className="nav-item" >
                          <Link
                            onClick={() => this.savePageUrl("/contact-us")}
                            className="pointer nav-link link-scroll font-medium navalign"
                            to={"/contact-us"}
                          >
                            <p className="purplefont capitalize_text m-0">
                              Contact
                            </p>
                          </Link>
                        </li>
                        <li className="nav-item" >
                          <Link
                            onClick={() => this.savePageUrl("/faq")}
                            className="pointer nav-link link-scroll font-medium navalign"
                            to={"/faq"}
                          >
                            <p className="purplefont capitalize_text m-0">
                              FAQ
                            </p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    {menuCondition != constand.POSTNATAL_CONDITION && menuCondition != constand.MENO_CONDITION && commonService.replaceChar(menuCondition, true).toLowerCase() != constand.ASTHMA_CONDITION &&
                      <li className="nav-item">
                        <span
                          onClick={() => { this.changeHeaderClass(); this.getConditionPopup('/partnerships/') }}

                          className={"pointer nav-link link-scroll font-book navalign " + ((headerUrl.indexOf('/partnerships/') !== -1)
                            ? "active"
                            : "")}
                        >
                          For clinicians
                        </span>
                      </li>
                    }
                    <li className="nav-item cursor">
                      <span
                        onClick={this.loginClick}
                        className="nav-link navalign font-book  pointer"
                      >
                        Sign In
                      </span>
                    </li>
                    <li className="nav-item trail-btn-show">
                      <span
                        onClick={this.loginClick}
                        className="nav-link navalign font-book  pointer"
                      >
                        Start trial
                      </span>
                    </li>
                  </ul>
                )}
                {!this.props.is_auth && (
                  <div className="navbar-text  trail-btn-hide">
                    <Link
                      to="/register"
                      className="btn navbar-btn btn-shadow font-medium font-14 btn-gradient button-style"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </nav >
          <div className={this.props.warning_banner_text.length > 0 ? "m-t-120" : "m-t-80"}>

            {currentPath != '/home' && Cookies.get('condition') && (Cookies.get('condition').includes(constand.CANCER_CONDITION.split(" ")[0]) || (Cookies.get('condition').includes(constand.KR_CONDITION.split(" ")[0]) && (this.props.IP_Details.countryCode == 'IN' || this.props.IP_Details.countryCode == 'GB')) || ((typeof Cookies.get('condition') == 'undefined' || Cookies.get('condition').includes(constand.CONDITION.split(" ")[0])) && (this.props.IP_Details.countryCode == 'IN' || this.props.IP_Details.countryCode == 'US'))) && (typeof Cookies.get('closeBanner') == 'undefined' || Cookies.get('closeBanner') == 'false' || typeof Cookies.get('closeBannerKD') == 'undefined' || Cookies.get('closeBannerKD') == 'false' || typeof Cookies.get('closeBannerPC') == 'undefined' || Cookies.get('closeBannerPC') == 'false') && (this.props.close_banner == false || this.props.close_banner_kd == false || this.props.close_banner_pc == false) && ((typeof Cookies.get('closeBannerPC') == 'undefined' || Cookies.get('closeBannerPC') == 'false' || this.props.close_banner_pc == false) && (!this.props.location.pathname.includes('Royal Marsden'))) &&
              //web view
              <CffBanner type="web" condition={Cookies.get('condition')} />
            }
            {currentPath != '/home' && Cookies.get('condition') && (Cookies.get('condition').includes(constand.CANCER_CONDITION.split(" ")[0]) || (Cookies.get('condition').includes(constand.KR_CONDITION.split(" ")[0]) && (this.props.IP_Details.countryCode == 'IN' || this.props.IP_Details.countryCode == 'GB')) || ((typeof Cookies.get('condition') == 'undefined' || Cookies.get('condition').includes(constand.CONDITION.split(" ")[0])) && (this.props.IP_Details.countryCode == 'IN' || this.props.IP_Details.countryCode == 'US'))) && (typeof Cookies.get('closeBanner') == 'undefined' || Cookies.get('closeBanner') == 'false' || typeof Cookies.get('closeBannerKD') == 'undefined' || Cookies.get('closeBannerKD') == 'false' || typeof Cookies.get('closeBannerPC') == 'undefined' || Cookies.get('closeBannerPC') == 'false') && (this.props.close_banner == false || this.props.close_banner_kd == false || this.props.close_banner_pc == false) && ((typeof Cookies.get('closeBannerPC') == 'undefined' || Cookies.get('closeBannerPC') == 'false' || this.props.close_banner_pc == false) && (!this.props.location.pathname.includes('Royal Marsden'))) &&
              //mobile view
              <CffBanner type="mobile" condition={Cookies.get('condition')} />
            }
          </div>
        </header>
        <ChallengingModal
          open={this.open}
          location={this.props.location}
          history={this.props.history}
        />
        <LoginComponent
          open={this.open}
          location={this.props.location}
          history={this.props.history}
        />
        <ForgotPasswordComponent
          open={this.open}
          location={this.props.location}
          history={this.props.history}
        />
        <WorkoutSchedulePopup
          location={this.props.location}
          history={this.props.history}
        />

        <Modal
          className="removebbg-popup"
          open={this.state.maintance_model}
          onClose={this.onCloseModal}
          center
        >

          <div
            className="modal-dialog schedule_block welcome-popup common_design modal-width--custom"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header header-styling  border-0">
                <h5
                  className="modal-title1 text-center col-md-12 p-0  font-semibold white-txt"
                  id="exampleModalLabel font-medium"
                >
                  Welcome to Beam!
                </h5>

                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span
                    aria-hidden="true"
                    onClick={() => this.maintance_model_state(false)}
                  >
                    &times;
                  </span>
                </button>
              </div>
              <div className="modal-body pb-0">
                <img
                  className="img-fluid wel-center-img"
                  src={constand.WEB_IMAGES + "welocome_image.png"}
                ></img>

                <p className="font-book black-txt text-center mx-auto w-75 font-15 font-normal">
                  We are super excited to have launched our new brand and
                  platform.
                </p>
                <p className="font-book black-txt text-center mx-auto w-75 font-15 font-normal">
                  If you who knew us before as Pactster get comfy. This is your
                  new home.
                </p>
                <p className="font-book black-txt text-center mx-auto w-75 font-15 font-normal">
                  If you're a completely new user, we're thrilled to have you
                  join us at such an exiting time.
                </p>
                <p className="font-book black-txt text-center mx-auto w-75 font-15 font-normal">
                  Beam Team, let's do this!!
                </p>
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-12">
                      <a
                        className="btn btn-login btn-blue-inverse w-100 mx-auto m-b-10 m-t-20 color-blue font-medium "
                        href="https://beamfeelgood.com/blog/news"
                      >
                        {" "}
                        Read more about the rebrand{" "}
                        {/*{" "}Take me to Pactster{" "}*/}
                      </a>

                      <button
                        className="btn btn-login w-100  mx-auto m-b-30 font-14"
                        onClick={() => this.maintance_model_state(false)}
                      >
                        {/*
                  {" "}
                  Continue{" "}*/}{" "}
                        Continue on Beam{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <ConfirmationPopup
          is_model_open={this.props.is_policy_open}
          type='policy'
          isConfirmation={false}
          isCloseRequired={false}
          title="Hold your horses - our policies have changed!"
          closeConfirmationPopup={(terms) => this.saveUserPolicy(terms)}
          handleCheckboxChange={(e) => this.handleCheckboxChange(e)}
          submitted={this.state.submitted}
          terms={this.state.terms}
        />
        {/* Condition popup */}
        <ConditionalModalComponent
          isModalOpen={this.state.condition_model}
          getConditionPopup={this.getConditionPopup}
          pageUrl={this.state.pageUrl}
          closeConditionModal={this.closeConditionModal}
        />

        {/* Landing popup after signup */}
        <LandingModalComponent
          isModalOpen={this.props.is_new_user && !this.props.init_condition.includes('research')}
          condition={this.props.init_condition}
        />

        {/* kd clininc selection */}
        <ClinicConfirmationPopup
          is_model_open={this.props.is_clinic_model_open}
          title="To continue being able to offer Kidney Beam for free throughout the UK we need to know which renal unit you are associated with. Please choose from the list below..."
        />
      </React.Fragment >
    );
  }
}

const mapStateToProps = state => {
  return {
    is_auth: state.auth.is_auth,
    logged_userData: state.header.logged_userData,
    notification: state.header.notification_data.notification,
    userDetails: state.header.notification_data.userDetails,
    healthcondition_list: state.register.healthcondition_list,
    warning_banner_text: state.register.warning_banner_text,
    init_condition: state.auth.initial_condition,
    menu_condition: state.auth.menu_condition,
    IP_Details: state.accountinfo.ip_data,
    close_banner: state.header.close_banner,
    close_banner_kd: state.header.close_banner_kd,
    is_create_mode: state.header.is_create_mode,
    is_group_mode: state.header.is_group_mode,
    is_group_admin: state.group.is_group_admin,
    is_group_leader: state.group.is_group_leader,
    close_banner_pc: state.header.close_banner_pc,
    explore_conditions: state.accountinfo.explore_conditions,
    beamer_filter: state.header.beamer_filter,
    is_menu_has_data: state.header.is_menu_has_data,
    is_policy_open: state.header.is_policy_open,
    is_new_user: state.register.is_new_user,
    module_data: state.header.module_data,
    url_condition: state.header.url_condition,
    is_clinic_model_open: state.header.is_clinic_model_open,

  };
};

const mapDispatchToProps = {
  loginModelOpen,
  isAuth,
  logout,
  fetchUserDetails,
  start_loader,
  stop_loader,
  updateUserdataRedex,
  setCondition,
  setMenuCondition,
  healthCondition,
  fetchNotifications,
  readNotifications,
  confirmNotifications,
  updateNotification,
  warningBanner,
  changeCMSMode,
  updateUserChallengeTag,
  changeCMSGroupMode,
  getFooter,
  getFeatures,
  fetchConditionRelationships,
  setExploreConditions,
  gotoStep,
  clearRegisterFormUpdate,
  checkMenuData,
  openPolicy,
  savePolicy,
  getCountriesList,
  getCountOfData,
  getFaqContent,
  getURLCondition
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
