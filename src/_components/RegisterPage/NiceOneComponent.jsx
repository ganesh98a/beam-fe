import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserDetails, start_loader, stop_loader, healthCondition } from "../../actions";
import * as constand from "../../constant";
import { ImageTag } from "../../tags";
import { commonService } from "../../_services";
import WorkoutScheduleComponent from "../WorkoutsPage/WorkoutScheduleComponent";
import WorkoutSchedulePopup from "../WorkoutsPage/workoutSchedulePopup";
import { toast } from "react-toastify";

class NiceOneComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {},
            is_postnatal: false
        };
    }
    componentDidMount() {
        this.props.start_loader();
        this.props.fetchUserDetails().then(
            response => {
                //this.props.stop_loader();
                this.getConditions();
            },
            error => {
                this.props.stop_loader();
                toast.error(error);
            }
        );
    }
    getConditions() {
        this.props.start_loader();
        this.props.healthCondition().then(
            response => {
                this.props.stop_loader();
                // var index = this.props.healthcondition_list.findIndex(x => x.tag === 'postnatal');
                // if(index > -1){
                //   this.setState({is_postnatal: true});
                // }else{
                //   this.setState({is_postnatal: false});
                // }
                if (this.props.logged_userData.conditionList && this.props.logged_userData.conditionList.length > 0) {
                    var index = this.props.logged_userData.conditionList.findIndex(x => parseInt(x) === 199);//cystic
                    if (index > -1) {
                        console.log('xxx')
                        this.setState({ is_postnatal: false });
                    } else {
                        var index2 = this.props.logged_userData.conditionList.findIndex(x => parseInt(x) === 200);//postnatal
                        if (index2 > -1) {
                            console.log('pppp')

                            this.setState({ is_postnatal: true });
                        } else {
                            this.setState({ is_postnatal: false });
                        }
                    }
                } else {
                    this.setState({ is_postnatal: false });
                }
                this.props.healthcondition_list.map((item, key) => {
                });
            },
            error => {
                this.props.stop_loader();
                toast.error(error);
            }
        );
    }
    render() {
        var condition = commonService.replaceChar(this.props.condition, false);
        return (
            <div className="registerpage">
                <div id="register">
                    <div className="fadeIn first text-center p-t-10 p-b-15 register_logo">
                        <Link to="/home">
                            <img src={constand.WEB_IMAGES + "logo.png"} id="icon" alt="App Icon" />
                        </Link>
                    </div>
                    <div className="container">
                        <div
                            id="register-row"
                            className="row justify-content-center align-items-center m-t-50"
                        >
                            <div id="register-column" className="col-md-10">
                                <div id="register-box" className="col-md-12">
                                    <div id="register-form" className="form">
                                        <div className="step15">
                                            <h3 className="text-center">Nice one, {commonService.bindUsername(this.props.logged_userData)}! <Link
                                                to="/home"
                                                className="close-register orangefont"
                                            >X</Link>
                                            </h3>
                                            <div className="row justify-content-center align-items-center">
                                                <div className="input_section col-md-8 m-t-10">
                                                    <div className="text-center font-20 font-qmedium">
                                                        <p>
                                                            Hooray!  You have been gifted a FREE Beam membership</p>
                                                        <p>
                                                            until the end of 2021 (12/31/2021) by the </p>
                                                        <p>
                                                            Cystic Fibrosis Foundation!
                                                        </p>
                                                    </div>
                                                    <div class="col-md-12 mt-4 mb-3">
                                                        <div class="row">
                                                            <div className="video-tag1 col-md-6">
                                                                <img src={constand.WEB_IMAGES+"beamlogo_blue.png"} id="icon" className="thanks-img img-fluid" alt="beam logo" />
                                                            </div>
                                                            <div className="video-tag2 col-md-6">
                                                                <img src={constand.WEB_IMAGES+"cff-logo.png"} id="icon" className="thanks-img img-fluid" alt="cff-logo" />
                                                            </div>
                                                        </div></div>


                                                    <div
                                                        id="register-link"
                                                        className=" w-100 m-b-30 float-left"
                                                    >
                                                        <Link
                                                            to={"/on-demand/" + condition}
                                                            className="w-65 mx-auto d-table btn  dblog_btn font-14 button-lightblue position-relative"
                                                        >
                                                            Whoo hoo! Let's get started
                            </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <WorkoutSchedulePopup
                    location={this.props.location}
                    history={this.props.history}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { logged_userData: state.header.logged_userData, healthcondition_list: state.register.healthcondition_list, condition: state.auth.condition };
};

const mapDispatchToProps = { fetchUserDetails, start_loader, stop_loader, healthCondition };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NiceOneComponent);
