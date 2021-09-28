import React from 'react';
import "./styles.css";

const MenuItem = (props: any) => {
    return (
        <div
            className={props.active ? "canvas-menu canvas-active" : "canvas-menu"}
            onClick={props.onClick}
        >
            <div className="row flex-center">
                <div className="col-md-10">
                    {props.title}
                </div>
                <div className="col-md-2" style={{fontSize:20}}>
                    {props.active
                        ?
                        <i className="ri-arrow-down-s-fill"></i>
                        :
                        <i className="ri-arrow-up-s-fill"></i>
                    }
                </div>
            </div>


        </div>
    )
}

export default MenuItem;