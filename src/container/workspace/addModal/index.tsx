import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Row, Container, Button, Label, Input } from "reactstrap";

const allRegion = [
    { name: "us-east-1" },
    { name: "us-west-1" }
]


const AddModal = (props: any) => {

    const [state, setState] = useState({
        ownerId: 1,
        organizationId: 1,
        name: "",
        awsRegion: "us-east-1",
        awsAccessKey: "",
        awsSecretAccessKey: ""
    });

    const handleName = (e: any, name: string) => {
        let _state: any = { ...state }
        _state[name] = e.target.value;
        setState(_state);
    }

    useEffect(() => {
        console.log(props)
        if (props.data) {
            setState({
                name: props.data.terraformBackend?.name,
                organizationId: props.data.organization?.organizationId,
                ownerId: props.data.owner?.userId,
                awsRegion: props.data?.awsRegion,
                awsAccessKey: props.data?.awsAccessKey,
                awsSecretAccessKey: props.data?.awsSecretAccessKey
            })
        }
    }, [])

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(props.data);
        if (props.data && props.data.stackId) {
            props.editWorkspace(state);
        }
        else {
            props.addWorkspace(state);
        }
    }

    console.log(state)

    return (
        <>
            <br />
            <form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Label htmlFor="example-text-input" className="col-md-2 col-form-label">Name</Label>
                    <Col md={10}>
                        <Input type="text"
                            defaultValue=""
                            id="example-text-input"
                            placeholder="Name"
                            required
                            value={state.name}
                            onChange={(e) => handleName(e, 'name')}
                        />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Label htmlFor="example-text-input" className="col-md-2 col-form-label">Organization</Label>
                    <Col md={10}>
                        <select
                            className="form-control"
                            required
                            value={state.organizationId}
                            onChange={(e) => handleName(e, 'organizationId')}

                        >
                            {
                                props.allOrganizations && props.allOrganizations.map((a: any, i: any) => (
                                    <option key={i} value={a.organizationId}>{a.organizationName}</option>
                                ))
                            }

                        </select>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Label htmlFor="example-text-input" className="col-md-2 col-form-label">User</Label>
                    <Col md={10}>
                        <select
                            className="form-control"
                            required
                            value={state.ownerId}
                            onChange={(e) => handleName(e, 'ownerId')}
                        >
                            {
                                props.allUsers && props.allUsers.map((a: any, i: any) => (
                                    <option key={i} value={a.userId}>{a.userFirstName}</option>
                                ))
                            }

                        </select>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Label htmlFor="example-text-input" className="col-md-2 col-form-label">AWS Region</Label>
                    <Col md={10}>
                        <select
                            className="form-control"
                            required
                            value={state.awsRegion}
                            onChange={(e) => handleName(e, 'awsRegion')}
                        >
                            {
                                allRegion && allRegion.map((a: any, i: any) => (
                                    <option key={i} value={a.name}>{a.name}</option>
                                ))
                            }

                        </select>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Label htmlFor="example-text-input" className="col-md-2 col-form-label">Access Key</Label>
                    <Col md={10}>
                        <input
                            className="form-control"
                            required
                            value={state.awsAccessKey}
                            onChange={(e) => handleName(e, 'awsAccessKey')}
                            placeholder="AWS Access Key"
                        />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Label htmlFor="example-text-input" className="col-md-2 col-form-label">Secret Key</Label>
                    <Col md={10}>
                        <input
                            className="form-control"
                            required
                            value={state.awsSecretAccessKey}
                            onChange={(e) => handleName(e, 'awsSecretAccessKey')}
                            placeholder="AWS Secret Key"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="text-center">
                        <Button type="submit" color="primary" style={{ display: 'inline-flex' }}>
                            <i className="ri-git-repository-commits-line" />
                            &nbsp;
                            <span>Submit</span>
                        </Button>
                    </Col>
                </Row>
            </form>
        </>
    )
}

export default AddModal;