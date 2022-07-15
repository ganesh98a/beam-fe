import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import * as Errors from "../../Errors";
import {
  start_loader,
  stop_loader,
  cancelSubscription,
  get_membership,
  fetchMembershipPlans,
  changePlan,
  updateUserdataRedex,
  getPromocodePaln,
  isUserSubscribed,
  fetchUserDetails,
  getLicenseList,
  registerformUpdate,
  getPlanByCountry,
  setConditionIndex,
  setStep
} from "../../actions";
import { commonService } from "../../_services";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Modal from "react-responsive-modal";
import Slider from "react-slick";
import * as constand from "../../constant";
import { Helmet } from "react-helmet";
import OnboardMembershipComponent from "../Common/OnboardMembershipComponent";
import { Cookies } from "react-cookie-consent";
import PaymentComponent from "../Common/PaymentComponent";
import ConditionOnboardingComponent from "./ConditionOnboardingComponent";
import NoThanksModal from "../Common/NoThanksModal";

let valid = require("card-validator");

class AccountMembershipComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      membershipData: {},
      ismodel_open: false,
      promo_ismodel_open: false,
      membership_plans: [],
      promocode: "",
      membership_step: 1,
      payment_data: {},
      planData: {},
      card_view_count: 3,
      showMemberButton: false,
      is_onboard_membership_open: false,
      health_conditionId: 0,
      condition_name: '',
      isUpgradeClicked: false,
      countryPlans: [],
      condition: '',
      isLoading: false,
      isConditionModalOpen: false,
      isFreeTrial: false,
      isNoThanksModal: false
    };
    this.get_membership = this.get_membership.bind(this);
    this.closeModel = this.closeModel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.promocodeSubmit = this.promocodeSubmit.bind(this);
    //this.updatePaymentData = this.updatePaymentData.bind(this);
    this.submitPayment = this.submitPayment.bind(this);
    //this.handlePaymentChange = this.handlePaymentChange.bind(this);
    //this.numberOnly = this.numberOnly.bind(this);
    //this.expiremonthValid = this.expiremonthValid.bind(this);
    //this.expireyearValid = this.expireyearValid.bind(this);
    this.paymentPrevStep = this.paymentPrevStep.bind(this);
    this.renderRSMembership = this.renderRSMembership.bind(this);
    this.renderCoreMembership = this.renderCoreMembership.bind(this);
    this.checkMembershipCases = this.checkMembershipCases.bind(this);
    this.submitMembershipData = this.submitMembershipData.bind(this);
  }

  componentDidMount() {
    this.get_membership();
    let authData = JSON.parse(localStorage.getItem('userDetails')) || this.props.logged_userData;
    this.props.getLicenseList();
    this.props.getPlanByCountry(authData.country).then(response => {
      this.setState({ countryPlans: response.plans })
    });

    var getQueryString = window.location.search;
    if (getQueryString && getQueryString.indexOf('member') !== -1) {
      this.fetchPlans()
    }
    this.props.registerFormValues.userid = authData.id;
    this.props.registerFormValues.firstname = authData.name;
    this.props.registerFormValues.age = commonService.calculateAge(moment(authData.dob).format("DD-MM-YYYY"));
    this.props.registerFormValues.health_condition = authData.UserConditions;
    this.props.registerFormValues.country = authData.country;
    this.props.registerFormValues.region = authData.region;
    this.props.registerFormValues.condition_professions = authData.UserConditions;
    this.props.registerformUpdate(this.props.registerFormValues);

    var condition = Cookies.get('condition') ? Cookies.get('condition') : '';
    this.setState({ condition })

    this.props.setConditionIndex(0);
    this.props.setStep(11);
  }

  get_membership() {
    this.props.start_loader();
    this.setState({ isLoading: true })
    this.props.get_membership().then(
      response => {
        console.log('response', response)
        this.props.stop_loader();
        this.setState({ promocode: '', membershipData: response.data ? response.data : {}, isLoading: false });
      },
      error => {
        this.props.stop_loader();
        toast.error(error);
      }
    );
  }

  cancelSubscription(type) {
    this.props.start_loader();
    this.props.cancelSubscription({ isMemberCondition: type, currentPlanId: this.state.currentPlanId, conditionName: this.state.conditionName }).then(
      response => {
        this.props.stop_loader();
        this.get_membership();
        this.getUserDetail();
        toast.success(response.message);
      },
      error => {
        this.props.stop_loader();
        toast.error(error);
      }
    );
  }

  getUserDetail() {
    this.props.fetchUserDetails().then(
      response => {
      },
      error => {
      }
    );
  }

  /**
   *  fetch Plans
   */
  fetchPlans() {
    let local_country = (this.props.IP_Details && this.props.IP_Details.countryCode) ? this.props.IP_Details.countryCode : '';
    if (!this.state.fetchLoader) {
      this.setState({ fetchLoader: true });
      var code =
        this.props.logged_userData.membershipData &&
          this.props.logged_userData.membershipData.countryCode
          ? this.props.logged_userData.membershipData.countryCode
          : local_country;
      this.props.fetchMembershipPlans(code).then(
        response => {
          if (response) {
            this.setState({
              membership_plans: response.plans,
              fetchLoader: false,
              ismodel_open: true
            });
          }
        },
        error => {
          this.setState({
            ismodel_open: false, fetchLoader: false
          });
          toast.error(error);
        }
      );
    }
  }

  _helpContent() {
    return (
      <div>
        {!this.state.condition.toLowerCase().includes('research') &&
          <p className="font-qregular font-14 balck-txt m-t-10">
            Question? Check out our{" "}
            <a href="javascript:void(0)" className=" font-14 orangefont">
              <u>FAQ</u>
            </a>{" "}
            or{" "}
            <Link to="/contact-us" className="font-14 orangefont">
              <u>Contact Us</u>
            </Link>
          </p>
        }
      </div>
    );
  }

  renderCondtion1() {
    /* const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds)).format(
          "Do MMMM YYYY"
        )
        : ""; */
    const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds.replace(/-/g, '\/').replace(/T.+/, ''))).format(
          "Do MMMM YYYY"
        )
        : "";
    return (
      <div>
        <p className="font-medium black-txt font-21 member-txt m-t-10">
          Membership Plan
        </p>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12 clearfix p-l-0">
              <div className="card-body font-qmedium black-txt font-16 text-left p-l-0 m-b-10">
                <p>
                  You do not currently have a membership to Beam. Your free
                  access ended on{" "}
                  <span className="font-semibold font-16 black-txt">
                    {trialEnds}.
                  </span>
                </p>{" "}
                The Cystic Fibrosis Trust no longer provides free access to Beam
                automatically but don't fret - you can apply for a health and
                wellbeing grant{" "}
                <a
                  target="_blank"
                  href="https://www.cysticfibrosis.org.uk/the-work-we-do/support-available/financial-support/grants/health-and-wellbeing-grants"
                >
                  https://www.cysticfibrosis.org.uk/the-work-we-do/support-available/financial-support/grants/health-and-wellbeing-grants
                </a>
                &nbsp;from them to cover your membership.
              </div>
              {this._membershipButton("BECOME A MEMBER")}
              {this._helpContent()}
            </div>
            <div className="col-md-7"></div>
          </div>
        </div>
      </div>
    );
  }

  renderCondtion2() {
    /* const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds)).format(
          "Do MMMM YYYY"
        )
        : ""; */
    const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds.replace(/-/g, '\/').replace(/T.+/, ''))).format(
          "Do MMMM YYYY"
        )
        : "";
    return (
      <div>
        <p className="font-medium black-txt font-21 member-txt m-t-10">
          Your Membership Plan
        </p>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12 clearfix p-l-0">
              <div className="card-body  text-left  font-qmedium font-16 black-txt p-l-0">
                The membership plan below has been provided to you free of
                charge courtesy of the Cystic Fibrosis Trust in the UK. Your
                membership is due to end on{" "}
                <span className="font-semibold font-16 black-txt">
                  {trialEnds}.
                </span>
              </div>
              {this.returnBoxdata()}
              {this._membershipButton("Change Plan")}
              {this._helpContent()}
            </div>
            <div className="col-md-7"></div>
          </div>
        </div>
      </div>
    );
  }

  renderCondtion3() {
    /* const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds)).format(
          "Do MMMM YYYY"
        )
        : ""; */
    const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds.replace(/-/g, '\/').replace(/T.+/, ''))).format(
          "Do MMMM YYYY"
        )
        : "";
    return (
      <div>
        <p className="font-medium black-txt font-21 member-txt m-t-10">
          Membership Plan
        </p>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12 clearfix p-l-0">
              <div className="card-body  text-left  font-qmedium font-16 black-txt p-l-0">
                You do not currently have a membership to Beam. Your free access
                ended on{" "}
                <span className="font-semibold font-16 black-txt">
                  {" "}
                  {trialEnds}.
                </span>
              </div>
              {this._membershipButton("BECOME A MEMBER")}
              {this._helpContent()}
            </div>
            <div className="col-md-7"></div>
          </div>
        </div>
      </div>
    );
  }

  renderCondtion4() {
    /* const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds)).format(
          "Do MMMM YYYY"
        )
        : ""; */
    const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds.replace(/-/g, '\/').replace(/T.+/, ''))).format(
          "Do MMMM YYYY"
        )
        : "";
    return (
      <div>
        <p className="font-medium black-txt font-21 member-txt m-t-10">
          Your Membership Plan
        </p>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12 clearfix p-l-0">
              <div className="card-body  text-left  font-qmedium font-16 black-txt p-l-0">
                Your free membership is due to end on
                <span className="font-semibold font-16 black-txt">
                  {" "}
                  {trialEnds}.
                </span>
              </div>
              {this.returnBoxdata()}
              {this._membershipButton("Change Plan")}
              {this._helpContent()}
            </div>
            <div className="col-md-7"></div>
          </div>
        </div>
      </div>
    );
  }

  returnBoxdata() {
    const planData =
      this.state.membershipData.plan && this.state.membershipData.plan.Plan
        ? this.state.membershipData.plan.Plan
        : {};
    return (
      <div>
        {!this.state.condition.toLowerCase().includes('research') &&
          <div className="card mb-4 col-lg-6">
            <div className="card-body  text-center">
              <h5 className="card-title  black-txt font-semibold font-21 text-uppercase text-center">
                {planData.name}
              </h5>
              <h5 className="card-price text-center font-21 font-semibold purplefont">
                {constand.Currency_Symbol[planData.currency] || planData.currency} {planData.amount}
                <span className="period"> per {planData.interval}</span>
              </h5>

              <p className="medium-text text-center m-t-20 abbey-txt font-14 font-qregular">
                {/* {planData.description} */}
                Access to library of condition specific on demand exercise videos
              </p>
              <hr className="w-75 mr-auto ml-auto" />
              <p className="medium-text text-center abbey-txt font-14 font-qregular">
                Access to groups
              </p>
              <hr className="w-75 mr-auto ml-auto" />
              {/* <p className="medium-text text-center abbey-txt font-14 font-qregular">
            Access to {planData.credits} live exercise classes per month
          </p> */}
              <p className="medium-text text-center abbey-txt font-14 font-qregular">
                Access to all live exercise classes
              </p>
            </div>
          </div>
        }
      </div>
    );
  }

  renderCondtion6() {
    const planData =
      this.state.membershipData.plan && this.state.membershipData.plan.Plan
        ? this.state.membershipData.plan.Plan
        : {};
    const diffDates = this.state.membershipData.cycleDaysLeft;
    /* const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds)).format(
          "Do MMMM YYYY"
        )
        : ""; */
    const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds.replace(/-/g, '\/').replace(/T.+/, ''))).format(
          "Do MMMM YYYY"
        )
        : "";
    return (
      <div>
        <p className="font-medium black-txt font-21 member-txt m-t-10">
          Your Membership Plan
        </p>
        <div className="col-md-12">
          <div className="row">
            {!this.state.condition.toLowerCase().includes('research') &&
              <div className="col-md-5 p-l-0">
                <p className="font-semibold font-15 black-txt">
                  Your current cycle
                </p>
                <p className="font-semibold font-15 black-txt">
                  {diffDates} days{" "}
                  <span className="font-qregular font-15 black-txt">
                    left in current cycle
                  </span>
                </p>
              </div>
            }
            {/* <div className="col-md-7 p-l-0">
              <p className="font-semibold font-15 black-txt">
                Your live classes remaining
              </p>
              <p className="font-semibold font-15 black-txt">
                {this.state.membershipData.usedCredits} of {planData.credits}{" "}
                <span className="font-qregular font-15 black-txt">
                  live classes remaining
                </span>
              </p>
            </div> */}
          </div>
          <div className="row">
            <div className="col-md-12 clearfix p-l-0">
              {/* <p className=" text-left  font-qmedium font-16 black-txt ">
                Your free membership is due to end on{" "}
                <span className="font-semibold font-16 black-txt">
                  {" "}
                  {trialEnds}.
                </span>
              </p> */}
              {this.returnBoxdata()}
              {this._membershipButton("Change Plan")}
              <a
                href="javascript:void(0)"
                className="grey-text font-14 font-qregular"
                onClick={() => this.cancelSubscription(false)}
              >
                <u>Cancel membership or take a break</u>
              </a>
              {this._helpContent()}
            </div>
            <div className="col-md-7"></div>
          </div>
          {/* <div className="row ">
            <div className="col-lg-12 col-md-12 col-sm-12 m-b-10 m-t-20 p-l-0">
              <p className="font-medium font-21 black-txt m-t-10">
                {" "}
                Billing Details
              </p>
              <div className="row m-b-20">
                <div className="col-md-5">
                  <p className="font-semibold font-15 ">Current Card</p>
                  <p className="font-qregular font-14">
                    {" "}
                    Benjamin browning
                    <br />
                    38 Turner street
                    <br />
                    Expires 08/22
                  </p>
                </div>
                <div className="col-md-7">
                  <p className="font-semibold font-15">Billing Address</p>
                  <p className="font-qregular font-14">
                    {" "}
                    Benjamin browning
                    <br />
                    38 Turner street
                    <br />
                    Expires 08/22
                  </p>
                </div>
              </div>
              <button className="btn btn-purple-inverse font-14 font-medium save-btn">
                Update billing details
              </button>
            </div>
          </div> */}
        </div>
      </div>
    );
  }

  renderCondtion7() {
    /* const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds)).format(
          "Do MMMM YYYY"
        )
        : ""; */
    const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds.replace(/-/g, '\/').replace(/T.+/, ''))).format(
          "Do MMMM YYYY"
        )
        : "";
    return (
      <div>
        <p className="font-medium black-txt font-21 member-txt m-t-10">
          Membership Plan
        </p>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12 clearfix p-l-0">
              <div className="card-body  text-left font-16 font-qmedium m-b-10 p-l-0">
                You do not currently have a membership to Beam.  Your free access,  courtesy of the Cystic Fibrosis Foundation, ended on{" "}
                <span className="font-semibold font-16 black-txt">
                  {trialEnds}.
                </span>
              </div>
              {this._membershipButton("BECOME A MEMBER")}
              {this._helpContent()}
            </div>
            <div className="col-md-7"></div>
          </div>
        </div>
      </div>
    );
  }

  renderCondtion8() {
    const planData =
      this.state.membershipData.plan && this.state.membershipData.plan.Plan
        ? this.state.membershipData.plan.Plan
        : {};
    const diffDates = this.state.membershipData.cycleDaysLeft;

    /* const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds)).format(
          "Do MMMM YYYY"
        )
        : ""; */
    const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds.replace(/-/g, '\/').replace(/T.+/, ''))).format(
          "Do MMMM YYYY"
        )
        : "";

    return (
      <div>
        <p className="font-medium black-txt font-21 member-txt m-t-10">
          Your Membership Plan
        </p>
        <div className="col-md-12">
          <div className="row">
            {!this.state.condition.toLowerCase().includes('research') &&
              <div className="col-md-5 p-l-0">
                <p className="font-semibold font-15 black-txt">
                  Your current cycle
                </p>
                <p className="font-semibold font-15 black-txt">
                  {diffDates} days{" "}
                  <span className="font-qregular font-15 black-txt">
                    in current cycle
                  </span>
                </p>
              </div>
            }
            {/* <div className="col-md-7 p-l-0">
              <p className="font-semibold font-15 black-txt">
                Your live classes remaining
              </p>
              <p className="font-semibold font-15 black-txt">
                {this.state.membershipData.usedCredits} of {planData.credits}{" "}
                <span className="font-qregular font-15 black-txt">
                  live classes remaining
                </span>
              </p>
            </div> */}
          </div>
          <div className="row">
            <div className="col-md-12 clearfix p-l-0">
              <p className="clearfix text-left font-16 font-qmedium m-b-20 p-l-0">
                {" "}
                The membership plan below has been provided to you free of
                charge courtesy of the Cystic Fibrosis Foundation. Your
                membership is due to end on{" "}
                <span className="font-semibold font-16 black-txt">
                  {trialEnds}.
                </span>
              </p>
              {this.returnBoxdata()}
              {this._membershipButton("Change Plan")}
              <a
                href="javascript:void(0)"
                className="grey-text font-14 font-qregular"
                onClick={() => this.cancelSubscription(false)}
              >
                <u>Cancel membership or take a break</u>
              </a>
              {this._helpContent()}
            </div>
            <div className="col-md-7"></div>
          </div>
        </div>
      </div>
    );
  }

  renderCondtion9() {
    /* const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds)).format(
          "Do MMMM YYYY"
        )
        : ""; */
    const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds.replace(/-/g, '\/').replace(/T.+/, ''))).format(
          "Do MMMM YYYY"
        )
        : "";
    return (
      <div>
        <p className="font-medium black-txt font-21 member-txt m-t-10">
          Membership Plan
        </p>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12 clearfix p-l-0">
              <div className="card-body  text-left font-16 font-qmedium m-b-10 p-l-0">
                You do not currently have a membership to Beam. Your free
                access, courtesy of Beam, ended on{" "}
                <span className="font-semibold font-16 black-txt">
                  {trialEnds}.
                </span>
              </div>
              {this._membershipButton("BECOME A MEMBER")}
              {this._helpContent()}
            </div>
            <div className="col-md-7"></div>
          </div>
        </div>
      </div>
    );
  }

  renderCondtion10() {
    const planData =
      this.state.membershipData.plan && this.state.membershipData.plan.Plan
        ? this.state.membershipData.plan.Plan
        : {};
    const diffDates = this.state.membershipData.cycleDaysLeft;
    /* const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds)).format(
          "Do MMMM YYYY"
        )
        : ""; */
    const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds.replace(/-/g, '\/').replace(/T.+/, ''))).format(
          "Do MMMM YYYY"
        )
        : "";
    return (
      <div>
        <p className="font-medium black-txt font-21 member-txt m-t-10">
          Your Membership Plan
        </p>
        <div className="col-md-12">
          <div className="row">
            {!this.state.condition.toLowerCase().includes('research') &&
              <div className="col-md-5 p-l-0">
                <p className="font-semibold font-15 black-txt">
                  Your current cycle
                </p>
                <p className="font-semibold font-15 black-txt">
                  {diffDates} days{" "}
                  <span className="font-qregular font-15 black-txt">
                    left in current cycle
                  </span>
                </p>
              </div>
            }
            {/* <div className="col-md-7 p-l-0">
              <p className="font-semibold font-15 black-txt">
                Your live classes remaining
              </p>
              <p className="font-semibold font-15 black-txt">
                {this.state.membershipData.usedCredits} of {planData.credits}{" "}
                <span className="font-qregular font-15 black-txt">
                  live classes remaining
                </span>
              </p>
            </div> */}
          </div>
          <div className="row">
            <div className="col-md-12 clearfix p-l-0">
              <p className=" text-left  font-qmedium font-16 black-txt ">
                The membership plan below has been provided to you free of
                charge courtesy of Beam. Your membership is due to end on{" "}
                <span className="font-semibold font-16 black-txt">
                  {" "}
                  {trialEnds}.
                </span>
              </p>
              {this.returnBoxdata()}
              {this._membershipButton("Change Plan")}
              {this._helpContent()}
            </div>
            <div className="col-md-7"></div>
          </div>
        </div>
      </div>
    );
  }

  renderCondtion11() {
    return (
      <div>
        <p className="font-medium black-txt font-21 member-txt m-t-10">
          Membership Plan
        </p>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12 clearfix p-l-0">
              <div className="card-body  text-left font-16 font-qmedium m-b-10 p-l-0">
                You do not currently have a membership to Beam.
              </div>
              {this._membershipButton("BECOME A MEMBER")}
              {this._helpContent()}
            </div>
            <div className="col-md-7"></div>
          </div>
        </div>
      </div>
    );
  }
  renderCondtion12() {
    return (
      <div>
        <p className="font-medium black-txt font-21 member-txt m-t-10">
          Membership Plan
        </p>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12 clearfix p-l-0">
              <div className="card-body  text-left font-16 font-qmedium m-b-10 p-l-0">
                You do not currently have a membership to Beam but you’re yet to cash in on your 2 week free trial. To do so, head over to our mobile app.
              </div>
              {this._membershipButton("BECOME A MEMBER")}
              {this._helpContent()}
            </div>
            <div className="col-md-7"></div>
          </div>
        </div>
      </div>
    );
  }
  renderCondtion13() {

    const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds.replace(/-/g, '\/').replace(/T.+/, ''))).format(
          "Do MMMM YYYY"
        )
        : "";
    return (
      <div>
        <p className="font-medium black-txt font-21 member-txt m-t-10">
          Your Membership Plan
        </p>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-5 p-l-0">
            </div>

          </div>
          <div className="row">
            <div className="col-md-12 clearfix p-l-0">
              <p className=" text-left  font-qmedium font-16 black-txt ">
                The membership plan below has been provided to you free of charge courtesy of Cystic Fibrosis Ireland. Your membership is due to end on{" "}
                <span className="font-semibold font-16 black-txt">
                  {" "}
                  {trialEnds}.
                </span>
              </p>
              {this.returnBoxdata()}
              {this._membershipButton("Change Plan")}
              {this._helpContent()}
            </div>
            <div className="col-md-7"></div>
          </div>
        </div>
      </div>
    );
  }
  renderCondtion15() {

    const trialEnds =
      this.state.membershipData.plan && this.state.membershipData.plan.trialEnds
        ? moment(new Date(this.state.membershipData.plan.trialEnds.replace(/-/g, '\/').replace(/T.+/, ''))).format(
          "Do MMMM YYYY"
        )
        : "";
    return (
      <div>
        <p className="font-medium black-txt font-21 member-txt m-t-10">
          Your Membership Plan
        </p>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-5 p-l-0">
            </div>

          </div>
          <div className="row">
            <div className="col-md-12 clearfix p-l-0">
              <p className=" text-left  font-qmedium font-16 black-txt ">
                The membership plan below has been provided to you free of charge courtesy of Kidney Research UK. Your membership is due to end on {" "}
                <span className="font-semibold font-16 black-txt">
                  {" "}
                  {trialEnds}.
                </span>
              </p>
              {this.returnBoxdata()}
              {this._membershipButton("Change Plan")}
              {this._helpContent()}
            </div>
            <div className="col-md-7"></div>
          </div>
        </div>
      </div>
    );
  }
  _membershipButton(freeText) {
    return (
      <div>
        {!this.state.condition.toLowerCase().includes('research') &&
          <div className="clearfix m-b-30 col-lg-6 p-0">
            <button
              className="btn btn-purple-inverse font-medium font-14 save-btn w-100"
              onClick={() => this.fetchPlans()}
            >
              {freeText}
            </button>
          </div>
        }
      </div>
    );
  }

  onCloseModal() { }

  closeModel() {
    //for close the login model
    this.setState({ ismodel_open: false, promo_ismodel_open: false, is_onboard_membership_open: false, isUpgradeClicked: false, isConditionModalOpen: false });
  }

  startTrail(plan, type, membershipData = {}) {
    //submission of both promo and membership plan
    var planData = {
      planId: plan.id,
      type: type
    };
    if (type === 'change_plan') {
      const paymentData = this.state.payment_data;
      var cur_month = new Date().getMonth();
      let cur_year = new Date().getFullYear();
      /* if (new Date(paymentData.card_exp_year + '-' + paymentData.card_exp_month + '-01') < new Date(cur_year + '-' + cur_month + '-01')) {
        console.log('Erros')
        this.setState({ payment_data: { ...this.state.payment_data, invalid_expiration: true } });
        return;
      } */

      planData.card_name = paymentData.card_name;
      planData.number = paymentData.card_number;
      planData.exp_month = paymentData.card_exp_month;
      planData.exp_year = paymentData.card_exp_year;
      planData.cvc = paymentData.card_security_code;
      planData.card_zipcode = paymentData.card_zipcode;
    }

    if (type === 'promo') {
      planData.promocode = this.state.promocode;
      planData.planId = this.state.promocode;
    }

    if (Object.keys(membershipData).length) {
      planData.isMemberCondition = true;
      planData.membershipData = membershipData;
    }

    this.props.start_loader();
    this.closeModel();
    //this.setState({ isUpgradeClicked: false })


    this.props.changePlan(planData).then(
      response => {
        this.setState({ membership_step: 1, payment_data: {} });
        this.get_membership();
        this.getUserDetail();
        toast.success(response.message);
        this.props.registerFormValues.condition_membership = [];
        this.props.registerformUpdate(this.props.registerFormValues);
      },
      error => {
        this.props.stop_loader();
        toast.error(error);
        this.props.registerFormValues.condition_membership = [];
        this.props.registerformUpdate(this.props.registerFormValues);
      }
    );
  }

  mainRender() {
    var renderHtml;
    console.log('this.state.membershipData.accounttype', this.state.membershipData.accounttype)
    switch (this.state.membershipData.accounttype) {
      case 1:
        renderHtml = this.renderCondtion1();
        break;
      case 2:
        renderHtml = this.renderCondtion2();
        break;
      case 3:
        renderHtml = this.renderCondtion3();
        break;
      case 4:
        renderHtml = this.renderCondtion4();
        break;
      case 5:
        //renderHtml = this.renderCondtion5();
        renderHtml = this.renderCondtion6();
        break;
      case 6:
        renderHtml = this.renderCondtion6();
        break;
      case 7:
        renderHtml = this.renderCondtion7();
        break;
      case 8:
        renderHtml = this.renderCondtion8();
        break;
      case 9:
        renderHtml = this.renderCondtion9();
        break;
      case 10:
        renderHtml = this.renderCondtion10();
        break;
      case 11:
        renderHtml = this.renderCondtion11();
        break;
      case 12:
        renderHtml = this.renderCondtion12();
        break;
      case 13:
        renderHtml = this.renderCondtion13();
        break;
      case 14:
        renderHtml = this.renderCondtion11();
        break;
      case 15:
        renderHtml = this.renderCondtion15();
        break;
      case 16:
        renderHtml = this.renderCondtion11();
        break;
      default:
        renderHtml = this.renderCondtion11();
        break;
    }
    return renderHtml;
  }

  handleChange(e) {
    const { name, value } = e.target;
    var newValue = {};
    newValue[name] = value;
    this.setState({ [name]: value, promoCodeErr: false });
    this.props.updateUserdataRedex(newValue);
  }

  promocodeSubmit(isMemberCondition) {
    this.setState({ submitted: true })

    if (this.props.userData.promocode && this.props.userData.promocode.trim()) {
      this.props.start_loader();
      this.setState({ promoCodeErr: false, submitted: false })
      /* this.props.isUserSubscribed().then(
        responseSub => {
          if (responseSub.status) { */
      this.props
        .getPromocodePaln(this.props.userData.promocode.trim())
        .then(
          response => {
            this.props.stop_loader();
            var promoPlans = (response.plans.length > 0) ? response.plans[0] : {};
            console.log('promoPlans', promoPlans)
            if (isMemberCondition) {
              if (this.props.userData.conditionList && this.props.userData.conditionList.includes(promoPlans.conditionId)) {
                //already myconditions
                this.setState({
                  promoPlansData: promoPlans,
                  planData: promoPlans ? promoPlans.Plan : {},
                  is_onboard_membership_open: true,
                  health_conditionId: promoPlans.conditionId
                });
              } else {
                //new condition through promo code
                console.log('promoPlans-else')
                var temp = [];
                this.props.healthcondition_list.map(function (item) {
                  if (item.id === promoPlans.conditionId) {
                    temp.push(item);
                  }
                });
                this.setState({ health_condition: temp });
                this.props.registerFormValues.health_condition = temp;
                this.props.registerFormValues.condition_professions = [];
                this.setState({
                  isConditionModalOpen: true,
                  promoPlansData: promoPlans,
                  planData: promoPlans ? promoPlans.Plan : {},
                  // is_onboard_membership_open: true,
                  health_conditionId: promoPlans.conditionId
                })
                this.props.registerformUpdate(this.props.registerFormValues)

              }

            } else {
              this.setState({
                promoPlansData: promoPlans,
                planData: promoPlans ? promoPlans.Plan : {},
                promo_ismodel_open: true,
                is_onboard_membership_open: false
              });
            }
            //toast.info('Plans got');
          },
          error => {
            this.props.stop_loader();
            toast.error(error);
            this.closeModel();
          }
        );
      /* } else {
        this.props.stop_loader();
        toast.info(Errors.should_cancel_membership);
      } */
      /* },
      error => {
        this.props.stop_loader();
        toast.info(Errors.should_cancel_membership);
      }
    ); */
    } else {
      this.setState({ promoCodeErr: true })
    }
  }

  membershipPlanPage() {
    const settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    if (this.state.membership_plans.length > 0) {
      return (
        <div>
          <div className="row pricing pricing-mobile">
            <Slider {...settings}>
              {this.state.membership_plans.map((item, key) => {
                return (
                  <div className="" key={key}>
                    <div className="card mb-5 mb-lg-0">
                      <div className="card-body height-fix text-center">
                        <h5 className="card-title text-body font-semibold font-21 black-txt text-uppercase text-center">
                          {item.name}
                        </h5>
                        <h5 className=" text-center font-21 font-semibold purplefont">
                          {(constand.Currency_Symbol[item.currency]) || item.currency} {item.amount}
                          <span className="period"> per {item.interval}</span>
                        </h5>
                        <figure className="text-center">
                          <img
                            src={
                              constand.WEB_IMAGES + "member_ship/membership_" + (key + 1) + ".png"
                            }
                            className="img-fluid img-responsive w-70"
                            alt=""
                          />
                        </figure>
                        <p className="font-14 black-txt text-center m-t-20 font-qregular">
                          Access to on-demand exercise video library.
                        </p>
                        <hr className="w-75 mr-auto ml-auto" />
                        <p className="font-14 black-txt text-center m-t-20 font-qregular">
                          Access to groups
                        </p>
                        <hr className="w-75    mr-auto ml-auto" />
                        <p className="font-14 black-txt text-center m-t-20 font-qregular">
                          Access to all live exercise classes
                        </p>
                        {/* item.credits && item.credits > 0 ? (
                          <p className="font-12 black-txt text-center font-qmedium">
                            {item.credits} live classes / month
                      </p>
                        ) : (
                            <p className="occupied_empty"></p>
                          ) */}
                        <button
                          className="btn btn-orange m-t-20 font-medium font-14"
                          onClick={() => this.renderPayment(item)}
                        >
                          Sign me up!
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
          <div className="row pricing pricing-desktop">

            {this.state.membership_plans.map((item, key) => {
              return (
                <div className="col p-l-0" key={key}>
                  <div className="card mb-5 mb-lg-0">
                    <div className="card-body height-fix text-center">
                      <h5 className="card-title text-body font-semibold font-21 black-txt text-uppercase text-center">
                        {item.name}
                      </h5>
                      <h5 className=" text-center font-21 font-semibold purplefont">
                        {constand.Currency_Symbol[item.currency] || item.currency} {item.amount}
                        <span className="period"> per {item.interval}</span>
                      </h5>
                      <figure className="text-center">
                        <img
                          src={
                            constand.WEB_IMAGES + "member_ship/membership_" + (key + 1) + ".png"
                          }
                          className="img-fluid img-responsive w-70"
                          alt=""
                        />
                      </figure>
                      <p className="font-14 black-txt text-center m-t-20 font-qregular">
                        Access to on-demand exercise video library.
                      </p>
                      <hr className="w-75 mr-auto ml-auto" />
                      <p className="font-14 black-txt text-center m-t-20 font-qregular">
                        Access to groups
                      </p>
                      <hr className="w-75    mr-auto ml-auto" />
                      <p className="font-14 black-txt text-center m-t-20 font-qregular">
                        Access to all live exercise classes
                      </p>

                      {/* item.credits && item.credits > 0 ? (
                        <p className="font-12 black-txt text-center font-qmedium">
                          {item.credits} live classes / month
                      </p>
                      ) : (
                          <p className="occupied_empty"></p>
                        ) */}
                      <button
                        className="btn btn-orange m-t-20 font-medium font-14"
                        onClick={() => this.renderPayment(item)}
                      >
                        Sign me up!
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return (<div className="row pricing"><div className="col-sm-12 text-center">No membership plans!</div></div>);
    }
  }

  /* updatePaymentData(name, value) {
    var newValue = {};
    newValue[name] = value;
    this.setState({
      payment_data: { ...this.state.payment_data, ...newValue }
    });
    console.log('updatePaymentData=>',this.state.payment_data)
  }

  handlePaymentChange(e) {
    const { name, value } = e.target;
    this.updatePaymentData(name, value);
  } */

  submitPayment(payment_data) {
    /* var newValue = {};
    newValue.submitted = true;
    this.setState(
      { payment_data: { ...payment_data, ...newValue } },
      function () {
        this.progressPayment();
      }
    ); */
    console.log('submitpayment', payment_data)
    this.setState({ payment_data: { ...payment_data } }, function () {

      if (this.state.submittedMembershipData.isMembershipCondition)
        this.startTrail(this.state.countryPlans, 'change_plan', this.state.submittedMembershipData);
      else
        this.startTrail(this.state.planData, 'change_plan');

    });
  }

  progressPayment() {
    if (
      this.state.payment_data.card_name &&
      this.state.payment_data.card_number &&
      valid.number(this.state.payment_data.card_number).isValid &&
      this.state.payment_data.card_exp_month &&
      this.state.payment_data.card_exp_month <= 12 &&
      this.state.payment_data.card_exp_year &&
      this.state.payment_data.card_exp_year >= new Date().getFullYear() &&
      this.state.payment_data.card_security_code &&
      this.state.payment_data.card_security_code.length ===
      valid.number(this.state.payment_data.card_number).card.code.size &&
      this.state.payment_data.card_zipcode
    ) {
      if (this.state.submittedMembershipData.isMembershipCondition)
        this.startTrail(this.state.countryPlans, 'change_plan', this.state.submittedMembershipData);
      else
        this.startTrail(this.state.planData, 'change_plan');
    } else {
      return false;
    }
  }

  paymentPage(upgrade) {
    /* const membership_plan = this.state.planData;
    var cost = this.state.cost;
    return (
      <div className="step14">
        <div className="row justify-content-center align-items-center">
          {upgrade &&
            <div className="col-md-6 m-b-20 p-l-0 mx-auto text-center">
              <img src={constand.WEB_IMAGES + "logo.png"} id="icon" className="img-fluid p-r-10 p-t-10 p-b-10" alt="beam logo" />
              <span className="purplefont font-bold font-18 align-bottom text-capitalize">
                {this.state.condition_name}
              </span>
            </div>
          }
          <div className="input_section card-details--page col-md-9 m-t-10">
            <div className="form-group">
              <div className="row">
                <div className="form-group col-md-12 float-left">
                  <label htmlFor="card_name" className="text-label">
                    Name on Card
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control input-control"
                      name="card_name"
                      placeholder=""
                      onChange={this.handlePaymentChange}
                      value={this.state.payment_data.card_name}
                      required
                    />
                  </div>
                  {this.state.payment_data.submitted &&
                    !this.state.payment_data.card_name && (
                      <p className="help-block text-danger">
                        Name on card required
                      </p>
                    )}
                </div>
                <div className="form-group col-md-12 float-left">
                  <label htmlFor="card_number" className="text-label">
                    Card number
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control input-control"
                      name="card_number"
                      placeholder=""
                      onChange={this.numberOnly}
                      value={this.state.payment_data.card_number}
                    />
                  </div>
                  {this.state.payment_data.submitted &&
                    !this.state.payment_data.card_number && (
                      <p className="help-block  text-danger">
                        Card number required
                      </p>
                    )}
                  {this.state.payment_data.submitted &&
                    this.state.payment_data.card_number &&
                    !valid.number(this.state.payment_data.card_number)
                      .isValid && (
                      <p className="help-block  text-danger">
                        Invalid card number
                      </p>
                    )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-lg-5 expiration-date">
                  <div className="form-group">
                    <label className="text-label">
                      <span className="hidden-xs">Expiration</span>{" "}
                    </label>
                    <div className="form-inline">
                      <div className="col-md-6 p-l-0 exp-date">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control input-control"
                            name="card_exp_month"
                            placeholder="MM"
                            onChange={this.expiremonthValid}
                            value={this.state.payment_data.card_exp_month}
                            required
                          />
                        </div>
                        {this.state.payment_data.submitted &&
                          !this.state.payment_data.card_exp_month && (
                            <p className="help-block  text-danger">
                              Month required
                            </p>
                          )}
                        {this.state.payment_data.submitted &&
                          this.state.payment_data.card_exp_month > 12 && (
                            <p className="help-block  text-danger">
                              Invalid month
                            </p>
                          )}
                      </div>
                      <div className="col-md-6 p-0">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control input-control"
                            name="card_exp_year"
                            placeholder="YYYY"
                            onChange={this.expireyearValid}
                            value={this.state.payment_data.card_exp_year}
                            required
                          />
                        </div>
                        {this.state.payment_data.submitted &&
                          !this.state.payment_data.card_exp_year && (
                            <p className="help-block  text-danger">
                              Expire year required
                            </p>
                          )}
                        {this.state.payment_data.submitted &&
                          this.state.payment_data.card_exp_year &&
                          this.state.payment_data.card_exp_year <
                          new Date().getFullYear() && (
                            <p className="help-block  text-danger">
                              Invalid expire year
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-7">
                  <div className="form-group">
                    <label htmlFor="card_security_code" className="text-label">
                      Security Code
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control input-control"
                        name="card_security_code"
                        placeholder=""
                        onChange={this.handlePaymentChange}
                        value={this.state.payment_data.card_security_code}
                        required
                      />
                    </div>
                    {this.state.payment_data.submitted &&
                      !this.state.payment_data.card_security_code && (
                        <p className="help-block  text-danger">
                          Security code required
                        </p>
                      )}
                    {this.state.payment_data.submitted &&
                      (this.state.payment_data.card_security_code &&
                        valid.number(this.state.payment_data.card_number)
                          .card) &&
                      this.state.payment_data.card_security_code.length !==
                      valid.number(this.state.payment_data.card_number).card
                        .code.size && (
                        <p className="help-block  text-danger">
                          Invalid security code
                        </p>
                      )}
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="form-group">
                    <label htmlFor="card_zipcode" className="text-label">
                      ZIP/Postal code
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control input-control"
                        name="card_zipcode"
                        placeholder=""
                        onChange={this.handlePaymentChange}
                        value={this.state.payment_data.card_zipcode}
                        required
                      />
                    </div>
                    {this.state.payment_data.submitted &&
                      !this.state.payment_data.card_zipcode && (
                        <p className="help-block  text-danger">
                          ZIP/Postal code required
                        </p>
                      )}
                    {this.state.payment_data.submitted && this.state.payment_data.card_zipcode &&
                      this.state.payment_data.card_zipcode.length > 6 && (
                        <p className="help-block  text-danger">
                          Invalid ZIP/Postal code
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </div>
            {upgrade &&
              <p className="small-txt font-book text-center">
                By becoming a member you will be charged {cost} today and every month after.  You are free to cancel your membership anytime from your membership page.
            </p>
            }{!upgrade &&
              <p className="small-txt font-book text-center">
                Due today and monthly ongoing:{" "}
                <span className="orangefont p-l-10">
                  {membership_plan.currency} {membership_plan.amount}
                </span>
              </p>
            }
            {(this.state.payment_data.invalid_expiration) &&
              <p className="small-txt font-book text-center text-danger m-t-10">Invalid Expiration.</p>}
          </div>
        </div>
        <div className="row justify-content-center align-items-center">
          <div className="input_section col-md-6 m-t-10">
            <div id="register-link" className=" w-100 m-t-20 m-b-20 float-left">
              <a
                href="javascript:void(0)"
                onClick={() => this.submitPayment()}
                className="bluebtn float-left w-100 font-14 font-medium text-center"
              >
                Become a Member
              </a>
            </div>
          </div>
        </div>
      </div>
    ); */
  }

  renderPayment(item = {}) {
    this.setState({ planData: item, membership_step: 2 });
  }

  paymentPrevStep() {
    this.setState({ membership_step: 1 });
  }

  renderRSMembership1 = () => {
    return (
      <div>
        {/* Object.keys(this.props.userData).length > 0 &&
          this.props.userData.constructor === Object && (
            <React.Fragment>{this.mainRender()}</React.Fragment>
          )}
        {Object.keys(this.props.userData).length === 0 &&
          this.props.userData.constructor === Object && (
            <div>
              <span>No data found!</span>
            </div>
          ) */}
        {
          <div>

            <div className="col-lg-6 col-md-12 col-sm-12 m-b-10 p-l-0">
              <label
                className="font-14 black-txt font-qmedium col-sm-12  pl-0"
                htmlFor="promocode"
              >
                <b>Remove Account</b>
                <p className="font-qregular font-14 balck-txt m-t-10">To remove your Beam account and erase any personal data we hold about you please email <strong>{constand.ADMIN_EMAIL_ID}</strong> with your request.</p>

              </label>

            </div>

          </div>
        }
      </div>
    )
  }
  renderRSMembership() {
    return (
      <div>
        <p className="font-medium black-txt font-21 member-txt m-t-10">
          Your Beam Membership(s)
        </p>
        {this.state.membershipData.plan && this.state.membershipData.plan.length > 0 && this.state.membershipData.plan.map((item, index) => {
          return (
            <div>
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-7 m-b-20 p-l-0">
                    <img src={constand.WEB_IMAGES + "logo.png"} id="icon" className="img-fluid m-b-10 logo-size" alt="beam logo" />
                    <br/>
                    <span className="purplefont font-bold font-18 align-bottom text-capitalize font-qbold pre-wrap">
                      {item.Tag && item.Tag.tag}
                    </span>
                  </div>

                  {this.renderMembershipContent(item, 'RS')}

                </div>
              </div>
              <hr />
            </div>
          )
        })
        }

        <div className=" m-b-10 p-l-0">
          <label
            className="font-14 black-txt font-qmedium col-sm-12  pl-0"
            htmlFor="remove"
          >
            <label for="remove" class="text-label">Remove Account</label>
            <p className="font-qregular font-14 balck-txt m-t-10">To remove your Beam account and erase any personal data we hold about you please email <strong>{constand.ADMIN_EMAIL_ID}</strong> with your request.</p>

          </label>

        </div>
      </div>
    )
  }
  checkMembershipCases(item, type, conditionType) {
    console.log('checkMembershipCasesitem', item)
    var content = '';
    var now = moment().format('YYYY-MM-DD'); // new Date().getTime();
    console.log('NOW', now);
    console.log('item.trialEnds', item.trialEnds);
    var trialEnds = moment(item.trialEnds).utc().format('YYYY-MM-DD');
    //var trialEndsDate = new Date(new Date(item.trialEnds).toUTCString()).toISOString();
    //var trialEnds = new Date(trialEndsDate).getTime();
    console.log('trialEnds', trialEnds);
    var buttonData = { member: false, cancel: false };
    var conditionName = item.Tag ? item.Tag.tag : '';
    if (item.licenseId && trialEnds >= now) {
      content = "You have been gifted a FREE Beam membership until " + moment(trialEnds).format('Do MMMM YYYY') + " courtesy of " + item.License.Organisation.organisationName + ".";
      buttonData = { member: false, cancel: false };
    } else if (item.licenseId && trialEnds < now) {
      content = "Your FREE Beam membership courtesy of " + item.License.Organisation.organisationName + " expired on " + moment(trialEnds).format('Do MMMM YYYY') + ".";
      if (conditionType == 'core')
        content = content + " To continue using Beam " + conditionName + " you need to upgrade your membership.";
      buttonData = { member: true, cancel: false };

    } else if (item.promoId && trialEnds >= now) {
      content = "You have been gifted a FREE Beam membership until " + moment(trialEnds).format('Do MMMM YYYY');
      if (item.Promo.courtesyName)
        content = content + " courtesy of " + item.Promo.courtesyName + ".";
      buttonData = { member: false, cancel: false };

    } else if (item.promoId && trialEnds < now) {
      content = "Your FREE Beam membership";
      if (item.Promo.courtesyName)
        content = content + " courtesy of " + item.Promo.courtesyName;
      content = content + " expired on " + moment(trialEnds).format('Do MMMM YYYY') + ".";
      if (conditionType == 'core')
        content = content + "To continue using Beam " + conditionName + " you need to upgrade your membership.";
      buttonData = { member: true, cancel: false };

    } else if (!item.promoId && !item.licenseId && ((item.subcriptionId && !item.subcriptionId.includes('sub_')) || !item.subcriptionId) && trialEnds >= now) {
      content = "Your membership to Beam will end on " + moment(trialEnds).format('Do MMMM YYYY');
      if (conditionType == 'core')
        content = "You are currently in your free trial period for Beam " + conditionName + ", which ends on " + moment(trialEnds).format('Do MMMM YYYY') + ".";
      buttonData = { member: true, cancel: false, isFreeTrial: true };

    } else if (!item.promoId && !item.licenseId && ((item.subcriptionId && !item.subcriptionId.includes('sub_')) || !item.subcriptionId) && trialEnds < now) {
      content = "Your free trial period ended on " + moment(trialEnds).format('Do MMMM YYYY') + ".";
      if (conditionType == 'core')
        content = content + " To continue using Beam " + conditionName + " you need to upgrade your membership.";
      buttonData = { member: true, cancel: false };
    } else if (item.subcriptionId && item.subcriptionId.includes('sub_') && item.customerId && !item.cancellationDate) {
      content = "You are currently a subscribed member of Beam " + conditionName + " on our " + item.Plan.name + " plan. You will be charged " + (constand.Currency_Symbol[item.Plan.currency] || item.Plan.currency) + " " + item.Plan.amount + " around the " + moment(item.planStarts).format('Do') + " day of every month.";
      //content = content + "</br></br> To cancel your subscription, please email us at hello@beamfeelgood.com";
      buttonData = { member: false, cancel: true };
    } else if (item.subcriptionId && item.subcriptionId.includes('sub_') && item.customerId && item.cancellationDate && trialEnds >= now) {
      var cancelDate = moment(item.cancellationDate).utc().format('YYYY-MM-DD');
      content = "Your membership to Beam " + conditionName + " was cancelled on " + moment(cancelDate).format('Do MMMM YYYY') + ".  Your access will end on " + moment(trialEnds).format('Do MMMM YYYY') + ".";
      buttonData = { member: false, cancel: false };
    } else if (item.subcriptionId && item.subcriptionId.includes('sub_') && item.customerId && item.cancellationDate && trialEnds < now) {
      var cancelDate = moment(item.cancellationDate).utc().format('YYYY-MM-DD');
      content = "Your membership to Beam " + conditionName + " was cancelled on " + moment(cancelDate).format('Do MMMM YYYY') + ".";
      buttonData = { member: true, cancel: false };
    }

    if (type == 'content')
      return content;
    else
      return buttonData;
  }
  renderMembershipContent(item, type) {
    var content = this.checkMembershipCases(item, 'content', type);
    return (
      <div className=" m-b-20 font-qregular">
        <p dangerouslySetInnerHTML={{
          __html: content
        }}></p>
      </div>
    )
  }
  renderMembershipButtons(item, type) {
    var buttons = this.checkMembershipCases(item, 'button', 'core');
    console.log('upgrade your membership', buttons)
    var conditionName = item.Tag ? item.Tag.tag : '';
    if (buttons.member) {
      return (
        <div className={(type == 'mobile' ? "col-md-6 text-center m-b-10 d-inline-block" : "col-md-6 text-center m-b-20")}>
          <button className="btn btn-purple pull-right" onClick={() => { this.setState({ is_onboard_membership_open: true, health_conditionId: item.conditionId, condition_name: conditionName, currentPlanId: item.id, isFreeTrial: buttons.isFreeTrial }) }}>Membership Options</button>
        </div>
      )
    } else if (buttons.cancel) {
      return (
        <div className={(type == 'mobile' ? "col-md-6 text-center m-b-10 d-inline-block" : "col-md-6 text-center m-b-20")}>
          {<button className="btn btn-purple pull-right" onClick={() => {
            this.setState({ currentPlanId: item.id, isNoThanksModal: true, conditionName: conditionName });
            //this.cancelSubscription(true);
          }}>Cancel membership</button>}
        </div>
      )
    } else {
      return ('')
    }
  }
  renderCoreMembership() {
    console.log('this.state.membershipData', this.state.membershipData)
    return (
      <div>
        <p className="font-medium black-txt font-21 member-txt m-t-10">
          Your Beam Membership(s)
        </p>
        {this.state.membershipData.plan && this.state.membershipData.plan.length > 0 && this.state.membershipData.plan.map((item, index) => {
          return (
            <div>
              <div className="col-md-12">
                <div className="row fordesktop">
                  <div className="col-md-6 m-b-20 p-l-0">
                    <img src={constand.WEB_IMAGES + "logo.png"} id="icon" className="img-fluid m-b-10 logo-size" alt="beam logo" />
                    <br/>
                    <span className="purplefont font-bold font-18 align-bottom text-capitalize font-qbold pre-wrap">
                      {item.Tag && item.Tag.tag}
                    </span>
                  </div>
                  {item.conditionId && this.renderMembershipButtons(item, 'desktop')}
                  {this.renderMembershipContent(item, 'core')}

                </div>
                <div className="row formobile">
                  <div className="col-md-6 m-b-20 p-l-0">
                    <img src={constand.WEB_IMAGES + "logo.png"} id="icon" className="img-fluid m-b-10 logo-size" alt="beam logo" />
                    <br/>
                    <span className="purplefont font-bold font-18 align-bottom text-capitalize font-qbold pre-wrap">
                      {item.Tag && item.Tag.tag}
                    </span>
                  </div>
                  {this.renderMembershipContent(item, 'core')}
                  {item.conditionId && this.renderMembershipButtons(item, 'mobile')}

                </div>
              </div>
              <hr />
            </div>
          )
        })
        }
        {!this.state.isLoading && !Object.keys(this.state.membershipData).length &&
          <div>
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-6 m-b-20 p-l-0">
                </div>
                <p class=" font-qregular">Oh no, you don’t currently have any memberships to Beam! Head over to <a href='/accounts/myConditions'>My Conditions</a> to choose a condition to sign up to.</p>
              </div>
            </div>
            <hr />
          </div>
        }
        <div class="mt-4 mb-5 mx-auto">
          <label htmlFor="promocode" className="text-label font-medium">Got a promotional code?</label>
          <div class="row">
            <div className="col-md-9 m-b-10">
              <input type="text" name="promocode" id="promocode" className="form-control input-control" value={this.state.promocode} onChange={this.handleChange} />
            </div>
            <div id="register-link" className="col-md-3 align-self-center text-center p-15">
              <button disabled={this.state.isDisablePromo} className="btn button-lightblue text-center w-100 p-3" onClick={() => this.promocodeSubmit(true)}>Apply</button>
            </div>
          </div>
          {this.state.submitted && (this.state.promoCodeErr) &&
            <p className="text-danger">Please enter correct promo or access code</p>}

        </div>
        <div className=" m-b-10 p-l-0">
          <label
            className="font-16 black-txt font-qmedium col-sm-12  pl-0"
            htmlFor="remove"
          >
            <label for="remove" class="text-label font-medium">Remove Account</label>
            <p className="font-qregular font-16 balck-txt m-t-10 ">To remove your Beam account and erase any personal data we hold about you please email <strong>{constand.ADMIN_EMAIL_ID}</strong> with your request.</p>

          </label>

        </div>
      </div>
    )
  }
  submitMembershipData(data) {
    console.log('submitMembershipData', data)
    var condition_membership = data.condition_membership;
    data.currentPlanId = this.state.currentPlanId;
    data.isMembershipCondition = true;
    data.health_conditionId = this.state.health_conditionId;
    if (condition_membership.length && condition_membership[0].promoId) {
      //promo code apply
      console.log('promo-this.state.planData', this.state.planData)
      this.startTrail(this.state.planData, 'promo', data)
      this.setState({ is_onboard_membership_open: false, isConditionModalOpen: false })
    } else if (condition_membership.length && condition_membership[0].membershipType == 'license') {
      //license
      this.startTrail(this.state.countryPlans, 'change_plan', data)
      this.setState({ cost: data.cost, submittedMembershipData: data, payment_data: {} })
    } else {
      //card
      this.setState({ isUpgradeClicked: true, cost: data.cost, submittedMembershipData: data, payment_data: {} })
    }

  }
  render() {
    let promo_paln = (this.state.planData) ? this.state.planData : {};
    promo_paln.Plan = (promo_paln.Plan) ? promo_paln.Plan : {};
    var authData = this.props.logged_userData;
    return (
      <React.Fragment>
        <Helmet>
          <title>{constand.ACCOUNT_MEMBERSHIP_TITLE}{constand.BEAM}</title>
          <meta property="og:title" content={constand.ACCOUNT_MEMBERSHIP_TITLE + constand.BEAM} />
          <meta property="og:description" content={constand.ACCOUNT_MEMBERSHIP_DESC} />
          <meta property="og:image" content={constand.ACCOUNT_MEMBERSHIP_PAGE_IMAGE} />
          <meta property="og:url" content={window.location.href} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="og:site_name" content="Beam" />
          <meta name="twitter:image:alt" content={constand.ACCOUNT_MEMBERSHIP_PAGE_IMAGE_ALT} />
        </Helmet>
        {authData && (authData.isStudyLeader || authData.isGroupLeader || authData.isStudyInstructor || authData.isStudyUser) &&
          this.renderRSMembership()
        }
        {authData && !authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyInstructor && !authData.isStudyUser &&
          this.renderCoreMembership()
        }
        <Modal
          classNames={{
            modal: "pricing-popup m-t-50"
          }}
          open={this.state.ismodel_open}
          onClose={this.onCloseModal}
          center
        >
          <div className="modal-dialog modal-width--custom " role="document">
            <div className="modal-content">
              <div className="modal-header header-styling  border-0">
                <h5
                  className="modal-title text-center col-md-11 p-0 font-semibold"
                  id="exampleModalLabel font-medium"
                >
                  {this.state.membership_step === 2
                    ? "Become a member"
                    : "Choose your membership plan"}
                  {this.state.membership_step === 2 && (
                    <span className="pull-left pointer">
                      <i
                        className="fa fa-arrow-left"
                        aria-hidden="true"
                        onClick={this.paymentPrevStep}
                      ></i>
                    </span>
                  )}
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
                {this.state.membership_step === 2
                  ? this.paymentPage(false)
                  : this.membershipPlanPage()}
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          classNames={{
            modal: "pricing-popup-single m-t-50"
          }}
          open={this.state.promo_ismodel_open}
          onClose={this.onCloseModal}
          center
        >
          <div className="modal-dialog modal-width--custom" role="document">
            <div className="modal-content">
              <div className="modal-header header-styling  border-0">
                <h5
                  className="modal-title text-center col-md-11 p-0 font-semibold"
                  id="exampleModalLabel font-medium"
                >
                  Nice one {commonService.bindUsername(this.props.logged_userData)}!
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
                <div className="row justify-content-center align-items-center">
                  <div className="input_section col-md-12 m-t-20">
                    {/* <p className=" mb-5 font-14 font-qregular abbey-txt text-center">
                      This code entitles you to ...
                    </p> */}
                    <p className=" mb-5 font-14 font-qregular abbey-txt text-center">
                      Great news! This code entitles you to...
                    </p>
                    {promo_paln.freeDays == 366 &&
                      <p className="font-14 font-qregular abbey-txt text-center">
                        12 months free membership to Beam
                      </p>
                    }
                    {promo_paln.freeDays != 366 &&
                      <p className="font-14 font-qregular abbey-txt text-center">
                        {promo_paln.freeDays} days free membership to Beam
                      </p>
                    }
                    {promo_paln.courtesyName &&
                      <p className="font-14 font-qregular abbey-txt text-center m-t-40">
                        courtesy of {promo_paln.courtesyName}
                      </p>
                    }

                    <div
                      id="register-link"
                      className=" w-100 m-t-50 m-b-20 float-left"
                    >
                      <a
                        href="javascript:void(0)"
                        onClick={() => this.startTrail(promo_paln.Plan, 'promo')}
                        className="bluebtn float-left font-medium font-14 w-100 text-center"
                      >
                        Let's get started!
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          classNames={{
            modal: "pricing-popup m-t-50 membership-popup"
          }}
          open={this.state.is_onboard_membership_open}
          onClose={this.onCloseModal}
          center
        >
          <div className="modal-dialog modal-width--custom float-none" role="document">
            <div className="modal-content">
              <div className="modal-header header-styling  border-0">
                <h5
                  className="modal-title text-center col-md-11 p-0 font-semibold"
                  id="exampleModalLabel font-medium"
                >
                  Your membership options
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
                {!this.state.isUpgradeClicked && this.state.is_onboard_membership_open &&
                  <OnboardMembershipComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} health_conditionId={this.state.health_conditionId} condition_name={this.state.condition_name} registerUser={this.submitMembershipData} pageFrom="membership" promocode={this.state.promocode} promoPlans={this.state.promoPlansData} closeModel={this.closeModel} isFreeTrial={this.state.isFreeTrial} />
                }
                {this.state.isUpgradeClicked &&
                  <PaymentComponent
                    payment_data={this.state.payment_data}
                    cost={this.state.cost}
                    submitPayment={this.submitPayment} />
                  //this.paymentPage(true)
                }

              </div>
            </div>
          </div>
        </Modal>
        {this.state.isConditionModalOpen &&
          <ConditionOnboardingComponent
            ismodel_open={this.state.isConditionModalOpen}
            closeModel={this.closeModel}
            conditionList={this.props.healthcondition_list}
            submitCondition={this.submitMembershipData}
            promocode={this.state.promocode}
            promoPlans={this.state.promoPlansData}
            health_conditionId={this.state.health_conditionId}
          />
        }
        {this.state.isNoThanksModal &&
          <NoThanksModal
            title="Are you sure?"
            content={'Are you sure you want to cancel your membership to Beam ' + this.state.conditionName + '?'}
            yesButton="Yes"
            noButton="No"
            is_model_open={this.state.isNoThanksModal}
            submitYes={() => {
              this.setState({ isNoThanksModal: false })
              this.cancelSubscription(true);
            }}
            submitNo={() => { this.setState({ isNoThanksModal: false }) }}
          />
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    IP_Details: state.accountinfo.ip_data,
    logged_userData: state.header.logged_userData,
    registerFormValues: state.register.registerFormValues,
    healthcondition_list: state.register.healthcondition_list,

  };
};

const mapDispatchToProps = {
  start_loader,
  stop_loader,
  cancelSubscription,
  get_membership,
  fetchMembershipPlans,
  changePlan,
  updateUserdataRedex,
  getPromocodePaln,
  isUserSubscribed,
  fetchUserDetails,
  getLicenseList,
  registerformUpdate,
  getPlanByCountry,
  setConditionIndex,
  setStep
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountMembershipComponent);
