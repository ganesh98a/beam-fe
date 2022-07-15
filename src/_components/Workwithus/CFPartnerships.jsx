import React from 'react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
    start_loader,
} from "../../actions";
import { toast } from "react-toastify";
import * as constand from "../../constant";
import ContactForm from "../ContactPage/ContactFormComponent";

class CFPartnerships extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <React.Fragment>
                <div className="work-with-us">
                    <section className="bg-contrast">
                        <div class="container-fluid w-80">
                            <div class="row">
                                <div class="col-xl-9 col-lg-10 col-md-12 col-sm-12 col-12">
                                    <div class="beam-for-clinicians">Beam For Clinicians, Partners and Collaborators in Cystic Fibrosis</div>
                                    <a href="#clinicians" class="nav-button thick-orange-btn">Health and exercise professionals</a>
                                    <a href="#charities" class="nav-button blue-btn">Charities</a>
                                    <a href="#partners" class="nav-button purple-btn">Sponsors and partners</a>

                                    <div class="helping-physiotherap">We work with clinicians, exercise specialists, health organisations and charities to help people with cystic fibrosis get the benefits of specialist exercise.</div>
                                </div>
                                <div class="col-xl-3 col-lg-2 col-md-2 col-sm-2 d-none d-sm-block header-img">
                                    <img class="img-fluid" src={constand.WEB_IMAGES + "Sun.png"} />
                                </div>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div class="container-fluid w-80">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="partner-title-purple">Our Partners and Friends</div>
                                    <div class="row">
                                        <div class="col-lg-12 offset-lg-0 col-md-12 offset-md-0 col-sm-8 offset-sm-2 col-12 offset-0">
                                            <div class="outer-wrapper">
                                                <div class="frame"><img width="100%" src={constand.WEB_IMAGES + "logos/CFF.png"} /></div>
                                                <div class="frame"><img width="100%" src={constand.WEB_IMAGES + "logos/CFT.png"} /></div>
                                                <div class="wrap"></div>
                                                <div class="frame"><img width="100%" src={constand.WEB_IMAGES + "logos/CFA.png"} /></div>
                                                <div class="frame"><img width="100%" src={constand.WEB_IMAGES + "logos/CF_Ireland.jpg"} /></div>
                                                <div class="wrap"></div>
                                                <div class="frame"><img width="100%" src={constand.WEB_IMAGES + "logos/CFNZ-logo.png"} /></div>
                                                <div class="frame"><img width="100%" src={constand.WEB_IMAGES + "logos/ACPCF.png"} /></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12 offset-lg-0 col-md-12 offset-md-0 col-sm-8 offset-sm-2 col-12 offset-0">
                                            <div class="outer-wrapper">
                                                <div class="frame frame-low"><img width="100%" src={constand.WEB_IMAGES + "logos/Brompton.png"} /></div>
                                                <div class="frame frame-low"><img width="100%" src={constand.WEB_IMAGES + "logos/NHS-newcastle.png"} /></div>
                                                <div class="wrap"></div>
                                                <div class="frame frame-low"><img width="100%" src={constand.WEB_IMAGES + "logos/UofE.png"} /></div>
                                                <div class="frame frame-low"><img width="100%" src={constand.WEB_IMAGES + "logos/Philips.png"} /></div>
                                                <div class="wrap"></div>
                                                <div class="frame frame-low"><img width="100%" src={constand.WEB_IMAGES + "logos/Breas.png"} /></div>

                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-lg-12 offset-lg-0 col-md-12 offset-md-0 col-sm-8 offset-sm-2 col-12 offset-0">
                                            <div class="outer-wrapper">
                                                {/* <div class="frame frame-low"><img width="100%" src={constand.WEB_IMAGES + "logos/JohnsHopkins.jpg"} /></div> */}
                                                <div class="frame frame-low"><img width="100%" src={constand.WEB_IMAGES + "logos/MassGen.svg"} /></div>
                                                <div class="wrap"></div>
                                                <div class="frame frame-low"><img width="100%" src={constand.WEB_IMAGES + "logos/AUB.png"} /></div>
                                                <div class="frame frame-low"><img width="100%" src={constand.WEB_IMAGES + "logos/IU-logo.jpg"} /></div>
                                                <div class="wrap"></div>
                                                <div class="frame frame-low"><img width="100%" className='w-50' src={constand.WEB_IMAGES + "logos/WoSACF.png"} /></div>
                                                <div class="wrap"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section class="bg-contrast">
                        <div class="container-fluid w-80">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="partner-title-blue">What is Beam?</div>
                                    <div class="section-content">
                                        Beam is an online exercise platform for people with cystic fibrosis that offers live and on-demand exercise classes as well as motivational and community support. Our varied exercise classes support people at all life stages are led by specialist instructors who either live with or work in cystic fibrosis.  <br /><br />
		    As well as supporting people with CF to stay active, we support CF clinicians to deliver remote care. Beam has been approved by health professionals and is an Orcha approved health app.
		</div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section id="clinicians">
                        <section>
                        <div class="container-fluid w-80">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="partner-title-orange">Beam for Health and Exercise Professionals</div>
                                    <div class="section-content">
                                        Founded by a CF clinician and a tech entrepreneur, Beam started in 2016 and is proud to have collaborated with CF clinicians and professional bodies across the UK and US.  We have created content with The Royal Brompton Hospital, have defined our offering with the Association of Chartered Physiotherapists in Cystic Fibrosis, <a target="_blank" href={"/blogs/beam-launches-cf-foundation-pilot-program-usa"}>have piloted in 4 major US care centres</a> and have had our service evaluated in independent research studies (e.g <a target="_blank" href="https://drive.google.com/file/d/10cSWkjcXHd7gwFCBF6veBfkfk3h4BxDL/view?usp=sharing">this one</a>). Beam is backed with <a target="_blank" href="/blogs/a-new-kind-of-exercise-app">research-led behaviour change interventions</a> to help people become, and remain active.<br /><br />
                        You may notice that Beam has a different feel to other health tech solutions (it's not so medicalised), this is because our platform has been developed to appeal to your patients (not you!). That being said, we have developed some free and premium features with you at the forefront...

                    </div>
                                </div>
                                <div class="col-lg-8 offset-lg-2 bundle-price">
                                    <h2 >Introducing... Beam for Clinics</h2>
                                </div>
                                <div class="col-lg-3">
                                    <div class="icon-title">Host a private patient/client group</div>
                                    <div class="icon-img"><img src={constand.WEB_IMAGES + "Happy_world.png"} /></div>
                                    <div class="icon-desc">Communicate with patients/clients in a group or 1-2-1</div>
                                </div>
                                <div class="col-lg-3">
                                    <div class="icon-title">Host live, group exercise classes</div>
                                    <div class="icon-img"><img src={constand.WEB_IMAGES + "Live_class.png"} /></div>
                                    <div class="icon-desc">Teach exercise classes online to engage and connect with patients/clients</div>
                                </div>
                                <div class="col-lg-3">
                                    <div class="icon-title">Private, on-demand exercise video library</div>
                                    <div class="icon-img"><img src={constand.WEB_IMAGES + "Beam_OnDemand.png"} /></div>
                                    <div class="icon-desc">Record and upload your live classes or add your own videos to an on-demand video library</div>
                                </div>
                                <div class="col-lg-3">
                                    <div class="icon-title">Patient/client activity tracking</div>
                                    <div class="icon-img"><img src={constand.WEB_IMAGES + "data_dashboard.png"} /></div>
                                    <div class="icon-desc">With their consent, track your patients/clients activity levels on Beam</div>
                                </div>
                                
                                <div class="col-md-12 price-tag-new m-t-40 m-b-40">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="card-price1">
                                                <h3>UK</h3>
                                                <div class="up-sec d-table mx-auto mt-4">
                                                    <span class="d-inline-block big-text mr-2">£500</span><span class="d-inline-block text-left small-text">per month <p class="xsmall-text m-0"> (min 6 month contract)</p></span>
                                                </div>
                                                <div class="login-or">
                                                    <hr class="hr-or" />
                                                    <span class="span-or">or</span>
                                                </div>
                                                <div class="up-sec d-table mx-auto">
                                                    <span class="d-inline-block big-text mr-2">£4500</span><span class="d-inline-block text-left small-text">per year {/* <p class="xsmall-text m-0"> (over 40% discount)</p> */}</span>
                                                </div>
                                            </div>
                                        </div><div class="col-md-4">
                                            <div class="card-price2">
                                                <h3>US</h3>
                                                <div class="up-sec d-table mx-auto mt-4">
                                                    <span class="d-inline-block big-text mr-2">$700</span><span class="d-inline-block text-left small-text">per month <p class="xsmall-text m-0"> (min 6 month contract)</p></span>
                                                </div>
                                                <div class="login-or">
                                                    <hr class="hr-or" />
                                                    <span class="span-or">or</span>
                                                </div>
                                                <div class="up-sec d-table mx-auto">
                                                    <span class="d-inline-block big-text mr-2">$6000</span><span class="d-inline-block text-left small-text">per year {/* <p class="xsmall-text m-0"> (over 40% discount)</p> */}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="card-price3">
                                                <h3>Australia</h3>
                                                <div class="up-sec d-table mx-auto mt-4">
                                                    <span class="d-inline-block big-text mr-2">$950</span><span class="d-inline-block text-left small-text">per month <p class="xsmall-text m-0"> (min 6 month contract)</p></span>
                                                </div>
                                                <div class="login-or">
                                                    <hr class="hr-or" />
                                                    <span class="span-or">or</span>
                                                </div>
                                                <div class="up-sec d-table mx-auto">
                                                    <span class="d-inline-block big-text mr-2">$8500</span><span class="d-inline-block text-left small-text">per year {/* <p class="xsmall-text m-0"> (over 40% discount)</p> */}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div class="row">
                                <div className="col-lg-12 section-content font-18 font-italic m-b-20" >
                                    *** Please note that these are early bird rates as we develop our clinic functionality to make it better for you and your patients
                    </div>
                                <div class="section-content">
                                    We use Zoom to host our online live exercise classes.  The safety and security of the participants in our classes is of paramount importance to us.  <a class="inline-link" href="https://drive.google.com/file/d/1Arr01A7TunbfnDJQxS4jjZGEp1iC7QbN/view?usp=sharing" target="_blank">Read more here</a> about the security measure we take to ensure our classes provide a safe environment for people to exercise in.
				</div>
                            </div>
                            <div class="row">
                                <div class="col-lg-4 offset-lg-4 col-6 offset-3 text-center">
                                    <a href="#contact-form" class="nav-button thick-orange-btn w-100 m-t-3">Get in touch</a>
                                </div>
                            </div>
                        </div>
                        </section>
                    </section>
                    <section class="bg-contrast" id="charities">
                        <section>
                        <div class="container-fluid w-80">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="partner-title-blue">Beam for Charities</div>
                                    <div class="section-content">
                                        Having collaborated with The CF Foundation, The CF Trust, CF Australia and CF Ireland we understand the immensely important role charities play.
                                        We know that charities are often looking for ways to unite the community, improve access and equality in care, and improve physical and emotional welling. As such, we are always open to conversations and collaborations.
		    </div>
                                </div>
                            </div>

                            <div class="row align-items-center two-col-info">
                                <div class="col-lg-8 col-md-8 col-sm-12 col-12 section-content text-lg-left text-center">
                                    Ways we have supported charities in the past include hosting virtual exercise events for their community, sponsorship of on-demand videos targeting specific CF needs and offering discounts on bulk purchase licenses.
		  </div>
                                <div class="col-lg-4 offset-lg-0 col-md-4 offset-md-0 col-sm-8 offset-sm-2 col-10 offset-1">
                                    <img src={constand.WEB_IMAGES + "licenses-vertical.png"} width="100%" />
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-4 offset-lg-4 col-6 offset-3 text-center">
                                    <a href="#contact-form" class="nav-button blue-btn w-100 m-t-3">Get in touch</a>
                                </div>
                            </div>
                        </div>
                        </section>
                    </section>
                    <section id="partners">
                        <section>
                        <div class="container-fluid w-80">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="partner-title-purple">Beam for Sponsors and Partners</div>
                                    <div class="section-content">
                                        We are constantly looking for ways to better what we can offer the CF community and the top way to do this is through content. If you would like to sponsor the creation of content (it can feature your product if you have one) or would like to sponsor a live class then please get in touch. We have different packages available that we'd like to talk through with you. Examples of partners we've worked with are Philips, with whom we created exercise videos for people on more advanced disease using a portable oxygen concentrator, and Breas videos featuring their latest non-invasive ventilator.  <br /><br />
			We're a dynamic company and always keen to find news ways to collaborate.  If you have an idea of how we could partner with you then please get in touch - we'd love to chat!
		    </div>
                                </div>
                            </div>
                        </div>
                        </section>
                    </section>
                    <section class="bg-contrast">
                        <div class="container-fluid w-80" id="contact-form">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="partner-title-blue">Want to work with us?</div>
                                    <div class="section-content text-left">
                                        <div className="col-md-6 ml-auto mr-auto">
                                            <div><p className="purplefont font-bold text-center">Fill in the form, it's easy!</p></div>
                                            <ContactForm location={this.props.location} from="work" page="cystic" />
                                        </div>
                                    </div>
                                    <div class="p-t-3 section-content">
                                        Not a fan of forms? Feel that you need more guidance? Drop us a note at <a href="mailto:hello@beamfeelgood.com">hello@beamfeelgood.com</a>
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
)(CFPartnerships);