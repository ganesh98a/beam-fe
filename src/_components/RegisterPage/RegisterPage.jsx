import React from 'react';
import { connect } from 'react-redux';
import * as constand from "../../constant";
import { Link } from 'react-router-dom';
import { NameComponent } from './NameComponent';
import UsernameComponent from "./UsernameComponent";
import EmailComponent from "./EmailComponent";
import PasswordComponent from "./PasswordComponent";
import { GenderComponent } from "./GenderComponent";
import ProfessionComponent from "./ProfessionComponent";
import CountryComponent from "./CountryComponent";
import HealthConditionComponent from "./HealthConditionComponent";
import ClinicComponent from "./ClinicComponent";
import { PurposeComponent } from "./PurposeComponent";
import PromocodeAppliedComponent from "./PromocodeAppliedComponent";
import KidneyCareNiceOneComponent from "./KidneyCareNiceOneComponent";
import EthnicityComponent from "./EthnicityComponent";
import ComorbiditiesComponent from "./ComorbiditiesComponent";
import KidneyConditionComponent from "./KidneyConditionComponent";
import { DobComponent } from "./DobComponent";
import HearAboutComponent from "./HearAboutComponent";
//import FirstMonthComponent from "./FirstMonthComponent";
//import TrialComponent from "./TrialComponent";
import { AlldoneComponent } from "./AlldoneComponent";
import { saveValues, nextStep, prevStep, registerformUpdate, getCountriesList, start_loader, stop_loader, healthCondition, hearabout, gotoStep, fetchConditionRelationships, setStep, getLicenseList } from '../../actions';
import { toast } from "react-toastify";
import SignupComponent from './SignupComponent';
import CaregiverComponent from './CaregiverComponent';
import MembershipComponent from './MembershipComponent';
import MembershipOptions from './MembershipOptions';
import CancerTreatment from './CancerTreatment';
import CancerComordities from './CancerComordities';
import ResearchNiceoneComponent from './ResearchNiceoneComponent';
import CryptoJS from 'crypto-js';
import { BehalfSomeoneComponent } from './BehalfSomeoneComponent';
import AsthmaPilotComponent from './AsthmaPilotComponent';
import MovementPrefsComponent from './MovementPrefsComponent';
import CFComorbiditiesComponent from './CFComorbiditiesComponent';
import SeverityConditionComponent from './SeverityConditionComponent';
const Cryptr = require('cryptr');

class RegisterPage extends React.Component {

  constructor(props) {
    super(props);
    this.submitRegister = this.submitRegister.bind(this);
    this.getCountriesList = this.getCountriesList.bind(this);
    this.healthCondition = this.healthCondition.bind(this);
    this.decodeInvitation = this.decodeInvitation.bind(this);
  }
  componentDidMount() {
    console.log('Register-this.props', this.props)
    console.log('this.props', this.props.registerFormValues)
    this.decodeInvitation()
  }
  decodeInvitation() {
    var invitationCode = this.props.match.params.invitationCode;
    console.log('invitationCode', invitationCode);
    if (invitationCode) {
      const cryptr = new Cryptr('myTotalySecretKey');
      // Decrypt
      /*  var bytes = CryptoJS.AES.decrypt(invitationCode, 'mykeytext');
       console.log('bytes==>',bytes.toString(CryptoJS.enc.Utf8))
       var originalText = bytes.toString(CryptoJS.enc.Utf8)//.replace('Por21Ld', /\//g);//.replace('xMl3Jk', /\+/g).replace('Ml32', /=/g); */
      var originalText = cryptr.decrypt(invitationCode);
      if (originalText) {
        var groupDetails = originalText.split('/');
        this.props.registerFormValues['research'] = true;
        this.props.registerFormValues['research_groupname'] = groupDetails[0];
        this.props.registerFormValues['research_condition'] = groupDetails[1];
        this.props.registerFormValues['email'] = groupDetails[2];
        this.props.registerformUpdate(this.props.registerFormValues)
        this.props.gotoStep(1)
      }
      console.log('originalText', originalText);
    }
  }
  componentWillMount() {
    // var user=localStorage.getItem('user');
    // user = JSON.parse(user);
    // if (user){
    //   window.location.href="/home";
    // }
    this.healthCondition();
    this.props.hearabout();
    this.getCountriesList();
    this.getConditionRelationships();
    this.getLicenseList();
  }

