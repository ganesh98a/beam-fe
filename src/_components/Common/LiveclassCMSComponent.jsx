import React from "react";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import FacebookLogin from "react-facebook-login";
import * as constand from "../../constant";
import MultiSelectComponent from "../../_layoutComponents/MultiSelectComponent";
import axios from "axios";
import _ from 'lodash';
import RichTextEditor from 'react-rte';
import {
    getZoomUsers,
    getTags,
    getRecordingOf,
    getInstructor,
    ondemandCMSModelOpen,
    removeTag,
    createNewTag,
    clearOndemandList,
    imageCropOpenPopup,
    createZoomMeeting,
    cancelZoomMeeting,
    updateFreeLiveclass,
    setPollModal,
    deletePoll,
    liveclassDetail,
    checkWatchPartyWorkoutId
} from "../../actions";
import { toast } from "react-toastify";
import { Cookies } from "react-cookie-consent";
import { components } from "react-select";
import makeAnimated from "react-select/animated";
import timezones from 'google-timezones-json';
import ImageCropperComponent from "../Common/ImageCropperComponent";
import ConfirmationPopup from '../Common/ConfirmationPopup';
import { commonService } from "../../_services";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import CKEditor from 'ckeditor4-react';
import PollModal from "./PollModal";
const monthNames = constand.MONTH_LIST;

Option = props => {
    return (
        <div>
            <div className={props.data.tagCount == 0 && props.selectProps.isRemoveable ? "pull-left optionWidth" : "pull-left w-100"}>
                <components.Option {...props} >
                    <input
                        type="checkbox"
                        checked={props.isSelected}
                        onChange={() => null}
                    />{" "}
                    <label>{props.label} {props.value != '*' && props.selectProps.isRemoveable && <span className="black-txt font-semibold">({props.data.tagCount})</span>}  </label>
                </components.Option>
            </div>
            {props.data.tagCount === 0 && props.selectProps.isRemoveable && <button onClick={() => props.selectProps.removeTag(props.value, props.selectProps.name)} className="btn pull-right orangefont removeTagBtn">X</button>}
        </div>
    );
};

const allOption = {
    label: "Select all",
    value: "*"
};

const ValueContainer = ({ children, ...props }) => {
    const currentValues = props.getValue();
    let toBeRendered = children;
    if (currentValues.some(val => val.value === allOption.value)) {
        toBeRendered = [[children[0][0]], children[1]];
    }

    return (
        <components.ValueContainer {...props}>
            {toBeRendered}
        </components.ValueContainer>
    );
};

