import React from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import * as constand from "../../constant";
import { getProfessions, cargiverTypes, start_loader, stop_loader, setPageTitle } from "../../actions";
import ReactGA from 'react-ga';
import _ from 'lodash';

class CaregiverComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cargiverTypes: [],
      submitted: false,
      professionLsit: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.getColor = this.getColor.bind(this);
    this.health_conditionId = this.props.registerFormvalues.health_condition[
      this.props.condition_index
    ].id;
    this.condition_professions = _.find(this.props.registerFormvalues.condition_professions, { 'conditionId': this.health_conditionId });
    this.selected_condition_list = this.props.registerFormvalues.health_condition[
      this.props.condition_index
    ];
  }
  componentDidMount() {
    console.log('caregiverdid mount=>', this.condition_professions)
    if ((this.condition_professions && this.condition_professions.conditionRelationship == constand.Resgister_condition_relationship[2]) || this.props.registerFormvalues.profession === "2") {
      this.getCaregiverTypes();
    } else {
      this.professionsList();
    }
    this.props.setPageTitle('Are you...');

  }
  handleChange(e) {
    //for twoway binding
    const { name, value } = e.target;
    this.props.registerFormvalues[name] = value;
  }
  /**
  to get CaregiverTypes
  **/
  getCaregiverTypes() {
    //this.props.start_loader();
    this.props.cargiverTypes().then(
      response => {
        this.setState({
          cargiverTypes: response.relations
        })
        this.props.stop_loader();
      },
      error => {
        this.props.stop_loader();
        toast.error(error);
      }
    );
  }

  /**
 to get
 **/
  professionsList() {
    this.props.getProfessions().then(
      response => {
        this.setState({
          professionLsit: response.relations
        })
        this.props.stop_loader();
      },
      error => {
        this.props.stop_loader();
        toast.error(error);
      }
    );
  }

  /**
  submit  selection
  **/
  submitData() {
    this.setState({ submitted: true });

    this.props.registerFormvalues.profession = this.condition_professions ? constand.Resgister_condition_relationship.indexOf(this.condition_professions.conditionRelationship) + "" : this.props.registerFormvalues.profession;
    //this.props.registerFormvalues.healthcondition_livewith = this.condition_professions ? constand.Resgister_caregiver_type.indexOf(this.condition_professions.caregiverType) + "" : this.props.registerFormvalues.healthcondition_livewith;
    //this.props.registerFormvalues.midicalcondition_livewith = this.condition_professions ? constand.clinician_type.indexOf(this.condition_professions.profession) + "" : this.props.registerFormvalues.midicalcondition_livewith;
    console.log('this.props.registerFormvalues.profession', this.props.registerFormvalues)
    switch (this.props.registerFormvalues.profession) {
      case "2":
        if (this.props.registerFormvalues.healthcondition_livewith) {
          this.setState({ midicalcondition_livewith: "" });
          this.props.registerFormvalues.midicalcondition_livewith = "";
          if (this.condition_professions) {
            this.condition_professions.caregiverType = constand.Resgister_caregiver_type[
              parseInt(this.props.registerFormvalues.healthcondition_livewith)
            ];
            this.condition_professions.conditionRelationship = constand.Resgister_condition_relationship[parseInt(this.props.registerFormvalues.profession)];
            this.condition_professions.profession = '';
          } else {
            this.props.registerFormvalues.condition_professions.push({
              conditionId: this.health_conditionId,
              conditionRelationship: constand.Resgister_condition_relationship[parseInt(this.props.registerFormvalues.profession)],
              caregiverType: constand.Resgister_caregiver_type[
                parseInt(this.props.registerFormvalues.healthcondition_livewith)
              ],
              profession: '',
              clinicId: '', patientPopulation: ''
            })
          }
          this.props.nextStep();
        }

        break;
      case "3":
        if (this.props.registerFormvalues.midicalcondition_livewith) {
          this.setState({ healthcondition_livewith: "" });
          this.props.registerFormvalues.healthcondition_livewith = "";
          if (this.condition_professions) {
            this.condition_professions.profession = constand.clinician_type[parseInt(this.props.registerFormvalues.midicalcondition_livewith)];
            this.condition_professions.conditionRelationship = constand.Resgister_condition_relationship[parseInt(this.props.registerFormvalues.profession)];
            this.condition_professions.caregiverType = ''
          } else {
            this.props.registerFormvalues.condition_professions.push({
              conditionId: this.health_conditionId,
              conditionRelationship: constand.Resgister_condition_relationship[parseInt(this.props.registerFormvalues.profession)],
              caregiverType: '',
              profession: constand.clinician_type[parseInt(this.props.registerFormvalues.midicalcondition_livewith)],
              clinicId: '', patientPopulation: ''
            })
          }
          this.props.nextStep();
        }
        ReactGA.event({
          category: "User Acquisition",
          action: "Sign up process",
          label: "Relationship to condition"
        })
        break;
      default:
        this.setState({
          healthcondition_livewith: "",
          midicalcondition_livewith: ""
        });
        this.props.registerFormvalues.healthcondition_livewith = "";
        this.props.registerFormvalues.midicalcondition_livewith = "";
        this.props.nextStep();
        break;

    }

  }
  getColor(cond) {
    var index = constand.CONDITION_CLASS_LIST.indexOf('cond_' + cond);
    if (index > -1) {
      return constand.CONDITION_CLASS_LIST[index]
    } else {
      return constand.CONDITION_CLASS_LIST[0]
    }
  }
  render() {

    return (

      <div className="step6">
        {this.props.pageFrom != 'mycondition' &&
          <h3 className="text-center ">
            <span
              className="pull-left pointer"
              onClick={this.props.prevStep}
            >
              <img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} />
            </span>
            Are you a...<Link
              to="/home"
              className="close-register orangefont"
            >
              X
            </Link>
          </h3>
        }
        <div className="row justify-content-center align-items-center">
          <div className="input_section col-md-7 m-t-10">
            <button className={"capitalize_text con-btn position-relative float-left font-semibold font-15 m-b-10 " + this.getColor(this.selected_condition_list.tag.replace(' ', '-').toLowerCase())} >{this.selected_condition_list.tag}
            </button>
            <p className="text-label">
              <b>Please select one</b>
            </p>

            {this.props.registerFormvalues.profession === "2" && (
              <div>
                <hr />
                {this.state.cargiverTypes.map((item, key) => {
                  return (
                    <div key={key} className="row radio-section">
                      <span className="font-qregular font-14 black-tx col-10">{item}</span>
                      <div className="radio pull-right col-2 text-right">
                        <input
                          id={"radio-" + (key + 1)}
                          name="healthcondition_livewith"
                          value={(key + 1)}
                          type="radio"
                          defaultChecked={
                            this.condition_professions && (this.condition_professions.caregiverType === (item))
                          }
                          onChange={this.handleChange}
                        />
                        <label htmlFor={"radio-" + (key + 1)} className="radio-label"></label>
                      </div>
                    </div>
                  )
                })}
                {this.state.submitted &&
                  this.condition_professions && this.condition_professions.caregiverType === "" && this.props.registerFormvalues.healthcondition_livewith ===
                  "" && <p className="text-danger">This is required</p>}
              </div>
            )}
            {this.props.registerFormvalues.profession === "3" && (
              <div>
                {this.state.professionLsit.map((item, key) => {
                  return (

                    <div key={key} className="row radio-section">
                      <span className="font-qregular font-14 black-txt col-10">
                        {item}
                      </span>
                      <div className="radio pull-right col-2 text-right">
                        <input
                          id={"radio-" + (key + 1)}
                          name="midicalcondition_livewith"
                          value={(key + 1)}
                          type="radio"
                          defaultChecked={
                            this.condition_professions && (this.condition_professions.profession === (item))
                          }
                          onChange={this.handleChange}
                        />
                        <label htmlFor={"radio-" + (key + 1)} className="radio-label"></label>
                      </div>
                    </div>
                  )
                })}
                {this.state.submitted &&
                  this.condition_professions && this.condition_professions.profession === "" && this.props.registerFormvalues.midicalcondition_livewith ===
                  "" && <p className="text-danger">This is required</p>}
              </div>
            )}


            <div id="register-link" className=" w-100 m-t-80 m-b-20 float-left">
              <span
                onClick={() => this.submitData()}
                className="bluebtn float-left w-100 font-medium font-14 text-center pointer"
              >
                Next
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
    condition_index: state.register.condition_index,

  };
};

const mapDispatchToProps = {
  cargiverTypes, start_loader, stop_loader, getProfessions, setPageTitle
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CaregiverComponent);
