import React from "react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { setCondition, updateUserChallengeTag, loginModelOpen } from "../../actions";
import * as constand from "../../constant";
import { Helmet } from "react-helmet";
import ReactPlayer from 'react-player';
import { Cookies } from "react-cookie-consent";
import CffBanner from "./CffBanner";
import { toast } from "react-toastify";
import { commonService } from "../../_services";

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videoUrl: 'https://vimeo.com/359842015',
      firstTime: 1
    };
    this.conditonClassList = [...constand.CONDITION_CLASS_LIST];
    this.returnClass = this.conditonClassList.reverse();

  }
  componentWillReceiveProps() {
    this.conditonClassList = [...constand.CONDITION_CLASS_LIST];
  }
  componentDidMount() {
    console.log('home-this.props', this.props)
    var beamChallenge = this.props.match ? (this.props.match.params.beamchallenging && this.props.match.params.beamchallenging.includes('keepbeaming-signup') ? 'keepbeaming-signup' : '') : '';
    localStorage.setItem('beamchallenging', beamChallenge)
    if (localStorage.getItem('beamchallenging') && !this.props.is_auth) {
      console.log('test*********')
      this.props.loginModelOpen(true);
    }

    var isRestrictedPage = this.props.location && this.props.location.state ? this.props.location.state.isRestrictedPage : false;
    var isBeamRestrictedPage = this.props.location && this.props.location.state ? this.props.location.state.isBeamRestrictedPage : false;

    if (isRestrictedPage) {
      toast.error(constand.ERROR_RESTRICTED_PAGE);
    } else if (isBeamRestrictedPage) {
      toast.error(constand.ERROR_BEAM_RESTRICTED_PAGE);
    }
    /* console.log('home-componentDidMount', localStorage.getItem('beamchallenging'));
    if (beamChallenge && this.props.is_auth) {
      console.log('home-updateUserChallengeTag')
     // this.props.updateUserChallengeTag();
    } */
    window.scrollTo(0, 0);

  }

  conditionalGoto(condition, url) {
    this.props.setCondition(condition);
    var formatCondition = commonService.replaceChar(condition, false);
    Cookies.set("condition", formatCondition);

    if (constand.HOME_CONDITION_LIST.indexOf(condition) >= 0) {
      const { from } = { from: { pathname: '/' + formatCondition } };
      this.props.history.push(from);
    } else {
      const { from } = { from: { pathname: url } };
      this.props.history.push(from);
    }

  }
  getColorClass(key) {
    if (this.returnClass.length > 0)
      return this.returnClass[key];
  }

  returnPartnershipUrl = () => {
    var conditions = typeof Cookies.get('condition') != 'undefined' ? Cookies.get('condition') : constand.CONDITION;
    return !(constand.NO_PARTNERSHIP_CONDITIONS.includes(conditions)) ? "/partnerships/" + conditions : "partnerships/" + constand.CONDITION
  }

  render() {
    var currentPath = this.props.history ? this.props.history.location.pathname : '/home';
    let authData = JSON.parse(localStorage.getItem('userDetails')) || this.props.logged_userData;

    return (
      <React.Fragment>
        <Helmet>
          <title>{constand.HOME_TITLE}{constand.BEAM}</title>
          <meta property="og:title" content={constand.HOME_TITLE + constand.BEAM} />
          <meta property="og:description" content={constand.HOME_DESC} />
          <meta property="og:image" content={constand.HOME_PAGE_IMAGE} />
          <meta property="og:url" content={window.location.href} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="og:site_name" content="Beam" />
          <meta name="twitter:image:alt" content={constand.HOME_PAGE_IMAGE_ALT} />
        </Helmet>
        <div className={(Cookies.get('closeBanner') == 'false' && !this.props.close_banner) || (Cookies.get('closeBannerKD') == 'false' && !this.props.close_banner_kd) ? 'homecontent' : 'homecontent m-t-80'}>

          <section id="section1" className="section1-bg">
            <div className="container">
              <div className="section-header text-center p-t-30 p-b-30">
                <h3 className="font-37 darkblue-text heading-top1 m-t-20">Movement to make you feel good</h3>
                <p className="w-80 subheading-top1 font-21 mx-auto p-t-20 p-b-10 font-medium ">
                  Access on-demand and live classes, plus friendly groups, led by
                  specialist  physiotherapists and trainers who are trained in, or
                  live with, your health condition. Wherever you are, whenever you
                  need it.
                </p>
                <p className="w-80 subheading-topnew font-21 mx-auto p-t-20 p-b-10 font-medium ">
                  Access on-demand and live classes, plus friendly groups, led by
                  specialist  physiotherapists and trainers who are trained in, or
                  live with, your health condition. Wherever you are, whenever you
                  need it.
                </p>
                {(!this.props.is_auth) &&
                  <Link to="/register" className="btn btn-orange m-t-20 m-b-20 font-14 font-medium m-r-10">
                    Start 2 week FREE trial
                  </Link>}
                {(!this.props.is_auth) &&
                  <Link to="/register" className="btn btn-purple m-t-20 m-b-20 font-14 font-medium">
                    Got a license code?
                  </Link>}

              </div>
            </div>
          </section>
          {currentPath == '/home' && Cookies.get('condition') && ((Cookies.get('condition').includes(constand.KR_CONDITION.split(" ")[0]) && (this.props.IP_Details.countryCode == 'IN' || this.props.IP_Details.countryCode == 'GB')) || ((typeof Cookies.get('condition') == 'undefined' || Cookies.get('condition').includes(constand.CONDITION.split(" ")[0])) && (this.props.IP_Details.countryCode == 'IN' || this.props.IP_Details.countryCode == 'US'))) && (typeof Cookies.get('closeBanner') == 'undefined' || Cookies.get('closeBanner') == 'false') && this.props.close_banner == false &&
            //web view
            <CffBanner type="web" condition={Cookies.get('condition')} />
          }
          {currentPath == '/home' && Cookies.get('condition') && ((Cookies.get('condition').includes(constand.KR_CONDITION.split(" ")[0]) && (this.props.IP_Details.countryCode == 'IN' || this.props.IP_Details.countryCode == 'GB')) || ((typeof Cookies.get('condition') == 'undefined' || Cookies.get('condition').includes(constand.CONDITION.split(" ")[0])) && (this.props.IP_Details.countryCode == 'IN' || this.props.IP_Details.countryCode == 'US'))) && (typeof Cookies.get('closeBanner') == 'undefined' || Cookies.get('closeBanner') == 'false') && this.props.close_banner == false && //mobile view
            <CffBanner type="mobile" condition={Cookies.get('condition')} />
          }
          <section id="section2" className="section2-bg p-b-50 p-t-20">
            <h3 class="font-37 purplefont heading-top1 m-t-20 text-center">Which health condition are you interested in?</h3>
            <div className="col-10 offset-1 btnht_set">
              <div className="row">
                {this.props.healthcondition_list.length > 0 &&
                  this.props.healthcondition_list.map((item, key) => {
                    return (
                      <div className="col-lg-3 col-md-4 col-sm-6 mx-auto">
                        <button key={key}
                          className={"text-capitalize btn btn-login w-100 mx-auto font-14 font-weight-bold cond_cystic-fibrosis text-left " + this.getColorClass(key)}
                          onClick={() => {
                            var url = (authData && (authData.isGroupLeader || authData.isStudyLeader || authData.isStudyInstructor) && constand.SL_MENU.includes('on-demand')) ? '/on-demand/' : '/liveClasses/';
                            if (authData && authData.isStudyUser) {
                              var community = authData.Members.length ? authData.Members[0].Community.community_name : '';
                              url = community ? '/group/feed/' + community + '/' : '/groups/';
                            }
                            this.conditionalGoto(item.tag, url + (commonService.replaceChar(item.tag, false)))
                          }}
                        >
                          {item.tag}{" "}
                        </button>
                      </div>
                    )
                  })}
              </div>
            </div>
          </section>
          <section id="section3" className="section3-bg p-t-90 p-b-40">
            <div className="container-fluid mx-auto w-75">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6 text-left">
                  <h4 className="m-b-20 font-24 darkblue-text font-book">New to Beam?</h4>
                  <p className="small-txt font-14 black-txt  font-qregular">
                    Want to know a little more about Beam? We've got you covered with a simple introduction to our features and pricing.
                  </p>
                  <Link to="/howitworks" className="btn btn-blue font-medium font-14 m-t-20 m-b-20">
                    How Beam Works
                  </Link>
                </div>
                <div className="col-12 col-md-6 col-lg-6 text-center">
                  <ReactPlayer url={this.state.videoUrl} controls={false} width='100%' height='100%' style={{
                    width: '100%',
                    height: '100%'
                  }} />
                  {/* <figure>
                    <img
                      src="/images/blog_img_04.png"
                      className="img-fluid"
                      alt=""
                    />
                  </figure> */}
                </div>
              </div>
            </div>
          </section>
          <section id="section4" className="section4-bg work-with-us">
            <div className="container-fluid w-80">
              <div class="row">
                <div class="col-lg-12">
                  <div class="partner-title-purple">Our Friends & Collaborators</div>
                  <div class="row">
                    <div class="col-lg-12 offset-lg-0 col-md-12 offset-md-0 col-sm-8 offset-sm-2 col-12 offset-0">
                      <div class="outer-wrapper">
                        <div class="frame"><img width="100%" src={constand.WEB_IMAGES + "logos/CFF.png"} /></div>
                        <div class="frame"><img width="100%" src={constand.WEB_IMAGES + "logos/CFT.png"} /></div>
                        <div class="wrap"></div>
                        <div class="frame"><img width="100%" src={constand.WEB_IMAGES + "logos/CFA.png"} /></div>
                        <div class="frame"><img width="100%" src={constand.WEB_IMAGES + "logos/CF_Ireland.jpg"} /></div>
                        <div class="wrap"></div>
                        <div class="frame"><img width="100%" src={constand.WEB_IMAGES + "logos/Breas.png"} /></div>
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
                        <div class="frame frame-low"><img width="100%" src={constand.WEB_IMAGES + "logos/peppy.png"} /></div>

                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12 offset-lg-0 col-md-12 offset-md-0 col-sm-8 offset-sm-2 col-12 offset-0">
                      <div class="outer-wrapper">
                        <div class="frame frame-low"><img width="100%" src={constand.WEB_IMAGES + "KRUK-logo.png"} /></div>
                        {/* <div class="frame frame-low"><img width="100%" src={constand.WEB_IMAGES + "logos/BRS-Logo.jpg"} /></div>
                        <div class="wrap"></div>
                        <div class="frame frame-low"><img width="100%" src={constand.WEB_IMAGES + "logos/renal_logo_cmyk.jpg"} /></div> */}
                        <div class="frame frame-low"><img width="100%" src={constand.WEB_IMAGES + "logos/Kidney-Care-UK.jpeg"} /></div>
                        <div class="frame frame-low"><img width="100%" src={constand.WEB_IMAGES + "logos/NKF.jpeg"} /></div>
                        <div class="wrap"></div>
                        <div class="frame frame-low"><img width="100%" src={constand.WEB_IMAGES + "logos/UKKA-Main-Logo.png"} /></div>
                        <div class="frame frame-low"><img width="100%" src={constand.WEB_IMAGES + "logos/King-sCollegeHospital-NHS-Foundation-Trust-RGB-BLUE-right.jpg"} /></div>
                        <div class="frame frame-low"><img width="100%" src={constand.WEB_IMAGES + "logos/WoSACF.png"} /></div>
                        <div class="wrap"></div>

                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </section>
          <section id="section5" className="section5-bg">
            <div className="container-fluid mx-auto w-75">
              <div className="section-header text-center p-t-30 p-b-30">
                <h4 className="purplefont font-24 font-book m-b-20">Want to work with us?</h4>

                <span className="w-100 mx-auto p-t-30 p-b-10 black-txt font-14 font-qregular">
                  <p>From patients to clinicians, to healthcare commissioners, insurers, charities and product partners - we work with anybody who believes that an active lifestyle can improve health outcomes and help people to feel good.</p>
                  <p>Learn more about our partnerships, past and present, and get in touch if you'd like to explore working together in the future.</p>
                </span>
                <Link to={this.returnPartnershipUrl()} className="btn btn-purple font-medium font-14 m-t-20 m-b-20">
                  Partnerships
                </Link>
              </div>
            </div>
          </section>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    is_auth: state.auth.is_auth,
    IP_Details: state.accountinfo.ip_data,
    close_banner: state.header.close_banner,
    close_banner_kd: state.header.close_banner_kd,
    healthcondition_list: state.register.healthcondition_list,
    logged_userData: state.header.logged_userData,

  };
};

const mapDispatchToProps = { setCondition, updateUserChallengeTag, loginModelOpen };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
