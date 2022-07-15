import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import { start_loader, stop_loader, setStep, getTagsBasedOnType, setConditionIndex, setPageTitle, updateUserConditions, checkConditionHasTagCode } from "../../actions";
import * as constand from "../../constant";
import { commonService } from "../../_services";

class KidneyConditionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitted: false,
            current_index: 0,
            loader: false,
            kidney_care_provider: []
        };
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.selected_condition_list = this.props.registerFormvalues.health_condition[
            this.props.condition_index
        ];
    }
    componentDidMount() {
        this.props.getTagsBasedOnType('kidney-care-provider').then(response => {
            console.log('response', response)
            if (response.success) {
                this.setState({ kidney_care_provider: response.data.tags })
            }
        })
        this.props.setPageTitle(`Who provides the care for your or the person you care for's kidney condition?`);

    }
    handleCheckboxChange(e) {
        var item = e.target.value;
        var temp = [];
        if (this.props.registerFormvalues.kidney_care_provider.length > 0) {
            temp = [...this.props.registerFormvalues.kidney_care_provider];
            var index = this.props.registerFormvalues.kidney_care_provider.findIndex(x => x === item);

            if (index > -1) {
                temp.splice(index, 1);
            } else {
                temp.push(item);
            }
        } else {
            temp = [...this.props.registerFormvalues.kidney_care_provider];
            temp.push(item);
        }
        console.log('temp', temp)
        this.props.registerFormvalues.kidney_care_provider = temp;
    }

    /**
    submit  selection
    **/
    submitData() {
        console.log('this.props.condition_index', this.props.condition_index)
        this.setState({ submitted: true });
        console.log('kidney_care_provider', this.props.registerFormvalues.kidney_care_provider);
        var pc_cond = commonService.checkRegisterSpecificCondition(this.props.registerFormvalues.health_condition, constand.CANCER_CONDITION);
        console.log('this.props.registerFormvalues.country == constand.ukCountry', this.props.registerFormvalues.country == constand.ukCountry)
        console.log('pc_cond', pc_cond)
        this.props.checkConditionHasTagCode(this.selected_condition_list.id)

        if (this.props.pageFrom == 'mycondition') {
            //myconditions
            if (this.props.isUpdateMyConditions) {
                this.props.updateUserTags()
            }
            else
                this.props.setStep(14, 'forward')
        }
        else {

            //onboarding
            /* if (this.props.registerFormvalues.country == constand.ukCountry && (pc_cond.length > 0) && this.props.registerFormvalues.health_condition[this.props.condition_index].tag == constand.CANCER_CONDITION) {
                console.log('IFFFFFFFFFFFFFFFFFFFFFF')
                this.props.setStep(20, 'forward')
            } else { */
            if (this.props.condition_index <
                this.props.registerFormvalues.health_condition.length - 1) {
                console.log('IFFFFFFFFFFFFFFFFFFFFFFFFF')
                this.props.setConditionIndex(this.props.condition_index + 1)
                this.props.setStep(11) //profession
            } else {
                console.log('ELSESSSSSSSSSSSSs')
                this.props.setStep(14, 'forward')
            }
        }

    }

    render() {
        let count = constand.kc_provider_id;
        return (

            <div className="step17">
                {this.props.pageFrom != 'mycondition' &&
                    <h3 className="text-center ">
                        <span
                            className="pull-left pointer"
                            onClick={() => this.props.setStep(18, 'backward')}

                        >
                            <img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} />
                        </span>
                        Who provides the care for your or the person you care for's kidney condition?<Link
                            to="/home"
                            className="close-register orangefont"
                        >
                            X
                        </Link>
                    </h3>
                }
                <div className="row justify-content-center align-items-center">
                    <div className="input_section col-md-6 m-t-30">
                        <button className={"capitalize_text con-btn position-relative float-left font-semibold font-15 m-b-10 " + commonService.getColor(this.selected_condition_list.tag.replace(' ', '-').toLowerCase())} >{this.selected_condition_list.tag}
                        </button>
                        {this.state.kidney_care_provider.map((item, key) => {
                            return (
                                <div key={key} className="toggle-btns float-left w-100 m-b-10">
                                    <span className="font-14 font-qregular black-txt">{item.tag}</span>
                                    <label className="switch m-l-10 pull-right" htmlFor={"checkbox-" + (item.id)}>
                                        <input type="checkbox" name="comorbidities" id={"checkbox-" + (item.id)} defaultChecked={parseInt(this.props.registerFormvalues
                                            .kidney_care_provider) === (item.id)}
                                            onChange={this.handleCheckboxChange}
                                            value={item.id} />
                                        <div className="slider round"></div>
                                    </label>
                                    {count++ ? "" : ""}
                                </div>
                            )
                        })}
                        <div id="register-link" className=" w-100 m-t-50 m-b-20 float-left">
                            <span
                                onClick={() => this.submitData()}
                                className="bluebtn float-left w-100 font-medium font-14 text-center pointer"
                            >
                                {this.props.isUpdateMyConditions ? "Save Changes" : "Next"}
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
        condition_index: state.register.condition_index
    };
};

const mapDispatchToProps = { start_loader, stop_loader, setStep, getTagsBasedOnType, setConditionIndex, setPageTitle, updateUserConditions, checkConditionHasTagCode };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(KidneyConditionComponent);
