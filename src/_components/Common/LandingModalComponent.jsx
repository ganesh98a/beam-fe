import React from "react";
import { connect } from "react-redux";
import Modal from "react-responsive-modal";
import { Cookies } from "react-cookie-consent";
import { Link } from "react-router-dom";

import * as constand from "../../constant";
import { setNewUser } from "../../actions";

class LandingModalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRead: false
        };
        this.conditonClassList = [...constand.CONDITION_CLASS_LIST];
        this.returnClass = this.conditonClassList.reverse();

    }
    getColorClass(key) {
        if (this.returnClass.length > 0)
            return this.returnClass[key];
    }
    onCloseModal() { }
    conditionHasHomePage = () => {
        return constand.HOME_PAGE.includes(this.props.condition);
    }
    render() {
        var currentCondition = Cookies.get('condition')
        console.log('currentCondition', currentCondition)
        return (
            <Modal
                className="removebbg-popup "
                open={this.props.isModalOpen}
                onClose={this.onCloseModal}
                center
            >
                <div className="modal-dialog welcome-popup-lg m-t-80"
                    role="document"
                >
                        <div className="modal-content bg-transparent border-0">
                            {/* <div className="modal-header header-styling  border-0">
                                <h5
                                    className="modal-title1 text-center col-md-12 p-0  font-semibold white-txt"
                                    id="exampleModalLabel font-medium"
                                >
                                    Welcome to Beam!
                                </h5>

                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span
                                        aria-hidden="true"
                                        onClick={() => this.maintance_model_state(false)}
                                    >
                                        &times;
                                    </span>
                                </button>
                            </div> */}
                            <div className="modal-body pb-0 pt-0 bg-darkblue-with-border each_programs_height">                            
                                <button
                                    type="button"
                                    className="big-white-close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => this.props.setNewUser(false)}
                                >&times;</button>
                                <div className="col-md-12 p-0">
                                    <div className="row">
                                        <div className="position-relative w-100">
                                            <h5 className="text-center col-md-12 p-0 font-semibold white-txt fontsize-36 letter-spacing003 mt-5 mb-4 mob_wid" id="exampleModalLabel font-medium">Welcome to Beam!</h5>
                                            <p className="mb-4 text-center col-md-12 p-0 white-txt fontsize-24 letter-spacing001">We’re so pleased to have you here!</p>
                                            <p className="mb-4 text-center col-md-12 p-0 font-semibold white-txt fontsize-24 letter-spacing001 mob_wid">Can we help you find what you’re looking for?</p>
                                            <span className="dollimg_rightside"><img src={constand.WEB_IMAGES+"Asset-4.png"} className="img-fluid" alt="" /></span>
                                        </div>
                                        <div className="row mx-auto justify-content-center">
                                        {this.props.module_data.program > 0 &&
                                            <div className="col-md-4 col-lg-4 col-12 pr-0 mb-3">
                                                <div className="text-left card p-3 border-0 bg-yellow d-flex h-100 bg-transparent">
                                                    <div className="card-body p-0">
                                                        <h4 className="font-semibold fontsz-24 ash-txt letter-spacing001 mb-3">Programs</h4>
                                                        <p className="font-qregular fontsize-18 ash-txt letter-spacing001">Check out our different programs curated for specific health needs.</p>
                                                    </div>
                                                    <div className="card-footer bg-transparent p-0 border-0 text-center">
                                                        <Link to={"/programs/" + this.props.condition}
                                                        onClick={() => { this.props.setNewUser(false) }}
                                                        className="btn btn-darkblue-inverse">Go to programs</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        } 
                                        {this.props.module_data.liveclass > 0 &&
                                            <div className="col-md-4 col-lg-4 col-12 pr-0 mb-3">
                                                <div className="text-left card p-3 bg-orange1 border-0 d-flex h-100 bg-transparent">
                                                    <div className="card-body p-0">
                                                        <h4 className="font-semibold fontsz-24 white-txt letter-spacing001 mb-3">Live class schedule</h4>
                                                        <p className="font-qregular fontsize-18 white-txt letter-spacing001">Take part in our interactive live classes where you can connect with our instructors and other Beam Members.</p>
                                                    </div>
                                                    <div className="card-footer bg-transparent p-0 border-0 text-center">
                                                        <Link to={"/liveClasses/" + this.props.condition}
                                                        onClick={() => { this.props.setNewUser(false) }}
                                                        className="btn btn-darkblue-inverse">Go to live classes</Link>
                                                        {/* <button className="btn btn-darkblue-inverse">Go to live classes</button> */}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {this.props.module_data.ondemand > 0 &&
                                            <div className="col-md-4 col-lg-4 col-12 pr-0 mb-3">
                                                <div className="text-left bg-purple card p-3 border-0 d-flex h-100 bg-transparent">
                                                    <div className="card-body p-0">
                                                        <h4 className="font-semibold fontsz-24 white-txt letter-spacing001 mb-3">On-demand library</h4>
                                                        <p className="font-qregular fontsize-18 white-txt letter-spacing001">Why not browse our selection of exercise, education and well-being sessions for you to do anytime, anywhere.</p>
                                                    </div>
                                                    <div className="card-footer bg-transparent p-0 border-0 text-center">
                                                        <Link to={"/on-demand/" + this.props.condition}
                                                        onClick={() => { this.props.setNewUser(false) }}
                                                        className="btn btn-darkblue-inverse">Go to on-demand</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        } 
                                    </div>
                                    {this.conditionHasHomePage() &&
                                        <div className="row m-0 w-100 my-5 text-center">
                                            <Link to={"/" + this.props.condition}
                                                onClick={() => { this.props.setNewUser(false) }}
                                                className="yellow-button mx-auto"
                                            >Go to homepage</Link>
                                        </div>
                                    } 
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
        module_data: state.header.module_data,
    };
};
const mapDispatchToProps = {
    setNewUser
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LandingModalComponent);