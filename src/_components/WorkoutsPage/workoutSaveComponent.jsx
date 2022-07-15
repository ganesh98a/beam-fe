import React from "react";
import { connect } from "react-redux";
import Modal from "react-responsive-modal";
import { toast } from "react-toastify";
import * as constand from "../../constant";
import { saveVideo, unSaveVideo, loginModelOpen, scheduleModelOpen } from "../../actions";
import ReactGA from 'react-ga';
import { Cookies } from "react-cookie-consent";

class WorkoutSaveComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Loading: false,
      success_model_open: false
    };
    this.saveVideo = this.saveVideo.bind(this);
    this.closeSuccessModel = this.closeSuccessModel.bind(this);
  }
  closeSuccessModel() {
    this.setState({ success_model_open: false });
  }
  onCloseModal() { }
  saveVideo() {
    if (this.props.Loading) {
      return false;
    }
    this.setState({ Loading: true });
    if (this.props.is_auth) {
      console.log('workoutData', this.props.workoutData)
      var params = { workoutId: this.props.workoutData.id };
      if ((this.props.workoutData.WorkoutSaves) && (this.props.workoutData.WorkoutSaves.length > 0)) //for unsave
      {
        this.props.unSaveVideo(params, this.props.page)
          .then(
            response => {
              if (this.props.page === 'recently_watched' || this.props.page === 'programme_detail') {
                let handler = [...this.props.workoutData.WorkoutSaves];
                var index = handler.findIndex(x => x.workoutId === this.props.workoutData.id);
                if (index > -1) {
                  handler.splice(index, 1);
                }
                this.props.workoutData.WorkoutSaves = handler;
              }
              this.setState({ Loading: false });
              console.log('unSaveVideo-response', response)
              toast.success(response.message);
            },
            error => {
              console.log('unSaveVideo-error', error)

              this.setState({ Loading: false });
              toast.error(error);
            }
          );
      } else { //for save
        this.props.saveVideo(params, this.props.page)
          .then(
            response => {
              if (this.props.page === 'recently_watched' || this.props.page === 'programme_detail') {
                this.props.workoutData.WorkoutSaves = this.props.workoutData && this.props.workoutData.WorkoutSaves.length > constand.CONSTZERO ? this.props.workoutData.WorkoutSaves : [];
                this.props.workoutData.WorkoutSaves.push(response.onDemandVideo);
              }
              this.setState({ Loading: false, success_model_open: true });
              ReactGA.event({
                category: "On Demand Video",
                action: "Saved",
                label: Cookies.get('condition') + '-' + this.props.workoutData.title + '-' +this.props.workoutData.id
              })
              console.log('addsave-response',response)
            },
            error => {
              this.setState({ Loading: false });
              console.log('addsave-error',error)
              toast.error(error);

            }
          );
      }
    } else { //not authorized
      this.setState({ Loading: false });
      this.props.loginModelOpen(true);
    }
  }

  render() {
    return (
      <React.Fragment>
        <span className="pointer" onClick={this.saveVideo}>
          <em className={'pointer ' + (((this.props.workoutData && this.props.workoutData.WorkoutSaves) && (this.props.workoutData.WorkoutSaves.length > 0)) ? ' fa fa-bookmark orangefont' : 'fa fa-bookmark-o')} ></em>
          {(this.props.page === 'ondemand_detail' || this.props.page === 'recently_watched') && (
            <span className="font-qmedium font-13 black-txt m-l-10">Save</span>
          )}
        </span>
        <Modal className="removebbg-popup" open={this.state.success_model_open} onClose={this.onCloseModal} center >
          {(this.props.workoutData) &&
            <div className="modal-dialog schedule_block common_design modal-width--custom m-t-50" role="document">
              <div className="modal-content">
                <div className="modal-header header-styling  border-0">
                  <h5
                    className="modal-title1 text-center col-md-12 p-0  font-book white-txt"
                    id="exampleModalLabel font-medium"
                  >
                    Yay! Congrats!
              </h5>

                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true" onClick={this.closeSuccessModel}>
                      &times;
                </span>
                  </button>
                </div>
                <div className="modal-body pb-0">
                  <h5 className="pop-sub-head black-txt text-center font-qregular m-b-20 ">You've saved this on-demand video</h5>
                  <p className="font-semibold black-txt text-center mx-auto w-75 font-15">{this.props.workoutData.title}</p>
                  <div className="mx-auto w-75 m-b-10 clearfix"><div className="centered-content"><span className=" p-0 border-0  text-right"><img
                    className="img-fluid rounded-circle"
                    src={(this.props.workoutData.Instructor && this.props.workoutData.Instructor.img) ? constand.USER_IMAGE_PATH +
                      this.props.workoutData.Instructor.img
                      : constand.WEB_IMAGES + "no-image.png"}
                    alt=""
                  /></span><span className=" black-txt font-qregular  text-left m-t-15  font-16 p-l-5">   {(this.props.workoutData.Instructor && this.props.workoutData.Instructor.User) && this.props.workoutData.Instructor.User.name + " " + this.props.workoutData.Instructor.User.lastName}</span></div></div>
                  <div className="col-md-12 text-center m-t-30 m-b-40">
                    <img src={constand.WEB_IMAGES + "thanks-small.png"} alt="" />
                  </div>

                  <button className="btn btn-login popup-btn w-75 mx-auto m-t-20 m-b-20" onClick={this.closeSuccessModel}>  Continue </button>
                </div>
              </div>
            </div>}
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    is_auth: state.auth.is_auth
  };
};

const mapDispatchToProps = {
  saveVideo, unSaveVideo, loginModelOpen, scheduleModelOpen
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkoutSaveComponent);

