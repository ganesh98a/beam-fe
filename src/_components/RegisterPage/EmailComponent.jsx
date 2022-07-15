import React from 'react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
    checkUserExist,
    start_loader,
    stop_loader
} from "../../actions";
import { toast } from "react-toastify";
import * as constand from "../../constant";
import ReactGA from 'react-ga';
import { commonService } from "../../_services";

class EmailComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email_error: (this.props.registerFormvalues.email) ? false : true,
            email_pattern_error: !commonService.mailPatternCheck(this.props.registerFormvalues.email),
            submitted: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.registerSubmit_3 = this.registerSubmit_3.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.checkUserExist = this.checkUserExist.bind(this);
    }
    handleChange(e) //for twoway binding
    {
        const { name, value } = e.target;
        this.props.registerFormvalues[name] = value;
        let flag = (e.target.value === '') ? true : false;
        let isvalid_pattern = commonService.mailPatternCheck(e.target.value);
        this.setState({ email_error: flag, email_pattern_error: !isvalid_pattern });
    }
    handleCheckboxChange(e) //for twoway binding checkbox
    {
        const { name } = e.target;
        this.props.registerFormvalues[name] = !this.props.registerFormvalues[name];
    }
    registerSubmit_3() {
        this.setState({ submitted: true });
        if (((!this.state.email_error && !this.state.email_pattern_error) || (this.props.registerFormvalues.ispackster === true)) && (this.props.registerFormvalues.terms === true)) {
            this.props.registerformUpdate(this.props.registerFormvalues);
            this.checkUserExist();
            ReactGA.event({
                category: "User Acquisition",
                action: "Sign up process",
                label: "Email"
            })
        }
    }
    checkUserExist() {
        if (this.props.registerFormvalues.email) {
            var dataObj = {
                email: this.props.registerFormvalues.email,
                isEmail: 1
            };
            this.props.checkUserExist(dataObj).then(
                response => {
                    if (this.props.registerFormvalues.facebookId) {
                        this.props.gotoStep(5);
                    } else {
                        this.props.nextStep();
                    }
                },
                error => {
                    toast.error(error);
                }
            );
        } else {
            if (this.props.registerFormvalues.ispackster === true) {
                this.props.gotoStep(5);
            } else {
                this.props.nextStep();
            }
        }
    }
    render() {
        return (
            <div className="step3">
                <h3 className="text-center ">{(this.props.registerFormvalues.ispackster === false) && <span className="pull-left pointer" onClick={() => this.props.prevStep()}><img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} /></span>}{(this.props.registerFormvalues.ispackster === true) ? 'We just need to grab a few more details from you before you can start Beaming...' : 'How can we reach you?'}
                    <Link
                        to="/home"
                        className="close-register orangefont"
                    >
                        X
                    </Link>
                </h3>

                <div className="row justify-content-center align-items-center">
                    <div className="input_section col-md-6 m-t-10">
                        {(this.props.registerFormvalues.ispackster === false) &&
                            <div className="form-group">
                                <label htmlFor="email" className="text-label">Email Address</label>
                                <input type="text" name="email" id="email" className="form-control input-control" onChange={this.handleChange} value={this.props.registerFormvalues.email} required readOnly={this.props.registerFormvalues.research ? true : false} />
                                {this.state.submitted && this.state.email_error && <p className="text-danger">Email is required</p>}
                                {this.state.submitted && !this.state.email_error && this.state.email_pattern_error && <p className="text-danger">Invalid Email</p>}
                            </div>}
                        {!this.props.registerFormvalues.research &&
                            <div>
                                <p className="font-14 font-qmedium black-txt m-t-20 m-b-20 ">Sign up to be the first to see the latest releases on Beam, class recommendations, your personal activity stats, research opportunities and so much more</p>
                                <div className="toggle-btns float-left w-100">
                                    <span className="font-14 font-qregular black-txt">The latest updates, classes & features
                                    </span>
                                    <label className="switch m-l-10 m-t-10 pull-right" htmlFor="is_newfeature_updates">
                                        <input type="checkbox" name="is_newfeature_updates" id="is_newfeature_updates" defaultChecked={this.props.registerFormvalues.is_newfeature_updates} onChange={this.handleCheckboxChange} value={this.props.registerFormvalues.is_newfeature_updates} />
                                        <div className="slider round"></div>
                                    </label>
                                </div>
                                <div className="toggle-btns float-left w-100">
                                    <span className="font-14 font-qregular black-txt">Research opportunities</span>
                                    <label className="switch m-l-10 m-t-10 pull-right" htmlFor="is_research_opportunities">
                                        <input type="checkbox" name="is_research_opportunities" id="is_research_opportunities" defaultChecked={this.props.registerFormvalues.is_research_opportunities} onChange={this.handleCheckboxChange} value={this.props.registerFormvalues.is_research_opportunities} />
                                        <div className="slider round"></div>
                                    </label>
                                </div>
                            </div>
                        }
                        <p className="font-14 font-qmedium black-txt float-left m-t-20">Can you confirm you’ve read our…?</p>
                        <div className="toggle-btns float-left w-100">
                            <span className="font-14 font-qregular black-txt"><a className="black-txt" href="/terms" target="_blank"> <u>T&Cs</u> </a>and <a className="black-txt" href="/privacy" target="_blank"><u>Privacy policy…</u></a></span>
                            <label className="switch m-l-10 m-t-10 pull-right" htmlFor="terms">
                                <input type="checkbox" name="terms" id="terms" defaultChecked={this.props.registerFormvalues.terms} onChange={this.handleCheckboxChange} value={this.props.registerFormvalues.terms} />
                                <div className="slider round"></div>
                            </label>
                            {this.state.submitted && (this.props.registerFormvalues.terms === false) && <p className="text-danger">This Field is required</p>}

                        </div>

                        <div id="register-link" className=" w-100 m-t-80 m-b-20 float-left">
                            <span onClick={this.registerSubmit_3} className="bluebtn float-left w-100 text-center pointer">Next</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = {
    start_loader,
    stop_loader,
    checkUserExist
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmailComponent);
