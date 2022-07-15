import React from "react";
import { connect } from "react-redux";
import Modal from "react-responsive-modal";
import { Cookies } from "react-cookie-consent";

class NoThanksModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRead: false
        };
    }

    onCloseModal() { }

    render() {
        var currentCondition = Cookies.get('condition')
        return (
            <Modal
                className="removebbg-popup"
                open={this.props.is_model_open}
                onClose={this.onCloseModal}
                center
            >
                <div
                    className="modal-dialog common_design modal-width--custom live-classes--popup"
                    role="document"
                >
                    <div className="modal-content">
                        <div className="modal-header header-styling  border-0">
                            <h5
                                className="modal-title1 text-center white-txt col-md-12 p-0 font-book font-24"
                                id="exampleModalLabel "
                            >
                                {this.props.title}
                            </h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span
                                    aria-hidden="true"
                                    onClick={() => this.props.submitNo()}
                                >&times;</span>
                            </button>
                        </div>
                        <div className="modal-body body-padding--value pb-0">
                            <div>
                                <div className="col-md-12 text-center m-b-30 mr-auto ml-auto">
                                    <p className="font-15 font-semibold black-txt">{this.props.content}</p>
                                </div>
                                <div className="buttons-read w-100 m-t-20 float-left text-center pointer">
                                    <a className="btn btn-blue-inverse font-14 read-now m-r-20" onClick={() => this.props.submitYes()}>
                                        {this.props.yesButton}
                                    </a>
                                    <a className="btn btn-blue-inverse font-14 read-later m-l-20 pointer" onClick={() => this.props.submitNo()}>
                                        {this.props.noButton}
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
        logged_userData: state.header.logged_userData,

    };
};
const mapDispatchToProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NoThanksModal);
