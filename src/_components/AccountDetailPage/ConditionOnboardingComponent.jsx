import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import * as Errors from "../../Errors";
import {
    registerformUpdate,
    nextStep,
    prevStep,
    gotoStep,
    setStep,
    getLicenseList,
    getPlanByCountry,
    hearabout
} from "../../actions";
import { commonService } from "../../_services";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Modal from "react-responsive-modal";
import Slider from "react-slick";
import * as constand from "../../constant";
import { Helmet } from "react-helmet";
import ProfessionComponent from "../RegisterPage/ProfessionComponent";
import ClinicComponent from "../RegisterPage/ClinicComponent";
import CaregiverComponent from "../RegisterPage/CaregiverComponent";
import MembershipOptions from "../RegisterPage/MembershipOptions";
import ComorbiditiesComponent from "../RegisterPage/ComorbiditiesComponent";
import KidneyConditionComponent from "../RegisterPage/KidneyConditionComponent";
import CancerTreatment from "../RegisterPage/CancerTreatment";
import CancerComordities from "../RegisterPage/CancerComordities";
import AsthmaPilotComponent from "../RegisterPage/AsthmaPilotComponent";
import MovementPrefsComponent from "../RegisterPage/MovementPrefsComponent";
import CFComorbiditiesComponent from "../RegisterPage/CFComorbiditiesComponent";
import SeverityConditionComponent from "../RegisterPage/SeverityConditionComponent";
import HearAboutComponent from "../RegisterPage/HearAboutComponent";
import ResearchNiceoneComponent from "../RegisterPage/ResearchNiceoneComponent";
let valid = require("card-validator");

class ConditionOnboardingComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        console.log('ConditionOnboardingComponent-props', this.props)
        this.setRegisterForm();
        this.props.hearabout();
    }

    setRegisterForm = () => {
        let authData = JSON.parse(localStorage.getItem('userDetails')) || this.props.logged_userData;
        this.props.getLicenseList();
        this.props.getPlanByCountry(authData.country).then(response => {
            this.setState({ countryPlans: response.plans })
        });

        /* var getQueryString = window.location.search;
        if (getQueryString && getQueryString.indexOf('member') !== -1) {
            this.fetchPlans()
        } */
        this.props.registerFormValues.userid = authData.id;
        this.props.registerFormValues.firstname = authData.name;
        this.props.registerFormValues.age = commonService.calculateAge(moment(authData.dob).format("DD-MM-YYYY"));
        //this.props.registerFormValues.health_condition = this.props.conditionList;
        this.props.registerFormValues.country = authData.country;
        this.props.registerFormValues.region = authData.region;
        this.props.registerFormValues.condition_membership = [];
        //this.props.registerFormValues.condition_professions = authData.UserConditions;
        this.props.registerformUpdate(this.props.registerFormValues);
        this.props.setStep(11);
    }

    onCloseModal = () => { }

    render() {
        let promo_paln = (this.state.planData) ? this.state.planData : {};
        promo_paln.Plan = (promo_paln.Plan) ? promo_paln.Plan : {};
        var authData = this.props.logged_userData;
        return (
            <React.Fragment>

                <Modal
                    classNames={{
                        modal: "pricing-popup m-t-50 membership-popup"
                    }}
                    open={this.props.ismodel_open}
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
                                    {this.props.page_title}
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true" onClick={this.props.closeModel}>
                                        &times;
                                    </span>
                                </button>
                            </div>
                            <div className="modal-body body-padding--value pb-0" id="register-box">
                                {this.props.step === 11 &&
                                    <ProfessionComponent
                                        registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate}
                                        nextStep={this.props.nextStep}
                                        gotoStep={this.props.gotoStep}
                                        conditionRelationshipList={this.props.conditionRelationshipList}
                                        prevStep={this.props.prevStep}
                                        setStep={this.props.setStep}
                                        pageFrom='mycondition'
                                        isUpdateMyConditions={this.props.isUpdateMyConditions}
                                        updateUserTags={this.props.updateUserTags}
                                    />
                                }
                                {/* Step-8 */ this.props.step === 12 &&
                                    <CaregiverComponent
                                        registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate}
                                        nextStep={this.props.nextStep}
                                        gotoStep={this.props.gotoStep}
                                        conditionRelationshipList={this.props.conditionRelationshipList}
                                        prevStep={this.props.prevStep}
                                        gotoStep={this.props.gotoStep}
                                        pageFrom='mycondition'
                                        isUpdateMyConditions={this.props.isUpdateMyConditions}
                                        updateUserTags={this.props.updateUserTags}
                                    />
                                }
                                {this.props.step === 13 &&
                                    <ClinicComponent
                                        registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate}
                                        nextStep={this.props.nextStep}
                                        prevStep={this.props.prevStep}
                                        gotoStep={this.props.gotoStep}
                                        clinic_direction={this.props.clinic_direction}
                                        submitCondition={this.props.submitCondition}
                                        pageFrom='mycondition'
                                        isUpdateMyConditions={this.props.isUpdateMyConditions}
                                        updateUserTags={this.props.updateUserTags}
                                    />
                                }
                                {this.props.step === 14 &&
                                    <HearAboutComponent
                                        registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate}
                                        nextStep={this.props.nextStep}
                                        prevStep={this.props.prevStep}
                                        gotoStep={this.props.gotoStep}
                                        clinic_direction={this.props.clinic_direction}
                                        submitCondition={this.props.submitCondition}
                                        pageFrom='mycondition'
                                        health_conditionId={this.props.health_conditionId}
                                    />
                                }
                                {/* Step-22 */ this.props.step === 22 &&
                                    <ResearchNiceoneComponent
                                        registerFormvalues={this.props.registerFormValues}
                                        registerformUpdate={this.props.registerformUpdate}
                                        nextStep={this.props.nextStep}
                                        prevStep={this.props.prevStep}
                                        gotoStep={this.props.gotoStep}
                                        pageFrom="mycondition"
                                    />
                                }
                                {/* Step-23 */ this.props.step === 23 &&
                                    <MembershipOptions
                                        registerFormvalues={this.props.registerFormValues} registerformUpdate={this.props.registerformUpdate}
                                        nextStep={this.props.nextStep}
                                        prevStep={this.props.prevStep}
                                        gotoStep={this.props.gotoStep}
                                        location={this.props.location}
                                        history={this.props.history}
                                        submitCondition={this.props.submitCondition}
                                        pageFrom='mycondition'
                                        promocode={this.props.promocode}
                                        promoPlans={this.props.promoPlans}
                                        health_conditionId={this.props.health_conditionId}
                                        closeModel={this.props.closeModel}
                                        isUpdateMyConditions={this.props.isUpdateMyConditions}
                                        updateUserTags={this.props.updateUserTags}

                                    />
                                }
                                {/* Step-18 */ this.props.step === 18 &&
                                    <ComorbiditiesComponent
                                        registerFormvalues={this.props.registerFormValues}
                                        registerformUpdate={this.props.registerformUpdate}
                                        nextStep={this.props.nextStep}
                                        prevStep={this.props.prevStep}
                                        gotoStep={this.props.gotoStep}
                                        pageFrom='mycondition'
                                        isUpdateMyConditions={this.props.isUpdateMyConditions}
                                        updateUserTags={this.props.updateUserTags}
                                    />
                                }
                                {/* Step-19 */ this.props.step === 19 &&
                                    <KidneyConditionComponent
                                        registerFormvalues={this.props.registerFormValues}
                                        registerformUpdate={this.props.registerformUpdate}
                                        nextStep={this.props.nextStep}
                                        prevStep={this.props.prevStep}
                                        gotoStep={this.props.gotoStep}
                                        pageFrom='mycondition'
                                        isUpdateMyConditions={this.props.isUpdateMyConditions}
                                        updateUserTags={this.props.updateUserTags}
                                    />
                                }
                                {/* Step-20 */ this.props.step === 20 &&
                                    <CancerTreatment
                                        registerFormvalues={this.props.registerFormValues}
                                        registerformUpdate={this.props.registerformUpdate}
                                        nextStep={this.props.nextStep}
                                        prevStep={this.props.prevStep}
                                        gotoStep={this.props.gotoStep}
                                        pageFrom='mycondition'
                                        isUpdateMyConditions={this.props.isUpdateMyConditions}
                                        updateUserTags={this.props.updateUserTags}
                                    />
                                }
                                {/* Step-21 */ this.props.step === 21 &&
                                    <CancerComordities
                                        registerFormvalues={this.props.registerFormValues}
                                        registerformUpdate={this.props.registerformUpdate}
                                        nextStep={this.props.nextStep}
                                        prevStep={this.props.prevStep}
                                        gotoStep={this.props.gotoStep}
                                        pageFrom='mycondition'
                                        isUpdateMyConditions={this.props.isUpdateMyConditions}
                                        updateUserTags={this.props.updateUserTags}
                                    />
                                }
                                {/* Step-25 */ this.props.step === 25 &&
                                    <AsthmaPilotComponent
                                        registerFormvalues={this.props.registerFormValues}
                                        registerformUpdate={this.props.registerformUpdate}
                                        nextStep={this.props.nextStep}
                                        prevStep={this.props.prevStep}
                                        gotoStep={this.props.gotoStep}
                                        location={this.props.location}
                                        history={this.props.history}
                                        pageFrom="mycondition"
                                        setStep={this.props.setStep}
                                        isUpdateMyConditions={this.props.isUpdateMyConditions}
                                        updateUserTags={this.props.updateUserTags}
                                    />
                                }
                                {/* Step-26 */ /* this.props.step === 26 &&
                                    <MovementPrefsComponent
                                        registerFormvalues={this.props.registerFormValues}
                                        registerformUpdate={this.props.registerformUpdate}
                                        nextStep={this.props.nextStep}
                                        prevStep={this.props.prevStep}
                                        gotoStep={this.props.gotoStep}
                                        location={this.props.location}
                                        history={this.props.history}
                                        pageFrom="mycondition"
                                        setStep={this.props.setStep}
                                        isUpdateMyConditions={this.props.isUpdateMyConditions}
                                        updateUserTags={this.props.updateUserTags}
                                    /> */
                                }
                                {/* Step-27 */ this.props.step === 27 &&
                                    <CFComorbiditiesComponent
                                        registerFormvalues={this.props.registerFormValues}
                                        registerformUpdate={this.props.registerformUpdate}
                                        nextStep={this.props.nextStep}
                                        prevStep={this.props.prevStep}
                                        gotoStep={this.props.gotoStep}
                                        location={this.props.location}
                                        history={this.props.history}
                                        pageFrom="mycondition"
                                        setStep={this.props.setStep}
                                        isUpdateMyConditions={this.props.isUpdateMyConditions}
                                        updateUserTags={this.props.updateUserTags}
                                    />
                                }
                                {/* Step-28 */ this.props.step === 28 &&
                                    <SeverityConditionComponent
                                        registerFormvalues={this.props.registerFormValues}
                                        registerformUpdate={this.props.registerformUpdate}
                                        nextStep={this.props.nextStep}
                                        prevStep={this.props.prevStep}
                                        gotoStep={this.props.gotoStep}
                                        location={this.props.location}
                                        history={this.props.history}
                                        pageFrom="mycondition"
                                        setStep={this.props.setStep}
                                        isUpdateMyConditions={this.props.isUpdateMyConditions}
                                        updateUserTags={this.props.updateUserTags}
                                    />
                                }
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
        IP_Details: state.accountinfo.ip_data,
        logged_userData: state.header.logged_userData,
        registerFormValues: state.register.registerFormValues,
        step: state.register.step,
        clinic_direction: state.register.clinic_direction,
        conditionRelationshipList: state.register.conditionRelationshipList,
        healthcondition_list: state.register.healthcondition_list,
        page_title: state.register.page_title,

    };
};

const mapDispatchToProps = {
    registerformUpdate,
    nextStep,
    prevStep,
    gotoStep,
    setStep,
    getLicenseList,
    getPlanByCountry,
    hearabout
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConditionOnboardingComponent);
