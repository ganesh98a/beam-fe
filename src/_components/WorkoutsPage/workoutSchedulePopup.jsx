import React from "react";
import Modal from "react-responsive-modal";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { scheduleModelOpen,scheduleVideo,loginModelOpen,updateScheduleModelDate } from "../../actions";
import { toast } from 'react-toastify';
import DayPicker, { LocaleUtils } from "react-day-picker";
import { Cookies } from "react-cookie-consent";
import * as constand from "../../constant";
import { commonService } from "../../_services";
import moment from 'moment';
import EventCalendarComponent from "../DashboardPage/EventCalendarComponent";
import ReactGA from 'react-ga';
const monthNames = constand.MONTH_LIST;

class WorkoutSchedulePopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      timeList : [],
      selectedDay: null,
      selectedTime: '12:00 AM',
      success_model_open : false,
      scheduledFor:''
    };
    this.handleDayClick = this.handleDayClick.bind(this);
    //this.returnDisplayDateFormate = this.returnDisplayDateFormate.bind(this);
    this.closeModel = this.closeModel.bind(this);
    this.fillTimeList = this.fillTimeList.bind(this);
    this.submitSchedule = this.submitSchedule.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.closeSuccessModel = this.closeSuccessModel.bind(this);
    this.closeModelRedirect = this.closeModelRedirect.bind(this);
    this.defaultDateTime = this.defaultDateTime.bind(this);
  }

  componentWillMount(){
    this.fillTimeList();
  }
  defaultDateTime(){
    var currentTime = moment().format('hh:mm A');
    var splittedMin = currentTime.split(' ')[0].split(":")[1];
    var futureDateTime = moment();
    console.log('currentTime',currentTime)
    if(splittedMin < '15'){
      futureDateTime.minutes(15);
    }else if(splittedMin < '30'){
      futureDateTime.minutes(30);
    }else if(splittedMin < '45'){
      futureDateTime.minutes(45);
    }else{
      futureDateTime.minutes(60);
    }
    console.log('futureDateTime',futureDateTime)
    console.log('futureDateTime-time',futureDateTime.format('h:mm A'))
    var updatedDate = futureDateTime.toString()
    this.setState({selectedTime: futureDateTime.format('h:mm A'),selectedDay:updatedDate})
  }
  
  componentWillReceiveProps(){
    this.setState({
      loading: false,
      //selectedDay: null,
     // selectedTime: '1:00 AM',
    });

    this.defaultDateTime();
  }

  updateTime(e) {
    this.setState({selectedTime:e.target.value});
  }
 
  normalTorails(time)
  {
    var returnvalue = "";
    if(time)
    {
      var temp = time.split(" ");
      var extractTime = temp[0].split(":");
      var hrs = extractTime[0];
      var mins = extractTime[1];
      if(temp[1] === 'PM')
      {
        hrs = parseInt(hrs);
        hrs = hrs + 12;
        if(hrs === 24)
        {
          hrs = '00';
        }
        hrs = hrs.toString();
        if(hrs.length < 2)
        {
          hrs = '0'+hrs;
        }
      }
      returnvalue = hrs+':'+mins+':'+'00';
    }
    return returnvalue;
  }

  onCloseModal() {}

  closeModel() //for close the login model
  {
    this.props.scheduleModelOpen(false);
  }

  closeSuccessModel(){
    this.closeModel();
    this.setState({success_model_open:false});
  }
  closeModelRedirect(){
    window.location.href= "/account/dashboard/schedule/"+ (Cookies.get('condition') ? Cookies.get('condition'):this.props.init_condition)
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('/');
}

  submitSchedule()
  {
    var comb = this.formatDate(this.state.selectedDay) + ' ' + this.normalTorails(this.state.selectedTime);
    var dateObj = new Date(comb);

    var dataObj = {
        scheduleType:'private',
        workout_id: this.props.schedule_model_data.id,
        community:'',
        datetimepicker_moment_time:new Date(),
        datetimepicker_start: new Date(dateObj).toISOString()
    };

    this.setState({loading:true,scheduledFor:dateObj});
    this.props.scheduleVideo(dataObj)
    .then(
        response => {
            this.setState({loading:false});
            //toast.success(response.message);
            this.props.scheduleModelOpen(false, this.props.schedule_model_data);
            //if(this.props.schedule_model_type!="ondemand")
              this.setState({success_model_open:true});
              ReactGA.event({
                category: "On Demand Video",
                action: "Scheduled ",
                label: Cookies.get('condition') + '-' + this.props.schedule_model_data.title + '-' + this.props.schedule_model_data.id
              })
        },
        error => { 
            this.setState({loading:false});
            toast.error(error); 
            this.closeModel();
      }
    );
  }

  /* calendar model */

  fillTimeList(){
    var listArr = [];
    for(var i=1; i <=12; i++) // For AM
    {
      var quard = i+":00"+" AM";
      listArr.push(quard);
      quard = i+":15"+" AM";
      listArr.push(quard);
      quard = i+":30"+" AM";
      listArr.push(quard);
      quard = i+":45"+" AM";
      listArr.push(quard);
    }
    for(var i=1; i <=12; i++) // For PM
    {
      var quard = i+":00"+" PM";
      listArr.push(quard);
      quard = i+":15"+" PM";
      listArr.push(quard);
      quard = i+":30"+" PM";
      listArr.push(quard);
      quard = i+":45"+" PM";
      listArr.push(quard);
    }
    this.setState({timeList:listArr});
  }
  
  handleDayClick(day, { selected }) {
    this.setState({
      selectedDay: selected ? undefined : day,
    });
    //this.returnDisplayDateFormate()
  }

  /* end canendar model */

  render() {
    const date = (this.props.schedule_model_data.scheduledFor) ? new Date(this.props.schedule_model_data.scheduledFor) : null;
    function formatMonthTitle(d, locale) {
      return (<div>{monthNames[d.getMonth()].value}</div>);
     }
    function getFirstDayOfWeek (locale){
      return 1
    }
    function Navbar({
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
          <button class="btn white-txt" onClick={() => onPreviousClick()}>
            <i class="fa fa-angle-left"></i>
          </button>
          <button class="btn white-txt pull-right" onClick={() => onNextClick()}>
            <i class="fa fa-angle-right"></i>
          </button>
        </div>
      );
    } 
    function Weekday({ weekday, className, localeUtils, locale }) {
      const weekdayName = localeUtils.formatWeekdayLong(weekday, locale);
      return (
        <div className={className} title={weekdayName}>
          <b>{weekdayName.slice(0, 3)}</b>
        </div>
      );
    }
    var me = this;
    function returnDisplayDateFormate() {
      var currenDate = me.state.selectedDay;
      console.log('current',currenDate)
      var returnFromate = '';
      if(currenDate)
      {
        var d = new Date(currenDate);
        returnFromate = constand.WEEK_DAY[d.getDay()]+" "+d.getDate()+" "+monthNames[d.getMonth()].value;
      }else{
        var d = new Date();
        returnFromate = constand.WEEK_DAY[d.getDay()]+" "+d.getDate()+" "+monthNames[d.getMonth()].value;
      }
      return returnFromate;
    }
    console.log('this.props.schedule_model_data',this.props)
    
    return (
      <React.Fragment>
      <Modal className="removebbg-popup" open={this.props.is_model_open} onClose={this.onCloseModal} center >
        <div className="modal-dialog schedule_block common_design modal-width--custom m-t-50" role="document">
          <div className="modal-content">
            <div className="modal-header header-styling  border-0">
              <h5
                className="modal-title1 text-center col-md-12 p-0  font-book white-txt"
                id="exampleModalLabel font-medium"
              >
                Add this to your schedule
               
              </h5>
              
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={this.closeModel}>
                  &times;
                </span>
              </button>
            </div>
            <div className="modal-body pb-0">
            <p class="font-semibold black-txt text-center mx-auto  font-15">{this.props.schedule_model_data.title}</p>
            
             <div class="mx-auto w-75 m-b-10 clearfix"><div class="centered-content"><span class=" text-right p-0 border-0 ">
               <img class="img-fluid rounded-circle" src={(this.props.schedule_model_data.Instructor && this.props.schedule_model_data.Instructor.img)? constand.USER_IMAGE_PATH+
                        this.props.schedule_model_data.Instructor.img
                      : constand.WEB_IMAGES+"no-image.png"} alt=""/>
               </span><span class=" text-left black-txt font-qregular m-t-15  font-16 p-l-5">{(this.props.schedule_model_data.Instructor && this.props.schedule_model_data.Instructor.User)&& this.props.schedule_model_data.Instructor.User.name +" "+ this.props.schedule_model_data.Instructor.User.lastName}</span></div></div>

              <div className="m-b-10 mx-auto col-md-10">
              <div class="row">
              <div class="col-md-7 inputs-control">
              <input class="form-control popup-txt" type="text" readOnly value={returnDisplayDateFormate()} />
              </div>
              <div class="col-md-5 inputs-control p-l-0">
              <div className="dropdown ">
                <select name="country"
                  value={this.state.selectedTime}
                  className="form-control popup-txt"
                  onChange={this.updateTime}
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
              {/* <DateTime inputProps={{ placeholder: 'Choose a date/time', disabled: false }} timeFormat='HH:mm' closeOnSelect={true} utc={false} input={true} value={date} onChange={this.handleChange} />
              <button disabled={!(date) || this.state.loading} className="btn btn-login w-100 m-t-20 m-b-20" onClick={this.submitSchedule}><i className="fa fa-calendar" aria-hidden="true"></i>  SCHEDULE THIS WORKOUT </button>
              */}
              <DayPicker  selectedDays={this.state.selectedDay}
          onDayClick={this.handleDayClick} localeUtils={ { ...LocaleUtils, formatMonthTitle, getFirstDayOfWeek}} weekdayElement={Weekday} navbarElement={Navbar} />

              <button disabled={!(this.state.selectedDay) || !(this.state.selectedTime) || this.state.loading} className="btn btn-login  popup-btn font-medium font-14 w-75 mx-auto m-t-20 m-b-20" onClick={this.submitSchedule}> Add to schedule
</button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal className="removebbg-popup" open={this.state.success_model_open} onClose={this.onCloseModal} center >
        {(this.props.schedule_model_data) &&
        <div>
        <div className="modal-dialog schedule_block common_design modal-width--custom m-t-50" role="document">
          <div className="modal-content">
            <div className="modal-header header-styling  border-0">
              <h5
                className="modal-title1 text-center col-md-12 p-0  font-book white-txt"
                id="exampleModalLabel font-medium"
              >Yay! Congrats!
                
              </h5>
              
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={this.closeSuccessModel}>
                  &times;
                </span>
              </button>
            </div>
            <div className="modal-body pb-0">
              <h5 className="pop-sub-head black-txt text-center font-qregular m-b-20 ">This session has been added to Beam schedule</h5>
              <p class="font-semibold black-txt text-center mx-auto w-75 font-15">{this.props.schedule_model_data.title}</p>
              <p class="font-semibold black-txt text-center mx-auto w-75 font-15">{this.props.schedule_model_data.length} minutes</p>
              
             <div class="mx-auto w-85 m-b-10 clearfix">
               <div class="centered-content">
                  <span class=" black-txt font-qregular text-left m-t-15  font-16 p-l-5"> Scheduled for {moment(this.state.scheduledFor).format("dddd DD MMMM")} at {moment(this.state.scheduledFor).format("hh:mm A")} {commonService.localTimeZone()}
                  </span>
                  <div className="text-center black-txt font-qregular text-left m-t-15  font-16 p-l-5">
                  <EventCalendarComponent item={this.props.schedule_model_data} type="Private" title={this.props.schedule_model_data.title} length={this.props.schedule_model_data.length} />
                  </div>
                  </div>
                  </div>
                  <div class="col-md-12 text-center m-t-30 m-b-40">
                  <img src={constand.WEB_IMAGES+"schedule-success-1.png"} alt="" className="w-100" />
                  </div>
                  <div className="row">
                  <div className="col-md-12 m-b-20">
                  <button
onClick={()=>{this.closeSuccessModel(); this.closeModelRedirect(); }} className="btn btn-blue-inverse popup-btn w-40 float-left m-r-10"
                          >
                   View my schedule
                  </button>
                  <button className="btn btn-login popup-btn w-40 float-right" onClick={this.closeSuccessModel}>  All done, thanks! </button>
                  </div>
                  </div>
              
            </div>
          </div>
        </div>
      </div>
      }
      </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    is_model_open: state.workout.schedule_model_open,
    is_auth: state.auth.is_auth,
    schedule_model_data: state.workout.schedule_model_data,
    schedule_model_type: state.workout.schedule_model_type,
    init_condition: state.auth.initial_condition,

  };
};

const mapDispatchToProps = {
  scheduleModelOpen,scheduleVideo,loginModelOpen,updateScheduleModelDate
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkoutSchedulePopup);
