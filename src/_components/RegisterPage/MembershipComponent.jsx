import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { fetchMembershipPlans, start_loader, stop_loader } from "../../actions";
import * as constand from "../../constant";

class MembershipComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      membershipList: []
    };
  }
  componentDidMount() {
    if (this.props.registerFormvalues.country) {
      var countryObj = this.props.countries_list
        .filter(e => e.id === parseInt(this.props.registerFormvalues.country))
        .map((value, index) => {
          return value;
        });
      if (countryObj.length > 0) {
        this.fetchPlans(countryObj[0].countryCode);
      }
    }
  }
  /**
   *  fetch Plans
   */
  fetchPlans(code) {
    this.props.start_loader();
    this.props.fetchMembershipPlans(code).then(
      response => {
        if (response) {
          this.setState({
            membershipList: response.plans
          });
        }
        this.props.stop_loader();
      },
      error => {
        this.props.stop_loader();
        toast.error(error);
      }
    );
  }
  /**
    select plan
    **/
  submitPlan(item) {
    this.props.registerFormvalues["membershipPlan"] = item;
    this.props.nextStep();
  }

  previousStep() {
    if (this.props.registerFormvalues.promocode) {
      this.props.prevStep();
    } else {
      this.props.gotoStep(14);
    }
  }
  render() {
    return (
      <div className="step6">
        <h3 className="text-center ">
          <span
            className="pull-left pointer"
            onClick={() => {
              this.previousStep();
            }}
          >
            <img className="arrow-img" src={constand.WEB_IMAGES+"arrow-left.png"} />
          </span>
          <span>First month free! <Link
                              to="/home"
                              className="close-register orangefont"
                            >
                              X
                            </Link></span>
        </h3>
        {this.state.membershipList.length > 0 && (
          <React.Fragment>
            <div className="font-14 font-qmedium black-txt col-md-12 text-center m-t-40 m-b-20">
              Then your choice of one of the following memberships...
            </div>
            <div className="col-md-12  justify-content-center align-items-center">
              <div className="row pricing">
                {this.state.membershipList.map((item, key) => {
                  return (
                    <div
                      key={key}
                      className={
                        this.props.registerFormvalues.membershipPlan.id ===
                        item.id
                          ? "active col-lg-4 col-md-6 col-sm-12 m-b-10"
                          : "col-lg-4 col-md-6 col-sm-12 m-b-10"
                      }
                    >
                      <div className="card mb-5 mb-lg-0">
                        <div className="card-body height-fix text-center">
                          <h5 className="card-title text-body font-book font-18 black-txt text-uppercase text-center">
                            {item.name}
                          </h5>
                          <h6 className="card-price text-center font-18 silver-txt font-qregular">
                            {item.currency} {item.amount}
                            <span className="period"> /{item.interval}</span>
                          </h6>
                          <figure className="text-center">
                            <img
                              src={
                                constand.WEB_IMAGES+"member_ship/membership_" +
                                (key + 1) +
                                ".png"
                              }
                              className="img-fluid img-responsive w-70"
                              alt=""
                            />
                          </figure>
                          <p className="font-12  text-center m-t-20 font-qmedium">
                            Access to on-demand exercise video library.
                          </p>
                          <hr className="w-75 mr-auto ml-auto" />
                          <p className="font-12 black-txt text-center font-qmedium">
                            Access to groups
                          </p>
                          <hr className="w-75    mr-auto ml-auto" />
                          {/* item.credits && item.credits > 0 ? (
                            <p className="font-12 black-txt text-center font-qmedium">
                              {item.credits} live classes / month
                            </p>
                          ) : (
                            ""
                          ) */
                          <p className="font-12 black-txt text-center font-qmedium">
                              Access to all live exercise classes
                            </p>}
                          <button
                            className="btn btn-orange m-t-100 font-medium font-14"
                            onClick={() => this.submitPlan(item)}
                          >
                            Start Trial
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>{" "}
          </React.Fragment>
        )}
        {this.state.membershipList.length === 0 && (
          <div className="font-14 font-qmedium black-txt col-md-12 text-center m-t-40 m-b-20">
            No memberships found !
          </div>
        )}
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
  fetchMembershipPlans,
  start_loader,
  stop_loader
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MembershipComponent);