const MultiValue = props => {
    let labelToBeDisplayed = `${props.data.label}`;
    if (props.data.value === allOption.value) {
        labelToBeDisplayed = "All is selected";
    }
    return (
        <components.MultiValue {...props}>
            <span>{labelToBeDisplayed}</span>
        </components.MultiValue>
    );
};
const animatedComponents = makeAnimated();
const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'IMAGE_BUTTON'],
    INLINE_STYLE_BUTTONS: [
        { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
        { label: 'Italic', style: 'ITALIC' },
        { label: 'Underline', style: 'UNDERLINE' }
    ],
    BLOCK_TYPE_BUTTONS: [
        { label: 'UL', style: 'unordered-list-item' },
        { label: 'OL', style: 'ordered-list-item' }
    ]
};
class LiveclassCMSComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zoomUsers: [],
            timeList: [],
            amPmList: [
                'AM', 'PM'
            ],
            hrsOptions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
            minsOptions: [0, 15, 30, 45],
            recurrenceOptions: ['Daily', 'Weekly', 'Monthly'],
            ocurrencesOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            repeatOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            repeatWeekOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            repeatMonthOptions: [1, 2, 3],
            repeatText: 'day',
            occursonWeeklyDay: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            occursonMonthlyDay: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            occursonMonthlyWeek: ['First', 'Second', 'Third', 'Fourth', 'Last'],
            occursonMonthlyWeekDay: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            timeZoneOptions: timezones,
            editorValue: RichTextEditor.createEmptyValue(),
            submitted: false,
            submittedSchedule: false,
            loading: false,
            isCropped: false,
            error: "",
            workout: {
                isLive: 0,
                isPhysioLed: 0,
            },
            isLive: 1,
            workoutId: '',
            workoutDescription: '',
            disciplineOptions: [],
            conditionOptions: [],
            classTypeOptions: [],
            benefitOptions: [],
            equipmentOptions: [],
            levelOptions: [],
            instructorOptions: [],
            recordingofOptions: [],
            enableButton: true,
            openModel: false,
            optionSelected: {
                'discipline': [],
                'benefit': [],
                'instructor': [],
                'equipment': [],
                'level': [],
                'condition': [],
                'classType': [],
                'instructorUser': [],
                'recordingof': []
            },
            videoUrlError: false,
            crop: {
                unit: "px", // default, can be 'px' or '%'
                x: 0,
                y: 0,
                width: 800,
                height: 485,
                aspect: 16 / 9,
                disabled: true,
                locked: true
            },
            liveclass: {
                startdate: new Date(),
                whentime: '1:00',
                whenam: 'AM',
            },
            showZoomOptions: false,
            classList: [],
            loadingSchedule: false,
            saveClassError: false,
            savePollError: false,
            editSec: '',
            cancelSec: '',
            pollList: [],
            editPoll: [],
            editPollKey: '',
            videoTypeLiveclass: [],
            isTagCreatable: true,
            isValidWorkoutId: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.calculateZoneBasedDate = this.calculateZoneBasedDate.bind(this);
        this.handleChangeTextEdit = this.handleChangeTextEdit.bind(this);
        this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
        this.handleLiveClassChange = this.handleLiveClassChange.bind(this);
        this.handleRecurrenceChange = this.handleRecurrenceChange.bind(this);
        this.handleInstructorChange = this.handleInstructorChange.bind(this);
        this.handleMultiCheckboxChange = this.handleMultiCheckboxChange.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.onSubmitWorkout = this.onSubmitWorkout.bind(this);
        this.closeModel = this.closeModel.bind(this);
        this.clearState = this.clearState.bind(this);
        this.onCloseModel = this.onCloseModel.bind(this);
        this.closeConfirmationPopup = this.closeConfirmationPopup.bind(this);
        this.fillTimeList = this.fillTimeList.bind(this);
        this.defaultDateTime = this.defaultDateTime.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.addToSchedule = this.addToSchedule.bind(this);
        this.confirmCancel = this.confirmCancel.bind(this);
        this.resetZoom = this.resetZoom.bind(this);
        this.renderAddScheduleSection = this.renderAddScheduleSection.bind(this);
        this.renderCancelSection = this.renderCancelSection.bind(this);
        this.updateFreeClass = this.updateFreeClass.bind(this);
        this.getInstructor = this.getInstructor.bind(this);
        this.deletePollData = this.deletePollData.bind(this);
        this.presetZoom = this.presetZoom.bind(this);
        this.checkWatchPartyWorkoutId = this.checkWatchPartyWorkoutId.bind(this);

    }
    componentDidMount() {
        this.defaultDateTime();
        console.log('timeZoneOptions', this.state.timeZoneOptions);
        this.fillTimeList();
        var workouts = this.props.liveclass_detail_data.liveClasses ? this.props.liveclass_detail_data.liveClasses.liveclass : {};
        var classList = this.props.liveclass_detail_data.liveClasses ? this.props.liveclass_detail_data.liveClasses.occurrences : []
        var pollList = this.props.liveclass_detail_data.liveClasses ? this.props.liveclass_detail_data.liveClasses.liveclass.Polls : []
        workouts.vlength = workouts.length;
        var workoutId = workouts ? workouts.id : '';
        var recordingOf = workouts ? workouts.recordingOf : '';
        var instructorId = (workouts && workouts.InstructorId) ? workouts.InstructorId : '';
        console.log('classList', workouts)
        var checkAuth = (!this.props.logged_userData.isStudyLeader && (this.props.logged_userData.isCreator || (!this.props.is_group_admin && !this.props.is_group_leader)));
        this.setState({
            classList: classList || [],
            pollList: pollList || [],
            workout: workouts,
            workoutId: workoutId,
            workoutDescription: workouts.description,
            editorValue: RichTextEditor.createValueFromString(workouts.description, 'html'),
            isTagCreatable: checkAuth
        })
        setTimeout(() => {
            console.log('Latetime-desc')
            this.setState({ description: workouts.description })
        }, 1500);
        var conditionName = commonService.replaceChar(Cookies.get('condition'), true);
        var groupId = this.props.groupId;
        this.props.getZoomUsers(conditionName, groupId).then(
            response => {
                if (response) {
                    if (response.list.length > 0) {
                        this.setState({
                            zoomUsers: response.list
                        });
                    }
                }
            },
            error => { })
        this.props.getTags('discipline', workoutId).then(
            response => {
                if (response) {
                    if (response.data.editTags.length > 0) {
                        var editTags = response.data.editTags;
                        var newOptions = this.state.optionSelected;
                        editTags.forEach(element => {
                            newOptions['discipline'].push(element.Tag);
                        });
                        this.setState({
                            optionSelected: newOptions
                        });
                    }
                    this.setState({ disciplineOptions: response.data.tags })
                }
            },
            error => { })
        this.props.getTags('benefit', workoutId).then(
            response => {
                if (response) {
                    if (response.data.editTags.length > 0) {
                        var editTags = response.data.editTags;
                        var newOptions = this.state.optionSelected;
                        editTags.forEach(element => {
                            newOptions['benefit'].push(element.Tag);
                        });
                        this.setState({
                            optionSelected: newOptions
                        });
                    }
                    this.setState({ benefitOptions: response.data.tags })
                }
            },
            error => {

            })

        this.props.getTags('equipment', workoutId).then(
            response => {
                if (response) {
                    if (response.data.editTags.length > 0) {
                        var editTags = response.data.editTags;
                        var newOptions = this.state.optionSelected;
                        editTags.forEach(element => {
                            newOptions['equipment'].push(element.Tag);
                        });
                        this.setState({
                            optionSelected: newOptions
                        });
                    }
                    this.setState({ equipmentOptions: response.data.tags })
                }
            },
            error => {

            })
        this.props.getTags('level', workoutId).then(
            response => {
                if (response) {
                    if (response.data.editTags.length > 0) {
                        var editTags = response.data.editTags;
                        var newOptions = this.state.optionSelected;
                        editTags.forEach(element => {
                            newOptions['level'].push(element.Tag);
                        });
                        this.setState({
                            optionSelected: newOptions
                        });
                    }
                    this.setState({ levelOptions: response.data.tags })
                }
            },
            error => {

            })
        this.props.getTags('condition', workoutId).then(
            response => {
                if (response) {
                    if (response.data.editTags.length > 0) {
                        var editTags = response.data.editTags;
                        var newOptions = this.state.optionSelected;
                        editTags.forEach(element => {
                            newOptions['condition'].push(element.Tag);
                        });
                        this.setState({
                            optionSelected: newOptions
                        });
                    }
                    if (!workoutId) {
                        var newOptions = this.state.optionSelected;
                        var newArra = _.filter(response.data.tags, function (condition) {
                            return condition.label === commonService.replaceChar(Cookies.get('condition'), true);
                        });
                        newOptions['condition'] = newArra;
                        this.setState({ optionSelected: newOptions })
                    }
                    this.setState({ conditionOptions: response.data.tags })
                    var ids = _.map(this.state.optionSelected['condition'], 'value');
                    console.log('ids-condition', ids)
                    this.getInstructor(instructorId, ids);
                }
            },
            error => {

            })

        this.props.getTags('videoType', workoutId).then(
            response => {
                if (response) {
                    if (response.data.editTags.length > 0) {
                        var editTags = response.data.editTags;
                        var newOptions = this.state.optionSelected;
                        editTags.forEach(element => {
                            var videoTypeLiveclass = [];
                            if (element.Tag.label == constand.Video_Type_Liveclass) {
                                videoTypeLiveclass.push(element.tag);
                                this.setState({ videoTypeLiveclass: videoTypeLiveclass })
                            }
                            newOptions['classType'].push(element.Tag);
                        });
                        this.setState({
                            optionSelected: newOptions
                        });
                    }
                    let getType = response.data.tags.filter((x) => (x.label === 'Exercise' || x.label === 'Education'));
                    this.setState({ classTypeOptions: getType })
                }
            },
            error => {

            })
    }
    componentWillReceiveProps(nextProps) {
        this.defaultDateTime();
        console.log('CMS-componentWillReceiveProps', nextProps)
        let { workout } = this.state;
        if (this.props.is_poll_modal_open != nextProps.is_poll_modal_open) {
            this.setState({ pollList: nextProps.liveclass_detail_data.liveClasses.liveclass.Polls ? nextProps.liveclass_detail_data.liveClasses.liveclass.Polls : [] })
        }
        if (this.props.cropped_image != nextProps.cropped_image && nextProps.cropped_image) {
            this.setState({
                isCropped: true,
                workout: {
                    ...workout,
                    videoImg: nextProps.cropped_image,
                    postFile: nextProps.cropped_file
                }
            })
        } else if (!nextProps.cropped_image) {
            this.setState({
                //isCropped: true,
                workout: {
                    ...workout,
                    videoImg: nextProps.cropped_image,
                    postFile: nextProps.cropped_file
                }
            })
        }
    }
    getInstructor(instructorId, ids) {
        this.props.getInstructor(instructorId, ids, this.props.groupId, commonService.replaceChar(Cookies.get('condition'), true)).then(
            response => {
                if (response) {
                    if (response.data.editTags) {
                        var editTags = response.data.editTags;
                        var newOptions = this.state.optionSelected;
                        newOptions['instructorUser'].push(editTags);
                        this.setState({
                            optionSelected: newOptions
                        });
                        console.log('optionSelected', this.state.optionSelected)
                    } else {
                        var newOptions = this.state.optionSelected;
                        newOptions['instructorUser'] = null;
                        this.setState({
                            optionSelected: newOptions,
                        });
                    }
                    this.setState({ instructorOptions: response.data.instructors })
                }
            },
            error => {
                var newOptions = this.state.optionSelected;
                newOptions['instructorUser'] = null;
                this.setState({
                    optionSelected: newOptions,
                    instructorOptions: []
                });
            }
        )
    }
    removeTag(item, type) {
        console.log('removeTags', item);
        console.log('type', type);
        var data = { type: type, tag: item }
        this.props.removeTag(data).then(
            response => {
                if (response.status) {
                    var newOptions = this.state.optionSelected;
                    var newArra = _.filter(newOptions[type], function (condition) {
                        return condition.value != item;
                    });
                    newOptions[type] = newArra;
                    console.log('newArra', newArra)
                    this.setState({ optionSelected: newOptions });

                    var me = this;
                    switch (type) {
                        case 'condition':
                            var newOptions = _.filter(me.state.conditionOptions, function (condition) {
                                return condition.value != item;
                            });
                            me.setState({ conditionOptions: newOptions })
                            break;
                        case 'classType':
                            var newOptions = _.filter(me.state.classTypeOptions, function (condition) {
                                return condition.value != item;
                            });
                            me.setState({ classTypeOptions: newOptions })
                            break;
                        case 'discipline':
                            var newOptions = _.filter(me.state.disciplineOptions, function (condition) {
                                return condition.value != item;
                            });
                            me.setState({ disciplineOptions: newOptions })
                            break;
                        case 'benefit':
                            var newOptions = _.filter(me.state.benefitOptions, function (condition) {
                                return condition.value != item;
                            });
                            me.setState({ benefitOptions: newOptions })
                            break;

                        case 'equipment':
                            var newOptions = _.filter(me.state.equipmentOptions, function (condition) {
                                return condition.value != item;
                            });
                            me.setState({ equipmentOptions: newOptions })
                        case 'classType':
                            var newOptions = _.filter(me.state.classTypeOptions, function (condition) {
                                return condition.value != item;
                            });
                            me.setState({ classTypeOptions: newOptions })
                            break;
                    }
                }
            },
            error => { })
    }
    defaultDateTime(inputTime = null) {
        var currentTime = moment().format('hh:mm A');
        var futureDateTime = moment();
        let { liveclass } = this.state;
        var newDate = moment().add((liveclass.enddate_occur * liveclass.repeat_every) - 1, 'days').toString();
        /* if (inputTime) {
            console.log('inputTime', inputTime)
            currentTime = moment(inputTime).format('hh:mm A');
            futureDateTime = moment(inputTime);
            newDate = moment(inputTime).add((liveclass.enddate_occur * liveclass.repeat_every) - 1, 'days').toString();
        } */
        var splittedMin = currentTime.split(' ')[0].split(":")[1];
        console.log('currentTime', currentTime)
        if (splittedMin < '30') {
            futureDateTime.minutes(30);
        } else {
            futureDateTime.minutes(60);
        }
        var zone_name = commonService.localTimeZoneName();
        console.log('newDate', new Date(newDate))
        console.log('futureDateTime', futureDateTime)
        this.setState({
            liveclass: {
                ...liveclass,
                whentime: futureDateTime.format('h:mm'),
                whenam: futureDateTime.format('A'),
                enddate: new Date(newDate),
                timezone: zone_name
            },
        });
    }
    resetZoom() {
        this.defaultDateTime();
        const { liveclass } = this.state;
        this.setState({
            editSec: '',
            submittedSchedule: false,
            liveclass: {
                ...liveclass,
                userId: '',
                // startdate: new Date(),
                reason: '',
                isPreset: false
            }
        });

    }
    presetZoom(index) {
        const { liveclass, classList } = this.state;
        var timetableList = classList[index];
        var splittedData = timetableList.scheduledFor.split(' ');
        var futureDateTime = moment(timetableList.scheduledFor);
        var newArra = _.filter(this.state.zoomUsers, function (zoomusers) {
            return zoomusers.id === timetableList.zoomUserId;
        });
        console.log('presetZoom', newArra)
        var userId = newArra.length ? newArra[0].zoomUserId : '';
        var watchPartyWorkoutId = classList[0].watchPartyWorkoutId;
        var comb = this.formatDate(splittedData[0]) + ' ' + (liveclass.whentime) + ' ' + (liveclass.whenam);
        this.calculateZoneBasedDate(comb)
        this.setState({
            editSec: '',
            submittedSchedule: false,
            liveclass: {
                ...liveclass,
                userId: userId,
                watchPartyWorkoutId: watchPartyWorkoutId,
                startdate: new Date(splittedData[0]),
                reason: '',
                whentime: futureDateTime.format('h:mm'),
                whenam: futureDateTime.format('A'),
                isPreset: userId ? true : false
            }
        });
    }
    onCloseModel() { }
    /* calendar model */

    closeConfirmationPopup(val) {
        if (val === 'Yes') this.props.ondemandCMSModelOpen(false);
        this.setState({ openModel: false });
    }

    fillTimeList() {
        var listArr = [];
        for (var i = 1; i <= 12; i++) // For AM
        {
            var quard = i + ":00";
            listArr.push(quard);
            quard = i + ":15";
            listArr.push(quard);
            quard = i + ":30";
            listArr.push(quard);
            quard = i + ":45";
            listArr.push(quard);
        }
        this.setState({ timeList: listArr });
    }
    handleChangeDate = date => {
        let { liveclass } = this.state;
        this.setState({
            liveclass: {
                ...liveclass,
                startdate: date,
            },
        });
        var comb = this.formatDate(date) + ' ' + (liveclass.whentime) + ' ' + (liveclass.whenam);
        this.calculateZoneBasedDate(comb)
    };
    calculateZoneBasedDate(comb = '') {
        if (comb) {
            var comb = comb;
        } else {
            var comb = this.formatDate(this.state.liveclass.startdate) + ' ' + (this.state.liveclass.whentime) + ' ' + (this.state.liveclass.whenam);
        }
        var selectedZone = this.state.liveclass.timezone;
        var str = this.state.timeZoneOptions[selectedZone];
        console.log('STRIN', str)
        console.log('this.propsclasculae', this.props)
        var mySubString = str.substring(
            str.indexOf("("),
            str.lastIndexOf(")") + 1
        );
        // console.log('timezon-selectedZone',selectedZone)
        // console.log('timezon-offset',moment(comb).tz(selectedZone).format('Z'))
        var calculatedZoneText = str.replace(mySubString, "(GMT" + moment(comb).tz(selectedZone).format('Z') + ")");
        //console.log('calculatedZoneText',calculatedZoneText)
        const { timeZoneOptions } = this.state;
        timeZoneOptions[selectedZone] = calculatedZoneText;

        this.setState({
            timeZoneOptions: timeZoneOptions
        })
    }
    handleChangeEndDate = date => {
        console.log('handleChangeEndDate' + date)
        let { liveclass } = this.state;
        this.setState({
            liveclass: {
                ...liveclass,
                enddate: date,
            },
        });
    };
    handleChange(e) {
        console.log('handleChange', e.target)
        const { name, value } = e.target;
        let { workout } = this.state;
        if (this.props.cms_model_type === 'edit') this.setState({ enableButton: false });
        this.setState({
            videoLengthError: false,
            videoUrlError: false,
            workout: {
                ...workout,
                [name]: value,
            },
        });
    }
    handleChangeTextEdit = (value) => {
        var textval = value.editor.getData();
        if (this.props.cms_model_type === 'edit' && this.state.workoutDescription !== textval) {
            this.setState({ enableButton: false });
        }
        let { workout } = this.state;
        this.setState({
            editorValue: value,
            workout: {
                ...workout,
                description: value.editor.getData(),
            },
            description: value.editor.getData(),
        });

    };
    handleLiveClassChange(e) {
        const { name, value } = e.target;
        console.log('handleLiveClassChange', name)
        var { liveclass } = this.state;
        console.log('handleLiveClassChange', liveclass)
        var occur, zoomUserId, repeat = 0;
        if (name == 'userId') {
            var newArra = _.filter(this.state.zoomUsers, function (zoomusers) {
                return zoomusers.zoomUserId === value;
            });
            console.log('newArra', newArra)
            zoomUserId = newArra.length ? newArra[0].id : '';
            console.log('zoomUserId', zoomUserId);
            liveclass.zoomUserId = zoomUserId;
        }
        this.setState({ isValidWorkoutId: false, })

        if (this.state.repeatText == 'day') {
            if (name == 'enddate_occur')
                occur = value;
            else if (name == 'repeat_every')
                repeat = value;

            var calc = (occur || liveclass.enddate_occur) > 1 * (repeat || liveclass.repeat_every);
            var newDate = new Date(moment().add(calc - 1, 'days').toString());
            console.log('calculateEndDate' + newDate);
            this.setState({
                liveclass: {
                    ...liveclass,
                    [name]: value,
                    enddate: newDate,
                },
            });
        } else {
            this.setState({
                liveclass: {
                    ...liveclass,
                    [name]: value,
                },
            });
        }
        this.calculateZoneBasedDate();
        console.log('handleLiveClassChange-end', this.state.liveclass)

    }
    handleRecurrenceChange(e) {
        const { name, value } = e.target;
        console.log('handleRecurrenceChange', value)
        var { liveclass } = this.state;

        var textVal = (value == 1) ? 'day' : ((value == 2) ? 'week' : ((value == 3) ? 'month' : 'day'));
        this.setState({
            liveclass: {
                ...liveclass,
                [name]: value,
            },
            repeatText: textVal
        });
    }
    handleMultiSelectChange(selected, type) {
        var newOptions = this.state.optionSelected;
        newOptions[type] = selected;
        console.log('handleMultiSelectChange', newOptions)
        this.setState({
            optionSelected: newOptions
        });
        var videoTypeLiveclass = [];


        if (this.props.cms_model_type === 'edit') this.setState({ enableButton: false });
        if (type == 'condition') {
            var ids = _.map(this.state.optionSelected['condition'], 'value');
            console.log('ids-condition', ids)
            this.getInstructor('', ids);
        }
        if (type == 'classType') {
            videoTypeLiveclass = _.filter(newOptions[type], function (value) {
                return (value.label == constand.Video_Type_Liveclass) ? true : false;
            })
            this.setState({ videoTypeLiveclass: videoTypeLiveclass })
            ////////////////////////////////////////////////////////////
            var selectedEducation = _.filter(this.state.optionSelected['classType'], function (value) {
                return (value.label.toLowerCase() == constand.Tag_Education.toLowerCase()) ? true : false;
            })
            var tagEducation_disc = _.filter(this.state.disciplineOptions, function (value) {
                return (value.label.toLowerCase() == constand.Tag_Education.toLowerCase()) ? true : false;
            });
            var existEducation = _.filter(this.state.optionSelected['discipline'], function (value) {
                return (value.label.toLowerCase() == constand.Tag_Education.toLowerCase()) ? true : false;
            });
            if (existEducation.length == 0 && selectedEducation.length) {
                newOptions['discipline'] = newOptions['discipline'] ? newOptions['discipline'] : [];
                newOptions['discipline'].push(tagEducation_disc[0]);
            } else if (existEducation.length && selectedEducation.length == 0) {
                newOptions['discipline'].splice(this.state.optionSelected['discipline'].findIndex(v => v.label.toLowerCase() == constand.Tag_Education.toLowerCase()), 1);
            }
        }
    };
    handleInstructorChange(selected, type) {
        var newOptions = this.state.optionSelected;
        newOptions[type] = selected;
        if (this.props.cms_model_type === 'edit') this.setState({ enableButton: false });
        this.setState({
            optionSelected: newOptions
        });

    }
    createOption = (label) => ({
        label,
        value: label.toLowerCase().replace(/\W/g, ''),
    });
    handleCreate = (inputValue, type) => {
        //const newOption = this.createOption(inputValue);
        var newValue = this.state.optionSelected;
        //newValue[type].push(newOption);
        var data = { type: type, tag: inputValue }
        var me = this;

        this.props.createNewTag(data).then(function (result) {
            console.log('result', result);
            var data = result.data;
            var type = data.type;
            var newOptionTag = { label: data.tag, value: data.id, tagCount: 0 };
            newValue[type].push(newOptionTag);
            me.setState({ optionSelected: newValue });
            switch (type) {
                case 'videotype':
                    var newOptions = me.state.classTypeOptions;
                    newOptions.push(newOptionTag)
                    console.log('newOptions', newOptions)
                    me.setState({ classTypeOptions: newOptions })
                    break;
                case 'discipline':
                    var newOptions = me.state.disciplineOptions;
                    newOptions.push(newOptionTag)
                    me.setState({ disciplineOptions: newOptions })
                    break;
                case 'benefit':
                    var newOptions = me.state.benefitOptions;
                    newOptions.push(newOptionTag)
                    me.setState({ benefitOptions: newOptions })
                    break;
                case 'equipment':
                    var newOptions = me.state.equipmentOptions;
                    newOptions.push(newValue)
                    me.setState({ equipmentOptions: newOptions })
                    break;
            }
        });
        this.setState({
            isLoading: false,
            optionSelected: newValue,
        });
    };

    handleCheckboxChange(e) //for twoway binding checkbox
    {
        const { name, value } = e.target;
        /* var recurring = this.state.liveclass.recurring;
        let { liveclass } = this.state;

        this.setState({
            liveclass: {
                ...liveclass,
                recurring: !recurring,
            },
        }); */
        var isPhysioLed = this.state.workout.isPhysioLed;
        let { workout } = this.state;
        if (this.props.cms_model_type === 'edit' && this.state.workout.isPhysioLed !== (!isPhysioLed)) {
            this.setState({ enableButton: false });
        }
        this.setState({
            workout: {
                ...workout,
                isPhysioLed: !isPhysioLed,
            },
        });
    }
    handleMultiCheckboxChange(e) {
        var item = e.target.value;
        var temp = [];
        if (this.state.liveclass.occurson.length > 0) {
            temp = [...this.state.liveclass.occurson];
            var index = this.state.liveclass.occurson.findIndex(x => x === item);

            if (index > -1) {
                temp.splice(index, 1);
            } else {
                temp.push(item);
            }
        } else {
            temp = [...this.state.liveclass.occurson];
            temp.push(item);
        }
        this.state.liveclass.occurson = temp;
    }
    clearState() {
        this.setState({
            submitted: false,
            loading: false
        });
    }

    closeModel() { //for close the login model
        this.clearState();

        if (!this.state.enableButton) {
            this.setState({ openModel: true });
        } else {
            this.props.ondemandCMSModelOpen(false);
        }
    }

    onImageChange = event => {
        if (event.target.files && event.target.files[0]) {
            this.props.imageCropOpenPopup(true)
            this.setState({ imageModel: true });
            var Pic = URL.createObjectURL(event.target.files[0]);
            let { workout } = this.state;

            this.setState({
                workout: {
                    ...workout,
                    postFile: event.target.files[0],
                    videoImg: Pic
                },
            });
            // this.setState({ postFile: event.target.files[0], videoImg: Pic });
            //this.props.updateUserdataRedex(newValue);
        }
    };
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('/');
    }
    normalTorails(time, ampm) {
        var returnvalue = "";
        if (time) {
            var extractTime = time.split(":");
            var hrs = extractTime[0];
            var mins = extractTime[1];
            if (ampm === 'PM') {
                hrs = parseInt(hrs);
                hrs = hrs + 12;
                if (hrs === 24) {
                    hrs = '00';
                }
                hrs = hrs.toString();
                if (hrs.length < 2) {
                    hrs = '0' + hrs;
                }
            }
            returnvalue = hrs + ':' + mins + ':' + '00';
        }
        return returnvalue;
    }
    onSubmitWorkout() { //for submit workout
        this.setState({ submitted: true });
        const { optionSelected, workout, videoTypeLiveclass } = this.state;
        console.log('onSubmitWorkout', this.state)
        // stop here if form is invalid
        if (!workout.title || !workout.vlength || !optionSelected['instructorUser'] || !optionSelected['condition'] || !workout.description) {
            return;
        }
        if (videoTypeLiveclass.length > 0 && optionSelected['recordingof'].length == 0) {
            return;
        }
        if (workout.vlength && String(workout.vlength).match(/^[0-9\b]+$/) == null) {
            this.setState({ videoLengthError: true })
            return;
        }
        this.setState({ loading: true });
        console.log('this.state.optionSelected', this.state.optionSelected)
        let postData = new FormData();
        postData.append("title", this.state.workout.title);
        postData.append("videoActualUrl", '');
        postData.append("length", this.state.workout.vlength);
        postData.append("videotype", JSON.stringify(this.state.optionSelected['classType']));
        postData.append("discipline", JSON.stringify(this.state.optionSelected['discipline']));
        postData.append("condition", JSON.stringify(this.state.optionSelected['condition']));
        postData.append("instructorId", JSON.stringify(this.state.optionSelected['instructorUser'][0].value));
        postData.append("benefit", JSON.stringify(this.state.optionSelected['benefit']));
        postData.append("equipment", JSON.stringify(this.state.optionSelected['equipment']));
        postData.append("level", JSON.stringify(this.state.optionSelected['level']));
        postData.append("recordingof", JSON.stringify(this.state.optionSelected['recordingof'].value));
        postData.append("description", this.state.workout.description.toString('html').replace(/<a /g, '<a target="_blank" '));
        postData.append("isLive", this.state.workout.isLive);
        postData.append("videoImg", this.state.workout.postFile);
        postData.append("functionalType", "liveclass");
        postData.append("isPhysioLed", this.state.workout.isPhysioLed);
        /*         postData.append("liveclass", JSON.stringify(this.state.liveclass));
                postData.append("start_time", start_time);
         */
        if (this.props.group) {
            postData.append("communityId", this.props.groupId);
        }
        if (this.state.workoutId) {
            postData.append("workoutId", this.state.workoutId);
            var url = constand.BACKEND_URL + "/api/ondemand/update";
        }
        else
            var url = constand.BACKEND_URL + "/api/ondemand/create";
        let authData;
        if (localStorage.getItem('userAuthToken')) {
            authData = JSON.parse(localStorage.getItem('userAuthToken'));
        } else {
            authData = JSON.parse(localStorage.getItem("user"));
        }

        const config = {
            headers: {
                "content-type": "multipart/form-data",
                Authorization: authData.token
            }
        };
        axios
            .post(url, postData, config)
            .then(response => {
                var resdata = response.data;
                if (this.state.workoutId) {
                    if (resdata.status) {
                        toast.success('Live class updated successfully.');
                    } else {
                        toast.error('Failed to update Live class.');
                    }
                } else {
                    if (resdata.status) {
                        toast.success('Live class created successfully.');
                    } else {
                        toast.error('Failed to create Live class.');
                    }
                }
                //this.props.getList();
                var selectedCondition = commonService.replaceChar((this.state.optionSelected['condition'][0].label), false);
                Cookies.set('condition', selectedCondition)
                this.setState({ loading: false, workoutId: resdata.workout.id, saveClassError: false, submitted: false, savePollError: false, enableButton: true })
                var groupId = null
                if (this.props.group) {
                    groupId = this.props.groupId;
                }
                this.props.liveclassDetail(this.state.workoutId, selectedCondition, null, groupId);
                if (this.props.logged_userData.isStudyLeader) {
                    //this.props.clearOndemandList();
                    //this.closeModel()
                    window.location.href = '/liveclasses/' + selectedCondition;
                }
            }, error => {
                this.setState({ error: error, loading: false, submitted: false, enableButton: true });
            })
    }
    async checkWatchPartyWorkoutId() {
        var conditionName = commonService.replaceChar(Cookies.get('condition'), true);
        var params = { watchPartyWorkoutId: this.state.liveclass.watchPartyWorkoutId, conditionName: conditionName }
        return this.props.checkWatchPartyWorkoutId(params).then(response => {
            if (!response.isValidWorkoutId) {
                this.setState({
                    isValidWorkoutId: true,
                    loading: false,
                    submitted: false,
                    enableButton: true
                });
            }
            return response.isValidWorkoutId;
        }, error => {
            this.setState({ error: error, loading: false, submitted: false, enableButton: true });
            return false;
        })
    }

    async addToSchedule(item, key) { //for submit zoom
        var conditionName = commonService.replaceChar(Cookies.get('condition'), true);
        this.setState({ submittedSchedule: true });
        var comb = this.formatDate(this.state.liveclass.startdate) + ' ' + (this.state.liveclass.whentime) + ' ' + (this.state.liveclass.whenam);
        var tzoffset = (new Date(comb)).getTimezoneOffset() * 60000; //offset in milliseconds
        var start_time = (new Date(new Date(comb) - tzoffset)).toISOString() //.slice(0, -1);
        var utc_start_time = new Date(new Date(comb).toUTCString()).toISOString(); //.slice(0, -1);
        console.log('localISOTime*********', start_time)

        console.log('classlist***', this.state.classList);
        var duplication_found = _.filter(this.state.classList, function (classItems) {
            return classItems.scheduledFor === utc_start_time;
        });

        if (duplication_found.length > 0) {
            //this.setState({ duplication_error: true })
            toast.error('Oops! There is already a class at that time.')
            return;
        }
        // return;
        var params = this.state.liveclass;
        console.log('params', params)
        params.workoutId = this.state.workoutId;
        params.start_time = start_time;
        params.conditionName = conditionName;
        var type = 'add';
        if (item) {
            params.reference = item.reference;
            params.roomId = item.id;
            type = 'edit';
            if (!this.state.liveclass.reason && item.Attendees.length > 0)
                return;
        }
        if (this.props.group) {
            params.group = this.props.groupId;
        }
        console.log('addToSchedule', params)
        if (!this.state.liveclass.userId)
            return;
        if (this.state.liveclass.watchPartyWorkoutId) {
            var isValidId = await this.checkWatchPartyWorkoutId();
            if (!isValidId) //invalid workout id
                return;
        }
        this.setState({ loadingSchedule: true, })
        this.props.createZoomMeeting(params, type).then(response => {
            var resdata = response;
            if (resdata.status) {
                if (type == 'add') {
                    var startdate = this.state.liveclass.startdate
                    startdate.setDate(startdate.getDate() + 7);
                    var newItems = [...this.state.classList];
                    if (response.room) {
                        if (!response.room.Attendees)
                            response.room.Attendees = [];
                        newItems.push(response.room);
                    }

                    newItems = _.sortBy(newItems, function (o) { return new moment(o.scheduledFor); });
                    this.setState({
                        classList: newItems,
                        startdate: startdate
                    })

                    var comb = this.formatDate(startdate) + ' ' + (this.state.liveclass.whentime) + ' ' + (this.state.liveclass.whenam);
                    this.calculateZoneBasedDate(comb);
                } else {
                    var newItems = [...this.state.classList];
                    newItems[key].scheduledFor = response.room.scheduledFor;
                    newItems = _.sortBy(newItems, function (o) { return new moment(o.scheduledFor); });
                    console.log('newItems', newItems);
                    const { classList } = this.state;
                    this.setState({
                        classList: newItems
                    })
                    this.resetZoom();
                }


                toast.success(type == 'add' ? 'Class added to timetable successfully.' : 'Class updated in timetable successfully');
            } else {
                toast.error(type == 'add' ? 'Failed to create timetable for class.' : 'Failed to update timetable of the class.');
            }
            this.setState({ loadingSchedule: false });
        }, error => {
            toast.error(type == 'add' ? 'Failed to create timetable for class.' : 'Failed to update timetable of the class.');
            this.setState({ loadingSchedule: false });
        })
    }
    confirmCancel(item, key) { //for submit zoom cancellation
        var conditionName = commonService.replaceChar(Cookies.get('condition'), true);
        this.setState({ submittedSchedule: true });
        var params = this.state.liveclass;
        params.workoutId = this.state.workoutId;
        params.reference = item.reference;
        params.roomId = item.id;
        params.conditionName = conditionName;

        if (item.Attendees.length > 0) {
            if (!this.state.liveclass.reason)
                return;
        }
        console.log('confirmcancel', params)

        this.setState({ loadingSchedule: true, })
        this.props.cancelZoomMeeting(params).then(response => {
            var resdata = response;
            if (resdata.status) {
                const newItems = [...this.state.classList];
                newItems.splice(key, 1);
                this.setState({
                    classList: newItems,
                    cancelSec: ''
                });
                toast.success('Class cancelled in timetable successfully.');
            } else {
                toast.error('Failed to cancel timetable of the class.');
            }
            this.setState({ loadingSchedule: false });
        }, error => {
            toast.error('Failed to cancel timetable of the class.');
            this.setState({ loadingSchedule: false });
        })
    }
    updateFreeClass(item, key) { //for submit zoom cancellation
        this.setState({ submittedSchedule: true });
        var params = {};
        params.isFree = !item.isFree ? 1 : 0;
        params.roomId = item.id;
        console.log('updateFreeClass', params)
        this.setState({ loadingSchedule: true, })
        this.props.updateFreeLiveclass(params).then(response => {
            var resdata = response;
            if (resdata.status) {
                const newItems = [...this.state.classList];
                newItems[key].isFree = !item.isFree;
                const { classList } = this.state;
                this.setState({
                    classList: newItems
                })
                toast.success('Class updated in timetable successfully.');
            } else {
                toast.error('Failed to update timetable of the class.');
            }
            this.setState({ loadingSchedule: false });
        }, error => {
            toast.error('Failed to update timetable of the class.');
            this.setState({ loadingSchedule: false });
        })
    }
    deletePollData(pollId, key) {

        this.props.deletePoll({ pollId: pollId }).then(response => {
            if (response.status) {
                var { pollList } = this.state;
                pollList.splice(key, 1);
                this.setState({ pollList: pollList });
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        })
    }
    renderAddScheduleSection(type, item, key) {
        const { submittedSchedule, loadingSchedule } = this.state;
        const ExampleCustomInput = function ({ value, onClick }) {
            value = moment(value).format('dddd D MMMM');
            console.log('ExampleCustomInput', value)
            return (
                <div>
                    <input className="form-control popup-txt float-left w-90" value={value} type="text" name="startdate" onClick={onClick} />
                    <span className="float-right"><i onClick={onClick} aria-hidden="true" className="fa fa-calendar"></i></span>
                </div>
            )
        };
        return (
            <div>
                <div class="col-lg-12 col-md-12 col-sm-12 m-b-10">
                    <div class="row">
                        <label class="control-label font-book label-text col-md-3 col-3 pb-10" htmlFor="fname">Schedule For</label>
                        <div class="col-md-9 col-9">
                            {/* {this.state.liveclass} */}
                            <div className="dropdown ">
                                <select name="userId"
                                    disabled={this.state.liveclass.isPreset}
                                    value={this.state.liveclass.userId}
                                    className="form-control popup-txt"
                                    onChange={this.handleLiveClassChange}
                                    placeholder="Select User"
                                >
                                    <option className="pointer" value=''>Select User</option>
                                    {this.state.zoomUsers.map((item, key) => {
                                        return (
                                            <option className="pointer" key={"time_" + item.id} value={item.zoomUserId}>
                                                {item.first_name} {item.last_name}
                                            </option>
                                        );
                                    })}
                                </select>
                                {submittedSchedule && !this.state.liveclass.userId && (
                                    <div className="text-danger">This is required</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 m-b-10">
                    <div class="row">
                        <label class="control-label font-book label-text col-md-3 col-3 pb-10" for="fname">When</label>
                        <div class="col-md-5 col-9 liveclass-instance">
                            <DatePicker
                                selected={this.state.liveclass.startdate}
                                onChange={this.handleChangeDate}
                                minDate={new Date()}
                                customInput={<ExampleCustomInput />}
                            />
                        </div>
                        <div class="col-md-2 col-8 p-0">
                            <div className="dropdown ">
                                <select name="whentime"
                                    value={this.state.liveclass.whentime}
                                    className="form-control popup-txt"
                                    onChange={this.handleLiveClassChange}
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
                        <div class="col-md-2 col-8">
                            <div className="dropdown ">
                                <select name="whenam"
                                    value={this.state.liveclass.whenam}
                                    className="form-control popup-txt"
                                    onChange={this.handleLiveClassChange}
                                >
                                    {this.state.amPmList.map((item, key) => {
                                        return (
                                            <option className="pointer" key={"ampm_" + item} value={item}>
                                                {item}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 m-b-10">
                    <div class="row">
                        <label class="control-label font-book label-text col-md-3 col-3 pb-10" for="fname">Time Zone</label>
                        <div class="col-md-9 col-9">
                            <div className="dropdown ">
                                <select name="timezone"
                                    value={this.state.liveclass.timezone}
                                    className="form-control popup-txt"
                                    onChange={this.handleLiveClassChange}
                                >
                                    <option className="pointer" value="">Select Timezone
                                    </option>
                                    {Object.keys(this.state.timeZoneOptions).map((key) => {
                                        return (
                                            <option className="pointer" key={"time_" + key} value={key}>
                                                {this.state.timeZoneOptions[key]}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 m-b-10">
                    <div class="row">
                        <label class="control-label font-book label-text col-md-3 col-3 pb-10" for="fname">Watch Party Workout Id</label>
                        <div class="col-md-3 col-3">
                            <input
                                className="form-control popup-txt float-right"
                                type="text"
                                id="watchPartyWorkoutId"
                                aria-describedby="emailHelp"
                                placeholder=""
                                name="watchPartyWorkoutId"
                                key={key}
                                value={this.state.liveclass.watchPartyWorkoutId}
                                onChange={this.handleLiveClassChange} />
                            {this.state.isValidWorkoutId && this.state.liveclass.watchPartyWorkoutId && (
                                <div className="text-danger">Invalid watch party workout id</div>
                            )}
                        </div>
                    </div>
                </div>
                {type == 'edit' && item.Attendees.length > 0 &&
                    <div>
                        <div class="col-lg-12 col-md-12 col-sm-12 m-b-10">
                            <p className="font-semibold">Please provide an explanation of why this class has been changed (this text will directly be used in an email to explain to anyone signed up why the class has changed)</p>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 m-b-10">
                            <textarea
                                className="form-control"
                                rows="3"
                                name="reason"
                                onChange={this.handleLiveClassChange}
                                value={this.state.liveclass.reason}></textarea>
                            {submittedSchedule && !this.state.liveclass.reason && (
                                <div className="text-danger">This is required</div>
                            )}
                        </div>
                    </div>
                }

                <div className="col-md-12 text-center p-0 m-b-15">
                    <div className="row">
                        <div className="mx-auto col-md-6">
                            <button
                                disabled={loadingSchedule || this.state.isValidWorkoutId}
                                onClick={() => this.addToSchedule(item, key)}
                                className=" btn btn-block mybtn btn-login tx-tfm font-book font-16"
                            >{type == 'add' ? 'Add to schedule' : 'Change Class'}</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    renderCancelSection(item, key) {
        const { submittedSchedule, loadingSchedule } = this.state;

        return (
            <div>
                {item.Attendees.length > 0 &&
                    <div>
                        <div class="col-lg-12 col-md-12 col-sm-12 m-b-10">
                            <p className="font-semibold">Please provide an explanation of why this class is cancelled (this text will directly be used in an email to explain to anyone signed up why the class is cancelled)</p>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 m-b-10">
                            <textarea
                                className="form-control"
                                rows="3"
                                name="reason"
                                onChange={this.handleLiveClassChange}
                                value={this.state.liveclass.reason}></textarea>
                            {submittedSchedule && !this.state.liveclass.reason && (
                                <div className="text-danger">This is required</div>
                            )}
                        </div>
                    </div>
                }
                <div className="col-md-12 text-center p-0 m-b-15">
                    <div className="row">
                        <div className="mx-auto col-md-6">
                            <button
                                disabled={loadingSchedule}
                                onClick={() => this.confirmCancel(item, key)}
                                className=" btn btn-block mybtn btn-login tx-tfm font-book font-16"
                            >Confirm cancellation</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    render() {
        var isResearchCondition = Cookies.get('condition').toLowerCase().includes('research');
        var conditionName = commonService.replaceChar(Cookies.get('condition'), true);

        const EndDate = ({ value, onClick }) => (
            <div>
                <input className="form-control popup-txt float-left w-80" value={value} type="text" name="enddate" />
                <span className="float-right"><i onClick={onClick} aria-hidden="true" className="fa fa-calendar"></i></span>
            </div>
        );

        var me = this;
        function returnDisplayDateFormate() {
            var currenDate = me.state.selectedDay;
            console.log('current', currenDate)
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
        const { submitted, loading, showZoomOptions, submittedSchedule, loadingSchedule } = this.state;
        var imageModel = false;
        return (
            <React.Fragment>
                {this.state.imageModel &&
                    <ImageCropperComponent crop={this.state.crop} aspectRatio={7 / 4} width={800} height={485} src={this.state.workout.videoImg} text="Upload Thumbnail" />
                }

                <Modal
                    className="removebbg-popup"
                    open={this.props.is_cms_model}
                    onClose={this.onCloseModel}
                    center
                >
                    <div className={(Cookies.get('closeBanner') == 'false' && !this.props.close_banner) ? "modal-dialog modal-width--custom cms-model m-t-80" : "modal-dialog modal-width--custom cms-model m-t-80"} role="document">
                        <div className="modal-content">
                            <div className={("modal-header header-styling ") + ((this.props.logged_userData.isGroupLeader && this.props.logged_userData.GLCondition.indexOf(conditionName) != -1 && this.props.logged_userData.SLCondition.indexOf(conditionName) == -1) || this.props.logged_userData.isStudyLeader || this.props.logged_userData.isCreator || this.props.is_group_leader ? 'h-auto' : '')}>
                                {(!this.props.group || (this.props.group && !this.state.workout.Instructor)) &&
                                    <h5
                                        className="modal-title text-left col-md-11 p-0 font-semibold"
                                        id="exampleModalLabel font-medium"
                                    >
                                        {(this.props.cms_model_type == 'edit' ? 'Modify a Live Class' : 'Add a Live Class')}
                                    </h5>
                                }
                                {this.props.group && this.state.workout.Instructor && ((this.props.logged_userData.isGroupLeader && this.props.logged_userData.GLCondition.indexOf(conditionName) != -1 && this.props.logged_userData.SLCondition.indexOf(conditionName) == -1) || this.props.logged_userData.isStudyLeader || this.props.logged_userData.isCreator || this.props.is_group_leader) &&
                                    <h5 class="modal-title text-left col-md-11 p-0 font-semibold" id="exampleModalLabel font-medium">
                                        <p class="col-md-12 m-0 modal-title text-left p-0 font-semibold">{this.props.group} - {this.state.workout.title}</p>
                                        <p class="col-md-12 font-18 modal-title m-0 text-left p-0">{' Instructor : ' + this.state.workout.Instructor.User.name + " " + this.state.workout.Instructor.User.lastName}</p>
                                    </h5>
                                }
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
                            <div className="modal-body body-padding--value pb-0">
                                {((!this.props.group && this.props.logged_userData.isStudyLeader) || ((this.props.logged_userData.isCreator || this.props.is_group_leader) && !isResearchCondition)) &&
                                    <div>
                                        <div className="avatar-upload col-md-12 clearfix p-0 m-t-20 m-b-20">
                                            <div className="ondemand-preview">

                                                {!this.state.workout.videoImg && <img
                                                    className="img-fluid"
                                                    src={
                                                        constand.WEB_IMAGES + "ondemand-placeholder.png"
                                                    }
                                                />}
                                                {!this.state.isCropped && this.state.workout.videoImg && <img
                                                    className="img-fluid"
                                                    src={
                                                        constand.WORKOUT_IMG_PATH +
                                                        this.state.workout.videoImg
                                                    }
                                                    onError={(e) => commonService.checkImageCrop(e, 'ondemand-placeholder.png')}
                                                />}
                                                {this.state.isCropped && this.state.workout.videoImg && <img
                                                    className="img-fluid"
                                                    src={
                                                        this.state.workout.videoImg
                                                    }
                                                    onError={(e) => commonService.checkImageCrop(e, 'ondemand-placeholder.png')}
                                                />}

                                            </div>
                                            <a
                                                className="font-book font-16 upload-btn color-blue"
                                                href="javascript:void(0)"
                                                onClick={() => {
                                                    document.getElementById("post_image").click();
                                                }}
                                            >
                                                <u>Upload Thumbnail</u>
                                                {<input
                                                    type="file"
                                                    onChange={this.onImageChange}
                                                    onClick={(event) => {
                                                        event.target.value = null
                                                    }}
                                                    className="filetype"
                                                    style={{ display: "none" }}
                                                    accept="image/x-png,image/jpg,image/jpeg"
                                                    id="post_image"
                                                />}
                                            </a>
                                        </div>
                                        <div
                                            className={
                                                "form-group" +
                                                (submitted && !this.state.workout.title ? " has-error" : "")
                                            }
                                        >
                                            <label
                                                htmlFor="exampleInputEmail1"
                                                className="font-semibold black-txt"
                                            >
                                                Class Name <span className="orangefont">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="title"
                                                aria-describedby="emailHelp"
                                                placeholder=""
                                                name="title"
                                                value={this.state.workout.title}
                                                onChange={this.handleChange}
                                            />
                                            {this.state.workout.title ? (
                                                <div className="pull-right font-13 twitter-color mt-1">
                                                    Characters Left: {constand.Input_Text_Limit - this.state.workout.title.length}
                                                </div>
                                            ) : null}
                                            {submitted && !this.state.workout.title && (
                                                <div className="text-danger">Class Name is required</div>
                                            )}
                                        </div>
                                        {!this.props.logged_userData.isStudyLeader &&
                                            <div
                                                className={
                                                    "form-group" +
                                                    (submitted && this.state.optionSelected['condition'] && this.state.optionSelected['condition'].length == 0 ? " has-error" : "")
                                                }
                                            >
                                                <label
                                                    htmlFor="exampleInputEmail1"
                                                    className="font-semibold black-txt"
                                                >
                                                    Condition(s) <span className="orangefont">*</span>
                                                </label>
                                                <MultiSelectComponent
                                                    className="select-container text-capitalize"
                                                    options={this.state.conditionOptions}
                                                    isMulti
                                                    placeholder="Select Condition"
                                                    closeMenuOnSelect={false}
                                                    hideSelectedOptions={false}
                                                    components={{
                                                        Option,
                                                        MultiValue,
                                                        ValueContainer,
                                                        animatedComponents
                                                    }}
                                                    onChange={this.handleMultiSelectChange}
                                                    onCreateOption={(value) => this.handleCreate(value, 'condition')}
                                                    allowSelectAll={true}
                                                    creatable={false}
                                                    value={this.state.optionSelected['condition']}
                                                    name="condition"
                                                    removeTag={this.removeTag}
                                                    isRemoveable={true}
                                                />

                                                {submitted && this.state.optionSelected.condition && this.state.optionSelected.condition.length == 0 && (
                                                    <div className="text-danger">Condition is required</div>
                                                )}
                                            </div>
                                        }
                                        <div
                                            className={
                                                "form-group" +
                                                (submitted && (!this.state.optionSelected.instructorUser || this.state.optionSelected.instructorUser.length == 0) ? " has-error" : "")
                                            }
                                        >
                                            <label
                                                htmlFor="exampleInputEmail1"
                                                className="font-semibold black-txt"
                                            >
                                                Instructor <span className="orangefont">*</span>
                                            </label>
                                            <MultiSelectComponent
                                                isMulti
                                                className="select-container text-capitalize"
                                                options={this.state.optionSelected['instructorUser'] == null
                                                    ? this.state.instructorOptions
                                                    : (this.state.optionSelected['instructorUser'] && this.state.optionSelected['instructorUser'].length === constand.CONSTONE
                                                        ? []
                                                        : this.state.instructorOptions)}
                                                noOptionsMessage={() => {
                                                    return this.state.optionSelected['instructorUser'] == null
                                                        ? false
                                                        : this.state.optionSelected['instructorUser'] && this.state.optionSelected['instructorUser'].length === constand.CONSTONE
                                                            ? "You've reached the max number of options."
                                                            : "No options available";
                                                }}
                                                placeholder="Select Instructor"
                                                closeMenuOnSelect={true}
                                                hideSelectedOptions={false}
                                                components={{
                                                    Option,
                                                    MultiValue,
                                                    ValueContainer,
                                                    animatedComponents
                                                }}
                                                onChange={this.handleInstructorChange}
                                                allowSelectAll={false}
                                                creatable={false}
                                                value={this.state.optionSelected['instructorUser']}
                                                name="instructorUser"
                                            />
                                            {submitted && (!this.state.optionSelected.instructorUser || this.state.optionSelected.instructorUser.length == 0) && (
                                                <div className="text-danger">Instructor is required</div>
                                            )}
                                        </div>

                                        <div className="row col-md-12">
                                            <div
                                                className={
                                                    "w-50 form-group" +
                                                    (submitted && (!this.state.workout.vlength || (this.state.workout.vlength && this.state.videoLengthError)) ? " has-error" : "")
                                                }
                                            >
                                                <label
                                                    htmlFor="exampleInputEmail1"
                                                    className="font-semibold black-txt"
                                                >
                                                    Class Length (minutes) <span className="orangefont">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="vlength"
                                                    aria-describedby="emailHelp"
                                                    placeholder=""
                                                    name="vlength"
                                                    value={this.state.workout.vlength}
                                                    onChange={this.handleChange}
                                                />
                                                {submitted && !this.state.workout.vlength && (
                                                    <div className="text-danger">Video Length is required</div>
                                                )}
                                                {submitted && this.state.workout.vlength && this.state.videoLengthError && (
                                                    <div className="text-danger">Video Length should be number</div>
                                                )}
                                            </div>
                                            <div className="col-md-6">
                                                <label class="m-t-5 pull-left" for="isPhysioLed">
                                                    <input type="checkbox" name="isPhysioLed" id="isPhysioLed" value={this.state.workout.isPhysioLed} onChange={this.handleCheckboxChange} checked={this.state.workout.isPhysioLed} />
                                                </label>
                                                <label class="font-semibold black-txt m-l-5"> Physio Led</label>

                                            </div>
                                        </div>
                                        <div
                                            className={
                                                "form-group"
                                            }
                                        >
                                            <label
                                                htmlFor="exampleInputEmail1"
                                                className="font-semibold black-txt"
                                            >
                                                Discipline
                                            </label>
                                            <MultiSelectComponent
                                                className="select-container text-capitalize"
                                                options={this.state.disciplineOptions}
                                                isMulti
                                                placeholder="Select Discipline"
                                                closeMenuOnSelect={false}
                                                hideSelectedOptions={false}
                                                components={{
                                                    Option,
                                                    MultiValue,
                                                    ValueContainer,
                                                    animatedComponents
                                                }}
                                                onChange={this.handleMultiSelectChange}
                                                onCreateOption={(value) => this.handleCreate(value, 'discipline')}
                                                allowSelectAll={false}
                                                creatable={this.state.isTagCreatable}
                                                value={this.state.optionSelected['discipline']}
                                                name='discipline'
                                                removeTag={this.removeTag}
                                                isRemoveable={this.state.isTagCreatable}
                                            />
                                        </div>
                                        <div
                                            className={
                                                "form-group" +
                                                (submitted && this.state.optionSelected.classType.length == 0 ? " has-error" : "")
                                            }
                                        >
                                            <label
                                                htmlFor="exampleInputEmail1"
                                                className="font-semibold black-txt"
                                            >
                                                Class Type <span className="orangefont">*</span>
                                            </label>
                                            <MultiSelectComponent
                                                className="select-container text-capitalize"
                                                options={this.state.optionSelected['classType'] == null
                                                    ? this.state.classTypeOptions
                                                    : (this.state.optionSelected['classType'] && this.state.optionSelected['classType'].length === constand.CONSTONE
                                                        ? []
                                                        : this.state.classTypeOptions)}
                                                noOptionsMessage={() => {
                                                    return this.state.optionSelected['classType'] == null
                                                        ? false
                                                        : this.state.optionSelected['classType'] && this.state.optionSelected['classType'].length === constand.CONSTONE
                                                            ? "You've reached the max number of options."
                                                            : "No options available";
                                                }}
                                                isMulti
                                                placeholder="Select Class Type"
                                                closeMenuOnSelect={true}
                                                hideSelectedOptions={false}
                                                components={{
                                                    Option,
                                                    MultiValue,
                                                    ValueContainer,
                                                    animatedComponents
                                                }}
                                                onChange={this.handleMultiSelectChange}
                                                onCreateOption={(value) => this.handleCreate(value, 'classType')}
                                                allowSelectAll={false}
                                                creatable={this.state.isTagCreatable}
                                                value={this.state.optionSelected['classType']}
                                                name='classType'
                                                removeTag={this.removeTag}
                                                isRemoveable={false}
                                            />
                                            {submitted && this.state.optionSelected.classType.length == 0 && (
                                                <div className="text-danger">Class Type is required</div>
                                            )}
                                        </div>
                                        <div
                                            className={
                                                "form-group"
                                            }
                                        >
                                            <label
                                                htmlFor="exampleInputEmail1"
                                                className="font-semibold black-txt"
                                            >
                                                Level
                                            </label>
                                            <MultiSelectComponent
                                                isMulti
                                                className="select-container text-capitalize"
                                                /* options={this.state.optionSelected['level'] == null
                                                    ? this.state.levelOptions
                                                    : this.state.optionSelected['level'].length === constand.CONSTONE
                                                        ? []
                                                        : this.state.levelOptions
                                                }
                                                noOptionsMessage={() => {
                                                    return this.state.optionSelected['level'] == null
                                                        ? false
                                                        : this.state.optionSelected['level'].length === constand.CONSTONE
                                                            ? "You've reached the max number of options."
                                                            : "No options available";
                                                }} */
                                                options={this.state.levelOptions}
                                                placeholder="Select Level"
                                                closeMenuOnSelect={false}
                                                hideSelectedOptions={false}
                                                components={{
                                                    Option,
                                                    MultiValue,
                                                    ValueContainer,
                                                    animatedComponents
                                                }}
                                                onChange={this.handleMultiSelectChange}
                                                onCreateOption={(value) => this.handleCreate(value, 'level')}
                                                allowSelectAll={false}
                                                creatable={false}
                                                value={this.state.optionSelected['level']}
                                                name="level"
                                                removeTag={this.removeTag}
                                                isRemoveable={this.state.isTagCreatable}
                                            />
                                        </div>
                                        <div
                                            className={
                                                "form-group"
                                            }
                                        >
                                            <label
                                                htmlFor="exampleInputEmail1"
                                                className="font-semibold black-txt"
                                            >
                                                Benefits
                                            </label>
                                            <MultiSelectComponent
                                                className="select-container text-capitalize"
                                                options={this.state.benefitOptions}
                                                isMulti
                                                placeholder="Select Benefits"
                                                closeMenuOnSelect={false}
                                                hideSelectedOptions={false}
                                                components={{
                                                    Option,
                                                    MultiValue,
                                                    ValueContainer,
                                                    animatedComponents
                                                }}
                                                onChange={this.handleMultiSelectChange}
                                                onCreateOption={(value) => this.handleCreate(value, 'benefit')}
                                                allowSelectAll={false}
                                                creatable={this.state.isTagCreatable}
                                                value={this.state.optionSelected['benefit']}
                                                name="benefit"
                                                removeTag={this.removeTag}
                                                isRemoveable={this.state.isTagCreatable}
                                            />
                                        </div>
                                        <div
                                            className={
                                                "form-group"
                                            }
                                        >
                                            <label
                                                htmlFor="exampleInputEmail1"
                                                className="font-semibold black-txt"
                                            >
                                                Equipment
                                            </label>
                                            <MultiSelectComponent
                                                className="select-container text-capitalize"
                                                options={this.state.equipmentOptions}
                                                isMulti
                                                placeholder="Select Equipment"
                                                closeMenuOnSelect={false}
                                                hideSelectedOptions={false}
                                                components={{
                                                    Option,
                                                    MultiValue,
                                                    ValueContainer,
                                                    animatedComponents
                                                }}
                                                onChange={this.handleMultiSelectChange}
                                                onCreateOption={(value) => this.handleCreate(value, 'equipment')}
                                                allowSelectAll={false}
                                                creatable={this.state.isTagCreatable}
                                                value={this.state.optionSelected['equipment']}
                                                name='equipment'
                                                removeTag={this.removeTag}
                                                isRemoveable={this.state.isTagCreatable}
                                            />
                                            {/* <select
                                        value={this.state.workout.equipment}
                                        className="form-control"
                                        onChange={this.handleChange}
                                        name="equipment"
                                    >
                                        <option>Select Equipment</option>
                                        {this.state.equipmentOptions.map((item, key) => {
                                            return (
                                                <option key={"equipment_" + item.id} value={item.id}>
                                                    {item.tag}
                                                </option>
                                            );
                                        })}
                                    </select> */}
                                        </div>
                                        <div
                                            className={
                                                "form-group" +
                                                (submitted && !this.state.workout.description ? " has-error" : "")
                                            }
                                        >
                                            <label
                                                htmlFor="exampleInputEmail1"
                                                className="font-semibold black-txt"
                                            >
                                                Class Description <span className="orangefont">*</span>
                                            </label>
                                            {/* <RichTextEditor
                                        className="richText font-qregular"
                                        toolbarConfig={toolbarConfig}
                                        value={this.state.editorValue}
                                        onChange={this.handleChangeTextEdit}
                                    /> */}
                                            <CKEditor
                                                data={this.state.description}
                                                config={{
                                                    toolbar: [
                                                        ['Bold', 'Italic'],
                                                        ['NumberedList', 'BulletedList'],
                                                        ['Link', 'Unlink'],
                                                        ['Image', 'Table']
                                                    ],
                                                    height: '300px',
                                                    resize_enabled: false,
                                                    font_defaultLabel: 'Qregular',
                                                    fontSize_defaultLabel: '28px',
                                                    //addCss: ('body {font-size: 10px}'),
                                                    contentsCss: '../../../ckeditor.css',
                                                    stylesSet: [
                                                        {
                                                            element: 'p',
                                                            styles: { 'font-family': '#(Qregular)' },
                                                            overrides: [{ element: 'font', attributes: { 'face': null } }]
                                                        }
                                                    ],
                                                    font_style:
                                                        [{
                                                            element: 'p',
                                                            styles: { 'font-family': '#(Qregular)' },
                                                            overrides: [{ element: 'font', attributes: { 'face': null } }]
                                                        }
                                                        ],
                                                    font_names: 'Qregular'
                                                }}
                                                onChange={(value) => { this.handleChangeTextEdit(value) }}
                                                onBeforeLoad={(CKEDITOR) => CKEDITOR.on('dialogDefinition', ev => {
                                                    if (ev.data.name == 'link') {
                                                        ev.data.definition.getContents('target').get('linkTargetType')['default'] = '_blank';
                                                        ev.data.definition.getContents('info').get('protocol')['default'] = 'https://';
                                                    }
                                                })}

                                            />

                                            {submitted && !this.state.workout.description && (
                                                <div className="text-danger">Description is required</div>
                                            )}
                                        </div>
                                        <div className="col-md-12 text-center p-0 m-b-15">
                                            <div className="row">
                                                {/*<div className="col-md-4">
                                             <label className="m-t-5 pull-left" htmlFor="isLive">
                                                <input type="checkbox" name="isLive" id="isLive" defaultChecked={this.state.workout.isLive} onChange={this.handleCheckboxChange} value={this.state.workout.isLive} />
                                            </label>
          0                                  <span className="font-semibold black-txt">List this Live Class</span> 
                                        </div>
                                        */}
                                                {this.props.cms_model_type === 'edit' ? (
                                                    <div className="offset-md-6 col-md-6 col-sm-12">
                                                        <button
                                                            disabled={this.state.enableButton}
                                                            onClick={this.onSubmitWorkout}
                                                            className=" btn btn-block mybtn btn-login tx-tfm font-book font-14"
                                                        >Save Changes </button>
                                                    </div>
                                                ) : (
                                                    <div className="offset-md-6 col-md-6 col-sm-12">
                                                        <button
                                                            disabled={loading}
                                                            onClick={this.onSubmitWorkout}
                                                            className=" btn btn-block mybtn btn-login tx-tfm font-book font-14"
                                                        >Save Changes </button>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                }
                                {!this.props.logged_userData.isStudyLeader && !this.props.logged_userData.isGroupLeader &&
                                    <hr />
                                }
                                {(this.props.group || !this.props.logged_userData.isStudyLeader) &&
                                    <div className="row">
                                        <div className="col-md-8 m-b-15">
                                            <label
                                                htmlFor="exampleInputEmail1"
                                                className="font-semibold black-txt"
                                            >
                                                Polls
                                            </label>
                                        </div>
                                        <div class="col-lg-12 col-md-12 col-sm-12 m-b-10">
                                            {this.state.pollList && this.state.pollList.map(function (list, key) {
                                                return (
                                                    <div className="row">
                                                        <div className="col-md-10">
                                                            <p>Poll {key + 1}: {list.pollName}
                                                            </p>
                                                        </div>

                                                        <div className="col-2 text-right font-24">
                                                            <span className="p-r-20 " onClick={() => { me.props.setPollModal(true); me.setState({ editPoll: list, editPollKey: key }) }}><i className="fa fa-pencil flow-text pointer"></i></span>
                                                            <span onClick={() => { me.deletePollData(list.id, key) }}><i className="fa fa-times-circle-o flow-text pointer"></i></span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            {this.state.pollList.length == 0 &&
                                                <p>No polls exists for this class yet.</p>
                                            }
                                        </div>
                                    </div>
                                }
                                {(this.props.group || !this.props.logged_userData.isStudyLeader) &&
                                    <div className="col-md-12 text-center p-0 m-b-15">
                                        <div className="row">
                                            <div className="offset-11 col-1" onClick={() => {
                                                if (this.state.workoutId) {
                                                    this.props.setPollModal(true);
                                                    me.setState({ editPoll: {}, editPollKey: '' })
                                                }
                                                else
                                                    this.setState({ savePollError: true, saveClassError: false })
                                            }}>
                                                <img src={constand.WEB_IMAGES + "add-plus.png"} class="pointer pull-right" />
                                            </div>
                                        </div>
                                    </div>
                                }
                                {!this.props.logged_userData.isStudyLeader && !this.props.logged_userData.isGroupLeader &&
                                    <hr />
                                }
                                {(this.props.group || !this.props.logged_userData.isStudyLeader) &&
                                    <div className="row">
                                        <div className="col-md-4 m-b-15">
                                            <label
                                                htmlFor="exampleInputEmail1"
                                                className="font-semibold black-txt"
                                            >
                                                Class Timetable
                                            </label>
                                        </div>
                                        {!isResearchCondition &&
                                            <div className="col-md-2 m-b-15 text-center">
                                                <label
                                                    htmlFor="exampleInputEmail1"
                                                    className="font-semibold black-txt"
                                                >
                                                    Free Class
                                                </label>
                                            </div>
                                        }
                                        <div className="col-md-4 m-b-15 text-center">
                                            <label
                                                htmlFor="exampleInputEmail1"
                                                className="font-semibold black-txt"
                                            >
                                                Watch Party Workout Id
                                            </label>

                                        </div>
                                        <div className={("col-lg-12 col-md-12 col-sm-12 m-b-10 ") + !this.props.logged_userData.isStudyLeader ? 'text-width col-md-12' : ''}>
                                            {this.state.classList && this.state.classList.map(function (list, key) {
                                                return (
                                                    <div className="row">
                                                        <div className={!isResearchCondition ? "col-md-4" : "col-md-4"}>
                                                            <p>{moment.tz(list.scheduledFor, commonService.localTimeZoneName()).format('dddd Do MMMM [at] hh:mma')} {" (" + moment.tz(list.scheduledFor, commonService.localTimeZoneName()).format('z') + ")"} {' - '}
                                                                {!isResearchCondition && list.Attendees.length > 0 && <a href={'https://' + me.props.liveclass_prismic_data.prefix + list.id + me.props.liveclass_prismic_data.suffix} target='_blank' className="pointer flow-text" >{list.Attendees.length} {list.Attendees.length == 1 ? ' attendee' : ' attendees'} </a>
                                                                }
                                                                {((!isResearchCondition && list.Attendees.length == 0) || (isResearchCondition)) && <span className=" flow-text"> {list.Attendees.length} {list.Attendees.length == 1 ? ' attendee' : ' attendees'}
                                                                </span>
                                                                }
                                                            </p>

                                                        </div>

                                                        {!isResearchCondition &&
                                                            <div className="col-2 text-center">
                                                                <input type="checkbox" name="recurring" id="isLive" defaultChecked={list.isFree} value={list.isFree} onChange={() => { me.updateFreeClass(list, key) }} />
                                                            </div>
                                                        }
                                                        {!isResearchCondition &&
                                                            <div className="col-2 text-right">
                                                                <p className="text-right">{list.watchPartyWorkoutId}</p>
                                                            </div>
                                                        }
                                                        <div className="col-4 text-right font-24">
                                                            <span className="p-r-20 " onClick={() => { me.calculateZoneBasedDate(); me.presetZoom(key); me.setState({ cancelSec: '', editSec: key, showZoomOptions: false }) }}><i className="fa fa-pencil flow-text pointer"></i></span>
                                                            <span onClick={() => { me.resetZoom(); me.setState({ cancelSec: key, showZoomOptions: false, editSec: '' }) }}><i className="fa fa-times-circle-o flow-text pointer"></i></span>

                                                        </div>
                                                        {me.state.editSec === key &&
                                                            <div className="col-md-12">
                                                                {me.renderAddScheduleSection('edit', list, key)}
                                                            </div>
                                                        }
                                                        {me.state.cancelSec === key &&
                                                            <div className="col-md-12">
                                                                {me.renderCancelSection(list, key)}
                                                            </div>
                                                        }
                                                    </div>
                                                )
                                            })}
                                            {this.state.classList.length == 0 &&
                                                <p>No occurrences of this class are currently scheduled.</p>
                                            }
                                        </div>
                                    </div>
                                }
                                {(this.props.group || !this.props.logged_userData.isStudyLeader) &&
                                    <div className="col-md-12 text-center p-0 m-b-15">
                                        <div className="row">
                                            <div className="offset-11 col-1" onClick={() => {
                                                this.calculateZoneBasedDate();

                                                if (this.state.workoutId) {
                                                    this.resetZoom();
                                                    this.setState({ showZoomOptions: true, editSec: '' })
                                                }
                                                else
                                                    this.setState({ saveClassError: true, savePollError: false })
                                            }}>
                                                <img src={constand.WEB_IMAGES + "add-plus.png"} class="pointer pull-right" />
                                            </div>
                                        </div>
                                        {this.state.saveClassError && !this.state.workoutId &&
                                            <p className="text-danger">Please save the class before creating the class timetable.</p>

                                        }
                                        {this.state.savePollError && !this.state.workoutId &&
                                            <p className="text-danger">Please save the class before creating the poll.</p>
                                        }
                                    </div>
                                }
                                {showZoomOptions &&
                                    this.renderAddScheduleSection('add')
                                }
                            </div>
                        </div>
                    </div>
                </Modal>
                {this.props.is_poll_modal_open && <PollModal
                    editPoll={this.state.editPoll}
                    editPollKey={this.state.editPollKey}
                    location={this.props.location}
                    history={this.props.history}
                />
                }
                <ConfirmationPopup
                    is_model_open={this.state.openModel}
                    type='liveclass'
                    isConfirmation={true}
                    isCloseRequired={true}
                    title="Heads Up!"
                    closeConfirmationPopup={this.closeConfirmationPopup}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        is_auth: state.auth.is_auth,
        is_model_open: state.header.is_loginModelOpen,
        init_condition: state.auth.initial_condition,
        all_condition: state.register.healthcondition_list,
        is_cms_model: state.workout.is_cms_model,
        cms_model_type: state.workout.cms_model_type,
        liveclass_detail_data: state.liveclass.liveclass_detail_data,
        cropped_image: state.workout.cropped_image,
        cropped_file: state.workout.cropped_file,
        liveclass_prismic_data: state.liveclass.liveclass_prismic_data,
        is_poll_modal_open: state.liveclass.is_poll_modal_open,
        logged_userData: state.header.logged_userData,
        is_group_admin: state.group.is_group_admin,
        is_group_leader: state.group.is_group_leader,
    };
};

const mapDispatchToProps = {
    getZoomUsers,
    getTags,
    getRecordingOf,
    getInstructor,
    ondemandCMSModelOpen,
    removeTag,
    createNewTag,
    clearOndemandList,
    imageCropOpenPopup,
    createZoomMeeting,
    cancelZoomMeeting,
    updateFreeLiveclass,
    setPollModal,
    deletePoll,
    liveclassDetail,
    checkWatchPartyWorkoutId
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LiveclassCMSComponent);
