import React from 'react';
import { Link } from 'react-router-dom';
import * as constand from "../../constant";
import ReactGA from 'react-ga';

class GenderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gender: this.props.registerFormvalues.gender,
            submitted: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.backMove = this.backMove.bind(this);
        this.registerSubmit_5 = this.registerSubmit_5.bind(this);
    }
    handleChange(value) //for twoway binding
    {
        this.setState({ gender: value })
        this.props.registerFormvalues.gender = value;
    }
    registerSubmit_5() {
        this.setState({ submitted: true })
        if (this.props.registerFormvalues.gender != '') {
            ReactGA.event({
                category: "User Acquisition",
                action: "Sign up process",
                label: "Gender"
            })
            this.props.nextStep();
        }
    }
    backMove() {
        if (this.props.registerFormvalues.ispackster === true) {
            this.props.gotoStep(3);
        } else {
            this.props.gotoStep(6);
        }
    }
    render() {
        return (
            <div className="step5">
                <h3 className="text-center "><a className="pull-left" href="javascript:void(0)" onClick={this.backMove}><img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} /></a>What gender do you identify with?
                    <Link
                        to="/home"
                        className="close-register orangefont"
                    >
                        X
                    </Link></h3>
                <div className="row justify-content-center align-items-center">
                    <div className="input_section col-md-6 m-t-20">
                        <div className="form-group">
                            <div id="register-link" className=" w-100  m-b-20 float-left">
                                <a href="javascript:void(0)" className={(this.props.registerFormvalues.gender === 1) ? "btn-orange btn-gender float-left w-100 text-center" : "btn-orange-inverse float-left btn-gender w-100 text-center"} onClick={() => this.handleChange(1)}>Male</a>
                            </div>
                            <div id="register-link" className=" w-100  m-b-20 float-left">
                                <a href="javascript:void(0)" className={(this.props.registerFormvalues.gender === 2) ? "btn-orange btn-gender float-left w-100 text-center" : "btn-orange-inverse btn-gender float-left w-100 text-center"} onClick={() => this.handleChange(2)}>Female</a>
                            </div>
                            <div id="register-link" className=" w-100  m-b-20 float-left">
                                <a href="javascript:void(0)" className={(this.props.registerFormvalues.gender === 3) ? "btn-orange btn-gender float-left w-100 text-center" : "btn-orange-inverse btn-gender float-left w-100 text-center"} onClick={() => this.handleChange(3)}>Neither</a>
                            </div>
                            {this.state.submitted && !this.state.gender && <p className="help-block text-danger">Gender is required</p>}
                        </div>

                        <div id="register-link" className=" w-100 m-t-80 m-b-20 float-left">
                            <a href="javascript:void(0)" onClick={this.registerSubmit_5} className="bluebtn float-left font-medium font-14 w-100 text-center">Next</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

export { GenderComponent };