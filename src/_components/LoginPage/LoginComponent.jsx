import React from "react";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import FacebookLogin from "react-facebook-login";
import * as constand from "../../constant";
import {
  loginModelOpen,
  forgotModelOpen,
  login,
  logout,
  facebookLogin,
  isAuth,
  start_loader,
  stop_loader,
  fetchUserDetails,
  packsterGotoRegister,
  fetchNotifications,
  updateUserChallengeTag,
  healthCondition,
  getFooter,
  getFeatures,
  setExploreConditions,
  openPolicy,
  openClinic,
  getClinic
} from "../../actions";
import { toast } from "react-toastify";
import { Cookies } from "react-cookie-consent";
import { commonService } from "../../_services";

class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      submitted: false,
      loading: false,
      redirect_open: false,
      error: "",
      isTermPopupOpen: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.loginSubmit = this.loginSubmit.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.closeModel = this.closeModel.bind(this);
    this.facebookResponse = this.facebookResponse.bind(this);
    this.cleatState = this.cleatState.bind(this);
    this.getUserDetail = this.getUserDetail.bind(this);
    this.redirectCloseModel = this.redirectCloseModel.bind(this);
    this.redirectOpenModel = this.redirectOpenModel.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.openClinicPopup = this.openClinicPopup.bind(this);
  }

  facebookResponse = e => {

    //console.log('loinfb',e)
    //this.props.facebookLogin(e);
    this.props.facebookLogin(e).then(
      response => {
        if (response.isPactsterUser && response.userid) //pacsterUsers
        {
          this.closeModel();
          this.setState({ error: "", loading: false, redirect_open: true });
          var userid = response.userid;
          var membershipObj = response.membership;
          this.props.packsterGotoRegister(userid, membershipObj, e);
          const { from } = { from: { pathname: "/register" } };
          this.props.history.push(from);
        } else { //newUsers
          this.props.isAuth();
          this.closeModel();
          toast.success(response.message);
          this.getUserDetail();
        }
      },
      error => {
        this.closeModel();
        toast.error(error);
      }
    );
  };
  handleChange(
    e //for twoway binding
  ) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }
  cleatState() {
    this.setState({
      username: "",
      password: "",
      submitted: false,
      loading: false,
      error: ""
    });
  }

  onCloseModal() { }

  forgotPassword() {
    this.props.loginModelOpen(false);
    this.props.forgotModelOpen(true);
  }

  closeModel() { //for close the login model
    this.cleatState();
    this.props.loginModelOpen(false);
  }

  redirectOpenModel() { //redirect model open
    this.setState({ redirect_open: true });
  }

  redirectCloseModel() { //redirect close model
    this.setState({ redirect_open: false });
  }

  loginSubmit(e) { //for submit login
    e.preventDefault();
    this.setState({ submitted: true });
    const { username, password } = this.state;

    // stop here if form is invalid
    if (!(username && password)) {
      return;
    }

    this.setState({ loading: true });
    let email = username;
    this.props.login(email, password).then(
      response => {
        if (response.isPactsterUser && response.userid) //pacsterUsers
        {
          this.closeModel();
          this.setState({ error: "", loading: false, redirect_open: true });
          var userid = response.userid;
          var membershipObj = response.membership;
          this.props.packsterGotoRegister(userid, membershipObj);
          const { from } = { from: { pathname: "/register" } };
          this.props.history.push(from);
        } else { //newUsers
          this.setState({ error: "" });
          this.props.isAuth();
          this.closeModel();
          toast.success(response.message);
          this.getUserDetail();

        }
      },
      error => {
        this.setState({ error: error, loading: false });
      }
    );
  }

  getUserDetail() {
    //this.props.history.push(from);
    this.props.start_loader();
    this.props.fetchUserDetails().then(
      response => {
        this.props.healthCondition();
        this.props.fetchNotifications();
        this.props.setExploreConditions(this.props.logged_userData.UserConditions, this.props.healthcondition_list)
        //open kidney clinic popup when login first time
        var kd_condition = this.props.logged_userData.UserConditions && this.props.logged_userData.UserConditions.find(element => element.Tag && element.Tag.tag == constand.KR_CONDITION);
        var countryId = this.props.logged_userData.Country && this.props.logged_userData.Country.id
        this.openClinicPopup(kd_condition, countryId);

        this.props.stop_loader();
        if (this.props.init_condition) {
          if (this.props.logged_userData.isStudyUser) {
            var community = this.props.logged_userData.Members.length ? this.props.logged_userData.Members[0].Community.community_name : '';
            var pathname_data = community ? '/group/feed/' + community + '/' + this.props.init_condition : '/groups/' + this.props.init_condition;
          } else {
            var url = ((this.props.logged_userData.isGroupLeader || this.props.logged_userData.isStudyLeader || this.props.logged_userData.isStudyInstructor) && constand.SL_MENU.includes('on-demand')) ? '/on-demand/' : '/liveClasses/';
            var pathname_data = url + this.props.init_condition
          }
          this.props.getFooter(commonService.replaceChar(this.props.init_condition, true))
          this.props.getFeatures();
          const { from } = { from: { pathname: pathname_data } };
          this.props.history.push(from);

          setTimeout(() => {
            var temp = commonService.returnTagName('condition', constand.CONDITION, this.props.logged_userData.UserConditions);
            if (localStorage.getItem('beamchallenging') && this.props.is_auth && temp) {
              this.props.updateUserChallengeTag();
            }
          }, 1000)
          //open policy popup
          if (!this.props.logged_userData.terms) {
            this.props.openPolicy(true);
          }
        }
      },
      error => {
        this.props.stop_loader();
        toast.error(error);
      }
    );
  }
