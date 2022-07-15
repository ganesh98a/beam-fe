import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { Cookies } from "react-cookie-consent";

import * as constand from "../constant";
import ConditionalModalComponent from "../_components/Common/ConditionalModalComponent";
import GoToTop from "../_components/HomePage/GoToTop";
import { setCondition, setMenuCondition} from "../actions";
import { commonService } from "../_services";

class Fooder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      condition_model: false,
      isActualUrl: true
    }
  }

  showConditionUrl = (url, isSetcondition = false, conditions = "", items = {}) => {
    var isActualUrlCondition = true
    if (items && items.isConditionalUrl) {
      this.setState({ isActualUrl: false })
       isActualUrlCondition = false
    }
    if (!isSetcondition) {
      if (Cookies.get('condition')) {
        this.conditionalGoto(Cookies.get('condition'), url, isActualUrlCondition);
      } else if (this.props.is_auth && this.props.init_condition) {
        this.conditionalGoto(this.props.init_condition, url, isActualUrlCondition);
      }
      else if (items && items.isConditionalUrl) {
        this.setState({ condition_model: true, pageUrl: url });
      }
      else {
        this.conditionalGoto(this.props.init_condition, url, isActualUrlCondition);
      }

    } else {
      this.conditionalGoto(conditions, url, isActualUrlCondition);
    }
  }

  getConditionPopup = (url, isSetcondition = false, conditions = "", items = {}) => {


    if (!isSetcondition) {
      if (Cookies.get('condition')) {
        this.conditionalGoto(Cookies.get('condition'), url, this.state.isActualUrl);
      } else if (this.props.is_auth && this.props.init_condition) {
        this.conditionalGoto(this.props.init_condition, url, this.state.isActualUrl);
      }
      else if (items && items.isConditionalUrl) {
        this.setState({ condition_model: true, pageUrl: url });
      }
      else {
        this.conditionalGoto(this.props.init_condition, url, this.state.isActualUrl);
      }

    } else {
      this.conditionalGoto(conditions, url, this.state.isActualUrl);
    }
  }

  conditionalGoto = (condition, url, isActualUrl = false) => {
    console.log('footer-condition', condition)
    console.log('footer-condition-isActualUrl', isActualUrl)
    var current_url = url;
    var formatCondition = commonService.replaceChar(condition, false);
    this.props.setCondition(condition);
    this.props.setMenuCondition(condition);
    if (condition == constand.KR_CONDITION || condition == constand.CONDITION || condition == constand.CANCER_CONDITION || condition == constand.ASTHMA_CONDITION) {
      console.log('yesmatchingcondition=', url)
      if (url) {
        current_url = url + formatCondition;
        if (isActualUrl) {
          current_url = url
        }
        const { from } = { from: { pathname: current_url } };
        this.props.history.push(from);
      }
     } else {
      console.log('nomatchingcondition=', url)
      current_url = url + formatCondition;
      if (isActualUrl) {
        current_url = url
      }
      const { from } = { from: { pathname: current_url } };
      this.props.history.push(from);
    }
    Cookies.set("condition", formatCondition);
    this.savePageUrl(current_url);
    this.setState({ condition_model: false, condition: formatCondition, header_open: false })

  }

  savePageUrl = (url) => {
    if (url) {
      var pathnameTemp = url;
      Cookies.set("current-page-url", pathnameTemp);
    }
  }
  closeConditionModal = () => {
    this.setState({ condition_model: false })
  }
  render() {
    console.log('footer_content', this.props.footer_content)
    return (
      <footer>
        <div className="container-fluid mx-auto w-80">
          <div className="row">
            <div className="col-md-12 col-lg-2">
              <div className="dk-footer-box-info">
                {(this.props.footer_content.logo && this.props.footer_content.logo.link) &&
                  <Link className="footer-logo" to={(this.props.footer_content.logo && this.props.footer_content.logo.link) || ''}>
                    <img
                      className="logo-size"
                      alt="footer_logo"
                      src={constand.S3_URL + (this.props.footer_content.logo && this.props.footer_content.logo.image)}
                    />
                  </Link>
                }
                {(this.props.footer_content.logo && !this.props.footer_content.logo.link) &&
                  <p className="footer-logo" >
                    <img
                      className="logo-size"
                      alt="footer_logo"
                      src={constand.S3_URL + (this.props.footer_content.logo && this.props.footer_content.logo.image)}
                    />
                  </p>
                }

                <div className="footer-social-link">
                  <ul>
                    {this.props.footer_content.facebook &&
                      <li>
                        <a href={this.props.footer_content.facebook} target="_blank">
                          <i className="fa fa-facebook"></i>
                        </a>
                      </li>
                    }
                    {this.props.footer_content.twitter &&
                      <li>
                        <a href={this.props.footer_content.twitter} target="_blank">
                          <i className="fa fa-twitter"></i>
                        </a>
                      </li>
                    }
                    {this.props.footer_content.instagram &&
                      <li>
                        <a href={this.props.footer_content.instagram} target="_blank">
                          <i className="fa fa-instagram"></i>
                        </a>
                      </li>
                    }
                    {this.props.footer_content.linkedin &&
                      <li>
                        <a href={this.props.footer_content.linkedin} target="_blank">
                          <i className="fa fa-linkedin"></i>
                        </a>
                      </li>
                    }
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-8">
              <div className="row m-b-20 footer-widget footer-left-widget col-md-10">
                {this.props.footer_content.navLinks && this.props.footer_content.navLinks.map((item, key) => {
                  return (
                    <div className="col-lg-4 col-md-4 col-sm-6 m-b-10">
                      <Link className="font-medium" onClick={() => { this.showConditionUrl(item.link, false, "", item) }} to={item.isConditionalUrl ? "#" : item.link}> {item.name}</Link></div>
                  )
                })
                }
                <div className="image-grid col-md-12 col-lg-5">
                  <div className="grid-container">

                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-2">
              <div className="dk-footer-box-info orcha-img">
                <img
                  className="img-fluid"
                  alt="orcha_image"
                  src={constand.WEB_IMAGES + "orcha.png"}
                />
              </div>
            </div>
          </div>
        </div>

        <GoToTop scrollStepInPx="50" delayInMs="16.66" />
        <ConditionalModalComponent isModalOpen={this.state.condition_model}
          getConditionPopup={this.getConditionPopup}
          pageUrl={this.state.pageUrl}
          closeConditionModal={this.closeConditionModal}
        />
      </footer>
    );
  }
}

const mapStateToProps = state => {
  return {
    footer_content: state.header.footer_content,
    init_condition: state.auth.initial_condition,

  };
};

const mapDispatchToProps = {
  setCondition,
  setMenuCondition,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Fooder);