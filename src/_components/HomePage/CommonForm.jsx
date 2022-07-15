import React from "react";
import { commonService } from "../../_services"
import { toast } from 'react-toastify';

class CommonForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      message: '',
      phone: '',
      submitted: false,
      Loading: false,
      type: props.from
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }
  handleChange(e) //for twoway binding
  {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }
  submitForm() {
    this.setState({ submitted: true });
    if (this.state.firstname && this.state.lastname && this.state.email && this.state.message) {
      this.setState({ Loading: true });
      commonService.sendFeedback(this.state)
        .then(
          response => {
            var resetData = {
              firstname: '',
              lastname: '',
              email: '',
              message: '',
              submitted: false,
              Loading: false
            };
            this.setState(resetData);
            toast.success(response.message);
          },
          error => { this.setState({ Loading: false }); toast.error(error); }
        );
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div class="col-lg-12 col-md-12 col-sm-12 m-b-10">
            <div class="row">
              <label class="control-label font-book label-text col-md-3 col-4 pb-10 pl-0" for="fname">First name*</label>
              <div class="col-md-9 col-8"><input class="form-control new-input-style" name="firstname" type="text" value="" onChange={this.handleChange} value={this.state.firstname} />
              </div>
              {(this.state.submitted && !this.state.firstname) && <p className="text-danger">Firstname required</p>}
            </div>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 m-b-10">
            <div class="row">
              <label class="control-label font-book label-text col-md-3 col-4 pb-10 pl-0" for="fname">Surname*</label>
              <div class="col-md-9 col-8"><input class="form-control new-input-style" name="lastname" type="text" value="" onChange={this.handleChange} value={this.state.lastname} />
              </div>
              {(this.state.submitted && !this.state.lastname) && <p className="text-danger">Surname required</p>}
            </div>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 m-b-10">
            <div class="row">
              <label class="control-label font-book label-text col-md-3 col-4 pb-10 pl-0" for="fname">Email address*</label>
              <div class="col-md-9 col-8"><input class="form-control new-input-style" name="email" type="text" value="" onChange={this.handleChange} value={this.state.email} />
              </div>
              {(this.state.submitted && !this.state.email) && <p className="text-danger">Email required</p>}
            </div>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 m-b-10">
            <div class="row">
              <label class="control-label font-book label-text col-md-3 col-4 pb-10 pl-0" for="fname">Phone number</label>
              <div class="col-md-9 col-8"><input class="form-control new-input-style" name="phone" type="text" value="" onChange={this.handleChange} value={this.state.phone} />
              </div>
            </div>
          </div>

        </div>

        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 m-b-10 p-l-0">
            <label
              className="control-label font-book label-text col-sm-12 pb-10 pl-0"
              htmlFor="fname"
            >
              What can we help you with?*
            </label>
            <textarea
              className="form-control input-control textarea-message"
              placeholder=""
              rows="8"
              name="message"
              onChange={this.handleChange} value={this.state.message}
            ></textarea>
            {(this.state.submitted && !this.state.message) && <p className="text-danger">Message required</p>}
          </div>
        </div>
        
        <div className="row header-custom">
          <div className="navbar-text ml-auto mr-auto m-t-10 col-md-4">
            <button disabled={this.state.Loading} onClick={this.submitForm}
              className="btn btn-purple font-14 font-medium w-100 p-t-10 p-b-10"
            >
              Submit
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CommonForm;
