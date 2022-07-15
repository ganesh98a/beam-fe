import React from "react";
import Modal from "react-responsive-modal";
import { connect } from "react-redux";
import moment from 'moment';
import { Player } from "video-react";
import * as constand from "../../constant";
import * as Errors from "../../Errors";
import {
  saveTimeSpent
} from "../../actions";
import { toast } from "react-toastify";
import { Timer } from 'react-countdown-clock-timer';

var showClockTimer = false;
var clockTime = null
var showTimer = true
class WorkoutPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentVideoTime: 0,
      buffered_sec: null,
      running_sec: 0,
      buffer_loader: false,
      cursor_min: null,
      totalClockTime: 0,
      isTimeFormat: false,
      isPaused: false,
      currentSpentTime: 0,
      startTimer: 0,
      endTimer: 0
    };
    console.log(this.state.paused)
    this.timer = [];
    this.timeSpent = [];
    this.is_start = true;
    this.saveTimeSpent = this.saveTimeSpent.bind(this);
    setInterval(async () => {
      if (this.props.enable_video && this.is_start) {
        const { player } = this.player.getState();
        if (player.ended) {
          this.submitTime();
          return;
        }
        if (!player.waiting && !player.paused) {
          if (!this.timeSpent.length) {
            for (var i = 0, l = parseInt(player.duration); i < l; i++) this.timeSpent.push(false);
          }
          this.timer = this.record(player.currentTime);
        }
      }
    });
  }
  componentDidMount() {
    if (this.props.workoutDetail.clockStart && this.props.workoutDetail.clockEnd) {
      var clockStart = this.props.workoutDetail.clockStart.split(':');
      var clockEnd = this.props.workoutDetail.clockEnd.split(':');
      //hh:mm:ss this time format convert to minutes
      clockStart = (+clockStart[0]) * 60 * 60 + (+clockStart[1]) * 60 + (+clockStart[2]);
      clockEnd = (+clockEnd[0]) * 60 * 60 + (+clockEnd[1]) * 60 + (+clockEnd[2]);
      var clockMin = Math.abs(clockEnd - clockStart) * 60;
      this.setState({
        totalClockTime: clockMin,
        startTimer: clockStart,
        endTimer: clockEnd
      })
      clockTime = clockMin;
    }
  }

  componentWillUnmount() {
    this.is_start = false;
  }


  record(currentTime) {
    this.timeSpent[parseInt(currentTime)] = true;
    this.showPercentage();
  }

  showPercentage() {
    let percent = 0;
    for (let i = 0, l = this.timeSpent.length; i < l; i++) {
      if (this.timeSpent[i]) percent++;
    }
    //percent = Math.round(percent / this.timeSpent.length * 100);
    //console.log("Percentage% = "+percent);
    var curr_spend_time = percent;
    curr_spend_time = curr_spend_time / 60;
    curr_spend_time = Math.floor(curr_spend_time);
    // console.log("Mins = "+curr_spend_time);
    this.setState({ currentSpentTime: curr_spend_time })
    if (curr_spend_time !== this.state.cursor_min) {
      this.setState({ cursor_min: curr_spend_time }, this.saveTimeSpent());
    }
  }

  saveTimeSpent() {
    //Video watching time update
    //if(!this.state.buffer_loader)
    //{
    let time_duration = 0;
    for (let i = 0, l = this.timeSpent.length; i < l; i++) {
      if (this.timeSpent[i]) time_duration++;
    }
    var spend_time = time_duration;
    spend_time = spend_time / 60;
    spend_time = Math.floor(spend_time);
    if (parseInt(spend_time) > parseInt(this.props.ondemandData.workout.length)) {
      spend_time = this.props.ondemandData.workout.length;
    }
    this.setState({ buffer_loader: true });
    if (this.props.current_attendee.RoomId && spend_time > 0) {
      var dataObj = {
        roomId: this.props.current_attendee.RoomId,
        time: spend_time
      };
      this.props.saveTimeSpent(dataObj).then(
        response => {
          //this.setState({buffer_loader: false});
        },
        error => {
          //this.setState({buffer_loader: false});
          toast.error(Errors.default_error);
        }
      );
    }
    //}
  }

  onCloseModal() { }

  submitTime() {

    let time_duration = 0;
    for (let i = 0, l = this.timeSpent.length; i < l; i++) {
      if (this.timeSpent[i]) time_duration++;
    }
    var spend_time = time_duration;
    spend_time = spend_time / 60;
    spend_time = Math.floor(spend_time);

    if (parseInt(spend_time) > parseInt(this.props.ondemandData.workout.length)) {
      spend_time = this.props.ondemandData.workout.length;
    }

    //find percentage
    var percentage = (spend_time / this.props.ondemandData.workout.length) * 100;
    var show_after_review = (percentage >= constand.VIDEO_PERCENTAGE) ? true : false;
    this.props.closeVideoModel(spend_time, show_after_review);
    showClockTimer = false;
  }

  palyVideo = () => {
    this.setState({ isPaused: false })
  }
  pauseVideo = () => {
    this.setState({ isPaused: true })
  }
  showClockTimer = () => {
    if (this.player != null) {
      showTimer = true
      const { player } = this.player.getState();
      var playingTime = (player.currentTime * 60) / 60;
      var startTimer = (this.state.startTimer * 60) / 60;
      var endTimer = (this.state.endTimer * 60) / 60
      if (startTimer <= playingTime) {
        showClockTimer = true;
      } else {
        showClockTimer = false;
      }
      if (endTimer <= playingTime) {
        showClockTimer = false;
      }
      if (startTimer < playingTime && endTimer > playingTime) {
        clockTime = endTimer - playingTime;
      }
    }
  }

  render() {
    const ondemand_view_detail = (this.props.ondemandData && this.props.ondemandData.workout) ? this.props.ondemandData.workout : {};
    const title = (this.props.ondemandData && this.props.ondemandData.title) ? this.props.ondemandData.title : '';
    console.log('Workoutplayerss')
    return (
      <React.Fragment>
        <Modal
          className="removebbg-popup"
          open={this.props.enable_video}
          onClose={this.onCloseModal}
          center
        >
          <div
            className="modal-dialog b4_start common_design modal-width--custom"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header header-styling  border-0">
                <h5
                  className="modal-title1 text-center col-md-12 p-0  font-semibold white-txt"
                  id="exampleModalLabel font-medium"
                >
                  {title}
                </h5>

                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true" onClick={() => this.submitTime()}>
                    &times;
                  </span>
                </button>
                {showClockTimer && this.state.totalClockTime > 0 && showTimer && <div className="timer-container timer">
                  <Timer
                    className="timer_style"
                    durationInSeconds={clockTime}
                    formatted={this.state.isTimeFormat}
                    isPaused={this.state.isPaused}
                    onFinish={() => { showTimer = false; }}
                  />
                </div>}
              </div>
              <div className="modal-body pb-0">

                <Player
                  ref={player => {
                    this.player = player;
                  }}
                  id="myVideo"
                  autoPlay
                  className="w-100 border-0"
                  height="400"
                  playsInline
                  onPlay={this.palyVideo}
                  onPause={this.pauseVideo}
                  onClick={this.showClockTimer()}
                  /* poster={
                    constand.WORKOUT_IMG_PATH+
                    ondemand_view_detail.id +
                    "-img.png"
                  } */
                  src={constand.S3_URL + ondemand_view_detail.videoUrl}
                //src={constand.BACKEND_URL + '/_/img/ondemand/test.mov'}
                ></Player>
              </div>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    workoutDetail: state.workout.workout_detail_data.workout
  };
};

const mapDispatchToProps = { saveTimeSpent };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkoutPlayer);
