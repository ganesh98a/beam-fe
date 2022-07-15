import React from "react";
import { connect } from "react-redux";
import { Cookies } from "react-cookie-consent";
import { Link } from 'react-router-dom';
import * as constand from "../../constant";
import { commonService } from "../../_services";

class AdminBanner extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {

    }
    renderAdminBanner() {
        var conditionName = commonService.replaceChar(this.props.condition, true);
        conditionName = conditionName.substring(
            conditionName.lastIndexOf(" ") + 1
        ).toLowerCase();
        var banner_img = conditionName.charAt(0).toUpperCase() + conditionName.slice(1) + '_Admin_Banner.png';
        var banner_img_mobile = conditionName.charAt(0).toUpperCase() + conditionName.slice(1) + '_Admin_Banner_mobile.png';
        console.log('banner_img', banner_img)
        return (
            (this.props.logged_userData.isStudyLeader || this.props.logged_userData.isGroupLeader || this.props.logged_userData.isStudyUser || this.props.logged_userData.isStudyInstructor) &&
            <div className="row">
                <div className="web-banner-view">
                    <img src={constand.WEB_IMAGES + banner_img} className="w-100" />
                </div>
                <div className="mobile-banner-view">
                    <img src={constand.WEB_IMAGES + banner_img_mobile} className="w-100" />
                </div>
            </div>
        )
    }
    render() {
        return (
            <React.Fragment>
                {this.renderAdminBanner()}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        is_auth: state.auth.is_auth,
        logged_userData: state.header.logged_userData
    };
};

const mapDispatchToProps = {

};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminBanner);
