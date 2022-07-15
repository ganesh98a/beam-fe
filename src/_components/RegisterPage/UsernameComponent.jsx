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

class UsernameComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { username: this.props.registerFormvalues.username };
        this.handleChange = this.handleChange.bind(this);
        this.registerSubmit_2 = this.registerSubmit_2.bind(this);
        this.checkUserExist = this.checkUserExist.bind(this);
    }
    handleChange(e) //for twoway binding
    {
        const { name, value } = e.target;
        this.setState({ [name]: value });
        this.props.registerFormvalues[name] = value;
    }
    registerSubmit_2(type = false) {
        if (type) {
            console.log('type', this.props.registerFormvalues)
            this.setState({ username: '' })
            this.props.registerFormvalues['username'] = '';
        }
        this.props.registerformUpdate(this.props.registerFormvalues);
        this.checkUserExist();
        ReactGA.event({
            category: "User Acquisition",
            action: "Sign up process",
            label: "Nickname"
        })
    }
    checkUserExist() {
        if (this.props.registerFormvalues.username) {
            var dataObj = {
                email: this.props.registerFormvalues.username,
                isEmail: 0
            };
            this.props.checkUserExist(dataObj).then(
                response => {
                    this.props.nextStep();
                },
                error => {
                    toast.error(error);
                }
            );
        } else {
            this.props.nextStep();
        }
    }
    render() {
        return (
            <div className="step2">
                <h3 className="text-center ">
                    <span className="pull-left pointer" onClick={this.props.prevStep}><img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} /></span>Want an alter-ego?<Link
                        to="/home"
                        className="close-register orangefont"
                    >
                        X
                            </Link></h3>
                <div className="row justify-content-center align-items-center">
                    <div className="input_section col-md-6 m-t-10">
                        <p className="text-label">Please choose a nickname that you (or the person you are signing up for) want to be known by on Beam</p>
                        <div className="form-group">
                            {/* <label htmlFor="username" className="text-label">choose a username</label> */}
                            <input type="text" name="username" id="username" className="form-control input-control" onChange={this.handleChange} value={this.state.username} />
                        </div>
                        <div className="form-group">
                            <div id="register-link" className=" w-100  m-b-20 float-left">
                                <span onClick={() => { this.registerSubmit_2(true) }} className="btn-blue-inverse float-left w-100 font-medium text-center pointer">No,thank you</span>
                            </div>

                        </div>
                        <p className="text-label">(Other Beam users will be able to see your name on class reviews and in groups if an alternative isn't entered.)</p>
                        <div className="  w-100 m-t-10 m-b-10 float-left text-center"><img className="img-fluid" alt="" src={constand.WEB_IMAGES + "signupimg1.png"} /></div>

                        <div id="register-link" className=" w-100 m-t-50 m-b-20 float-left">
                            <span className="bluebtn float-left w-100 text-center pointer" onClick={() => { this.registerSubmit_2(false) }}>Next</span>
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
)(UsernameComponent);