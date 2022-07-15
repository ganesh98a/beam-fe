import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { start_loader, stop_loader, setStep, registerNewUser, setConditionIndex, getPromocodePaln } from "../../actions";
import * as constand from "../../constant";
import * as Errors from "../../Errors";
import { toast } from "react-toastify";
import moment from 'moment';
import _ from 'lodash';
import { commonService } from "../../_services";
import NoThanksModal from "./NoThanksModal";

class OnboardMembershipComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {},
            is_postnatal: false,
            submitted: false,
            disableButton: false,
            current_index: this.props.condition_index,
            shareData: 0,
            isDisablePromo: true,
            promoCodeErr: false,
            subscribedErr: false,
            promocode: '',
            promoPlans: {},
            isEligibleCheck: false,
            isSkip: false,
            isNoThanksModal: false,
            conditionName: ''
        };

        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.finalSubmit = this.finalSubmit.bind(this);
        this.eligibilityCheck = this.eligibilityCheck.bind(this);
        this.renderEligible = this.renderEligible.bind(this);
        this.renderNotEligible = this.renderNotEligible.bind(this);
        this.applyPromoCode = this.applyPromoCode.bind(this);
        this.renderPromoCodeData = this.renderPromoCodeData.bind(this);
        this.calculatePromoAccess = this.calculatePromoAccess.bind(this);
        this.getLongestLicense = this.getLongestLicense.bind(this);
        this.isUpdate = false;

    }
    componentDidMount() {
        this.props.start_loader();
        console.log('this.props-onboard', this.props)
        if ((this.props.pageFrom == 'membership' || this.props.pageFrom == 'mycondition') && this.props.promocode) {
            this.setState({ isEligibleCheck: true, promocode: this.props.promocode, promoPlans: this.props.promoPlans }, function () {
                this.calculatePromoAccess()
            });
            this.health_conditionId = this.props.health_conditionId;
        } else {
            if (this.props.registerFormvalues.health_condition.length) {
                this.eligibilityCheck();
            }
        }
    }
    eligibilityCheck() {
        console.log('this.props-hereabout', this.props)
        console.log('this.props.registerFormvalues', this.props.registerFormvalues)
        var eligibleData = [];
        if (this.props.pageFrom == 'register' || this.props.pageFrom == 'mycondition') {
            this.health_conditionId = this.props.registerFormvalues.health_condition[
                this.state.current_index
            ].id;
        } else if (this.props.pageFrom == 'membership') {
            this.health_conditionId = this.props.health_conditionId;
        }

        if (this.props.pageFrom == 'membership') {
            var conditionName = this.props.condition_name;
        } else {  //register page
            var health_condition = _.find(this.props.registerFormvalues.health_condition, { 'id': this.health_conditionId });
            var conditionName = health_condition ? health_condition.tag : '';
        }

        this.condition_professions = _.find(this.props.registerFormvalues.condition_professions, { 'conditionId': this.health_conditionId });
        var me = this;
        console.log('this.health_conditionId', this.health_conditionId)
        console.log('this.condition_professions', this.condition_professions)
        this.props.licenseList.map((item, index) => {
            console.log('licenseList-item', item)
            if (item.freeDays) {
                item.calCulatedDate = moment().add(item.freeDays, 'days').format('YYYY-MM-DD');
            } else if (item.accessEndDate) {
                item.calCulatedDate = moment(item.accessEndDate).utc().format('YYYY-MM-DD');
            }
            if (item.modalContent && typeof item.modalContent == 'string')
                this.props.licenseList[index].modalContent = JSON.parse(item.modalContent);
            var eligibilityCriteria = JSON.parse(item.eligibilityCriteria)
            eligibleData[index] = {};
            Object.keys(eligibilityCriteria).map(function (key) {
                switch (key) {
                    case 'conditionId':
                        if (eligibilityCriteria[key] == me.health_conditionId)
                            eligibleData[index][key] = true;
                        break;
                    case 'countryId':
                        if (eligibilityCriteria[key] == me.props.registerFormvalues.country)
                            eligibleData[index][key] = true;
                        break;
                    case 'age':
                        if (me.props.registerFormvalues.age >= eligibilityCriteria[key])
                            eligibleData[index][key] = true;
                        break;
                    case 'conditionRelationship':
                        if (me.condition_professions && eligibilityCriteria[key].indexOf(me.condition_professions.conditionRelationship) != -1)
                            eligibleData[index][key] = true;
                        break;
                    case 'clinicId':
                        console.log("eligibilityCriteria[key]", eligibilityCriteria[key])
                        if (me.condition_professions && eligibilityCriteria[key].indexOf(me.condition_professions.clinicId) != -1)
                            eligibleData[index][key] = true;
                        break;
                    case 'regionId':
                        if (eligibilityCriteria[key] == me.props.registerFormvalues.region)
                            eligibleData[index][key] = true;
                        break;
                }
            });
            if (Object.keys(eligibleData[index]).length === Object.keys(eligibilityCriteria).length) {
                console.log('**EQUAL***')
                eligibleData[index] = this.props.licenseList[index];
            } else {
                console.log('NOT-EQUAL', eligibleData)
                eligibleData.splice(index, 1)
            }
        })
        eligibleData = eligibleData.filter(value => Object.keys(value).length !== 0);
        this.setState({ isEligibleCheck: true, conditionName: conditionName })
        console.log('eligibleData', eligibleData);
        if (eligibleData.length > 1) {
            this.getLongestLicense(eligibleData)
        } else {
            if(eligibleData.length){
                eligibleData = eligibleData[0];
            }
            var isValid = this.checkLicenseValidity(eligibleData);
            console.log('isValid', isValid)
            this.props.registerFormvalues.eligible_license = {};

            if (isValid) {
                this.props.registerFormvalues.eligible_license = eligibleData;
            }
            this.props.registerformUpdate(this.props.registerFormvalues);
            this.props.setConditionIndex(this.state.current_index + 1);
            this.setState({ current_index: this.state.current_index + 1 });
        }
    }
    checkLicenseValidity = (eligibleData) => {
        var isValid = false;
        var now = moment().format('YYYY-MM-DD');
        var trialEnds = moment().add(14, 'days').format('YYYY-MM-DD'); //default 14 days
       // eligibleData = eligibleData.length > 0 ? eligibleData[0] : [];
        if (eligibleData.freeDays > 0 && eligibleData.freeDays != null && eligibleData.accessEndDate != null && eligibleData.accessEndDate != "0000-00-00") {
            //both are filled
            var FreeDays = moment().add(eligibleData.freeDays, 'days').format('YYYY-MM-DD');
            var accessEnd = moment(eligibleData.accessEndDate).utc().format('YYYY-MM-DD');
            var d1 = new Date(FreeDays);
            var d2 = new Date(accessEnd);
            if (d1.getTime() > d2.getTime())
                trialEnds = FreeDays;
            else
                trialEnds = accessEnd;
        } else if (eligibleData.freeDays > 0 && eligibleData.freeDays != null) {
            trialEnds = moment().add(eligibleData.freeDays, 'days').format('YYYY-MM-DD');
        } else if (eligibleData.accessEndDate && eligibleData.accessEndDate != null && eligibleData.accessEndDate != "0000-00-00") {
            trialEnds = moment(eligibleData.accessEndDate).utc().format('YYYY-MM-DD');
        }
        console.log('trialEnds', trialEnds)
        console.log('trialEnds-gettime=', new Date(trialEnds).getTime())
        console.log('now-gettime=', new Date().getTime())
        if (new Date(trialEnds).getTime() < new Date().getTime()) {
            //check the date should be greater than today
            var trialEnds = moment().add(14, 'days').format('YYYY-MM-DD'); //default 14days
        } else {
            isValid = true;
        }
        return isValid;
    }

    handleCheckboxChange(e) //for twoway binding checkbox
    {
        const { name } = e.target;
        this.setState({ shareData: !this.state.shareData });
        //this.props.registerFormvalues[name] = !this.props.registerFormvalues[name];
    }

    finalSubmit(isSkip, type) {
        console.log('this.health_conditionId', this.health_conditionId)
        this.setState({ submitted: true, promoCodeErr: false, subscribedErr: false, isDisablePromo: true, isSkip: isSkip, isNoThanksModal: false });
        if (!this.health_conditionId) {
            this.health_conditionId = this.props.registerFormvalues.health_condition[
                this.state.current_index - 1
            ].id;
        }
        var now = moment().format('YYYY-MM-DD');
        var trialEnds = moment().add(14, 'days').format('YYYY-MM-DD'); //default 14 days
        if (!this.state.shareData && Object.keys(this.props.registerFormvalues.eligible_license).length && this.props.registerFormvalues.eligible_license.modalContent && this.props.registerFormvalues.eligible_license.modalContent.consentSwitch === constand.SHARE_MANDATORY && !isSkip) {
            return;
        }
        if (!isSkip) {
            switch (type) {
                case 1:
                    console.log('type=1')

                    var isConfigEmailAlert = true;
                    if (this.props.registerFormvalues.eligible_license.freeDays > 0 && this.props.registerFormvalues.eligible_license.freeDays != null && this.props.registerFormvalues.eligible_license.accessEndDate != null && this.props.registerFormvalues.eligible_license.accessEndDate != "0000-00-00") {
                        //both are filled
                        console.log('feedays&access***')
                        var FreeDays = moment().add(this.props.registerFormvalues.eligible_license.freeDays, 'days').format('YYYY-MM-DD');
                        var accessEnd = moment(this.props.registerFormvalues.eligible_license.accessEndDate).utc().format('YYYY-MM-DD');
                        isConfigEmailAlert = false;
                        var d1 = new Date(FreeDays);
                        var d2 = new Date(accessEnd);
                        if (d1.getTime() > d2.getTime())
                            trialEnds = FreeDays;
                        else
                            trialEnds = accessEnd;

                    } else if (this.props.registerFormvalues.eligible_license.freeDays > 0 && this.props.registerFormvalues.eligible_license.freeDays != null) {
                        console.log('feedays***')
                        trialEnds = moment().add(this.props.registerFormvalues.eligible_license.freeDays, 'days').format('YYYY-MM-DD');
                        isConfigEmailAlert = false;
                    } else if (this.props.registerFormvalues.eligible_license.accessEndDate && this.props.registerFormvalues.eligible_license.accessEndDate != null && this.props.registerFormvalues.eligible_license.accessEndDate != "0000-00-00") {
                        console.log('accssEndDate***')
                        trialEnds = moment(this.props.registerFormvalues.eligible_license.accessEndDate).utc().format('YYYY-MM-DD');
                        isConfigEmailAlert = false;
                    }

                    if (new Date(trialEnds).getTime() < new Date().getTime()) {
                        //check the date should be greater than today
                        var trialEnds = moment().add(14, 'days').format('YYYY-MM-DD'); //default 14days
                        isConfigEmailAlert = true;
                    }

                    this.props.registerFormvalues.condition_membership.push({
                        PlanId: this.props.registerFormvalues.eligible_license.planId,
                        planStarts: now,
                        trialEnds: trialEnds,
                        UserId: this.props.registerFormvalues.userid,
                        current: 1,
                        conditionId: this.health_conditionId,
                        licenseId: this.props.registerFormvalues.eligible_license.id,
                        accessEndDate: this.props.registerFormvalues.eligible_license.accessEndDate,
                        freeDays: this.props.registerFormvalues.eligible_license.freeDays,
                        shareData: this.state.shareData,
                        isConfigEmailAlert: isConfigEmailAlert,
                        membershipType: 'license',
                    })
                    break;
                case 2:
                    //not eligible for license
                    console.log('type=2')

                    trialEnds = moment().add(14, 'days').format('YYYY-MM-DD');
                    this.props.registerFormvalues.condition_membership.push({
                        PlanId: this.props.countryPlans.id,
                        planStarts: now,
                        trialEnds: trialEnds,
                        UserId: this.props.registerFormvalues.userid,
                        current: 1,
                        conditionId: this.health_conditionId,
                        isConfigEmailAlert: false,
                        membershipType: this.props.pageFrom == 'membership' ? 'card' : 'free-trial',
                        licenseId: null
                    })
                    break;
                case 3:
                    //promo code apply
                    console.log('type=3')
                    var trialEnds = moment().format('YYYY-MM-DD'); //default 1 days
                    if (this.state.promoPlans.freeDays) {
                        trialEnds = moment().add(this.state.promoPlans.freeDays, 'days').format('YYYY-MM-DD');
                    } else if (this.state.promoPlans.accessEndDate && this.state.promoPlans.accessEndDate != null && this.state.promoPlans.accessEndDate != "0000-00-00") {
                        trialEnds = moment(this.state.promoPlans.accessEndDate).utc().format('YYYY-MM-DD');
                    }

                    this.props.registerFormvalues.condition_membership.push({
                        PlanId: this.state.promoPlans.planId,
                        subscriptionId: this.state.promoPlans.courtestyCode,
                        planStarts: now,
                        trialEnds: trialEnds,
                        UserId: this.props.registerFormvalues.userid,
                        current: 1,
                        conditionId: this.health_conditionId,
                        promoId: this.state.promoPlans.id,
                        isConfigEmailAlert: false,
                        membershipType: 'promo',
                        licenseId: null
                    })
                    this.setState({ promoPlans: {}, promocode: '' })
                    break;
            }
        } else {
            this.props.registerFormvalues.tagCode = {};

            if (this.props.pageFrom == 'membership' || this.props.pageFrom == 'mycondition') {
                this.props.registerformUpdate(this.props.registerFormvalues);
                this.props.closeModel();
                return;
            }
            this.setState({ promoPlans: {}, promocode: '' })
        }
        this.setState({ submitted: false })
        console.log('current_index', this.state.current_index)
        console.log('current_length', this.props.registerFormvalues.health_condition.length)
        this.props.registerFormvalues.current_health_conditionId = this.health_conditionId;
        if (this.props.pageFrom == 'register' &&
            this.state.current_index < this.props.registerFormvalues.health_condition.length && (this.state.current_index !== this.props.registerFormvalues.health_condition.length)
        ) {
            console.log('*************next***********', this.props.registerFormvalues)
            this.props.registerformUpdate(this.props.registerFormvalues);
            this.eligibilityCheck();
            if (this.state.current_index == 1) {
                //create
                this.isUpdate = true;
                this.props.registerUser(this.props.registerFormvalues, false, false);
                console.log('**if-this.isUpdate', this.isUpdate)
            } else {
                //update
                this.isUpdate = true;
                this.props.registerUser(this.props.registerFormvalues, this.isUpdate, false);
                console.log('**else-this.isUpdate', this.isUpdate)
            }

        } else if (this.props.pageFrom == 'mycondition' && !this.props.promocode) {
            this.props.registerformUpdate(this.props.registerFormvalues);
            this.props.submitCondition(this.props.registerFormvalues.health_condition[0], isSkip)
        }
        else {
            //membership page
            console.log('*************Done***********', this.props)
            console.log('**else2-this.isUpdate', this.isUpdate)
            this.props.registerFormvalues.cost = (commonService.returnCurrency(this.props.countryPlans)) + this.props.countryPlans.amount;
            this.props.registerformUpdate(this.props.registerFormvalues);
            if (this.props.pageFrom == 'mycondition' && this.props.promocode) {
                //membership with separate promo 
                this.props.submitCondition(this.props.registerFormvalues, isSkip)
            } else
                this.props.registerUser(this.props.registerFormvalues, this.isUpdate, true);
        }
    }

    handleChange(e) //for twoway binding
    {
        const { name, value } = e.target;
        if (value) {
            this.setState({ promocode: value, subscribedErr: false, isDisablePromo: false });
        } else {
            this.setState({ promocode: '', isDisablePromo: true, subscribedErr: false });
        }
    }
    applyPromoCode() {
        if (this.state.promocode.trim()) {
            this.props.getPromocodePaln(this.state.promocode.trim(), this.health_conditionId).then(
                response => {
                    this.props.registerFormvalues.promocode = this.state.promocode;
                    this.props.registerformUpdate(this.props.registerFormvalues);
                    if (response && response.plans && response.plans.length > 0) {
                        this.setState({ promoPlans: response.plans[0] });
                        this.calculatePromoAccess()
                    } else {
                        this.setState({ promoCodeErr: true })
                    }
                },
                error => {
                    toast.error(error);
                }
            );
        }
    }
    calculatePromoAccess() {
        console.log('calculatePromoAccess')
        var promoPlan = this.state.promoPlans;
        var accessEnd = '';
        if (promoPlan.accessEndDate) {
            accessEnd = moment(promoPlan.accessEndDate).utc().format('Do MMMM YYYY');
        } else if (promoPlan.freeDays == 60) {
            accessEnd = 'for 2 months';
        }
        else if (promoPlan.freeDays == 90) {
            accessEnd = 'for 3 months';
        }
        else if (promoPlan.freeDays == 180) {
            accessEnd = 'for 6 months';
        }
        else if (promoPlan.freeDays == 365) {
            accessEnd = 'for 12 months';
        }
        else if (promoPlan.freeDays) {
            accessEnd = 'for ' + promoPlan.freeDays + ' days';
        }
        else {
            accessEnd = 'for 2 weeks';
        }
        promoPlan.accessTime = accessEnd;
        this.setState({ promoPlans: promoPlan });
    }
    getLongestLicense(eligibleData) {
        var eligibleData = eligibleData.sort((a, b) => new Date(b.calCulatedDate).getTime() - new Date(a.calCulatedDate).getTime())[0];
        console.log('getLongestLicense', eligibleData)
        var isValid = this.checkLicenseValidity(eligibleData);
        console.log('isValid', isValid)
        this.props.registerFormvalues.eligible_license = {};

        if (isValid) {
            this.props.registerFormvalues.eligible_license = eligibleData ? eligibleData : {};
        }

        this.props.registerformUpdate(this.props.registerFormvalues);
        this.props.setConditionIndex(this.state.current_index + 1);
        this.setState({ current_index: this.state.current_index + 1 });
    }
    renderEligible() {
        console.log('renderEligible');
        console.log('renderEligible', this.state.current_index)
        if (this.props.pageFrom == 'membership') {
            var conditionName = this.props.condition_name;
            console.log('renderEligible', conditionName)
        } else {  //register page
            var conditionName = this.props.registerFormvalues.health_condition[
                this.state.current_index - 1
            ].tag;
        }
        return (
            <div>
                <div class="col-md-12 mt-4 mb-3">
                    <div class="row">
                        <div className="col-md-6 mx-auto text-center m-b-20">
                            <img src={constand.WEB_IMAGES + "logo.png"} id="icon" className="img-fluid logo-size m-b-10" alt="beam logo" />
                            <span className="purplefont font-bold font-18 align-bottom text-capitalize font-qbold pre-wrap">
                                {conditionName}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-center font-20 font-qmedium">
                    <p>{this.props.registerFormvalues.eligible_license.modalContent.accessText}
                    </p>
                </div>
                <div class="col-md-12 mt-4 mb-3">
                    <div class="row">
                       {this.props.registerFormvalues.eligible_license.Organisation.organisationLogo && <div className="video-tag2 col-md-12">
                            <img src={constand.S3_URL + this.props.registerFormvalues.eligible_license.Organisation.organisationLogo} id="icon" className="thanks-img img-fluid" alt="org-logo" />
                        </div>
                        }
                    </div>
                </div>
                {this.props.registerFormvalues.eligible_license.modalContent.consentStatement && this.props.registerFormvalues.eligible_license.modalContent.consentSwitch &&
                    <div className="toggle-btns float-left w-100">
                        <span className="font-14 font-qregular black-txt">{this.props.registerFormvalues.eligible_license.modalContent.consentStatement}</span>
                        <label className="switch m-l-10 pull-right" htmlFor="shareData">
                            <input type="checkbox" name="shareData" id="shareData" defaultChecked={this.state.shareData} onChange={this.handleCheckboxChange} value={this.state.shareData} />
                            <div className="slider round"></div>
                        </label>
                    </div>
                }
                {this.props.registerFormvalues.eligible_license.modalContent.consentSwitch && this.props.registerFormvalues.eligible_license.modalContent.consentSwitch === constand.SHARE_MANDATORY && this.state.submitted && !this.state.shareData && !this.state.isSkip && (
                    <p className="text-danger">This is required</p>
                )}
                <div
                    id="register-link"
                    className="buttons-read w-100 m-t-20 float-left text-center col-lg-12 col-xs-12 col-md-12 m-b-30"
                >
                    <button
                        className="btn btn-beam-blue-inverse font-14 col-xs-8 col-lg-4 m-t-20 m-r-20 col-md-4"
                        disabled={this.state.disableButton}
                        //   onClick={() => this.finalSubmit(true)}
                        onClick={() => {
                            if (!this.props.isFreeTrial)
                                this.setState({ isNoThanksModal: true });
                            else
                                this.finalSubmit(true)
                        }}
                    >
                        No, thanks!
                    </button>
                    <button
                        className="btn btn-beam-blue font-14 pointer col-xs-8 m-t-20 col-lg-6 col-md-6"
                        disabled={this.state.disableButton || this.props.loader_state}
                        onClick={() => this.finalSubmit(false, 1)}
                    >
                        Activate Membership
                    </button>
                </div>
            </div>
        );
    }
    renderNotEligible() {
        console.log('renderNotEligible', this.state.current_index)
        if (this.props.pageFrom == 'membership') {
            var conditionName = this.props.condition_name;
            console.log('renderNotEligible', conditionName)
        } else {  //register page
            var conditionName = this.props.registerFormvalues.health_condition[
                this.state.current_index - 1
            ].tag;
        }
        return (
            <div>
                <div class="col-md-12 mt-4 mb-3">
                    <div class="row">
                        <div className="col-md-6 mx-auto text-center m-b-20">
                            <img src={constand.WEB_IMAGES + "logo.png"} id="icon" className="img-fluid m-b-10 logo-size-member-content" alt="beam logo" />
                            <span className="purplefont font-bold font-18 align-bottom text-capitalize d-block">
                                {conditionName}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-center font-20 font-qmedium col-md-8 mx-auto">
                    <p className="ash-txt font-bold font-30">Beam Monthly</p>
                    <p className="font-25 ash-txt">2 week free trial</p>
                    <p className="font-25 ash-txt">followed by {commonService.returnCurrency(this.props.countryPlans)}{this.props.countryPlans.amount} per month</p>
                </div>
                <p className="font-14 text-center font-qmedium">(no credit card required to start the trial,no obligation to sign up after the trial)</p>
                <div class="col-md-9 mt-4 mb-5 mx-auto">
                    <label htmlFor="promocode" className="text-label">Got a promotional or access code?</label>
                    <div class="row">
                        <div className="col-md-9 p-t-10">
                            <input type="text" name="promocode" id="promocode" className="form-control input-control" value={this.state.promocode} onChange={this.handleChange} />
                        </div>
                        <div id="register-link" className="col-md-3 align-self-center text-center p-15 p-t-10">
                            <button disabled={this.state.isDisablePromo} className="btn button-lightblue text-center w-100 p-3" onClick={this.applyPromoCode}>Apply</button>
                        </div>
                        {this.state.submitted && (this.state.promoCodeErr) &&
                            <p className="text-danger">Please enter correct promo or access code</p>}
                        {this.state.subscribedErr &&
                            <p className="text-danger">{Errors.subscribed_user_1}</p>}
                    </div>
                </div>
                <div
                    id="register-link"
                    className="buttons-read w-100 m-t-20 float-left text-center col-lg-12 col-xs-12 col-md-12 m-b-30"
                >
                    <button
                        className="btn btn-beam-blue-inverse font-14 col-xs-8 col-lg-4 m-t-20 m-r-20 col-md-4"
                        disabled={this.state.disableButton}
                        //onClick={() => this.props.closeModel()}
                        //  onClick={() => this.finalSubmit(true)}
                        onClick={() => {
                            if (!this.props.isFreeTrial)
                                this.setState({ isNoThanksModal: true });
                            else
                                this.finalSubmit(true)
                        }}
                    >
                        No, thanks!
                    </button>
                    <button
                        className="btn btn-beam-blue font-14 pointer col-xs-8 m-t-20 col-lg-6 col-md-6"
                        disabled={this.state.disableButton || !this.state.isDisablePromo || this.props.loader_state}
                        onClick={() => this.finalSubmit(false, 2)}
                    >
                        {this.props.pageFrom == 'membership' ? "Upgrade for " + (commonService.returnCurrency(this.props.countryPlans)) + this.props.countryPlans.amount + " per month" : "Activate 2 week free trial"}
                    </button>
                </div>
            </div>
        );
    }
    renderPromoCodeData() {
        console.log('render-promocodedata-this.state.current_index', this.state.current_index)
        console.log('renderPromoCodeData=>this.props', this.props)
        var conditionName = '';

        if ((this.props.pageFrom == 'membership' || this.props.pageFrom == 'mycondition') && this.props.promocode) {
            //conditionName = this.props.promoPlans.Tag ? this.props.promoPlans.Tag.tag : '';
            var promoPlans = this.props.promoPlans ? this.props.promoPlans : this.state.promoPlans;
            conditionName = promoPlans.Tag ? promoPlans.Tag.tag : '';
        } else {
            conditionName = this.props.registerFormvalues.health_condition[
                this.state.current_index - 1
            ].tag
        }

        return (
            <div>
                <div class="col-md-12 mt-4 mb-3">
                    <div class="row">
                        <div className="col-md-6 mx-auto text-center m-b-20">
                            <img src={constand.WEB_IMAGES + "logo.png"} id="icon" className="img-fluid p-r-10 p-t-10 p-b-10" alt="beam logo" />
                            <span className="purplefont font-bold font-18 align-bottom text-capitalize">
                                {conditionName}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-center font-20 font-medium col-md-8 mx-auto">
                    <p className="font-25 ash-txt">This code gives you free access to Beam <span className="text-capitalize">{conditionName}</span></p>
                    <p className="font-25 ash-txt"> {this.state.promoPlans.freeDays ? "" : "until"} {this.state.promoPlans.accessTime} </p>
                    {this.state.promoPlans.courtesyName && <p className="font-25 ash-txt">courtesy of {this.state.promoPlans.courtesyName}</p>
                    }
                </div>
                <div
                    id="register-link"
                    className="buttons-read w-100 m-t-20 float-left text-center col-lg-12 col-xs-12 col-md-12 m-b-30"
                >
                    <button
                        className="btn btn-beam-blue-inverse font-14 col-xs-8 col-lg-4 m-t-20 m-r-20 col-md-4"
                        disabled={this.state.disableButton}
                        //onClick={() => this.finalSubmit(true)}
                        onClick={() => {
                            if (!this.props.isFreeTrial)
                                this.setState({ isNoThanksModal: true });
                            else
                                this.finalSubmit(true)
                        }}
                    >
                        No, thanks!
                    </button>
                    <button
                        className="btn btn-beam-blue font-14 pointer col-xs-8 m-t-20 col-lg-6 col-md-6"
                        disabled={this.state.disableButton || this.props.loader_state}
                        onClick={() => this.finalSubmit(false, 3)}
                    >
                        Activate Membership
                    </button>
                </div>
            </div>
        );
    }
    render() {

        return (
            <div className="row justify-content-center align-items-center">
                <div className="input_section col-md-10 m-t-10">
                    {this.state.isEligibleCheck && !Object.keys(this.state.promoPlans).length && Object.keys(this.props.registerFormvalues.eligible_license).length > 0 &&
                        this.renderEligible()
                    }
                    {this.state.isEligibleCheck && !Object.keys(this.state.promoPlans).length && !Object.keys(this.props.registerFormvalues.eligible_license).length &&
                        this.renderNotEligible()
                    }
                    {this.state.isEligibleCheck && this.state.promocode && Object.keys(this.state.promoPlans).length > 0 &&
                        this.renderPromoCodeData()
                    }

                </div>
                {this.state.isNoThanksModal &&
                    <NoThanksModal
                        title="Are you sure?"
                        content={this.props.pageFrom != 'mycondition' ? 'Are you sure you don\'t want to activate a membership to Beam ' + this.state.conditionName + '? We will go ahead and create a Beam account for you but you will not have a membership to access all the great content we have available on Beam ' + this.state.conditionName + '. If you\'ve changed your mind and don\'t want to sign up to Beam today choose "No" below and click on the "X" to cancel your sign-up to Beam.' : 'Are you sure you don\'t want to activate a membership to Beam ' + this.state.conditionName + ' today?'}
                        yesButton="Yes"
                        noButton="No"
                        is_model_open={this.state.isNoThanksModal}
                        submitYes={() => { this.finalSubmit(true) }}
                        submitNo={() => { this.setState({ isNoThanksModal: false }) }}
                    />
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        logged_userData: state.header.logged_userData,
        healthcondition_list: state.register.healthcondition_list,
        condition: state.auth.condition,
        condition_index: state.register.condition_index,
        licenseList: state.register.licenseList,
        countryPlans: state.register.countryPlans,
        loader_state: state.register.isLoading,
    };
};

const mapDispatchToProps = { start_loader, stop_loader, setStep, registerNewUser, setConditionIndex, getPromocodePaln };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OnboardMembershipComponent);