//kd clinic popup open
  async openClinicPopup(kd_condition, countryId) {
    if (kd_condition && kd_condition.conditionId)
      await this.props.getClinic(countryId, kd_condition.conditionId);
    if (!this.props.logged_userData.isClinicResponse && kd_condition && !kd_condition.clinicId && this.props.clinic_list && this.props.clinic_list.length > 0) {
      //get clinic for Kidney popup
      this.props.openClinic(true);
    }
  }

  render() {
    const { username, password, submitted, loading, error } = this.state;
    return (
      <React.Fragment>
        <Modal
          className="removebbg-popup"
          open={this.props.is_model_open && !this.props.is_auth}
          onClose={this.onCloseModal}
          center
        >
          <div className="modal-dialog modal-width--custom m-t-80" role="document">
            <div className="modal-content">
              <div className="modal-header header-styling  border-0">
                <h5
                  className="modal-title text-center col-md-11 p-0 font-semibold"
                  id="exampleModalLabel font-medium"
                >
                  Login to Beam
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true" onClick={this.closeModel}>
                    &times;
                  </span>
                </button>
              </div>
              <div className="modal-body body-padding--value pb-0">
                <form name="login" onSubmit={this.loginSubmit}>
                  <div
                    className={
                      "form-group" +
                      (submitted && !username ? " has-error" : "")
                    }
                  >
                    <label
                      htmlFor="exampleInputEmail1"
                      className="font-14 font-qregular black-txt"
                    >
                      Username or Email
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      aria-describedby="emailHelp"
                      placeholder=""
                      name="username"
                      value={username}
                      onChange={this.handleChange}
                    />
                    {submitted && !username && (
                      <div className="text-danger">Username is required</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="exampleInputEmail1"
                      className="font-14 font-qregular black-txt"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      aria-describedby="emailHelp"
                      placeholder=""
                      name="password"
                      value={password}
                      onChange={this.handleChange}
                    />
                    {submitted && !password && (
                      <div className="text-danger">Password is required</div>
                    )}
                  </div>
                  <div className="text-center form-group">
                    {error && <span className="text-danger">{error}</span>}
                  </div>
                  <div className="text-center form-group m-t-20 m-b-20">
                    <span className="col-md-12 p-0 text-underline pointer font-14 font-qregular black-txt">
                      <u onClick={this.forgotPassword}>I forgot my password</u>
                    </span>
                  </div>
                  <div className="col-md-12 text-center p-0">
                    <button
                      disabled={loading}
                      type="submit"
                      className=" btn btn-block mybtn btn-login tx-tfm font-book font-14"
                    >
                      Login
                    </button>
                  </div>

                  <div className="col-md-12 ">
                    <div className="login-or text-center">
                      <span className="span-or text-uppercase">or</span>
                    </div>
                  </div>
                  <div className="col-md-12 mb-3 p-0">
                    <p className="text-center">
                      <FacebookLogin
                        appId={constand.FACEBOOK_APP_KEY}
                        disableMobileRedirect={true}
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={this.facebookResponse}
                        cssClass="google btn btn-lg btn-facebook font-book font-14 mybtn"
                        icon="fa fa-facebook-square"
                      />
                    </p>
                  </div>

                  <div className="form-group">
                    <p className="text-center signup-here font-qmedium font-14 m-b-30">
                      Not got an account?{" "}
                      <Link
                        to="/register"
                        className="signup-here--text font-qmedium font-14"
                        id="signup"
                      >
                        Sign up here
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          className="removebbg-popup"
          open={this.state.redirect_open}
          onClose={this.onCloseModal}
          center
        >
          <div
            className="modal-dialog schedule_block start-popup common_design modal-width--custom"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header header-styling  border-0">
                <h5
                  className="modal-title1 text-center col-md-12 p-0  font-semibold  white-txt"
                  id="exampleModalLabel "
                >
                  Hold your horses
                </h5>

                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true" onClick={this.redirectCloseModel}>
                    &times;
                  </span>
                </button>
              </div>
              <div className="modal-body pb-0">
                <h5 className="pop-sub-head black-txt text-center font-15 m-t-20 font-normal font-book m-b-20 ">
                  Welcome to Beam!
                </h5>
                <p className="font-book black-txt text-center mx-auto w-75 font-15 font-normal">
                  We are super excited to have launched our new website but
                  we're still working on migrating your info across from
                  Pactster's website.
                </p>
                <br />
                <p className="font-book black-txt text-center mx-auto w-75 font-15 font-normal">
                  In the meantime feel free to take a look around our new site
                  but to log in and use your account we're going to have to ask
                  you to continue to use Pactster.
                </p>
                <br />
                <p className="font-book black-txt text-center mx-auto w-75 font-15 font-normal">
                  We'll be in touch as soon as we're all sorted here to invite
                  you to start using Beam.
                </p>
                <a
                  className="btn btn-login popup-btn w-75 mx-auto m-t-20 m-b-20"
                  href={constand.LOGIN_REDIRECTION_URL}
                >
                  {" "}
                  Take me back to Pactster{" "}
                </a>
              </div>
            </div>
          </div>
        </Modal>

      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    is_auth: state.auth.is_auth,
    is_model_open: state.header.is_loginModelOpen,
    init_condition: state.auth.initial_condition,
    logged_userData: state.header.logged_userData,
    healthcondition_list: state.register.healthcondition_list,
    clinic_list: state.register.clinic_list,

  };
};

const mapDispatchToProps = {
  loginModelOpen,
  forgotModelOpen,
  login,
  logout,
  isAuth,
  facebookLogin,
  start_loader,
  stop_loader,
  fetchUserDetails,
  packsterGotoRegister,
  fetchNotifications,
  updateUserChallengeTag,
  healthCondition,
  getFooter,
  getFeatures,
  setExploreConditions,
  openPolicy,
  openClinic,
  getClinic
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);
