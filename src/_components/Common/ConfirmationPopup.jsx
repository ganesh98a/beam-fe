import React from "react";
import { connect } from "react-redux";
import Modal from "react-responsive-modal";
import { Cookies } from "react-cookie-consent";

class ConfirmationPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRead: false
        };
    }

    onCloseModal(){
    }

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
                                {this.props.title ? this.props.title : 'Heads Up!'}
                            </h5>
                            {this.props.isCloseRequired && <button
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
                            }
                        </div>
                        <div className="modal-body body-padding--value pb-0">
                            <div>
                                {this.props.type == 'policy' &&
                                    <div>
                                        <div className="col-md-12 text-center m-b-30 mr-auto ml-auto">
                                            <p className="font-18 font-qregular black-txt">We’ve been reviewing our <a className="black-txt font-semibold" href="/terms" target="_blank"> <u>terms and conditions</u></a> and <a className="black-txt font-semibold" href="/terms" target="_blank"> <u>privacy policy</u></a> and have made a few changes that we need you to agree to before continuing to use Beam. Please read these and confirm that you are happy to agree to them below:</p>
                                        </div>
                                        <div className="toggle-btns float-left w-100">
                                            <span className="font-18 font-qregular black-txt">
                                                I agree to Beam’s T&Cs and privacy policy…
                                                {/* <a className="black-txt" href="/terms" target="_blank"> <u>T&Cs</u> </a>and <a className="black-txt" href="/privacy" target="_blank"><u>Privacy policy…</u></a> */}</span>
                                            <label className="switch m-l-10 pull-right" htmlFor="terms">
                                                <input type="checkbox" name="terms" id="terms" defaultChecked={this.props.terms} onChange={this.props.handleCheckboxChange} value={this.props.terms} />
                                                <div className="slider round"></div>
                                            </label>
                                            {this.props.submitted && (!this.props.terms) && <p className="text-danger m-t-10">* We require this consent to allow you to use Beam.</p>}
                                        </div>
                                    </div>

                                }
                                {this.props.type != 'policy' &&
                                    <div className="col-md-12 text-center m-b-30 mr-auto ml-auto">
                                        <p className="font-15 font-semibold black-txt">{this.props.desc ? this.props.desc : "Are you sure you want to close and lose your changes?"}</p>
                                    </div>
                                }
                                {this.props.isConfirmation &&
                                    <div className="buttons-read w-100 m-t-20 float-left text-center pointer">
                                        <a className="btn btn-blue-inverse font-14 read-now m-r-20" onClick={() => this.props.closeConfirmationPopup('Yes')}>
                                            {this.props.yesButton ? this.props.yesButton : "Yes"}
                                        </a>
                                        <a className="btn btn-blue-inverse font-14 read-later m-l-20 pointer" onClick={() => this.props.closeConfirmationPopup('No')}>
                                            {this.props.noButton ? this.props.noButton : "No"}
                                        </a>
                                    </div>
                                }
                                {!this.props.isConfirmation &&
                                    <div className="buttons-read w-100 m-t-20 float-left text-center pointer">
                                        <a className="btn btn-blue-inverse font-14 read-later m-l-20 pointer" onClick={() => this.props.closeConfirmationPopup(this.props.terms)}>
                                            Continue
                                        </a>
                                    </div>
                                }
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
)(ConfirmationPopup);