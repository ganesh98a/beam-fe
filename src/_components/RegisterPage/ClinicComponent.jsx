import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import { getClinic, start_loader, stop_loader, innerGoState, setStep, setConditionIndex, setPageTitle, updateUserConditions } from "../../actions";
import AnimateLoaderComponent from "../../_layoutComponents/AnimateLoaderComponent";
import * as constand from "../../constant";
import ReactGA from 'react-ga';
import _ from 'lodash';
import { commonService } from "../../_services";

class ClinicComponent extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.registerFormvalues.health_condition.length === 0) {
      this.state = {
        selected_clinic: 0,
        clinic_status: this.props.registerFormvalues.clinic_status,
        submitted: false,
        current_index: 0,
        loader: false,
        selected_type_clinic: this.props.registerFormvalues.selected_type_clinic,
      };
      if (this.props.clinic_direction === 'backward') {
        this.props.prevStep();
      } else {
        this.props.nextStep();
      }
    } else {
      this.state = {
        loader: false,
        clinic_status: this.props.registerFormvalues.clinic_status,
        submitted: false,
        /* current_index:
          this.props.clinic_direction === "backward"
            ? this.props.registerFormvalues.health_condition.length - 1
            : 0 */
        current_index: this.props.condition_index
      };

      this.selected_condition_list = this.props.registerFormvalues.health_condition[
        this.props.condition_index
      ];
    }
    this.updateClinicstatus = this.updateClinicstatus.bind(this);
    this.clinicalSubmit = this.clinicalSubmit.bind(this);
    this.localPrev = this.localPrev.bind(this);
    this.getClinic = this.getClinic.bind(this);
    this.returnCurrentClinic = this.returnCurrentClinic.bind(this);
    this.checkKR = this.checkKR.bind(this);
    this.handleChangeClinicType = this.handleChangeClinicType.bind(this);
    this.handleClinicName = this.handleClinicName.bind(this);
    this.handleChangeOtherClinic = this.handleChangeOtherClinic.bind(this);
  }
  componentDidMount() {
    console.log('this.state.current_index', this.state.current_index)
    if (this.props.registerFormvalues.health_condition.length) {
      this.getClinic(this.state.current_index);
    }
  }
  checkKR(condParam) {
    var KR_Cond_temp = [];
    KR_Cond_temp = this.props.registerFormvalues.health_condition.filter(function (item) {
      console.log('condParam', condParam)
      console.log('item.tag', item.tag)
      return (item.tag == condParam)
    })
    console.log('KR_Cond_temp', KR_Cond_temp)
    return KR_Cond_temp
  }
  returnCurrentClinic() {
    var health_conditionId = this.props.registerFormvalues.health_condition[
      this.state.current_index
    ].id;
    var test_CC = this.props.registerFormvalues.conditional_clinic.filter((e) => parseInt(e.conditionId) === parseInt(health_conditionId)).map((value, index) => {
      return (
        value.clinicId
      );
    });
    if (test_CC.length > 0) {
      this.setState({ selected_clinic: test_CC[0] });
    } else {
      this.setState({ selected_clinic: '' });
    }
  }
  updateClinicstatus(e) { //for updateClinicstatus update
    this.setState({ clinic_status: e.target.value, selected_clinic: e.target.value });
    this.props.registerFormvalues.clinic_status = e.target.value;
    this.props.registerFormvalues.other_clinic = this.state.other_clinic;
    var health_conditionId = this.props.registerFormvalues.health_condition[
      this.state.current_index
    ].id;
    var test_CC = this.props.registerFormvalues.conditional_clinic.filter((e) => e.conditionId === health_conditionId).map((value, index) => {
      return (
        index
      );
    });
    if (test_CC.length > 0) {
      var createObject = { conditionId: health_conditionId, clinicId: e.target.value };
      this.props.registerFormvalues.conditional_clinic[test_CC[0]] = createObject;
    } else {
      var createObject = { conditionId: health_conditionId, clinicId: e.target.value };
      this.props.registerFormvalues.conditional_clinic.push(createObject);
    }

    var condition_professions = _.find(this.props.registerFormvalues.condition_professions, { 'conditionId': health_conditionId });
    condition_professions.clinicId = e.target.value;

  }
  handleChangeClinicType(e) {
    this.setState({
      selected_type_clinic: e.target.value,
      clinicName: '',
      selected_clinic: ''
    });
    var health_conditionId = this.props.registerFormvalues.health_condition[
      this.state.current_index
    ].id;
    var condition_professions = _.find(this.props.registerFormvalues.condition_professions, { 'conditionId': health_conditionId });
    condition_professions.clinicId = '';
    condition_professions.clinicName = '';
  }
  handleClinicName(e) {
    this.setState({
      clinicName: e.target.value
    });
    var health_conditionId = this.props.registerFormvalues.health_condition[
      this.state.current_index
    ].id;
    var condition_professions = _.find(this.props.registerFormvalues.condition_professions, { 'conditionId': health_conditionId });
    condition_professions.clinicName = e.target.value;
  }

  handleChangeOtherClinic(e){
      if(e.target.value !==undefined){
        this.setState({ other_clinic:e.target.value });
      } 
  }
  localPrev() { 
    this.props.innerGoState('backword');
    if (this.state.current_index === 0) {
      this.props.prevStep();
    } else {
      this.setState({ current_index: this.state.current_index - 1 });
      this.getClinic(this.state.current_index - 1);
    }
  }
  getClinic(condition_id) {
    console.log('getclinics', this.props)
    var pc_cond = this.checkKR(constand.CANCER_CONDITION);

    var countryId = this.props.registerFormvalues.country;
    var health_conditionId = this.props.registerFormvalues.health_condition[
      condition_id
    ].id;

    var Kr_conditions = this.checkKR(constand.KR_CONDITION);
    var condition_professions;
    if (Kr_conditions.length > 0) {
      condition_professions = _.find(this.props.registerFormvalues.condition_professions, { 'conditionId': Kr_conditions[0].id });
    }

    //this.props.start_loader();
    this.setState({ loader: true, show: false });

    this.props.getClinic(countryId, health_conditionId).then(
      response => {
        console.log('getclincsresponse')
        this.getValueOfClinicType();

        //this.props.stop_loader();
        if ((response.clinics && response.clinics.length > 0) || (pc_cond.length > 0 && this.props.registerFormvalues.health_condition[this.props.condition_index].tag == constand.CANCER_CONDITION)) {
          console.log('returncurrentclinic')
          this.setState({ show: true, loader: false });
          this.returnCurrentClinic();
        } else {

          this.setState({ show: false });
          if (this.props.clinic_direction === 'backward') { //backword
            if (condition_id === 0) {
              this.props.prevStep();
            } else {
              this.setState({ current_index: condition_id - 1 });
              this.getClinic(condition_id - 1);
            }
          } else { //forward
            console.log('**this.state.current_index', this.state.current_index)
            console.log('**condition_id', condition_id)
            console.log('**health_condition=', this.props.registerFormvalues.health_condition)
            console.log('**health_condition-tag=', this.props.registerFormvalues.health_condition[this.state.current_index].tag)
            if (
              condition_id <
              this.props.registerFormvalues.health_condition.length - 1 && (condition_id !== this.props.registerFormvalues.health_condition.length - 1)
            ) {
              if ((condition_professions && (condition_professions.conditionRelationship === constand.Resgister_condition_relationship[1] || condition_professions.conditionRelationship === constand.Resgister_condition_relationship[2])) && this.checkKR(constand.KR_CONDITION).length > 0 && this.props.registerFormvalues.health_condition[this.state.current_index].tag == constand.KR_CONDITION) {
                console.log('if-elseif-submit-18')
                this.props.setStep(18, 'forward')
              }
              else if (pc_cond.length > 0 && this.props.registerFormvalues.health_condition[this.state.current_index].tag == constand.CANCER_CONDITION) {
                console.log('if-elseif-submit')
                this.props.setStep(20, 'forward')
              } else {
                this.props.setConditionIndex(this.state.current_index + 1)
                this.props.setStep(11, 'forward') //healthcondi
              }
              /* this.setState({ current_index: condition_id + 1 });
              this.getClinic(condition_id + 1); */
              console.log('8thstep')
            } else {
              this.props.registerformUpdate(this.props.registerFormvalues);
              console.log('8thstep-else')
              //onboarding
              if ((condition_professions && (condition_professions.conditionRelationship === constand.Resgister_condition_relationship[1] || condition_professions.conditionRelationship === constand.Resgister_condition_relationship[2])) && this.checkKR(constand.KR_CONDITION).length > 0 && this.props.registerFormvalues.health_condition[this.state.current_index].tag == constand.KR_CONDITION) {
                console.log('if-elseif-submit-18-elsess')
                this.props.setStep(18, 'forward')
              }
              else if (pc_cond.length > 0 && this.props.registerFormvalues.health_condition[this.state.current_index].tag == constand.CANCER_CONDITION) {
                console.log('if-elseif-submit')
                this.props.setStep(20, 'forward')
              }
              else {
                console.log('forward-next')
                if (this.props.pageFrom == 'mycondition') {
                  //myconditions
                  if (this.props.isUpdateMyConditions) {
                    //update user tags while editing the conditions
                    this.props.updateUserTags()
                  }
                  else
                    this.props.setStep(23, 'forward')
                  //this.props.submitCondition(this.props.registerFormvalues.health_condition[0])
                } else
                  this.props.nextStep();
              }
              //}
            }
          }
        }
      },
      error => {
        this.getValueOfClinicType();

        this.props.stop_loader();
        toast.error(error);
      }
    );
  }
  clinicalSubmit() {
    this.props.registerFormvalues.other_clinic = this.state.other_clinic;
    var kd_cond = this.checkKR(constand.KR_CONDITION);
    var pc_cond = this.checkKR(constand.CANCER_CONDITION);
    console.log('clinical-submit', this.props.registerFormvalues)

    this.props.registerFormvalues.is_clinic_found = true;
    this.props.innerGoState('forward');

    if (
      this.state.current_index <
      this.props.registerFormvalues.health_condition.length - 1
    ) {
      /*  this.setState({ current_index: this.state.current_index + 1 });
       this.getClinic(this.state.current_index + 1); */
      console.log('8th step move')

      if ((this.props.registerFormvalues.profession === '1' || this.props.registerFormvalues.profession === '2') && kd_cond.length > 0 && this.props.registerFormvalues.health_condition[this.state.current_index].tag == constand.KR_CONDITION) {
        console.log('if-submit-kidney')
        this.props.setStep(18, 'forward')
        //} else if (this.props.registerFormvalues.country == constand.ukCountry && pc_cond.length > 0) {
      } else if (pc_cond.length > 0 && this.props.registerFormvalues.health_condition[this.state.current_index].tag == constand.CANCER_CONDITION) {
        console.log('else-if-cancer')
        this.props.setStep(20, 'forward')
      } else {
        this.props.setConditionIndex(this.state.current_index + 1)
        this.props.setStep(11, 'forward') //profession
      }

    } else {
      this.props.registerformUpdate(this.props.registerFormvalues);
      if ((this.props.registerFormvalues.profession === '1' || this.props.registerFormvalues.profession === '2') && kd_cond.length > 0 && this.props.registerFormvalues.health_condition[this.state.current_index].tag == constand.KR_CONDITION) {
        console.log('if-submit-kidney')
        this.props.setStep(18, 'forward')
        //} else if (this.props.registerFormvalues.country == constand.ukCountry && pc_cond.length > 0) {
      } else if (pc_cond.length > 0 && this.props.registerFormvalues.health_condition[this.state.current_index].tag == constand.CANCER_CONDITION) {
        console.log('else-if-cancer')
        this.props.setStep(20, 'forward')
      }
      else {
        console.log('ELSE-submit')
        if (this.props.pageFrom == 'mycondition') {
          if (this.props.isUpdateMyConditions) {
            //update user tags while editing the conditions
            this.props.updateUserTags()
          }
          else
            this.props.setStep(23, 'forward')
          //this.props.submitCondition(this.props.registerFormvalues.health_condition[0])
        } else
          this.props.nextStep();
      }
      //}
    }
    ReactGA.event({
      category: "User Acquisition",
      action: "Sign up process",
      label: "Clinic"
    })
  }
  getValueOfClinicType = () => {
    if (this.props.registerFormvalues.condition_professions[0].clinicId) {
      if (this.selected_condition_list.tag == constand.CANCER_CONDITION)
        this.setState({ selected_type_clinic: "NHS" })
      this.setState({ clinic_status: this.props.registerFormvalues.condition_professions[0].clinicId })
    }
    else if (this.props.registerFormvalues.condition_professions[0].clinicName) {
      this.setState({ selected_type_clinic: "Private", clinicName: this.props.registerFormvalues.condition_professions[0].clinicName });
    }
  }
  render() {
    const {submitted} = this.state;
    return (
      <div className="step9">
        <div className="text-center w-100">
          {(this.state.loader) && (<AnimateLoaderComponent />)}
        </div>
        {this.state.show && this.props.registerFormvalues.health_condition.map((item, key) => {
          var title = "Are you registered with a " + item.tag + " clinic?";
          var isCancerTag = false;
          if(item.tag === constand.KR_CONDITION){
            title = "Which renal unit are you associated with?"
          }
          if (item.tag == constand.CANCER_CONDITION && !this.state.selected_type_clinic) {
            isCancerTag = true;
            title = "Which " + item.tag + " clinic are you based at?";
          } else if (item.tag == constand.CANCER_CONDITION && this.state.selected_type_clinic) {
            isCancerTag = true;
            title = "Which " + item.tag + " hospital are you based at?";
          }
          this.props.setPageTitle(title)

          return (
            this.state.current_index === key && (
              <React.Fragment key={key}>
                {this.props.pageFrom != 'mycondition' &&
                  <h3 className="text-center ">
                    <a
                      className="pull-left"
                      href="javascript:void(0)"
                      onClick={this.localPrev}
                    >
                      <img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} />
                    </a>
                    {title}
                    <Link
                      to="/home"
                      className="close-register orangefont"
                    >
                      X
                    </Link>
                  </h3>
                }

                <div className="row justify-content-center align-items-center">
                  <div className="input_section col-md-6 m-t-10">
                    <button className={"capitalize_text con-btn position-relative float-left font-semibold font-15 m-b-10 " + commonService.getColor(this.selected_condition_list.tag.replace(' ', '-').toLowerCase())} >{this.selected_condition_list.tag}
                    </button>
                    {/* Normal Clinic*/}
                    {!isCancerTag &&
                      <div className="form-group">
                        <div className="dropdown">
                          <select
                            name="clinic_status"
                            value={this.state.clinic_status}
                            className="form-control"
                            onChange={this.updateClinicstatus}
                          >
                            <option className="pointer">Select clinic</option>
                            {this.props.clinic_list.map((item, key) => {
                              return (
                                <option
                                  className="pointer"
                                  key={"clinic_" + item.id}
                                  value={item.id}
                                >
                                  {item.clinicName}
                                </option>
                              );
                            })}
                          { item.tag === constand.KR_CONDITION && <option className="pointer">Other</option>}
                          </select>

                        </div>
                        {this.state.submitted &&
                          this.props.registerFormvalues.clinic_status === "" && (
                            <p className="help-block">This Field is required</p>
                          )}
                      </div>
                    }
                    {/* kidney other clinic */}
                    {!isCancerTag && this.state.clinic_status === "Other" && 
                    <div className="form-group">
                    <input 
                    type="text" 
                    name="other_clinic" 
                    id="other_clinic" 
                    placeholder="Enter Clinic Name" 
                    className="form-control input-control" 
                    maxLength="160" 
                    value={this.state.other_clinic || ''}
                    required
                    onChange={this.handleChangeOtherClinic}
                    />
                    </div>
                    }
                    {!isCancerTag && item.tag !== constand.KR_CONDITION &&
                      <div className="form-group">
                        <div
                          id="register-link"
                          className=" w-100  m-b-20 float-left"
                        >
                          <a
                            href="javascript:void(0)"
                            onClick={this.clinicalSubmit}
                            className="btn-blue-inverse float-left font-14 font-medium w-100 text-center"
                          >
                            No, I'm not
                          </a>
                        </div>
                      </div>
                    }
                    {/* Cancer clinic */}
                    {isCancerTag &&
                      <div className="form-group">
                        <div className="dropdown">
                          <label htmlFor="country" className="text-label">
                            Type of clinic
                          </label>
                          <select
                            name="selected_type_clinic"
                            value={this.state.selected_type_clinic}
                            className="form-control"
                            onChange={this.handleChangeClinicType}
                          >
                            <option className="pointer">Select one</option>
                            {constand.cancer_clinic_type.map((item, key) => {
                              return (
                                <option
                                  className="pointer"
                                  key={"clinic_type_" + item}
                                  value={item}
                                >
                                  {item}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    }
                    {this.state.selected_type_clinic == "NHS" &&
                      <div className="form-group">
                        <div className="dropdown">
                          <label htmlFor="country" className="text-label">
                            Hospital name
                          </label>
                          <select
                            name="clinic_status"
                            value={this.state.clinic_status}
                            className="form-control"
                            onChange={this.updateClinicstatus}
                          >
                            <option className="pointer">Select clinic</option>
                            {this.props.clinic_list.map((item, key) => {
                              return (
                                <option
                                  className="pointer"
                                  key={"clinic_" + item.id}
                                  value={item.id}
                                >
                                  {item.clinicName}
                                </option>
                              );
                            })}

                          </select>

                        </div>
                        {this.state.submitted &&
                          this.props.registerFormvalues.clinicId === "" && (
                            <p className="help-block">This Field is required</p>
                          )}
                      </div>
                    }
                    {this.state.selected_type_clinic && this.state.selected_type_clinic != "NHS" &&
                      //this.state.selected_type_clinic && this.state.selected_type_clinic != 'NHS' &&
                      <div className="form-group">
                        <div className="dropdown">
                          <label htmlFor="country" className="text-label">
                            Hospital name
                          </label>
                          <input type="text" name="clinicName" id="clinicName" className="form-control input-control" value={this.state.clinicName} onChange={this.handleClinicName} required />
                        </div>
                        {this.state.submitted &&
                          this.state.clinicName === "" && (
                            <p className="help-block">This Field is required</p>
                          )}
                      </div>
                    }
                    <div
                      id="register-link"
                      className=" w-100 m-t-80 m-b-20 float-left"
                    >

                      <a
                        href="javascript:void(0)"
                        onClick={this.clinicalSubmit}
                        className="bluebtn float-left font-medium font-14 w-100 text-center"
                      >
                        {this.props.pageFrom != 'mycondition' &&  item.tag !== constand.KR_CONDITION ? 'Submit' : 'Next'}
                      </a>

                    </div>
                  </div>
                </div>
              </React.Fragment>
            )
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    clinic_list: state.register.clinic_list,
    condition_index: state.register.condition_index,
  };
};

const mapDispatchToProps = { getClinic, start_loader, stop_loader, innerGoState, setStep, setConditionIndex, setPageTitle, updateUserConditions };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClinicComponent);
