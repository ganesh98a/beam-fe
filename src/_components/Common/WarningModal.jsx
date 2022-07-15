import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
    ondemandDetail,
    loginModelOpen,
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
    getPlanByCountry
} from "../../actions";
import { commonService } from "../../_services";
import { toast } from "react-toastify";
import * as constand from "../../constant";
import { ImageTag } from "../../tags";
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
import ConditionOnboardingComponent from "../AccountDetailPage/ConditionOnboardingComponent";
import _ from 'lodash';
import Modal from "react-responsive-modal";
import OnboardMembershipComponent from "./OnboardMembershipComponent";
import PaymentComponent from "./PaymentComponent";

class WarningModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            health_conditionId: 0,
            currentPlanId: 0,
            planData: {},
            countryPlans: [],
            payment_data: {},
        };
        this.authData = JSON.parse(localStorage.getItem('userDetails')) || this.props.logged_userData;
    }

    componentDidMount() {
        console.log('this.props.warnings', this.props)
        let authData = JSON.parse(localStorage.getItem('userDetails')) || this.props.logged_userData;
        window.scrollTo(0, 0);
        this.setState({
            isConditionModalOpen: this.props.isConditionModalOpen,
            isWarningModal: this.props.isWarningModal
        })
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

    closeModel = () => {
        console.log('warning-closemodel')
        this.setState({ isConditionModalOpen: false, isWarningModal: false, isUpgradeModalOpen: false });
        this.props.registerFormvalues.condition_membership = [];
        this.props.registerformUpdate(this.props.registerFormvalues);
    }

    updateMyConditions = (item, isSkip) => {
        console.log('updateMyConditions', item)
        var myconditionList = [...this.props.logged_userData.conditionList];
        var index = this.props.logged_userData.conditionList.findIndex(x => x === item.id);
        /* if (index > -1) {
            myconditionList.splice(index, 1);
        } else {
            myconditionList.push(item.id);
        } */
        console.log('myconditionList', item.id)
        var myCoditionList = {
            conditionId: [item.id],//myconditionList,
            condition_professions: this.props.registerFormvalues.condition_professions,
            condition_membership: this.props.registerFormvalues.condition_membership,
            registerFormvalues: this.props.registerFormvalues
        };

        this.props.updateMyConditions(myCoditionList).then(
            response => {
                //this.startVideo();
                toast.success(response.message);
                this.props.afterUpgrade();
                this.closeModel();
                var oldUserData = { ...this.props.logged_userData };
                oldUserData.membershipData.userPlanDetails = response.userPlanDetails
                this.props.updateUserdataRedex(oldUserData);
                localStorage.setItem('userDetails', JSON.stringify(oldUserData));
            },
            error => {
                toast.error(error);
                this.closeModel();
            }
        );
    }
    submitMembershipData = (data) => {
        console.log('submitMembershipData', data)
        var condition_membership = data.condition_membership;
        data.currentPlanId = this.state.currentPlanId;
        data.isMembershipCondition = true;
        if (condition_membership.length && condition_membership[0].promoId) {
            console.log('this.state.planData', this.state.planData)
            var plan = { id: condition_membership[0].PlanId };
            this.startTrail(plan, 'promo', data)
            this.setState({ is_onboard_membership_open: false })
        } else {
            //this.startTrail(this.state.countryPlans, 'change_plan', membershipData)
            this.setState({ isUpgradeClicked: true, cost: data.cost, submittedMembershipData: data, payment_data: {} })
        }
    }
    startTrail = (plan, type, membershipData = {}) => {
        //submission of both promo and membership plan
        console.log('*************startTrail************')
        console.log('plan', plan)
        console.log('type', type)
        var planData = {
            planId: plan.id,
            type: type
        };
        console.log('membershipData', membershipData)
        if (type === 'change_plan') {
            const paymentData = this.state.payment_data;
            console.log('this.state.payment_data', paymentData)
            var cur_month = new Date().getMonth();
            let cur_year = new Date().getFullYear();
            if (new Date(paymentData.card_exp_year + '-' + paymentData.card_exp_month + '-01') < new Date(cur_year + '-' + cur_month + '-01')) {
                this.setState({ payment_data: { ...this.state.payment_data, invalid_expiration: true } });
                return;
            }

            planData.card_name = paymentData.card_name;
            planData.number = paymentData.card_number;
            planData.exp_month = paymentData.card_exp_month;
            planData.exp_year = paymentData.card_exp_year;
            planData.cvc = paymentData.card_security_code;
            planData.card_zipcode = paymentData.card_zipcode;
        }

        if (type === 'promo') {
            planData.promocode = this.props.registerFormvalues.promocode;
            //planData.planId = this.state.promocode;
        }

        if (Object.keys(membershipData).length) {
            planData.isMemberCondition = true;
            planData.membershipData = membershipData;
        }

        //this.props.start_loader();
        //this.closeModel();
        console.log('changePlan', planData)
        this.setState({ isUpgradeClicked: false })
        this.props.changePlan(planData).then(
            response => {
                this.setState({ membership_step: 1, payment_data: {}, isUpgradeModalOpen: false });
                /* 	this.get_membership();
                    this.getUserDetail(); */
                this.props.afterUpgrade();
                this.closeModel();
                var oldUserData = { ...this.props.logged_userData };
                oldUserData.membershipData.userPlanDetails = response.userPlanDetails
                this.props.updateUserdataRedex(oldUserData);
                localStorage.setItem('userDetails', JSON.stringify(oldUserData));
                toast.success(response.message);
            },
            error => {
                this.setState({ payment_data: {}, isUpgradeModalOpen: false });
                toast.error(error);
            }
        );
    }
    submitPayment = (payment_data) => {
        console.log('submitPayment', payment_data)
        this.setState({ payment_data: payment_data }, function () {

            if (this.state.submittedMembershipData.isMembershipCondition)
                this.startTrail(this.state.countryPlans, 'change_plan', this.state.submittedMembershipData);
            else
                this.startTrail(this.state.planData, 'change_plan');
        });

    }
    /**
     * To render warning popup
     * @returns 
     */
    renderWarningModal = () => {
        return (
            <Modal
                classNames={{
                    modal: "m-t-50"
                }}
                open={this.props.isWarningModal}
                onClose={this.props.closeModel}
                center
            >
                <div className="modal-dialog modal-width--custom" role="document">
                    <div className="modal-content">
                        <div className="modal-header header-styling  border-0 bg-dark-orange">
                            <h5
                                className="modal-title text-center col-md-11 p-0 font-semibold white-txt"
                                id="exampleModalLabel font-medium"
                            >
                                {"Oh no!"}
                            </h5>
                            <button
                                type="button"
                                className="close white-txt"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true" onClick={this.props.closeModel}>
                                    &times;
                  </span>
                            </button>
                        </div>
                        <div className="modal-body body-padding--value pb-0" id="register-box">
                            <p className="font-book font-16 text-center">{commonService.checkMembershipCases(this.authData, this.props.conditionName)}</p>
                            {!this.props.conditionName.toLowerCase().includes('research') &&
                            <div id="register-link" className=" w-100 m-t-30 m-b-20 float-left">
                                <span
                                    onClick={() => {
                                        if (this.props.hasMembership == 0) {
                                            this.props.closeModel();
                                            console.log('UPGRADED')
                                            //upgrade
                                            this.setState({ isUpgradeModalOpen: true, isConditionModalOpen: false, isWarningModal: false, isUpgradeClicked: false });
                                        } else {
                                            this.props.closeModel();
                                            console.log('NEW-MEMBERSHIP')
                                            //new condition
                                            this.setState({ isUpgradeModalOpen: false, isConditionModalOpen: true, isWarningModal: false, isUpgradeClicked: false });
                                        }
                                    }}
                                    className="bluebtn float-left w-100 text-center pointer"
                                >
                                    Go to membership options
              </span>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
    /**
     * To render membership options model for upgrade
     * @returns 
     */
    renderMembershipOptionsModal = () => {
        return (
            <Modal
                classNames={{
                    modal: "pricing-popup m-t-50 membership-popup"
                }}
                open={this.state.isUpgradeModalOpen}
                onClose={this.closeModel}
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
                            {!this.state.isUpgradeClicked &&
                                <OnboardMembershipComponent registerFormvalues={this.props.registerFormvalues} registerformUpdate={this.props.registerformUpdate} health_conditionId={this.props.health_conditionId} condition_name={this.props.conditionName} registerUser={this.submitMembershipData} pageFrom="membership" closeModel={this.closeModel} />
                            }
                            {this.state.isUpgradeClicked &&
                                <PaymentComponent
                                    payment_data={this.state.payment_data}
                                    cost={this.state.cost}
                                    submitPayment={this.submitPayment} />
                            }

                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
    render() {
        console.log('isWarningModal', this.state.isWarningModal)
        return (
            <React.Fragment>
                {(this.state.isConditionModalOpen) &&
                    <ConditionOnboardingComponent
                        ismodel_open={this.state.isConditionModalOpen}
                        closeModel={this.closeModel}
                        submitCondition={this.updateMyConditions}
                    />
                }
                {this.props.isWarningModal && this.renderWarningModal()}
                {this.state.isUpgradeModalOpen && this.renderMembershipOptionsModal()}

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

    };
};

const mapDispatchToProps = {
    ondemandDetail,
    scheduleModelOpen,
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
    getPlanByCountry
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WarningModal);