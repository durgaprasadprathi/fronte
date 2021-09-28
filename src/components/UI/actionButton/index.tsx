import React from 'react';
import './styles.css';

const ActionButton = (props: any) => {
    return (
        <span style={props.style} className="action-button" onClick={props.disabled ? {} : props.onClick}>
            <span className="action-button-icon">
                <i className={props.icon} style={props.color ? {color:props.color} : {}}></i>
            </span>&nbsp;
            <span className="action-button-title">{props.title}</span>
        </span>
    )
}

export default ActionButton;