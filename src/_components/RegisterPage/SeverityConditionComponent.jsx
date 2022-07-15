import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import { start_loader, stop_loader, setStep, getTagsBasedOnType, setConditionIndex, setPageTitle } from "../../actions";
import * as constand from "../../constant";
import { commonService } from "../../_services";

class SeverityConditionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitted: false,
            current_index: 0,
            loader: false,
            treatment: [],
            cf_disease_severity: this.props.registerFormvalues.cf_disease_severity,
        };
        this.backTo = this.backTo.bind(this);
        this.selected_condition_list = this.props.registerFormvalues.health_condition[
            this.props.condition_index
        ];
    }
    componentDidMount() {
        console.log('this,props,.step', this.props);
        this.props.getTagsBasedOnType('cf-disease-severity').then(response => {
            console.log('response', response)
            if (response.success) {
                this.setState({ treatment: response.data.tags })
            }
        })
        this.props.setPageTitle("To help us to give you the best experience on Beam, please select one of the following statements that best describes your health over the past 12 months")
    }
    backTo() {
        /*  if (this.props.registerFormvalues.is_clinic_found)
             this.props.setStep(10, 'backward')
         else */
        this.props.setStep(11, 'backward')
    }

    handleChange = (e) => {
        //for twoway binding
        const { name, value } = e.target;
        this.setState({ cf_disease_severity: value });
        this.props.registerFormvalues[name] = value;
    }
    /**
    submit  selection
    **/
    submitData() {
        this.setState({ submitted: true });
        console.log('cf_disease_severity', this.props.registerFormvalues)
        if (this.props.pageFrom == 'mycondition') {
            //myconditions
            this.props.setStep(27, 'forward')
        } else {
            /* if (this.props.condition_index <
                this.props.registerFormvalues.health_condition.length - 1) {
                console.log('IFFFFFFFFFFFFFFFFFFFFFFFFF')
                this.props.setConditionIndex(this.props.condition_index + 1)
                this.props.setStep(11)
            } else { */
                console.log('ELSESSSSSSSSSSSSs')
                this.props.setStep(27, 'forward')
            //}
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
                        To help us to give you the best experience on Beam, please select one of the following statements that best describes your health over the past 12 months
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
                        <button className={"capitalize_text con-btn position-relative float-left font-semibold font-15 m-b-30 " + commonService.getColor(this.selected_condition_list.tag.replace(' ', '-').toLowerCase())} >{this.selected_condition_list.tag}
                        </button>
                        {this.state.treatment.map((item, key) => {
                            return (
                                <div key={key} className="row radio-section">
                                    <span className="text-label col-10">
                                        {constand.SEVERITY_TAGS[item.tag]}
                                    </span>
                                    <div className="radio pull-right text-right col-2">
                                        <input
                                            id={"radio-" + (key + 1)}
                                            name="cf_disease_severity"
                                            value={item.id}
                                            type="radio"
                                            defaultChecked={
                                                (this.props.registerFormvalues.cf_disease_severity == (item.id))
                                              }
                                            onChange={this.handleChange}
                                        />
                                        <label htmlFor={"radio-" + (key + 1)} className="radio-label"></label>
                                    </div>
                                </div>
                            )
                        })}
                        <div id="register-link" className=" w-100 m-t-50 m-b-20 float-left">
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
        step: state.register.step,
        condition_index: state.register.condition_index
    };
};

const mapDispatchToProps = { start_loader, stop_loader, setStep, getTagsBasedOnType, setConditionIndex, setPageTitle };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SeverityConditionComponent);
