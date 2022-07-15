import React from "react";
import { connect } from "react-redux";
import {
    saveDisclaimer,
    updateUserdataRedex
} from "../../actions";
import { Cookies } from "react-cookie-consent";
import * as constand from "../../constant";

class OndemandSearchComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var currentCondition = Cookies.get('condition')
        if (this.props.isMobileView) {
            return (
                <div className="input-group search-sm-btn col-sm-12 col-12 m-t-10 p-0">
                    <input
                        className="form-control  py-2 border-right-0 font-qregular font-14 border"
                        type="search"
                        name="search_data"
                        value={this.props.search_data}
                        onKeyUp={this.props.searchBarEnter}
                        onChange={this.props.handleChange}
                        placeholder="What exercise are you looking for?"
                    />
                    <span className="input-group-append">
                        <button disabled={this.props.loader}
                            className="btn btn-outline-secondary border-left-0 border"
                            type="button" onClick={this.props.searchFucntion}
                        >
                            <i className="fa fa-search"></i>
                        </button>
                    </span>
                </div>
            )
        }
        return (
            <div className="input-group mx-auto w-75 search-btn">
                <input
                    type="text"
                    className="form-control font-14 font-qregular"
                    name="search_data"
                    value={this.props.search_data}
                    onKeyUp={this.props.searchBarEnter}
                    onChange={this.props.handleChange}
                    placeholder="What exercise are you looking for?"
                />
                <div className="input-group-append">
                    <button disabled={this.props.loader}
                        className="btn btn-secondary font-14 font-medium"
                        type="button"
                        onClick={this.props.searchFucntion}
                    >
                        Search
                      </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        is_auth: state.auth.is_auth,
        logged_userData: state.header.logged_userData,

    };
};
const mapDispatchToProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OndemandSearchComponent);
