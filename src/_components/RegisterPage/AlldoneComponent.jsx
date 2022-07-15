import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserDetails, start_loader, stop_loader, healthCondition } from "../../actions";
import * as constand from "../../constant";
import { ImageTag } from "../../tags";
import { commonService } from "../../_services";
import WorkoutScheduleComponent from "../WorkoutsPage/WorkoutScheduleComponent";
import WorkoutSchedulePopup from "../WorkoutsPage/workoutSchedulePopup";
import { toast } from "react-toastify";

class AlldoneComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      is_postnatal: false
    };
  }
  componentDidMount() {
    this.props.start_loader();
    this.props.fetchUserDetails().then(
      response => {
        //this.props.stop_loader();
        this.getConditions();
      },
      error => {
        this.props.stop_loader();
        toast.error(error);
      }
    );
  }
  getConditions() {
    this.props.start_loader();
    this.props.healthCondition().then(
      response => {
        this.props.stop_loader();
        // var index = this.props.healthcondition_list.findIndex(x => x.tag === 'postnatal');
        // if(index > -1){
        //   this.setState({is_postnatal: true});
        // }else{
        //   this.setState({is_postnatal: false});
        // }
        if (this.props.logged_userData.conditionList && this.props.logged_userData.conditionList.length > 0) {
          var index = this.props.logged_userData.conditionList.findIndex(x => parseInt(x) === 199);//cystic
          if (index > -1) {
            console.log('xxx')
            this.setState({ is_postnatal: false });
          } else {
            var index2 = this.props.logged_userData.conditionList.findIndex(x => parseInt(x) === 200);//postnatal
            if (index2 > -1) {
              console.log('pppp')

              this.setState({ is_postnatal: true });
            } else {
              this.setState({ is_postnatal: false });
            }
          }
        } else {
          this.setState({ is_postnatal: false });
        }
        this.props.healthcondition_list.map((item, key) => {
        });
      },
      error => {
        this.props.stop_loader();
        toast.error(error);
      }
    );
  }
  render() {
    const item = (this.state.is_postnatal) ? commonService.postantal() : commonService.cysticFibro();
    var condition = this.props.condition; //(this.state.is_postnatal) ? `Women's-Health`:'cystic-fibrosis';
    return (
      <div className="registerpage">
        <div id="register">
          <div className="fadeIn first text-center p-t-10 p-b-15 register_logo">
            <Link to="/home">
              <img src={constand.WEB_IMAGES + "logo.png"} id="icon" alt="App Icon" />
            </Link>
          </div>
          <div className="container">
            <div
              id="register-row"
              className="row justify-content-center align-items-center m-t-50"
            >
              <div id="register-column" className="col-md-10">
                <div id="register-box" className="col-md-12">
                  <div id="register-form" className="form">
                    <div className="step15">
                      <h3 className="text-center">All done, {commonService.bindUsername(this.props.logged_userData)}! <Link
                        to="/home"
                        className="close-register orangefont"
                      >
                        X
                            </Link>
                      </h3>
                      <div className="row justify-content-center align-items-center">
                        <div className="input_section col-md-8 m-t-10">
                          {/* <p className="text-label text-center">
                            Shall we get started with {item.length} minutes today?
                          </p> */}
                          <div className="video-tag">
                            <img src={constand.WEB_IMAGES+"thanks200.png"} id="icon" className="thanks-img img-fluid" alt="User thanks" />
                            {/* <Link
                              to={
                                "/detail/" +item.id
                              }
                              className="position-relative"
                            >
                              <ImageTag
                                width="392"
                                height="200"
                                className="card-img-top img-fluid"
                                src={
                                  constand.BACKEND_URL +
                                  "/_/img/workout/" +
                                  item.id +
                                  "-img.png"
                                }
                              /> */}
                            {/* <span className="position-absolute vid_time">
                                <span>
                                  {item.length}{" "}
                                  mins
                                </span>
                              </span> */}
                            {/* </Link> */}
                          </div>
                          <div
                            id="register-link"
                            className=" w-100 m-t-50 m-b-20 float-left"
                          >
                            <WorkoutScheduleComponent
                              from="alldone"
                              ondemand_data={item}
                              location={this.props.location}
                              history={this.props.history}
                              pageName="registerPage"
                              condition={condition}
                            />
                          </div>
                          <div
                            id="register-link"
                            className=" w-100 m-b-30 float-left"
                          >
                            <Link
                              to={"/account/dashboard/schedule/" + condition}
                              className="btn-blue-inverse float-left w-100 text-center"
                            >
                              Go to Dashboard
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <WorkoutSchedulePopup
          location={this.props.location}
          history={this.props.history}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { logged_userData: state.header.logged_userData, healthcondition_list: state.register.healthcondition_list, condition: state.auth.condition };
};

const mapDispatchToProps = { fetchUserDetails, start_loader, stop_loader, healthCondition };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlldoneComponent);
