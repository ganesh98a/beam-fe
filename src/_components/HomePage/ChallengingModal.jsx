import React from "react";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as constand from "../../constant";
import { Cookies } from "react-cookie-consent";
import { commonService } from "../../_services";

class ChallendingModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        this.onCloseModal = this.onCloseModal.bind(this);
        this.closeModel = this.closeModel.bind(this);
    }
    componentDidMount() {
        console.log('didmount', localStorage.getItem('beamchallenging'));

    }
    componentWillReceiveProps(nextprops) {
        console.log('challengign-receiveprops', nextprops)
    }
    onCloseModal() { }
    closeModel() { //for close the login model
        // this.setState({ isModelOpen: false });
        var user = JSON.parse(localStorage.getItem('user'));
        console.log('challuser', user)
        user.beamchallenging = false;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('beamchallenging', '');
        //window.location.href = '/on-demand/' + ((typeof Cookies.get('condition') != 'undefined' ? Cookies.get('condition') : constand.CONDITION).toLowerCase().replace(/ /g, '-'))
        // this.props.loginModelOpen(false);
        const { from } = { from: { pathname: '/on-demand/' + (commonService.replaceChar((typeof Cookies.get('condition') != 'undefined' ? Cookies.get('condition') : constand.CONDITION), false)) } };
        this.props.history.push(from);
    }

    render() {
        return (
            <React.Fragment>
                <Modal
                    className="removebbg-popup"
                    open={this.props.is_auth && (!this.props.challenge_tag || (JSON.parse(localStorage.getItem('user')) && JSON.parse(localStorage.getItem('user')).beamchallenging))}
                    onClose={() => this.onCloseModal()}
                    center
                >
                    <div className="modal-dialog modal-width--custom m-t-50" role="document">
                        <div className="modal-content">
                            <div className="modal-header header-styling  border-0">
                                <h5
                                    className="modal-title text-center col-md-11 p-0 font-semibold"
                                    id="exampleModalLabel font-medium"
                                >

                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true" onClick={() => this.closeModel()}>
                                        &times;
                  </span>
                                </button>
                            </div>
                            <div className="modal-body body-padding--value" onClick={() => this.closeModel()}>
                                <img src={constand.WEB_IMAGES + "Keep-Beaming-Challenge.jpeg"} className="w-100 pointer" />
                            </div>
                        </div>
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        is_auth: state.auth.is_auth,
        challenge_tag: state.auth.challenge_tag,
        init_condition: state.auth.initial_condition
    };
};

const mapDispatchToProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChallendingModal);
