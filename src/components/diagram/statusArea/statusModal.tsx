import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ModalStatus = (props: any) => {
    console.log(props.content);
    return (
        <div>
            <Modal size="xl" isOpen={props.modal} toggle={props.toggle} >
                <ModalBody className="status-modal-body">
                    {props.content}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={props.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ModalStatus;
