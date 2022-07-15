import React from "react";
import { connect } from "react-redux";
import {
  fetchUserDetails,
  getCountriesList,
  getRegionList,
  start_loader,
  stop_loader,
  updateUserdataRedex
} from "../../actions";
import AccountBasicInfoComponent from "./AccountBasicInfoComponent";
import MyConditionComponent from "./MyConditionComponent";
import AccountMembershipComponent from "./AccountMembershipComponent";
import AccountCommunicationComponent from "./AccountCommunicationComponent";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Cookies } from "react-cookie-consent";
import * as constand from "../../constant";
import EmergencyInfoComponent from "./EmergencyInfoComponent";
import MovementPrefsInfoComponent from "./MovementPrefsInfoComponent";


class AccountDetailComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account_tab: 1,
      userData: {},
      countriesList: []
    };
    this.tabChange = this.tabChange.bind(this);
    this.getCountriesList = this.getCountriesList.bind(this);
  }

  componentDidMount() {
    this.getCountriesList();
  }

  tabChange(tab) {
    this.setState({ account_tab: tab });
  }

  getCountriesList() {
    this.props.start_loader();
    this.props.getCountriesList().then(
      response => {
        this.props.stop_loader();
        var countries = response.country ? response.country : [];
        this.setState({ countriesList: countries });
      },
      error => {
        this.props.stop_loader();
        toast.error(error);
      }
    );
  }

  getRegionList(countryId) {
    this.setState({ regionloader: true });
    this.props.getRegionList(countryId).then(
      response => {
        var region = response.region ? response.region : [];
        this.setState({ regionList: region, regionloader: false });
      },
      error => {
        this.setState({ regionloader: false });
        toast.error(error);
      }
    );
  }

  showMobileListName() {
    var label;
    switch (this.props.match.path) {
      case "/accounts/basicInformation":
        label = "Basic Information";
        break;
      case "/accounts/myConditions":
        label = "My Conditions";
        break;
      case "/accounts/membership":
        label = "Membership";
        break;
      case "/accounts/communicationPreferences":
        label = "Communication Preferences";
        break;
      case "/accounts/emergencyInfo":
        label = "Emergency Info";
        break;
      case "/accounts/movementprefs":
        label = "Movement Prefs";
        break;
      default:
        label = "Select";
        break;
    }
    return label;
  }

  render() {
    var condition = (Cookies.get('condition') != 'undefined' && Cookies.get('condition')) ? Cookies.get('condition').toLowerCase() : constand.CONDITION;
    console.log('this.props.match.path',this.props.match.path)
    return (
      <section className={((typeof Cookies.get('closeBanner') == 'undefined' || Cookies.get('closeBanner') == 'false') && !this.props.close_banner) || ((typeof Cookies.get('closeBannerKD') == 'undefined' || Cookies.get('closeBannerKD') == 'false') && !this.props.close_banner_kd) ? 'Account_details' : 'Account_details m-t-70'}>
        <div className="Account-bg text-center p-t-10 p-b-90" id="Account">
          <div className="container">
            <h3 className="font-medium font-37 darkblue-text ">
              Account Details
            </h3>
          </div>
        </div>
        <div className="account_tabs m-t-60 m-b-60">
          <div className="container-fluid mx-auto w-75">
            <div className="row">
              <div className="col-md-6 col-lg-4 mb-3 d-none d-sm-none d-md-block d-lg-block">
                <ul
                  className="nav nav-pills flex-column"
                  id="myTab"
                  role="tablist"
                >
                  <li className="nav-item">
                    <Link
                      className={
                        (this.props.match.path === "/accounts/basicInformation"
                          ? "active"
                          : "") + " nav-link font-medium font-21 m-b-10"
                      }
                      to={"/accounts/basicInformation"}
                    >
                      Basic Information
                    </Link>
                  </li>
                  {!this.props.logged_userData.isStudyParticipant && condition && !condition.includes('research') &&

                    <li className="nav-item">
                      <Link
                        className={
                          (this.props.match.path === "/accounts/myConditions"
                            ? "active"
                            : "") + " nav-link font-medium font-21 m-b-10"
                        }
                        to={"/accounts/myConditions"}
                      >
                        My Conditions
                      </Link>
                    </li>
                  }
                  <li className="nav-item">
                    <Link
                      className={
                        (this.props.match.path === "/accounts/membership"
                          ? "active"
                          : "") + " nav-link font-medium font-21 m-b-10"
                      }
                      to={"/accounts/membership"}
                    >
                      Membership
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={
                        (this.props.match.path === "/accounts/communicationPreferences"
                          ? "active"
                          : "") + " nav-link font-medium font-21 m-b-10"
                      }
                      to={"/accounts/communicationPreferences"}
                    >
                      Communication Preferences
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={
                        (this.props.match.path === "/accounts/emergencyInfo"
                          ? "active"
                          : "") + " nav-link font-medium font-21 m-b-10"
                      }
                      to={"/accounts/emergencyInfo"}
                    >
                      Emergency Info
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={
                        (this.props.match.path === "/accounts/movementprefs"
                          ? "active"
                          : "") + " nav-link font-medium font-21 m-b-10"
                      }
                      to={"/accounts/movementprefs"}
                    >
                     Movement Preferences
                    </Link>
                  </li>
                  {/* <li className="nav-item">
                    <a
                      className="nav-link font-medium font-21 m-b-30"
                      href="javascript:void(0)"
                      onClick={()=>this.tabChange(4)}
                    >
                      Notifications
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link font-medium font-21 m-b-10"
                      href="javascript:void(0)"
                      onClick={()=>this.tabChange(5)}
                    >
                      Delete Account
                    </a>
                  </li> */}
                </ul>
              </div>
              <div className="col-12 mb-3 d-block d-sm-block d-md-none d-lg-none">
                <div className="dropdown tab-btn w-100">
                  <button
                    type="button"
                    className="btn btn-default font-medium font-14 tab-select dropdown-toggle"
                    data-toggle="dropdown"
                  >
                    {this.showMobileListName()}
                    <span className="slt"></span>
                  </button>
                  <div className="dropdown-menu">
                    <Link
                      className={
                        (this.props.match.path === "/accounts/basicInformation"
                          ? "active"
                          : "") + " nav-link font-medium font-21 m-b-10"
                      }
                      to={"/accounts/basicInformation"}
                    >
                      Basic Information
                    </Link>
                    {!this.props.logged_userData.isStudyParticipant && condition && !condition.includes('research') &&
                      <Link
                        className={
                          (this.props.match.path === "/accounts/myConditions"
                            ? "active"
                            : "") + " nav-link font-medium font-21 m-b-10"
                        }
                        to={"/accounts/myConditions"}
                      >
                        My Conditions
                      </Link>
                    }
                    <Link
                      className={
                        (this.props.match.path === "/accounts/membership"
                          ? "active"
                          : "") + " nav-link font-medium font-21 m-b-10"
                      }
                      to={"/accounts/membership"}
                    >
                      Membership
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-8 ">
                <div>
                  {this.props.match.path === "/accounts/basicInformation" && (
                    <AccountBasicInfoComponent
                      countriesList={this.state.countriesList}
                      userData={this.props.logged_userData}
                      history={this.props.history}
                    />
                  )}
                  {this.props.match.path === "/accounts/myConditions" && (
                    <MyConditionComponent history={this.props.history} />
                  )}
                  {this.props.match.path === "/accounts/membership" && (
                    <AccountMembershipComponent
                      userData={this.props.logged_userData}
                    />
                  )}
                  {this.props.match.path === "/accounts/communicationPreferences" && (
                    <AccountCommunicationComponent
                      userData={this.props.logged_userData}
                    />
                  )}
                  {this.props.match.path === "/accounts/emergencyInfo" && (
                    <EmergencyInfoComponent
                      userData={this.props.logged_userData}
                      history={this.props.history}
                    />
                  )}
                  {this.props.match.path === "/accounts/movementprefs" && (
                    <MovementPrefsInfoComponent
                      history={this.props.history}
                      userData={this.props.logged_userData}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    logged_userData: state.header.logged_userData,
    close_banner: state.header.close_banner,
    close_banner_kd: state.header.close_banner_kd,
  };
};

const mapDispatchToProps = {
  fetchUserDetails,
  getCountriesList,
  start_loader,
  stop_loader,
  updateUserdataRedex,
  getRegionList
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountDetailComponent);
