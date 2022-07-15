import React from "react";
import Modal from "react-responsive-modal";
import { connect } from "react-redux";
import { updateAfterModelState, afterPlay } from "../../actions";
import * as constand from "../../constant";
import { toast } from "react-toastify";
import InputRange from "react-input-range";
import ReactGA from 'react-ga';
import { Cookies } from "react-cookie-consent";

class AfterVideoPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Loading: false,
      value_1: 5,
      value_2: 5,
      value_3: 5,
      review_text: constand.REVIEW_TEXT[1]
    };
    this.updateState = this.updateState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateStarRating = this.updateStarRating.bind(this);
    this.submitReview = this.submitReview.bind(this);
  }

  onCloseModal() { }

  updateState(step, field, value) {
    var buffer = this.props.localState;
    buffer[field] = value;
    buffer.step = step;
    this.props.updateAfterModelState(buffer);
  }

  handleChange(e) {
    const { name, value } = e.target;
    var buffer = this.props.localState;
    buffer[name] = value;
    this.props.updateAfterModelState(buffer);
  }

  updateStarRating(star) {
    var buffer = this.props.localState;
    buffer.rating = star;
    this.props.updateAfterModelState(buffer);
  }

  submitReview() {
    this.setState({ Loading: true });
    let dataObj = { ...this.props.localState };
    dataObj.workoutId = this.props.workoutId;
    dataObj.roomId = this.props.current_attendee.RoomId;
    if (dataObj.rating && parseInt(dataObj.rating) > 0) {
      this.props.afterPlay(dataObj).then(
        response => {
          this.setState({
            Loading: false
          });
          this.props.closeModel();
          toast.success(response.message);
          ReactGA.event({
            category: "On Demand Video ",
            action: "Completed",
            label: Cookies.get('condition') + '-' + this.props.workoutTitle.title + '-' + this.props.workoutId
          })
        },
        error => {
          this.setState({
            Loading: false
          });
          this.props.closeModel();
          toast.error(error);
        }
      );
    } else {
      this.setState({
        Loading: false
      });
      this.props.closeModel();
    }
  }

  _modelColseButton() {
    return (
      <button
        type="button"
        className="close"
        data-dismiss="modal"
        aria-label="Close"
      >
        <span aria-hidden="true" onClick={() => this.props.closeModel()}>
          &times;
        </span>
      </button>
    );
  }

  _footerMessage() {
    return (
      <span
        onClick={() => this.props.closeModel()}
        className="font-qregular font-15 font-normal ques-txt pointer"
      >
        Why are you asking me this?
      </span>
    );
  }

  rangeChangeFunction(value, state_val) {
    var review_txt = '';
    if (parseInt(value) < 3) //bad
    {
      review_txt = constand.REVIEW_TEXT[0]
    }
    else if (parseInt(value) > 7) //excellent
    {
      review_txt = constand.REVIEW_TEXT[2]
    } else { //good
      review_txt = constand.REVIEW_TEXT[1]
    }
    this.setState({ [state_val]: value, review_text: review_txt });
  }

  _afterReviewRange(step, goto, state_val) {
    return (
      <React.Fragment>
        {/* desktop view */}
        <div className="result_list mx-auto w-75 m-t-20 desk_value">
          <ul>
            {constand.AFTER_VIDEO_REVIEW_LIMIT.map((item, key) => {
              return (
                <li key={key}>
                  <span
                    onClick={() =>
                      this.updateState(step, goto, item)
                    }
                    className="pointer"
                  >
                    {item}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        {/* mobile view */}
        <div className="mobile_value">
          <div className="result_list mx-auto w-75 m-t-30 ">
            <div className="range_value_display font-medium">{Math.round(this.state[state_val])}</div>
            {/* <div className="range_value_denote font-book">{this.state.review_text}</div> */}
            <InputRange
              maxValue={constand.AFTER_VIDEO_REVIEW_LIMIT.length}
              minValue={0}
              value={this.state[state_val]}
              formatLabel={(value, type) => this.formatLabel(value, type, step-1)}
              onChange={value => this.rangeChangeFunction(value, state_val)}
            //onChangeComplete={value => this.updateState(step, goto, value)} 
            />
          </div>
          <div className="col-sm-12 m-t-30 row mx-auto">
            <button className="btn btn-login w-100" onClick={() => this.updateState(step, goto, this.state[state_val])}>Next</button>
          </div>
        </div>
      </React.Fragment>
    );
  }
  formatLabel(value, type, step) {
    console.log('type', step)
    switch (step) {
      case 1:
        if (type == 'min') {
          return 'Not good';
        } else if (type == 'max') {
          return 'Fantastic';
        } else {
          return '';
        }
      case 2:
        if (type == 'min') {
          return 'Not pleased';
        } else if (type == 'max') {
          return 'Over the moon';
        } else {
          return '';
        }
      case 3:
        if (type == 'min') {
          return 'Piece of cake';
        } else if (type == 'max') {
          return 'Really tough';
        } else {
          return '';
        }
    }

  }
  feelingAfter_view() {
    return (
      <div
        className="modal-dialog after_start common_design modal-width--custom"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header header-styling  border-0">
            <h5
              className="modal-title1 text-center col-md-12 p-0  font-semibold white-txt"
              id="exampleModalLabel font-medium"
            >
              Yes! You did it!
            </h5>
            {this._modelColseButton()}
          </div>
          <div className="modal-body pb-0">
            <p className="font-qmedium black-txt text-center mx-auto w-75 font-15 m-t-20 font-normal">
              How good do you feel right now?
            </p>
            {this._afterReviewRange(2, 'feelingAfter', 'value_1')}

            <div className="image-section text-center">
              <img className="img-fluid img-fluid w-80 m-b-20" src={constand.WEB_IMAGES + "afterlog.png"}></img>
            </div>
            {/* <div className="text-center w-100 m-t-20 m-b-10 ">
              {this._footerMessage()}
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  pleased_view() {
    return (
      <div
        className="modal-dialog after_start after_start-bg common_design modal-width--custom"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header header-styling  border-0">
            <h5
              className="modal-title1 text-center col-md-12 p-0  font-semibold white-txt"
              id="exampleModalLabel font-medium"
            >
              Finally, to help others...
            </h5>

            {this._modelColseButton()}
          </div>
          <div className="modal-body pb-0">
            <p className="font-qmedium black-txt text-center mx-auto w-75 font-15 m-t-20 font-normal">
              How pleased are you with yourself for completing this session?
            </p>
            {this._afterReviewRange(3, 'pleased', 'value_2')}
            {/* <div className="text-right w-100 why-text">
              {this._footerMessage()}
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  challenging_view() {
    return (
      <div
        className="modal-dialog after_start after_start-bg common_design modal-width--custom"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header header-styling  border-0">
            <h5
              className="modal-title1 text-center col-md-12 p-0  font-semibold white-txt"
              id="exampleModalLabel font-medium"
            >
              Finally, to help others...
            </h5>

            {this._modelColseButton()}
          </div>
          <div className="modal-body pb-0">
            <p className="font-qmedium black-txt text-center mx-auto w-75 font-15 m-t-20 font-normal">
              How challenging did you find this session?
            </p>
            {this._afterReviewRange(4, 'challenging', 'value_3')}
            {/* <div className="text-right w-100 why-text">
              {this._footerMessage()}
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  barriers_view() {
    return (
      <div
        className="modal-dialog after_start after_start-bg common_design modal-width--custom"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header header-styling  border-0">
            <h5
              className="modal-title1 text-center col-md-12 p-0  font-semibold white-txt"
              id="exampleModalLabel font-medium"
            >
              Finally, to help others...
            </h5>

            {this._modelColseButton()}
          </div>
          <div className="modal-body pb-0">
            <p className="font-qmedium black-txt text-center mx-auto w-75 font-15 m-t-20 font-normal">
              Did you feel that experienced any barriers during this workout?
            </p>
            <div className="mx-auto w-75 m-t-40">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-6">
                    <div className="radio-section">
                      <span className="text-label">None</span>
                      <div className="radio pull-right">
                        <input
                          id="radio-1"
                          name="profession"
                          type="radio"
                          value="1"
                        />
                        <label
                          htmlFor="radio-1"
                          className="radio-label"
                        ></label>
                      </div>
                    </div>
                    <div className="radio-section">
                      <span className="text-label">Lorem ipsum</span>
                      <div className="radio pull-right">
                        <input
                          id="radio-1"
                          name="profession"
                          type="radio"
                          value="1"
                        />
                        <label
                          htmlFor="radio-1"
                          className="radio-label"
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="text-right w-100 why-text">
              {this._footerMessage()}
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  rating_view() {
    return (
      <div
        className="modal-dialog after_start after_start-bg common_design modal-width--custom"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header header-styling  border-0">
            <h5
              className="modal-title1 text-center col-md-12 p-0  font-semibold white-txt"
              id="exampleModalLabel font-medium"
            >
              Finally, to help others...
            </h5>

            {this._modelColseButton()}
          </div>
          <div className="modal-body pb-0">
            <p className="font-qmedium black-txt text-center mx-auto w-75 font-15 m-t-20 font-normal">
              Please rate this section
            </p>
            <div className="mx-auto w-85 m-t-10">
              <div className="col-md-12">
                <div className="rating">
                  {constand.STAR_RATING.map((item, key) => {
                    return (
                      <React.Fragment key={key}>
                        <input type="radio" id={"star" + item} name="rating" value={item} onClick={() => this.updateStarRating(item)} />
                        <label htmlFor={"star" + item} title="Meh">
                          {item} stars
                  </label></React.Fragment>
                    )
                  })}
                </div>
              </div>
              <div className="col-md-12 text-center w-75 mx-auto">
                <p className="font-qmedium black-txt text-center mx-auto w-75 font-15 m-t-20 font-normal">
                  Anything to add? A quick review:
                </p>
                <textarea
                  onChange={this.handleChange}
                  value={this.props.localState.comment}
                  className="text-message w-100"
                  name="comment"
                  rows="6"
                  cols="50"
                ></textarea>
                <button disabled={this.state.Loading} onClick={this.submitReview} className="btn btn-purple-inverse submit-btn font-medium font-14  m-t-20 m-b-20">
                  Submit review
                </button>
              </div>
            </div>
            {/* <div className="text-right w-100 why-text">
              {this._footerMessage()}
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  mainRender() {
    var renderHtml;
    var step = this.props.stepVideo || this.props.localState.step;
    switch (step) {
      case 1:
        renderHtml = this.feelingAfter_view();
        break;
      case 2:
        renderHtml = this.pleased_view();
        break;
      case 3:
        renderHtml = this.challenging_view();
        break;
      case 4:
        renderHtml = this.rating_view();
        break;
      default:
        renderHtml = (
          <div>
            <span>No data found!</span>
          </div>
        );
        break;
    }
    return renderHtml;
  }

  render() {
    return (
      <Modal
        className="removebbg-popup"
        open={this.props.openModel}
        onClose={this.onCloseModal}
        center
      >
        {this.mainRender()}
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return { localState: state.workout.AfterModelState };
};

const mapDispatchToProps = {
  updateAfterModelState, afterPlay
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AfterVideoPopup);
