import React, { Component } from 'react';
import './styles.css'
const styleLarge = { width: '90vw', paddingTop: 10, 'box-shadow': '4px 6px 9px 5px rgb(24 24 24 / 14%), 0 4px 13px 6px rgb(0 0 0 / 12%), 6px 1px 4px 3px rgb(0 0 0 / 20%)' }
const styleNormal = { width: '50vw', paddingTop: 10, 'box-shadow': '4px 6px 9px 5px rgb(24 24 24 / 14%), 0 4px 13px 6px rgb(0 0 0 / 12%), 6px 1px 4px 3px rgb(0 0 0 / 20%)' }


const Overlay = (props: any) => {

    return (
        <>

            <div id="mySidenav" style={props.overlay ? (props.isLarge ? styleLarge : styleNormal) : styleNormal} className="sidenav" >
                <div className="row" >
                    <div className="col-md-9 pl-4">
                        <h5 className="modal-title">{props.title}</h5>
                    </div>
                    <div className="col-md-3">
                        <a href="javascript:void(0)" className="closebtn" onClick={props.handleOverLay}>&times;</a>
                    </div>
                </div>
                <hr />

                <div className="overlay-content">
                    {props.children}
                </div>

            </div>
        </>

    )
}

export default Overlay;