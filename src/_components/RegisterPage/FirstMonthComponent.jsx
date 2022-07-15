import React from 'react';
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import { registerNewUser, start_loader, stop_loader, fetchUserDetails } from "../../actions";
import * as constand from "../../constant";
class FirstMonthComponent extends React.Component {
    constructor(props) {
        super(props);
    }

     /**
    register new user
    **/
    registerUser(){
        this.props.start_loader();
        this.props.registerNewUser(this.props.registerFormvalues).then(
            response => {
                if (response && response.success) {
                    //this.props.gotoStep(constand.AlldoneComponent);
                    const { from } = { from: { pathname: "/register/all_done" } };
                    this.props.history.push(from);
                }
                //this.props.stop_loader();
                this.getUserDetail();
            },
            error => {
             this.props.stop_loader();
                this.setState({
                    Loading: false
                });
                toast.error(error);
            }
        );
    }

    getUserDetail() {
        this.props.start_loader();
        this.props.fetchUserDetails().then(
          response => {
            this.props.stop_loader();
          },
          error => {
            this.props.stop_loader();
            toast.error(error);
          }
        );
    }

    render() {
        return (
            <div className="step13">
                <h3 className="text-center "><a className="pull-left" href="javascript:void(0)" onClick={() => this.props.prevStep()}><img className="arrow-img" src={constand.WEB_IMAGES+"arrow-left.png"} /></a>First month free?<Link
                              to="/home"
                              className="close-register orangefont"
                            >
                              X
                            </Link></h3>
                <div className="row justify-content-center align-items-center">
                    <div className="input_section col-md-6 m-t-20">

                        <p className="text-label text-center mb-5 font-weight-bold">Here's the deal...</p>
                        <p className="text-label text-center">Access to library of condition specific on-demand excercise videos</p>
                        <p className="text-label text-center border-top border-bottom mt-3 pt-2 pb-2">Access to groups</p>
                        <p className="text-label text-center">Access to 10 live exercise classes per month</p>
                        <p className="text-label text-center m-t-40">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                        <div id="register-link" className=" w-100 m-t-50 m-b-20 float-left">
                            <a href="javascript:void(0)" onClick={()=> this.registerUser() } className="bluebtn float-left w-100 text-center">Submit</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = {
    registerNewUser,start_loader,stop_loader,fetchUserDetails
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FirstMonthComponent);
