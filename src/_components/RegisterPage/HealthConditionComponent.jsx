import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import * as constand from "../../constant";
import ReactGA from 'react-ga';
import { setStep, setConditionIndex, checkConditionHasTagCode } from "../../actions";

class HealthConditionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      health_condition: this.props.registerFormvalues.health_condition,
      submitted: false
    };
    this.conditonClassList = [...constand.CONDITION_CLASS_LIST];
    this.updateHealthCondition = this.updateHealthCondition.bind(this);
    this.healconditionSubmit = this.healconditionSubmit.bind(this);
  }
  componentDidMount() {
    this.props.setConditionIndex(0)
  }
  getColorClass() {
    var retrunClass = this.conditonClassList.pop();
    this.conditonClassList.unshift(retrunClass);
    return retrunClass;
  }
  updateHealthCondition(item) {
    var temp = [];
    this.conditonClassList = [...constand.CONDITION_CLASS_LIST];
    if (this.props.registerFormvalues.health_condition) {
      temp = [...this.props.registerFormvalues.health_condition];
      var index = this.props.registerFormvalues.health_condition.findIndex(x => x.id === item.id);
      if (index > -1) {
        temp.splice(index, 1);
        //remove condition professions
        var professionIndex = this.props.registerFormvalues.condition_professions.findIndex(x => x.conditionId === item.id);
        this.props.registerFormvalues.condition_professions.splice(professionIndex, 1)
      } else {
        temp.push(item);
      }
    }
    this.setState({ health_condition: temp });
    this.props.registerFormvalues.health_condition = temp;
    console.log('updateHealthCondition-this.props.registerFormvalues', this.props.registerFormvalues)

  }
  isCheck(item) {
    var flag = false;
    if (this.props.registerFormvalues.health_condition) {
      var index = this.props.registerFormvalues.health_condition.findIndex(x => x.id === item.id);
      if (index > -1) {
        flag = true;
      }
    }
    return flag;
  }
  healconditionSubmit() {
    this.setState({ submitted: true });
    if (this.state.health_condition.length > 0) {
      console.log('this.props.registerFormvalues', this.props.registerFormvalues);
      this.props.registerformUpdate(this.props.registerFormvalues);
      var KR_Cond_temp = [];
      var cond_temp = [];
      KR_Cond_temp = this.props.registerFormvalues.health_condition.filter(function (item) {
        if (item.tag == constand.KR_CONDITION)
          cond_temp = item.id;
        return (item.tag == constand.KR_CONDITION);
      })
      var CF_Cond_temp = [];
      CF_Cond_temp = this.props.registerFormvalues.health_condition.filter(function (item) {
        return (item.tag == constand.CONDITION)
      })
      var AK_Cond_temp = [];
      AK_Cond_temp = this.props.registerFormvalues.health_condition.filter(function (item) {
        return (item.tag == constand.ASTHMA_CONDITION)
      })
      // if (this.props.registerFormvalues.health_condition.length > 1)
      console.log('cond_temp', cond_temp)
      this.props.checkConditionHasTagCode(cond_temp)

      if ((this.props.registerFormvalues.profession === '1' || this.props.registerFormvalues.profession === '2') && (KR_Cond_temp.length > 0 && CF_Cond_temp.length == 0)) {
        console.log('ifnext calssss')
        this.props.setStep(18, 'forward') //comordities
      }
      else {
        console.log('elsenext calssss')
        /* if (AK_Cond_temp.length > 0 && this.props.registerFormvalues.health_condition[this.props.condition_index].tag == constand.ASTHMA_CONDITION) {
        //if (AK_Cond_temp.length > 0) { //asthma kids thn show pilot page
          this.props.setStep(25); 
        } else */
        this.props.nextStep();
      }
      ReactGA.event({
        category: "User Acquisition",
        action: "Sign up process",
        label: "Condition"
      })
    }
  }
  previousStep() {
    this.props.prevStep()
    /*  if (this.props.registerFormvalues.profession === '2' || this.props.registerFormvalues.profession === '3') {
     } else {
       this.props.gotoStep(7)
     } */
  }
  dynamicTitle() {
    var returnTitle = "Which Beam service(s) would you like to sign up for?";
    /* if (this.props.registerFormvalues.profession) {
      switch (parseInt(this.props.registerFormvalues.profession)) {
        case 2:
          returnTitle = "Which health condition does the person your care for have?";
          break;
        case 3:
          returnTitle = "Which health condition do you specialise in?";
          break;
        default:
          break;
      }
    } */
    return returnTitle;
  }
  render() {
    return (
      <div className="step5">
        <h3 className="text-center ">
          <span className="pull-left pointer" onClick={() => this.previousStep()}>
            <img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} />
          </span>
          {this.dynamicTitle()}<Link
            to="/home"
            className="close-register orangefont"
          >
            X
          </Link>
        </h3>
        <div className="row justify-content-center align-items-center">
          <div className="input_section col-md-8 m-t-20">
            <div className="form-group row">
              <p className="col-md-12 font-qmedium"> Beam offers exercise, education and support for lots of different health conditions and stages of life where you might need more specialist support.  Please select the Beam service(s) you are interested in signing up for today…</p>
              {this.props.healthcondition_list.map((item, key) => {
                return (
                  <span className="col-md-6" key={key}>
                    <button onClick={() => this.updateHealthCondition(item)} className={"capitalize_text con-btn position-relative float-left font-semibold font-15 m-b-10 " + this.getColorClass()} >{item.tag} {(this.isCheck(item)) && <img src={constand.WEB_IMAGES + "tick.png"} alt="" />}
                    </button>

                  </span>)
              })}
              {(this.state.submitted && this.state.health_condition.length === 0) && <p className="text-danger col-md-12">Select atleast one</p>}
            </div>
            <div id="register-link" className=" w-100 m-t-80 m-b-20 float-left">
              <span onClick={this.healconditionSubmit} className="bluebtn float-left font-medium font-14 w-100 text-center pointer">Next</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { };

const mapStateToProps = state => {
  return {
    healthcondition_list: state.register.healthcondition_list
  };
};

const mapDispatchToProps = { setStep, setConditionIndex, checkConditionHasTagCode };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HealthConditionComponent);
