import React from "react";
import { Link } from 'react-router-dom';
import * as constand from "../../constant";
import ReactGA from 'react-ga';

class PurposeComponent extends React.Component {
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
    if (this.props.registerFormvalues.purpose) {
      if(this.props.registerFormvalues.purpose=="2"){
        this.props.setStep(24);
      }else{
        this.props.setStep(8);
      }
      ReactGA.event({
        category: "User Acquisition",
        action: "Sign up process",
        label: "How they will use"
      })
    }
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
    /* if ((this.props.registerFormvalues.profession === '1' || this.props.registerFormvalues.profession === '2') && this.checkKR().length > 0)
      this.props.setStep(19, 'backward')
    else */
      this.props.setStep(5, 'backward')

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
          Would you like to use Beam<Link
            to="/home"
            className="close-register orangefont"
          >
            X
                            </Link>
        </h3>
        <div className="row justify-content-center align-items-center">
          <div className="input_section col-md-7 m-t-10">
            <p className="text-label">
              <b>Please select one</b>
            </p>
            <div>
              <div className="row radio-section">
                <span className="font-14 black-txt font-qregular col-10">
                  For yourself
                </span>
                <div className="radio pull-right col-2 text-right">
                  <input
                    id="prupose_radio_1"
                    name="purpose"
                    value="1"
                    type="radio"
                    defaultChecked={
                      this.props.registerFormvalues.purpose === "1"
                    }
                    onChange={this.handleChange}
                  />
                  <label htmlFor="prupose_radio_1" className="radio-label"></label>
                </div>
              </div>

              <div className="row radio-section">
                <span className="font-14 black-txt font-qregular col-10">
                  With someone who has a medical condition
                </span>
                <div className="radio pull-right col-2 text-right">
                  <input
                    id="prupose_radio_2"
                    name="purpose"
                    value="2"
                    type="radio"
                    defaultChecked={
                      this.props.registerFormvalues.purpose === "2"
                    }
                    onChange={this.handleChange}
                  />
                  <label htmlFor="prupose_radio_2" className="radio-label"></label>
                </div>
              </div>

              <div className="row radio-section">
                <span className="font-14 black-txt font-qregular col-10">
                  Both
                </span>
                <div className="radio pull-right col-2 text-right">
                  <input
                    id="prupose_radio_3"
                    name="purpose"
                    value="3"
                    type="radio"
                    defaultChecked={
                      this.props.registerFormvalues.purpose === "3"
                    }
                    onChange={this.handleChange}
                  />
                  <label htmlFor="prupose_radio_3" className="radio-label"></label>
                </div>
              </div>
              {this.state.submitted &&
                this.props.registerFormvalues.purpose === "" && (
                  <p className="text-danger">This is required</p>
                )}
            </div>

            <div id="register-link" className=" w-100 m-t-80 m-b-20 float-left">
              <span
                onClick={() => this.purposeSubmit()}
                className="bluebtn float-left w-100 font-medium font-14 text-center pointer"
              >
                Next
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { PurposeComponent };
