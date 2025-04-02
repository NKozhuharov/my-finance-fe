import {Link} from "react-router";
import {Col, Container, FormText, Row} from "react-bootstrap";

export default function Footer() {
    return <footer className="app-footer d-flex justify-content-between align-items-center sticky-bottom">
        <Container>
            <Row className="text-center">
                <Col xs={5}>
                    <Row>
                        <Col xs={6}>
                            <Link to="/dashboard" className="d-flex align-items-center flex-column footer-button">
                                <i className="bi bi-house" style={{fontSize: "2rem"}}></i>
                                <FormText className="e">Home</FormText>
                            </Link>
                        </Col>
                        <Col xs={6}>
                            <Link to="/wallets" className="logo d-flex align-items-center flex-column footer-button">
                                <i className="bi bi-wallet" style={{fontSize: "2rem"}}></i>
                                <FormText>Wallets</FormText>
                            </Link>
                        </Col>
                    </Row>
                </Col>
                <Col xs={2}>
                    <Link to="/transactions/create" className="btn btn-lg btn-success my-3" title="Create Transaction">
                        <i className="bi bi-plus" style={{fontSize: "1.5rem"}}></i>
                    </Link>
                </Col>
                <Col xs={5}>
                    <Row>
                        <Col xs={6}>
                            <Link to="/categories" className="logo d-flex align-items-center flex-column footer-button">
                                <i className="bi bi-list" style={{fontSize: "2rem"}}></i>
                                <FormText>Categories</FormText>
                            </Link>
                        </Col>
                        <Col xs={6}>
                            <Link to="/transactions" className="logo d-flex align-items-center flex-column footer-button">
                                <i className="bi bi-currency-dollar" style={{fontSize: "2rem"}}></i>
                                <FormText>Transactions</FormText>
                            </Link>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    </footer>;
}
