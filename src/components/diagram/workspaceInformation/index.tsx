import React from 'react';

const WorkspaceInformation = (props: any) => {
    return (
        <div className="diagram-information">
            <div className="row">
                <div className="col-md-12 mt-2 mb-2">
                    <input type="text" readOnly className="form-control" value={props.data.awsRegion} placeholder="Region" />
                    {/* <select
                        className="form-control"
                    >
                        <option>Region</option>
                        <option>us-west-1</option>
                        <option>us-west-1</option>
                    </select> */}
                </div>

                <div className="col-md-12 mb-2">
                    <input type="text"  className="form-control" readOnly value={props.data?.organization?.organizationName} placeholder="Organization Name" />
                    {/* <select
                        className="form-control"
                    >
                        <option>Organization Account</option>
                        <option>Account A</option>
                        <option>Account b</option>
                    </select> */}
                </div>

                <div className="col-md-12 mb-2">
                    <input type="text" readOnly className="form-control" value="AWS" />
                    {/* <select
                        className="form-control"
                    >
                        <option>Platform List</option>
                        <option>AWS</option>
                        <option>Azure</option>
                    </select> */}
                </div>
            </div>
        </div>
    )
}

export default WorkspaceInformation;