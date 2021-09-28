import React from 'react';
import "./styles.css";

const MenuItem = (props: any) => {
    return (
        <div className="canvas-menu-item">
            {props.children}

        </div>
    )
}

export default MenuItem;