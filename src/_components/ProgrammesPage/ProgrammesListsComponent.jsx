import React from 'react';
import { connect } from "react-redux";
import { toast } from "react-toastify";
import * as constand from "../../constant";
import { Helmet } from "react-helmet";
import { commonService } from "../../_services";
import { fetchProgrammeList, start_loader, stop_loader, setProgramType } from "../../actions";
import CoreProgrammesComponents from './CoreProgrammesComponents';
import AnimateLoaderComponent from "../../_layoutComponents/AnimateLoaderComponent";
import SortByComponent from '../Common/SortByComponent';
import ReactPlayer from 'react-player';

class ProgrammesListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Loading: true,
            condition: this.props.params.condition,
            programmeList: [],
            offset: constand.CONSTZERO,
            limit: constand.CONSTEIGHT,
            count: constand.CONSTZERO,
            programType: this.props.active_type,
            sortby: 'Default',
            isShowAll: 0,
            modified: 0,
            videoUrl: 'https://vimeo.com/359842015'
        };
        this.lastState = this.props.params.condition;
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        console.log("pro-list", this.props)
        this.fetchProgrammeList();
    }

    componentWillReceiveProps(props) {
        console.log('this.lastState', this.lastState + '=' + props.params.condition)
        if (this.lastState != props.params.condition) {
            this.lastState = props.params.condition;
            this.setState(
                {
                    condition: props.params.condition,
                    programmeList: [],
                    offset: constand.CONSTZERO,
                    limit: constand.CONSTEIGHT,
                    count: constand.CONSTZERO,
                },
                function () {
                    this.fetchProgrammeList();
                }
            );
        }
    }

    handleChange(item) {
        console.log('item', item)

        /* const { name, value } = e.target;
        console.log("event", value); */
        this.setState({ sortby: item }, function () {

            console.log("this.state.sortby", this.state.sortby)
            this.fetchProgrammeList();
        });
    }
    clearData = () => {
        this.setState({
            programmeList: [],
            offset: constand.CONSTZERO,
            limit: constand.CONSTEIGHT,
            count: constand.CONSTZERO,
            sortby: 'Default',
            isShowAll: 0
        }, function () {
            this.fetchProgrammeList();
        });
    }
    /**
     * fetch details of Group
     */
    fetchProgrammeList() {
        var data = {
            condition: commonService.replaceChar(this.state.condition, true),
            offset: this.state.offset,
            limit: this.state.limit,
            programType: this.state.programType,
            sortby: this.state.sortby,
            isShowAll: this.state.isShowAll
        }
        this.setState({ Loading: true });
        this.props.fetchProgrammeList(data).then(
            response => {
                if (response) {
                    var newList = response.programmeList;
                    if (this.state.offset > 0) {
                        var existing = this.state.programmeList;
                        newList = [...existing, ...response.programmeList]
                    }
                    this.setState({
                        Loading: false,
                        programmeList: newList,
                        count: response.count
                    })
                }
            },
            error => {
                this.setState({
                    Loading: false
                });
                toast.error(error);
            }
        );
    }

    loadMoreProgrammes = () => {
        this.setState({
            offset: (this.state.offset + this.state.limit) + 1
        }, () => {
            this.fetchProgrammeList();
        });
    }

    showAll = () => {
        this.setState({
            isShowAll: 1
        }, () => {
            this.fetchProgrammeList();
        });
    }
    updateWatchedVideoDetails = (index, data, userProgram) => {

        console.log('data', data)
        var tempData = this.state.programmeList;
        tempData[index].completed_times = data.completedPrograms;
        tempData[index].completed_workout_count = data.completedClass;
        tempData[index].UserPrograms.push(userProgram);
        this.setState({
            programmeList: tempData, modified: this.state.modified + 1
        })
        //this.state.programmeList[index].UserPrograms = 
    }
    renderProgramsComponent() {
        return (
            <div className="tab-content dash_tab  col-md-12 p-0 m-t-10 m-b-20">
                {this.state.programType == 'core' &&
                    <CoreProgrammesComponents {...this.props}
                        programType={this.state.programType}
                        programmeList={this.state.programmeList}
                        updateWatchedVideoDetails={this.updateWatchedVideoDetails}
                        modified={this.state.modified}
                        Loading={this.state.Loading}
                    />
                }
                {this.state.programType == 'module' &&
                    <CoreProgrammesComponents {...this.props}
                        programType={this.state.programType}
                        programmeList={this.state.programmeList}
                        updateWatchedVideoDetails={this.updateWatchedVideoDetails}
                        modified={this.state.modified}
                        Loading={this.state.Loading}

                    />
                }
                {/* this.state.programType == 'bundle' &&
                    <CoreProgrammesComponents {...this.props} programType={this.state.programType} />
                 */}
                {this.state.count > this.state.programmeList.length &&
                    <div className="col-md-12 col-lg-12 col-sm-12 text-center float-left m-t-30">

                        <span className="btn btn-orange-inverse font-14 mb-3 mr-3 font-book pointer col-md-3">
                            <a onClick={() => {
                                this.loadMoreProgrammes()
                            }} > Load more programs</a>
                        </span>

                        <span className="btn btn-orange font-14 mb-3 font-book pointer col-md-3">
                            <a onClick={() => {
                                this.showAll()
                            }} > Show all</a>
                        </span>

                    </div>
                }
            </div>
        )
    }
    renderListData() {
        return (
            <div className="w-100">
                <div className="program_tab_set navtabalign">
                    <div className="mx-auto tab_full">
                        <ul className="nav nav-tabs small justify-content-left mx-auto  tab_ul" >
                            <li className={"nav-item " + (this.state.programType == 'core' ? "active" : "")}>
                                <span className=" nav-link font-semibold font-book capitalize_text"
                                    onClick={() => {
                                        this.props.setProgramType('core')
                                        this.setState({ programType: 'core' }, function () {
                                            this.clearData()
                                        })
                                    }}
                                >
                                    Start Beaming <span>Programs</span>
                                </span>
                            </li>
                            <li className={"nav-item " + (this.state.programType == 'module' ? "active" : "")}>
                                <span className=" nav-link font-semibold font-book capitalize_text"
                                    onClick={() => {
                                        this.props.setProgramType('module')
                                        this.setState({ programType: 'module' }, function () {
                                            this.clearData()
                                        })
                                    }}
                                >
                                    Beam Spotlight <span>Programs</span>
                                </span>
                            </li>
                            {/* <li className="nav-item active">
                                <span className=" nav-link font-semibold font-book capitalize_text"
                                    onClick={() => { this.setState({ programType: 'bundle' }) }}
                                >
                                    Bundle Programs
                                </span>
                            </li> */}
                        </ul>
                    </div>
                </div>
                <div className="liveclass-listing">
                    <div className="col-md-12">
                        <div className="row">
                            {this.state.condition == constand.CONDITION &&
                                <div className="media media_for_mobile col-md-3 col-lg-3 leftabs_img">
                                    <div className="pull-left position-relative mb-0 ">
                                        <ReactPlayer url={this.state.videoUrl} controls={false} width="100%" height="100%" />
                                    </div>
                                </div>
                            }
                            <div className={this.state.condition == constand.CONDITION ? "col-md-9 col-lg-9" : "col-md-12 col-lg-12"}>
                                <div className="w-100 row m-0">
                                    {this.state.programType == 'core' &&
                                        <p className="font-qregular font-18">Start Beaming Programs are designed to help you explore different types of exercise for physical and emotional health benefits. These programs are curated for people with specific health conditions and disease severity to ensure they are relevant, accessible and effective for anyone. Start Beaming to receive all the feel-good benefits of one of our Beam programs.</p>
                                        ||
                                        <p className="font-qregular font-18">Beam Spotlight Programs are designed to support specific and often complex needs through exercise, education and wellbeing support. These programs are curated for people with specific health conditions who have additional diagnoses or comorbidities. They may also introduce new exercise disciplines or wellbeing techniques to help you feel good.</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="ht-1 bg-beam-blue" />
                </div>
                <div className="sorting_div col-lg-12 p-0">
                    <SortByComponent
                        sort_filter={this.state.sortby}
                        sortByFunction={this.handleChange}
                        page="program"
                    />
                    {/* <label className="label_sort">Sort By:</label>
                    <select className="sortby_dropdown" onChange={this.handleChange}>
                        <option value="Select">Select</option>
                        <option value="newestFirst">Newest first</option>
                    </select> */}
                </div>
                <div className="text-center w-100">
                    {(this.state.Loading) && (<AnimateLoaderComponent />)}
                </div>
                <React.Fragment>
                    {this.renderProgramsComponent()}
                </React.Fragment>
            </div>

        )
    }

    render() {
        return (
            <div className="">
                <Helmet>
                    <title>{constand.PROGRAMS_TITLE}{this.props.params.condition}{constand.BEAM}</title>
                    <meta property="og:title" content={constand.PROGRAMS_TITLE + this.props.params.condition + constand.BEAM} />
                    <meta property="og:description" content={constand.PROGRAMS_DESC} />
                    <meta property="og:image" content={constand.PROGRAMS_PAGE_IMAGE} />
                    <meta property="og:url" content={window.location.href} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta property="og:site_name" content="Beam" />
                    <meta name="twitter:image:alt" content={constand.PROGRAMS_PAGE_IMAGE_ALT} />
                </Helmet>
                <div className="container program_tab_page programs_page_tab programs_page_tab_new">
                    <div className="col-md-12">
                        <div className="row">
                            {this.renderListData()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        active_type: state.programme.active_type
    };
};

const mapDispatchToProps = {
    fetchProgrammeList, start_loader, stop_loader, setProgramType
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProgrammesListComponent);




