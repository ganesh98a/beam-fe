import React from "react";
import { connect } from "react-redux";
import {
    updateEmergencyContact,
    updateUserdataRedex,
    fetchUserDetails
} from "../../actions";
import { toast } from "react-toastify";
import PhoneInput from 'react-phone-input-2';
import { Prompt } from 'react-router';
import Modal from "react-responsive-modal";
import ConfirmationPopup from "../Common/ConfirmationPopup";

class EmergencyInfoComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUpdate: false,
            phoneNumber: '122222',
            emergencyContact: {
                name: '',
                phoneNumber: '',
                type: 'emergencyContact'
            },
            primaryCare: {
                name: '',
                phoneNumber: '',
                type: 'primaryCareDoctor'
            },
            primaryCareConsent: false,
            emergencyContactConsent: false,
            shouldBlockNavigation: false,
        };
    }

    componentDidMount() {
        let authData = JSON.parse(localStorage.getItem('userDetails')) || this.props.logged_userData;
        console.log('this.props.logged_userData-authData', authData)
        this.setState({ countryCode: authData.Country.countryCode.toLowerCase() })

        if (authData && authData.UserEmergencyContacts && authData.UserEmergencyContacts.length > 0) {
            var emergency = authData.UserEmergencyContacts[0];
            emergency.phoneNumber = emergency.phoneNumber.toString();
            var primaryCare = authData.UserEmergencyContacts[1];
            primaryCare.phoneNumber = primaryCare.phoneNumber.toString();

            console.log('authData.UserEmergencyContacts', authData.UserEmergencyContacts)
            this.setState({
                isUpdate: true,
                emergencyContact: emergency,
                primaryCareConsent: (primaryCare.UserConsents.length > 0) ? primaryCare.UserConsents[0].consentGiven : false,
                primaryCare: primaryCare,
                emergencyContactConsent: (emergency.UserConsents.length > 0) ? emergency.UserConsents[0].consentGiven : false,
            })
        }
    }

    onCloseModal = () => { }
    handleEmergencyChange = (e) => {
        const { name, value } = e.target;
        var temp = this.state.emergencyContact;
        temp[name] = value
        this.setState({ emergencyContact: temp, shouldBlockNavigation: true, isDirtyModalOpen: false });
    }
    handlePrimaryChange = (e) => {
        const { name, value } = e.target;
        var temp = this.state.primaryCare;
        temp[name] = value
        this.setState({ primaryCare: temp, shouldBlockNavigation: true, isDirtyModalOpen: false });
    }
    handleCheckboxChange = (e) => //for twoway binding checkbox
    {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    submitEmergencyDetails = () => {
        this.setState({ submitted: true });
        const { emergencyContact, primaryCare, emergencyContactConsent, primaryCareConsent } = this.state;
        // stop here if form is invalid
        if (!(emergencyContact.name && emergencyContact.phoneNumber && primaryCare.name && primaryCare.phoneNumber)) {
            return;
        }
        this.setState({ loading: true });

        var params = this.state;
        this.props.updateEmergencyContact(params).then(response => {
            toast.success(response.message);
            if (response.success) {
                var newValue = {};
                newValue.UserEmergencyContacts = response.user.UserEmergencyContacts;
                this.props.updateUserdataRedex(newValue);
            }
            this.setState({ loading: false });
            this.props.fetchUserDetails();

        }, error => {
            toast.error(error);
            this.setState({ loading: false });

        })
    }
    handleOnChange = value => {
        console.log(value);
        this.setState({ phoneNumber: value }, () => {
            console.log(this.state.phone);
        });
    };
    handleBlockedNavigation = (lastLocation) => {

        if (!this.state.isDirtyModalOpen) {
            this.setState({ isDirtyModalOpen: true, lastLocation: lastLocation })
            return false;
        }
        return true;
    };
    closeConfirmationPopup = (val) => {
        if (val === 'Yes') {
            this.props.history.push(this.state.lastLocation);
            //this.shouldBlockNavigation = false;
        } else {
            this.submitEmergencyDetails();
        }
        this.setState({ isDirtyModalOpen: false });
    }
    render() {
        const { submitted, loading, phoneNumber, country, emergencyContact, addressFinder, address1, address2, city, countryState, postcode, permission_contact, primaryCare, primaryCareConsent, emergencyContactConsent, countryCode } = this.state;
        console.log('emergencyContactConsent', emergencyContact)
        return (
            <React.Fragment>
                <Prompt
                    when={this.state.shouldBlockNavigation}
                    message={this.handleBlockedNavigation}
                />
                <div>
                    <div className="text-new">
                        <p className="font-medium black-txt font-21 m-t-10 member-txt">
                            Emergency Info
                        </p>
                    </div>

                    <div className=" justify-content-center align-items-center">
                        <div className=" m-b-20 ">
                            <p className="font-qregular font-18"> At Beam, we’re committed to the safety of our members. Thank you for providing additional contact information that will be used in the event of an emergency during physio-led classes only.  </p>
                            <p className="font-qregular font-18">Our members' privacy is very important to us, and this information will not be used for any other purposes. For more information about our safety procedures follow this link.</p>
                            <div className="col-md-12  m-b-30 mr-auto ml-auto">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6 m-b-10 p-l-0">
                                        <div
                                            className={
                                                "form-group" +
                                                (submitted && !emergencyContact.name ? " has-error" : "")
                                            }
                                        >
                                            <label
                                                htmlFor="exampleInputEmail1"
                                                className="font-14 font-semibold black-txt"
                                            >
                                                Name of your emergency contact <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control input_field"
                                                id="name"
                                                aria-describedby="name"
                                                placeholder=""
                                                name="name"
                                                value={emergencyContact.name}
                                                onChange={this.handleEmergencyChange}
                                            />
                                            {submitted && !emergencyContact.name && (
                                                <p className="help-block text-danger">
                                                    This information is required
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 m-b-10 p-l-0">
                                        <div className={
                                            "form-group phone_inputs_field" +
                                            (submitted && !emergencyContact.phoneNumber ? " has-error" : "")
                                        }
                                        >
                                            <label
                                                htmlFor="exampleInputEmail1"
                                                className="font-14 font-semibold black-txt"
                                            >
                                                Phone number of your emergency contact <span className="text-danger">*</span>
                                            </label>
                                            <PhoneInput
                                                defaultCountry={countryCode}
                                                country={emergencyContact.phoneNumber ? '' : countryCode}
                                                value={emergencyContact.phoneNumber}
                                                onChange={phoneNumber => {
                                                    var temp = this.state.emergencyContact;
                                                    temp.phoneNumber = phoneNumber
                                                    this.setState({ emergencyContact: temp, shouldBlockNavigation: true, isDirtyModalOpen: false });
                                                }}
                                                inputClass="w-100 input_field"
                                            />

                                            {submitted && !emergencyContact.phoneNumber && (
                                                <p className="help-block text-danger">
                                                    This information is required
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="toggle-btns float-left w-100 m-b-30 d-flex align-items-center">
                                        <span className="font-16 font-qregular col-11 p-0">I consent to this person being contacted by any employee or contractor of Beam in an emergency situation, disclosing health information I have submitted on Beam should they deem it necessary.</span>
                                        <label className="switch m-l-10 pull-right col-1 p-0 radio_slider" htmlFor="emergencyContactConsent">
                                            <input
                                                type="checkbox"
                                                name="emergencyContactConsent"
                                                id="emergencyContactConsent"
                                                checked={emergencyContactConsent}
                                                onChange={() => {
                                                    var emergencyContact = this.state.emergencyContact;
                                                    if (emergencyContact.UserConsents && emergencyContact.UserConsents.length > 0) {
                                                        emergencyContact.UserConsents[0].consentGiven = !emergencyContact.UserConsents[0].consentGiven;
                                                        this.setState({
                                                            shouldBlockNavigation: true, isDirtyModalOpen: false,
                                                            emergencyContact: emergencyContact, emergencyContactConsent: !emergencyContactConsent
                                                        })
                                                    } else {
                                                        this.setState({
                                                            shouldBlockNavigation: true, isDirtyModalOpen: false, emergencyContactConsent: !emergencyContactConsent
                                                        });
                                                    }
                                                }}
                                                value={emergencyContactConsent} />
                                            <div className="slider round"></div>
                                        </label>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 m-b-10 p-l-0">
                                        <div
                                            className={
                                                "form-group" +
                                                (submitted && !primaryCare.name ? " has-error" : "")
                                            }
                                        >
                                            <label
                                                htmlFor="exampleInputEmail1"
                                                className="font-14 font-semibold black-txt"
                                            >
                                                Name of your GP or primary care doctor <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control input_field"
                                                id="name"
                                                aria-describedby="emailHelp"
                                                placeholder=""
                                                name="name"
                                                value={primaryCare.name}
                                                onChange={this.handlePrimaryChange}
                                            />
                                            {submitted && !primaryCare.name && (
                                                <p className="help-block text-danger">
                                                    This information is required
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 m-b-10 p-l-0">
                                        <div className={
                                            "form-group phone_inputs_field" +
                                            (submitted && !primaryCare.phoneNumber ? " has-error" : "")
                                        }
                                        >
                                            <label htmlFor="exampleInputEmail1" className="font-14 font-semibold black-txt">
                                                Phone number of your GP or primary care doctor <span className="text-danger">*</span>
                                            </label>
                                            <PhoneInput
                                                defaultCountry={countryCode}
                                                country={primaryCare.phoneNumber ? '' : countryCode}
                                                value={primaryCare.phoneNumber}
                                                onChange={phoneNumber => {
                                                    var temp = this.state.primaryCare;
                                                    temp.phoneNumber = phoneNumber
                                                    this.setState({ shouldBlockNavigation: true, isDirtyModalOpen: false, primaryCare: temp });
                                                }}
                                                inputClass="w-100 input_field"
                                            />
                                            {submitted && !primaryCare.phoneNumber && (
                                                <p className="help-block text-danger">
                                                    This information is required
                                                </p>
                                            )}

                                        </div>
                                    </div>
                                    <div className="toggle-btns float-left w-100 m-b-30 d-flex align-items-center">

                                        <span className="font-16 font-qregular col-11 p-0">I consent to this person being contacted by any employee or contractor of Beam in an emergency situation, disclosing health information I have submitted on Beam should they deem it necessary.</span>
                                        <label className="switch m-l-10 pull-right col-1 p-0 radio_slider" htmlFor="primaryCareConsent">
                                            <input type="checkbox" name="primaryCareConsent" id="primaryCareConsent" checked={primaryCareConsent} onChange={() => {
                                                var primaryCare = this.state.primaryCare;
                                                if (primaryCare.UserConsents && primaryCare.UserConsents.length > 0) {
                                                    primaryCare.UserConsents[0].consentGiven = !primaryCare.UserConsents[0].consentGiven;
                                                    this.setState({ shouldBlockNavigation: true, isDirtyModalOpen: false, primaryCare: primaryCare, primaryCareConsent: !primaryCareConsent })
                                                } else {
                                                    this.setState({
                                                        shouldBlockNavigation: true,
                                                        isDirtyModalOpen: false,
                                                        primaryCareConsent: !primaryCareConsent
                                                    })
                                                }
                                            }} value={primaryCareConsent} />
                                            <div className="slider round"></div>

                                        </label>
                                    </div>
                                    {/* {submitted && (!primaryCareConsent || !emergencyContactConsent) && (
                                        <p className="help-block text-danger">
                                            No users can sign up to live class without all consents as true
                                        </p>
                                    )} */}
                                </div>
                            </div>
                        </div>
                        <div id="register-link" className=" w-100 m-t-10 m-b-20 float-left save_chnges_btn">
                            <button
                                disabled={this.state.loading}
                                onClick={this.submitEmergencyDetails}
                                className="btn btn-purple-inverse font-14 font-medium save-btn text-center"
                            >
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
                <ConfirmationPopup
                    title="Want to save changes?"
                    desc="We noticed you have made changes to your basic info but not saved them. Would you like to save these changes?"
                    yesButton="Cancel changes"
                    noButton="Save changes"
                    isConfirmation={true}
                    is_model_open={this.state.isDirtyModalOpen}
                    closeConfirmationPopup={this.closeConfirmationPopup} />

                {/* <Modal
                    className="removebbg-popup"
                    open={this.state.isDirtyModalOpen} onClose={() => {
                        this.setState({ isDirtyModalOpen: false });
                    }} center
                >
                    <div
                        className="activityModal modal-dialog common_design modal-width--custom live-classes--popup m-t-50 w-100"
                        role="document"
                    >
                        <div className="modal-content">
                            <div className="modal-header header-styling  border-0">
                                <h5
                                    className="text-center white-txt col-md-12 p-0 font-book font-24"
                                    id="exampleModalLabel "
                                >
                                    Want to save changes?
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span
                                        aria-hidden="true"
                                        onClick={() => this.setState({ isDirtyModalOpen: false })}
                                    >
                                        &times;
                                    </span>
                                </button>
                            </div>
                            <div className="modal-body body-padding--value pb-0">
                                <div>
                                    <p className="text-center">We noticed you have made changes to your basic info but not saved them. Would you like to save these changes?</p>
                                    <div className="buttons-read w-100 m-t-20 float-left text-center pointer">
                                        <a className="btn btn-blue-inverse font-14 read-now m-r-20" onClick={() =>
                                            this.setState({ isDirtyModalOpen: false })}>
                                            Cancel changes
                                        </a>
                                        <a className="btn btn-blue-inverse font-14 read-later m-l-20 pointer" onClick={() => {
                                            this.submitEmergencyDetails()
                                            this.props.history.push(this.state.lastLocation);
                                            this.setState({ isDirtyModalOpen: false, shouldBlockNavigation: false });
                                        }}>
                                            Save changes
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal> */}

            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        IP_Details: state.accountinfo.ip_data,
        logged_userData: state.header.logged_userData,
        registerFormValues: state.register.registerFormValues,
        step: state.register.step,
        clinic_direction: state.register.clinic_direction,
        conditionRelationshipList: state.register.conditionRelationshipList,
        healthcondition_list: state.register.healthcondition_list,

    };
};

const mapDispatchToProps = {
    updateEmergencyContact,
    updateUserdataRedex,
    fetchUserDetails
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmergencyInfoComponent);
