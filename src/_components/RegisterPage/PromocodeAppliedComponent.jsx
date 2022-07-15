import React from "react";
import { connect } from "react-redux";
import * as constand from "../../constant";
import { registerNewUser, start_loader, stop_loader, fetchUserDetails, checkMaxUsagePromo } from "../../actions";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
class PromocodeAppliedComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      disableButton: false
    };
    this.promocodeSubmit = this.promocodeSubmit.bind(this);
    this.checkMaxUsagePromo = this.checkMaxUsagePromo.bind(this);
  }
  promocodeSubmit() {
    this.setState({ submitted: true });
    this.checkMaxUsagePromo();
  }
  /**
  register new user
  **/
  registerUser() {
    this.setState({ disableButton: true })
    this.props.start_loader();
    this.props.registerNewUser(this.props.registerFormvalues).then(
      response => {
        if (response && response.success) {
          this.setState({ disableButton: false })

          //this.props.gotoStep(constand.AlldoneComponent);
          const { from } = { from: { pathname: "/register/all_done" } };
          this.props.history.push(from);
        }
        //this.getUserDetail();
        //this.props.stop_loader();
      },
      error => {
        this.props.stop_loader();
        this.setState({
          Loading: false
        });
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
  checkMaxUsagePromo() {
    this.props.checkMaxUsagePromo().then(
      response => {
        this.props.nextStep();
      },
      error => {
        toast.error(error);
      }
    );
  }
  render() {
    const plan = (this.props.promocode_plan && (this.props.promocode_plan.length > 0)) ? this.props.promocode_plan[0] : {};

    return (
      <div className="step13">
        <h3 className="text-center ">
          <a
            className="pull-left"
            href="javascript:void(0)"
            onClick={() => this.props.prevStep()}
          >
            <img className="arrow-img" src={constand.WEB_IMAGES+"arrow-left.png"} />
          </a>
          Nice one {this.props.registerFormvalues.firstname}!
          <Link
            to="/home"
            className="close-register orangefont"
          >
            X
                            </Link>
        </h3>
        <div className="row justify-content-center align-items-center">
          <div className="input_section col-md-6 m-t-20">
            <p className=" mb-5 font-14 font-qregular abbey-txt text-center">
              Great news! This code entitles you to...
            </p>
            {plan.freeDays == 366 &&
              <p className="font-14 font-qregular abbey-txt text-center">
                12 months free membership to Beam
            </p>
            }
            {plan.freeDays != 366 &&
              <p className="font-14 font-qregular abbey-txt text-center">
                {plan.freeDays} days free membership to Beam
            </p>
            }
            {plan.courtesyName &&
              <p className="font-14 font-qregular abbey-txt text-center m-t-40">
                courtesy of {plan.courtesyName}
              </p>
            }

            <div id="register-link" className=" w-100 m-t-50 m-b-20 float-left">
              <button
                disabled={this.state.disableButton}
                onClick={() => this.registerUser()}
                className="btn bluebtn float-left font-medium font-14 w-100 text-center"
              >
                Let's get started!
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    promocode_plan: state.register.promo_plans
  };
};

const mapDispatchToProps = { registerNewUser, start_loader, stop_loader, fetchUserDetails, checkMaxUsagePromo };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PromocodeAppliedComponent);
