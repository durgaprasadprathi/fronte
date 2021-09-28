import React from 'react';

import SingleStatus from './singleStatus';

import "./styles.scss";


const StatusArea = (props: any) => {
    console.log(props.message)
    return (
        <div className="status-area">
            {
                props.message && props.message.map((m: any, i: any) => (
                    <SingleStatus
                        color={m.type}
                        title={m.text}
                        time={m.time}
                        content={m.content}
                    />
                ))
            }
            {/* <SingleStatus
                color="error"
                title="Amazon Virtual Private Cloud is a  cloud computing service."
                time="10-20-2021 11:55am"
            />
            <SingleStatus
                color="success"
                title="Canvas saved successfully."
                time="10-20-2021 11:55am"
            /> */}
        </div>
    )
}

export default StatusArea;