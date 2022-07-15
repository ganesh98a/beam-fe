import React from "react";
import Modal from "react-responsive-modal";
import { connect } from "react-redux";
import { submitPrePoll } from "../../actions";
import { toast } from "react-toastify";
import * as constand from "../../constant";
import InputRange from "react-input-range";
import ReactGA from 'react-ga';
import { Cookies } from "react-cookie-consent";

class ResearchStudyPollPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enable: false,
      value: [{ "Injured": "", "Unwell": "", "Admitted to hospital (unplanned)": "" }],
      showText: false,
      form_response: ''
    }
  }

  onCloseModal() {
    this.setState({
      enable: false,
      value: [{ "Injured": "", "Unwell": "", "Admitted to hospital (unplanned)": "" }],
      showText: false,
      form_response: ''
    })
    this.props.closeResearchModel();
  }

  submitPoll() {
    var dataObj = {
      roomId: this.props.current_attendee.RoomId,
      stateSinceLastSession: this.state.value,
      problemDesc: this.state.form_response,
      classType: this.props.classType,
      workoutId: this.props.workoutId,
      trial_name: Cookies.get('condition')
    };
    this.props.submitPrePoll(dataObj).then(
      response => {
        if (response) {
          this.onCloseModal();
          this.props.closeResearchModel();
          this.props.beforeReview();
          // toast.success(response.message);
        }
      },
      error => {
        this.onCloseModal();
        this.props.closeResearchModel();
        toast.error(error);
      }
    );
  }

  handleSelect(event, label) {
    var newValue = this.state.value;
    var exist, isComplete;
    newValue.forEach((item) => {
      (label !== 'form_response') ? item[label] = event.target.value : this.setState({ form_response: event.target.value });
      exist = Object.values(item).includes("Yes");
      isComplete = Object.values(item).includes("");
    });
    this.setState({ value: newValue, showText: exist, enable: (!isComplete && !exist && this.state.form_response !== '' ? true : !isComplete && exist && this.state.form_response !== '' ? true : !isComplete && !exist && this.state.form_response === '' ? true : false) });
  }


  render() {
    return (
      <Modal
        className="removebbg-popup"
        open={this.props.is_model_open}
        onClose={this.onCloseModal}
        center
      >
        <div class="modal-beam" id="myModal">
          <div class="modal-dialog">
            <div class="modal-content">

              <div class="heading-section-beam">
                <button type="button" class="close" data-dismiss="modal" onClick={() => this.onCloseModal()}>&times;</button>
              </div>
              <div class="modal-body border-0">
                <div class="mx-auto col-md-9">
                  <h4 class="modal-title font-semibold font-24 w-100">Before We Start</h4>
                  <h3 class="sub-title font-medium font-18 w-100 mb-4">During or since your last exercise session, have you been:
              </h3>
                  <div class="col-md-12">
                    <div class="row">
                      <div class="col-md-9 col-6 p-0">
                      </div>
                      <div class="col-md-3 col-6 p-0">
                        <span class="float-left font-qbold option-head w-50 text-center">Yes</span>
                        <span class="float-left font-qbold option-head w-50 text-center">No</span>
                      </div>
                    </div>
                  </div>
                  {constand.RESEARCH_STUDY_PRE_POLL.map((item, key) => {
                    return (
                      <div class="col-md-12">
                        <div class="row">
                          <div class="col-md-9 col-6 p-0">
                            <p class="font-qmedium font-16 lable-rad">{item}</p>
                          </div>
                          <div class="col-md-3 col-6 p-0">
                            <span class="float-left font-qbold option-head w-50 text-center">
                              <div class="mradio">
                                <input id={key} name={item} type="radio" value="Yes" onClick={(e) => this.handleSelect(e, item)} />
                                <label for={key} class="radio-label"></label>
                              </div>
                            </span>
                            <span class="float-left font-qbold option-head w-50 text-center">
                              <div class="mradio">
                                <input id={key + 'k'} name={item} type="radio" value="No" onClick={(e) => this.handleSelect(e, item)} />
                                <label for={key + 'k'} class="radio-label"></label>
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
            /* <div class="col-md-12">
              <div class="row">
                  <div class="col-md-9 p-0">
                    <p class="font-qmedium font-16 lable-rad">Unwell</p>
                  </div>
                  <div class="col-md-3 p-0">
                    <span class="float-left font-qbold option-head w-50 text-center"><div class="lradio">
                      <input id="radio-3" name="radio2" type="radio" checked />
                      <label for="radio-3" class="radio-label"></label>
                    </div>
    
                    </span>
                    <span class="float-left font-qbold option-head w-50 text-center"><div class="lradio">
                      <input id="radio-4" name="radio2" type="radio" />
                      <label  for="radio-4" class="radio-label"></label>
                    </div></span>
                  </div>
                </div>
            </div>
            <div class="col-md-12">
              <div class="row">    
                  <div class="col-md-9 p-0">
                    <p class="font-qmedium font-16 lable-rad">Admitted to hospital (unplanned)</p>
                  </div>
                  <div class="col-md-3 p-0">
                    <span class="float-left font-qbold option-head w-50 text-center"><div class="lradio">
                      <input id="radio-5" name="radio" type="radio" checked />
                      <label for="radio-5" class="radio-label"></label>
                    </div>
                    </span>
                    <span class="float-left font-qbold option-head w-50 text-center"><div class="lradio">
                      <input id="radio-6" name="radio" type="radio" />
                      <label  for="radio-6" class="radio-label"></label>
                    </div></span>
                  </div>
                </div>
            </div> */}
                  {this.state.showText && (
                    <>
                      <p class="small-text font-qmedium font-12 ">
                        We don’t need to know about things like:</p>
                      <ul class="">
                        <li class="small-text font-qmedium font-12">Your normal COVID-19 symptoms</li>
                        <li class="small-text font-qmedium font-12">Normal feelings with exercise like moderate levels of
                      shortness of breath,stiff/sore muscles and tiredness</li>
                        <li class="small-text font-qmedium font-12">Planned hospital admissions</li>
                      </ul>
                      <div class="col-md-12">
                        <p class="font-qregular font-16 text-area-head m-0">In a few words describe the problem you have had:</p>
                        <textarea class="custom-tetarea form-control" onChange={(e) => this.handleSelect(e, 'form_response')} value={this.state.form_response}></textarea>
                      </div>
                    </>
                  )}
                  <div class="text-center mt-5">
                    <button class={this.state.enable ? "bluebtn float-left w-100 text-center pointer font-semibold font-14" : "btn-disabled float-left w-100 text-center pointer font-semibold font-14"} onClick={() => this.submitPoll()} >Continue to class</button>
                  </div>
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
  return {};
};

const mapDispatchToProps = {
  submitPrePoll
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResearchStudyPollPopup);
