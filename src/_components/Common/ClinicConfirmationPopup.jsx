import React from "react";
import { connect } from "react-redux";
import Modal from "react-responsive-modal";
import { Cookies } from "react-cookie-consent";
import { updateUserClinic, openClinic, updateClinicResponse, fetchUserDetails } from "../../actions";
import * as constand from "../../constant";

class ClinicConfirmationPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clinic_status: '',
            other_clinic: ''
        };
        this.updateClinicstatus = this.updateClinicstatus.bind(this);
        this.handleChangeOtherClinic = this.handleChangeOtherClinic.bind(this);
    }

    updateClinicstatus(e) {
        this.setState({ clinic_status: e.target.value });
    }
    handleChangeOtherClinic(e) {
        this.setState({ other_clinic: e.target.value })
    }
    onCloseModal = () => { }

    submitClinic = () => {
        var kd_condition = this.props.logged_userData.Tags && this.props.logged_userData.Tags.find(element => element.tag == constand.KR_CONDITION)
        if (kd_condition && kd_condition.id) {
            var selectedClinics = {
                other_clinic: this.state.other_clinic,
                clinic_status: this.state.clinic_status,
                userId: this.props.logged_userData.id,
                kdConditionId: kd_condition.id
            }
            this.props.updateUserClinic(selectedClinics)
        }
        this.closeConfirmation();
        this.props.updateClinicResponse();
        this.props.fetchUserDetails();
    }
    closeConfirmation = () => {
        this.props.updateClinicResponse()
        this.props.openClinic(false);
    }

    render() {
        return (
            <Modal
                className="removebbg-popup"
                open={this.props.is_model_open}
                onClose={this.onCloseModal}
                center
            >
                {
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
                                {<button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span
                                        aria-hidden="true"
                                        onClick={() => this.closeConfirmation()}
                                    >&times;</span>
                                </button>
                                }
                            </div>
                            <div className="row justify-content-center align-items-center">
                                <div className="input_section col-md-6 m-t-10">
                                    {
                                        <div className="form-group">
                                            <div className="dropdown">
                                                <select
                                                    name="clinic_status"
                                                    value={this.state.clinic_status}
                                                    className="form-control"
                                                    onChange={this.updateClinicstatus}
                                                >
                                                    <option className="pointer">Select clinic</option>
                                                    {
                                                        this.props.clinic_list.map((item) => {
                                                            return (
                                                                <option
                                                                    className="pointer"
                                                                    key={"clinic_" + item.id}
                                                                    value={item.id}
                                                                >
                                                                    {item.clinicName}
                                                                </option>
                                                            )
                                                        })
                                                    }
                                                    {<option className="pointer">Other</option>}
                                                </select>
                                            </div>
                                        </div>
                                    }
                                    {this.state.clinic_status == "Other" &&
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="other_clinic"
                                                id="other_clinic"
                                                placeholder="Enter Clinic Name"
                                                className="form-control input-control"
                                                maxLength="160"
                                                value={this.state.other_clinic || ''}
                                                required
                                                onChange={this.handleChangeOtherClinic}
                                            />
                                        </div>
                                    }
                                    {
                                        <div className="buttons-read w-100 m-t-20 float-left text-center pointer">
                                            <a className="btn btn-blue-inverse font-14 read-later m-l-20 pointer" onClick={this.submitClinic}>
                                                Submit
                                            </a>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        logged_userData: state.header.logged_userData,
        clinic_list: state.register.clinic_list
    };
};
const mapDispatchToProps = {
    updateUserClinic, openClinic, updateClinicResponse ,fetchUserDetails
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ClinicConfirmationPopup);