import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { scheduleModelOpen, scheduleVideo, loginModelOpen, setTypeSchedulePopup } from "../../actions";

class WorkoutScheduleomponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.scheduleModelOpen = this.scheduleModelOpen.bind(this);
  }

  scheduleModelOpen() {
    this.props.setTypeSchedulePopup(this.props.from);
    if (this.props.from != "alldone") {
      if (this.props.is_auth) {
        this.props.scheduleModelOpen(true, this.props.ondemand_data);
      } else {
        this.props.loginModelOpen(true);
      }
    }
  }

  render() {

    return (
      <React.Fragment>
        <span className="pointer" onClick={this.scheduleModelOpen}>
          {(this.props.pageName !== 'registerPage') && <React.Fragment>
            <em className="fa fa-calendar-o pointer" ></em>
            {(this.props.pageName === 'ondemand-detail' || this.props.pageName === 'recently_watched') && (
              <span className="font-qmedium font-13 black-txt m-l-10">Add to schedule</span>
            )} </React.Fragment>}
          {(this.props.pageName === 'registerPage') &&
            <Link
              to={"/on-demand/" + this.props.condition}
              className="bluebtn float-left w-100 text-center"
            >
              Browse classes
            </Link>
          }
          {/* (this.props.pageName === 'registerPage') && <React.Fragment><a href="javascript:void(0)" className="bluebtn float-left w-100 text-center">Browse classes</a></React.Fragment> */}
        </span>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    is_model_open: state.workout.schedule_model_open,
    is_auth: state.auth.is_auth,
    schedule_model_data: state.workout.schedule_model_data
  };
};

const mapDispatchToProps = {
  scheduleModelOpen, scheduleVideo, loginModelOpen, setTypeSchedulePopup
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkoutScheduleomponent);
