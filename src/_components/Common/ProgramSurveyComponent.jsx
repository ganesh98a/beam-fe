import React from "react";
import { connect } from "react-redux";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import { Cookies } from "react-cookie-consent";
import { commonService } from "../../_services";

class ProgramSurveyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            video_end: "",
            preSurvey: "",
            postSurvey: ""
        };

    }
    componentDidMount() {
    }

    componentWillReceiveProps(props) {
        console.log("program-deatil-survey", props);
        this.setState({
            preSurvey: props.programDetail.preSurvey,
            postSurvey: props.programDetail.postSurvey,
        })
        if (props.end_video) {
            this.setState({
                video_end: props.end_video
            })
        }
    }

    onCloseModal() { }

    openUrl() {
        this.props.modelClose()
        if (!this.state.video_end) {
            window.open(this.state.preSurvey);
        } else {
            window.open(this.state.postSurvey);
        }
    }
    render() {
        var currentCondition = Cookies.get('condition').replace(/ /g, '-');
        return (
            <Modal
                className="removebbg-popup"
                open={this.props.is_model_open}
                onClose={this.onCloseModal}
                center
            >
                <div
                    className="modal-dialog common_design modal-width--custom live-classes--popup w-100"
                    role="document"
                >
                    <div className="modal-content">
                        <div className="modal-header header-styling  border-0">
                            <h5
                                className="font-book text-center white-txt col-md-12 p-0 font-24"
                                id="exampleModalLabel "
                            >
                                Survey
                            </h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span
                                    aria-hidden="true"
                                    onClick={() => this.props.modelClose()}
                                >&times;</span>
                            </button>
                        </div>
                        <div className="modal-body body-padding--value pb-0">
                            <div>
                                {!this.state.video_end ?
                                    <div>
                                        <span className="font-qregular  text-center w-100 float-left m-b-50">
                                            Welcome to Beam Programs! We hope to support you to move more, build confidence and feel good doing it! To help you see how far you've come by the end of the program we'd like you to record where you're starting from - Thank you for taking this short survey!
                                        </span>
                                    </div>
                                    :
                                    <div>
                                        <span className="font-qregular  text-center w-100 float-left m-b-50">
                                            Congratulations on completing your program! We know it's not an easy task and we think you're phenomenal for sticking with it. To reflect on how far you've come please complete this survey. Thank you!
                                        </span>
                                    </div>
                                }
                                <div className="buttons-read w-100 float-left text-center col-lg-12 col-xs-12 col-md-12">
                                    <a className="btn btn-beam-blue font-14 col-xs-8 col-lg-6 col-md-6" onClick={() => this.openUrl()}>
                                        Start Survey
                                    </a>
                                    <div class="text-center form-group m-t-8 m-b-20">
                                        <span class="col-md-12 p-0 text-underline pointer font-16 font-qregular black-txt" onClick={() => this.props.modelClose()}><u>Skip</u>
                                        </span>
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
    return {
        is_auth: state.auth.is_auth,
        logged_userData: state.header.logged_userData,
        end_video: state.workout.end_video,

    };
};
const mapDispatchToProps = {

};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProgramSurveyComponent);
