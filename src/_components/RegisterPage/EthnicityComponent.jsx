import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import { start_loader, stop_loader, setStep, getOnboardingTags } from "../../actions";
import * as constand from "../../constant";
import ReactGA from 'react-ga';
import _ from 'lodash';

class EthnicityComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitted: false,
            current_index: 0,
            loader: false,
            ethnicity: []
        };
        this.handleChange = this.handleChange.bind(this);

    }
    componentDidMount() {
        var me = this;
        console.log('this.props', this.props)
        this.props.getOnboardingTags().then(response => {
            if (response.success) {
                /* this.props.registerFormvalues.country == constand.usCountry
                this.props.registerFormvalues.country == constand.ukCountry */
                this.setState({ ethnicity: JSON.parse(response.data).ethnicity })
                console.log('me.state.ethnicity', me.state.ethnicity)

                var newArra = _.filter(me.state.ethnicity, function (list) {
                    console.log('getOnboardingTags-list', list)
                    return list.countryId === parseInt(me.props.registerFormvalues.country)
                });
                console.log('getOnboardingTags-newArra', newArra)
                if (newArra.length)
                    this.setState({ ethnicityList: newArra[0].ethnicityList })
            }
        })
    }
    handleChange(e) {
        //for twoway binding
        const { name, value } = e.target;
        this.props.registerFormvalues[name] = value;
    }
    /**
    submit  selection
    **/
    submitData() {
        this.setState({ submitted: true });
        console.log('ethnicity', this.props.registerFormvalues.ethnicity)
        this.props.setStep(10, 'forward');       //healthconditions 
        ReactGA.event({
            category: "User Acquisition",
            action: "Sign up process",
            label: "Ethnicity"
        })
    }
    render() {
        let count = constand.ethnicity_id;
        return (

            <div className="step17">
                <h3 className="text-center ">
                    <span
                        className="pull-left pointer"
                        onClick={() => this.props.setStep(6, 'backward')}

                    >
                        <img className="arrow-img" src={constand.WEB_IMAGES + "arrow-left.png"} />
                    </span>
                    What is your ethnicity?<Link
                        to="/home"
                        className="close-register orangefont"
                    >
                        X
                    </Link>
                </h3>
                <div className="row justify-content-center align-items-center">
                    <div className="input_section col-md-10 m-t-10 row">
                       {/*  <div className="col-md-12"> */}
                            {this.state.ethnicityList && this.state.ethnicityList.length > 0 && this.state.ethnicityList.map((list, key1) => {
                                return (
                                    <div className={ this.state.ethnicityList.length>1 ? ("col-md-5 "+ (key1 % 2 === 0 ? "":"set-offset")):"col-md-12"}>
                                        <p className="text-label">
                                            <b>{list.groupName}</b>
                                        </p>
                                        {list.options.map((item, key) => {

                                            return (
                                                <div key={key1 + "-" + key} className="row radio-section">
                                                    <span className="font-qregular font-14 black-txt col-10">
                                                        {item}
                                                    </span>
                                                    <div className="radio pull-right col-2 text-right">
                                                        <input
                                                            id={"radio-" + key1 + "-" + (key)}
                                                            name="ethnicity"
                                                            value={(item)}
                                                            type="radio"
                                                            /* defaultChecked={
                                                                parseInt(this.props.registerFormvalues
                                                                    .ethnicity) === (count)
                                                            } */
                                                            onChange={this.handleChange}
                                                        />
                                                        <label htmlFor={"radio-" + key1 + "-" + (key)} className="radio-label"></label>
                                                    </div>

                                                </div>
                                            )

                                        })}
                                    </div>
                                )
                            })
                            }
                        {/* </div> */}
                        <div className="col-md-6 set-offset">
                        </div>
                        <div id="register-link" className=" w-100 m-b-20 float-left col-md-12">
                            <span
                                onClick={() => this.submitData()}
                                className="bluebtn float-left w-100 font-medium font-14 text-center pointer col-md-6"
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
    };
};

const mapDispatchToProps = { start_loader, stop_loader, setStep, getOnboardingTags };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EthnicityComponent);
