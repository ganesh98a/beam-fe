import React from "react";
import Modal from "react-responsive-modal";
import { connect } from "react-redux";
import { submitPostPoll } from "../../actions";
import { toast } from "react-toastify";
import * as constand from "../../constant";
import InputRange from "react-input-range";
import ReactGA from 'react-ga';
import { Cookies } from "react-cookie-consent";
import { commonService } from "../../_services";

class ResearchPostPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enable: false,
      rating: 5,
    };
  }

  onCloseModal() {
    this.props.closeResearchPostModel();
  }

  submitPoll(isCreateC = false) {
    var dataObj = {
      roomId: this.props.current_attendee.RoomId,
      rateOfExertion: this.state.rating,
      classType: this.props.classType,
    };
    this.props.submitPostPoll(dataObj).then(
      response => {
        if (response) {
          this.props.closeResearchPostModel();
          if (isCreateC) {
            var community = this.props.logged_userData.Members.length ? this.props.logged_userData.Members[0].Community.community_name : '';
            var pathname_data = community ? '/group/feed/' + community + '/' + this.props.condition : '/groups/' + this.props.condition;
            const { from } = { from: { pathname: pathname_data } };
            this.props.history.push(from);
          }
          // toast.success(response.message);
        }
      },
      error => {
        this.props.closeResearchPostModel();
        toast.error(error);
      }
    );
  }

  handleSelect(event) {
    this.setState({ rating: event.target.value, enable: true });
  }

  closeModel() {
    this.props.closeResearchModel();
  }

  render() {
    var createcTrial = commonService.replaceChar(this.props.condition.toLowerCase(), true).replace('research studies: ', '');
    var isCreateC = (createcTrial.includes(constand.CREATEC_CONDITION));
    console.log('ResearchPostPopup=', createcTrial)
    console.log('isCreateC=', isCreateC)
    var ratingRange = isCreateC ? constand.RESEARCH_STUDY_POST_POLL_CREATEC : constand.RESEARCH_STUDY_POST_POLL;

    return (
      <Modal
        className="removebbg-popup"
        open={this.props.is_model_open}
        onClose={this.props.closeResearchModel}
        center
      >
        <div class="modal-beam-how" id="myModal">
          <div class="modal-dialog-post-poll mx-auto">
            <div class="modal-content">

              <div class="heading-section-beam">

                <button type="button" class="close" data-dismiss="modal" onClick={() => this.onCloseModal()}>&times;</button>
              </div>


              <div class="modal-body border-0">
                <div class="mx-auto col-md-11">
                  <h4 class="modal-title font-semibold font-24 w-100">How did it go?</h4>
                  {isCreateC &&
                    <h3 class="sub-title font-qregular font-16 mb-4 text-left lengthy-text">
                      <p>A rate of perceived exertion (RPE) scale is a handy tool used to report on how intensely you feel that you're  exercising.</p>
                      <p>Using the scale below let us know how it went by selecting the point on the scale that most closely matches how you felt during the session.</p></h3>
                    ||
                    <h3 class="sub-title font-qregular font-16 w-100 mb-4">On the exertion scale, how would you rate the session: </h3>
                  }
                  {ratingRange.map((list) => (
                    <>
                      <div class={"col-md-12 rate-sec " + list.class + " mb-1"}>
                        <div class="row">
                          <div class="col-md-2 col-2">
                            <span class={'value-rat ' + list.roundClass + ' font-medium font-16'}>{list.id}</span>
                          </div>
                          <div class="col-md-8 col-8 text-center">
                            <span class="value-txt font-medium font-16">{list.value}</span>
                          </div>
                          <div class="col-md-2 col-1 p-r-0 radio-btn">
                            <span class="val-inp">
                              <div class="radionew">
                                <input id={list.id} name="radio" type="radio" value={list.id} onClick={(e) => this.handleSelect(e)} />
                                <label for={list.id} class="radio-label mb-0"></label>
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                  {isCreateC &&
                    <div class="text-center mt-4 col-md-10 mx-auto mb-4 clearfix">
                      <button class={this.state.enable ? "bluebtn float-left w-100 text-center pointer font-semibold font-14" : "btn-disabled float-left w-100 text-center pointer font-semibold font-14"} onClick={() => this.submitPoll(isCreateC)} disabled={!this.state.enable}>Submit</button>
                    </div>
                  ||
                    <div class="text-center mt-4 col-md-10 mx-auto mb-4 clearfix">
                      <button class={this.state.enable ? "bluebtn float-left w-100 text-center pointer font-semibold font-14" : "btn-disabled float-left w-100 text-center pointer font-semibold font-14"} onClick={() => this.submitPoll()} disabled={!this.state.enable}>Submit</button>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    logged_userData: state.header.logged_userData,
  };
};

const mapDispatchToProps = {
  submitPostPoll
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResearchPostPopup);
