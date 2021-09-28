import React from 'react';
import { Link } from "react-router-dom";


const MainMenu = (props) => {
    return (
        <Link to={props.data.route} className={props.hasCaret ? " has-arrow waves-effect" : "waves-effect"}>
            <i className={props.data.icon}></i>
            {/* <span className="badge rounded-pill bg-success float-end">3</span> */}
            <span className="ms-1">{props.data.name}</span>
        </Link>
    )
}

export default MainMenu;