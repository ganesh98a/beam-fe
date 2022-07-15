import React from 'react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
    start_loader,
    getDynamicPage
} from "../../actions";
import { toast } from "react-toastify";
import * as constand from "../../constant";
import ReactPlayer from 'react-player';
import CommonForm from './CommonForm';
import KidneyLandingPage from './KidneyLandingPage';
import CFLandingPage from './CFLandingPage';
import CFYouthLandingPage from './CFYouthLandingPage';
import CancerLandingPage from './CancerLandingPage';
import { commonService } from "../../_services";
import AsthmaLandingPage from './AsthmaLandingPage';
import DynamicPage from '../TeensOnBeam/DynamicPage';
import MapPage from '../TeensOnBeam/MapPage';
import AnimateLoaderComponent from "../../_layoutComponents/AnimateLoaderComponent";
import _ from 'lodash';
var newPath
class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dynamicPageDetails: {},
            Loading: false,
        }
    }

    componentDidMount() {
        this.aliasUrlCondition();
    }
    aliasUrlCondition = () => {
        let url_alias_condition = JSON.parse(localStorage.getItem('url_alias_condition'));
        let urlCondition = this.props.match.params.condition;

        if (url_alias_condition) {
            newPath = _.filter(url_alias_condition, function (val) {
                if (urlCondition in val.value) {
                    return val.value[urlCondition]
                }
            });
            if (newPath && newPath.length > 0) {
                newPath = newPath[0].value[urlCondition]
            }
        }
        if (newPath && newPath.length == 0) {
            this.setState({ Loading: true });
            this.getDynamicPage(urlCondition);
        } else {
            this.redirectHome()
        }
    }

    redirectHome = () => {
        var condition = commonService.replaceChar(this.props.match.params.condition, true);
        if (condition != constand.KR_CONDITION && condition != constand.CONDITION && condition != constand.CANCER_CONDITION && condition != constand.ASTHMA_CONDITION && condition != constand.CFY_CONDITION) {
            const { from } = { from: { pathname: newPath } };
            this.props.history.push(from);
        }
    }

    getDynamicPage = (urlCondition) => {
        this.props.getDynamicPage(urlCondition).then(response => {
            if (response) {
                this.setState({ Loading: false });
                this.setState({ dynamicPageDetails: response.data })
                if (!this.state.dynamicPageDetails.length > 0) {
                    newPath = '/home'
                    this.redirectHome()
                }
            } else {
                this.redirectHome()
            }
        }, error => {
            this.redirectHome()
            console.log(error);
        });
    }

    /* componentDidUpdate() {
        var condition = commonService.replaceChar(this.props.match.params.condition, true);
        if (condition != constand.KR_CONDITION && condition != constand.CONDITION && condition != constand.CANCER_CONDITION && condition != constand.ASTHMA_CONDITION && && condition != constand.CFY_CONDITION && dynamicPageDetails) {
            console.log('Landing-condition', condition)
            const { from } = { from: { pathname: '/home' } };
            this.props.history.push(from);
        }
    } */

    render() {
        let condition = commonService.replaceChar(this.props.match.params.condition, true);

        return (
            <React.Fragment>

                {condition == constand.KR_CONDITION && (
                    <KidneyLandingPage
                        params={this.props.match.params}
                        history={this.props.history}
                        location={this.props}
                    />
                )}
                {condition == constand.CONDITION && (
                    <CFLandingPage
                        params={this.props.match.params}
                        history={this.props.history}
                        location={this.props}
                    />
                )}
                {condition == constand.CFY_CONDITION && (
                    <CFYouthLandingPage
                        params={this.props.match.params}
                        history={this.props.history}
                        location={this.props}
                    />
                )}
                {condition == constand.CANCER_CONDITION && (
                    <CancerLandingPage
                        params={this.props.match.params}
                        history={this.props.history}
                        location={this.props}
                    />
                )}
                {condition == constand.ASTHMA_CONDITION && (
                    <AsthmaLandingPage
                        params={this.props.match.params}
                        history={this.props.history}
                        location={this.props}
                    />
                )}
                {(this.state.dynamicPageDetails && this.state.dynamicPageDetails.length > 0 && this.props.match.params.condition != "map-page") && (
                    <DynamicPage
                        params={this.props.match.params}
                        history={this.props.history}
                        location={this.props}
                    />
                )}
                  {(this.state.dynamicPageDetails && this.state.dynamicPageDetails.length > 0 && this.props.match.params.condition == "map-page") && (
                    <MapPage
                        params={this.props.match.params}
                        history={this.props.history}
                        location={this.props}
                    />
                )}
                <div className="text-center w-100">
                    {(this.state.Loading) && (<AnimateLoaderComponent />)}
                </div>

            </React.Fragment>
        )
    };
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = {
    start_loader, getDynamicPage
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LandingPage);
