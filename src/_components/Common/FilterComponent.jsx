import React from "react";
import { connect } from "react-redux";
import {
    saveDisclaimer,
    updateUserdataRedex
} from "../../actions";
import { Cookies } from "react-cookie-consent";
import * as constand from "../../constant";
import InputRange from "react-input-range";

class FilterComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    stringtoRange = (value) => {
        var returnValue = { min: 0, max: 0 };
        if (value) {
            var temp = value.split(",");
            returnValue = { min: parseInt(temp[0]), max: parseInt(temp[1]) };
        }
        return returnValue;
    }
    renderMobileView = () => {
        return (
            <div className={
                "w-100 filter-sm-value " +
                (this.props.is_filter_clicked === true ? "filter-clicked" : " ")
            }
                id="accordion"
            >
                <div className="card">
                    <div className="card-header" id="heading-1">
                        <h5 className="mb-0">
                            <a
                                role="button"
                                data-toggle="collapse"
                                href="#collapse-1"
                                aria-expanded="false"
                                aria-controls="collapse-1"
                                className="collapsed"
                            >
                                Class Length
                        <i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>
                            </a>
                        </h5>
                    </div>
                    <div
                        id="collapse-1"
                        className="collapse"
                        data-parent="#accordion"
                        aria-labelledby="heading-1"
                    >
                        <div className="card-body">
                            <div id="accordion-1">
                                <div className="p-t-20 p-b-20 p-l-20 p-r-20">
                                    <InputRange
                                        maxValue={constand.VIDEO_RANGE_MAX}
                                        minValue={constand.VIDEO_RANGE_MIN}
                                        value={this.stringtoRange(
                                            this.props.rangeSelectedValue
                                        )}
                                        onChangeComplete={value => this.props.rangeChangeFunction(value)}
                                        onChange={(value) => this.props.handleChangeRangeSelector(value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header" id="heading-7">
                        <h5 className="mb-0">
                            <a
                                className="collapsed"
                                role="button"
                                data-toggle="collapse"
                                href="#collapse-7"
                                aria-expanded="false"
                                aria-controls="collapse-7"
                            >
                                Video Type
                        <i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>
                            </a>
                        </h5>
                    </div>
                    <div
                        id="collapse-7"
                        className="collapse"
                        data-parent="#accordion"
                        aria-labelledby="heading-7"
                    >
                        <div className="card-body">
                            {this.props.available_filter && this.props.available_filter.videoType &&
                                this.props.available_filter.videoType.map((item, key) => {
                                    return (
                                        <span
                                            key={"videoType_" + key}
                                            className="font-medium black-txt extra-small-txt pointer clearfix capitalize_text"
                                            onClick={() =>
                                                this.props.filterFunction("videoType", item)
                                            }
                                        >
                                            <p
                                                className={
                                                    this.props.selected_filter.videoType &&
                                                        this.props.selected_filter.videoType.includes(
                                                            item
                                                        )
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
                </div>
                <div className="card">
                    <div className="card-header" id="heading-2">
                        <h5 className="mb-0">
                            <a
                                className="collapsed"
                                role="button"
                                data-toggle="collapse"
                                href="#collapse-2"
                                aria-expanded="false"
                                aria-controls="collapse-2"
                            >
                                Level
                        <i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>
                            </a>
                        </h5>
                    </div>
                    <div
                        id="collapse-2"
                        className="collapse"
                        data-parent="#accordion"
                        aria-labelledby="heading-2"
                    >
                        <div className="card-body">
                            {this.props.available_filter && this.props.available_filter.level &&
                                this.props.available_filter.level.map((item, key) => {
                                    return (
                                        <span
                                            key={"level_" + key}
                                            className="font-medium black-txt extra-small-txt pointer clearfix capitalize_text"
                                            onClick={() => this.props.filterFunction("level", item)}
                                        >
                                            <p
                                                className={
                                                    this.props.selected_filter.level &&
                                                        this.props.selected_filter.level.includes(item)
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
                </div>
                <div className="card">
                    <div className="card-header" id="heading-3">
                        <h5 className="mb-0">
                            <a
                                className="collapsed"
                                role="button"
                                data-toggle="collapse"
                                href="#collapse-3"
                                aria-expanded="false"
                                aria-controls="collapse-3"
                            >
                                Benefit
                        <i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>
                            </a>
                        </h5>
                    </div>
                    <div
                        id="collapse-3"
                        className="collapse"
                        data-parent="#accordion"
                        aria-labelledby="heading-3"
                    >
                        <div className="card-body">
                            {this.props.available_filter && this.props.available_filter.benefit &&
                                this.props.available_filter.benefit.map((item, key) => {
                                    return (
                                        <span
                                            key={"benefit_" + key}
                                            className="font-medium black-txt extra-small-txt pointer clearfix capitalize_text"
                                            onClick={() => this.props.filterFunction("benefit", item)}
                                        >
                                            <p
                                                className={
                                                    this.props.selected_filter.benefit &&
                                                        this.props.selected_filter.benefit.includes(
                                                            item
                                                        )
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
                </div>
                <div className="card">
                    <div className="card-header" id="heading-4">
                        <h5 className="mb-0">
                            <a
                                className="collapsed"
                                role="button"
                                data-toggle="collapse"
                                href="#collapse-4"
                                aria-expanded="false"
                                aria-controls="collapse-4"
                            >
                                Discipline
                        <i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>
                            </a>
                        </h5>
                    </div>
                    <div
                        id="collapse-4"
                        className="collapse"
                        data-parent="#accordion"
                        aria-labelledby="heading-4"
                    >
                        <div className="card-body">
                            {this.props.available_filter && this.props.available_filter.discipline &&
                                this.props.available_filter.discipline.map(
                                    (item, key) => {
                                        return (
                                            <span
                                                key={"discipline_" + key}
                                                className="font-medium black-txt extra-small-txt pointer clearfix capitalize_text"
                                                onClick={() =>
                                                    this.props.filterFunction("discipline", item)
                                                }
                                            >
                                                <p
                                                    className={
                                                        this.props.selected_filter.discipline &&
                                                            this.props.selected_filter.discipline.includes(
                                                                item
                                                            )
                                                            ? "orangefont"
                                                            : ""
                                                    }
                                                >
                                                    {item}
                                                </p>
                                            </span>
                                        );
                                    }
                                )}
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header" id="heading-5">
                        <h5 className="mb-0">
                            <a
                                className="collapsed"
                                role="button"
                                data-toggle="collapse"
                                href="#collapse-5"
                                aria-expanded="false"
                                aria-controls="collapse-5"
                            >
                                Equipment
                        <i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>
                            </a>
                        </h5>
                    </div>
                    <div
                        id="collapse-5"
                        className="collapse"
                        data-parent="#accordion"
                        aria-labelledby="heading-5"
                    >
                        <div className="card-body">
                            {this.props.available_filter && this.props.available_filter.equipment &&
                                this.props.available_filter.equipment.map((item, key) => {
                                    return (
                                        <span
                                            key={"equipment_" + key}
                                            className="font-medium black-txt extra-small-txt pointer clearfix capitalize_text"
                                            onClick={() =>
                                                this.props.filterFunction("equipment", item)
                                            }
                                        >
                                            <p
                                                className={
                                                    this.props.selected_filter.equipment &&
                                                        this.props.selected_filter.equipment.includes(
                                                            item
                                                        )
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
                </div>
                <div className="card">
                    <div className="card-header" id="heading-6">
                        <h5 className="mb-0">
                            <a
                                className="collapsed"
                                role="button"
                                data-toggle="collapse"
                                href="#collapse-6"
                                aria-expanded="false"
                                aria-controls="collapse-6"
                            >
                                Instructor
                        <i className="fa  fa-2x pull-right small-arrow fa-angle-down"></i>
                            </a>
                        </h5>
                    </div>
                    <div
                        id="collapse-6"
                        className="collapse"
                        data-parent="#accordion"
                        aria-labelledby="heading-6"
                    >
                        <div className="card-body">
                            {this.props.available_filter && this.props.available_filter.instructor &&
                                this.props.available_filter.instructor.map(
                                    (item, key) => {
                                        return (
                                            <span
                                                key={"instructor_" + key}
                                                className="font-medium black-txt extra-small-txt pointer clearfix capitalize_text"
                                                onClick={() =>
                                                    this.props.filterFunction("instructor", item)
                                                }
                                            >
                                                <p
                                                    className={
                                                        this.props.selected_filter.instructor &&
                                                            this.props.selected_filter.instructor.includes(
                                                                item
                                                            )
                                                            ? "orangefont"
                                                            : ""
                                                    }
                                                >
                                                    {item}
                                                </p>
                                            </span>
                                        );
                                    }
                                )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    renderWebView = () => {
        return (
            <div className="col-md-12 filter_grid m-t-50 ">
                <div className="row">
                    <div className="col-md-7">
                        <div className="row">
                            <div className="col-md-3 p-l-0 m-b-10">
                                <div className="filter_head  black-txt small-txt">
                                    {" "} Class Length
                                    </div>
                                <InputRange
                                    maxValue={constand.VIDEO_RANGE_MAX}
                                    minValue={constand.VIDEO_RANGE_MIN}
                                    value={this.stringtoRange(
                                        this.props.rangeSelectedValue
                                    )}
                                    onChangeComplete={value => this.props.rangeChangeFunction(value)}
                                    onChange={(value) => this.props.handleChangeRangeSelector(value)}
                                />
                            </div>
                            <div className="col-md-3 p-l-0 m-b-10">
                                <div className="filter_head  black-txt small-txt">
                                    {" "}Class type
                                    </div>
                                {this.props.available_filter.videoType &&
                                    this.props.available_filter.videoType.map(
                                        (item, key) => {
                                            return (
                                                <span
                                                    key={"videotype_" + key}
                                                    className="font-medium black-txt extra-small-txt pointer clearfix capitalize_text"
                                                    onClick={() =>
                                                        this.props.filterFunction("videoType", item)
                                                    }
                                                >
                                                    <p
                                                        className={
                                                            this.props.selected_filter.videoType &&
                                                                this.props.selected_filter.videoType.includes(
                                                                    item
                                                                )
                                                                ? "orangefont"
                                                                : ""
                                                        }
                                                    >
                                                        {item}
                                                    </p>
                                                </span>
                                            );
                                        }
                                    )}
                            </div>
                            <div className="col-md-3 p-l-0 m-b-10">
                                <div className="filter_head  black-txt small-txt">
                                    Level
                    </div>
                                {this.props.available_filter.level && this.props.available_filter.level.map((item, key) => {
                                    return (
                                        <span
                                            key={"level_" + key}
                                            className="font-medium black-txt extra-small-txt pointer clearfix capitalize_text"
                                            onClick={() => this.props.filterFunction("level", item)}
                                        >
                                            <p
                                                className={
                                                    this.props.selected_filter.level &&
                                                        this.props.selected_filter.level.includes(
                                                            item
                                                        )
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
                            <div className="col-md-3 p-l-0 m-b-10">
                                <div className="filter_head font-medium black-txt small-txt">
                                    Benefit{" "}
                                </div>
                                {this.props.available_filter.benefit && this.props.available_filter.benefit.map(
                                    (item, key) => {
                                        return (
                                            <span
                                                key={"benifit_" + key}
                                                className="font-medium black-txt extra-small-txt pointer clearfix capitalize_text"
                                                onClick={() =>
                                                    this.props.filterFunction("benefit", item)
                                                }
                                            >
                                                <p
                                                    className={
                                                        this.props.selected_filter.benefit &&
                                                            this.props.selected_filter.benefit.includes(
                                                                item
                                                            )
                                                            ? "orangefont"
                                                            : ""
                                                    }
                                                >
                                                    {item}
                                                </p>
                                            </span>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5 ">
                        <div className="row">
                            <div className="col-md-4 p-l-0 m-b-10">
                                <div className="filter_head font-medium black-txt small-txt">
                                    Discipline
                    </div>
                                {this.props.available_filter.discipline && this.props.available_filter.discipline.map(
                                    (item, key) => {
                                        return (
                                            <span
                                                key={"discipline_" + key}
                                                className="font-medium black-txt extra-small-txt pointer clearfix capitalize_text"
                                                onClick={() =>
                                                    this.props.filterFunction("discipline", item)
                                                }
                                            >
                                                <p
                                                    className={
                                                        this.props.selected_filter.discipline &&
                                                            this.props.selected_filter.discipline.includes(
                                                                item
                                                            )
                                                            ? "orangefont"
                                                            : ""
                                                    }
                                                >
                                                    {item}
                                                </p>
                                            </span>
                                        );
                                    }
                                )}
                            </div>
                            <div className="col-md-4 p-l-0 m-b-10">
                                <div className="filter_head font-medium black-txt small-txt">
                                    Equipment
                    </div>
                                {this.props.available_filter.equipment && this.props.available_filter.equipment.map(
                                    (item, key) => {
                                        return (
                                            <span
                                                key={"equipment_" + key}
                                                className="font-medium black-txt extra-small-txt pointer clearfix capitalize_text"
                                                onClick={() =>
                                                    this.props.filterFunction("equipment", item)
                                                }
                                            >
                                                <p
                                                    className={
                                                        this.props.selected_filter.equipment &&
                                                            this.props.selected_filter.equipment.includes(
                                                                item
                                                            )
                                                            ? "orangefont"
                                                            : ""
                                                    }
                                                >
                                                    {item}
                                                </p>
                                            </span>
                                        );
                                    }
                                )}
                            </div>
                            <div className="col-md-4 p-l-0 m-b-10">
                                <div className="filter_head font-medium black-txt small-txt">
                                    Instructor
                    </div>
                                {this.props.available_filter.instructor && this.props.available_filter.instructor.map(
                                    (item, key) => {
                                        return (
                                            <span
                                                key={"instructor_" + key}
                                                className="font-medium black-txt extra-small-txt pointer clearfix capitalize_text"
                                                onClick={() =>
                                                    this.props.filterFunction("instructor", item)
                                                }
                                            >
                                                <p
                                                    className={
                                                        this.props.selected_filter.instructor &&
                                                            this.props.selected_filter.instructor.includes(
                                                                item
                                                            )
                                                            ? "orangefont"
                                                            : ""
                                                    }
                                                >
                                                    {item}
                                                </p>
                                            </span>
                                        );
                                    }
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
    render() {
        return (
            <React.Fragment>
                {/* mobile view content */}
                {this.props.available_filter && this.renderMobileView()}
                {/* web view content */}
                {this.props.available_filter && this.props.is_filter_open && (
                    this.renderWebView()
                )}
            </React.Fragment>
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
)(FilterComponent);
