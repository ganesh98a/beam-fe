import React from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import * as constand from "../../constant";
import ReactGA from 'react-ga';
import { setStep } from "../../actions";

class PasswordComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: this.props.registerFormvalues.password,
            confirm_password: this.props.registerFormvalues.password,
            password_error: true,
            error_msg: null,
            submitted: false

        }
        this.handleChange = this.handleChange.bind(this);
        this.strongPasswordValidation = this.strongPasswordValidation.bind(this);
        this.registerSubmit_4 = this.registerSubmit_4.bind(this);
    }
    componentDidMount() {
        this.strongPasswordValidation();
    }
    handleChange(e) //for twoway binding
    {
        const { name, value } = e.target;
        this.setState({ [name]: value });
        this.props.registerFormvalues[name] = value;
        this.strongPasswordValidation();
    }
    strongPasswordValidation() {
        let password = this.props.registerFormvalues.password;
        if (password !== "" && password === this.props.registerFormvalues.confirm_password) {
            if (password && password.length < 8) {
                this.setState({ error_msg: "Password must contain at least eight characters", password_error: true });
                return;
            }
            if (password == this.props.registerFormvalues.username) {
                this.setState({ error_msg: "Password must be different from Username", password_error: true });
                return;
            }
            var number_regx = /[0-9]/;
            if (!number_regx.test(password)) {
                this.setState({ error_msg: "Password must contain at least one number (0-9)", password_error: true });
                return;
            }
            var lowercase_regx = /[a-z]/;
            if (!lowercase_regx.test(password)) {
                this.setState({ error_msg: "password must contain at least one lowercase letter (a-z)", password_error: true });
                return;
            }
            var uppercase_regx = /[A-Z]/;
            if (!uppercase_regx.test(password)) {
                this.setState({ error_msg: "password must contain at least one uppercase letter (A-Z)", password_error: true });
                return;
            }
            this.setState({ error_msg: null, password_error: false });
            return;
        } else {
            this.setState({ error_msg: "Please check that you've entered and confirmed your password", password_error: true });
            return;
        }
    }

    registerSubmit_4() {
        this.setState({ submitted: true });
        this.strongPasswordValidation();
        if (!this.state.password_error) {
            this.props.registerformUpdate(this.props.registerFormvalues);
            if (this.props.registerFormvalues.research) {
                this.props.setStep(22, 'forward')
            } else
                this.props.nextStep();
            ReactGA.event({
                category: "User Acquisition",
                action: "Sign up process",
                label: "Password creation"
            })
        }
    }
    render() {
        return (
            <div className="step4">
                <h3 className="text-center "><a className="pull-left" href="javascript:void(0)" onClick={this.props.prevStep}><img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} /></a>Let’s keep your details secure<Link
                    to="/home"
                    className="close-register orangefont"
                >
                    X
                            </Link></h3>
                <div className="row justify-content-center align-items-center">
                    <div className="input_section col-md-6 m-t-10">
                        <div className="form-group">
                            <label htmlFor="password" className="text-label">Enter password</label>
                            <input type="password" name="password" id="password" className="form-control input-control" onChange={this.handleChange} value={this.state.password} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm_password" className="text-label">Re-enter password</label>
                            <input type="password" name="confirm_password" id="confirm_password" className="form-control input-control" onChange={this.handleChange} value={this.state.confirm_password} />
                            {this.state.submitted && this.state.error_msg && <p className="text-danger">{this.state.error_msg}</p>}
                        </div>
                        <div id="register-link" className=" w-100 m-t-80 m-b-20 float-left">
                            <a href="javascript:void(0)" onClick={this.registerSubmit_4} className="bluebtn float-left w-100 text-center">Next</a>
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
    setStep
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PasswordComponent);
