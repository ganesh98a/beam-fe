import React from 'react';
import { Link } from "react-router-dom";
import * as constand from "../../constant";
import ReactGA from 'react-ga';

class NameComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: (this.props.registerFormvalues.firstname) ? false : true,
            lastname: (this.props.registerFormvalues.lastname) ? false : true,
            submitted: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.registerSubmit_1 = this.registerSubmit_1.bind(this);
    }

    handleChange(e) //for twoway binding
    {
        let { name, value } = e.target;
        value = (value.length === 1) ? value.trim() : value;
        this.setState({ [name]: value });
        this.props.registerFormvalues[name] = value;
    }
    registerSubmit_1() {
        this.setState({ submitted: true });
        if (this.props.registerFormvalues.firstname && this.props.registerFormvalues.lastname && this.props.registerFormvalues.firstname.length <= 50 && this.props.registerFormvalues.lastname.length <= 50) {
            this.props.registerFormvalues.beamchallenging = localStorage.getItem('beamchallenging');
            this.props.registerformUpdate(this.props.registerFormvalues);
            this.props.nextStep();
            ReactGA.event({
                category: "User Acquisition",
                action: "Sign up process",
                label: "Name"
              })
        }
    }
    render() {
        return (
            <div className="step1">
                <h3 className="text-center "> <span className="pull-left pointer d-none" onClick={this.props.prevStep}><img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} /></span>What’s your name? <Link
                    to="/home"
                    className="close-register orangefont"
                >
                    X
                            </Link> </h3>
                <div className="row justify-content-center align-items-center">
                    <div className="input_section col-md-6 m-t-10">
                        <div className="form-group">
        <label htmlFor="firstname" className="text-label">First name</label>
                            <input type="text" name="firstname" id="firstname" className="form-control input-control" length="100"
                                onChange={this.handleChange} value={this.props.registerFormvalues.firstname} required />
                            {this.state.submitted && !this.props.registerFormvalues.firstname && <p className="text-danger">First name is required</p>}
                            {this.state.submitted && this.props.registerFormvalues.firstname.length > 50 && <p className="text-danger">First name is too long</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastname" className="text-label">Last name</label>
                            <input type="text" name="lastname" id="lastname" className="form-control input-control" onChange={this.handleChange} value={this.props.registerFormvalues.lastname} required />
                            {this.state.submitted && !this.props.registerFormvalues.lastname && <p className="text-danger">Last name is required</p>}
                            {this.state.submitted && this.props.registerFormvalues.lastname.length > 50 && <p className="text-danger">Last name is too long</p>}
                        </div>

                        <div id="register-link" className=" w-100 m-t-80 m-b-20 float-left">
                            <span className="bluebtn float-left w-100 text-center pointer" onClick={this.registerSubmit_1}>Next</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

export { NameComponent };
