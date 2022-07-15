import React from "react";
import { connect } from "react-redux";
import * as constand from "../../constant";
import { commonService } from "../../_services";
import { setDatepickerValue, setDateValue, setTimeValue } from "../../actions";
import DayPicker, { LocaleUtils } from "react-day-picker";
import moment from "moment";
const monthNames = constand.MONTH_LIST;

class DatePickerWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeList: [],
            selectedDay: this.props.defaultSelectedDay,
            selectedTime: this.props.defaultSelectedTime,
        };
        //calendar start
        this.fillTimeList = this.fillTimeList.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.calculateDatePicker = this.calculateDatePicker.bind(this);
        //calendar end
    };
    componentDidMount() {
        console.log('datepicker-componentDidMount', this.props)
        console.log('datepicker-componentDidMount-selectedTime', this.state.selectedTime)
        var me = this;
        this.props.setDateValue(this.state.selectedDay, function () {
            me.props.setTimeValue(me.state.selectedTime);
            //me.props.setDatepickerValue();
        });
    }
    componentWillMount() {
        this.fillTimeList();
    }

    //calendar
    fillTimeList() {
        var listArr = [];
        listArr.push("");
        for (var i = 1; i <= 12; i++) // For AM
        {
            var quard = i + ":00" + " AM";
            listArr.push(quard);
            quard = i + ":15" + " AM";
            listArr.push(quard);
            quard = i + ":30" + " AM";
            listArr.push(quard);
            quard = i + ":45" + " AM";
            listArr.push(quard);
        }
        for (var i = 1; i <= 12; i++) // For PM
        {
            var quard = i + ":00" + " PM";
            listArr.push(quard);
            quard = i + ":15" + " PM";
            listArr.push(quard);
            quard = i + ":30" + " PM";
            listArr.push(quard);
            quard = i + ":45" + " PM";
            listArr.push(quard);
        }
        this.setState({ timeList: listArr });
    }
    updateTime(e) {
        this.setState({ selectedTime: e.target.value });
        //this.props.setTimeValue(e.target.value);
    }
    handleDayClick(day, { selected }) {
        // this.props.setDateValue(day);
        this.setState({
            selectedDay: selected ? undefined : day,
        });
    }

    calculateDatePicker(type, value) {
        console.log('calculate', value)
        if (type == 'date') {
            var comb = commonService.formatDateFromString(value) + ' ' + commonService.formatTimeFromSelector(this.state.selectedTime);
            value = this.state.selectedTime;
        } else {
            // var comb = commonService.formatDateFromString(this.props.selectedDate) + ' ' + commonService.formatTimeFromSelector(value);
            if (commonService.formatTimeFromSelector(value)) { //time present
                var comb = commonService.formatDateFromString(this.state.selectedDay) + ' ' + commonService.formatTimeFromSelector(value);
            } else {
                var comb = commonService.formatDateFromString(this.state.selectedDay);
            }
        }
        console.log('comb', comb)
        if (commonService.formatTimeFromSelector(value)) { //time present
            var dateObj = new Date(comb);
            var datetime = moment(dateObj).toISOString(); //new Date(dateObj).toISOString(); 
        } else {
            //var dateObj = new Date(comb);
            var datetime = moment(comb).format('YYYY-MM-DD'); //new Date(dateObj).toISOString(); 
        }


        console.log('calculateDatePicker-datetime', datetime)
        console.log('calculateDatePicker-date', moment(datetime).format('YYYY-MM-DD'))
        return datetime;
    }

    //console.log()
    returnDisplayDateFormate() {
        var me = this;
        var currenDate = me.state.selectedDay;
        console.log('current ' + currenDate)
        var returnFromate = '';
        if (currenDate) {
            var d = new Date(currenDate);
            returnFromate = constand.WEEK_DAY[d.getDay()] + " " + d.getDate() + " " + monthNames[d.getMonth()].value;
        } else {
            var d = new Date();
            returnFromate = constand.WEEK_DAY[d.getDay()] + " " + d.getDate() + " " + monthNames[d.getMonth()].value;
        }
        return returnFromate;
    }
    formatMonthTitle(d, locale) {
        return (<div>{monthNames[d.getMonth()].value}</div>);
    }
    getFirstDayOfWeek(locale) {
        return 1
    }
    Navbar({
        nextMonth,
        previousMonth,
        onPreviousClick,
        onNextClick,
        className,
        localeUtils,
    }) {
        const months = localeUtils.getMonths();
        const prev = months[previousMonth.getMonth()];
        const next = months[nextMonth.getMonth()];
        const styleLeft = {
            float: 'left',
        };
        const styleRight = {
            float: 'right',
        };
        return (
            <div className={className}>
                <button class="btn white-txt" onClick={() => onPreviousClick()} type="button">
                    <i class="fa fa-angle-left"></i>
                </button>
                <button class="btn white-txt pull-right" onClick={() => onNextClick()} type="button">
                    <i class="fa fa-angle-right"></i>
                </button>
            </div>
        );
    }
    Weekday({ weekday, className, localeUtils, locale }) {
        const weekdayName = localeUtils.formatWeekdayLong(weekday, locale);
        return (
            <div className={className} title={weekdayName}>
                <b>{weekdayName.slice(0, 3)}</b>
            </div>
        );
    }
    render() {
        //calendar
        var formatMonthTitle = this.formatMonthTitle, getFirstDayOfWeek = this.getFirstDayOfWeek
        return (
            <div>
                <div class="row">
                    <div class="col-md-7 inputs-control">
                        <input class="form-control popup-txt" type="text" readOnly value={this.returnDisplayDateFormate()} />
                    </div>
                    <div class="col-md-5 inputs-control p-l-0">
                        <div className="dropdown ">
                            <select name="country"
                                value={this.state.selectedTime}
                                className="form-control popup-txt"
                                //onChange={this.updateTime}
                                onChange={(e) => {
                                    var values = this.calculateDatePicker('time', e.target.value);
                                    this.props.onChange('time', values, this.props.formProps);
                                    this.updateTime(e)
                                }}
                            >
                                {this.state.timeList.map((item, key) => {
                                    return (
                                        <option className="pointer" key={"time_" + item} value={item}>
                                            {item}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </div>
                <DayPicker
                    selectedDays={this.state.selectedDay}
                    onDayClick={(value, { selected }) => {
                        var values = this.calculateDatePicker('date', value);
                        this.props.onChange('date', values, this.props.formProps);
                        this.handleDayClick(value, { selected });
                        // this.props.setDateValue(value, function () { });
                        // this.props.setDatepickerValue();
                    }}
                    //onDayClick={this.handleDayClick}
                    localeUtils={{ ...LocaleUtils, formatMonthTitle, getFirstDayOfWeek }}
                    weekdayElement={this.Weekday}
                    navbarElement={this.Navbar} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        is_auth: state.auth.is_auth,
        selectedDate: state.dashboard.selectedDate,
        selectedTime: state.dashboard.selectedTime
    };
};

const mapDispatchToProps = {
    setDatepickerValue,
    setDateValue,
    setTimeValue
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DatePickerWidget);