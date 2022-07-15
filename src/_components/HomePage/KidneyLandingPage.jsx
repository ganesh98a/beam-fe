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

class KidneyLandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoUrl: 'https://youtu.be/lRTu1RqiKQM',
        }
    }
    render() {
        return (
            <React.Fragment>
                <div className="kd_landing_page">
                    <section className="bg-contrast1">
                        <div class="container-fluid w-80 fullwidth">
                            <div class="row">
                                <div class="col-xl-10 col-lg-10 col-md-10 col-sm-12 col-12 text-center welcome-container mx-auto">
                                    <div className="welcome-kidney font-bold white-txt">Welcome to Kidney Beam</div>

                                    <div class="helping-physiotherap white-txt font-qbold col-12 mx-auto">Helping people living with kidney disease to feel good through movement, education and wellbeing support.</div>
                                    <Link class="btn bluebtn m-t-50 font-18 w-45 p-t-10 p-b-10" to={'/register'}>Register for a FREE membership</Link>
                                </div>
                                <div class="col-xl-3 col-lg-2 col-md-3 col-sm-3 d-sm-block header-img">
                                    <img class="img-fluid" src={constand.WEB_IMAGES + "Sun-landing.png"} />
                                </div>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div class="container-fluid fullwidth">
                            <div className="col-lg-12">
                                <div class="row">
                                    <div className="w-30 col-lg-4 col-md-12 text-center"><p className="font-medium proud-text text-abbey">Proudly in partnership with…</p></div>
                                    <div className="col-lg-8 col-md-12">
                                        <div className="col-lg-12 col-md-12">
                                            <div className="row">
                                                <div className="col-lg-3 col-md-3 col-6 pl-0 logo-section"><img src={constand.WEB_IMAGES + "landing/KRUK.png"} /></div>
                                                <div className="col-lg-2 col-md-3 col-6 pl-0 logo-section"><img src={constand.WEB_IMAGES + "logos/Kidney-Care-UK.jpeg"} /></div>
                                                <div className="col-lg-2 col-md-3 col-6 logo-section"><img src={constand.WEB_IMAGES + "logos/NKF.jpeg"} /></div>
                                                <div className="col-lg-2 col-md-3 col-6 logo-section"><img src={constand.WEB_IMAGES + "logos/UKKA-Main-Logo.png"} /></div>
                                                <div className="col-lg-3 col-md-3 col-6 pl-0 logo-section"><img src={constand.WEB_IMAGES + "landing/NHS-right.png"} /></div>
                                                {/* <div className="col-lg-2 col-md-3 col-6 pl-0 logo-section"><img src={constand.WEB_IMAGES + "landing/renal_logo_cmyk.png"} /></div>
                                                <div className="col-lg-2 col-md-3 col-6 logo-section"><img src={constand.WEB_IMAGES + "landing/BRS.png"} /></div> */}


                                            </div>
                                        </div>

                                        <div className="col-lg-12 col-md-12">
                                            <div className="row">
                                                <div className="col-lg-2 col-md-3 col-6 logo-section align-self-center"><img src={constand.WEB_IMAGES + "landing/Bangor_Logo.png"} /></div>
                                                <div className="col-lg-2 col-md-3 col-6 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "landing/UoLlogo.png"} /></div>
                                                <div className="col-lg-3 col-md-3 col-6 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "landing/LKLT-logo.png"} /></div>
                                                <div className="col-lg-2 col-md-3 col-6 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "landing/LU-logo.png"} /></div>
                                                <div className="col-lg-3 col-md-3 col-6 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "landing/University-Portsmouth.jpg"} /></div>

                                            </div>
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
                                    <div class="partner-title-black" id="clinicians">What we offer</div>
                                </div>
                                <div class="col-lg-4 col-md-4 icon-img">
                                    <div class="icon-img w-50 mx-auto"><img src={constand.WEB_IMAGES + "On-demand.png"} /></div>
                                    <div class="icon-title"><span>Progressive </span><span id="content2">Programs</span></div>
                                    <Link class="btn btn-purple m-t-30 p-t-10 p-b-10" to={'programs/kidney-disease'}>Explore</Link>
                                    <div class="icon-desc m-t-20 font-qmedium">Programs are curated for people with specific treatment needs, disease severity, or to help you explore different types of exercise for physical and emotional wellbeing.</div>
                                </div>
                                <div class="col-lg-4 col-md-4 icon-img">
                                    <div class="icon-img w-50 mx-auto"><img src={constand.WEB_IMAGES + "Asset-60.png"} /></div>
                                    <div class="icon-title">Live and On-demand classes</div>
                                    <Link class="btn btn-purple m-t-30 p-t-10 p-b-10" to={'liveClasses/kidney-disease'}>Explore</Link>
                                    <div class="icon-desc m-t-20 font-qmedium">Live group classes, or pre-recorded on demand sessions in exercise, education and wellbeing, led by specialists to improve physical and emotional health.</div>
                                </div>

                                <div class="col-lg-4 col-md-4 icon-img">
                                    <div class="icon-img w-55 mx-auto"><img src={constand.WEB_IMAGES + "Character-pair.png"} /></div>
                                    <div class="icon-title">Community and Motivational Support</div>
                                    <Link class="btn btn-purple m-t-30 p-t-10 p-b-10" to={this.props.is_auth ? 'account/dashboard/schedule/cystic%20fibrosis' : 'groups/cystic%20fibrosis'}>Explore</Link>
                                    <div class="icon-desc m-t-20 font-qmedium">Either in groups set up by Beam Team, instructors, or clinics, or in a live, interactive class, Beam provides an opportunity for you to meet others on the same journey, ask for advice, celebrate successes and encourage one another.</div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section class="">
                        <div class="container-fluid w-80 p-b-20 fullwidth">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="partner-title-black" id="clinicians">How do I get started?</div>
                                </div>
                                <div class="section-content font-qmedium">
                                    Kidney Beam is currently free for people living with kidney disease in the UK. You just need to click “sign up” and answer some questions and you’ll automatically be given a free membership.  But don't worry if you don't live in the UK, you can still access all the wonderful resources we offer on Kidney Beam via a monthly subscription.
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-4 offset-lg-4 col-8 mx-auto text-center">
                                    <Link class="btn bluebtn w-100 m-t-30 p-t-10 p-b-10" to={'register'}>Sign up</Link>
                                </div>
                                <div class="section-content font-qmedium m-t-30">
                                    We know it’s not always easy to navigate new technology - so if you need some help getting started then we’ve put together some handy guides depending on which device you are using.
                                </div>
                            </div>
                            <div className="row align-items-center h-100">
                                <div class="col-lg-4 col-4 icon-img">
                                    <div class="icon-img"><img src={constand.WEB_IMAGES + "phone.png"} /></div>
                                    <a class="btn btn-darkblue btn-guide col-md-10 p-t-10 p-b-10" href='https://drive.google.com/file/d/1DGmxJNsaIeVTToxYo7S8WsiVytttCObP/view?usp=sharing' target="_blank">Phone guide</a>
                                </div>
                                <div class="col-lg-4 col-4 icon-img">
                                    <div class="icon-img"><img src={constand.WEB_IMAGES + "video.png"} /></div>
                                    <a href="https://drive.google.com/file/d/1aYSpa1I5n7yAcdEjT911-PDot-CRZC3D/view?usp=sharing" target="_blank" class="btn btn-orange btn-guide col-md-10 mt-4 p-t-10 p-b-10">Tablet guide</a>
                                </div>
                                <div class="col-lg-4 col-4 icon-img">
                                    <div class="icon-img"><img src={constand.WEB_IMAGES + "computer.png"} /></div>
                                    <a href="https://drive.google.com/file/d/1n6jox6UQfp13GeVc2fHNsFo3s_Z8QyGP/view?usp=sharing" target="_blank" class="btn btn-purple btn-guide col-md-10 p-t-10 p-b-10">Computer guide</a>
                                </div>

                            </div>
                        </div>
                    </section>
                    <section className="bg-contrast3 section-2 p-t-80">
                        <div className="container-fluid mx-auto w-75 fullwidth">
                            <div className="row">
                                <div className="col-12 col-md-4 col-lg-4 text-left p-b-30 video-player-order">
                                    <ReactPlayer url={this.state.videoUrl} controls={false} width='100%' height='100%' style={{
                                        width: '100%',
                                        height: '100%'
                                    }} />

                                    {/* <figure className="text-left"><img src="/images/blog_img_044.png" className="img-fluid" alt="" /></figure> */}
                                </div>

                                <div className="col-12 col-md-8 col-lg-8 pl-5 align-section align-items-center">
                                    <div className="">
                                        <h4 className="m-b-20 text-abbey take-tour font-semibold card-block">Take a tour</h4>

                                        <p className="text-abbey before-start">
                                            Grab a cuppa and enjoy this full site demonstration as Natasha Wynn, Beam Kidney Studio Manager, talks you through the ins and outs of the Beam Kidney website and tells you all you need to know to get started in this 12 minute demo video...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="section-3 bg-white p-t-30 p-b-30">
                        <div className="container-fluid m-auto w-75 fullwidth">
                            <div className="row position-relative">
                                <div className="col-12 d-flex align-items-center  col-md-9 col-lg-8 text-left  p-b-30">
                                    <div className="card cardnew border-0 align-section">
                                        <div className="card-block">
                                            <h4 className="clearfix text-abbey take-tour font-medium float-left w-100">Important safety information</h4>
                                        </div>
                                        <div className="m-t-30">
                                            <p className="before-start text-abbey ">
                                                Before you start exercising online we ask you to read these top recommendations from the Kidney Beam experts to ensure that you keep safe and feel your best during and after you get physically active.
                                            </p>
                                        </div>
                                        <div className="readnow">
                                            <Link class="btn btn-darkblue col-md-5 col-8 p-t-10 p-b-10" to={'blogs/safety-information-for-people-living-with-kidney-disease'}>Read Now</Link></div>
                                    </div>
                                </div>
                                <div className="col-3 col-md-3 col-lg-4 text-center align-self-center glass-image">
                                    <figure><img src={constand.WEB_IMAGES + "landing/Beam_Character_glass.png"} className="important-asset w-50" alt="" /></figure>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section class="bg-contrast4">
                        <div class="container-fluid w-80 fullwidth" id="contact-form">
                            <div class="row">
                                <div class="col-lg-12 text-center">
                                    <p class="font-medium take-tour text-abbey">Get in touch</p>
                                    <p class="font-qmedium text-abbey">If you need helping signing up to Beam then feel free to give us a call on</p>
                                    <p className="text-abbey font-qbold font-24">
                                        0208 194 7470</p>
                                    <p className="font-qbold text-abbey">
                                        (note that this number is strictly for help signing up to Beam)</p>
                                    <p class="font-qmedium text-abbey m-t-40 section-content">If you need help with anything else or want to get in touch for any other reason then complete the form below and someone from the Beam Team will get in touch. Not a fan of forms? Drop us a note to hello@beamfeelgood.com</p>
                                    <div class="section-content text-left">
                                        <div className="col-lg-8 col-md-12 ml-auto mr-auto">
                                            <CommonForm location={this.props.location} from="kidney" />
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
        is_auth: state.auth.is_auth,

    };
};

const mapDispatchToProps = {
    start_loader
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(KidneyLandingPage);
