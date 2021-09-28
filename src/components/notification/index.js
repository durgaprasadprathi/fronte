import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { connect } from "react-redux";

import 'react-toastify/dist/ReactToastify.css';
import { apiLoading, apiMessage, apiErrorMessage } from '../../store/actions';


const Notifications = (props) => {

    const { title, body, type } = props;
    // console.log(props)
    let jsx = <div className="row">
        {/* <div className="col-md-12"><strong>{title}</strong></div> */}
        <div className="col-md-12">{body}</div>
    </div>
    const notify = () => toast[type](jsx, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    useEffect(() => {
        updateStamp();
    },[])

    const updateStamp = () =>{
        setTimeout(() =>{
            props.apiMessage("");
            props.apiErrorMessage("");
        },5000)
    }

    return (
        <div>
            {notify()}
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover

            />
        </div>
    );
}
const mapDispatchToProps = { apiLoading, apiMessage, apiErrorMessage };
export default connect(null, mapDispatchToProps)(Notifications);

