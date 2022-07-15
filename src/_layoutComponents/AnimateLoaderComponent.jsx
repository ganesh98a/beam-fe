import React from "react";
import { connect } from "react-redux";

class AnimateLoaderComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log('this.props.isLoading',this.props.isLoading)
        return (
            <React.Fragment>
                {
                    <div className="lds-default">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        loader_state: state.header.loader_state
    };
};

const mapDispatchToProps = {
    
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AnimateLoaderComponent);
