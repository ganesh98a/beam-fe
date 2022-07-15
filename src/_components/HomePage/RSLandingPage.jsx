import React from 'react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
    start_loader,
} from "../../actions";
import { toast } from "react-toastify";
import * as constand from "../../constant";
import ReactPlayer from 'react-player';
import CommonForm from './CommonForm';

class RSLandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoUrl: 'https://vimeo.com/427103500',
        }
    }
    render() {
        return (
            <React.Fragment>
                <div className="kd_landing_page cancer_landing_page">
                    <section className="bg-contrast1">
                        <div class="container-fluid w-80 fullwidth">
                            <div class="row">
                                <div class="col-xl-10 col-lg-10 col-md-10 col-sm-12 col-12 text-center welcome-container mx-auto">
                                    <div className="welcome-kidney font-bold white-txt">Beam Research Studies</div>

                                    <div class="helping-physiotherap white-txt font-qbold col-11 mx-auto">Helping researchers deliver online clinical trials and pilots focused on physical movement and wellbeing, for less.</div>

                                </div>
                                <div class="col-xl-3 col-lg-2 col-md-3 col-sm-3 d-sm-block header-img">
                                    <img class="img-fluid" src={constand.WEB_IMAGES + "Sun-landing.png"} />
                                </div>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div class="container-fluid fullwidth">
                            <div class="col-lg-12">
                                <div class="partner-title-black" id="clinicians">Our research customers include...</div>
                            </div>

                            <div className="col-lg-12">
                                <div class="row">
                                    <div className="col-lg-12 col-md-12">
                                        <div className="row">
                                            <div className="col-lg-2 col-md-4 col-sm-3 col-6 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/university-of-warwick.png"} className="w-65" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 col-6 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/cff-tomorrow.png"} className="w-65" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 col-6 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/RM-logo.png"} className="w-100" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 col-6 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/UofE.png"} className="w-65" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 col-6 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/cf-john-hopkins.png"} className="w-65" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 col-6 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "landing/NHS-right.png"} className="w-100" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 col-6 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/Brompton.png"} className="w-100" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 col-6 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/KRUK.png"} className="w-100" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 col-6 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/mgh-logo.png"} className="w-100" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 col-6 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/Indiana_University_Health.svg.png"} className="w-100" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 col-6 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/NHS-newcastle.png"} className="w-100" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 col-6 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/UAB.png"} className="w-100" /></div>

                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="bg-contrast2">
                        <div class="container-fluid w-80 fullwidth">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="partner-title-black" id="clinicians">What Is Beam Research Studies?</div>
                                </div>
                                <div class="col-lg-12">
                                    <div class="icon-desc m-t-20 font-qmedium offer-text" >
                                        Beam Research Studies is a digital platform that enables researchers and clinician to deliver end-to-end remote research projects and clinical trials that centre around exercise, health education, and improving wellbeing. It allows researchers to manage participants, upload content, and track data, all in one handy online hub.
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-4 icon-img">
                                    <div class="icon-img"><img src={constand.WEB_IMAGES + "invite-manage.png"} /></div>
                                    <div class="icon-title"><span>Invite & manage </span><span id="content2">participants</span></div>
                                    {/* <Link class="btn btn-purple m-t-30 p-t-10 p-b-10" to={'liveClasses/cystic-fibrosis'}>Explore</Link> */}
                                    <div class="icon-desc m-t-20 font-qmedium">Invite, collect background information on, and communicate with participants, online all in the virtual platform.</div>
                                </div>
                                <div class="col-lg-4 col-md-4 icon-img">
                                    <div class="icon-img"><img src={constand.WEB_IMAGES + "On-demand.png"} /></div>
                                    <div class="icon-title">Host live & on-demand classes</div>

                                    <div class="icon-desc m-t-20 font-qmedium">Create your own live and on-demand video exercise or education classes, plus upload supplementary media like PDFs.</div>
                                </div>
                                <div class="col-lg-4 col-md-4 icon-img">
                                    <div class="icon-img"><img src={constand.WEB_IMAGES + "track-outcome.png"} className="m-b-10" /></div>
                                    <div class="icon-title m-0">Track outcome measures & data</div>
                                    <div class="icon-desc m-t-20 font-qmedium">Collect data via questionnaires, plus track a range of metrics such as class attendance, movement minutes, and outcome measures.</div>
                                </div>
                                <div className="col-lg-12 text-center">
                                    <a class="btn btn-darkblue m-t-50 font-18  w-45 p-t-10 p-b-10 col-md-4 " href={'#contact-form'}>Find Out More</a>
                                </div>
                            </div>

                        </div>
                    </section>

                    <section className="bg-contrast4 section-2 p-t-80">
                        <div className="container-fluid mx-auto w-75 fullwidth">
                            <div className="row">
                                <div className="col-12 col-md-8 col-lg-7 pl-5 align-section align-items-center">
                                    <div className="">
                                        <h4 className="m-b-20 text-abbey take-tour font-semibold card-block">Widen participation and lower costs</h4>

                                        <p className="text-abbey before-start">
                                            Our virtual solution makes it easy to widen participation, as participants can join from anywhere. It also cuts down on travel and facilities expenses, making studies more cost-efficient to run. We can even assist with recruitment from the Beam database in certain scenarios.
                                </p>
                                    </div>
                                    <a class="btn btn-darkblue font-18 p-t-10 p-b-10 w-45 " href={'#contact-form'}>Find out more</a>

                                </div>
                                <div className="col-12 col-md-4 col-lg-5 text-left p-b-30 video-player-order align-self-center">
                                    {<figure className="text-left"><img src={constand.WEB_IMAGES + "widen-participation.png"} className="img-fluid" alt="" /></figure>}
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="bg-contrast3 section-2 p-t-80">
                        <div className="container-fluid mx-auto w-75 fullwidth">
                            <div className="row">
                                <div className="col-12 col-md-4 col-lg-5 text-left p-b-30 video-player-order">

                                    {<figure className="text-left"><img src={constand.WEB_IMAGES + "Hospital_Chair_Room.png"} className="img-fluid" alt="" /></figure>}
                                </div>

                                <div className="col-12 col-md-8 col-lg-7 pl-5 align-section align-items-center text-right">
                                    <div className="">
                                        <h4 className="m-b-20 text-abbey take-tour font-semibold card-block">Free training and support from our expert team</h4>

                                        <p className="text-abbey before-start">
                                            Receive free training and ongoing support on hosting classes, using the platform and tracking data from our highly experienced team of physiotherapists and health specialists.
                                </p>
                                    </div>
                                    <a class="btn btn-darkblue font-18 p-t-10 p-b-10 w-45 " href={'#contact-form'}>Find out more</a>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section class="">
                        <div class="container-fluid w-80 p-b-20 fullwidth">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="partner-title-black" id="clinicians">What our partners say</div>
                                </div>
                                <div class="section-content font-qmedium">
                                    "Clinical trials testing health and well-being interventions are facing unique challenges during the Covid-19 pandemic. Beam Research has allowed us to deliver existing trials, and begin new trials, that otherwise would not have been possible. The platform is intuitive for both participants and practitioners, offering a great user experience and all the functionality needed to conduct robust clinical research. This has opened our eyes to new ways of working. I have no doubt that online delivery of clinical trials will continue way beyond the end of the pandemic."
                                </div>
            <p className="font-qbold col-md-6 text-center mx-auto">Dr Gordon McGregor, Clinical Exercise Physiologist University Hospitals Coventry & Warwickshire NHS Trust</p>

                            </div>

                        </div>
                    </section>
                    <section class="bg-contrast2">
                        <div class="container-fluid w-80 p-b-20 fullwidth">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="partner-title-black" id="clinicians">How much does it cost?</div>
                                </div>
                                <div class="section-content font-qmedium">
                                    Access to Beam Research Studies starts from just <span class="font-bold">£399 per month</span>, or <span class="font-bold">£2800 per year</span> (minimum 3 month contract). We are more than happy to discuss your requirements - simply <a href="#contact-form" style={{color:"inherit"}}><u>get in touch</u></a> to tell us more about your study, and we can put a free quote together for you.
				                </div>
                            </div>

                        </div>
                    </section>

                    <section class="bg-contrast4">
                        <div class="container-fluid w-80 fullwidth" id="contact-form">
                            <div class="row">
                                <div class="col-lg-12 text-center">
                                    <p class="font-medium take-tour text-abbey">Get in touch for a free chat</p>
                                    <p class="font-qmedium text-abbey m-t-40 section-content">
                                        If you'd like a <span class="font-bold">free, no-obligation chat</span> about how we could help deliver your research study or clinical trial, simply fill in the form below. If you're not a fan of forms, drop us a note to hello@beamfeelgood.com and someone from the Beam Team will get back to you.</p>
                                    <div class="section-content text-left">
                                        <div className="col-lg-8 col-md-12 ml-auto mr-auto">
                                            <CommonForm location={this.props.location} from="rs" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </React.Fragment>
        )
    };
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = {
    start_loader
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RSLandingPage);
