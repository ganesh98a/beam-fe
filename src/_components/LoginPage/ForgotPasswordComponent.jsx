import React from "react";
import Modal from "react-responsive-modal";
import { connect } from "react-redux";
import HomePage from '../HomePage/HomePage';

import {
  loginModelOpen,
  forgotModelOpen,
  forgotPassword
} from "../../actions";
import { toast } from "react-toastify";

class ForgotPasswordComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modelOpenFromMobile: false,
      email: "",
      email_error: false,
      loading: false,
      submitted: false,
      response_error: '',
      isMobile:false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.resetPasswordSubmit = this.resetPasswordSubmit.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.closeModel = this.closeModel.bind(this);
    this.cleatState = this.cleatState.bind(this);
  }
  componentDidMount() {
    console.log('window.location.pathname',window.location.pathname)
    if (this.props.location.pathname == "/forgotpassword") {
      console.log('true')
      this.props.forgotModelOpen(true);
      this.setState({ isMobile: true })
    }
  }
  renderHome() {
    if (this.state.isMobile && this.props.location.pathname=='/forgotpassword') {
      
      console.log('this.forgot', this.props.location.pathname)

      return (
        <HomePage />
      )
    } else {
      return ('')
    }
  }
  handleChange(e) { //for twoway binding
    const { name, value } = e.target;
    let isvalid_pattern = this.mailPatternCheck(e.target.value);
    this.setState({ email_error: !isvalid_pattern, [name]: value, response_error: '' });
  }

  cleatState() {
    if (this.props.location.pathname == "/forgotpassword") {
      console.log('false')

      this.setState({ isMobile: false })
    }
    this.setState({
      modelOpenFromMobile: false,
      email: "",
      email_error: false,
      loading: false,
      submitted: false,
      response_error: ''
    });
  }

  onCloseModal() { }

  closeModel() { //for close the login model
    this.cleatState();
    this.props.forgotModelOpen(false);
  }

  mailPatternCheck(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.trim());
  }

  resetPasswordSubmit(e) { //for submit login
    e.preventDefault();
    const { email_error } = this.state;
    const email = this.state.email.trim();
    this.setState({ submitted: true });
    // stop here if form is invalid
    if (!(email) || email_error) {
      return;
    }
    this.setState({ loading: true });
    this.props.forgotPassword(email).then(
      response => {
        this.closeModel();
        toast.success(response.message);
      },
      error => {
        //this.closeModel();
        this.setState({ response_error: error, loading: false });
      }
    );
  }

  render() {
    const { submitted, email_error, loading, response_error } = this.state;
    const email = this.state.email.trim();
    return (
      <React.Fragment>
        {this.renderHome()}
        <Modal
          className="removebbg-popup"
          open={this.props.is_model_open}
          onClose={this.onCloseModal}
          center
        >
          <div
            className="modal-dialog  start-popup forgot-pass common_design modal-width--custom"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header header-styling  border-0">
                <h5
                  className="modal-title1 text-center col-md-12 p-0  font-semibold white-txt"
                  id="exampleModalLabel font-medium"
                >
                  It happens to everyone!
                </h5>

                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span
                    aria-hidden="true"
                    onClick={() => this.closeModel()}
                  >
                    &times;
                  </span>
                </button>
              </div>
              <div className="modal-body pb-0">
                <div className="mx-auto w-80">
                  <p className="font-book black-txt text-center font-15 m-t-60 font-normal">
                    Enter your email below and we’ll send you a link where you’ll be able to reset your password…
                </p>
                  <div className="form-group">
                    <label className="font-14 black-txt font-qregular font-normal" htmlFor="exampleInputEmail1">Email</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" name="email" value={email}
                      onChange={this.handleChange} aria-describedby="emailHelp" placeholder="" />
                    <small id="emailHelp" className="form-text text-muted"></small>
                    {submitted && email_error && email && <p className="text-danger">Invalid Email</p>}
                    {submitted && !email && <p className="text-danger">Email Required</p>}
                    {submitted && response_error && <p className="text-danger">{response_error}</p>}
                  </div>
                </div>

                <div className="mx-auto w-80">

                  <button
                    className="btn btn-login popup-btn mx-auto m-t-20 m-b-20" onClick={this.resetPasswordSubmit} disabled={loading}
                  >
                    {" "}
                    Reset my password{" "}
                  </button>
                </div>
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
    is_model_open: state.header.is_forgotModelOpen
  };
};

const mapDispatchToProps = {
  loginModelOpen,
  forgotModelOpen,
  forgotPassword
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPasswordComponent);
