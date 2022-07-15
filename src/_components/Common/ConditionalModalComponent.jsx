import React from "react";
import { connect } from "react-redux";
import Modal from "react-responsive-modal";
import { Cookies } from "react-cookie-consent";
import * as constand from "../../constant";

class ConditionalModalComponent extends React.Component {
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

    render() {
        var currentCondition = Cookies.get('condition')
        return (
            <Modal
                className="removebbg-popup"
                open={this.props.isModalOpen}
                onClose={this.onCloseModal}
                center
            >
                <div
                    className="modal-dialog schedule_block welcome-popup common_design modal-width--custom health-condition-popup m-t-80"
                    role="document"
                >
                    <div className="modal-content">
                        <div className="modal-header header-styling  border-0">
                            <h5
                                className="modal-title1 text-center col-md-12 p-0  font-semibold white-txt"
                                id="exampleModalLabel font-medium"
                            >
                                Which health condition would you like to browse?
                            </h5>

                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span
                                    aria-hidden="true"
                                    onClick={() => this.props.closeConditionModal()}
                                >
                                    &times;
                                </span>
                            </button>
                        </div>
                        <div className="modal-body pb-0 pt-0">
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="col-md-12 text-center">
                                        {this.props.healthcondition_list &&
                                            this.props.healthcondition_list.map((item, key) => {
                                                return (

                                                    <button
                                                        className={"text-capitalize btn btn-login w-100  mx-auto  font-14 m-r-20 font-weight-bold " + this.getColorClass(key)}
                                                        onClick={() => this.props.getConditionPopup(this.props.pageUrl, true, item.tag)}
                                                    >
                                                        {item.tag}{" "}
                                                    </button>

                                                )
                                            })}
                                    </div>
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
        healthcondition_list: state.register.healthcondition_list,

    };
};
const mapDispatchToProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConditionalModalComponent);