import React from "react";
import { connect } from "react-redux";
import { Prompt } from 'react-router';
import {
  fetchUserDetails,
  getRegionList,
  getCountriesList,
  updateUserdataRedex,
  getTagsBasedOnType,
  getOnboardingTags
} from "../../actions";
import { toast } from "react-toastify";
import * as constand from "../../constant";
import axios from "axios";
import { Helmet } from "react-helmet";
import PhoneInput from 'react-phone-input-2'
import ConfirmationPopup from "../Common/ConfirmationPopup";
import _ from 'lodash';

class AccountBasicInfoComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      regionList: [],
      regionloader: false,
      postFile: null,
      primaryCareConsent: false,
      emergencyContactConsent: false,
      permission_contact: false,
      isDirtyModalOpen: false,
      loading: false,
      submitted: false,
      ethnicity: [],
      ethnicityList: []
    };
    this.isPageload = true;
    this.handleChange = this.handleChange.bind(this);
    this.updateCountry = this.updateCountry.bind(this);
    this.updateRegion = this.updateRegion.bind(this);
    this.onSubmitProfile = this.onSubmitProfile.bind(this);
    this.shouldBlockNavigation = false;
  }
  componentDidMount() {
    this.props.getOnboardingTags();
    //this.props.fetchUserDetails().then(() => {
    let authData = JSON.parse(localStorage.getItem('userDetails')) || this.props.logged_userData;
    if (authData.Country)
      this.setState({ countryCode: authData.Country.countryCode.toLowerCase() })
    this.getEthnicityBasedOnCountry(authData.country, authData.Tags);

    if (authData.phoneNumber) {
      var newValue = authData;
      newValue['phoneNumber'] = authData.phoneNumber.toString();
      this.props.updateUserdataRedex(newValue);
    }
    //})

  }
  componentWillReceiveProps(nextprops) {

    if (this.isPageload && nextprops.userData.country && (this.state.regionList.length === 0)) {
      this.isPageload = false;
      this.getRegionList(nextprops.userData.country);
    }
  }

  getEthnicityBasedOnCountry = (country, tags = []) => {
    this.props.getOnboardingTags().then(response => {
      if (response.success) {
        var ethnicity = JSON.parse(response.data).ethnicity;
        this.setState({ ethnicity: JSON.parse(response.data).ethnicity })
        var newArra = _.filter(ethnicity, function (list) {
          return list.countryId === parseInt(country)
        });
        if (newArra.length && newArra[0].ethnicityList && newArra[0].ethnicityList.length)
          this.setState({ ethnicityList: newArra[0].ethnicityList })
        else {
          //if no ethnicity found then default to UK country ethnicity
          newArra = _.filter(ethnicity, function (list) {
            return list.countryId === constand.ukCountry
          });
          this.setState({ ethnicityList: newArra[0].ethnicityList })
        }

        if (tags.length)
          this.prefillEthnicity(tags);
      }
    })
  }

  prefillEthnicity = (Tags) => {
    var tempEthnicity = _.find(Tags, { 'type': "ethnicity" });
    if (tempEthnicity)
      this.setState({ ethnicity: tempEthnicity.tag })
  }

  handleChange(e) {
    const { name, value } = e.target;
    var newValue = {};
    newValue[name] = value;
    this.props.updateUserdataRedex(newValue);
    this.shouldBlockNavigation = true;

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

  updateCountry(e) {
    var newValue = {};
    newValue.country = e.target.value;
    this.props.updateUserdataRedex(newValue);
    if (e.target.value) {
      this.getRegionList(e.target.value);
      this.shouldBlockNavigation = true;
      this.getEthnicityBasedOnCountry(e.target.value);
    }
  }

  updateRegion(e) {
    var newValue = {};
    newValue.region = e.target.value;
    this.props.updateUserdataRedex(newValue);
    this.shouldBlockNavigation = true;


  }

  onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      var newValue = {};
      newValue.profilePic = URL.createObjectURL(event.target.files[0]);
      this.shouldBlockNavigation = true;

      this.setState({ postFile: event.target.files[0] });
      this.props.updateUserdataRedex(newValue);

    }
  };

  updateEthnicity = (e) => {
    if (e.target.value) {
      this.setState({ ethnicity: e.target.value })
      this.shouldBlockNavigation = true;
    }
  }

  onSubmitProfile() {
    let postData = new FormData();
    postData.append("profile_pic", this.state.postFile);
    postData.append("fname", this.props.userData.name);
    postData.append("sname", this.props.userData.lastName);
    postData.append("email", this.props.userData.email);
    postData.append("image", this.props.userData.profilePic);
    postData.append("nickname", this.props.userData.nickname);
    postData.append("country", this.props.userData.country);
    postData.append("region", this.props.userData.region);

    postData.append("gender", this.props.userData.gender);
    postData.append("address1", this.props.userData.address1);
    postData.append("address2", this.props.userData.address2);
    postData.append("city", this.props.userData.city);
    postData.append("countryState", this.props.userData.countryState);
    postData.append("postcode", this.props.userData.postcode);
    postData.append("phoneNumber", this.props.userData.phoneNumber);
    postData.append("permission_contact", this.props.userData.permission_contact);
    postData.append("ethnicity", this.state.ethnicity);


    let url = constand.BACKEND_URL + "/api/account/basicinformation";
    let authData;
    if (localStorage.getItem('userAuthToken')) {
      authData = JSON.parse(localStorage.getItem('userAuthToken'));
    } else {
      authData = JSON.parse(localStorage.getItem("user"));
    }

    this.setState({ submitted: true })
    if (!this.props.userData.name || !this.props.userData.lastName || !this.props.userData.email || !this.props.userData.phoneNumber) {
      return;
    }
    this.setState({ loading: true })

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: authData.token
      }
    };
    axios
      .post(url, postData, config)
      .then(
        response => {
          localStorage.setItem('country', response.data.user.countryCode);
          this.shouldBlockNavigation = false;
          this.props.fetchUserDetails()

          this.setState({
            offset: constand.CONSTZERO,
            postComment: "",
            postImage: "",
            postFile: {},
            submitted: false, loading: false
          });
          toast.success(response.data.message);

        },
        error => {
          toast.error(error.data.message);
        }
      )
  }

  handleBlockedNavigation = (lastLocation) => {
    if (!this.state.isDirtyModalOpen) {
      this.setState({ isDirtyModalOpen: true, lastLocation: lastLocation })
      return false;
    }
    return true;
  };

  closeConfirmationPopup = (val) => {
    if (val === 'Yes') {
      this.props.history.push(this.state.lastLocation);
    } else {
      this.onSubmitProfile();
    }
    this.setState({ isDirtyModalOpen: false });
  }

  render() {
    const { submitted, loading, countryCode, ethnicity } = this.state;
    return (
      <React.Fragment>
        <Helmet>
          <title>{constand.ACCOUNT_BASIC_TITLE}{constand.BEAM}</title>
          <meta property="og:title" content={constand.ACCOUNT_BASIC_TITLE + constand.BEAM} />
          <meta property="og:description" content={constand.ACCOUNT_BASIC_DESC} />
          <meta property="og:image" content={constand.ACCOUNT_BASIC_PAGE_IMAGE} />
          <meta property="og:url" content={window.location.href} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="og:site_name" content="Beam" />
          <meta name="twitter:image:alt" content={constand.ACCOUNT_BASIC_PAGE_IMAGE_ALT} />
        </Helmet>

        <Prompt
          when={this.shouldBlockNavigation}
          message={this.handleBlockedNavigation}
        />
        {//Object.keys(this.props.userData).length > 0 &&
          //this.props.userData.constructor === Object && 
          (
            <div className="">
              <div className="text-new">
                <p className="font-medium black-txt font-21 m-t-10 member-txt">
                  Account Details
                </p>
                <div className="avatar-upload col-md-12 clearfix p-0 m-t-20">
                  <div className="avatar-preview">
                    <img
                      className="img-fluid rounded-circle"
                      src={
                        this.props.userData.profilePic
                          ? constand.S3_API_IMG+'/profile/'+ this.props.userData.profilePic
                          : constand.WEB_IMAGES + "no-image.png"
                      }
                    />
                  </div>
                  <a
                    className="font-book font-16  upload-btn"
                    href="javascript:void(0)"
                    onClick={() => {
                      document.getElementById("post_image").click();
                    }}
                  >
                    <u>Upload new image</u>
                    <input
                      type="file"
                      onChange={this.onImageChange}
                      className="filetype"
                      style={{ display: "none" }}
                      accept="image/x-png,image/jpg,image/jpeg"
                      id="post_image"
                    />
                  </a>
                </div>
              </div>
              <div className="col-md-12 p-t-20 clearfix">
                <div className="row account_basic_info">
                  <div className="col-lg-6 col-md-6 col-sm-6 m-b-10 p-l-0">
                    <label
                      className="font-14 black-txt font-semibold col-sm-12  pl-0"
                      htmlFor="name"
                    >
                      First Name <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control input_field font-qregular "
                      name="name"
                      placeholder="Firstname"
                      type="text"
                      onChange={this.handleChange}
                      value={this.props.userData.name}
                    />
                    {submitted && !this.props.userData.name && (
                      <p className="help-block text-danger">
                        This information is required
                      </p>
                    )}
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-6 m-b-10 p-l-0">
                    <label
                      className="font-14 black-txt font-semibold col-sm-12  pl-0"
                      htmlFor="lastName"
                    >
                      Last Name <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control input_field font-qregular  input-control"
                      name="lastName"
                      placeholder="Lastname"
                      type="text"
                      onChange={this.handleChange}
                      value={this.props.userData.lastName}
                    />
                    {submitted && !this.props.userData.lastName && (
                      <p className="help-block text-danger">
                        This information is required
                      </p>
                    )}
                  </div>

                </div>
                <div className="row account_basic_info">
                  <div className="col-lg-12 col-md-12 col-sm-12 m-b-10 p-l-0">
                    <label
                      className="font-14 black-txt font-semibold col-sm-12  pl-0"
                      htmlFor="nickname"
                    >
                      Username
                    </label>
                    <input
                      className="form-control input_field font-qregular "
                      name="nickname"
                      placeholder="Username"
                      type="text"
                      onChange={this.handleChange}
                      value={this.props.userData.nickname}
                    />
                  </div>
                  {/* submitted && !this.props.userData.nickname && (
                    <p className="help-block text-danger">
                      This information is required
                    </p>
                  ) */}
                </div>
                <div className="row account_basic_info">
                  <div className="col-lg-12 col-md-12 col-sm-12 m-b-10 p-l-0">
                    <label
                      className="font-14 black-txt font-semibold col-sm-12  pl-0"
                      htmlFor="email"
                    >
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control input_field font-qregular "
                      name="email"
                      placeholder="Email Address"
                      type="text"
                      onChange={this.handleChange}
                      value={this.props.userData.email}
                    />
                  </div>
                  {submitted && !this.props.userData.email && (
                    <p className="help-block text-danger">
                      This information is required
                    </p>
                  )}
                </div>
                <div className="row">
                  <div className="col-lg-6 col-md-12 col-sm-12 m-b-10 p-l-0">
                    <label className="font-14 black-txt font-semibold col-sm-12  pl-0">
                      Your gender
                    </label>
                    <div className="sel_options form-control input_field font-qregular ">
                      <span className="arrow_sel"></span>
                      <select
                        name="gender"
                        value={this.props.userData.gender}
                        className=""
                        onChange={this.handleChange}
                      >
                        <option>Select gender</option>
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                      </select>
                    </div>
                  </div>
                  {(countryCode == 'gb' || countryCode == 'us') &&
                    <div className="col-lg-6 col-md-12 col-sm-12 m-b-10 p-l-0">
                      <label className="font-14 black-txt font-semibold col-sm-12  pl-0">
                        Your ethnicity
                      </label>
                      <div className="sel_options form-control input_field font-qregular ">
                        <span className="arrow_sel"></span>
                        <select
                          value={ethnicity}
                          name="ethnicity"
                          className=""
                          onChange={this.updateEthnicity}
                        >
                          <option>Select ethnicity</option>
                          {this.state.ethnicityList && this.state.ethnicityList.length > 0 && this.state.ethnicityList.map((list, key1) => {
                            return (
                              list.options.map((item, key) => {
                                return (
                                  <option value={item}>
                                    {item}
                                  </option>
                                );
                              })
                            )
                          })
                          }
                        </select>
                      </div>
                    </div>
                  }
                </div>
                <div className="row">
                  <div className="col-lg-8 col-md-12 col-sm-12 m-b-10 p-l-0 phone_inputs_field">
                    <label className="font-14 black-txt font-semibold col-sm-12  pl-0">
                      Your phone number <span className="text-danger">*</span>
                    </label>

                    <PhoneInput
                      country={this.props.userData.phoneNumber ? '' : countryCode}
                      value={this.props.userData.phoneNumber ? this.props.userData.phoneNumber.toString() : this.props.userData.phoneNumber}
                      onChange={phoneNumber => {
                        var newValue = {};
                        newValue['phoneNumber'] = phoneNumber;
                        this.props.updateUserdataRedex(newValue);
                        this.shouldBlockNavigation = true;
                      }}
                      inputClass="w-100 input_field font-qregular"
                      inputProps={{
                        name: 'phoneNumber',
                      }}
                    />
                    {submitted && !this.props.userData.phoneNumber && (
                      <p className="help-block text-danger">
                        This information is required
                      </p>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8 col-md-12 col-sm-12 m-b-10 p-l-0">
                    <label className="font-14 black-txt font-semibold col-sm-12  pl-0">
                      Your country
                    </label>
                    <div className="sel_options form-control input_field font-qregular ">
                      <span className="arrow_sel"></span>
                      <select
                        value={this.props.userData.country}
                        className=""
                        onChange={this.updateCountry}
                      >
                        <option>Select country</option>
                        {this.props.countriesList.map((item, key) => {
                          return (
                            <option key={"country_" + item.id} value={item.id}>
                              {item.countryName}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8 col-md-9 col-sm-12">
                    <div className="row">
                      <div className="col-lg-5 col-md-6 col-sm-12 m-b-10 p-l-0">
                        <label className="font-14 black-txt font-semibold col-sm-12  pl-0">
                          Flat, Apt, Suite etc.
                        </label>
                        <input
                          type="text"
                          className="form-control input_field font-qregular "
                          id="address1"
                          aria-describedby="emailHelp"
                          placeholder=""
                          name="address1"
                          value={this.props.userData.address1}
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="col-lg-7 col-md-6 col-sm-12 m-b-10 p-l-0">
                        <label className="font-14 black-txt font-semibold col-sm-12  pl-0">
                          Street address
                        </label>
                        <input
                          type="text"
                          className="form-control input_field font-qregular"
                          id="address2"
                          aria-describedby="emailHelp"
                          placeholder=""
                          name="address2"
                          value={this.props.userData.address2}
                          onChange={this.handleChange}
                        />

                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8 col-md-12 col-sm-12">
                    <div className="row">
                      <div className="col-lg-6 col-md-12 col-sm-12 m-b-10 p-l-0">
                        <label className="font-14 black-txt font-semibold col-sm-12  pl-0">
                          City
                        </label>
                        <input
                          type="text"
                          className="form-control input_field font-qregular"
                          id="city"
                          aria-describedby="emailHelp"
                          placeholder=""
                          name="city"
                          value={this.props.userData.city}
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="col-lg-6 col-md-12 col-sm-12 m-b-10 p-l-0">
                        <label className="font-14 black-txt font-semibold col-sm-12  pl-0">
                          County or State
                        </label>
                        <input
                          type="text"
                          className="form-control input_field font-qregular"
                          id="countryState"
                          aria-describedby="emailHelp"
                          placeholder=""
                          name="countryState"
                          value={this.props.userData.countryState}
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4 col-md-12 col-sm-12 m-b-10 p-l-0">
                    <label className="font-14 black-txt font-semibold col-sm-12  pl-0">
                      Postcode or Zipcode
                    </label>
                    <input
                      type="text"
                      className="form-control input_field font-qregular "
                      id="postcode"
                      aria-describedby="emailHelp"
                      placeholder=""
                      name="postcode"
                      value={this.props.userData.postcode}
                      onChange={this.handleChange}
                    />

                  </div>
                </div>
                <div className="row toggle-btns float-left w-100 m-b-30">
                  <div className="col-lg-12 col-md-12 col-sm-12 m-b-10 m-t-20 p-l-0 d-flex align-items-center">
                    <span className="font-16 font-qregular black-txt col-11 p-0">I consent to being contacted by any employee or contractor of Beam in an emergency situation.</span>
                    <label className="switch m-l-10 pull-right col-1 p-0 radio_slider" htmlFor="permission_contact">
                      <input type="checkbox" name="permission_contact" id="permission_contact" checked={this.props.userData.permission_contact} onChange={() => {
                        var newValue = {};
                        newValue['permission_contact'] = !this.props.userData.permission_contact;
                        this.props.updateUserdataRedex(newValue);
                        this.shouldBlockNavigation = true;
                      }} value={this.props.userData.permission_contact} />
                      <div className="slider round"></div>
                    </label>
                    {/* submitted && !permission_contact && (
                      <p className="help-block text-danger">
                        We require this consent to allow you to sign up to this class.  If you would rather not share this information please feel free to check out our on-demand classes instead.
                      </p>
                    ) */}
                  </div>
                </div>

                <div className="save_chnges_btn">
                  <div className="col-lg-12 col-md-12 col-sm-12 m-b-10 m-t-20 p-l-0 row">
                    <button
                      disabled={loading}
                      onClick={this.onSubmitProfile}
                      className="btn btn-purple-inverse font-14 font-medium save-btn"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        {/* Object.keys(this.props.userData).length === 0 &&
          this.props.userData.constructor === Object && (
            <div>
              <span>No data found!</span>
            </div>
          ) */}

        <ConfirmationPopup
          title="Want to save changes?"
          desc="We noticed you have made changes to your basic info but not saved them.  Would you like to save these changes?"
          yesButton="Cancel changes"
          noButton="Save changes"
          isConfirmation={true}
          is_model_open={this.state.isDirtyModalOpen}
          isConfirmation={true}
          closeConfirmationPopup={this.closeConfirmationPopup} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    logged_userData: state.header.logged_userData,

  };
};

const mapDispatchToProps = {
  fetchUserDetails,
  getRegionList,
  getCountriesList,
  updateUserdataRedex,
  getTagsBasedOnType,
  getOnboardingTags
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountBasicInfoComponent);
