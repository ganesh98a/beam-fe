import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import {
  getRegionList,
  start_loader,
  stop_loader,
  setStep
} from "../../actions";
import { toast } from "react-toastify";
import * as constand from "../../constant";
import ReactGA from 'react-ga';

class CountryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      country: this.props.registerFormvalues.country,
      region: this.props.registerFormvalues.region,
      // postcode: this.props.registerFormvalues.postcode,
      regionList: [],
      // isPostcodeError: false,
      regionloader: false,
      submitted: false
    };
    this.updateCountry = this.updateCountry.bind(this);
    this.updateRegion = this.updateRegion.bind(this);
    this.getRegionList = this.getRegionList.bind(this);
    this.registerSubmit_7 = this.registerSubmit_7.bind(this);
    // this.updatePostcode = this.updatePostcode.bind(this);

    console.log("this.props", this.props);
    if (this.props.registerFormvalues.country) {
      this.getRegionList(this.props.registerFormvalues.country);
    }
  }
  updateCountry(
    e //for country update
  ) {
    if (e.target.value) {
      this.setState({ country: e.target.value });
      this.props.registerFormvalues.country = e.target.value;
      this.getRegionList(e.target.value);
      // this.props.registerFormvalues.postcode = "";
      // this.props.registerFormvalues.region = "";
    }
  }
  getRegionList(countryData) {
    if (countryData) {
      this.setState({ regionloader: true });
      this.props.getRegionList(countryData).then(
        response => {
          var region = response.region ? response.region : [];
          this.setState({ regionList: region, regionloader: false });
        },
        error => {
          this.setState({ regionloader: false });
          toast.error(error);
        }
      );
    }
  }
  updateRegion(
    e //for region update
  ) {
    this.setState({ region: e.target.value });
    this.props.registerFormvalues.region = e.target.value;
    // this.props.registerFormvalues.postcode = "";
  }

 /*  updatePostcode(
    e //for postcode update
  ) {
    this.setState({ postcode: e.target.value, isPostcodeError:false });
    this.props.registerFormvalues.postcode = e.target.value;
  } */

  registerSubmit_7() {
    this.setState({ submitted: true });
    if (
      this.props.registerFormvalues.country
      //this.props.registerFormvalues.region &&
      //this.props.registerFormvalues.region.length > 0
    ) {
      /* //UK postcode validation
      var regexp = /^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[0-9]{4}$/;
      if (this.props.registerFormvalues.postcode && !regexp.test(String(this.props.registerFormvalues.postcode))) {
        this.setState({ isPostcodeError: true, submitted: false });
        return;
      } */
      this.props.registerformUpdate(this.props.registerFormvalues);
      if (this.props.registerFormvalues.country == 230 || this.props.registerFormvalues.country == 231)
        this.props.setStep(17, 'forward');
      else
        this.props.nextStep();
    }
    ReactGA.event({
      category: "User Acquisition",
      action: "Sign up process",
      label: "Country"
    })
  }
  render() {
    return (
      <div className="step7">
        <h3 className="text-center ">
          <a
            className="pull-left"
            href="javascript:void(0)"
            onClick={this.props.prevStep}
          >
            <img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} />
          </a>
          Where are you based?<Link
            to="/home"
            className="close-register orangefont"
          >
            X
          </Link>
        </h3>
        <div className="row justify-content-center align-items-center">
          <div className="input_section col-md-6 m-t-10">
            <div className="form-group mx-auto w-75">
              <label htmlFor="country" className="text-label">
                Country
              </label>
              <div className="dropdown">
                <select name="country"
                  value={this.props.registerFormvalues.country}
                  className="form-control"
                  onChange={this.updateCountry}
                >
                  <option className="pointer">Select country</option>
                  {this.props.countries_list.map((item, key) => {
                    return (
                      <option className="pointer" key={"country_" + item.id} value={item.id}>
                        {item.countryName}
                      </option>
                    );
                  })}
                </select>
              </div>
              {this.state.submitted &&
                this.props.registerFormvalues &&
                !this.props.registerFormvalues.country && (
                  <p className="help-block text-danger">
                    Country is required
                  </p>
                )}
            </div>
            {this.props.registerFormvalues.country &&
              this.props.registerFormvalues.country.length > 0 && this.state.regionList.length > 0 && (
                <div className="form-group mx-auto w-75">
                  <label htmlFor="region" className="text-label">
                    Region
                  </label>
                  <div className="dropdown">
                    <select name="region"
                      disabled={this.state.regionloader}
                      value={this.props.registerFormvalues.region}
                      className="form-control"
                      onChange={this.updateRegion}
                    >
                      <option className="pointer">Select region</option>
                      {this.state.regionList.map((item, key) => {
                        return (
                          <option className="pointer" key={"region_" + item.id} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}

                    </select>
                  </div>
                  {/* {this.state.submitted &&
                    this.props.registerFormvalues.region.length === 0 && (
                      <p className="help-block text-danger">
                        This Field is required
                      </p>
                    )} */}
                </div>
              )}
           {/*  {this.props.registerFormvalues.country &&
              this.props.registerFormvalues.country.length > 0 && this.state.regionList.length > 0 && this.props.registerFormvalues.country == 230 && (
                <div className="form-group mx-auto w-75">
                  <label htmlFor="postcode" className="text-label">
                    Postcode
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    value={this.props.registerFormvalues.postcode}
                    className="form-control"
                    onChange={this.updatePostcode}
                  />
                  {!this.state.submitted &&
                    this.state.isPostcodeError && (
                      <p className="help-block text-danger">
                        Enter valid Postcode
                      </p>
                    )}
                </div>
              )} */}
            <div id="register-link" className=" w-100 m-t-80 m-b-20 float-left">
              <a
                href="javascript:void(0)"
                onClick={this.registerSubmit_7}
                className="bluebtn float-left font-medium font-14 w-100 text-center"
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

const mapStateToProps = state => {
  return {
    countries_list: state.register.countries_list
  };
};

const mapDispatchToProps = {
  start_loader,
  stop_loader,
  getRegionList,
  setStep
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CountryComponent);
