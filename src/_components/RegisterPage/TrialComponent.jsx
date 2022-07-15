import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { registerNewUser, start_loader, stop_loader, fetchUserDetails } from "../../actions";
import * as constand from "../../constant";
let valid = require('card-validator');
class TrialComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      card_name: this.props.registerFormvalues.card_name,
      card_number: this.props.registerFormvalues.card_number,
      card_exp_year: this.props.registerFormvalues.card_exp_day,
      card_exp_month: this.props.registerFormvalues.card_exp_month,
      card_security_code: this.props.registerFormvalues.card_security_code,
      card_zipcode: this.props.registerFormvalues.card_zipcode,
      submitted: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.numberOnly = this.numberOnly.bind(this);
    this.expiremonthValid = this.expiremonthValid.bind(this);
    this.expireyearValid = this.expireyearValid.bind(this);
    this.registerSubmit_12 = this.registerSubmit_12.bind(this);
  }
  handleChange(
    e //for twoway binding
  ) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    this.props.registerFormvalues[name] = value;
  }
  numberOnly(e) {
    const re = /^[0-9\b]+$/;

    // if value is not blank, then test the regex
    const { name, value } = e.target;
    if (value === "" || re.test(value)) {
      this.setState({ [name]: value });
      this.props.registerFormvalues[name] = value;
    }
  }
  expiremonthValid(e) {
    const re = /^[0-9\b]+$/;

    // if value is not blank, then test the regex
    const { name, value } = e.target;
    if ((value === "" || re.test(value)) && (value.length <= 2)) {
      this.setState({ [name]: value });
      this.props.registerFormvalues[name] = value;
    }
  }
  expireyearValid(e) {
    const re = /^[0-9\b]+$/;

    // if value is not blank, then test the regex
    const { name, value } = e.target;
    if ((value === "" || re.test(value)) && (value.length <= 4)) {
      this.setState({ [name]: value });
      this.props.registerFormvalues[name] = value;
    }
  }
  registerSubmit_12() {
    this.setState({ submitted: true });
    if (
      this.props.registerFormvalues.card_name &&
      this.props.registerFormvalues.card_number && valid.number(this.props.registerFormvalues.card_number).isValid &&
      this.props.registerFormvalues.card_exp_month && (this.props.registerFormvalues.card_exp_month <= 12) &&
      this.props.registerFormvalues.card_exp_year && (this.props.registerFormvalues.card_exp_year >= new Date().getFullYear()) &&
      this.props.registerFormvalues.card_security_code &&
      (this.props.registerFormvalues.card_security_code.length === valid.number(this.props.registerFormvalues.card_number).card.code.size) &&
      this.props.registerFormvalues.card_zipcode
    ) {
      this.props.registerformUpdate(this.props.registerFormvalues);
      this.registerUser();
    }
  }
  /**
    register new user
    **/
  registerUser() {
    this.props.start_loader();
    this.props.registerNewUser(this.props.registerFormvalues).then(
      response => {
        if (response && response.success) {
          //this.props.nextStep();
          const { from } = { from: { pathname: "/register/all_done" } };
          this.props.history.push(from);
        }
        this.getUserDetail();
        //this.props.stop_loader();
      },
      error => {
        this.setState({
          Loading: false
        });
        this.props.stop_loader();
        toast.error(error);
      }
    );
  }

  getUserDetail() {
    this.props.start_loader();
    this.props.fetchUserDetails().then(
      response => {
        this.props.stop_loader();
      },
      error => {
        this.props.stop_loader();
        toast.error(error);
      }
    );
  }

  render() {
    return (
      <div className="step14">
        <h3 className="text-center ">
          <a
            className="pull-left"
            href="javascript:void(0)"
            onClick={this.props.prevStep}
          >
            <img className="arrow-img" src={constand.WEB_IMAGES+"arrow-left.png"} />
          </a>
          10 Credits + <Link
                              to="/home"
                              className="close-register orangefont"
                            >
                              X
                            </Link>{this.props.registerFormvalues.membershipPlan.name}{" "}
          {this.props.registerFormvalues.membershipPlan.currency}{" "}
          {this.props.registerFormvalues.membershipPlan.amount}{" "}
        </h3>
        <div className="row justify-content-center align-items-center">
          <div className="input_section card-details--page col-md-9 m-t-10">
            <p className="text-label text-center">
              Your 1 month trial starts when you click the button below. If you
              dont cancel or change your membership option during the trial.
              your membership will automatically renew...
            </p>
            <div className="form-group">
              <div className="row">
                <div className="form-group col-md-6 float-left">
                  <label htmlFor="card_name" className="text-label">
                    Name on Card
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control input-control"
                      name="card_name"
                      placeholder=""
                      onChange={this.handleChange}
                      value={this.props.registerFormvalues.card_name}
                      required
                    />
                  </div>
                  {this.state.submitted &&
                    !this.props.registerFormvalues.card_name && (
                      <p className="help-block text-danger">
                        Name on card required
                      </p>
                    )}
                </div>
                <div className="form-group col-md-6 float-left">
                  <label htmlFor="card_number" className="text-label">
                    Card number
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control input-control"
                      name="card_number"
                      placeholder=""
                      onChange={this.numberOnly}
                      value={this.props.registerFormvalues.card_number}
                    />
                  </div>
                  {(this.state.submitted &&
                        !this.props.registerFormvalues.card_number) && (
                          <p className="help-block  text-danger">
                            Card number required
                          </p>
                        )}
                  {(this.state.submitted && this.props.registerFormvalues.card_number &&
                        !(valid.number(this.props.registerFormvalues.card_number).isValid)) && (
                          <p className="help-block  text-danger">
                            Invalid card number
                          </p>
                        )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-lg-5 expiration-date">
                  <div className="form-group">
                    <label className="text-label">
                      <span className="hidden-xs">Expiration</span>{" "}
                    </label>
                    <div className="form-inline">
                      <div className="col-md-6 p-l-0 exp-date">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control input-control"
                            name="card_exp_month"
                            placeholder="MM"
                            onChange={this.expiremonthValid}
                            value={this.props.registerFormvalues.card_exp_month}
                            required
                          />
                        </div>
                        {this.state.submitted &&
                          !this.props.registerFormvalues.card_exp_month && (
                            <p className="help-block  text-danger">
                              Expire month required
                            </p>
                          )}
                          {this.state.submitted &&
                          (this.props.registerFormvalues.card_exp_month > 12) && (
                            <p className="help-block  text-danger">
                              Invalid expire month
                            </p>
                          )}
                      </div>
                      <div className="col-md-6 p-0">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control input-control"
                            name="card_exp_year"
                            placeholder="YYYY"
                            onChange={this.expireyearValid}
                            value={this.props.registerFormvalues.card_exp_year}
                            required
                          />
                        </div>
                        {this.state.submitted &&
                          !this.props.registerFormvalues.card_exp_year && (
                            <p className="help-block  text-danger">
                              Expire year required
                            </p>
                          )}
                        {this.state.submitted && this.props.registerFormvalues.card_exp_year &&
                          (this.props.registerFormvalues.card_exp_year < new Date().getFullYear()) && (
                            <p className="help-block  text-danger">
                              Invalid expire year
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 postal-code">
                  <div className="form-group">
                    <label htmlFor="card_security_code" className="text-label">
                      Security Code
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control input-control"
                        name="card_security_code"
                        placeholder=""
                        onChange={this.handleChange}
                        value={this.props.registerFormvalues.card_security_code}
                        required
                      />
                    </div>
                    {this.state.submitted &&
                      !this.props.registerFormvalues.card_security_code && (
                        <p className="help-block  text-danger">
                          Security code required
                        </p>
                      )}
                      {this.state.submitted &&
                      (this.props.registerFormvalues.card_security_code && valid.number(this.props.registerFormvalues.card_number).card) && (this.props.registerFormvalues.card_security_code.length !== valid.number(this.props.registerFormvalues.card_number).card.code.size) && (
                        <p className="help-block  text-danger">
                          Invalid security code
                        </p>
                      )}
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="form-group">
                    <label htmlFor="card_zipcode" className="text-label">
                      ZIP/Postal code
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control input-control"
                        name="card_zipcode"
                        placeholder=""
                        onChange={this.handleChange}
                        value={this.props.registerFormvalues.card_zipcode}
                        required
                      />
                    </div>
                    {this.state.submitted &&
                      !this.props.registerFormvalues.card_zipcode && (
                        <p className="help-block  text-danger">
                          ZIP/Postal code required
                        </p>
                      )}
                      {this.state.submitted &&
                      this.props.registerFormvalues.card_zipcode && this.props.registerFormvalues.card_zipcode.length>6 && (
                        <p className="help-block  text-danger">
                          Invalid ZIP/Postal code
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </div>
            <p className="small-txt font-book text-center">
              Due today<span className="orangefont p-l-10">€0.00</span>
            </p>
          </div>
        </div>
        <div className="row justify-content-center align-items-center">
          <div className="input_section col-md-6 m-t-10">
            <div id="register-link" className=" w-100 m-t-20 m-b-20 float-left">
              <a
                href="javascript:void(0)"
                onClick={this.registerSubmit_12}
                className="bluebtn float-left w-100 font-14 font-medium text-center"
              >
                Start my free trail
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = {
  registerNewUser,
  start_loader,
  stop_loader,
  fetchUserDetails
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrialComponent);
