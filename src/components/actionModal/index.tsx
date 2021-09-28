import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ModalConfirm = (props: any) => {
    return (
        <div>
            <Modal size="md" isOpen={props.modal} toggle={props.toggle} >
                <ModalHeader toggle={props.toggle}>{props.title}</ModalHeader>
                <ModalBody>
                    <div className="card-body">
                        <form>
                            <div className="row">
                                <div className="col-sm-8">
                                    <div className="form-group">
                                        {props.content}
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="form-group">
                                        <button type="button" onClick={props.click} className="btn btn-danger waves-effect waves-light">Confirm</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={props.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );

}

export default ModalConfirm;
