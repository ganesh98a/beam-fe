import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Errors from "../../Errors";
import { getPromocodePaln, start_loader, stop_loader, registerNewUser, setStep, getConditionBasedInstructor, getPlanByCountry, setConditionIndex, validateTagCodes, setPageTitle } from '../../actions';
import { toast } from "react-toastify";
import * as constand from "../../constant";
import ReactGA from 'react-ga';

class AsthmaPilotComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            know_via: this.props.registerFormvalues.know_via,
            promocode: this.props.registerFormvalues.promocode,
            submitted: false,
            promoCodeErr: false,
            subscribedErr: false,
            showPromo: false,
            errorMessage: '',
            KR_Cond: [],
            instructors: []
        }
    }

    componentDidMount() {

        console.log('hearabout.registerFormvalues', this.props.isConditionHasCode)
        console.log('hearabout.registerFormvalues', this.props.registerFormvalues)
        this.props.getPlanByCountry(this.props.registerFormvalues.country);
        //this.props.setConditionIndex(0);

        //finding kidney disease tag    
        var KR_Cond_temp = [];
        KR_Cond_temp = this.props.registerFormvalues.health_condition.filter(function (item) {
            return (item.tag == constand.KR_CONDITION)
        })
        this.setState({ KR_Cond: KR_Cond_temp })
        //finding cystic fibrosis tag
        var CF_Cond_temp = [];
        CF_Cond_temp = this.props.registerFormvalues.health_condition.filter(function (item) {
            return (item.tag == constand.KR_CONDITION)
        })
        if (CF_Cond_temp.length > 0 && this.props.registerFormvalues.beamchallenging)
            this.props.registerFormvalues.beamchallenging = this.props.registerFormvalues.beamchallenging;
        else
            this.props.registerFormvalues.beamchallenging = '';


        if (this.props.registerFormvalues.country == constand.usCountry &&
            this.props.registerFormvalues.profession == constand.livingCondition &&
            (this.props.registerFormvalues.health_condition.length > 0 && this.props.registerFormvalues.health_condition[0].tag == constand.CONDITION) &&
            this.props.registerFormvalues.age >= constand.adultAge) {
            this.props.registerFormvalues.usUser = true;
            //this.setState({ showPromo: false })
        }
        if (KR_Cond_temp.length > 0 && this.props.registerFormvalues.health_condition.length == 1) {
            this.props.registerFormvalues.krUser = true;
            this.setState({ showPromo: true })
        }
        this.props.setPageTitle('Are you a participant in our Beam Asthma Kids Pilot?')
    }

    handleChange = (e) => {  //for twoway binding
        const { name, value } = e.target;
        this.setState({ promocode: value, subscribedErr: false });
        this.props.registerFormvalues[name] = value;

        if (constand.KD_BEAM_RESEARCH == value) {
            this.props.registerFormvalues.isKBResearcheUser = true; //kidney beam research user
        }
    }

    tagCodeSubmit = () => {
        var promocode = this.props.registerFormvalues.promocode;
        var AK_Cond_temp = [];
        AK_Cond_temp = this.props.registerFormvalues.health_condition.filter(function (item) {
            return (item.tag == constand.ASTHMA_CONDITION)
        })
        this.setState({ submitted: true })
        var conditionId = AK_Cond_temp[0].id;
        if (this.props.registerFormvalues.promocode.trim()) {
            this.props.validateTagCodes(this.props.registerFormvalues.promocode.trim(), conditionId).then(
                response => {
                    this.props.stop_loader();
                    this.props.registerFormvalues.promocode = '';
                    this.setState({ submitted: false })

                    if (response) {
                        this.props.registerFormvalues.tagCode = response.tagCode;
                        this.props.registerFormvalues.tagCodeScreenEnable = true;
                        this.props.registerformUpdate(this.props.registerFormvalues);
                        /* if (promocode && response.tagCode.modalContent) {
                            this.props.gotoStep(22); //research niceone page
                        } else
                            this.props.gotoStep(23); // straight away go for membership options
                        //this.props.nextStep(); */
                        this.props.gotoStep(11); //clinic page

                    } else {
                        this.setState({ promoCodeErr: true, errorMessage: '' })
                    }
                },
                error => {
                    this.props.stop_loader();
                    toast.error(error);
                    this.setState({ errorMessage: error })

                }
            );
        } else {
            this.setState({ promoCodeErr: true })
            //            this.props.gotoStep(23); // straight away go for membership options
        }

        ReactGA.event({
            category: "User Acquisition",
            action: "Sign up process",
            label: "How they heard"
        })
        ReactGA.event({
            category: "User Acquisition",
            action: "Sign up flow completed ",
        })
    }
    render() {
        return (
            <div className="step12">
                {this.props.pageFrom != 'mycondition' &&
                    <h3 className="text-center "><a className="pull-left" href="javascript:void(0)" onClick={this.props.prevStep}><img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} /></a>Are you a participant in our Beam Asthma Kids Pilot?<Link
                        to="/home"
                        className="close-register orangefont"
                    >
                        X
                    </Link></h3>
                }
                <div className="row justify-content-center align-items-center">
                    <div className="input_section col-md-9 m-t-20">
                        <p className="text-label">Beam Asthma Kids is currently being piloted only with patients from selected centres (but we hope very soon to be launching this service to a wider audience).</p>
                        <p className="text-label">If you have an access code from your centre please enter it below to continue.</p>
                        <p className="text-label">If you are a patient of a pilot centre and don't have a code please contact your physiotherapy team to get one.</p>

                        <div class="mt-4 mb-5 mx-auto">
                            <label htmlFor="promocode" className="text-label font-medium">Access Code</label>
                            <div class="row">
                                <div className="col-md-9 m-b-10">
                                    <input type="text" name="promocode" id="promocode" className="form-control input-control" onChange={this.handleChange} value={this.props.registerFormvalues.promocode} />
                                </div>
                                <div id="register-link" className="col-md-3 align-self-center text-center p-15">
                                    <button disabled={this.state.isDisablePromo} className="btn button-lightblue text-center w-100 p-3" onClick={() => this.tagCodeSubmit(true)}>Apply</button>
                                </div>
                            </div>
                            {this.state.submitted && (this.state.promoCodeErr) &&
                                <p className="text-danger">Please enter valid access code</p>}

                            {this.state.subscribedErr &&
                                <p className="text-danger">{Errors.subscribed_user_1}</p>}
                        </div>
                    </div>
                    {this.props.pageFrom == 'register' &&
                        <div
                            id="register-link"
                            className="buttons-read float-left text-center col-lg-10 col-xs-10 col-md-10 m-b-30"
                        >
                            <button
                                className="btn btn-beam-blue font-14 pointer col-xs-8 m-t-20 col-lg-6 col-md-6 m-r-20"
                                disabled={this.state.disableButton}
                                onClick={() => this.props.setStep(10)}
                            >
                                Go back to continue signing up
                            </button>
                            <a
                                className="btn btn-beam-blue-inverse font-14 col-xs-8 col-lg-4 m-t-20 col-md-4"
                                href="/home"
                            >
                                Go back to Beam homepage

                            </a>

                        </div>
                    }
                </div>
            </div>
        )
    };
}

const mapStateToProps = state => {
    return {
        heard_from: state.register.heard_from,
        instructorList: state.register.instructorList,
        isConditionHasCode: state.register.isConditionHasCode,
    };
};

const mapDispatchToProps = { getPromocodePaln, start_loader, stop_loader, registerNewUser, setStep, getConditionBasedInstructor, getPlanByCountry, setConditionIndex, validateTagCodes, setPageTitle };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AsthmaPilotComponent);
