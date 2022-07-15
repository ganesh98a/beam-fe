import React from 'react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
    start_loader,
} from "../../actions";
import { toast } from "react-toastify";
import * as constand from "../../constant";
import ContactForm from "../ContactPage/ContactFormComponent";
import CFPartnerships from './CFPartnerships';
import CancerPartnerships from './CancerPartnerships';
import KidneyPartnerships from './KidneyPartnerships';
import { commonService } from "../../_services";

class WorkwithusComponent extends React.Component {
    constructor(props) {
        super(props);

    }
    componentDidMount() {
        var condition = commonService.replaceChar(this.props.match.params.condition, true).toLowerCase();

        if (condition == constand.POSTNATAL_CONDITION || condition == constand.MENO_CONDITION) {
            // window.location.href = '/home';
            //const { from } = { from: { pathname: '/home'  } };
            //var current_url = '/home/' + condition;
            var current_url = '/on-demand/' + condition;
            if (this.props.module_data.liveclass)
                current_url = '/liveClasses/' + condition;
            const { from } = { from: { pathname: current_url } };
            this.props.history.push(from);
        }
    }
    componentDidUpdate() {
        var condition = commonService.replaceChar(this.props.match.params.condition, true).toLowerCase();

        if (condition == constand.POSTNATAL_CONDITION || condition == constand.MENO_CONDITION || condition == constand.ASTHMA_CONDITION) {
            // window.location.href = '/home';
            const { from } = { from: { pathname: '/home' } };
            this.props.history.push(from);
        }
    }
    render() {
        var condition = commonService.replaceChar(this.props.match.params.condition, true);
        console.log('workwithus-condition', condition)

        return ( 
            <React.Fragment>
                {condition == constand.CONDITION && (
                    <CFPartnerships
                        params={this.props.match.params}
                        history={this.props.history}
                        location={this.props}
                    />
                )}
                {condition == constand.CFY_CONDITION && (
                    <CFPartnerships
                        params={this.props.match.params}
                        history={this.props.history}
                        location={this.props}
                    />
                )}
                {condition == constand.KR_CONDITION && (
                    <KidneyPartnerships
                        params={this.props.match.params}
                        history={this.props.history}
                        location={this.props}
                    />
                )}
                {condition == constand.CANCER_CONDITION && (
                    <CancerPartnerships
                        params={this.props.match.params}
                        history={this.props.history}
                        location={this.props}
                    />
                )}

            </React.Fragment>
        )
    };
}

const mapStateToProps = state => {
    return {
        module_data: state.header.module_data,
    };
};

const mapDispatchToProps = {
    start_loader
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkwithusComponent);