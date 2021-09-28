import React, { useState } from 'react';
import Modal from "./statusModal";
import "./styles.scss";

const SingleStatus = (props: any) => {

    const [modal, setModal] = useState(false);

    return (
        <>
            <div className={"single-status " + props.color} onClick={() => setModal(true)}>
                <div className="single-status-title">
                    {props.title}
                </div>
                <div className="single-status-time">
                    {props.time}
                </div>
                <br />
            </div>
            {
                modal
                ?
                    <Modal 
                        modal={modal}
                    
                        content={props.content}
                        toggle={() => setModal(false)} 
                    />

                : null
            }

        </>
    )
}

export default SingleStatus;