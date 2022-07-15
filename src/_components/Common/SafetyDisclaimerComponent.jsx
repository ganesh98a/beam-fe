import React from "react";
import { connect } from "react-redux";
import {
    saveDisclaimer,
    updateUserdataRedex
} from "../../actions";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import { Cookies } from "react-cookie-consent";
import { commonService } from "../../_services";

class SafetyDisclaimerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRead: false
        };
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.submitDisclaimer = this.submitDisclaimer.bind(this);
    }

    onCloseModal() { }

    submitDisclaimer() {
        if (this.state.isRead) {
            var tag = commonService.replaceChar(Cookies.get('condition'), true);
            var params = { tag }
            this.props.saveDisclaimer(params).then(result => {
                if (result.status) {
                    console.log('result', result.usertags)
                    var logged_data = this.props.logged_userData;
                    logged_data.Tags.push(result.usertags);
                    this.props.updateUserdataRedex(logged_data);
                }
                this.props.modelClose();
            }, error => {
                console.log('result-error', error)
                this.props.modelClose();

            })
        } else {
            this.props.modelClose()
        }
    }

    handleCheckboxChange(e) //for twoway binding checkbox
    {
        var isRead = this.state.isRead;
        this.setState({ isRead: !isRead })
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
                                className="modal-title1 text-center white-txt col-md-12 p-0 font-book font-24"
                                id="exampleModalLabel "
                            >
                                Head's Up!
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
                                {this.props.type == 'core' &&
                                    <div>
                                        <div className="col-md-12 text-center m-b-30 mr-auto ml-auto">
                                            <p className="font-15 font-semibold black-txt">Great - you've found a class that you want to take on Beam!</p>
                                        </div>
                                        <span className="text-center w-100 float-left m-b-50">
                                            Before you do, please have a read over <Link className="purplefont" to={'/blogs/safety-info-' + currentCondition} target="_blank"><u>this safety information</u></Link> to make sure you keep safe and feel your best during and after your class.
                                        </span>
                                        <div className="toggle-btns float-left w-100">
                                            <span className="font-14 font-qregular black-txt">Sure I've read this info! Don't show me this message again</span>
                                            <label className="switch m-l-10 pull-right" htmlFor="isRead">
                                                <input type="checkbox" name="isRead" id="isRead" defaultChecked={this.state.isRead} onChange={this.handleCheckboxChange} value={this.state.isRead} />
                                                <div className="slider round"></div>
                                            </label>
                                        </div>
                                    </div>
                                }

                                { // create c safety contents
                                    this.props.type == 'createc' &&
                                    <div className="col-md-12">
                                        <div className="text-center m-b-30 mr-auto ml-auto">
                                            <p className="font-15 font-semibold">Please always remember that any activity you access on Beam is remote, and you are responsible for your own health. If you are exercising alone, always have your mobile phone to hand, or check in with a family member or friend before and after the class.</p>
                                        </div>
                                        <p>If you experience chest pain or tightness or are feeling unwell:</p>
                                        <span className="">

                                            <ul className="col-md-12 text-justify m-b-30 mr-auto ml-auto">
                                                <li>Stop exercising</li>
                                                <li>Sit down and rest</li>
                                                <li>If you have been prescribed a GTN (glyceryl trinitrate) spray, use it as your doctor has told you to do. If this does not ease, call 999</li>
                                                <li>
                                                    If you do not have a GTN spray, rest and call 999 for medical assistance if required
                                                </li>
                                                <li>
                                                    Taking part in any activity using the CREATE- C videos on Beam is at your own risk.
                                                </li>
                                            </ul>
                                        </span>

                                        <p >Contact details for the oncology physiotherapist: <span><a className="purplefont" href="mailto:Physio.Create@addenbrookes.nhs">Physio.Create@addenbrookes.nhs</a></span>
                                        </p>
                                    </div>
                                }

                                <div className="buttons-read w-100 m-t-20 float-left text-center col-lg-12 col-xs-12 col-md-12">
                                    <a className="btn btn-blue-inverse font-14 col-xs-8 col-lg-4 m-t-20 m-r-20 col-md-4" onClick={() => this.props.safetyProcess()}>
                                        {this.props.type == 'createc' ? 'Close' : 'Go back'}
                                    </a>
                                    <a className="btn btn-beam-blue font-14 pointer col-xs-8 m-t-20 col-lg-6 col-md-6" onClick={() => this.submitDisclaimer()}>
                                        {this.props.type == 'createc' ? 'Continue' : 'Go to class'}
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
    saveDisclaimer,
    updateUserdataRedex
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SafetyDisclaimerComponent);
