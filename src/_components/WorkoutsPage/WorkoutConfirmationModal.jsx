import React from "react";
import { connect } from "react-redux";
import Modal from "react-responsive-modal";
import { Cookies } from "react-cookie-consent";

class WorkoutConfirmationModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRead: false
        };
    }

    onCloseModal() { }

    render() {
        return (
            <Modal
                className="removebbg-popup"
                open={this.props.is_model_open}
                onClose={this.onCloseModal}
                center
            >
                <div
                    className="modal-dialog common_design modal-width--custom live-classes--popup plain-popup"
                    role="document"
                >
                    <div className="modal-content">
                        <div className="modal-header header-styling  border-0">
                        
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span
                                    aria-hidden="true"
                                    onClick={() => this.props.closeConfirmationPopup('Yes')}
                                >&times;</span>
                            </button>
                        </div>
                        <div className="modal-body body-padding--value pb-0">
                            <div>
                                <div className="col-md-12 text-center m-b-30 mr-auto ml-auto">
                                    <p className="font-15 font-semibold black-txt">It can take some time to upload video files but don't worry, we'll keep working on it in the background and send you an email once the upload is complete.</p>
                                </div>
                                <div className="buttons-read w-100 m-t-20 float-left text-center pointer">
                                    <a className="btn btn-blue-inverse font-14 read-later pointer" onClick={() => this.props.closeConfirmationPopup('Yes')}>
                                    Ok, sure
                                    </a>
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
        logged_userData: state.header.logged_userData
    };
};
const mapDispatchToProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkoutConfirmationModal);
