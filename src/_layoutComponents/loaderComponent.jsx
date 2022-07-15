import React from "react";
import { connect } from "react-redux";
import { start_loader,stop_loader } from "../actions";
import Loader from 'react-loader-spinner';

class LoaderComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <React.Fragment>
            {(this.props.loader_state) && 
            <div className="loading"><Loader 
            type="Triangle"
            color="#00BFFF"
            height="100"	
            width="100"
             /></div>}
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
    start_loader,stop_loader
 };
 
 export default connect(
   mapStateToProps,
   mapDispatchToProps
 )(LoaderComponent);
 