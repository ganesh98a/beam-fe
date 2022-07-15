import React from "react";
import Modal from "react-responsive-modal";
import { connect } from "react-redux";
import { Player } from "video-react";
import * as constand from "../../constant";
import {
    saveTimeSpent
} from "../../actions";

class ProgramPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillUnmount() {
        this.is_start = false;
    }

    onCloseModal = () => { }

    submitTime() {
        this.props.closeVideoModel();
    }

    render() {
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
                                {/* <h5
                                    className="modal-title1 text-center col-md-12 p-0  font-semibold white-txt"
                                    id="exampleModalLabel font-medium"
                                >
                                </h5> */}
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">
                                        &times;
                                    </span>
                                </button>
                            </div>
                            <div className="modal-header header-styling  border-0">
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
                            </div>
                            <div className="modal-body pb-0">
                                <Player
                                    ref={player => {
                                        this.player = player;
                                    }}
                                    autoPlay
                                    className="w-100 border-0"
                                    height="400"
                                    playsInline
                                    src={constand.S3_URL + this.props.ProgramTrailerURL}
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
    return {};
};

const mapDispatchToProps = { saveTimeSpent };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProgramPlayer);
