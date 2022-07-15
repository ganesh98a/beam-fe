import React from "react";
import { connect } from "react-redux";
import * as constand from "../../constant";
import _ from 'lodash';
let valid = require("card-validator");

class PaymentComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            payment_data: {}
        };
    }
    /**
     * Validate Number
     * @param {*} e 
     */
    numberOnly = (e) => {
        const re = /^[0-9\b]+$/;

        // if value is not blank, then test the regex
        const { name, value } = e.target;
        if (value === "" || re.test(value)) {
            this.updatePaymentData(name, value);
        }
    }
    /**
     * Validate month
     * @param {*} e 
     */
    expiremonthValid = (e) => {
        const re = /^[0-9\b]+$/;

        // if value is not blank, then test the regex
        const { name, value } = e.target;
        if ((value === "" || re.test(value)) && value.length <= 2) {
            this.updatePaymentData(name, value);
        }
    }
    /**
     * Validate year
     * @param {*} e 
     */
    expireyearValid = (e) => {
        const re = /^[0-9\b]+$/;
        // if value is not blank, then test the regex
        const { name, value } = e.target;
        if ((value === "" || re.test(value)) && value.length <= 4) {
            this.updatePaymentData(name, value);
        }
    }
    /**
     * To update state
     * @param {*} name 
     * @param {*} value 
     */
    updatePaymentData = (name, value) => {
        var newValue = {};
        newValue[name] = value;
        this.setState({
            payment_data: { ...this.state.payment_data, ...newValue }
        });
    }
    /**
     * To handle onchange 
     * @param {*} e 
     */
    handlePaymentChange = (e) => {
        const { name, value } = e.target;
        this.updatePaymentData(name, value);
    }
    /**
     * To validate payment details
     * @returns 
     */
    validatePaymentFields = () => {
        var newValue = {};
        newValue.submitted = true;
        this.setState({ payment_data: { ...this.state.payment_data, ...newValue } });
        var cur_month = new Date().getMonth();
        let cur_year = new Date().getFullYear();
        console.log(new Date(this.state.payment_data.card_exp_year + '-' + this.state.payment_data.card_exp_month + '-01').getTime() + "======" + new Date(cur_year + '-' + cur_month + '-01').getTime())
        console.log(new Date(this.state.payment_data.card_exp_year + '-' + this.state.payment_data.card_exp_month + '-01').getTime() > new Date(cur_year + '-' + cur_month + '-01').getTime())
        if (
            this.state.payment_data.card_name &&
            this.state.payment_data.card_number &&
            valid.number(this.state.payment_data.card_number).isValid &&
            this.state.payment_data.card_exp_month &&
            this.state.payment_data.card_exp_month <= 12 &&
            this.state.payment_data.card_exp_year &&
            this.state.payment_data.card_exp_year >= new Date().getFullYear() &&
            this.state.payment_data.card_security_code &&
            this.state.payment_data.card_security_code.length ===
            valid.number(this.state.payment_data.card_number).card.code.size &&
            this.state.payment_data.card_zipcode &&
            new Date(this.state.payment_data.card_exp_year + '-' + this.state.payment_data.card_exp_month + '-01').getTime() > new Date(cur_year + '-' + cur_month + '-01').getTime()
        ) {
            console.log('valid')

            this.props.submitPayment(this.state.payment_data);
        } else {
            if (new Date(this.state.payment_data.card_exp_year + '-' + this.state.payment_data.card_exp_month + '-01').getTime() < new Date(cur_year + '-' + cur_month + '-01').getTime())
                this.setState({ payment_data: { ...this.state.payment_data, invalid_expiration: true } });
            console.log('not valid')
            return false;
        }
    }

    render() {
        return (
            <div className="step14">
                <div className="row justify-content-center align-items-center">
                    <div className="col-md-6 m-b-20 p-l-0 mx-auto text-center">
                        <img src={constand.WEB_IMAGES + "logo.png"} id="icon" className="img-fluid logo-size m-b-10" alt="beam logo" />
                        <span className="purplefont font-bold font-18 align-bottom text-capitalize">
                            {this.state.condition_name}
                        </span>
                    </div>

                    <div className="input_section card-details--page col-md-9 m-t-10">
                        <div className="form-group">
                            <div className="row">
                                <div className="form-group col-md-12 float-left">
                                    <label htmlFor="card_name" className="text-label">
                                        Name on Card
                  </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control input-control"
                                            name="card_name"
                                            placeholder=""
                                            onChange={(e) => this.handlePaymentChange(e)}
                                            value={this.state.payment_data.card_name}
                                            required
                                        />
                                    </div>
                                    {this.state.payment_data.submitted &&
                                        !this.state.payment_data.card_name && (
                                            <p className="help-block text-danger">
                                                Name on card required
                                            </p>
                                        )}
                                </div>
                                <div className="form-group col-md-12 float-left">
                                    <label htmlFor="card_number" className="text-label">
                                        Card number
                  </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control input-control"
                                            name="card_number"
                                            placeholder=""
                                            onChange={(e) => this.numberOnly(e)}
                                            value={this.state.payment_data.card_number}
                                        />
                                    </div>
                                    {this.state.payment_data.submitted &&
                                        !this.state.payment_data.card_number && (
                                            <p className="help-block  text-danger">
                                                Card number required
                                            </p>
                                        )}
                                    {this.state.payment_data.submitted &&
                                        this.state.payment_data.card_number &&
                                        !valid.number(this.state.payment_data.card_number)
                                            .isValid && (
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
                                                        onChange={(e) => this.expiremonthValid(e)}
                                                        value={this.state.payment_data.card_exp_month}
                                                        required
                                                    />
                                                </div>
                                                {this.state.payment_data.submitted &&
                                                    !this.state.payment_data.card_exp_month && (
                                                        <p className="help-block  text-danger">
                                                            Month required
                                                        </p>
                                                    )}
                                                {this.state.payment_data.submitted &&
                                                    this.state.payment_data.card_exp_month > 12 && (
                                                        <p className="help-block  text-danger">
                                                            Invalid month
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
                                                        onChange={(e) => this.expireyearValid(e)}
                                                        value={this.state.payment_data.card_exp_year}
                                                        required
                                                    />
                                                </div>
                                                {this.state.payment_data.submitted &&
                                                    !this.state.payment_data.card_exp_year && (
                                                        <p className="help-block  text-danger">
                                                            Expire year required
                                                        </p>
                                                    )}
                                                {this.state.payment_data.submitted &&
                                                    this.state.payment_data.card_exp_year &&
                                                    this.state.payment_data.card_exp_year <
                                                    new Date().getFullYear() && (
                                                        <p className="help-block  text-danger">
                                                            Invalid expire year
                                                        </p>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-7">
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
                                                onChange={(e) => this.handlePaymentChange(e)}
                                                value={this.state.payment_data.card_security_code}
                                                required
                                            />
                                        </div>
                                        {this.state.payment_data.submitted &&
                                            !this.state.payment_data.card_security_code && (
                                                <p className="help-block  text-danger">
                                                    Security code required
                                                </p>
                                            )}
                                        {this.state.payment_data.submitted &&
                                            (this.state.payment_data.card_security_code &&
                                                valid.number(this.state.payment_data.card_number)
                                                    .card) &&
                                            this.state.payment_data.card_security_code.length !==
                                            valid.number(this.state.payment_data.card_number).card
                                                .code.size && (
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
                                                onChange={(e) => this.handlePaymentChange(e)}
                                                value={this.state.payment_data.card_zipcode}
                                                required
                                            />
                                        </div>
                                        {this.state.payment_data.submitted &&
                                            !this.state.payment_data.card_zipcode && (
                                                <p className="help-block  text-danger">
                                                    ZIP/Postal code required
                                                </p>
                                            )}
                                        {this.state.payment_data.submitted && this.state.payment_data.card_zipcode &&
                                            this.state.payment_data.card_zipcode.length > 6 && (
                                                <p className="help-block  text-danger">
                                                    Invalid ZIP/Postal code
                                                </p>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="small-txt font-book text-center">
                            By becoming a member you will be charged {this.props.cost} today and every month after.  You are free to cancel your membership anytime from your membership page.
            </p>
                        {/* !upgrade &&
                            <p className="small-txt font-book text-center">
                                Due today and monthly ongoing:{" "}
                                <span className="orangefont p-l-10">
                                    {membership_plan.currency} {membership_plan.amount}
                                </span>
                            </p> */
                        }
                        {(this.state.payment_data.invalid_expiration) &&
                            <p className="small-txt font-book text-center text-danger m-t-10">Invalid Expiration.</p>}
                    </div>
                </div>
                <div className="row justify-content-center align-items-center">
                    <div className="input_section col-md-6 m-t-10">
                        <div id="register-link" className=" w-100 m-t-20 m-b-20 float-left">
                            <a
                                href="javascript:void(0)"
                                onClick={() => this.validatePaymentFields()}
                                className="bluebtn float-left w-100 font-14 font-medium text-center"
                            >
                                Become a Member
              </a>
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

    };
};

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PaymentComponent);
