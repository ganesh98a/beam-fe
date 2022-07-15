import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { start_loader, stop_loader, setStep, getTagsBasedOnType, setConditionIndex, updateMovementPrefs, updateUserdataRedex } from "../../actions";
import { Prompt } from 'react-router';
import ConfirmationPopup from "../Common/ConfirmationPopup";
import _ from 'lodash';

class MovementPrefsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitted: false,
            current_index: 0,
            loader: false,
            treatment: [],
            movement_prefs: [],
            shouldBlockNavigation: false
        };
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.backTo = this.backTo.bind(this);
    }
    componentDidMount() {

        var authData = JSON.parse(localStorage.getItem('userDetails')) || this.props.logged_userData;
        this.props.getTagsBasedOnType('movementPrefs').then(response => {
            if (response.success) {
                this.setState({ treatment: response.data.tags })
            }
        })
        var tempPrefs = []
        var authData = JSON.parse(localStorage.getItem('userDetails')) || this.props.logged_userData;
        _.filter(authData.Tags, function (list) {
            if (list.type === "movementPrefs") {
                tempPrefs.push(list.id)
            }
            return list.id;
        });
        this.setState({ movement_prefs: tempPrefs })
    }
    backTo() {
        /*  if (this.state.is_clinic_found)
             this.props.setStep(10, 'backward')
         else */
        this.props.setStep(14, 'backward')
    }
    handleCheckboxChange(e) {
        var item = parseInt(e.target.value);
        var temp = [...this.state.movement_prefs];
        if (this.state.movement_prefs.length > 0) {
            var index = this.state.movement_prefs.findIndex(x => x === item);

            if (index > -1) {
                temp.splice(index, 1);
            } else {
                temp.push(item);
            }
        } else {
            temp.push(item);
        }

        this.setState({ shouldBlockNavigation: true, isDirtyModalOpen: false, movement_prefs: temp })
    }
    checkTagvalue = (item) => {
        var authData = JSON.parse(localStorage.getItem('userDetails')) || this.props.logged_userData;
        return authData.Tags.find(e => (e.type == "movementPrefs" && e.tag == item.tag) ? true : false)
    }
    /**
    submit  selection
    **/
    submitData() {
        this.setState({ submitted: true });
        var authData = JSON.parse(localStorage.getItem('userDetails')) || this.props.logged_userData;
        var myCoditionList = {
            movement_prefs: this.state.movement_prefs
        };
        this.props.updateMovementPrefs(myCoditionList).then(
            response => {
                var tempMovementPrefs = authData.Tags.filter(function (item) {
                    return (item.type !== "movementPrefs")
                })
                var newvalue = {
                    Tags: tempMovementPrefs
                }
                var me = this;

                this.state.movement_prefs.map(function (selectedPrefs) {
                    var selectedMovementPrefs = _.filter(me.state.treatment, function (list) {
                        return list.id == selectedPrefs;
                    });
                    newvalue.Tags.push({
                        userTags: {
                            TagId: selectedMovementPrefs[0].id,
                            userId: authData.id
                        },
                        id: selectedMovementPrefs[0].id,
                        tag: selectedMovementPrefs[0].tag,
                        type: "movementPrefs"
                    })
                })
                this.props.updateUserdataRedex(newvalue);
                this.setState({ shouldBlockNavigation: false, isDirtyModalOpen: false })
                toast.success(response.message);
            },
            error => {
                toast.error(error);
            }
        );
    }
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
            this.shouldBlockNavigation = false;
        } else {
            this.submitData();
        }
        this.setState({ isDirtyModalOpen: false });
    }

    render() {
        return (
            <React.Fragment>
                <Prompt
                    when={this.state.shouldBlockNavigation}
                    message={this.handleBlockedNavigation}
                />
                <div className="step10">
                    <div className="text-new">
                        <p className="font-medium black-txt font-21 m-t-10 member-txt m-b-30">
                            Let us know what types of sessions you are most interested in:
                        </p>
                    </div>
                    <div className="row m-b-20">
                        <div className="font-18 black-txt font-qregular col-12">
                            {this.state.treatment.map((item, key) => {
                                return (
                                    <div key={key} className="row m-b-20">
                                        <span className="font-18 black-txt font-qregular col-6">{item.tag}</span>
                                        <label className="switch m-l-10 pull-right col-1 p-0 radio_slider" htmlFor={"checkbox-" + (item.id)}>
                                            <input type="checkbox" name={"movementPrefs" + item.id} id={"checkbox-" + (item.id)} defaultChecked={this.checkTagvalue(item)} onChange={this.handleCheckboxChange} value={item.id} />
                                            <div className="slider round"></div>
                                        </label>

                                    </div>
                                )
                            })}
                            <div id="register-link" className=" w-100 m-t-50 m-b-20 float-left">
                                <span
                                    onClick={() => this.submitData()}
                                    className="btn btn-purple-inverse font-14 font-medium save-btn text-center"
                                >
                                    Save Changes
                                </span>
                            </div>
                            <ConfirmationPopup
                                title="Want to save changes?"
                                desc="We noticed you have made changes to your movement preference but not saved them. Would you like to save these changes?"
                                yesButton="Cancel changes"
                                noButton="Save changes"
                                isConfirmation={true}
                                is_model_open={this.state.isDirtyModalOpen}
                                closeConfirmationPopup={this.closeConfirmationPopup} />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        step: state.register.step,
        condition_index: state.register.condition_index,
        registerFormvalues: state.register.registerFormValues,
        logged_userData: state.header.logged_userData
    };
};

const mapDispatchToProps = { start_loader, stop_loader, setStep, getTagsBasedOnType, setConditionIndex, updateMovementPrefs, updateUserdataRedex };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MovementPrefsComponent);
