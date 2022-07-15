import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import { start_loader, stop_loader, setStep, getTagsBasedOnType, setPageTitle } from "../../actions";
import * as constand from "../../constant";
import { commonService } from "../../_services";

class CancerTreatment extends React.Component {
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
        this.props.getTagsBasedOnType('pc-treatment').then(response => {
            console.log('response', response)
            if (response.success) {
                this.setState({ treatment: response.data.tags })
            }
        })
        this.props.setPageTitle('Which treatment are you currently receiving for prostate cancer?')
    }
    backTo() {
        /*  if (this.props.registerFormvalues.is_clinic_found)
             this.props.setStep(10, 'backward')
         else */
        this.props.setStep(7, 'backward')
    }
    handleCheckboxChange(e) {
        var item = e.target.value;
        var temp = [];
        if (this.props.registerFormvalues.cancer_treatment.length > 0) {
            temp = [...this.props.registerFormvalues.cancer_treatment];
            var index = this.props.registerFormvalues.cancer_treatment.findIndex(x => x === item);

            if (index > -1) {
                temp.splice(index, 1);
            } else {
                temp.push(item);
            }
        } else {
            temp = [...this.props.registerFormvalues.cancer_treatment];
            temp.push(item);
        }
        this.props.registerFormvalues.cancer_treatment = temp;
    }
    /**
    submit  selection
    **/
    submitData() {
        this.setState({ submitted: true });
        console.log('comorbidities', this.props.registerFormvalues.cancer_treatment)
        this.props.setStep(21, 'forward')
    }

    render() {
        console.log('this.props.registerFormvalues.cancer_treatment',this.props.registerFormvalues.cancer_treatment)
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
                        Which treatment are you currently receiving for prostate cancer?
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
                                        <input type="checkbox" name={"comorbidities" + item.id} id={"checkbox-" + (item.id)} defaultChecked={(this.props.registerFormvalues.cancer_treatment.findIndex(x => parseInt(x) === (item.id))!=-1 ? true : false)} onChange={this.handleCheckboxChange} value={item.id} />
                                        <div className="slider round"></div>
                                    </label>

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

const mapDispatchToProps = { start_loader, stop_loader, setStep, getTagsBasedOnType, setPageTitle };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CancerTreatment);
