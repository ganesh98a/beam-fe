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

class CFLandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoUrl: 'https://youtu.be/fvc0D1ij2Rk',
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
                                    <div className="welcome-kidney font-bold white-txt">Welcome to Beam Cystic Fibrosis</div>

                                    <div class="helping-physiotherap white-txt font-qbold col-11 mx-auto">Helping people living with cystic fibrosis to feel good through movement, education and wellbeing support.</div>
                                    <Link class="btn bluebtn m-t-50 font-18  w-45 p-t-10 p-b-10" to={'/register'}>Get Started</Link>
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
                                <div class="partner-title-black" id="clinicians">Friends and collaborators...</div>
                            </div>

                            <div className="col-lg-12">
                                <div class="row">
                                    <div className="col-lg-12 col-md-12">
                                        <div className="row">
                                            <div className="col-lg-2 col-md-4 col-sm-3 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/CFF.png"} className="w-65" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/CFT.png"} className="w-65" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/ACPCF.png"} className="w-65" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/CFA.png"} className="w-65" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/CF_Ireland.jpg"} className="w-65" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/CFNZ-logo.png"} className="w-65" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/Brompton.png"} className="w-85" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/NHS-newcastle.png"} className="w-85" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/Philips.png"} className="w-65" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/Breas.png"} className="w-65" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/UofE.png"} className="w-65" /></div>
                                            <div className="col-lg-2 col-md-4 col-sm-3 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/WoSACF.png"} className="w-65" /></div>
                                            {/* <div className="col-lg-2 col-md-4 col-sm-3 pl-0 logo-section align-self-center"><img src={constand.WEB_IMAGES + "logos/JohnsHopkins.jpg"} className="w-65" /></div> */}
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
                                <div class="col-lg-12">
                                    <div class="icon-desc m-t-20 font-qmedium offer-text" >
                                        Here at Beam we aim to create a space that will support and inspire you. We develop sessions designed to improve your physical and emotional wellbeing. Our instructors are specialists working in or living with CF so you can be confident they'll understand your needs.
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-4 icon-img">
                                    <div class="icon-img w-50 mx-auto"><img src={constand.WEB_IMAGES + "On-demand.png"} /></div>

                                    <div class="icon-title"><span>Progressive </span><span id="content2">Programs</span></div>
                                    <Link class="btn btn-purple m-t-30 p-t-10 p-b-10" to={'programs/cystic-fibrosis'}>Explore</Link>
                                    <div class="icon-desc m-t-20 font-qmedium">Programs are curated for people with specific treatment needs, disease severity, or to help you explore different types of exercise for physical and emotional wellbeing.</div>
                                </div>
                                <div class="col-lg-4 col-md-4 icon-img">
                                    <div class="icon-img w-50 mx-auto"><img src={constand.WEB_IMAGES + "Asset-60.png"} /></div>
                                    <div class="icon-title">Live and On-demand classes</div>
                                    <Link class="btn btn-purple m-t-30 p-t-10 p-b-10" to={'liveClasses/cystic-fibrosis'}>Explore</Link>
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
                                    Beam CF has a monthly subscription fee, however we want you to be sure you'll love it before you sign up so we offer a <span className="font-bold">2 week free trial.</span> Partnership with some CF charities and clinics also means that <span className="font-bold">Beam is free for some community members,</span> to find out if you're eligible for free access <a href="/blogs/stay-well-with-beam-membership-support" className="purplefont"><u>please read this post</u>.</a>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-4 offset-lg-4 col-8 mx-auto text-center">
                                    <Link class="btn bluebtn w-100 m-t-30 p-t-10 p-b-10" to={'register'}>Sign up</Link>
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
                                                Before you start exercising online we ask you to read these top recommendations to ensure that you keep safe and feel your best during and after you get physically active.
                                            </p>
                                        </div>
                                        <div className="readnow">
                                            <Link class="btn btn-darkblue col-md-5 col-10 p-t-10 p-b-10 w-80" to={'blogs/safety-info-cystic-fibrosis'}>Read Now</Link></div>
                                    </div>
                                </div>
                                <div className="col-3 col-md-3 col-lg-4 text-center align-self-center glass-image">
                                    <figure><img src={constand.WEB_IMAGES + "landing/Beam_Character_glass.png"} className="important-asset w-50" alt="" /></figure>
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
                                            Beam co-founder, Pamela Scarborough talks you through the ins and outs of the website and all you need to know to get started in this short video.
                                </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section class="">
                        <div class="container-fluid w-80 p-b-20 fullwidth">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="partner-title-black" id="clinicians">For clinicians, exercise specialists, charities and partners</div>
                                </div>
                                <div class="section-content font-qmedium">
                                    Beam has been developed in collaboration with cystic fibrosis clinicians and charities. We strive to be a platform that you can trust and rely on and which will support you to care for your community. To understand more about Beam please head over to our <a href="/partnerships/cystic-fibrosis" className="purplefont"><u>partnerships page</u></a> - here you can also learn about opportunities to collaborate on research and content, and ways in which we can support you deliver remote care to your patients.
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-4 offset-lg-4 col-8 mx-auto text-center">
                                    <Link class="btn bluebtn w-100 m-t-30 m-b-30 p-t-10 p-b-10" to={'partnerships/cystic-fibrosis'}>Partner with us</Link>
                                </div>
                            </div>
                            <div class="row">
                                <div class="section-content font-qmedium">
                                    If you are interested in becoming an instructor on Beam please <a href="https://forms.gle/Md6g5y7ufEetYvfM7" className="purplefont"><u>fill out this form</u>.</a> We look forward to hearing from you!
                                </div>
                            </div>
                        </div>
                    </section>


                    <section class="bg-contrast4">
                        <div class="container-fluid w-80 fullwidth" id="contact-form">
                            <div class="row">
                                <div class="col-lg-12 text-center">
                                    <p class="font-medium take-tour text-abbey">Get in touch</p>
                                    <p class="font-qmedium text-abbey m-t-40 section-content">If you need help signing up, have any questions or want to get in touch for any other reason then please complete the form below. Not a fan of forms? Drop us a note to hello@beamfeelgood.com and someone from the Beam Team will get back to you.</p>
                                    <div class="section-content text-left">
                                        <div className="col-lg-8 col-md-12 ml-auto mr-auto">
                                            <CommonForm location={this.props.location} from="cf" />
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
)(CFLandingPage);
