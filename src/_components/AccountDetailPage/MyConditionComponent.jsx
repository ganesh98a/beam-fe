import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { healthCondition, start_loader, stop_loader, updateUserdataRedex, updateMyConditions, updateInitialCondition, logout, isAuth, registerformUpdate, fetchConditionRelationships, getPlanByCountry, setStep, setConditionIndex, getLicenseList, setExploreConditions, updateUserConditions, fetchUserDetails } from "../../actions";
import { commonService } from "../../_services";
import { toast } from "react-toastify";
import * as constand from "../../constant";
import { Helmet } from "react-helmet";
import CookieConsent, { Cookies } from "react-cookie-consent";
import ConditionOnboardingComponent from "./ConditionOnboardingComponent";
import _ from 'lodash';

class MyConditionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.conditonClassList = [...constand.CONDITION_CLASS_LIST];
    this.state = {
      selectedCondition_list: [],
      isConditionModalOpen: false,
      authDataMycondition: [],
    };
    this.updateHealthCondition = this.updateHealthCondition.bind(this);
    this.authData = JSON.parse(localStorage.getItem('userDetails')) || this.props.logged_userData;
  }
  componentDidMount() {

    console.log('authData', this.authData)
    //this.props.fetchConditionRelationships();
    //this.setRegisterForm();
  }

  componentWillReceiveProps() {
    this.conditonClassList = [...constand.CONDITION_CLASS_LIST];
  }

  getColorClass() {
    var retrunClass = this.conditonClassList.pop();
    this.conditonClassList.unshift(retrunClass);
    return retrunClass;
  }

  updateHealthCondition(item, isSkip = false, isRemove = false) {
    console.log('updateHealthCondition', item)
    var temp = []; //[...this.props.userData.conditionList];
    var tempConditionlist = [...this.props.userData.conditionList];
    var oldUserData = { ...this.props.userData };
    var index = this.props.userData.conditionList.findIndex(x => x === item.id);
    if (index > -1) {
      temp.splice(index, 1);
      tempConditionlist.splice(index, 1);
    } else {
      temp.push(item.id);
      tempConditionlist.push(item.id);
    }
    var newValue = {};
    newValue.conditionList = tempConditionlist;
    console.log('newValue', newValue)
    this.updateMyConditions(temp, oldUserData, isSkip, isRemove);
    this.props.updateUserdataRedex(newValue);
    var me = this;
    this.props.healthcondition_list.map(function (list_item) {
      if (newValue.conditionList.length > 1) {
        me.props.updateInitialCondition(constand.CONDITION);
      } else if (list_item.id === newValue.conditionList[0]) {
        me.props.updateInitialCondition(list_item.tag);
      }
    });

  }

  updateMyConditions(myconditionList, oldUserData, isSkip = false, isRemove = false) {

    var myCoditionList = {
      conditionId: myconditionList,
      condition_professions: this.props.registerFormvalues.condition_professions,
      condition_membership: this.props.registerFormvalues.condition_membership,
      registerFormvalues: this.props.registerFormvalues
    };
    if (isRemove) {
      myCoditionList.condition_professions = []
    }
    console.log('myCoditionList', myCoditionList)
    this.props.updateMyConditions(myCoditionList).then(
      response => {
        if (!isRemove) {
          const { from } = { from: { pathname: "/on-demand/" + this.state.health_condition[0].tag.replace(/ /g, ' ') } };
          this.props.history.push(from);
        }
        var tempUserData = { ...this.props.userData };
        console.log('updateMyConditions-response', response)
        console.log('tempUserData', tempUserData)
        tempUserData.UserConditions = response.userConditions;
        tempUserData.membershipData.userPlanDetails = response.userPlanDetails;
        this.props.updateUserdataRedex(tempUserData);
        this.props.setExploreConditions(response.userConditions, this.props.healthcondition_list)
        toast.success(response.message);
        this.closeModel();
      },
      () => {
        this.props.updateUserdataRedex(oldUserData);
        // toast.error(error);
        this.closeModel();
      }
    );
  }

  closeModel = () => {
    this.setState({ isConditionModalOpen: false });
  }

  changeHealthCondition = (item) => {
    var temp = [];

    temp.push(item);
    this.setState({ health_condition: temp });
    this.props.registerFormvalues.health_condition = temp;
    this.props.registerFormvalues.condition_professions = [];

    /* if (this.props.userData.conditionList && this.props.userData.conditionList.includes(item.id)) {
      this.updateHealthCondition(item, false, true)
    } else { */
    this.setState({ isConditionModalOpen: true })
    this.props.setConditionIndex(0);
    this.props.setStep(11);
    //}
    if (this.props.userData.conditionList && this.props.userData.conditionList.includes(item.id)) {
      this.setState({ isUpdate: true })
      this.populateExistingData(item.id);
    } else {
      this.setState({ isUpdate: false })
      this.props.registerformUpdate(this.props.registerFormvalues)

    }

  }

  populateExistingData = (conditionId) => {

    var selectedCondition = this.authData.UserConditions.filter(function (item) {
      return (item.conditionId == conditionId)
    })
    console.log('populateExistingData---', selectedCondition)
    this.props.registerFormvalues.condition_professions = selectedCondition
    this.props.registerFormvalues.profession = constand.Resgister_condition_relationship.findIndex(x => x === selectedCondition[0].conditionRelationship).toString();
    this.props.registerFormvalues.healthcondition_livewith = constand.Resgister_caregiver_type.findIndex(x => x === selectedCondition[0].caregiverType).toString();
    this.props.registerFormvalues.midicalcondition_livewith = constand.clinician_type.findIndex(x => x === selectedCondition[0].profession).toString();

    this.props.registerFormvalues.cancer_comordities = commonService.returnTagId('pc-comorbidities', this.authData.Tags);
    this.props.registerFormvalues.cancer_treatment = commonService.returnTagId('pc-treatment', this.authData.Tags);
    this.props.registerFormvalues.cf_comordities = commonService.returnTagId('cf-comorbidities', this.authData.Tags);
    this.props.registerFormvalues.cf_disease_severity = commonService.returnTagId('cf-disease-severity', this.authData.Tags);
    this.props.registerFormvalues.comorbidities = commonService.returnTagId('comorbidities', this.authData.Tags);
    this.props.registerFormvalues.kidney_care_provider = commonService.returnTagId('kidney-care-provider', this.authData.Tags);
    this.props.registerFormvalues.movement_prefs = commonService.returnTagId('movementPrefs', this.authData.Tags);
    console.log('myconditionsthis.props.registerFormvalues',this.props.registerFormvalues)
    this.props.registerformUpdate(this.props.registerFormvalues)
  }

  updateUserTags = () => {
    var tempConditionlist = [this.props.registerFormvalues.condition_professions[0].conditionId];
    if (tempConditionlist) {
      var myCoditionList = {
        conditionId: tempConditionlist,
        condition_professions: this.props.registerFormvalues.condition_professions,
        condition_membership: this.props.registerFormvalues.condition_membership,
        registerFormvalues: this.props.registerFormvalues
      };
      this.props.updateUserConditions(myCoditionList).then(() => {
        this.props.fetchUserDetails();
      })
      this.closeModel();

    }
  }

  returnConditionBasedData = (item, type) => {
    var label;
    switch (type) {
      case 'connection':
        var connectionCondition = _.filter(
          this.props.userData.UserConditions, function (o) {
            return o.conditionId == item.id;
          }
        );
        //label = 'None';
        /* need to ask client
         if (connectionCondition.length) {
          var tempConnection = connectionCondition[0];
          label = tempConnection.conditionRelationship ? tempConnection.conditionRelationship : (tempConnection.caregiverType ? tempConnection.caregiverType : (tempConnection.profession ? tempConnection.profession : 'None'))
        } */
        label = connectionCondition.length ? connectionCondition[0].conditionRelationship : 'None';
        break;
      case 'comorbidities':
        var type;
        if (item.tag == constand.CANCER_CONDITION)
          type = constand.PC_COMORBIDITIES;
        else if (item.tag == constand.KR_CONDITION)
          type = constand.KD_COMORBIDITIES;
        else if (item.tag == constand.CONDITION)
          type = constand.CF_COMORBIDITIES;

        var comorditiesData = _.filter(
          this.props.userData.Tags, function (o) {
            return (o.type == type) ? o.type : "";
          }
        );
        label = comorditiesData.map(e => e.tag).toString();
        break;
      case 'clinics':
        var clinicData = _.filter(
          this.props.userData.UserConditions, function (o) {
            return o.conditionId == item.id;
          }
        );
        label = 'None';
        if (clinicData.length) {
          label = clinicData[0].clinicName ? clinicData[0].clinicName : (clinicData[0].Clinic ? clinicData[0].Clinic.clinicName : 'None')
        }
        break;
      case 'severity':
        let severityData = _.filter(
          this.props.userData.Tags, function (o) {
            return o.type == constand.CF_DISEASE_SEVERITY;
          }
        );
        label = severityData.map(e => constand.SEVERITY_TAGS[e.tag]).toString();
        break;
      case 'careprovider':
        var careProvider = _.filter(
          this.props.userData.Tags, function (o) {
            return item.tag == constand.KR_CONDITION ? o.type == constand.KIDNEY_CARE_PROVIDER : "";
          }
        );
        label = careProvider.map(e => e.tag).toString();
        break;
      case 'treatment':
        var treatmentData = _.filter(
          this.props.userData.Tags, function (o) {
            return item.tag == constand.CANCER_CONDITION ? o.type == constand.PC_TREATMENT : "";
          }
        );
        label = treatmentData.map(e => e.tag).toString();
        break;
      case 'movement':
        var movementData = _.filter(
          this.props.userData.Tags, function (o) {
            return item.tag == constand.CONDITION ? o.type == constand.CF_MOVEMENT_PREFS : "";
          }
        );
        label = movementData.map(e => e.tag).toString();
        break;
      default:
        break;
    }
    return label;
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>{constand.ACCOUNT_CONDITION_TITLE}{constand.BEAM}</title>
          <meta property="og:title" content={constand.ACCOUNT_CONDITION_TITLE + constand.BEAM} />
          <meta property="og:description" content={constand.ACCOUNT_CONDITION_DESC} />
          <meta property="og:image" content={constand.ACCOUNT_CONDITION_PAGE_IMAGE} />
          <meta property="og:url" content={window.location.href} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="og:site_name" content="Beam" />
          <meta name="twitter:image:alt" content={constand.ACCOUNT_CONDITION_PAGE_IMAGE_ALT} />
        </Helmet>
        <p className="font-medium black-txt font-21 m-t-10 m-b-30">My Conditions</p>


        {this.props.healthcondition_list.map((item, key) => {
          console.log("item", item);
          return (
            <div>
              <div className="col-md-12 ">
                <div className="row">
                  {/* <button key={"condition_" + key} onClick={() => this.changeHealthCondition(item)} className={"cond-btn font-semibold float-left capitalize_text " + this.getColorClass()} disabled={(this.props.userData.conditionList && this.props.userData.conditionList.includes(item.id))}>
                          {item.tag}
                          {(this.props.userData.conditionList && this.props.userData.conditionList.includes(item.id)) && <img src={constand.WEB_IMAGES + "tick.png"} alt="" />}
                        </button> */}
                  <div className="col-md-8 p-l-0">
                    <span className="font-medium black-txt font-21 capitalize_text">{item.tag}</span>
                  </div>
                  <div className="col-md-4 text-center p-l-0 p-r-0">
                    <button
                      disabled={this.state.loading}
                      key={"condition_" + key} onClick={() => this.changeHealthCondition(item)} className={"w-100 btn font-semibold text-center " + ((this.props.userData.conditionList && this.props.userData.conditionList.includes(item.id)) ? "btn-purple" : "btn-purple-inverse")}
                    >
                      {(this.props.userData.conditionList && this.props.userData.conditionList.includes(item.id)) ?
                        "Update details" : "Add condition"
                      }
                    </button>
                  </div>

                  <div className="col-md-12 p-0"> <hr></hr></div>
                  {(this.props.userData.conditionList && this.props.userData.conditionList.includes(item.id)) &&
                    <>
                      <div className="col-md-12">
                        <div className="row">

                          <div className="col-md-6 m-b-5 p-l-0">
                            <p className="font-16 font-semibold">
                              Your connection to the condition:</p>
                          </div>
                          <div className="col-md-6 p-l-0">
                            <p className="font-16 font-medium">
                              {this.returnConditionBasedData(item, 'connection')}</p>
                          </div>

                          <div className="col-md-6 m-b-5 p-l-0">
                            <p className="font-16 font-semibold">
                              Comorbidities:
                            </p>
                          </div>
                          <div className="col-md-6 p-l-0">
                            <p className="font-16 font-medium">
                              {this.returnConditionBasedData(item, 'comorbidities')}</p>
                          </div>
                          {/* (item.tag == constand.CONDITION) &&
                            <>
                              <div className="col-md-6 m-b-5 p-l-0">
                                <p className="font-16 font-semibold">
                                  Movement Prefs:
                                </p>
                              </div>
                              <div className="col-md-6 p-l-0">
                                <p className="font-16 font-medium">
                                  {this.returnConditionBasedData(item, 'movement')}</p>
                              </div>
                            </> */
                          }
                          {(item.tag == constand.CANCER_CONDITION) &&
                            <>
                              <div className="col-md-6 m-b-5 p-l-0">
                                <p className="font-16 font-semibold">
                                  Treatment:
                                </p>
                              </div>
                              <div className="col-md-6 p-l-0">
                                <p className="font-16 font-medium">
                                  {this.returnConditionBasedData(item, 'treatment')}</p>
                              </div>
                            </>
                          }
                          {(item.tag == constand.CONDITION || item.tag == constand.CANCER_CONDITION) || (item.tag == constand.KR_CONDITION ) &&
                            <>
                              <div className="col-md-6 m-b-5 p-l-0">
                                <p className="font-16 font-semibold">
                                  Your clinic:
                                </p>
                              </div>
                              <div className="col-md-6 p-l-0">
                                <p className="font-16 font-medium">
                                  {this.returnConditionBasedData(item, 'clinics')}</p>
                              </div>
                            </>
                          }
                          {item.tag == constand.KR_CONDITION &&
                            <>
                              <div className="col-md-6 m-b-5 p-l-0">
                                <p className="font-16 font-semibold">
                                  Care provider:
                                </p>
                              </div>
                              <div className="col-md-6 p-l-0">
                                <p className="font-16 font-medium">
                                  {this.returnConditionBasedData(item, 'careprovider')}</p>
                              </div>
                            </>
                          }
                          {item.tag == constand.CONDITION &&
                            <>
                              <div className="col-md-6 m-b-5 p-l-0">
                                <p className="font-16 font-semibold">
                                  Your health over the past 12 months:
                                </p>
                              </div>
                              <div className="col-md-6 p-l-0">
                                <p className="font-16 font-medium">
                                  {this.returnConditionBasedData(item, 'severity')}</p>
                              </div>
                            </>
                          }
                        </div>
                      </div>
                      <div className="col-md-12 p-0"> <hr></hr></div>
                    </>
                  }
                </div>
              </div>
            </div>
          )
        })}


        <ConditionOnboardingComponent
          ismodel_open={this.state.isConditionModalOpen}
          closeModel={this.closeModel}
          conditionList={this.props.healthcondition_list}
          submitCondition={this.updateHealthCondition}
          isUpdateMyConditions={this.state.isUpdate}
          updateUserTags={this.updateUserTags}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    healthcondition_list: state.register.healthcondition_list,
    userData: state.header.logged_userData,
    registerFormvalues: state.register.registerFormValues,
  };
};

const mapDispatchToProps = {
  healthCondition, start_loader, stop_loader, updateUserdataRedex, updateMyConditions, updateInitialCondition, logout, isAuth, registerformUpdate, fetchConditionRelationships, getPlanByCountry, setStep, setConditionIndex, getLicenseList, setExploreConditions, updateUserConditions, fetchUserDetails
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyConditionComponent);