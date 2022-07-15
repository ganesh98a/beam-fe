import React from "react";
import { Link } from 'react-router-dom';
import * as constand from "../../constant";
import ReactGA from 'react-ga';

class BehalfSomeoneComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            purpose: this.props.registerFormvalues.purpose,
            submitted: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.purposeSubmit = this.purposeSubmit.bind(this);
        this.goBack = this.goBack.bind(this);
        this.checkKR = this.checkKR.bind(this);
    }
    handleChange(e) {
        //for twoway binding
        const { name, value } = e.target;
        this.setState({ [name]: value });
        this.props.registerFormvalues[name] = value;
    }

    purposeSubmit() {
        this.setState({ submitted: true });
        this.props.setStep(8,'forward');

    }
    checkKR() {
        var KR_Cond_temp = [];
        KR_Cond_temp = this.props.registerFormvalues.health_condition.filter(function (item) {
            return (item.tag == constand.KR_CONDITION)
        })
        return KR_Cond_temp
    }
    goBack() {
        console.log('goback', this.props.registerFormvalues)
        if ((this.props.registerFormvalues.profession === '1' || this.props.registerFormvalues.profession === '2') && this.checkKR().length > 0)
            this.props.setStep(19, 'backward')
        else
            this.props.setStep(6, 'backward')

        //this.props.prevStep();
    }
    render() {
        return (
            <div className="step6">
                <h3 className="text-center ">
                    <span
                        className="pull-left pointer"
                        onClick={this.goBack}
                    >
                        <img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} />
                    </span>
          Signing up to Beam on behalf of someone else<Link
                        to="/home"
                        className="close-register orangefont"
                    >
                        X
                            </Link>
                </h3>
                <div className="row justify-content-center align-items-center">
                    <div className="input_section col-md-6 m-t-10">
                        <p className="text-label">
                            If you are signing up to Beam on behalf of someone else (a child, person you care for, etc) then please fill out the following details for the person you are signing up for (not for yourself)
                </p>
                        <div>
                            <div className="text-center">
                                <img src={constand.WEB_IMAGES + "Floor-Mat.png"} id="icon" className="img-fluid" alt="User thanks" />

                            </div>

                        </div>

                        <div id="register-link" className=" w-100 m-t-80 m-b-20 float-left">
                            <span
                                onClick={() => this.purposeSubmit()}
                                className="bluebtn float-left w-100 font-medium font-14 text-center pointer"
                            >
                                OK - let's go!
              </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { BehalfSomeoneComponent };
