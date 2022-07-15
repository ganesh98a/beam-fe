import React from "react";
import { connect } from "react-redux";
import { Cookies } from "react-cookie-consent";
import { Link } from 'react-router-dom';
import { cancelBanner, cancelBannerKD, cancelBannerPC } from "../../actions";
import * as constand from "../../constant";

class CffBanner extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {
        if (typeof Cookies.get('closeBanner') == 'undefined') {
            if (Cookies.get('CookieControl') && Object.keys(JSON.parse(Cookies.get('CookieControl')).optionalCookies).length > 0 && JSON.parse(Cookies.get('CookieControl')).optionalCookies.preferences == 'accepted') {
                Cookies.set('closeBanner', false);
            } else if (typeof Cookies.get('CookieControl') == 'undefined') {
                Cookies.set('closeBanner', false);
            }
        }
        if (typeof Cookies.get('closeBannerKD') == 'undefined') {
            if (Cookies.get('CookieControl') && Object.keys(JSON.parse(Cookies.get('CookieControl')).optionalCookies).length > 0 && JSON.parse(Cookies.get('CookieControl')).optionalCookies.preferences == 'accepted') {
                Cookies.set('closeBannerKD', false);
            } else if (typeof Cookies.get('CookieControl') == 'undefined') {
                Cookies.set('closeBannerKD', false);
            }
        }
        console.log('closeBannerPC', Cookies.get('closeBannerPC'))
        if (typeof Cookies.get('closeBannerPC') == 'undefined') {
            if (Cookies.get('CookieControl') && Object.keys(JSON.parse(Cookies.get('CookieControl')).optionalCookies).length > 0 && JSON.parse(Cookies.get('CookieControl')).optionalCookies.preferences == 'accepted') {
                Cookies.set('closeBannerPC', false);
            } else if (typeof Cookies.get('CookieControl') == 'undefined') {
                Cookies.set('closeBannerPC', false);
            }
        }
    }
    sweetThanks(type) {
        if (type == 'cf') {
            if (Cookies.get('CookieControl') && Object.keys(JSON.parse(Cookies.get('CookieControl')).optionalCookies).length > 0 && JSON.parse(Cookies.get('CookieControl')).optionalCookies.preferences == 'accepted')
                Cookies.set("closeBanner", true);

            this.props.cancelBanner();
        } else if (type == 'kd') {
            if (Cookies.get('CookieControl') && Object.keys(JSON.parse(Cookies.get('CookieControl')).optionalCookies).length > 0 && JSON.parse(Cookies.get('CookieControl')).optionalCookies.preferences == 'accepted')
                Cookies.set("closeBannerKD", true);

            this.props.cancelBanner();

        } else if (type == 'pc') {
            if (Cookies.get('CookieControl') && Object.keys(JSON.parse(Cookies.get('CookieControl')).optionalCookies).length > 0 && JSON.parse(Cookies.get('CookieControl')).optionalCookies.preferences == 'accepted')
                Cookies.set("closeBannerPC", true);
            this.props.cancelBanner();
            //window.location.href = '/group/about/Royal Marsden/prostate-cancer';
        }
    }
    renderCFFBanner(type, currentPath) {
        return (
            <div>
                {type == 'web' &&
                    <section id="section6" className={currentPath == '/home' ? "section6-bg navbar-collapse" : "section6-bg navbar-collapse"}>
                        <div className="col-md-12">
                            <div className="row">
                                <div className="float-left cff_banner_img">
                                    <div className="cff_image">
                                        <img src={constand.WEB_IMAGES + "partner_CFF.png"} className="" />
                                    </div>
                                </div>
                                <div className="w-65 cff_adults float-left ml-4">
                                    <p className="text-white font-18 font-semibold mb-0 ">Adults with cystic fibrosis in the USA!</p>
                                    <p className="text-white font-16 font-qmedium mb-0">Enjoy your gift of Beam membership until December 31st 2022, thanks to the CF Foundation. No promo code needed. </p>
                                </div>
                                <div className="cff_buttons mt-3">

                                    <Link to={'/blogs/how-do-i-claim-free-membership'} className="btn btn-orange-inverse btn-banner float-right" >Learn more</Link>

                                    <button className="btn btn-white-inverse btn-banner float-right mr-3 ml-3" onClick={() => {
                                        this.sweetThanks('cf')
                                    }}>Sweet! Thanks!</button>
                                </div>
                            </div>
                        </div>
                    </section>
                }
                {type == "mobile" &&
                    <section id="section6" className="section6-bg mobile-condition-dd">
                        <div className="col-md-12">
                            <div className="row">
                                <div className="float-left cff_banner_img">
                                    <div className="cff_image"><img src={constand.WEB_IMAGES + "partner_CFF.png"} className="" /></div>
                                </div>
                                <div className="cff_adults">
                                    <p className="text-white font-14 font-semibold mb-0 ">Adults with cystic fibrosis in the USA!</p>
                                    <p className="text-white font-14 font-qmedium mb-0">Enjoy your gift of Beam membership until 31st December 2022 thanks to the CF Foundation.</p>
                                    <div className="cff_buttons mt-3">
                                        <button className="btn btn-white-inverse btn-banner float-left font-book mr-3" onClick={() => { this.sweetThanks('cf'); }}>Thanks!</button>
                                        <Link to={'blogs/how-do-i-claim-free-membership'} className="btn btn-orange-inverse btn-banner float-left" >Learn more</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                }
            </div>
        )
    }
    renderKDBanner(type, currentPath) {
        return (
            <div>
                {type == 'web' &&
                    <section id="section6" className={currentPath == '/home' ? "section6-bg navbar-collapse" : "section6-bg navbar-collapse"}>
                        <div className="col-md-12">
                            <div className="row">
                                {/* <div className="float-left cff_banner_img">
                                    <div className="cff_image">
                                        <img src={constand.WEB_IMAGES + "KRUK-logo.png"} className="" width="130" height="55" />
                                    </div>
                                </div> */}
                                <div className="w-65 cff_adults float-left ml-4">
                                    <p className="text-white font-18 font-semibold mb-0 ">
                                        Beam Kidney Disease is free until 31st May 2022, thanks to Kidney Research UK, Kidney Care UK, National Kidney Federation and UK Kidney Association!</p>
                                    <p className="text-white font-16 font-qmedium mb-0">
                                        No promo code needed - just click “Get Started” above. </p>
                                </div>
                                <div className="cff_buttons mt-3">

                                    <Link to={'/blogs/kidney-beam-is-here'} className="btn btn-orange-inverse btn-banner float-right" >Learn more</Link>

                                    <button className="btn btn-white-inverse btn-banner float-right mr-3 ml-3" onClick={() => { this.sweetThanks('kd') }}>Sweet! Thanks!</button>
                                </div>
                            </div>
                        </div>
                    </section>
                }
                {type == "mobile" &&
                    <section id="section6" className="section6-bg mobile-condition-dd">
                        <div className="col-md-12">
                            <div className="row">
                                {/* <div className="float-left cff_banner_img">
                                    <div className="cff_image"><img src={constand.WEB_IMAGES + "KRUK-logo.png"} className="" width="90" height="40" /></div>
                                </div> */}
                                <div className="float-left p-1"></div>
                                <div className="cff_adults">
                                    <p className="text-white font-14 font-semibold mb-0 ">Beam Kidney Disease is free until 31st May, thanks to Kidney Research UK, Kidney Care UK, National Kidney Federation and UK Kidney Association!</p>
                                    <p className="text-white font-14 font-qmedium mb-0">No promo code needed - just click “Get Started” above.</p>
                                    <div className="cff_buttons mt-3">
                                        <button className="btn btn-white-inverse btn-banner float-left font-book mr-3" onClick={() => { this.sweetThanks('kd') }}>Thanks!</button>
                                        <Link to={'blogs/kidney-beam-is-here'} className="btn btn-orange-inverse btn-banner float-left" >Learn more</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                }
            </div>
        )
    }
    renderPCBanner(type, currentPath) {
        console.log('renderPCBanner')
        return (
            <div>
                {type == 'web' &&
                    <section id="section6" className={currentPath == '/home' ? "section6-bg navbar-collapse" : "section6-bg navbar-collapse"}>
                        <div className="col-md-12 pc-banner">
                            <div className="row">
                                <div className="float-left cff_banner_img w-20">
                                    <div className="cff_image text-center cancer-banner w-100">
                                        <img src={constand.WEB_IMAGES + "logos/RM-logo.png"} className="w-80" />
                                    </div>
                                </div>
                                <div className="w-45 cff_adults float-left pl-4">
                                    <p className="text-white font-18 font-semibold mb-0 align-self-center ">
                                        Are you a patient of the Royal Marsden?</p>
                                    <p className="text-white font-16 font-qmedium mb-0 align-self-center">
                                        Click the button to go to your exclusive group. </p>
                                </div>
                                <div className="cff_buttons align-self-center">

                                    <Link className="btn btn-orange-inverse btn-banner float-right m-t-0" to={'/group/about/Royal Marsden/' + constand.CANCER_CONDITION.replace(' ', '-')} >Go to your group</Link>

                                    {<button className="btn btn-white-inverse btn-banner float-right mr-3 ml-3 m-t-0" onClick={() => { this.sweetThanks('pc') }}>Sweet! Thanks!</button>}
                                </div>
                            </div>
                        </div>
                    </section>
                }
                {type == "mobile" &&
                    <section id="section6" className="section6-bg mobile-condition-dd">
                        <div className="col-md-12 pc-banner">
                            <div className="row">
                                <div className="float-left cff_banner_img">
                                    <div className="cff_image text-center cancer-banner"><img src={constand.WEB_IMAGES + "logos/RM-logo.png"} className="w-80" /></div>
                                </div>
                                <div className="cff_adults ">
                                    <p className="text-white font-14 font-semibold mb-0 ">Are you a patient of the Royal Marsden?</p>
                                    <p className="text-white font-14 font-qmedium mb-0">Click the button to go to your exclusive group.</p>
                                    <div className="cff_buttons mt-3">
                                        {<button className="btn btn-white-inverse btn-banner float-left font-book mr-3" onClick={() => { this.sweetThanks('pc') }}>Thanks!</button>}
                                        <Link className="btn btn-orange-inverse btn-banner float-left" to={'/group/about/Royal Marsden/' + constand.CANCER_CONDITION.replace(' ', '-')} >Go to your group</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                }
            </div>
        )
    }
    render() {
        var currentPath = window.location.href;
        currentPath = currentPath.indexOf('/home') != -1 ? '/home' : '';
        currentPath = currentPath.indexOf('/reset') != -1 ? '/home' : currentPath;
        var { type, condition } = this.props;
        console.log('cffbanner', condition)
        console.log('cffbanner-cnd', condition.includes(constand.CONDITION.split(" ")[0]))
        return (
            <React.Fragment>
                {condition.includes(constand.CONDITION.split(" ")[0]) && (typeof Cookies.get('closeBanner') == 'undefined' || Cookies.get('closeBanner') === 'false') && this.props.close_banner == false &&
                    this.renderCFFBanner(type, currentPath)
                }
                {false && condition.includes(constand.KR_CONDITION.split(" ")[0]) && (typeof Cookies.get('closeBannerKD') == 'undefined' || Cookies.get('closeBannerKD') === 'false') && this.props.close_banner_kd == false &&
                    this.renderKDBanner(type, currentPath)
                    //closed for now 182284235-REMOVE-KIDNEY-BANNER
                }
                {condition.includes(constand.CANCER_CONDITION.split(" ")[0])&& (typeof Cookies.get('closeBannerPC') == 'undefined' || Cookies.get('closeBannerPC') === 'false') && this.props.close_banner_pc == false &&
                    this.renderPCBanner(type, currentPath)
                }
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        is_auth: state.auth.is_auth,
        close_banner: state.header.close_banner,
        close_banner_kd: state.header.close_banner_kd,
        close_banner_pc: state.header.close_banner_pc,

    };
};

const mapDispatchToProps = {
    cancelBanner,
    cancelBannerKD,
    cancelBannerPC
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CffBanner);