  getCountriesList() {
    this.props.getCountriesList().then(
      response => {
        this.props.stop_loader();
      },
      error => {
        this.props.stop_loader();
        toast.error(error);
      }
    );
  }

  getLicenseList() {
    this.props.getLicenseList().then(
      response => {
        this.props.stop_loader();
      },
      error => {
        this.props.stop_loader();
        toast.error(error);
      }
    );
  }

  healthCondition() {
    this.props.healthCondition().then(
      response => {
      },
      error => {
        toast.error(error);
      }
    );
  }
  /**
  to get condition list
  */
  getConditionRelationships() {
    this.props.fetchConditionRelationships().then(
      response => {
        this.props.stop_loader();
      },
      error => {
        this.props.stop_loader();
        toast.error(error);
      }
    );
  }
  submitRegister() {

  }

  render() {
    return (

      <div className="registerpage">
        <div id="register">
          <div className="fadeIn first text-center p-t-10 p-b-15 register_logo">
            <Link to="/home"><img src={constand.WEB_IMAGES + "logo.png"}  id="icon" className="logo-size" alt="User Icon" /></Link>
          </div>
          <div className="container">
            <div id="register-row" className="row justify-content-center align-items-center register-heading">
              <div id="register-column" className="col-md-10">
                <div id="register-box" className="col-md-12">
                  <div id="register-form" className="form">

                    {/* Step-0 */ this.props.step === 0 &&
                      //                   <SignupComponent registerFormvalues={this.props.registerFormValues}  registerformUpdate={this.props.registerformUpdate}   nextStep={this.props.nextStep} location={this.props.location} history={this.props.history} />
                      <SignupComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep} history={this.props.history} />

                    }
                    {/* Step-1 */ this.props.step === 1 &&
                      <NameComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep} />
                    }
                    {/* Step-2 */ this.props.step === 2 &&
                      <UsernameComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} />
                    }
                    {/* Step-3 */ this.props.step === 3 &&
                      <EmailComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} />
                    }
                    {/* Step-4 */ this.props.step === 4 &&
                      <PasswordComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} />
                    }
                    {/* Step-5 */ this.props.step === 8 &&
                      <GenderComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} />
                    }
                    {/* Step-6 */ this.props.step === 9 &&
                      <CountryComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} />
                    }
                    {/* Step-9 */ this.props.step === 10 &&
                      <HealthConditionComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} />
                    }
                    {/* Step-7 */ this.props.step === 11 &&
                      <ProfessionComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep} gotoStep={this.props.gotoStep} conditionRelationshipList={this.props.conditionRelationshipList}
                        prevStep={this.props.prevStep}  setStep={this.props.setStep} pageFrom="register" />
                    }
                    {/* Step-8 */ this.props.step === 12 &&
                      <CaregiverComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep} gotoStep={this.props.gotoStep} conditionRelationshipList={this.props.conditionRelationshipList}
                        prevStep={this.props.prevStep} pageFrom="register" />
                    }

                    {/* Step-10 */ this.props.step === 13 &&
                      <ClinicComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} clinic_direction={this.props.clinic_direction} pageFrom="register" />
                    }
                    {/* Step-11 */ this.props.step === 6 &&
                      <PurposeComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} setStep={this.props.setStep} pageFrom="register" />
                    }
                    {/* Step-12 */ this.props.step === 120 &&
                      <div className="step10">
                        <h3 className="text-center "><a className="pull-left" href="javascript:void(0)" onClick={() => this.props.prevStep()}><img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} /></a>Thanks! Nearly there!<Link
                          to="/home"
                          className="close-register orangefont"
                        >
                          X
                        </Link></h3>
                        <div className="thanksimg text-center">
                          <img src={constand.WEB_IMAGES + "thanks.png"} id="icon" className="img-fluid" alt="User thanks" />

                        </div>

                        <div className="row justify-content-center align-items-center">
                          <div className="input_section col-md-6 m-t-10">


                            <div id="register-link" className=" w-100 m-t-80 m-b-20 float-left">
                              <a href="javascript:void(0)" onClick={() => this.props.nextStep()} className="btn bluebtn float-left font-medium font-14 w-100 text-center">Next</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                    {/* Step-13 */ this.props.step === 5 &&
                      <DobComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} pageFrom="register" />
                    }
                    {/* Step-14 */ this.props.step === 14 &&
                      <HearAboutComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} location={this.props.location} history={this.props.history} pageFrom="register" />
                    }
                    {/* Step-15 */ this.props.step === 15 &&
                      <PromocodeAppliedComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} location={this.props.location} history={this.props.history} pageFrom="register" />

                    }
                    {/* Step-16 */ this.props.step === 16 &&
                      <KidneyCareNiceOneComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} location={this.props.location} history={this.props.history} pageFrom="register" />
                    }
                    {/* Step-17 */ this.props.step === 17 &&
                      <EthnicityComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} pageFrom="register" />
                    }
                    {/* Step-18 */ this.props.step === 18 &&
                      <ComorbiditiesComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} pageFrom="register" />
                    }
                    {/* Step-19 */ this.props.step === 19 &&
                      <KidneyConditionComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} pageFrom="register" />
                    }
                    {/* Step-20 */ this.props.step === 20 &&
                      <CancerTreatment registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} pageFrom="register" />
                    }
                    {/* Step-21 */ this.props.step === 21 &&
                      <CancerComordities registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} pageFrom="register" />
                    }
                    {/* Step-22 */ this.props.step === 22 &&
                      <ResearchNiceoneComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} location={this.props.location} history={this.props.history} pageFrom="register" />
                    }
                    {/* Step-23 */ this.props.step === 23 &&
                      <MembershipOptions registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} location={this.props.location} history={this.props.history} pageFrom="register" />
                    }
                    {/* Step-24 */ this.props.step === 24 &&
                      <BehalfSomeoneComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} location={this.props.location} history={this.props.history} pageFrom="register" setStep={this.props.setStep} />
                    }
                    {/* Step-25 */ this.props.step === 25 &&
                      <AsthmaPilotComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} location={this.props.location} history={this.props.history} pageFrom="register" setStep={this.props.setStep} />
                    }
                    {/* Step-26 */ this.props.step === 26 &&
                      <MovementPrefsComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} location={this.props.location} history={this.props.history} pageFrom="register" setStep={this.props.setStep} />
                    }
                    {/* Step-27 */ this.props.step === 27 &&
                      <CFComorbiditiesComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} location={this.props.location} history={this.props.history} pageFrom="register" setStep={this.props.setStep} />
                    }
                    {/* Step-28 */ this.props.step === 28 &&
                      <SeverityConditionComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                        prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} location={this.props.location} history={this.props.history} pageFrom="register" setStep={this.props.setStep} />
                    }
                    {/* Step-16 this.props.step === 16 &&
                      <FirstMonthComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                      prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} location={this.props.location} history={this.props.history}/>
                    */}
                    {/* Step-17  this.props.step === 16 &&
                      <MembershipComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                      prevStep={this.props.prevStep} gotoStep={this.props.gotoStep}/>
                    */}
                    {/* Step-18  this.props.step === 17 &&
                      <TrialComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                      prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} conditionRelationshipList={this.props.conditionRelationshipList} location={this.props.location} history={this.props.history}/>
                    */}
                    {/* Step-19  this.props.step === 19 &&
                      <AlldoneComponent registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                      prevStep={this.props.prevStep} gotoStep={this.props.gotoStep}/>
                    */}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );

  }
}

const mapStateToProps = state => {
  const {
    sending_data, step, user_data, registerFormValues, conditionRelationshipList, clinic_direction
  } = state.register;

  return {
    sending_data,
    step,
    user_data,
    registerFormValues,
    conditionRelationshipList,
    clinic_direction
  };
};

const mapDispatchToProps = {
  saveValues,
  nextStep,
  prevStep,
  gotoStep,
  setStep,
  registerformUpdate,
  getCountriesList,
  start_loader,
  stop_loader,
  healthCondition,
  hearabout,
  fetchConditionRelationships,
  getLicenseList
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterPage);
