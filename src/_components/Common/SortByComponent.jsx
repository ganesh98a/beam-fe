import React from "react";
import { connect } from "react-redux";
import {
    saveDisclaimer,
    updateUserdataRedex
} from "../../actions";
import { Cookies } from "react-cookie-consent";
import * as constand from "../../constant";

class SortByComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var currentCondition = Cookies.get('condition');
        var sortOptions = (this.props.page && this.props.page == 'program') ? constand.PROGRAM_SORT_FILTERLIST : constand.ONDEMAND_SORT_FILTERLIST;
        return (
            <div className="dropdown">
                <button
                    type="button"
                    className="btn btn-link ash-txt sort-btn font-medium font-14 dropdown-toggle"
                    data-toggle="dropdown"
                >
                    Sort by{" "}: {this.props.sort_filter}
                    <i
                        className="fa fa-angle-down p-l-5"
                        aria-hidden="true"
                    ></i>
                </button>
                <div className="dropdown-menu">
                    {sortOptions.map((item, key) => {
                        return (
                            <span
                                key={key}
                                className="dropdown-item pointer"
                                onClick={() => this.props.sortByFunction(item)}
                            >
                                <p
                                    className={
                                        this.props.sort_filter === item
                                            ? "orangefont"
                                            : ""
                                    }
                                >
                                    {item}
                                </p>
                            </span>
                        );
                    })}
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
)(SortByComponent);
