import {Link} from "react-router";
import {Col, Container, FormText, Row} from "react-bootstrap";
import {useContext} from "react";
import {UserContext} from "@contexts/UserContext.jsx";

export default function Footer() {
    const {user} = useContext(UserContext);

    return <footer className="app-footer d-flex justify-content-between align-items-center sticky-bottom">
        <Container>
            <Row className="text-center">
                <Col xs={5}>
                    <Row>
                        <Col xs={6}>
                            <Link to="/wallets" className="logo d-flex align-items-center flex-column footer-button">
                                <i className="bi bi-wallet" style={{fontSize: "2rem"}}></i>
                                <FormText>Wallets</FormText>
                            </Link>
                        </Col>
                        <Col xs={6}>
                            <Link to="/categories" className="logo d-flex align-items-center flex-column footer-button">
                                <i className="bi bi-list" style={{fontSize: "2rem"}}></i>
                                <FormText>Categories</FormText>
                            </Link>
                        </Col>
                    </Row>
                </Col>
                <Col xs={2}>
                    {user.active_wallet_id === 0 ? (
                        <button className="btn btn-lg btn-success my-3" disabled>
                            <i className="bi bi-plus" style={{fontSize: "1.5rem"}}></i>
                        </button>
                    ) : (
                        <Link to="/transactions/create" className="btn btn-lg btn-success my-3" title="Create Transaction">
                            <i className="bi bi-plus" style={{fontSize: "1.5rem"}}></i>
                        </Link>
                    )}
                </Col>
                <Col xs={5}>
                    <Row>
                        <Col xs={6}>
                            <Link to="/transactions" className="logo d-flex align-items-center flex-column footer-button">
                                <i className="bi bi-currency-dollar" style={{fontSize: "2rem"}}></i>
                                <FormText>Transactions</FormText>
                            </Link>
                        </Col>
                        <Col xs={6}>
                            <Link to="/reports" className="logo d-flex align-items-center flex-column footer-button">
                                <i className="bi bi-pie-chart" style={{fontSize: "2rem"}}></i>
                                <FormText>Reports</FormText>
                            </Link>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    </footer>;
}
