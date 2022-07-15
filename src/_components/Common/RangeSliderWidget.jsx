import React from "react";
import { connect } from "react-redux";
import Slider from 'react-rangeslider'
import {
    setSliderValue
} from "../../actions";
class RangeSliderWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //rangeValue: this.props.horizontal,
            changeRange: false
        };
    };
    componentDidMount() {
        console.log('RangeSliderWidget-props', this.props)
    }

    render() {

        return (
            <div className={"custom-labels horizon_slider_settings" + (this.state.changeRange ? " range_circle" : "")}>
                <div className="v_line">
                    <span className="v_lineht lne1"></span>
                    <span className="v_lineht lne2"></span>
                    <span className="v_lineht lne3"></span>
                </div>
                <Slider
                    min={this.props.fieldSchema.minimum}
                    max={this.props.fieldSchema.maximum}
                    value={this.props.sliderValue}
                    labels={this.props.labels}
                    tooltip={false}
                    onChange={(value) => {
                        this.props.onChange(value, this.props.formProps);
                        this.setState({ rangeValue: value, changeRange: true });
                    }}
                />
                {!this.props.sliderValue &&
                    <p className={"black-txt m-t-40 " + this.props.descClass || ''} dangerouslySetInnerHTML={{
                        __html: this.props.fieldSchema.desc
                    }}></p>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        is_auth: state.auth.is_auth,
        sliderValue: state.dashboard.sliderValue
    };
};

const mapDispatchToProps = {
    setSliderValue
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RangeSliderWidget);