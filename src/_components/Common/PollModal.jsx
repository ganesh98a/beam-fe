import React from "react";
import Modal from "react-responsive-modal";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { setPollModal, savePoll } from "../../actions";
import { toast } from 'react-toastify';
import { Cookies } from "react-cookie-consent";
import * as constand from "../../constant";
import { commonService } from "../../_services";
import moment from 'moment';
import EventCalendarComponent from "../DashboardPage/EventCalendarComponent";
const monthNames = constand.MONTH_LIST;
const initQuestionTemplate = {
    "name": "",
    "type": "single",
    "answers": []
};
class PollModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            submitted: false,
            pollList: {
                workoutId: '',
                pollName: '',
                pollValues: {}
            },
            randomArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            pollQuestionsArray: [],
            questionTemplate: {
                "name": "",
                "type": "single",
                "answers": []
            },
            isQueSecError: false,
            showQuestions: true,
            isEdit: false,
            editingKey: '',
            titleText: 'Add',
            isShowSave: true
        };
        this.closeModel = this.closeModel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderQuestions = this.renderQuestions.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.removeQuestion = this.removeQuestion.bind(this);
        this.handleChangeQuestions = this.handleChangeQuestions.bind(this);
        this.validateQuestions = this.validateQuestions.bind(this);
        this.handleChangeAnswers = this.handleChangeAnswers.bind(this);
        this.clearQuestionTemplate = this.clearQuestionTemplate.bind(this);
        this.editQuestion = this.editQuestion.bind(this);
        this.submitQuestion = this.submitQuestion.bind(this);
        this.saveQuestion = this.saveQuestion.bind(this);
    }
    componentDidMount() {
        var pollList = this.props.liveclass_detail_data.liveClasses ? this.props.liveclass_detail_data.liveClasses.liveclass.Polls : [];
        var workoutId = this.props.liveclass_detail_data.liveClasses ? this.props.liveclass_detail_data.liveClasses.liveclass.id : '';
        console.log('props', this.props)
        console.log('this.props.editPollKey', this.props.editPollKey)
        if (typeof this.props.editPollKey != 'string' && this.props.editPollKey >= 0) {
            pollList.workoutId = workoutId;
            var pollvalues = (typeof pollList[this.props.editPollKey].pollValues == 'string') ? JSON.parse(pollList[this.props.editPollKey].pollValues) : pollList[this.props.editPollKey].pollValues;
            pollList[this.props.editPollKey].pollValues = pollvalues;
            this.setState({ pollList: pollList[this.props.editPollKey], pollQuestionsArray: pollvalues, titleText: 'Edit' });
        } else if (pollList) {
            pollList.workoutId = workoutId;
            this.setState({ pollList: pollList })
        }
    }

    componentWillReceiveProps(nextProps) {

    }

    onCloseModal() { }

    closeModel() //for close the login model
    {
        this.props.setPollModal(false);
    }
    handleChange(e) {
        console.log('handleChange', e.target)
        const { name, value } = e.target;
        let { pollList } = this.state;
        this.setState({
            pollList: {
                ...pollList,
                [name]: value,
            },
        });
    }
    handleChangeQuestions(e) {
        const { name, value } = e.target;
        let { questionTemplate } = this.state;
        var temp = this.state.questionTemplate;
        temp[name] = value;
        this.setState({
            questionTemplate: temp
        });
    }
    handleChangeAnswers(e, ansKey) {
        console.log('handleChange', e.target)
        const { name, value } = e.target;
        let { questionTemplate } = this.state;
        var temp = this.state.questionTemplate;

        temp.answers[ansKey] = value;
        this.setState({
            questionTemplate: questionTemplate
            /* pollQuestionsArray: {
                ...pollQuestionsArray,
                temp
            }, */
        });
    }
    validateQuestions(questions) {
        var tempQues = questions;
        if (tempQues.name && tempQues.type && tempQues.answers.length >= 2) {
            return true;
        } else {
            return false;
        }
    }
    clearQuestionTemplate() {
        var tempQue = this.state.questionTemplate;
        tempQue.name = '';
        tempQue.type = 'single';
        tempQue.answers = [];
        this.setState({
            questionTemplate: tempQue
        })
        console.log('clearQuestionTemplate', this.state.questionTemplate)
    }
    addQuestion() {
        this.setState({ showQuestions: true })
        this.clearQuestionTemplate();
    }
    saveQuestion() {
        let questionTemplateOld = Object.assign({}, this.state.questionTemplate);
        const temp = questionTemplateOld; //this.state.questionTemplate;
        const tempPoll = this.state.pollQuestionsArray;
        if (this.validateQuestions(temp)) {
            this.setState({ showQuestions: false, isShowSave: false })
            if (this.state.isEdit) {
                tempPoll[this.state.editingKey] = temp;
            } else {
                tempPoll.push(temp);
            }
            // this.clearQuestionTemplate();
            this.setState({
                pollQuestionsArray: tempPoll,
                isQueSecError: false,
                isEdit: false,
                editingKey: ''
            }, function () { })
        } else {
            this.setState({ isQueSecError: true })
        }
    }
    removeQuestion(key) {
        const temp = this.state.pollQuestionsArray;
        this.clearQuestionTemplate();
        if (key > -1) {
            temp.splice(key, 1);
        }
        this.setState({
            pollQuestionsArray: temp
        })
    }
    editQuestion(key) {
        var temp = this.state.pollQuestionsArray;
        var temp2 = this.state.questionTemplate;
        console.log('temp', temp)
        this.setState({
            showQuestions: true,
            isShowSave: true,
            isEdit: true,
            questionTemplate: temp[key],
            editingKey: key
        })
    }
    submitQuestion() {
        this.setState({ submitted: true })
        var { pollList, pollQuestionsArray } = this.state;
        console.log('polllist', pollList);
        console.log('pollQuestionsArray', pollQuestionsArray);
        pollList.pollValues = pollQuestionsArray;
        console.log('params', pollList)
        if (!pollList.workoutId || !pollList.pollName || !pollList.pollValues.length > 0)
            return;

        console.log('params', pollList)
        this.setState({ submitted: false })

        this.props.savePoll(pollList).then(response => {
            this.props.setPollModal(false);
            var resdata = response;
            if (resdata.status) {
                toast.success(resdata.message)
            } else {
                toast.error(resdata.message)
            }
        }, error => {
        })
    }
    renderQuestions() {
        const { submitted, showQuestions } = this.state;
        console.log('this.state.questionTemplate', this.state.questionTemplate)
        return (
            <div class="m-b-10">
                <div className="poll-questions-section">
                    <div
                        className={
                            "form-group"
                        }
                    >
                        <textarea row="3" className="form-control" name="name" placeholder="Type your question here." onChange={(e) => { this.handleChangeQuestions(e) }} value={this.state.questionTemplate.name} ></textarea>

                        {/* showQuestions && !this.state.questionTemplate.name &&(
                            <div className="text-danger">Question is required</div>
                        ) */}
                    </div>

                    <div className="form-group">
                        <div className="row col-lg-12">
                            <div className="">
                                <input
                                    id={"radio-single"}
                                    name="type"
                                    value="single"
                                    defaultChecked={this.state.questionTemplate.type === "single"}
                                    type="radio"
                                    onChange={(e) => { this.handleChangeQuestions(e) }}
                                />
                            </div>
                            <label htmlFor={"radio-single"} className="radio-label col-md-4">Single Choice</label>
                            <div className="">
                                <input
                                    id={"radio-multiple"}
                                    name="type"
                                    value='multiple'
                                    defaultChecked={this.state.questionTemplate.type === "multiple"}
                                    type="radio"
                                    onChange={(e) => { this.handleChangeQuestions(e) }}
                                />
                            </div>
                            <label htmlFor={"radio-multiple"} className="radio-label col-md-4">Multiple Choice</label>
                        </div>
                    </div>

                    {this.state.randomArray.map((item, key) => {
                        return (
                            <div key={key}
                                className={
                                    "form-group"
                                }
                            ><input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    aria-describedby="emailHelp"
                                    placeholder={"Answer " + item + (item > 2 ? " (Optional)" : "")}
                                    name={"answer_" + key}
                                    value={this.state.questionTemplate.answers[key] ? this.state.questionTemplate.answers[key] : ''}
                                    onChange={(e) => { this.handleChangeAnswers(e, key) }}
                                />
                                {/* submitted && this.state.questionTemplate.answers.length < 2 && (
                                    <div className="text-danger">Answer is required</div>
                                ) */}
                            </div>
                        )
                    })
                    }

                </div>
            </div>
        )
    }
    renderQuestionsData() {
        return (
            <div class="m-b-10">
                {this.state.pollQuestionsArray.map((queItem, queKey) => {
                    return (
                        <div className="row" key={queKey}>
                            <div className="col-md-1"><p>{queKey + 1}.</p></div>
                            <div className="col-md-9">
                                {queItem.name}
                            </div>
                            <div className="col-md-2">
                                <span onClick={() => { this.removeQuestion(queKey) }} className="pull-right pointer twitter-color">Delete</span>
                                <span onClick={() => { this.editQuestion(queKey) }} className="pull-right pointer twitter-color m-r-10">Edit</span>

                            </div>
                        </div>
                    )
                })
                }
            </div>
        )
    }
    render() {
        const { submitted, titleText } = this.state;
        return (
            <React.Fragment>
                <Modal className="removebbg-popup" open={this.props.is_poll_modal_open} onClose={this.onCloseModal} center >
                    <div className="modal-dialog modal-width--custom cms-model m-t-80" role="document">
                        <div className="modal-content">
                            <div className="modal-header header-styling">
                                <h5
                                    className="modal-title text-left col-md-11 p-0 font-semibold"
                                    id="exampleModalLabel font-medium"
                                >{titleText} a Poll</h5>

                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true" onClick={() => { this.closeModel() }}>
                                        &times;
                </span>
                                </button>
                            </div>
                            <div className="modal-body pb-0">
                                <div
                                    className={
                                        "form-group" + (submitted && !this.state.pollList.pollName ? "has-error" : "")
                                    }
                                >
                                    {/*  <label
                                        htmlFor="exampleInputEmail1"
                                        className="font-semibold black-txt poll-title"
                                    >
                                        Poll title <span className="orangefont">*</span>
                                    </label> */}
                                    <input
                                        type="text"
                                        className="form-control poll-title"
                                        id="title"
                                        aria-describedby="emailHelp"
                                        placeholder="Enter a title for this poll."
                                        name="pollName"
                                        value={this.state.pollList.pollName}
                                        onChange={this.handleChange}
                                    />
                                    {submitted && !this.state.pollList.pollName && (
                                        <div className="text-danger">Class Name is required</div>
                                    )}
                                </div>
                                {this.renderQuestionsData()}
                                {this.state.showQuestions && this.renderQuestions()}

                                <div className="row">
                                    {this.state.isQueSecError &&
                                        <div className="col-md-12">
                                            <p className="text-danger">Please add a title and at least two answers to this question before adding another.</p>
                                        </div>
                                    }
                                    {!this.state.isShowSave &&
                                        <div className="col-md-12 text-center">
                                            <p onClick={() => {
                                                this.setState({ isShowSave: true })
                                                this.addQuestion()
                                            }} className="pointer twitter-color">+ Add a Question</p>
                                        </div>
                                    }
                                    {this.state.isShowSave &&
                                        <div className="col-md-12 text-center">
                                            <p onClick={() => {
                                                this.saveQuestion();
                                            }} className="pointer twitter-color">Save Question</p>
                                        </div>
                                    }
                                    {this.state.submitted &&
                                        <div className="col-md-12">
                                            <p className="text-danger">Please give required details before save.</p>
                                        </div>
                                    }
                                    <div className="col-md-12 m-b-20 m-t-20">
                                        <button className="btn btn-blue-inverse popup-btn pull-right col-md-4" onClick={() => { this.closeModel() }}
                                        >   Cancel</button>
                                        <button className="btn btn-login popup-btn m-r-10 h-auto pull-right col-md-4" onClick={() => { this.submitQuestion() }}>Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        is_auth: state.auth.is_auth,
        is_poll_modal_open: state.liveclass.is_poll_modal_open,
        liveclass_detail_data: state.liveclass.liveclass_detail_data,

    };
};

const mapDispatchToProps = {
    setPollModal, savePoll
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PollModal);
