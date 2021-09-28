import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Row, Container, Button, Label, Input } from "reactstrap";
import "./styles.scss";
const roles = ['CREATE', 'UPDATE', 'DELETE', 'GET'];
const sections = ["ORGANIZATION", "USER", "WORKSPACE"];

const AddModal = (props: any) => {

    const [state, setState] = useState({
        name: "",
        description: ""
    })

    const [stateRoles, setStateRoles] = useState([]);
    const [stateScope, setStateScope] = useState([]);
    const [roleId, setRoleId] = useState(null);

    useEffect(() => {
        console.log(props)
        if (props.data) {
            setState({
                name: props.data.roleName,
                description: props.data.roleDescription
            })
        }
    }, [])

    useEffect(() => {
        console.log(props.permissions)
        if (props.permissions) {
            setStateRoles(props.permissions)
        }
    }, [props.permissions])

    useEffect(() => {
        if (props.roleId) {
            setRoleId(props.roleId)
        }
    }, [props.roleId])




    const handleChange = (e: any, type: string) => {
        let _state: any = { ...state };
        _state[type] = e.target.value;
        setState(_state)

    }

    const handleSubmitRole = (e: any) => {
        e.preventDefault();
        if (roleId) {
            props.editRole(state)
        }
        else {
            props.addRole(state)
        }
    }

    const checkScope = (name: string) => {
        let _stateScope = [...stateScope];
        let _checkScope = _stateScope.findIndex((s: any) => s.name === name)
        if (_checkScope >= 0) {
            return _stateScope[_checkScope].scope;
        }
        return "GLOBAL";
    }

    const handleCheckScope = (e: any, name: string) => {
        console.log(e, name);
        let _stateScope = [...stateScope];
        console.log(_stateScope)
        let _checkScope = _stateScope.findIndex((s: any) => s.name == name)
        console.log(_checkScope)
        if (_checkScope >= 0) {
            _stateScope[_checkScope].scope = e.target.value;

        }
        else {
            _stateScope.push({
                name: name,
                scope: e.target.value
            })
        }
        console.log(_stateScope);
        setStateScope(_stateScope);
    }

    const checkPermission = (section: string, role: string) => {
        let _stateRoles = [...stateRoles];
        let _checkIndex = _stateRoles.findIndex((s: any) => s.permissionName === role + "_" + section);
        if (_checkIndex >= 0) {
            return true;
        }
        else {
            return false;
        }
    }

    const handleCheckBox = (event: any, section: string, role: string) => {
        console.log(event, section, role);

        let _stateRoles = [...stateRoles];

        if (event.target.checked) {
            let getScope = stateScope.filter((s: any) => s.name = section);
            let scope = "GLOBAL";
            if (getScope.length > 0) {
                scope = getScope[0].scope;
            }

            _stateRoles.push({
                "permissionName": role + "_" + section,
                // "permissionDescription": "Can create organizations",
                "permissionScope": scope
            })
        }
        else {
            let _checkIndex = _stateRoles.findIndex((s: any) => s.permissionName === role + "_" + section);
            _stateRoles.splice(_checkIndex, 1);
        }
        console.log(_stateRoles);
        setStateRoles(_stateRoles);
    }


    const handlePermission = () =>{
        if(stateRoles.length > 0){
            props.updateRoles(stateRoles);
        }
    }

    return (
        <>
            <br />
            <form onSubmit={handleSubmitRole} className="mb-3">
                <Row className="mb-3">
                    <Label htmlFor="example-text-input" className="col-md-2 col-form-label">Name</Label>
                    <Col md={10}>
                        <Input type="text"
                            defaultValue=""
                            id="example-text-input"
                            placeholder="Name"
                            required
                            onChange={(e) => handleChange(e, "name")}
                            value={state.name}
                        />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Label htmlFor="example-text-input" className="col-md-2 col-form-label">Description</Label>
                    <Col md={10}>
                        <Input type="text"
                            defaultValue=""
                            id="example-text-input"
                            placeholder="Description"
                            required
                            onChange={(e) => handleChange(e, "description")}
                            value={state.description}
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
            {
                roleId
                    ?
                    <>
                        {
                            sections.map((s: any, i: any) => (
                                <Row className="mb-3">
                                    <Label htmlFor="example-text-input " className="col-md-6 col-form-label roles-label">
                                        <div className="row" style={{ width: '100%' }}>
                                            <div className="col-md-6">
                                                {s}
                                            </div>
                                            <div className="col-md-6">
                                                <select
                                                    className="form-control roles-select"
                                                    value={checkScope(s)}
                                                    onChange={(e) => handleCheckScope(e, s)}

                                                >
                                                    <option value="GLOBAL">GLOBAL</option>
                                                    <option value="ORG">ORGANIZATION</option>
                                                </select>
                                            </div>
                                        </div>


                                    </Label>
                                    <Col md={12}>
                                        <Row>
                                            {
                                                roles.map((r, i) => (
                                                    <Col key={i} md={3}>
                                                        <input
                                                            id={s + r}
                                                            type="checkbox"
                                                            onChange={(e) => handleCheckBox(e, s, r)}
                                                            checked={checkPermission(s, r)}

                                                        /> &nbsp;
                                                        <label htmlFor={s + r}>{r}</label>
                                                    </Col>
                                                ))
                                            }
                                        </Row>

                                    </Col>
                                </Row>
                            ))
                        }
                        <Row>
                            <Col md={12} className="text-center">
                                <Button type="button" onClick={handlePermission} color="primary" style={{ display: 'inline-flex' }}>
                                    <i className="ri-git-repository-commits-line" />
                                    &nbsp;
                                    <span>Submit</span>
                                </Button>
                            </Col>
                        </Row>
                    </>

                    : null
            }
        </>
    )
}

export default AddModal;