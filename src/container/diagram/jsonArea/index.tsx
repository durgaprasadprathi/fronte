import React from 'react';
import { connect } from "react-redux";

import "./style.css";
const JsonArea = (props: any) => {
    return (
        <div className="json-area" style={ props.RightSideModal.rightSideModal ?  { width: '80%' } : { width: '100%' }}>
            JSON Area
        </div>
    )
}

const mapStateToProps:any = (state:any )=> {
    return {
        ...state.Layout,
        RightSideModal: state.RightSideModal
    };
};

export default connect(mapStateToProps)(JsonArea);