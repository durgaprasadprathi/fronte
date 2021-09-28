import React from 'react';
import { Row, Col, Card, CardBody, CardTitle, Container } from "reactstrap";

const Layout = (props: any) => {
    return (
        <>
            <Row>
                <Col lg={12}>
                    <Card>
                        <CardBody>
                            <CardTitle className="mb-4">{props.title}</CardTitle>
                            {props.children}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default Layout;