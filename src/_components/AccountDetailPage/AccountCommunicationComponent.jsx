import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
    communicationPreferences,
    updateUserdataRedex,
} from "../../actions";

class AccountCommunicationComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }

    handleCheckboxChange(e) //for twoway binding checkbox
    {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        var newValue = {};
        newValue[name] = value;
        this.props.updateUserdataRedex(newValue);
    }

    onSubmit() {
        this.setState({ submitted: true })
        var postData = {
            permission_newFeatures: this.props.userData.permission_newFeatures,
            permission_research: this.props.userData.permission_research,
            permission_motivation: this.props.userData.permission_motivation,
        }
        this.props.communicationPreferences(postData).then(function (response) {
            var responseData = response.data;
            console.log("response_data", responseData);
            toast.success(response.message);
        }).catch(error => {
            toast.success(error.message);
        });
    }

    render() {
        console.log("userData", this.props.userData)
        return (
            <div className="">
                <p className="font-medium black-txt font-21 m-t-10 member-txt">
                Communication Preferences
                </p>
               
                <div className="justify-content-center align-items-center">
                    <div className=" m-b-20 font-qregular">

                        <p className="font-18 font-qregular"> We are committed to only emailing you about information that you are interested in hearing about. If you would like to be the first to know about new classes, programs or features, motivation and encouragement or research opportunities then please select your preferences below.</p>

                        <p className="font-18 font-book">You can change these at any time.</p>
                        <div>
                            <div className="row m-b-20">
                                <span className="font-18 black-txt font-qregular col-6">
                                    The latest updates, classes & features
                                </span>
                                <label className="switch m-l-10 pull-right col-1 p-0 radio_slider" htmlFor="permission_newFeatures">
                                    <input type="checkbox" name="permission_newFeatures" id="permission_newFeatures" defaultChecked={this.props.userData.permission_newFeatures} onChange={this.handleCheckboxChange} value={this.props.userData.permission_newFeatures} />
                                    <div className="slider round"></div>
                                </label>
                            </div>

                            <div className="row m-b-20">
                                <span className="font-18 black-txt font-qregular col-6">
                                    Research opportunities
                                </span>
                                <label className="switch m-l-10 pull-right col-1 p-0 radio_slider" htmlFor="permission_research">
                                    <input type="checkbox" name="permission_research" id="permission_research" defaultChecked={this.props.userData.permission_research} onChange={this.handleCheckboxChange} value={this.props.userData.permission_research} />
                                    <div className="slider round"></div>
                                </label>
                            </div>

                            <div className="row m-b-20">
                                <span className="font-18 black-txt font-qregular col-6">
                                    Motivation and encouragement
                                </span>
                                <label className="switch m-l-10 pull-right col-1 p-0 radio_slider" htmlFor="permission_motivation">
                                    <input type="checkbox" name="permission_motivation" id="permission_motivation" defaultChecked={this.props.userData.permission_motivation} onChange={this.handleCheckboxChange} value={this.props.userData.permission_motivation} />
                                    <div className="slider round"></div>
                                </label>
                            </div>
                        </div>
                        <div id="register-link" className=" w-100 m-t-10 m-b-20 float-left">
                            <span
                                onClick={() => this.onSubmit()}
                                className="btn btn-purple-inverse font-14 font-medium save-btn text-center"
                            >
                                Save changes
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = {
    communicationPreferences,
    updateUserdataRedex,

};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountCommunicationComponent);
