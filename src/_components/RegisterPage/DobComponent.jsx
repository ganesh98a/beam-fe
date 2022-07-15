import React from "react";
import * as constand from "../../constant";
import { toast } from "react-toastify";
import * as Errors from "../../Errors";
import { Link } from 'react-router-dom';
import moment from 'moment';
import ReactGA from 'react-ga';
import { commonService } from "../../_services";

// import Dropdown from 'react-dropdown';
// import 'react-dropdown/style.css';
// import Select from 'react-select';
class DobComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dob_month: this.props.registerFormvalues.dob_month,
      dob_day: this.props.registerFormvalues.dob_day,
      dob_year: this.props.registerFormvalues.dob_year,
      date_list: [],
      month_list: constand.MONTH_LIST,
      year_list: [],
      submitted: false,
      age_calc: 0
    };
    this.updateDate = this.updateDate.bind(this);
    this.fillDateList = this.fillDateList.bind(this);
    this.fillYearList = this.fillYearList.bind(this);
    this.dob_submit = this.dob_submit.bind(this);

  }
  componentWillMount() {
    this.fillYearList();
    this.fillDateList();
    this.calculateAge();
  }
  fillDateList() {
    //var temp_month = this.state.dob_month ? this.state.dob_month : 1;
    //var temp_year = this.state.year_list? this.state.dob_year: new Date().getFullYear();
    //var no_days = new Date(temp_year, temp_month, 0).getDate();
    var date_list = [];
    for (var i = 1; i <= 31; i++) {
      date_list.push(i);
    }
    this.setState({ dob_day: "", date_list: date_list });
  }
  fillYearList() {
    var year_list = [];
    for (var i = constand.YEAR_START; i <= constand.YEAR_END; i++) {
      year_list.push(i);
    }
    this.setState({ year_list: year_list });
  }
  updateDate(
    value,
    e //for dynamic update
  ) {
    switch (value) {
      case "day":
        this.setState({ dob_day: e.target.value });
        this.props.registerFormvalues.dob_day = e.target.value;
        this.calculateAge();

        break;
      case "month":
        this.props.registerFormvalues.dob_month = e.target.value;
        this.setState({ dob_month: e.target.value });
        this.calculateAge();

        break;
      case "year":
        this.props.registerFormvalues.dob_year = e.target.value;
        this.setState({ dob_year: e.target.value });
        this.calculateAge();
        break;
      default:
        break;
    }
  }
  isValidDate(s) {
    var bits = s.split('/');
    var d = new Date(bits[2], bits[1] - 1, bits[0]);
    return d && (d.getMonth() + 1) == bits[1];
  }
  calculateAge() {
    var dateFormate = this.props.registerFormvalues.dob_day + '-' + this.props.registerFormvalues.dob_month + '-' + this.props.registerFormvalues.dob_year;
    var age_now = commonService.calculateAge(dateFormate);
    
    console.log('age_now', age_now);
    this.setState({ age_calc: age_now });

    //return age_now;
  }
  
  dob_submit() {
    this.setState({ submitted: true });
    if (
      this.props.registerFormvalues.dob_day &&
      this.props.registerFormvalues.dob_month &&
      this.props.registerFormvalues.dob_year && this.state.age_calc >= 16
    ) {
      this.props.registerFormvalues.age = this.state.age_calc;
      this.props.registerformUpdate(this.props.registerFormvalues);
      var dateFormate = this.props.registerFormvalues.dob_day + '/' + this.props.registerFormvalues.dob_month + '/' + this.props.registerFormvalues.dob_year;
      if (this.isValidDate(dateFormate)) {
        this.props.nextStep();
      } else {
        toast.dismiss();
        toast.error(Errors.invalid_date);
      }
    }
    ReactGA.event({
      category: "User Acquisition",
      action: "Sign up process",
      label: "DOB"
    })
  }

  render() {
    return (
      <div className="step11">
        <h3 className="text-center ">
          <span className="pull-left pointer" onClick={this.props.prevStep}>
            <img className="arrow-img" src={constand.WEB_IMAGES+"arrow-left.png"} />
          </span>
          What's your date of birth?<Link
            to="/home"
            className="close-register orangefont"
          >
            X
                            </Link>
        </h3>
        <div className="row justify-content-center align-items-center">
          <div className="input_section col-md-10 m-t-40">
            <div className="row">
              {(constand.DOB_SWAP_COUNTYID.includes(this.props.registerFormvalues.country)) &&
                <React.Fragment>
                  <div className="col-md-4 col-lg-4 p-b-10">
                    <div className="dropdown">

                      <select value={this.props.registerFormvalues.dob_month} className="form-control pointer" onChange={this.updateDate.bind(this, 'month')}>
                        <option value="">Select month</option>
                        {this.state.month_list.map((item, key) => {
                          return (
                            <option key={"month_" + item.id} value={item.id}>{item.value}</option>
                          );
                        })}
                        
                  </select>
                    </div>
                    {this.state.submitted &&
                      !this.props.registerFormvalues.dob_month && (
                        <p className="text-danger">This Field is required</p>
                      )}
                  </div>
                  <div className="col-md-4 col-lg-4 p-b-10">
                    <div className="dropdown">
                      <select value={this.props.registerFormvalues.dob_day} className="form-control pointer" onChange={this.updateDate.bind(this, 'day')}>
                        <option value="">Select day</option>
                        {this.state.date_list.map((item, key) => {
                          return (
                            <option key={"day_" + key} value={key + 1}>{item}</option>
                          );
                        })}
                        
                  </select>
                    </div>
                    {this.state.submitted &&
                      !this.props.registerFormvalues.dob_day && (
                        <p className="text-danger">This Field is required</p>
                      )}
                  </div></React.Fragment>}
              {(!(constand.DOB_SWAP_COUNTYID.includes(this.props.registerFormvalues.country))) &&
                <React.Fragment>
                  <div className="col-md-4 col-lg-4 p-b-10">
                    <div className="dropdown">
                      <select value={this.props.registerFormvalues.dob_day} className="form-control pointer" onChange={this.updateDate.bind(this, 'day')}>
                        <option value="">Select day</option>
                        {this.state.date_list.map((item, key) => {
                          return (
                            <option key={"day_" + key} value={key + 1}>{item}</option>
                          );
                        })}
                        
                  </select>
                    </div>
                    {this.state.submitted &&
                      !this.props.registerFormvalues.dob_day && (
                        <p className="text-danger">This Field is required</p>
                      )}
                  </div>
                  <div className="col-md-4 col-lg-4 p-b-10">
                    <div className="dropdown">

                      <select value={this.props.registerFormvalues.dob_month} className="form-control pointer" onChange={this.updateDate.bind(this, 'month')}>
                        <option value="">Select month</option>
                        {this.state.month_list.map((item, key) => {
                          return (
                            <option key={"month_" + item.id} value={item.id}>{item.value}</option>
                          );
                        })}
                        
                  </select>
                    </div>
                    {this.state.submitted &&
                      !this.props.registerFormvalues.dob_month && (
                        <p className="text-danger">This Field is required</p>
                      )}
                  </div></React.Fragment>}
              <div className="col-md-4 col-lg-4 p-b-10">
                <div className="dropdown">
                  <select value={this.props.registerFormvalues.dob_year} className="form-control pointer" onChange={this.updateDate.bind(this, 'year')}>
                    <option value="">Select year</option>
                    {this.state.year_list.map((item, key) => {
                      return (
                        <option key={"year_" + key} value={item}>{item}</option>
                      );
                    })}
                    
                  </select>
                </div>
                {this.state.submitted &&
                  !this.props.registerFormvalues.dob_year && (
                    <p className="text-danger">This Field is required</p>
                  )}
              </div>
            </div>
          </div>
          {this.state.submitted && this.state.age_calc < 16 &&
            (
              <p className="text-danger w-50">Sorry, you need to be 16 or older to sign up to Beam. If you are signing up on behalf of a child then please enter your own date of birth here, not your child's. </p>
            )}
        </div>
        <div className="row justify-content-center align-items-center">
          <div className="input_section col-md-6 m-t-10">
            <div id="register-link" className=" w-100 m-t-20 m-b-20 float-left">
              <a
                href="javascript:void(0)"
                onClick={this.dob_submit}
                className="bluebtn float-left w-100 text-center"
              >
                Next
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { DobComponent };
