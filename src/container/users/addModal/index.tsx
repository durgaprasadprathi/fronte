import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Row, Container, Button, Label, Input } from "reactstrap";


const AddModal = (props: any) => {

    const [state, setState] = useState({
        userName: "",
        firstName: "",
        lastName: "",
        password: "",
        organizationId: 1,
        roleId: 1
    });

    useEffect(() => {
        console.log(props)
        if (props.data) {
            setState({
                userName: props.data.userName,
                firstName: props.data.userFirstName,
                lastName: props.data.userLastName,
                password: "",
                organizationId: props.data.userOrganization.organizationId,
                roleId: props.data.userRole.roleId
            })
        }
    }, [])

    const handleName = (e: any, name: string) => {
        let _state: any = { ...state }
        _state[name] = e.target.value;
        setState(_state);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(props.data)
        if (props.data && props.data.userId) {
            props.editUsers(state);
        }
        else {
            props.addUsers(state);
        }
    }

    return (
        <>
            <br />
            <form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Label htmlFor="example-text-input" className="col-md-2 col-form-label">First Name</Label>
                    <Col md={10}>
                        <Input type="text"
                            defaultValue=""
                            id="example-text-input"
                            placeholder="First Name"
                            required
                            value={state.firstName}
                            onChange={(e) => handleName(e, 'firstName')}
                        />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Label htmlFor="example-text-input" className="col-md-2 col-form-label">Last Name</Label>
                    <Col md={10}>
                        <Input type="text"
                            defaultValue=""
                            id="example-text-input"
                            placeholder="Last Name"
                            required
                            value={state.lastName}
                            onChange={(e) => handleName(e, 'lastName')}
                        />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Label htmlFor="example-text-input" className="col-md-2 col-form-label">Email</Label>
                    <Col md={10}>
                        <Input type="text"
                            defaultValue=""
                            id="example-text-input"
                            placeholder="Email"
                            required
                            value={state.userName}
                            onChange={(e) => handleName(e, 'userName')}
                        />
                    </Col>
                </Row>
                {
                    props.data && props.data.userId
                        ?
                        null
                        : <Row className="mb-3">
                            <Label htmlFor="example-text-input" className="col-md-2 col-form-label">Password</Label>
                            <Col md={10}>
                                <Input type="password"
                                    defaultValue=""
                                    id="example-text-input"
                                    placeholder="Password"
                                    required
                                    value={state.password}
                                    onChange={(e) => handleName(e, 'password')}
                                />
                            </Col>
                        </Row>

                }

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
                    <Label htmlFor="example-text-input" className="col-md-2 col-form-label">Roles</Label>
                    <Col md={10}>
                        <select
                            className="form-control"
                            required
                            value={state.roleId}
                            onChange={(e) => handleName(e, 'roleId')}
                        >
                            <option>Super User</option>
                            <option>Roles 2</option>
                        </select>
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