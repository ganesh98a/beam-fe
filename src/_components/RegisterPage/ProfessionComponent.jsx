import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import * as constand from "../../constant";
import { setConditionIndex, setPageTitle } from "../../actions";
import _ from 'lodash';
import ReactGA from 'react-ga';

class ProfessionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profession: this.props.registerFormvalues.profession,
      submitted: false,
      profession_localtab: this.props.registerFormvalues.profession_localtab,
    };
    this.handleChange = this.handleChange.bind(this);
    this.registerSubmit_6 = this.registerSubmit_6.bind(this);
    this.goBack = this.goBack.bind(this);
    this.getColor = this.getColor.bind(this);

    this.health_conditionId = this.props.registerFormvalues.health_condition[
      this.props.condition_index
    ].id;
    this.condition_professions = _.find(this.props.registerFormvalues.condition_professions, { 'conditionId': this.health_conditionId });
    this.selected_condition_list = this.props.registerFormvalues.health_condition[
      this.props.condition_index
    ];
    console.log('this.condition_professions',this.condition_professions)
    console.log('this.this.selected_condition_list',this.selected_condition_list)
  }

  componentDidMount() {
    console.log('this.props.registerFormvalues', this.props.registerFormvalues)
    var AK_Cond_temp = [];
    AK_Cond_temp = this.props.registerFormvalues.health_condition.filter(function (item) {
      return (item.tag == constand.ASTHMA_CONDITION)
    })
    if (AK_Cond_temp.length > 0 && this.props.registerFormvalues.health_condition[this.props.condition_index].tag == constand.ASTHMA_CONDITION && !Object.keys(this.props.registerFormvalues.tagCode).length) {
      this.props.setStep(25)
    }
    this.props.setPageTitle('Are you...');
  }
  getColor(cond) {
    var index = constand.CONDITION_CLASS_LIST.indexOf('cond_' + cond);
    if (index > -1) {
      return constand.CONDITION_CLASS_LIST[index]
    } else {
      return constand.CONDITION_CLASS_LIST[0]
    }
  }
  handleChange(e) {
    //for twoway binding
    const { name, value } = e.target;
    this.setState({ profession: value });
    console.log('handlechange-profession-name', name)
    console.log('handlechange-profession-value', value)
    this.props.registerFormvalues[name] = value;
    console.log('handlechange-profession-valuetotal', this.props.registerFormvalues[name])

  }

  registerSubmit_6() {
    console.log('registerSubmit_6', this.props.registerFormvalues.profession)
    console.log('registerSubmit_6-index', this.props.condition_index)
    this.setState({ submitted: true });

    //this.props.registerFormvalues.profession = this.condition_professions ? constand.Resgister_condition_relationship.indexOf(this.condition_professions.conditionRelationship) + "" : this.props.registerFormvalues.profession;

    switch (this.props.registerFormvalues.profession) {
      case "1":
        if (this.props.registerFormvalues.profession) {
          console.log('case-1')

          this.setState({
            healthcondition_livewith: "",
            midicalcondition_livewith: ""
          });
          this.props.registerFormvalues.healthcondition_livewith = "";
          this.props.registerFormvalues.midicalcondition_livewith = "";
          if (this.selected_condition_list.tag == constand.CONDITION) {
            this.props.gotoStep(28);//Go to severity 
          } else {
            this.props.gotoStep(13);//clinic
          }
          if (this.condition_professions) {
            this.condition_professions.conditionRelationship = constand.Resgister_condition_relationship[parseInt(this.props.registerFormvalues.profession)];
          } else {
            this.props.registerFormvalues.condition_professions.push({
              conditionId: this.health_conditionId,
              conditionRelationship: constand.Resgister_condition_relationship[parseInt(this.props.registerFormvalues.profession)],
              caregiverType: '', profession: '', clinicId: '', patientPopulation: ''
            })
          }
        }
        break;
      case "2":
        console.log('case-2')
        if (this.props.registerFormvalues.healthcondition_livewith) {
          console.log('case-2-in')
          this.setState({ midicalcondition_livewith: "" });
          this.props.registerFormvalues.midicalcondition_livewith = "";
        }
        if (this.condition_professions) {
          this.condition_professions.conditionRelationship = constand.Resgister_condition_relationship[parseInt(this.props.registerFormvalues.profession)];
        } else {
          this.props.registerFormvalues.condition_professions.push({
            conditionId: this.health_conditionId,
            conditionRelationship: constand.Resgister_condition_relationship[parseInt(this.props.registerFormvalues.profession)],
            caregiverType: '',
            profession: '',
            clinicId: '',
            patientPopulation: ''
          })
        }
        this.props.nextStep();
        break;
      case "3":

        if (this.props.registerFormvalues.midicalcondition_livewith) {
          this.setState({ healthcondition_livewith: "" });
          this.props.registerFormvalues.healthcondition_livewith = "";
        }
        if (this.condition_professions) {
          this.condition_professions.conditionRelationship = constand.Resgister_condition_relationship[parseInt(this.props.registerFormvalues.profession)];
        } else {
          this.props.registerFormvalues.condition_professions.push({
            conditionId: this.health_conditionId,
            conditionRelationship: constand.Resgister_condition_relationship[parseInt(this.props.registerFormvalues.profession)],
            caregiverType: '',
            profession: '',
            clinicId: '',
            patientPopulation: ''
          })
        }
        this.props.nextStep();
        break;
      case "4":
        this.setState({
          healthcondition_livewith: "",
          midicalcondition_livewith: ""
        });
        this.props.registerFormvalues.healthcondition_livewith = "";
        this.props.registerFormvalues.midicalcondition_livewith = "";

        this.props.gotoStep(13);//clinic

        if (this.condition_professions) {
          this.condition_professions.conditionRelationship = constand.Resgister_condition_relationship[parseInt(this.props.registerFormvalues.profession)];
        } else {
          this.props.registerFormvalues.condition_professions.push({
            conditionId: this.health_conditionId,
            conditionRelationship: constand.Resgister_condition_relationship[parseInt(this.props.registerFormvalues.profession)],
            caregiverType: '', profession: '', clinicId: '', patientPopulation: ''
          })
        }
        break;
      default:
        break;
    }
    ReactGA.event({
      category: "User Acquisition",
      action: "Sign up process",
      label: "Relationship to condition"
    })
  }
  goBack() {
    if (this.props.registerFormvalues.country == 230)
      this.props.setStep(17, 'backward');
    else
      this.props.prevStep();
  }
  render() {

    console.log('healthcondition_list', this.props.healthcondition_list)
    return (
      <div className="step6">
        {this.props.pageFrom != 'mycondition' &&
          <h3 className="text-center ">
            <span
              className="pull-left pointer"
              onClick={this.goBack}
            >
              <img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} />
            </span>
            Are you...<Link
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
            <div>
              {this.props.conditionRelationshipList.map((item, key) => {
                return (
                  <div key={key} className="row radio-section">
                    <span className="text-label col-10">
                      {item}
                    </span>
                    <div className="radio pull-right text-right col-2">
                      <input
                        id={"radio-" + (key + 1)}
                        name="profession"
                        value={key + 1}
                        type="radio"
                        defaultChecked={
                          (this.condition_professions && this.condition_professions.conditionRelationship === (item))
                        }
                        onChange={this.handleChange}
                      />
                      <label htmlFor={"radio-" + (key + 1)} className="radio-label"></label>
                    </div>
                  </div>

                )
              })
              }
              {this.state.submitted &&
                this.props.registerFormvalues.profession === "" && (
                  <p className="text-danger">This is required</p>
                )}
            </div>
            
              <div id="register-link" className=" w-100 m-t-80 m-b-20 float-left">
                <span
                  onClick={() => this.registerSubmit_6()}
                  className="bluebtn float-left w-100 text-center pointer"
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
    clinic_list: state.register.clinic_list,
    condition_index: state.register.condition_index
  };
};

const mapDispatchToProps = { setConditionIndex, setPageTitle };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfessionComponent);
