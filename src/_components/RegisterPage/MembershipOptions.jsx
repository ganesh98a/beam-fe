import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { start_loader, stop_loader, setStep, registerNewUser, setConditionIndex, getPromocodePaln, afterSignupComplete, updateMyConditions, registerformUpdate, set_loading, setPageTitle, setNewUser } from "../../actions";
import * as constand from "../../constant";
import * as Errors from "../../Errors";
import { toast } from "react-toastify";
import moment from 'moment';
import _ from 'lodash';
import OnboardMembershipComponent from "../Common/OnboardMembershipComponent";
import { Cookies } from "react-cookie-consent";

class MembershipOptions extends React.Component {
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
            isEligibleCheck: false
        };

        this.applyPromoCode = this.applyPromoCode.bind(this);
        this.calculatePromoAccess = this.calculatePromoAccess.bind(this);
        this.registerUser = this.registerUser.bind(this);
    }
    componentDidMount() {
        this.props.setPageTitle('Your membership options')
    }
    /**
     register new user
    **/
    registerUser(registerFormvalues, isUpdate, isFinish) {
        console.log('registerUser-isUpdate', isUpdate)
        console.log('registerUser-isFinish', isFinish)
        this.props.set_loading(true);
        if (isUpdate) {
            console.log('SIGNUPNEW-updateMyConditions')
            var condition_professions = _.find(registerFormvalues.condition_professions, { 'conditionId': registerFormvalues.current_health_conditionId });
            var condition_membership = _.find(registerFormvalues.condition_membership, { 'conditionId': registerFormvalues.current_health_conditionId });

            var myCoditionList = {
                conditionId: [registerFormvalues.current_health_conditionId],
                condition_professions: condition_professions ? [condition_professions] : [],
                condition_membership: condition_membership ? [condition_membership] : [],
                registerFormvalues: registerFormvalues
            };
            this.props.updateMyConditions(myCoditionList).then(response => {
                console.log('mycondition creation')
                if (isFinish) {
                    this.props.afterSignupComplete();
                    var conditions = registerFormvalues.health_condition[0].tag;
                    var url = Cookies.get('current-page-url') ? Cookies.get('current-page-url') : "/on-demand/" + conditions;
                    this.props.setNewUser(true)
                    console.log('againurl', url)
                    const { from } = { from: { pathname: url } };
                    this.props.history.push(from);
                }
                this.props.set_loading(false);

            }, error => {
                console.log('mycondition creation error:', error);
                toast.error(error);
                this.props.set_loading(false);
            })

        } else {
            console.log('SIGNUPNEW-registerNewUser')
            this.props.registerNewUser(registerFormvalues).then(
                response => {

                    if (response && response.success) {
                        var user = response;
                        user.authdata = window.btoa(registerFormvalues.email + ':' + registerFormvalues.password);
                        localStorage.setItem('userMidSignup', JSON.stringify(user));
                        this.props.set_loading(false);
                    }

                    if (isFinish) {
                        this.props.afterSignupComplete();
                        console.log('Isfineish')
                        var conditions = registerFormvalues.health_condition[0].tag;
                        var url = Cookies.get('current-page-url') ? Cookies.get('current-page-url') : "/on-demand/" + conditions;
                        this.props.setNewUser(true)
                        console.log('againurl', url)
                        const { from } = { from: { pathname: url } };
                        this.props.history.push(from);
                        toast.success(response.message);

                    } else {
                        registerFormvalues.userid = response.userid;
                        this.props.registerformUpdate(registerFormvalues);
                        console.log('response.user', response.userid);
                    }
                },
                error => {
                    this.props.set_loading(false);
                    this.setState({
                        Loading: false
                    });
                    toast.error(error);
                }
            );
        }
    }

    applyPromoCode() {
        if (this.state.promocode.trim()) {
            this.props.getPromocodePaln(this.state.promocode.trim()).then(
                response => {
                    this.props.registerformUpdate(this.props.registerFormvalues);
                    if (response && response.plans && response.plans.length > 0) {
                        this.setState({ promoPlans: response.plans[0] });
                        this.calculatePromoAccess()
                        // this.props.registerFormvalues['membershipPlan'] = response.plans[0].Plan;
                        //this.props.nextStep();
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
        var promoPlan = this.state.promoPlans;
        var accessEnd = '';
        if (promoPlan.accessEndDate) {
            accessEnd = moment(promoPlan.accessEndDate).format('Do MMMM YYYY');
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
    render() {
        return (

            <div className="step16">
                {this.props.pageFrom != 'mycondition' &&
                    <h3 className="text-center">
                        {/* <a
                            className="pull-left"
                            href="javascript:void(0)"
                            onClick={() => this.props.setStep(14, 'backward')}
                        >
                            <img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} />
                        </a> */}
                        {Object.keys(this.state.promoPlans).length > 0 ? 'Nice one ' + this.props.registerFormvalues.firstname : 'Your membership options'}
                        <Link
                            to="/home"
                            className="close-register orangefont"
                        >X</Link>
                    </h3>
                }
                <OnboardMembershipComponent registerFormvalues={this.props.registerFormvalues} registerformUpdate={this.props.registerformUpdate} nextStep={this.props.nextStep}
                    prevStep={this.props.prevStep} gotoStep={this.props.gotoStep} location={this.props.location} history={this.props.history} registerUser={this.registerUser} countryPlans={this.props.countryPlans} pageFrom={this.props.pageFrom} submitCondition={this.props.submitCondition} promocode={this.props.promocode}
                    promoPlans={this.props.promoPlans}
                    health_conditionId={this.props.health_conditionId}
                    closeModel={this.props.closeModel}
                />
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
        //registerFormvalues : state.register.registerFormValues
    };
};

const mapDispatchToProps = { start_loader, stop_loader, setStep, registerNewUser, setConditionIndex, getPromocodePaln, afterSignupComplete, updateMyConditions, registerformUpdate, set_loading, setPageTitle, setNewUser };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MembershipOptions);
