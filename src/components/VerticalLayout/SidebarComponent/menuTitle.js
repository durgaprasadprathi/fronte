import React from 'react';
import { Link } from "react-router-dom";

const MenuTitle = (props) => {
    return (
        <li className="menu-title">{props.title}</li>
    )
}

export default MenuTitle;