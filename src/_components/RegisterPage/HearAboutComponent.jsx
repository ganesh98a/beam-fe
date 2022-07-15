import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Errors from "../../Errors";
import { getPromocodePaln, start_loader, stop_loader, registerNewUser, setStep, getConditionBasedInstructor, getPlanByCountry, setConditionIndex, validateTagCodes, setPageTitle } from '../../actions';
import { toast } from "react-toastify";
import * as constand from "../../constant";
import ReactGA from 'react-ga';
import { json } from 'mathjs';

class HearAboutComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            know_via: this.props.registerFormvalues.know_via,
            promocode: this.props.registerFormvalues.promocode,
            submitted: false,
            promoCodeErr: false,
            subscribedErr: false,
            showPromo: false,
            KR_Cond: [],
            instructors: []
        }
        this.updateVia = this.updateVia.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {

        console.log('hearabout.registerFormvalues', this.props.isConditionHasCode)
        console.log('hearabout.registerFormvalues', this.props.registerFormvalues)
        this.props.getPlanByCountry(this.props.registerFormvalues.country);
        this.props.setConditionIndex(0);

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
        this.props.setPageTitle('How did you hear about us?');
    }
    updateVia(arg) {
        this.setState({ know_via: arg.target.value, referee: '' });
        this.props.registerFormvalues.know_via = arg.target.value;
        if (this.props.registerFormvalues.know_via == 10) {
            var params = { conditions: this.props.registerFormvalues.health_condition }
            this.props.getConditionBasedInstructor(params)
        }
    }
    changeReferee(arg) {
        this.setState({ referee: arg.target.value });
        this.props.registerFormvalues.referee = arg.target.value;
    }
    handleChange(e) //for twoway binding
    {
        const { name, value } = e.target;
        this.setState({ promocode: value, subscribedErr: false });
        this.props.registerFormvalues[name] = value;

        if (constand.KD_BEAM_RESEARCH == value) {
            this.props.registerFormvalues.isKBResearcheUser = true; //kidney beam research user
        }
    }
    
    tagCodeSubmit = () => {
        var promocode = this.props.registerFormvalues.promocode;
        var conditionId = this.props.registerFormvalues.health_condition[0].id;
        if (this.props.registerFormvalues.promocode.trim()) {
            this.props.validateTagCodes(this.props.registerFormvalues.promocode.trim(), conditionId).then(
                response => {
                    this.props.stop_loader();
                    this.props.registerFormvalues.promocode = '';

                    if (response) {
                        this.props.registerFormvalues.tagCode = response.tagCode;
                        this.props.registerformUpdate(this.props.registerFormvalues);
                        if (promocode && response.tagCode.modalContent) {
                            this.props.gotoStep(22); //research niceone page
                        } else {
                            this.props.gotoStep(23); // straight away go for membership options
                        }
                        //this.props.nextStep();

                    } else {
                        this.setState({ promoCodeErr: true })
                    }
                },
                error => {
                    this.props.stop_loader();
                    toast.error(error);
                }
            );
        } else {
            this.props.gotoStep(23); // straight away go for membership options
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
                <h3 className="text-center "><a className="pull-left" href="javascript:void(0)" onClick={this.props.prevStep}><img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} /></a>How did you hear about us?<Link
                    to="/home"
                    className="close-register orangefont"
                >
                    X
                </Link></h3>
    }
                <div className="row justify-content-center align-items-center">
                    <div className="input_section col-md-6 m-t-20">
                        <div className="form-group">
                            {<div className="dropdown">
                                <select value={this.props.registerFormvalues.know_via} className="form-control" onChange={this.updateVia.bind(this)}>
                                    <option value="">Select</option>
                                    {this.props.heard_from.map((item, key) => {
                                        return (
                                            <option key={"hear_" + key} value={item.id}>{item.heard_from}</option>
                                        );
                                    })}

                                </select>
                            </div>}
                            {/* <div className="form-group">
                                {// <label htmlFor="promocode" className="text-label">How did you here about us?</label> /}
                                <input type="text" name="know_via" id="know_via" className="form-control input-control" onChange={this.handleChange} value={this.props.registerFormvalues.know_via} placeholder="How did you hear about us?" />
                            </div> */}
                            {this.state.submitted && (!this.props.registerFormvalues.know_via) && <p className="text-danger">This Field is required</p>}
                        </div>
                        {this.state.know_via == 10 &&
                            <div className="form-group">
                                <label htmlFor="country" className="text-label">
                                    Which of our instructors recommended Beam to you? </label>
                                {<div className="dropdown">
                                    <select value={this.props.registerFormvalues.referee} className="form-control" onChange={this.changeReferee.bind(this)}>
                                        <option value="">Select</option>
                                        {this.props.instructorList.map((item, key) => {
                                            return (
                                                <option key={"ins_" + key} value={item.id}>{item.fullName}</option>
                                            );
                                        })}

                                    </select>
                                </div>}
                                {this.state.submitted && (!this.props.registerFormvalues.referee) && <p className="text-danger">This Field is required</p>}
                            </div>
                        }
                        {this.props.isConditionHasCode &&
                            <div className="form-group">
                                <label htmlFor="promocode" className="text-label">Got a research code?</label>
                                <input type="text" name="promocode" id="promocode" className="form-control input-control" onChange={this.handleChange} value={this.props.registerFormvalues.promocode} />
                            </div>
                        }
                        {this.state.submitted && (this.state.promoCodeErr) &&
                            <p className="text-danger">Please enter correct promo or access code</p>}
                        {this.state.subscribedErr &&
                            <p className="text-danger">{Errors.subscribed_user_1}</p>}


                        <div id="register-link" className=" w-100 m-t-80 m-b-20 float-left">
                            <a href="javascript:void(0)" onClick={this.tagCodeSubmit} className="bluebtn float-left w-100 text-center">Next</a>
                        </div>
                    </div>
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
)(HearAboutComponent);
