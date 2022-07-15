import React from "react";
import Modal from "react-responsive-modal";
import { connect } from "react-redux";
import { beforePlay } from "../../actions";
import { toast } from "react-toastify";
import * as constand from "../../constant";
import InputRange from "react-input-range";
import ReactGA from 'react-ga';
import { Cookies } from "react-cookie-consent";

class BeforeVideoPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      value: 5,
      review_text: constand.REVIEW_TEXT[1]
    };
  }

  onCloseModal() { }

  submitBeforeReview(id) {
    var dataObj = {
      feelingBefore: id,
      workoutId: parseInt(this.props.workoutId),
      roomId: this.props.current_attendee.RoomId
    };
    this.props.beforePlay(dataObj).then(
      response => {
        if (response) {
          this.props.beforeReview();
          ReactGA.event({
            category: "On Demand Video",
            action: "Played",
            label: Cookies.get('condition') + '-' + this.props.workoutTitle.title + '-' + dataObj.workoutId
          })
          //toast.success(response.message);
        }
      },
      error => {
        this.props.closeModel();
        toast.error(error);
      }
    );
  }

  _webView() {
    return (
      <div className="result_list mx-auto w-75 m-t-20 desk_value">
        <ul>
          {constand.BEFORE_VIDEO_REVIEW_LIMIT.map((item, key) => {
            return (
              <li key={key}>
                <span
                  onClick={() => this.submitBeforeReview(item)}
                  className="pointer"
                >
                  {item}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  formatLabel(value, type) {
    console.log('type', type)
    if (type == 'min') {
      return 'Not good';
    } else if (type == 'max') {
      return 'Fantastic';
    } else {
      return '';
    }
  }
  _mobileView() {
    return (
      <div className="mobile_value">
        <div className="result_list mx-auto w-75 m-t-30">
          <div className="range_value_display font-medium">{Math.round(this.state.value)}</div>{/* 
          <div className="range_value_denote font-book capitalize_text">{this.state.review_text}</div> */}
          <InputRange
            maxValue={constand.BEFORE_VIDEO_REVIEW_LIMIT.length}
            minValue={0}
            value={this.state.value}
            formatLabel={(value, type) => this.formatLabel(value, type)}
            onChange={value => this.rangeChangeFunction(value)}
          // onChangeComplete={value => this.submitBeforeReview(value)}
          />
        </div>
        <div className="col-sm-12 m-t-30 row mx-auto">
          <button className="btn btn-login w-100" onClick={()=>this.submitBeforeReview(this.state.value)}>Let's do this!</button>
        </div>
      </div>
    );
  }

  rangeChangeFunction(value) {
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
    this.setState({ value: value, review_text: review_txt });
  }

  render() {
    return (
      <React.Fragment>
        <Modal
          className="removebbg-popup"
          open={this.props.is_model_open}
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
                  Before you start
                </h5>

                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true" onClick={this.props.closeModel}>
                    &times;
                  </span>
                </button>
              </div>
              <div className="modal-body pb-0">
                <p className="font-qmedium black-txt text-center mx-auto w-75 font-15 m-t-20 font-normal">
                  How good do you feel right now?
                </p>

                {this._webView()}
                {this._mobileView()}

                {/* <div className="text-right w-100 why-text">
                  <span
                    onClick={this.props.beforeReview}
                    className="font-qregular font-15 font-normal ques-txt pointer"
                  >
                    Why are you asking me this?
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = {
  beforePlay
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BeforeVideoPopup);
