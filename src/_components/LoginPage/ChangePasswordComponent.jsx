import React from "react";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import HomePage from '../HomePage/HomePage';
import * as constand from "../../constant";
import {
  start_loader,
  stop_loader,
  resetPassword,
  checkResetToken
} from "../../actions";
import { toast } from "react-toastify";

class ChangePasswordComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        modelOpen : true,
        loading : false,
        password : '',
        confirm_password : '',
        submitted : false,
        error_msg : null,
        userId : null
    };

    this.handleChange = this.handleChange.bind(this);
    this.cleatState = this.cleatState.bind(this);
    this.closeModel = this.closeModel.bind(this);
    this.strongPasswordValidation = this.strongPasswordValidation.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  componentDidMount(){
    this.props.checkResetToken(this.props.match.params.token).then(
        response => {
            if(response.data && response.data.id)
            {
                this.setState({userId: response.data.id});
            }
        },
        error => {
            this.redirectHome();
            toast.error(error);
        }
      );
  }

  handleChange(
    e //for twoway binding
  ) {
    const { name, value } = e.target;
    this.setState({ [name]: value }, function(){this.strongPasswordValidation()});
  }

  cleatState() {
    this.setState({
        modelOpen : true,
        loading : false,
        password : '',
        confirm_password : '',
        submitted : false,
        error_msg : null,
        userId : null
    });
  }

  strongPasswordValidation()
    {
      let password = this.state.password;
      if(password !== "" && password === this.state.confirm_password) {
        if(password && password.length < 8) {
            this.setState({ error_msg: "Password must contain at least eight characters",password_error: true});
            return;
        }
        var number_regx = /[0-9]/;
        if(!number_regx.test(password)) {
            this.setState({ error_msg: "Password must contain at least one number (0-9)",password_error: true});
            return;
        }
        var lowercase_regx = /[a-z]/;
        if(!lowercase_regx.test(password)) {
            this.setState({ error_msg: "password must contain at least one lowercase letter (a-z)",password_error: true});
            return;
        }
        var uppercase_regx = /[A-Z]/;
        if(!uppercase_regx.test(password)) {
            this.setState({ error_msg: "password must contain at least one uppercase letter (A-Z)",password_error: true});
            return;
        }
        this.setState({ error_msg:null,password_error: false });
        return;
      } else {
        if(!password && !this.state.confirm_password)
        {
            this.setState({ error_msg: "Password cannot blank",password_error: true });
        }else{
            this.setState({ error_msg: "Please check that you've entered and confirmed your password",password_error: true });
        }
        return;
      }
    }

  onCloseModal() {}

  closeModel() {
      this.setState({modelOpen:false}, function() {this.redirectHome()});
  }

  redirectHome() {
    const { from } = { from: { pathname: "/home" } };
    this.props.history.push(from);
  }

  changePassword() {
    this.setState({ submitted: true });
    this.strongPasswordValidation();
    if(this.state.password && this.state.confirm_password && !this.state.password_error)
    {
        let dataObj = {id: this.state.userId, password: this.state.password};
        this.props.resetPassword(dataObj).then(
            response => {
                this.redirectHome();
                toast.success(response.message);
            },
            error => {
                this.redirectHome();
                toast.error(error);
            }
          );
    }
  }


  render() {
    return (
      <React.Fragment>
        <HomePage />
          
        <Modal
          className="removebbg-popup"
          open={this.state.modelOpen}
          onClose={this.onCloseModal}
          center
        >
          <div className="modal-dialog modal-width--custom" role="document">
            <div className="modal-content">
              <div className="modal-header header-styling  border-0">
                <h5
                  className="modal-title text-center col-md-11 p-0 font-semibold"
                  id="exampleModalLabel font-medium"
                >
                  Change Password
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true" onClick={this.closeModel}>
                    &times;
                  </span>
                </button>
              </div>
              <div className="modal-body body-padding--value pb-0">
                <form name="login">
                  <div className="form-group">
                    <label
                      htmlFor="password"
                      className="font-14 font-qregular black-txt"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      aria-describedby="emailHelp"
                      placeholder=""
                      name="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="confirm_password"
                      className="font-14 font-qregular black-txt"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirm_password"
                      className="form-control"
                      aria-describedby="emailHelp"
                      placeholder=""
                      name="confirm_password"
                      value={this.state.confirm_password}
                      onChange={this.handleChange}
                    />
                    {this.state.submitted && this.state.error_msg && <p className="text-danger">{this.state.error_msg}</p>}
                  </div>
                  <div className="text-center form-group">
                    {this.state.error && <span className="text-danger">{this.state.error}</span>}
                  </div>
                  <div className="col-md-12 text-center p-0 m-b-30">
                    <span
                      onClick={this.changePassword}
                      className={"btn btn-block mybtn btn-login tx-tfm font-book font-14"+((!this.state.loading) ? ' pointer' : '')}
                    >
                      Change Password
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    is_auth : state.auth.is_auth
  };
};

const mapDispatchToProps = {
    start_loader,
    stop_loader,
    resetPassword,
    checkResetToken
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePasswordComponent);
