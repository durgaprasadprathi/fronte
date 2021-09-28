import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Row, Container, Button, Label, Input } from "reactstrap";

const allRegion = [
    { name:"us-east-1"},
    { name:"us-west-1"}
]

const AddModal = (props: any) => {

    const [state, setState] = useState({
        key: '',
        secret: '',
        region: 'us-east-1',

    })

    useEffect(() => {
        console.log(props)
        // if(props.data){
        //     setState({organizationName: props.data.organizationName})
        // }
    }, [])

    const handleName = (e: any, name: string) => {
        let _state: any = { ...state }
        _state[name] = e.target.value;
        setState(_state);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (props.data && props.data.organizationId) {
            props.editOrganization(state);
        }
        else {
            props.addOrganization(state);
        }
    }

    return (
        <>
            <br />
            <form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Label htmlFor="example-text-input" className="col-md-2 col-form-label">Access Key</Label>
                    <Col md={10}>
                        <Input
                            type="text"
                            defaultValue=""
                            id="example-text-input"
                            required
                            placeholder="Access Key"
                            value={state.key}
                            onChange={(e) => handleName(e, 'key')}
                        />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Label htmlFor="example-text-input" className="col-md-2 col-form-label">Secret  Key</Label>
                    <Col md={10}>
                        <Input
                            type="text"
                            defaultValue=""
                            id="example-text-input"
                            required
                            placeholder="Secret  Key"
                            value={state.secret}
                            onChange={(e) => handleName(e, 'secret')}
                        />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Label htmlFor="example-text-input" className="col-md-2 col-form-label">Region</Label>
                    <Col md={10}>
                        <select
                            className="form-control"
                            required
                            value={state.region}
                            onChange={(e) => handleName(e, 'region')}
                        >
                            {
                                allRegion && allRegion.map((a: any, i: any) => (
                                    <option key={i} value={a.name}>{a.name}</option>
                                ))
                            }

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