import React from 'react';
import { Link } from "react-router-dom";

const ChildMenu = (props) => {
    return (
        <li>
            <Link to={props.data.route}>{props.data.name}</Link>
        </li>

    )
}

export default ChildMenu;