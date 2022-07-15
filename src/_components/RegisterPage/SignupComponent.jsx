import React from 'react';
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import {  loginModelOpen,facebookLogin, isAuth ,start_loader, stop_loader,assignFacebookValues,fetchUserDetails } from "../../actions";
import * as constand from "../../constant";
//import FacebookLogin from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
class SignupComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.facebookResponse = this.facebookResponse.bind(this);
    }
    componentDidMount() {
    }

    facebookResponse = (e) => {
      console.log('facebookres',e)
        this.props.facebookLogin(e,'register').then(
            response => {//If your already singed up
                console.log(JSON.stringify(response));
                this.closeModel();
                this.getUserDetail();
                return;
            },
            error => {
            }
          );
        this.props.nextStep();
        this.props.assignFacebookValues(e);
    };
    onCloseModal() {}

    getUserDetail() {
        this.props.start_loader();
        this.props.fetchUserDetails().then(
          response => {
            this.props.stop_loader();
            const { from } = { from: { pathname: "/home" } };
            this.props.history.push(from);
            return;
          },
          error => {
            this.props.stop_loader();
            toast.error(error);
          }
        );
    }

    closeModel() //for close the login model
    {
        this.props.loginModelOpen(false);
    }

    render() {
        return (
            <div className="first-section">
                <h3
                className=" text-center"
                id="exampleModalLabel font-medium"
                >
               How would you like to sign up ? <Link
                              to="/home"
                              className="close-register orangefont"
                            >
                              X
                            </Link>
                </h3>
                <div className="row justify-content-center align-items-center"><div className="input_section col-md-6 m-t-30">
                 <div className="form-group">
                  <p className="text-center">
                  {/* <FacebookLogin
                        appId={constand.FACEBOOK_APP_KEY}
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={this.facebookResponse}
                        cssclassName="google btn btn-lg btn-facebook font-semibold font-24 mybtn"
                        icon="fa fa-facebook-square"
                        textButton="Continoue with Facebook"
                        /> */}
                    <FacebookLogin
                        appId={constand.FACEBOOK_APP_KEY}
                        autoLoad={false}
                        disableMobileRedirect={true}
                        fields="first_name,last_name,email,picture"
                        callback={this.facebookResponse}
                        render={renderProps => (
                          <button onClick={renderProps.onClick} className="  btn font-semibold font-24 mybtn btn-facebook"><i className="fa fa-facebook-official" aria-hidden="true"></i><span className="signup-text">Continue with Facebook</span></button>
                        )}
                        />
                  </p>
                  </div>

                <div className="text-center font-18 font-qregular m-t-10 m-b-10 black-txt"><b>or</b></div>

                <div className="form-group">
                  <p className="text-center">
                  <button  onClick={()=>{this.props.nextStep()}}className="  btn font-semibold font-24 mybtn btn-login m-b-30">
                  <i className="fa fa-envelope-o" aria-hidden="true"></i> <span className="signup-text">Signup with email</span>
                  </button>
                  </p>
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

const mapDispatchToProps = { isAuth,facebookLogin,loginModelOpen,assignFacebookValues,fetchUserDetails,start_loader, stop_loader };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignupComponent);
