import React from 'react';
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import * as constand from "../../constant";
import { toast } from "react-toastify";
import { fetchProgrammeList, ProgrammeDetail, loginModelOpen, ProgrammeDetailWorkouts, isPlayOndemand, isOpenProgramSurveyModel, programDetailData } from "../../actions";
import { commonService } from "../../_services";
import { Link } from 'react-router-dom';
import { floor } from 'mathjs';
import _ from 'lodash';
import PlayOndemand from '../Common/PlayOndemand';
import ProgramPlayer from './ProgramPlayer';

class CoreProgrammesComponents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            programmeDetail: {},
            Loading: true,
            condition: this.props.params.condition,
            programType: this.props.programType,
            programmeList: [],
            offset: constand.CONSTZERO,
            limit: constand.CONSTEIGHT,
            count: constand.CONSTZERO,
            sortby: 'Newest first',
            isShowAll: 0,
            isJoinedNow: false,
            completedClass: 0,
            completedPrograms: 0,
            charLimit: [],
            charStaticLimit: 200,
            isStartProgram: false,
            enable_player: false,
            programTrailerURL: ''
        };
        this.lastState = this.props.params.condition;
    }
    componentWillReceiveProps(props) {
        if (this.lastState != props.params.condition) {
            this.lastState = props.params.condition;
            this.setState(
                {
                    condition: props.params.condition,
                    programmeList: [],
                    offset: constand.CONSTZERO,
                    limit: constand.CONSTEIGHT,
                    count: constand.CONSTZERO,
                    isShowAll: 0,
                });
        }
    }

    /**
    * fetch programme detail
    */
    fetchProgrammeWorkouts(programDetails) {
        var data = { programId: this.props.match.params.programId }
        if (programDetails.UserProgram) {
            data.userProgramId = programDetails.UserProgram.id;
        }
        this.props.ProgrammeDetailWorkouts(data).then(
            response => {
                if (response) {
                    this.setState({
                        workoutList: response.list,
                        count: response.count,
                        completedClass: response.completedClass,
                        completedPrograms: response.completedPrograms,
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
    startNextClass = (programId = 0, item, programWorkoutsRecent, keyIndex) => {
        this.props.programDetailData(item);
        var index = 0;
        if (!programId) {
            var index = item.completed_workout_count || 0;
        }
        var workout = { workout: programWorkoutsRecent[index].Workout };
        this.setState({
            programId: programWorkoutsRecent[index].programId,
            workoutId: programWorkoutsRecent[index].workoutId,
            ondemand_detail_data: workout,
            keyIndex: keyIndex,
            programDetails: item,
            isStartProgram: programId ? true : false
        }, function () {
            // this.props.isPlayOndemand(true)
            if (this.props.program_detail && this.props.program_detail.preSurvey && this.props.programId && programWorkoutsRecent[0].workoutId == this.props.workoutId) {
                this.props.isOpenProgramSurveyModel(true)
            } else {
                this.props.isPlayOndemand(true)
            }
        })
    }
    // Start trailerVideo player
    startTrailerVideo = (trailerURL) => {
        this.setState({ enable_player: true, programTrailerURL: trailerURL })
    }
    // Close trailerVideo player
    closeVideoModel() {
        this.setState({ enable_player: false })
    }

    /**
    * fetch details of Group
    */
    fetchProgrammeList1() {
        var data = { condition: commonService.replaceChar(this.state.condition, true), offset: this.state.offset, limit: this.state.limit, programType: this.state.programType, sortby: this.state.sortby, isShowAll: this.state.isShowAll }
        this.setState({ Loading: true });
        this.props.fetchProgrammeList(data).then(
            response => {
                if (response) {
                    var existing = this.state.programmeList;
                    var newList = [...existing, ...response.programmeList]
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

    updateProgramDetails = (userProgram) => {
        console.log('closewithprogrema', userProgram)
        var data = { programId: this.state.programId }
        if (userProgram && userProgram.id) {
            data.userProgramId = userProgram.id;
        }
        /*  if (this.state.programDetails.UserPrograms.length) {
             let programWorkoutsRecent = _.sortBy(this.state.programDetails.UserPrograms, (e) => {
                 return e.id
             }).reverse();
             data.userProgramId = programWorkoutsRecent[0].id;
         } */
        this.props.ProgrammeDetailWorkouts(data).then(
            response => {
                if (response) {
                    this.props.updateWatchedVideoDetails(this.state.keyIndex, response, userProgram)
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

    renderCoreProgramsComponent() {
        return this.props.programmeList.map((item, index) => {
            var desc = item.shortDesc ? item.shortDesc.substr(0, (this.state.charLimit[index] || this.state.charStaticLimit)) : '';
            if (item.shortDesc && (item.shortDesc.length > (this.state.charLimit[index] || this.state.charStaticLimit))) {
                desc = desc.concat('...');
            }

            let programWorkoutsRecent = _.sortBy(item.ProgramWorkouts, (e) => {
                return e.workoutNum
            });

            return (
                <div className="list-group-item liveclass-listing " key={index}>
                    <div className="col-md-12">
                        <div className="row">
                            <div className="media media_for_mobile col-md-3 col-lg-3 leftabs_img">
                                <div className="mobile_view_show"><h3 class="heading_prgs"><Link
                                    className="flow-text"
                                    to={"/programmes/detail/" + this.state.condition + "/" + item.id}
                                > {item.title}</Link></h3></div>
                                <figure className="pull-left position-relative mb-0">
                                    <Link to={"/programmes/detail/" + this.state.condition + "/" + item.id}>
                                        <img className="media-object image-size img-rounded img-fluid"
                                            src={constand.PROGRAM_IMG_PATH + item.img}
                                            onError={(e) => commonService.checkImageCrop(e, 'ondemand-placeholder.png')} />

                                    </Link>
                                    {item.UserPrograms && item.UserPrograms.length > 0 &&
                                        <span class="position-absolute vid_time">
                                            <div className="row w-100">

                                                <div className="col-lg-12 col-md-8">
                                                    <Link style={{ 'text-decoration': 'none' }} to={"/programmes/detail/" + this.state.condition + "/" + item.id}>
                                                        {item.completed_workout_count != item.numWorkouts && <h4 className="orange_pos_text">{item.completed_workout_count}&nbsp;out of&nbsp;{item.numWorkouts}&nbsp;Classes<br />&nbsp;Completed</h4>
                                                            ||
                                                            <h4 className="orange_pos_text">Completed {item.completed_times} times</h4>
                                                        }
                                                    </Link>
                                                    <div class="line-bar font-16 progressbar_star prg_bar_line">
                                                        <div class="progress">
                                                            <div className={"progress-bar p-l-10 p-r-10 " + (floor((item.completed_workout_count * 100) / item.numWorkouts) == 0 ? "empty-progress" : "")} role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style={{ width: (floor((item.completed_workout_count * 100) / item.numWorkouts) == 0) ? '15%' : floor((item.completed_workout_count * 100) / item.numWorkouts) + '%' }}>
                                                                <span class="font-semibold font-50">{floor((item.completed_workout_count * 100) / item.numWorkouts)}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </span>
                                    }
                                </figure>
                                <div className="mobile_view_show">
                                    <h3 class="heading_prgs mobile_view_show">
                                        <span className="orange-txt">
                                            {item.numWorkouts} Classes
                                        </span></h3>
                                    {(!item.UserPrograms || !item.UserPrograms.length) && <button className={"btn button-filter font-medium font-14 pointer w-100 btn-purple pl-1 pr-1 mb-3" + (this.state.classType == '' ? '' : '')}
                                        onClick={() => {
                                            this.startNextClass(item.id, item, programWorkoutsRecent, index)
                                        }}
                                        disabled={this.props.loader_state}
                                    > Start Program
                                    </button>
                                    }
                                    {(item.UserPrograms && item.UserPrograms.length > 0 && item.completed_workout_count == item.numWorkouts) && <button className={"btn button-filter font-medium font-14 pointer w-100 btn-purple pl-1 pr-1 mb-3"}
                                        onClick={() => {
                                            this.startNextClass(item.id, item, programWorkoutsRecent, index)
                                        }}
                                        disabled={this.props.loader_state}
                                    > Restart
                                    </button>
                                    }
                                    {(item.UserPrograms && item.UserPrograms.length > 0 && item.completed_workout_count < item.numWorkouts) && <button className={"btn button-filter font-medium font-14 pointer w-100 btn-purple pl-1 pr-1 mb-3"}
                                        onClick={() => { this.startNextClass(0, item, programWorkoutsRecent, index) }}
                                        disabled={this.props.loader_state}
                                    > Start next class
                                    </button>
                                    }
                                    {item.trailerURL &&
                                        <button className={"btn button-filter mobile_view_hide font-medium font-14 pointer w-100 btn-purple-inverse d-flex align-items-center pl-1 pr-1 mb-3 justify-content-center"}
                                            onClick={() => {
                                                this.startTrailerVideo(item.trailerURL)
                                            }}
                                        > <img src={constand.WEB_IMAGES + 'play-purple-icon.png'} width="18px" className="mr-2" /> Watch trailer</button>
                                    }
                                </div>
                            </div>
                            <div className="col-md-7 col-lg-7">
                                <div className="w-100 row m-0">
                                    <h3 class="heading_prgs mobile_view_hide"><Link
                                        className="flow-text"
                                        to={"/programmes/detail/" + this.state.condition + "/" + item.id}
                                    > {item.title}</Link>
                                        <span className="orange-txt">
                                            {item.numWorkouts} Classes
                                        </span></h3>
                                    {item.shortDesc &&
                                        <div className="desc_para_set">
                                            {<p dangerouslySetInnerHTML={{
                                                __html: desc
                                            }}></p>}
                                            {item.shortDesc && (item.shortDesc.length > (this.state.charLimit[index] || this.state.charStaticLimit)) && <span class="readmoreoptions" onClick={() => {
                                                var tempChar = this.state.charLimit;
                                                tempChar[index] = item.shortDesc ? item.shortDesc.length : 0;
                                                this.setState({ charLimit: tempChar })
                                            }}>Read more</span>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="col-md-2 col-lg-2">
                                {(!item.UserPrograms || !item.UserPrograms.length) &&
                                    <button className={"btn button-filter mobile_view_hide font-medium font-14 pointer w-100 btn-purple pl-1 pr-1 mb-3 "}
                                        onClick={() => {
                                            this.startNextClass(item.id, item, programWorkoutsRecent, index)
                                        }}
                                        disabled={this.props.loader_state}
                                    > Start program </button>
                                }
                                {(item.UserPrograms && item.UserPrograms.length > 0 && item.completed_workout_count == item.numWorkouts) &&
                                    <button className="btn button-filter mobile_view_hide font-medium font-14 pointer w-100 btn-purple pl-1 pr-1 mb-3" onClick={() => {
                                        this.startNextClass(item.id, item, programWorkoutsRecent, index)
                                    }}
                                        disabled={this.props.loader_state}
                                    >
                                        {'Restart'}
                                    </button>}
                                {(item.UserPrograms && item.UserPrograms.length > 0 && item.completed_workout_count < item.numWorkouts) &&
                                    <button className="btn button-filter mobile_view_hide font-medium font-14 pointer w-100 btn-purple pl-1 pr-1 mb-3"
                                        onClick={() => {
                                            this.startNextClass(0, item, programWorkoutsRecent, index)
                                        }}
                                        disabled={this.props.loader_state}
                                    >
                                        {'Start next class'}
                                    </button>
                                }
                                <Link
                                    className="btn button-filter font-medium font-14 pointer w-100 btn-purple-inverse pl-1 pr-1 mb-3"
                                    to={"/programmes/detail/" + this.state.condition + "/" + item.id}
                                >Learn more </Link>
                                <div className="mobile_view_hide">
                                    {item.trailerURL &&
                                        <button className={"btn button-filter  font-medium font-14 pointer w-100 btn-purple-inverse align-items-center pl-1 pr-1 mb-3 justify-content-center d-flex"}
                                            onClick={() => {
                                                this.startTrailerVideo(item.trailerURL)
                                            }}
                                        ><img src={constand.WEB_IMAGES + 'play-purple-icon.png'} width="25px" className="mr-2" /> Watch trailer</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )
        });
    }
    renderListData() {
        return (
            <>
                <React.Fragment>
                    <div id="products" className="row col-sm-12 p-0 m-0 programs_page_tab programs_page_tab_imgalgn">
                        {!this.props.Loading &&
                            <div className="list-group w-100">
                                {this.renderCoreProgramsComponent()}
                            </div>
                        }
                    </div>
                    {<PlayOndemand
                        condition={this.props.params.condition}
                        programId={this.state.programId}
                        workoutId={this.state.workoutId}
                        history={this.props.history}
                        ondemand_detail_data={this.state.ondemand_detail_data}
                        closeWithProgram={(id) => { this.updateProgramDetails(id) }}
                        isStartProgram={this.state.isStartProgram}
                    />}
                    {this.state.enable_player &&
                        <ProgramPlayer
                            enable_video={this.state.enable_player}
                            closeVideoModel={() => { this.closeVideoModel() }}
                            ProgramTrailerURL={this.state.programTrailerURL}
                        />
                    }
                </React.Fragment>
            </>
        )
    }
    render() {
        return (
            <div>
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
                <React.Fragment>

                    {/* {(this.state.programmeList && this.state.programmeList.length > 0) && */}
                    {this.renderListData()}
                    {/* } */}
                </React.Fragment>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        is_auth: state.auth.is_auth,
        logged_userData: state.header.logged_userData,
        loader_state: state.header.loader_state,
    };
};

const mapDispatchToProps = {
    ProgrammeDetailWorkouts, ProgrammeDetail, loginModelOpen, fetchProgrammeList, isPlayOndemand, isOpenProgramSurveyModel, programDetailData
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CoreProgrammesComponents);
