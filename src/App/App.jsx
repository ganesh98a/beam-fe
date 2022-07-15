import React from 'react';
import { BrowserRouter as Router, Route, withRouter, Redirect, Switch } from 'react-router-dom';
import { PrivateRoute, RegisterRoute, CommonRoute, ConditionRoute } from '../_routes';
import { LiveclassComponent, HealthComponent, TermsComponent } from '../_components';
import PrivacyComponent from '../_components/PrivacyPage/PrivacyComponent';
import HowitworksComponent from '../_components/AboutPage/HowitworksComponent';
import ContactPage from '../_components/ContactPage/ContactPage';
import AboutPage from '../_components/AboutPage/AboutPage';
import HelpComponent from '../_components/HelpPage/HelpComponent';
import BlogComponent from '../_components/BlogPage/BlogComponent';
import BlogDetailComponent from '../_components/BlogPage/BlogDetailComponent';
import WorkoutDetailComponent from '../_components/WorkoutDetailPage/WorkoutDetailComponent';
import OnDemandComponent from '../_components/OnDemandPage/OnDemandComponent';
import HomePage from '../_components/HomePage/HomePage';
import AccountDetailComponent from '../_components/AccountDetailPage/AccountDetailComponent';
import InstructorDetailComponent from '../_components/InstructorPage/InstructorDetailComponent';
import LiveClassDetailComponent from '../_components/LiveClasses/LiveClassDetailComponent';
import RegisterPage from '../_components/RegisterPage/RegisterPage';
import AlldoneComponent from "../_components/RegisterPage/AlldoneComponent";
import NiceOneComponent from "../_components/RegisterPage/NiceOneComponent";
import Header from '../_layoutComponents/headerComponent';
import Fooder from '../_layoutComponents/fooderComponent';
import { ToastContainer } from 'react-toastify';
import LoaderComponent from '../_layoutComponents/loaderComponent';
import { connect } from 'react-redux';
import { isAuth, putIPdata, fetchMembershipPlans } from '../actions';
import DashboardComponent from '../_components/DashboardPage/DashboardComponent';
import GroupComponent from '../_components/GroupPage/GroupComponent';
import ChangePasswordComponent from '../_components/LoginPage/ChangePasswordComponent';
import ForgotPasswordComponent from '../_components/LoginPage/ForgotPasswordComponent';
import iplocation from "iplocation";
import publicIp from "public-ip";
import ReactGA from 'react-ga';
import * as Error from "../Errors";
import { toast } from "react-toastify";
import ProgrammesDetailComponent from '../_components/ProgrammesPage/ProgrammesDetailsComponent';
import WorkwithusComponent from '../_components/Workwithus/WorkwithusComponent';
import * as Constand from "../constant";
import CookieConsent, { Cookies } from "react-cookie-consent";
import LandingPage from '../_components/HomePage/LandingPage';
import RSLandingPage from '../_components/HomePage/RSLandingPage';
import EmergencyInfoComponent from '../_components/AccountDetailPage/EmergencyInfoComponent';
import FaqComponent from '../_components/FaqPage/FaqComponent';
import TeensOnBeam from '../_components/TeensOnBeam/TeensOnBeam';
import DynamicPage from '../_components/TeensOnBeam/DynamicPage';
import { getURLCondition } from '../actions';
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            splittedToken: '',
            urlCondition: [],
        };
    }

    async componentDidMount() {
       // ReactGA.initialize('UA-146829569-1');
        ReactGA.pageview(window.location.pathname + window.location.search);
        this.getIPv4();
        await this.props.getURLCondition();
    }

    componentWillMount() {
        var getQueryString = window.location.search;
        if (getQueryString && getQueryString.indexOf('token=') !== -1) {
            var splittedToken = getQueryString.split('token=')[1];
            var temp = { token: splittedToken ? splittedToken.replace('%20', ' ') : '' }
            localStorage.setItem('userAuthToken', JSON.stringify(temp));
            this.props.isAuth();
            this.setState({ splittedToken: splittedToken })
        }

        this.initializeReactGA(window.location.pathname);
        this.unlisten = this.props.history.listen((location, action) => {
            this.initializeReactGA(location.pathname);
        });
    }
    componentWillUnmount() {
        this.unlisten();
    }

    initializeReactGA(path) {
       // ReactGA.initialize(Constand.GOOGLE_TRACK_ID);
        ReactGA.pageview(path);
    }

    /** Get ip details */
    getIPv4() {
        (async () => {
            await publicIp.v4().then((res) => {
                this.getIPdetails(res)
            })
                .catch(err => {
                    this.getIPv6();
                });
        })();
    }
    getIPv6() {
        (async () => {
            await publicIp.v6().then((res) => {
                this.getIPdetails(res)
            })
                .catch(err => {
                    toast.error(Error.get_ip_error);
                });
        })();
    }
    getIPdetails(clientIP) {
        if (clientIP) {
            iplocation(clientIP)
                .then((res) => {
                    console.log('CountryCodeFromIP', res.countryCode);
                    this.props.putIPdata(res);
                    this.props.fetchMembershipPlans(res.countryCode);
                })
                .catch(err => {
                });
        }
    }
    RenderHome() {

        var pathname_data = '/home';
        if (this.props.is_auth) {
            pathname_data = '/on-demand/' + this.props.init_condition
        }


        if (this.props.location.pathname.includes('/onDemand')) {
            pathname_data = this.props.location.pathname.replace('/onDemand', '');
            if (this.props.location.pathname.includes('/onDemand/list')) {
                pathname_data = this.props.location.pathname.replace('/onDemand/list', '/on-demand');
            }
        }
        else if (this.props.location.pathname.includes('/ondemand')) {
            pathname_data = this.props.location.pathname.replace('/ondemand', '');
            if (this.props.location.pathname.includes('/ondemand/list')) {
                pathname_data = this.props.location.pathname.replace('/ondemand/list', '/on-demand')
            }
        } else if (this.props.location.pathname.includes('/howitswork')) {
            pathname_data = '/howitworks'
        }

        return (<Redirect to={{ pathname: pathname_data }} />)
    }
    render() {
        console.log('window.location.pathname', window.location.pathname)
        return (
            <div>
                <ToastContainer />
                {/* <LoaderComponent /> */}
                {(!["/register", "/register/all_done", "/register/nice_one"].includes(window.location.pathname)) && (window.location.pathname.indexOf('register') == -1) ? <Header location={this.props.location} history={this.props.history} match={this.props.match} /> : null}

                <div className={((typeof Cookies.get('closeBanner') == 'undefined' || Cookies.get('closeBanner') == 'false') && this.props.close_banner == false) || ((typeof Cookies.get('closeBannerKD') == 'undefined' || Cookies.get('closeBannerKD') == 'false') && this.props.close_banner_kd == false) ? 'homepage' : 'homepage m-t-80'}>
                    <div>
                        <Switch>
                            <Route path='/keepbeaming' component={() => { window.location = 'https://mc.beamfeelgood.com/keepbeaming'; return null; }} />
                            <PrivateRoute exact path="/register/all_done" component={AlldoneComponent} splittedToken={this.state.splittedToken} />
                            <PrivateRoute exact path="/register/nice_one" component={NiceOneComponent} splittedToken={this.state.splittedToken} />
                            <RegisterRoute exact path="/register/:invitationCode?" component={RegisterPage} />
                            <Route exact path="/home" component={HomePage} />
                            <Route path="/:beamchallenging(keepbeaming-signup)" component={HomePage} />
                            <Route exact path="/about-us" component={AboutPage} />
                            <Route exact path="/contact-us" component={ContactPage} />
                            <Route exact path="/liveClass" component={LiveclassComponent} />
                            <Route exact path="/teens-on-beam" component={TeensOnBeam} />
                            <CommonRoute exact path="/liveClass/:condition/:id" component={LiveClassDetailComponent} />
                            <Route exact path="/health" component={HealthComponent} />
                            <Route exact path="/howitworks" component={HowitworksComponent} />
                            <Route exact path="/reset/:token" component={ChangePasswordComponent} />
                            <Route exact path="/forgotpassword" component={ForgotPasswordComponent} />
                            <CommonRoute exact path="/instructor/:id/:condition" component={InstructorDetailComponent}  />
                            <Route path="/workouts/workout/:id" component={WorkoutDetailComponent} />
                            <CommonRoute path="/group/about/:group/:condition" component={GroupComponent}  />
                            <CommonRoute path="/group/wall/:group/:condition" component={GroupComponent}  />
                            <CommonRoute path="/group/feed/:group/:condition" component={GroupComponent}  />
                            <CommonRoute path="/group/members/:group/:condition" component={GroupComponent}  />
                            <CommonRoute path="/group/liveclasses/list/:group/:condition" component={GroupComponent}  />
                            <CommonRoute path="/group/ondemand/list/:group/:condition" component={GroupComponent}  />
                            <CommonRoute path="/detail/:id/:condition/:programid?" component={WorkoutDetailComponent}  />
                            <CommonRoute path="/on-demand/:condition" component={OnDemandComponent}  />
                            <CommonRoute path="/liveClasses/:condition" component={OnDemandComponent}  />
                            <CommonRoute path="/about/:condition" component={OnDemandComponent}  />
                            <CommonRoute path="/groups/:condition" component={OnDemandComponent}  />
                            <CommonRoute path="/instructor/:condition" component={OnDemandComponent}  />
                            <CommonRoute path="/programs/:condition" component={OnDemandComponent}  />
                            <PrivateRoute exact path="/accounts/basicInformation" component={AccountDetailComponent} splittedToken={this.state.splittedToken} />
                            <PrivateRoute exact path="/accounts/myConditions" component={AccountDetailComponent} splittedToken={this.state.splittedToken} />
                            <PrivateRoute exact path="/accounts/membership" component={AccountDetailComponent} splittedToken={this.state.splittedToken} />
                            <PrivateRoute exact path="/accounts/membership/:member" component={AccountDetailComponent} splittedToken={this.state.splittedToken} />
                            <PrivateRoute exact path="/accounts/communicationPreferences" component={AccountDetailComponent} splittedToken={this.state.splittedToken} />
                            <PrivateRoute exact path="/accounts/emergencyInfo" component={AccountDetailComponent} splittedToken={this.state.splittedToken} />
                            <PrivateRoute exact path="/accounts/movementprefs" component={AccountDetailComponent} splittedToken={this.state.splittedToken} />
                            <Route exact path="/terms" component={TermsComponent} />
                            <Route exact path="/privacy" component={PrivacyComponent} />
                            <Route exact path="/faq" component={FaqComponent} />
                            <CommonRoute exact path="/blog/:type" component={BlogComponent} />
                            <Route exact path="/blogs/:blogName" component={BlogDetailComponent} />
                            <CommonRoute exact path="/programmes/detail/:condition/:programId" component={ProgrammesDetailComponent}  />
                            <CommonRoute exact path="/help/:type" component={HelpComponent} />
                            <PrivateRoute path="/account/dashboard/schedule/:condition" component={DashboardComponent} splittedToken={this.state.splittedToken}  />
                            <PrivateRoute path="/account/dashboard/history/:condition" component={DashboardComponent} splittedToken={this.state.splittedToken}  />
                            <PrivateRoute path="/account/dashboard/activity/:condition" component={DashboardComponent} splittedToken={this.state.splittedToken}  />
                            <PrivateRoute path="/account/dashboard/programs/:condition" component={DashboardComponent} splittedToken={this.state.splittedToken}  />
                            <PrivateRoute path="/account/dashboard/saved/:condition" component={DashboardComponent} splittedToken={this.state.splittedToken} history={this.props.history}  />
                            <PrivateRoute path="/account/dashboard/groups/:condition" component={DashboardComponent} splittedToken={this.state.splittedToken}  />
                            <CommonRoute exact path="/partnerships/:condition" component={WorkwithusComponent}  />
                            <Route exact path="/:research-studies" component={RSLandingPage} />
                            <Route exact path="/:condition" component={LandingPage}  />
                            {/* <ConditionRoute exact path="/:condition" component={KidneyLandingPage} /> */}
                            <Route path="*" render={() => this.RenderHome()} />
                        </Switch>
                    </div>
                </div>
                {(!["/register", "/register/all_done", "/register/nice_one"].includes(window.location.pathname)) && ((window.location.pathname.indexOf('register') == -1) || window.location.pathname.indexOf('/register/nice_one') != -1) ? <Fooder location={this.props.location} history={this.props.history} /> : null}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        is_auth: state.auth.is_auth,
        init_condition: state.auth.initial_condition,
        IP_Details: state.accountinfo.ip_data,
        close_banner: state.header.close_banner,
        close_banner_kd: state.header.close_banner_kd,
        url_condition: state.header.url_condition,


    }
}

const mapDispatchToProps = {
    isAuth, putIPdata, fetchMembershipPlans, getURLCondition
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(App));
