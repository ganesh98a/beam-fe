import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import { start_loader, stop_loader, setStep, getTagsBasedOnType, setConditionIndex, setPageTitle, updateUserConditions } from "../../actions";
import * as constand from "../../constant";
import { commonService } from "../../_services";

class CancerComordities extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitted: false,
            current_index: 0,
            loader: false,
            treatment: []
        };
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.backTo = this.backTo.bind(this);
        this.selected_condition_list = this.props.registerFormvalues.health_condition[
            this.props.condition_index
        ];
    }
    componentDidMount() {
        console.log('this,props,.step', this.props.step);
        this.props.getTagsBasedOnType('pc-comorbidities').then(response => {
            console.log('response', response)
            if (response.success) {
                this.setState({ treatment: response.data.tags })
            }
        })
        this.props.setPageTitle('Are you or the person you care for being actively treated for the following health conditions?')
    }
    backTo() {
        /*  if (this.props.registerFormvalues.is_clinic_found)
             this.props.setStep(10, 'backward')
         else */
        this.props.setStep(20, 'backward')
    }
    handleCheckboxChange(e) {
        var item = e.target.value;
        var temp = [];
        if (this.props.registerFormvalues.cancer_comordities.length > 0) {
            temp = [...this.props.registerFormvalues.cancer_comordities];
            var index = this.props.registerFormvalues.cancer_comordities.findIndex(x => x === item);

            if (index > -1) {
                temp.splice(index, 1);
            } else {
                temp.push(item);
            }
        } else {
            temp = [...this.props.registerFormvalues.cancer_comordities];
            temp.push(item);
        }
        this.props.registerFormvalues.cancer_comordities = temp;
    }
    /**
    submit  selection
    **/
    submitData() {
        this.setState({ submitted: true });
        console.log('comorbidities', this.props.registerFormvalues.cancer_comordities)
        if (this.props.pageFrom == 'mycondition') {
            //myconditions
            if (this.props.isUpdateMyConditions) {
                //update user tags while editing the conditions
                this.props.updateUserTags()
            }
            else
                this.props.setStep(23, 'forward')
        } else {
            if (this.props.condition_index <
                this.props.registerFormvalues.health_condition.length - 1) {
                console.log('IFFFFFFFFFFFFFFFFFFFFFFFFF')
                this.props.setConditionIndex(this.props.condition_index + 1)
                this.props.setStep(11)
            } else {
                console.log('ELSESSSSSSSSSSSSs')
                this.props.setStep(14, 'forward')
            }
        }
    }

    render() {
        return (

            <div className="step10">
                {this.props.pageFrom != 'mycondition' &&
                    <h3 className="text-center ">
                        <span
                            className="pull-left pointer"
                            onClick={() => this.backTo()}

                        >
                            <img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} />
                        </span>
                        Are you or the person you care for being actively treated for the following health conditions?
                        <Link
                            to="/home"
                            className="close-register orangefont"
                        >
                            X
                        </Link>
                    </h3>
                }
                <div className="row justify-content-center align-items-center">
                    <div className="input_section col-md-6 m-t-30 ">
                        <button className={"capitalize_text con-btn position-relative float-left font-semibold font-15 m-b-10 " + commonService.getColor(this.selected_condition_list.tag.replace(' ', '-').toLowerCase())} >{this.selected_condition_list.tag}
                        </button>
                        {this.state.treatment.map((item, key) => {
                            return (
                                <div key={key} className="toggle-btns float-left w-100 m-b-10">
                                    <span className="font-14 font-qregular black-txt">{item.tag}</span>
                                    <label className="switch m-l-10 pull-right" htmlFor={"checkbox-" + (item.id)}>
                                        <input type="checkbox" name={"comorbidities" + item.id} id={"checkbox-" + (item.id)} defaultChecked={(this.props.registerFormvalues.cancer_comordities.findIndex(x => parseInt(x) === item.id) != -1 ? true : false)} onChange={this.handleCheckboxChange} value={item.id} />
                                        <div className="slider round"></div>
                                    </label>

                                </div>
                            )
                        })}
                        {
                            /*  <>
                                 <div id="register-link" className=" w-100 m-t-50 m-b-20 float-left">
                                     <span
                                         onClick={() => this.submitData()}
                                         className="bluebtn float-left w-100 font-medium font-14 text-center pointer"
                                     >
                                         {"Cancel"}
                                     </span>
                                 </div>
                                 <div id="register-link" className=" w-100 m-t-50 m-b-20 float-left">
                                     <span
                                         onClick={() => this.submitData()}
                                         className="bluebtn float-left w-100 font-medium font-14 text-center pointer"
                                     >
                                         {"Save Changes"}
                                     </span>
                                 </div>
                             </>
                             || */
                            <div id="register-link" className=" w-100 m-t-50 m-b-20 float-left">
                                <span
                                    onClick={() => this.submitData()}
                                    className="bluebtn float-left w-100 font-medium font-14 text-center pointer"
                                >
                                    {this.props.isUpdateMyConditions ? "Save Changes" : "Next"}
                                </span>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        step: state.register.step,
        condition_index: state.register.condition_index,
        logged_userData: state.header.logged_userData
    };
};

const mapDispatchToProps = { start_loader, stop_loader, setStep, getTagsBasedOnType, setConditionIndex, setPageTitle, updateUserConditions };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CancerComordities);
