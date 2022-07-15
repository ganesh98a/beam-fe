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
import CKEditor from 'ckeditor4-react';
import {
    getTags,
    getRecordingOf,
    getRecordingOfDetails,
    getInstructor,
    ondemandCMSModelOpen,
    createNewTag,
    removeTag,
    clearOndemandList,
    imageCropOpenPopup,
    setFile,
    checkVideoUrlExists,
    sendFileuploadNotification
} from "../../actions";
import { toast } from "react-toastify";
import { Cookies } from "react-cookie-consent";
import { components } from "react-select";
import makeAnimated from "react-select/animated";
import ImageCropperComponent from "../Common/ImageCropperComponent";
import WorkoutConfirmationModal from "./WorkoutConfirmationModal";
import { commonService } from "../../_services";
import Img from 'react-fix-image-orientation';
import ReactPlayer from 'react-player';
import { ImageTag } from "../../tags";
import { pi, max, floor } from 'mathjs';
import AWS from 'aws-sdk';
import DatePicker from "react-datepicker";
import moment from 'moment';

const Option = props => {
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
        { label: 'Bold', style: 'BOLD', className: 'rich-button' },
        { label: 'Italic', style: 'ITALIC', className: 'rich-button' },
        { label: 'Underline', style: 'UNDERLINE', className: 'rich-button' }
    ],
    BLOCK_TYPE_BUTTONS: [
        { label: 'UL', style: 'unordered-list-item', className: 'rich-button' },
        { label: 'OL', style: 'ordered-list-item', className: 'rich-button' }
    ],
    LINK_BUTTONS: [
        { label: 'link', className: 'rich-button' },
        { label: 'unlink', className: 'rich-button' }
    ]
};
class WorkoutCMSComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorValue: RichTextEditor.createEmptyValue(),
            submitted: false,
            loading: false,
            isCropped: false,
            fileTypeErr: false,
            error: "",
            workout: [],
            isLive: 1,
            workoutId: '',
            postFile: {},
            postImage: '',
            videoTypeOptions: [],
            disciplineOptions: [],
            conditionOptions: [],
            benefitOptions: [],
            equipmentOptions: [],
            levelOptions: [],
            instructorOptions: [],
            recordingofOptions: [],
            isTagCreatable: true,
            optionSelected: {
                'videotype': [],
                'discipline': [],
                'benefit': [],
                'instructor': [],
                'equipment': [],
                'level': [],
                'condition': [],
                'instructorUser': [],
                'recordingof': []
            },
            videoUrlError: false,
            videoTypeLiveclass: [],
            crop: {
                unit: "px", // default, can be 'px' or '%'
                x: 0,
                y: 0,
                width: 800,
                height: 485,
                aspect: 16 / 9,
                disabled: true,
                locked: true
                //x:0,
                //y:0,
            },
            percentCompleted: 0,
            isS3UrlChanged: false,
            isVideoChanged: false,
            for_redirect_selectedCondition: '',
            openModel: false,
            isDraft: false,
            publishDate: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeTextEdit = this.handleChangeTextEdit.bind(this);
        this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
        this.handleInstructorChange = this.handleInstructorChange.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.onSubmitWorkout = this.onSubmitWorkout.bind(this);
        this.closeModel = this.closeModel.bind(this);
        this.clearState = this.clearState.bind(this);
        this.onCloseModel = this.onCloseModel.bind(this);
        this.makeSelectedOptions = this.makeSelectedOptions.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.getInstructor = this.getInstructor.bind(this);
        this.removeVideoFromUpload = this.removeVideoFromUpload.bind(this);
        this.closeConfirmationPopup = this.closeConfirmationPopup.bind(this);
        this.uploadFile = this.uploadFile.bind(this);

        AWS.config.update({
            accessKeyId: constand.AWS_ACCESS_KEY,
            secretAccessKey: constand.AWS_SECRET_KEY,
            httpOptions: { timeout: 0, connectTimeout: 0 }
        })
        this.myBucket = new AWS.S3({
            params: { Bucket: constand.AWS_BUCKET },
            region: constand.AWS_REGION,
        })
    }

    componentDidMount() {

        console.log('cmsdidmount', this.props)
        console.log('Cookies.get', Cookies.get('condition'))

        var workouts = this.props.workout_details.workout;
        console.log("work-out", workouts);
        workouts.vlength = workouts.length;
        workouts.isLive = 1;
        workouts.videoS3Url = constand.Workout_PactsterS3_URL + workouts.videoUrl;
        var workoutId = this.props.workout_details.workout ? this.props.workout_details.workout.id : '';
        var recordingOf = this.props.workout_details.workout ? this.props.workout_details.workout.recordingOf : '';
        var instructorId = this.props.workout_details.workout ? this.props.workout_details.workout.InstructorId : '';
        workouts.postVideoFile = this.props.workout_details.workout ? this.props.workout_details.workout.videoUrl : '';
        var checkAuth = (!this.props.logged_userData.isStudyLeader && (this.props.logged_userData.isCreator || (!this.props.is_group_admin && !this.props.is_group_leader)));

        workouts.publishDate = (workouts.publishDate && workouts.publishDate != '0000-00-00') ? moment(moment(workouts.publishDate).format('YYYY-MM-DD')).toDate() : null;
        console.log('cmsdidmount-groups.publishDate-after', (workouts.publishDate))

        this.setState({
            postVideo: constand.S3_URL + workouts.postVideoFile,
            workout: workouts,
            workoutId: workoutId,
            isTagCreatable: checkAuth,
            publishDate: workouts.publishDate
            // editorValue: RichTextEditor.createValueFromString(workouts.description, 'html')
        })
        var { workout } = this.state;
        setTimeout(() => {
            console.log('Latetime-desc')
            this.setState({ description: workouts.description })
        }, 1000);

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
                            newOptions['videotype'].push(element.Tag);
                        });
                        this.setState({
                            optionSelected: newOptions
                        });
                    }
                    var Types = response.data.tags.filter((x) => (x.label === 'Exercise' || x.label === 'Education'));
                    this.setState({ videoTypeOptions: Types });
                }
            },
            error => {

            })
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
            error => {

            })
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
                    this.setState({ conditionOptions: response.data.tags });

                    var ids = _.map(this.state.optionSelected['condition'], 'value');
                    console.log('ids-condition', ids)
                    this.getInstructor(instructorId, ids);
                }
            },
            error => {

            })

        if (instructorId) {
            this.props.getRecordingOf(instructorId, recordingOf).then(
                response => {
                    if (response) {
                        if (response.data.recording) {
                            var recording = response.data.recording;
                            var newOptions = this.state.optionSelected;
                            newOptions['recordingof'] = recording.length > 0 ? recording[0] : [];
                            this.setState({
                                optionSelected: newOptions
                            });
                        }
                        this.setState({ recordingofOptions: response.data.workout })
                    }
                },
                error => {
                }
            )
        }
    }
    componentWillReceiveProps(nextProps) {
        console.log('CMS-componentWillReceiveProps', nextProps)
        let { workout } = this.state;

        if (this.props.cropped_image != nextProps.cropped_image && nextProps.cropped_image) {
            console.log('if')
            this.setState({
                isCropped: true,
                workout: {
                    ...workout,
                    videoImg: nextProps.cropped_image,
                    postFile: nextProps.cropped_file
                }
            })
        }
        else if (!nextProps.cropped_image) {
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

    /**
on image change event
**/
    onImageChange = event => {
        console.log('event.target', event.target)
        console.log('event. workout', this.state.workout)
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
    getInstructor(instructorId, ids) {
        //instructor options based on conditions chosen
        this.props.getInstructor(instructorId, ids, this.props.groupId, commonService.replaceChar(Cookies.get('condition'))).then(
            response => {
                if (response) {
                    if (response.data.editTags) {
                        var editTags = response.data.editTags;
                        var newOptions = this.state.optionSelected;
                        newOptions['instructorUser'].push(editTags);
                        this.setState({
                            optionSelected: newOptions
                        });
                    } else {
                        var newOptions = this.state.optionSelected;
                        newOptions['instructorUser'] = null;
                        this.setState({
                            optionSelected: newOptions,
                        });
                    }
                    this.setState({ instructorOptions: response.data.instructors })
                }
            }, error => {
                var newOptions = this.state.optionSelected;
                newOptions['instructorUser'] = null;
                this.setState({
                    optionSelected: newOptions,
                    instructorOptions: []
                });
            }
        )
    }
    prePopulateData(data) {
        const { workout, disciplineOptions, benefitOptions, equipmentOptions, levelOptions, conditionOptions } = this.state;
        this.setState({
            workout: {
                ...workout,
                vlength: data.length,
                description: data.description
            },
            description: data.description,
            editorValue: RichTextEditor.createValueFromString(data.description, 'html')
        })
        setTimeout(() => {
            console.log('Latetime-desc')
            this.setState({ description: data.description })
        }, 1000);

        var discipline = commonService.returnTag(
            "discipline", data.WorkoutTags, data.id
        )
        var benefit = commonService.returnTag(
            "benefit", data.WorkoutTags, data.id
        )
        var equipment = commonService.returnTag(
            "equipment", data.WorkoutTags, data.id
        )
        var level = commonService.returnTag(
            "level", data.WorkoutTags, data.id
        )
        var condition = commonService.returnTag(
            "condition", data.WorkoutTags, data.id
        )

        this.makeSelectedOptions(disciplineOptions, discipline, 'discipline');
        this.makeSelectedOptions(benefitOptions, benefit, 'benefit');
        this.makeSelectedOptions(equipmentOptions, equipment, 'equipment');
        this.makeSelectedOptions(levelOptions, level, 'level');
        this.makeSelectedOptions(conditionOptions, condition, 'condition');
    }
    makeSelectedOptions(options, selectedValue, type) {

        var splitArray = selectedValue.split(',');
        var newOptions = this.state.optionSelected;
        var newArra = [];
        splitArray.forEach(element => {
            var temp = _.filter(options, function (condition) {
                console.log('condition.label', condition.label)
                return condition.label.trim() === element.trim();
            });
            newArra.push(temp[0])
        });

        newOptions[type] = newArra;
        this.setState({
            optionSelected: newOptions
        })
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
                    this.setState({ optionSelected: newOptions });

                    var me = this;
                    switch (type) {
                        case 'condition':
                            var newOptions = _.filter(me.state.conditionOptions, function (condition) {
                                return condition.value != item;
                            });
                            me.setState({ conditionOptions: newOptions })
                            break;
                        case 'videotype':
                            var newOptions = _.filter(me.state.videoTypeOptions, function (condition) {
                                return condition.value != item;
                            });
                            me.setState({ videoTypeOptions: newOptions })
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
                            break;
                    }
                }
            },
            error => { })
    }
    onCloseModel() { }
    handleChangeTextEdit = (value) => {
        console.log('handleChangeTextEdit')
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
    handleChange(e) {
        console.log('handleChange', e.target)
        const { name, value } = e.target;
        let { workout } = this.state;

        if (name == 'videoS3Url') {
            this.setState({ isS3UrlChanged: true, isBothFileOptions: false, videoUrlError: false, videoUrlNotExistsError: false })
        }
        this.setState({
            videoLengthError: false,
            videoUrlError: false,
            clockStartError: false,
            clockEndError: false,
            workout: {
                ...workout,
                [name]: value,
            },
        });
    }
    handleMultiSelectChange(selected, type) {
        var newOptions = this.state.optionSelected;
        newOptions[type] = selected;

        this.setState({
            optionSelected: newOptions,
        });

        var videoTypeLiveclass = [];
        if (type == 'condition') {
            var ids = _.map(this.state.optionSelected['condition'], 'value');
            console.log('ids-condition', ids)
            this.getInstructor('', ids);
        }
        if (type == 'discipline') {

            ////////////////////////////////////////////////////////////    
            var selectedEducation = _.filter(this.state.optionSelected['discipline'], function (value) {
                return (value.label.toLowerCase() == constand.Tag_Education.toLowerCase()) ? true : false;
            })
            var tagEducation_disc = _.filter(this.state.videoTypeOptions, function (value) {
                return (value.label.toLowerCase() == constand.Tag_Education.toLowerCase()) ? true : false;
            });
            var existEducation = _.filter(this.state.optionSelected['videotype'], function (value) {
                return (value.label.toLowerCase() == constand.Tag_Education.toLowerCase()) ? true : false;
            });

            if (existEducation.length == 0 && selectedEducation.length) {
                newOptions['videotype'] = newOptions['videotype'] ? newOptions['videotype'] : [];
                newOptions['videotype'].push(tagEducation_disc[0]);
            } else if (existEducation.length && selectedEducation.length == 0) {
                newOptions['videotype'].splice(this.state.optionSelected['videotype'].findIndex(v => v.label.toLowerCase() == constand.Tag_Education.toLowerCase()), 1);
            }
        }

        if (type == 'videotype') {
            videoTypeLiveclass = _.filter(newOptions[type], function (value) {
                return (value.label == constand.Video_Type_Liveclass) ? true : false;
            })
            this.setState({ videoTypeLiveclass: videoTypeLiveclass })
            ////////////////////////////////////////////////////////////
            var selectedEducation = _.filter(this.state.optionSelected['videotype'], function (value) {
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
        else if (type == 'recordingof') {
            this.props.getRecordingOfDetails(selected.value).then(
                response => {
                    if (response) {
                        this.prePopulateData(response.data);
                    }
                },
                error => {
                }
            )
        }
        this.setState({
            optionSelected: newOptions,
        });
    };

    handleInstructorChange(selected, type) {
        var newOptions = this.state.optionSelected;
        newOptions[type] = selected;
        this.setState({
            optionSelected: newOptions
        });
        if (selected != null) {
            this.setState({ recordingofOptions: [] })

            this.props.getRecordingOf(selected[0].value).then(
                response => {
                    if (response) {
                        this.setState({ recordingofOptions: response.data.workout })
                    }
                },
                error => {
                }
            )
        }
    }
    createOption = (label) => ({
        label,
        value: label.toLowerCase().replace(/\W/g, ''),
    });
    handleCreate = (inputValue, type) => {
        var newValue = this.state.optionSelected;
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
                    var newOptions = me.state.videoTypeOptions;
                    newOptions.push(newOptionTag)
                    console.log('newOptions', newOptions)
                    me.setState({ videoTypeOptions: newOptions })
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
                    newOptions.push(newOptionTag)
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
        console.log('evntcheck', e.target.name)
        let { workout } = this.state;

        switch (e.target.name) {
            case 'isDraft':
                var isDraft = this.state.workout.isDraft;
                if (this.props.cms_model_type === 'edit' && this.state.workout.isDraft !== (!isDraft)) {
                    this.setState({ isLive: false });
                }
                this.setState({
                    workout: {
                        ...workout,
                        isDraft: !isDraft,
                    },
                });
                break;
            case 'isFree':
                var isFree = this.state.workout.isFree;
                this.setState({
                    workout: {
                        ...workout,
                        isFree: !isFree,
                    },
                });
                break;
            case 'isLive':
                var isLive = this.state.workout.isLive;

                this.setState({
                    workout: {
                        ...workout,
                        isLive: !isLive,
                    },
                });
                break;
        }

    }
    clearState() {
        this.setState({
            submitted: false,
            loading: false
        });
    }

    closeModel() { //for close the login model
        this.clearState();
        this.props.ondemandCMSModelOpen(false);
    }
    closeConfirmationPopup() {
        this.props.ondemandCMSModelOpen(false);
        this.setState({ openModel: false });
        //setTimeout(() => {
        /* if (this.props.groupId)
            window.location.href = '/group/ondemand/list/' + this.props.group.group + '/' + this.state.for_redirect_selectedCondition;
        else
            window.location.href = '/on-demand/' + this.state.for_redirect_selectedCondition + '?sortby=Newest-first'; */

        //            this.setState({ loading: false, percentCompleted: '100' });
        //}, 4000);
    }
    onVideoChange = event => {
        console.log('event.target', event.target.files)
        console.log('event. workout', this.state.workout)
        if (event.target.files && event.target.files[0]) {
            this.props.setFile(event.target.files[0])
            this.setState({
                fileTypeErr: false,
                postVideo: URL.createObjectURL(event.target.files[0]),
                postVideoFile: event.target.files[0],
                isUpload: true,
                workout: {
                    ...this.state.workout,
                    postVideoFile: event.target.files[0],
                },
                isVideoChanged: true
            });
        }
    };
    removeVideoFromUpload() {
        this.setState({
            fileTypeErr: false,
            postVideo: '',
            postVideoFile: '',
            isUpload: true,
            workout: {
                ...this.state.workout,
                postVideoFile: '',
            },
            isVideoChanged: false,
            isBothFileOptions: false,
            videoUrlError: false,
            videoUrlNotExistsError: false
        });
    }

    /* render image data */
    _renderThumbnailContent(source_url, videoObj) {
        console.log('videoObj', videoObj)
        console.log('source_url', videoObj != undefined)
        /* let type = videoObj.type;
        console.log('type---------', type);
        if (type.includes('video/')) { */

        return (<div className="position-relative col-md-12"><ReactPlayer url={source_url} controls={false} width='30%' height='100%' style={{ width: '100%', height: '100%' }} />
            {videoObj != undefined && this.state.percentCompleted != '0' && this.state.percentCompleted != '100' && <div class="line-bar" style={{ position: 'relative', top: '-74px', left: '0', width: '30%', paddingLeft: '7px', paddingRight: '7px' }}>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style={{ width: this.state.percentCompleted + '%' }}>
                        <span class="sr-only">{this.state.percentCompleted} Complete</span>
                    </div>
                </div>
                <div className="thumbnail-overlay text-center font-16 white-txt" >{this.state.percentCompleted}% complete</div>
            </div>}
            {/* videoObj != undefined && this.state.percentCompleted == '0' && <div class="line-bar" style={{ position: 'relative', top: '-74px', left: '0', width: '30%', paddingLeft: '7px', paddingRight: '7px' }}>
                <div className="thumbnail-overlay text-center font-16 white-txt">Awaiting upload</div>
            </div> */
            }
        </div>);
        //}
    }
    async onSubmitWorkout() { //for submit workout
        console.log('onSubmitWorkout', this.state)

        this.setState({ submitted: true });
        const { optionSelected, workout, videoTypeLiveclass, postVideoFile } = this.state;

        // stop here if form is invalid
        if (!workout.title || !workout.vlength || !optionSelected['instructorUser'] || !optionSelected['videotype'] || !optionSelected['condition'] || !workout.description) {
            var error_name = '';
            if (!optionSelected['instructorUser'])
                this.instructorUser.focus()
            else if (!optionSelected.videotype.length) {
                console.log('Elseif-videotype')
                this.videotype.focus()
            }
            else if (!workout.title)
                error_name = 'title';
            else if (!workout.vlength)
                error_name = 'vlength';
            else if (!optionSelected['condition'])
                this.condition.focus()
            else if (!workout.description)
                document.getElementsByClassName('description')[0].focus();

            console.log('error_name', error_name)
            if (error_name)
                document.getElementsByName(error_name)[0].focus();
            return;
        }
        /* if (workout.isDraft && !this.state.publishDate)
            return; */

        console.log('2nd if')

        if (videoTypeLiveclass.length > 0 && optionSelected['recordingof'].length == 0) {
            if (!optionSelected['recordingof'].length)
                this.recordingof.focus()
            return;
        }
        console.log('last before if')
        if (this.props.logged_userData.isCreator) {
            console.log('Creator***', this.props.is_group_mode)
            console.log('Creator*=' + postVideoFile + '+' + workout.videoS3Url)
            if (postVideoFile && workout.videoS3Url && this.state.isS3UrlChanged && this.state.isVideoChanged) {
                console.log('Creator***both')
                this.setState({ isBothFileOptions: true, videoUrlNotExistsError: false })
                return;
            } else if ((postVideoFile == '' || !postVideoFile) && workout.videoS3Url && !this.props.is_group_mode) {
                var filename = commonService.replaceValidBucketURL(this.state.workout.videoS3Url, true);
                /* if (this.state.workout.videoS3Url.includes("s3.")) {

                    var filename = this.state.workout.videoS3Url.replace(constand.Workout_PactsterS3_BUCKET + '/_/video/workouts/', '');
                } else if (this.state.workout.videoS3Url.includes("s3-")) {
                    var filename = this.state.workout.videoS3Url.replace(constand.Workout_PactsterS3_URL + '/_/video/workouts/', '');
                } */
                console.log('Creator***filename')
                if (commonService.checkValidVideoURL(workout.videoS3Url) && this.state.isS3UrlChanged) { //not valid url
                    console.log('Creator***notvalidurl')
                    this.setState({ isBothFileOptions: false, videoUrlError: commonService.checkValidVideoURL(workout.videoS3Url), videoUrlNotExistsError: false })
                    return;
                } else {
                    console.log('checkvideourlexist')
                    await this.props.checkVideoUrlExists(filename).then(response => {
                        console.log('checkVideoUrlExists-response', response)
                        this.setState({ isBothFileOptions: false, videoUrlError: false, videoUrlNotExistsError: !response.data })
                    }, error => {
                        this.setState({ isBothFileOptions: false, videoUrlError: false, videoUrlNotExistsError: true })
                    })
                    if (this.state.videoUrlNotExistsError)
                        return;
                }
            }
            else if (!postVideoFile && !this.state.workout.videoS3Url) {
                console.log('Creator***no url')
                return;
            }
        } else {
            if (!postVideoFile && !this.state.workout.postVideoFile) {
                return;
            }
        }

        console.log('last if')
        if (workout.vlength && String(workout.vlength).match(/^[0-9\b]+$/) == null && !this.props.is_group_mode) {
            this.setState({ videoLengthError: true });
            document.getElementsByName('vlength')[0].focus();
            return;
        }

        this.setState({ loading: true });
        console.log('this.state.workout==', this.state)
        // var filename = '';
        var filename = commonService.replaceValidBucketURL(this.state.workout.videoS3Url, true);

        if (this.state.isVideoChanged) {
            filename = (Math.random().toString(36) + '00000000000000000').slice(2, 10) + Date.now() + '.' + this.props.fileData.name.split('.').pop();
            console.log('ifffilename', filename)

        } else {
            if (this.state.workout.videoS3Url) {
                filename = this.state.workout.videoS3Url ? commonService.replaceValidBucketURL(this.state.workout.videoS3Url, true) : '';
            } else {
                filename = this.state.workout.videoUrl ? this.state.workout.videoUrl.replace('/_/video/workouts/', '') : '';
            }
            console.log('elsefilename', filename)

            //filename = this.state.workout.videoUrl ? commonService.replaceValidBucketURL(this.state.workout.videoS3Url) : ''
        }
        console.log('filename', filename)
        var publishDate = null;
        if (workout.isDraft && this.state.publishDate) {
            publishDate = moment(this.state.publishDate).format('YYYY-MM-DD')
        }
        //return;
        let postData = new FormData();
        postData.append("title", this.state.workout.title);
        //postData.append("videoUrl", this.state.workout.videoS3Url.replace('https://pactstercdn.s3-eu-west-1.amazonaws.com', ''));

        // postData.append("videoUrl", commonService.replaceValidBucketURL(this.state.workout.videoS3Url));
        postData.append("videoUrl", filename);
        postData.append("length", this.state.workout.vlength);
        postData.append("videotype", JSON.stringify(this.state.optionSelected['videotype']));
        postData.append("discipline", JSON.stringify(this.state.optionSelected['discipline']));
        postData.append("condition", JSON.stringify(this.state.optionSelected['condition']));
        postData.append("instructorId", JSON.stringify(this.state.optionSelected['instructorUser'][0].value));
        postData.append("benefit", JSON.stringify(this.state.optionSelected['benefit']));
        postData.append("instructor", JSON.stringify(this.state.optionSelected['instructor']));
        postData.append("equipment", JSON.stringify(this.state.optionSelected['equipment']));
        postData.append("level", JSON.stringify(this.state.optionSelected['level']));
        postData.append("recordingof", JSON.stringify(this.state.optionSelected['recordingof'].value));
        postData.append("description", this.state.workout.description.toString('html').replace(/<a /g, '<a target="_blank" '));
        postData.append("isLive", this.state.workout.isLive);
        postData.append("isDraft", this.state.workout.isDraft);
        postData.append("videoImg", this.state.workout.postFile);
        //postData.append("videoFile", this.state.workout.postVideoFile);
        postData.append("isFileUpload", this.state.isVideoChanged ? 0 : 1);
        postData.append("videoFilename", filename ? filename : '');
        postData.append("publishDate", publishDate);
        postData.append("isFree", this.state.workout.isFree);
        postData.append("sclock", this.state.workout.clockStart ? this.state.workout.clockStart : 0);
        postData.append("eclock", this.state.workout.clockEnd ? this.state.workout.clockEnd : 0);
        if (this.props.groupId) postData.append("communityId", this.props.groupId);

        console.log('postData', postData)
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
        var me = this;
        const config = {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "content-type": "multipart/form-data",
                Authorization: authData.token
            },
            onUploadProgress: progressEvent => {
                console.log('progressEvent', progressEvent)
                let percentCompleted = floor((progressEvent.loaded * 100) / progressEvent.total);
                me.setState({
                    percentCompleted: percentCompleted //(percentCompleted > 5 ? percentCompleted - 5 : percentCompleted) 
                })
                console.log('percentCompleted', percentCompleted)
                // do whatever you like with the percentage complete
                // maybe dispatch an action that will update a progress bar or something
            }
        };
        axios
            .post(url, postData, config)
            .then(response => {
                var resdata = response.data;
                var selectedCondition = commonService.replaceChar(this.state.optionSelected['condition'][0].label, false);
                Cookies.set('condition', selectedCondition)

                if (resdata.status) {
                    if (this.state.isVideoChanged) {
                        var notificationParams = {
                            workoutId: response.data.workout.id,
                            conditionName: selectedCondition,
                        }
                        this.uploadFile(this.props.fileData, filename, notificationParams);
                        this.setState({ openModel: true })
                    } else {
                        toast.success(response.data.message);
                        this.closeModel()
                    }
                    /* let postFileData = new FormData();
                    postFileData.append("videoFile", this.state.workout.postVideoFile);
                    postFileData.append("workoutId", response.data.workout.id);
                    postFileData.append("conditionName", selectedCondition);
                    console.log('postFileData', this.state.workout.postVideoFile)
                    if (this.state.isVideoChanged) {
                        this.saveFileUpload(postFileData);
                        this.setState({ openModel: true, })
                    } else {
                        this.closeModel()
                    } */
                } else {
                    toast.error(response.data.message);
                }
                this.props.clearOndemandList();
                this.props.getList();
                this.setState({ for_redirect_selectedCondition: selectedCondition });
                /* setTimeout(() => {
                    if (this.props.groupId)
                        window.location.href = '/group/ondemand/list/' + this.props.group.group + '/' + selectedCondition;
                    else
                        window.location.href = '/on-demand/' + selectedCondition + '?sortby=Newest-first';

                    this.setState({ loading: false, percentCompleted: '100' });
                }, 4000); */
            }, error => {
                this.setState({ error: error, loading: false });
            })

    }
    handleChangeDate = date => {
        console.log('handleChangeDate' + date)
        this.setState({
            publishDate: date,
        });
        /*  var comb = this.formatDate(date) + ' ' + (liveclass.whentime) + ' ' + (liveclass.whenam);
         this.calculateZoneBasedDate(comb) */
    };

    uploadFile = (file, filename, notificationParams) => {
        const params = {
            Bucket: constand.AWS_BUCKET,
            ACL: 'public-read',
            Key: '_/video/workouts/' + filename,
            ContentType: file.type,
            Body: file,
            partSize: 10 * 1024 * 1024, queueSize: 1,
        }
        console.log('uploadFile', params)
        //this.myBucket.putObject(params)

        this.myBucket.upload(params)
            .on('httpUploadProgress', (evt) => {
                // that's how you can keep track of your upload progress
                this.setState({
                    progress: Math.round((evt.loaded / evt.total) * 100),
                })
                console.log('directprogressing==>', Math.round((evt.loaded / evt.total) * 100))
                //console.log('progressing==>', this.state.progress)
            })
            .send((err) => {

                if (err) {
                    // handle the error here
                    console.log('errr', err)
                    notificationParams.s3Completed = false;
                    this.props.sendFileuploadNotification(notificationParams)
                } else {
                    notificationParams.s3Completed = true;
                    this.props.sendFileuploadNotification(notificationParams)
                }
            })
    }

    renderOption = option => (
        <div>
            <div>{option.label}
                <span style={{ display: "block", color: "gray", fontSize: 12 }}>
                    {option.subLabel}
                </span>
            </div>
        </div>
    );
    render() {
        const { submitted, loading } = this.state;
        var imageModel = false;
        const ExampleCustomInput = function ({ value, onClick }) {
            console.log('value==>', value)
            value = value ? moment(value).format('dddd D MMMM') : null; //moment().format('dddd D MMMM');
            console.log('ExampleCustomInput', value)
            return (
                <div className="w-100">
                    <input className="form-control popup-txt float-left w-90" value={value} type="text" name="publishDate" onClick={onClick} />
                    <span className="float-right pt-2"><i onClick={onClick} aria-hidden="true" className="fa fa-calendar"></i></span>
                </div>
            )
        };
        return (
            <React.Fragment>

                {this.state.imageModel &&
                    <ImageCropperComponent crop={this.state.crop} aspectRatio={160 / 97} width={800} height={485} src={this.state.workout.videoImg} text="Upload Class Thumbnail" />
                }
                <Modal
                    className="removebbg-popup"
                    open={this.props.is_cms_model}
                    onClose={this.onCloseModel}
                    center
                >
                    <div className={(Cookies.get('closeBanner') == 'false' && !this.props.close_banner) ? "modal-dialog modal-width--custom cms-model m-t-80" : "modal-dialog modal-width--custom cms-model m-t-80"} role="document">
                        <div className="modal-content">
                            <div className="modal-header header-styling">
                                <h5
                                    className="modal-title text-left col-md-11 p-0 font-semibold"
                                    id="exampleModalLabel font-medium"
                                >
                                    {this.props.cms_model_type == 'edit' ? 'Modify ' : 'Add'} On Demand Class
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
                            <div className="modal-body body-padding--value pb-0">
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
                                        <u>Upload Class Thumbnail</u>
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
                                        (submitted && this.state.optionSelected.instructorUser && this.state.optionSelected.instructorUser.length == 0 ? " has-error" : "")
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
                                        innerRef={input => (this.instructorUser = input)}
                                    />
                                    {submitted && (!this.state.optionSelected.instructorUser || this.state.optionSelected.instructorUser.length == 0) && (
                                        <div className="text-danger">Instructor is required</div>
                                    )}
                                </div>

                                <div
                                    className={
                                        "form-group" +
                                        (submitted && this.state.optionSelected.videotype && this.state.optionSelected.videotype.length == 0 ? " has-error" : "")
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
                                        //options={this.state.videoTypeOptions}
                                        options={this.state.optionSelected['videotype'] == null
                                            ? this.state.videoTypeOptions
                                            : (this.state.optionSelected['videotype'] && this.state.optionSelected['videotype'].length === constand.CONSTONE
                                                ? []
                                                : this.state.videoTypeOptions)}
                                        noOptionsMessage={() => {
                                            return this.state.optionSelected['videotype'] == null
                                                ? false
                                                : this.state.optionSelected['videotype'] && this.state.optionSelected['videotype'].length === constand.CONSTONE
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
                                        onCreateOption={(value) => this.handleCreate(value, 'videotype')}
                                        allowSelectAll={false}
                                        creatable={false}
                                        value={this.state.optionSelected['videotype']}
                                        name='videotype'
                                        removeTag={this.removeTag}
                                        isRemoveable={false}
                                        innerRef={input => (this.videotype = input)}

                                    />
                                    {submitted && this.state.optionSelected.videotype && this.state.optionSelected.videotype.length == 0 && (
                                        <div className="text-danger">Video Type is required</div>
                                    )}
                                </div>
                                {this.state.videoTypeLiveclass.length > 0 &&
                                    <div
                                        className={
                                            "form-group" +
                                            (submitted && this.state.optionSelected.recordingof && this.state.optionSelected.recordingof.length == 0 ? " has-error" : "")
                                        }
                                    >
                                        <label
                                            htmlFor="exampleInputEmail1"
                                            className="font-semibold black-txt"
                                        >
                                            Recording Of <span className="orangefont">*</span>
                                        </label>
                                        <MultiSelectComponent
                                            className="select-container text-capitalize"
                                            options={this.state.recordingofOptions}
                                            placeholder="Select Recording Of"
                                            closeMenuOnSelect={false}
                                            hideSelectedOptions={false}
                                            components={{
                                                Option,
                                                MultiValue,
                                                ValueContainer,
                                                animatedComponents
                                            }}
                                            onChange={this.handleMultiSelectChange}
                                            onCreateOption={(value) => this.handleCreate(value, 'recordingof')}
                                            allowSelectAll={false}
                                            creatable={false}
                                            value={this.state.optionSelected['recordingof']}
                                            name="recordingof"
                                            innerRef={input => (this.recordingof = input)}

                                        />
                                        {submitted && this.state.optionSelected.recordingof && this.state.optionSelected.recordingof.length == 0 && (
                                            <div className="text-danger">Recording of is required</div>
                                        )}
                                    </div>
                                }
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
                                        Video Title <span className="orangefont">*</span>
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
                                        maxLength={constand.Input_Text_Limit}
                                    />
                                    {this.state.workout.title ? (
                                        <div className="pull-right font-13 twitter-color mt-1">
                                            Characters Left: {constand.Input_Text_Limit - this.state.workout.title.length}
                                        </div>
                                    ) : null}
                                    {submitted && !this.state.workout.title && (
                                        <div className="text-danger">Title is required</div>
                                    )}
                                </div>
                                <div className="row col-md-12 p-0">
                                    <div
                                        className={
                                            "form-group col-md-4" +
                                            (submitted && (!this.state.workout.vlength || (this.state.workout.vlength && this.state.videoLengthError)) ? " has-error" : "")
                                        }
                                    >
                                        <label
                                            htmlFor="exampleInputEmail1"
                                            className="font-semibold black-txt"
                                        >
                                            Video Length (minutes) <span className="orangefont">*</span>
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
                                    <div className="form-group col-md-2">
                                        <label class="m-t-5 pull-left" for="isDraft">
                                            <input type="checkbox" name="isDraft" id="isDraft" value={this.state.workout.isDraft} onChange={(e) => { this.handleCheckboxChange(e) }} checked={this.state.workout.isDraft} />
                                        </label>
                                        <label class="font-semibold black-txt m-l-5"> Draft</label>
                                    </div>
                                    {this.state.workout.isDraft &&
                                        <div className="form-group col-md-4">
                                            <label className="font-semibold black-txt">
                                                Publish date {/* <span className="orangefont">*</span> */}
                                            </label>
                                            <DatePicker
                                                //dateFormat="MM-DD-YYYY"
                                                selected={this.state.publishDate}
                                                onChange={this.handleChangeDate}
                                                minDate={new Date()}
                                                customInput={<ExampleCustomInput />}
                                            />
                                            {/* submitted && !this.state.publishDate && (
                                                <div className="text-danger">Publish date is required</div>
                                            ) */}
                                        </div>
                                    }
                                    <div className="form-group col-md-2">
                                        <label class="m-t-5 pull-left" for="isFree">
                                            <input type="checkbox" name="isFree" id="isFree" value={this.state.workout.isFree} onChange={(e) => { this.handleCheckboxChange(e) }} checked={this.state.workout.isFree} />
                                        </label>
                                        <label class="font-semibold black-txt m-l-5"> Free</label>
                                    </div>
                                </div>

                                <div className=" col-md-12 p-0 row">
                                    <div className={
                                        "form-group col-md-4" +
                                        (submitted && (!this.state.workout.clockStart || (this.state.workout.clockStart && this.state.clockStartError)) ? " has-error" : "")
                                    }>
                                        <label
                                            htmlFor="exampleInputEmail1"
                                            className="font-semibold black-txt"
                                        >
                                            Clock Start Time
                                        </label>
                                        <input
                                            type="time"
                                            step="1"
                                            className="form-control"
                                            id="clockStart"
                                            aria-describedby="emailHelp"
                                            name="clockStart"
                                            min="0"
                                            value={this.state.workout.clockStart}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className={
                                        "form-group col-md-4" +
                                        (submitted && (!this.state.workout.clockEnd || (this.state.workout.clockEnd && this.state.clockEndError)) ? " has-error" : "")
                                    }>
                                        <label
                                            htmlFor="exampleInputEmail1"
                                            className="font-semibold black-txt"
                                        >
                                            Clock End Time
                                        </label>
                                        <input
                                            type="time"
                                            step="1"
                                            className="form-control"
                                            id="clockEnd"
                                            aria-describedby="emailHelp"
                                            name="clockEnd"
                                            min="0"
                                            value={this.state.workout.clockEnd}
                                            onChange={this.handleChange}
                                        />
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
                                        innerRef={input => (this.input = input)}

                                    />
                                </div>
                                {this.props.is_auth && !this.props.is_group_mode && !this.props.logged_userData.isStudyLeader &&
                                    <div
                                        className={
                                            "form-group" +
                                            (submitted && this.state.optionSelected.condition && this.state.optionSelected.condition.length == 0 ? " has-error" : "")
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
                                            innerRef={input => (this.condition = input)}
                                        />
                                        {submitted && this.state.optionSelected.condition && this.state.optionSelected.condition.length == 0 && (
                                            <div className="text-danger">Condition is required</div>
                                        )}
                                    </div>
                                }
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
                                        innerRef={input => (this.input = input)}

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
                                        innerRef={input => (this.input = input)}

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
                                        innerRef={input => (this.input = input)}

                                    />
                                </div>

                                <div
                                    className={
                                        "form-group" +
                                        (submitted && !this.state.workout.description ? " has-error" : "")
                                    }
                                >
                                    <label
                                        htmlFor="exampleInputEmail1"
                                        className="font-semibold black-txt description"
                                    >
                                        Description <span className="orangefont">*</span>
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
                                        ref={input => this.description = input}
                                    />


                                    {submitted && !this.state.workout.description && (
                                        <div className="text-danger">Description is required</div>
                                    )}
                                </div>
                                {this.props.is_auth && this.props.logged_userData.isCreator &&
                                    <div
                                        className={
                                            "form-group" +
                                            (submitted && (!this.state.workout.videoS3Url || (this.state.workout.videoS3Url && (this.state.videoUrlError || this.state.videoUrlNotExistsError))) ? " has-error" : "")
                                        }
                                    >
                                        <label
                                            htmlFor="exampleInputEmail1"
                                            className="font-semibold black-txt"
                                        >
                                            Video URL
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="videoS3Url"
                                            aria-describedby="emailHelp"
                                            placeholder=""
                                            name="videoS3Url"
                                            defaultValue={this.state.workout.videoS3Url || ''}
                                            onChange={this.handleChange}
                                        />
                                        {submitted && !this.state.postVideoFile && !this.state.workout.videoS3Url && (
                                            <div className="text-danger">Video URL is required</div>
                                        )}
                                        {submitted && !this.state.postVideoFile && this.state.workout.videoS3Url && this.state.videoUrlError && (
                                            <div className="text-danger">That's not a valid URL. Please try again.</div>
                                        )}
                                        {submitted && this.state.videoUrlNotExistsError && (
                                            <div className="text-danger">That filename does not exist on S3. Please try again.</div>
                                        )}
                                    </div>
                                }
                                {submitted && this.state.isBothFileOptions && (this.state.isS3UrlChanged && this.state.isVideoChanged) && (
                                    <div className="text-danger">Both S3 and file upload cannot be used at the same time. Please remove one before saving.</div>
                                )}
                                <div
                                    className={
                                        "form-group row col-md-12 " +
                                        (submitted && (!this.state.workout.postFile || (this.state.workout.videoUrl && this.state.workout.postErr)) ? " has-error" : "")
                                    }
                                >
                                    <div class="button-wrapper pull-left">
                                        <span class="label text-width">
                                            Upload video
                                        </span>
                                        <input type="file" name="upload" id="upload" onChange={this.onVideoChange} class="upload-box" placeholder="Upload File" accept="video/*" disabled={loading} />

                                    </div>
                                    {this.state.isBothFileOptions && this.state.isS3UrlChanged && this.state.isVideoChanged &&
                                        <span className="text-danger label align-self-center p-t-10 pull-left pointer col-2 text-right" onClick={this.removeVideoFromUpload}>Remove</span>}
                                    {this.state.postVideo && (
                                        this._renderThumbnailContent(this.state.postVideo, this.state.postVideoFile)
                                    )}
                                    {this.state.postErr && !this.state.workout.postVideoFile &&
                                        <div className="text-danger" >Please upload Video
                                        </div>
                                    }
                                    {this.state.fileTypeErr &&
                                        <div className="text-danger" >Please select video File
                                        </div>
                                    }
                                    {(submitted && ((this.props.logged_userData.isCreator && !this.state.workout.videoS3Url && !this.state.workout.postVideoFile) || (!this.props.logged_userData.isCreator && (!this.state.postVideoFile && !this.state.workout.postVideoFile)))) && (
                                        <div className="text-danger">Video is required</div>
                                    )}

                                </div>
                                {submitted && this.state.postVideoFile != undefined && this.state.percentCompleted != '100' && this.state.percentCompleted != '0' &&
                                    <div className="text-danger">Please don’t close this window until uploading has completed.</div>
                                }
                                <div className="col-md-12 text-center p-0 m-b-15">
                                    <div className="row">
                                        {/* <div className="col-md-4">
                                            <label className="m-t-5 pull-left" htmlFor="isLive">
                                                <input type="checkbox" name="isLive" id="isLive" defaultChecked={this.state.workout.isLive} onChange={this.handleCheckboxChange} value={this.state.workout.isLive} />
                                            </label>
                                            <span className="font-semibold black-txt">List this On Demand Video</span>
                                        </div> */}
                                        <div className="offset-4 col-md-4">
                                            <button
                                                disabled={loading}
                                                onClick={this.onSubmitWorkout}
                                                className=" btn btn-block mybtn btn-login tx-tfm font-book font-14 post-progress-bar"
                                            >Save Changes {/* this.state.percentCompleted != '0' && this.state.percentCompleted != '100' && <div className={"c100 p" + this.state.percentCompleted + " small"}>
                                                <span>{this.state.percentCompleted}%</span>
                                                <div class="slice">
                                                    <div class="bar"></div>
                                                    <div class="fill"></div>
                                                </div>
                                            </div>
                                                 */}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
                <WorkoutConfirmationModal
                    is_model_open={this.state.openModel}
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
        workout_details: state.workout.workout_detail_data,
        cropped_image: state.workout.cropped_image,
        cropped_file: state.workout.cropped_file,
        is_group_mode: state.header.is_group_mode,
        logged_userData: state.header.logged_userData,
        fileData: state.workout.fileData,
        is_group_admin: state.group.is_group_admin,
        is_group_leader: state.group.is_group_leader,
    };
};

const mapDispatchToProps = {
    getTags,
    getRecordingOf,
    getRecordingOfDetails,
    getInstructor,
    ondemandCMSModelOpen,
    createNewTag,
    removeTag,
    clearOndemandList,
    imageCropOpenPopup,
    setFile,
    checkVideoUrlExists,
    sendFileuploadNotification
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkoutCMSComponent);
