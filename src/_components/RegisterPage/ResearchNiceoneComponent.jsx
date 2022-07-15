import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { start_loader, stop_loader, setStep, registerNewUser, afterSignupOtherUsers, setPageTitle } from "../../actions";
import * as constand from "../../constant";
import { toast } from "react-toastify";
import { commonService } from "../../_services";

class ResearchNiceoneComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {},
            is_postnatal: false,
            submitted: false,
            disableButton: false
        };
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.finalSubmit = this.finalSubmit.bind(this);
        this.modalContent = {};

    }
    componentDidMount() {
        this.props.start_loader();
        if (Object.keys(this.props.registerFormvalues.tagCode).length)
            this.modalContent = JSON.parse(this.props.registerFormvalues.tagCode.modalContent);
    }
    handleCheckboxChange(e) //for twoway binding checkbox
    {
        const { name } = e.target;
        this.props.registerFormvalues[name] = !this.props.registerFormvalues[name];
    }
    finalSubmit() {
        this.setState({ submitted: true, promoCodeErr: false, subscribedErr: false });
        this.props.registerformUpdate(this.props.registerFormvalues);
        if (this.props.registerFormvalues.isKBResearcheUser) {
            if (this.modalContent.consentSwitch && this.modalContent.consentSwitch === constand.SHARE_MANDATORY && !this.props.registerFormvalues.research_share)
                return;
            else {
                this.setState({ submitted: false });
                //this.props.gotoStep(16); //kidney nice one page
                this.props.gotoStep(23); //membership options
            }
        } else {
            this.registerUser(this.props.registerFormvalues);
        }
    }
    /**
     register new user
    **/
    registerUser(registerFormvalues) {
        this.setState({ submitted: true });
        if (!registerFormvalues.research_share)
            return;
        this.props.start_loader();
        this.props.registerNewUser(registerFormvalues).then(
            response => {
                this.setState({ submitted: false });
                if (response && response.success) {
                    var user = response;
                    user.authdata = window.btoa(registerFormvalues.email + ':' + registerFormvalues.password);
                    localStorage.setItem('user', JSON.stringify(user));
                    this.props.afterSignupOtherUsers();
                    const { from } = { from: { pathname: "/group/liveclasses/list/" + registerFormvalues.research_groupname + "/" + commonService.replaceChar(registerFormvalues.research_condition, false) } };
                    this.props.history.push(from);
                }
            },
            error => {
                this.props.stop_loader();
                this.setState({
                    Loading: false
                });
                toast.error(error);
            }
        );
    }
    renderRS = () => {
        var condition = this.props.condition.replace(' ', '-');
        var welcomeTitle = this.props.registerFormvalues.research_condition;
        var trialName = this.props.registerFormvalues.research_condition.replace('Research Studies: ', '');
        var isResearchCondition = this.props.registerFormvalues.research_condition.includes('Research');
        var isCreatec = (trialName.toLowerCase().includes(constand.CREATEC_CONDITION))

        if (this.props.registerFormvalues.isKBResearcheUser) {
            trialName = constand.KD_STUDY_NAME;
            welcomeTitle = constand.KD_STUDY_NAME;
        }
        if(welcomeTitle.includes('iREHAB')){
            welcomeTitle = welcomeTitle.slice(0, -6)
            trialName = " "
        }

        return (

            <div className="step16">
                <h3 className="text-center">
                    <a
                        className="pull-left"
                        href="javascript:void(0)"
                        onClick={() => this.props.setStep(4, 'backward')}
                    >
                        <img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} />
                    </a>
                    Welcome to Beam {welcomeTitle}
                    <Link
                        to="/home"
                        className="close-register orangefont"
                    >X</Link>
                </h3>
                <div className="row justify-content-center align-items-center">
                    <div className="input_section col-md-10 m-t-10">
                        <div class="row">
                            <div className="video-tag1 col-md-12 font-14 font-qregular black-txt">
                                <p className="font-bold">{isCreatec ? trialName + " feasibility study " : trialName + " Research Trial"}</p>
                                {isCreatec &&
                                    <p>
                                        You are signed up to take part in the {trialName} feasibility study on Beam. To proceed we need you to confirm you are happy for us to share your name, email and activity data that we collect on you on Beam with the researchers at the {constand.createc_org} who holds the educational class you take on Beam.</p>
                                    ||

                                    <p>
                                        Looks like you are signed up to take part in the {trialName} research trial on Beam. To proceed we need you to confirm you are happy for us to share your name, email and activity data that we collect on you on Beam with {(isResearchCondition ? (this.props.registerFormvalues.research_condition.indexOf('PULSE') != -1 ? constand.pulse_org : this.props.registerFormvalues.research_condition.indexOf('iREHAB') !=-1 ? ' ' :  constand.other_org) : constand.KD_ORG_NAME)} and any instructors of the classes you take on Beam.</p>
                                }

                            </div>
                        </div>
                        <div className="toggle-btns float-left w-100">
                            <span className="font-14 font-qregular black-txt">I consent to Beam sharing my data as described above</span>
                            <label className="switch m-l-10 pull-right" htmlFor="research_share">
                                <input type="checkbox" name="research_share" id="research_share" defaultChecked={this.props.registerFormvalues.research_share} onChange={this.handleCheckboxChange} value={this.props.registerFormvalues.research_share} />
                                <div className="slider round"></div>
                            </label>
                        </div>
                        {this.state.submitted && !this.props.registerFormvalues.research_share &&
                            <p className="text-danger">This is required.</p>}
                        <div
                            id="register-link"
                            className=" w-100 m-b-30 float-left p-t-15"
                        >
                            <button
                                className="w-50 mx-auto d-table btn  dblog_btn font-14 button-lightblue position-relative"
                                disabled={this.state.disableButton}
                                onClick={this.finalSubmit}
                            >
                                Sign me up!
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
    renderTagCodes = () => {
        var condition = this.props.condition.replace(' ', '-');
        var welcomeTitle = '';
        var trialName = this.props.registerFormvalues.research_condition.replace('Research Studies: ', '');
        var isResearchCondition = this.props.registerFormvalues.research_condition.includes('Research');
        var isCreatec = (trialName.toLowerCase().includes(constand.CREATEC_CONDITION))

        var modalContent = JSON.parse(this.props.registerFormvalues.tagCode.modalContent);
        if (this.props.registerFormvalues.tagCode) {
            trialName = modalContent.subtitle; //constand.KD_STUDY_NAME;
            welcomeTitle = modalContent.title;
        }

        this.props.setPageTitle(modalContent.title);
        return (

            <div className="step16">
                {this.props.pageFrom != 'mycondition' &&
                    <h3 className="text-center">
                        <a
                            className="pull-left"
                            href="javascript:void(0)"
                            onClick={() => this.props.setStep(4, 'backward')}
                        >
                            <img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} />
                        </a>
                        {modalContent.title}
                        <Link
                            to="/home"
                            className="close-register orangefont"
                        >X</Link>
                    </h3>
                }
                <div className="row justify-content-center align-items-center">
                    <div className="input_section col-md-10 m-t-10">
                        <div class="row">
                            <div className="video-tag1 col-md-12 font-14 font-qregular black-txt">
                                <p className="font-bold">{modalContent.subtitle}</p>
                                <p>{modalContent.paragraph}
                                </p>
                            </div>
                        </div>
                        {modalContent.consentStatement && modalContent.consentSwitch &&
                            <div className="toggle-btns float-left w-100">
                                <span className="font-14 font-qregular black-txt">{modalContent.consentStatement}</span>
                                <label className="switch m-l-10 pull-right" htmlFor="research_share">
                                    <input type="checkbox" name="research_share" id="research_share" defaultChecked={this.props.registerFormvalues.research_share} onChange={this.handleCheckboxChange} value={this.props.registerFormvalues.research_share} />
                                    <div className="slider round"></div>
                                </label>
                            </div>
                        }
                        {modalContent.consentSwitch && modalContent.consentSwitch === constand.SHARE_MANDATORY && this.state.submitted && !this.props.registerFormvalues.research_share &&
                            <p className="text-danger">This is required.</p>}
                        <div
                            id="register-link"
                            className=" w-100 m-b-30 float-left p-t-15"
                        >
                            <button
                                className="w-50 mx-auto d-table btn  dblog_btn font-14 button-lightblue position-relative"
                                disabled={this.state.disableButton}
                                onClick={this.finalSubmit}
                            >
                                Sign me up!
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
    render() {
        var isResearchCondition = this.props.registerFormvalues.research_condition.includes('Research');
        var tagCode = this.props.registerFormvalues.tagCode;
        return (
            <div className="step16">
                {isResearchCondition && this.renderRS()}
                {!isResearchCondition && tagCode && this.renderTagCodes()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        logged_userData: state.header.logged_userData,
        healthcondition_list: state.register.healthcondition_list,
        condition: state.auth.condition
    };
};

const mapDispatchToProps = { start_loader, stop_loader, setStep, registerNewUser, afterSignupOtherUsers, setPageTitle };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ResearchNiceoneComponent);
