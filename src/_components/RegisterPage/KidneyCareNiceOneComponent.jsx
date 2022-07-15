import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { start_loader, stop_loader, setStep, registerNewUser } from "../../actions";
import * as constand from "../../constant";
import { toast } from "react-toastify";

class KidneyCareNiceOneComponent extends React.Component {
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
    }
    componentDidMount() {
        this.props.start_loader();

    }
    handleCheckboxChange(e) //for twoway binding checkbox
    {
        const { name } = e.target;
        this.props.registerFormvalues[name] = !this.props.registerFormvalues[name];
    }
    finalSubmit() {
        this.setState({ submitted: true, promoCodeErr: false, subscribedErr: false });
        this.props.registerformUpdate(this.props.registerFormvalues);
        this.registerUser(this.props.registerFormvalues);
    }
    /**
     register new user
    **/
    registerUser(registerFormvalues) {

        this.props.start_loader();
        this.props.registerNewUser(registerFormvalues).then(
            response => {

                if (response && response.success) {
                    const { from } = { from: { pathname: "/on-demand/" + constand.KR_CONDITION.replace(' ', '-') } };
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
    render() {
        var condition = this.props.condition.replace(' ', '-');
        return (

            <div className="step16">
                <h3 className="text-center">
                    <a
                        className="pull-left"
                        href="javascript:void(0)"
                        onClick={() => this.props.setStep(14, 'backward')}
                    >
                        <img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} />
                    </a>
          Nice one, {this.props.registerFormvalues.firstname}!
          <Link
                        to="/home"
                        className="close-register orangefont"
                    >X</Link>
                </h3>
                <div className="row justify-content-center align-items-center">
                    <div className="input_section col-md-10 m-t-10">
                        <div className="text-center font-20 font-qmedium">
                            <p>
                                Hooray!  You have been gifted a FREE Beam membership</p>
                            <p>
                                until 30th November 2021 courtesy of Kidney Research UK! </p>
                        </div>
                        <div class="col-md-12 mt-4 mb-3">
                            <div class="row">
                                <div className="video-tag1 col-md-12">
                                    <img src={constand.WEB_IMAGES + "KRUK-logo.png"} id="icon" className="thanks-img img-fluid" alt="beam logo" />
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div className="video-tag1 col-md-12 font-14 font-qregular black-txt">
                                <p>
                                    Kidney Research UK fund and deliver life-saving research. Their vision is to free lives from the restrictions, fear, anxiety and life limiting nature of kidney disease. They would love to keep you up to date with the latest research news and developments, opportunities to get involved in research, fundraising campaigns and events.</p>
                                <p>
                                    Please let us know if you are happy that we share your details with them so they can keep in touch:
                                    </p>
                            </div>
                        </div>
                        <div className="toggle-btns float-left w-100">
                            <span className="font-14 font-qregular black-txt">I am happy for you to share my name and email address and be contacted by Kidney Research UK</span>
                            <label className="switch m-l-10 m-t-10 pull-right" htmlFor="shareKRUK">
                                <input type="checkbox" name="shareKRUK" id="shareKRUK" defaultChecked={this.props.registerFormvalues.shareKRUK} onChange={this.handleCheckboxChange} value={this.props.registerFormvalues.shareKRUK} />
                                <div className="slider round"></div>
                            </label>
                        </div>
                        <div class="row">
                            <div className="video-tag1 col-md-12 font-14 font-qregular black-txt">
                                <p>You can read Kidney Research UK’s <a href="https://kidneyresearchuk.org/privacy-cookies-policy/" target="_blank">privacy policy</a> to find out what data they hold, what it is used for and where it is stored.</p>
                            </div>
                        </div>


                        {/* <div className="toggle-btns float-left w-100">
                            <span className="font-14 font-qregular black-txt">I am happy to be contacted by Kidney Research UK by email </span>
                            <label className="switch m-l-10 m-t-10 pull-right" htmlFor="emailKRUK">
                                <input type="checkbox" name="emailKRUK" id="emailKRUK" defaultChecked={this.props.registerFormvalues.emailKRUK} onChange={this.handleCheckboxChange} value={this.props.registerFormvalues.emailKRUK} />
                                <div className="slider round"></div>
                            </label>
                        </div> */}
                        <div
                            id="register-link"
                            className=" w-100 m-b-30 float-left p-t-15"
                        >
                            <button
                                className="w-50 mx-auto d-table btn  dblog_btn font-14 button-lightblue position-relative"
                                disabled={this.state.disableButton}
                                onClick={this.finalSubmit}
                            >
                                Whoo hoo! Let's get started
                            </button>
                        </div>
                    </div>
                </div>
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

const mapDispatchToProps = { start_loader, stop_loader, setStep, registerNewUser };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(KidneyCareNiceOneComponent);
