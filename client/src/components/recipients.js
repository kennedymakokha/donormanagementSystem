import React, { Component } from 'react'
import Layout from './Layout';
import { Table, Button, Modal, Form, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { post as postrecipient, reject, fetch, validate, fetchOne } from './../axios/actions/recipient'
import Toast from './toast'
import toastify from './toastify'

class recipients extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            show: false,
            notify: false,
            reciepient: {},
            valid: '',
            category: {},
            showReject: false,
            reasons: '',
            message: '',
            variant: ''

        }
    }
    handleinputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    validate = async (e) => {
        await this.props.fetchOne(`${e._id}`)
        this.setState({
            show: true,
            reciepient: this.props.reciepient,
            category: this.props.reciepient.category
        })

    }
    submitvalidation = async (id) => {
        try {
            await this.props.validate(id)
            await this.props.fetch()
            this.setState({ data: this.props.reciepients, show: false })
        } catch (error) {

        }


    }

    reject = async (e) => {
        await this.props.fetchOne(`${e._id}`)
        this.setState({
            showReject: true,
            reciepient: this.props.reciepient,
            reasons: this.props.reciepient.reasons,
            category: this.props.reciepient.category
        })
    }
    submitRejection = async (id) => {

        try {
            const data = {
                reasons: this.state.reasons,
                id: `${id}`
            }
            await this.props.reject(data)
            await this.props.fetch()
            this.setState({ data: this.props.reciepients, showReject: false })
        } catch (error) {
            const j = toastify(`${error.response.data.message}`, 'danger')
            this.setState({
                notify: 'notification-show', message: j.message, variant: j.variant
            })
        }
    }
    hideToast = () => {
        this.setState({ notify: 'notification-hide' })
    }
    componentDidMount = async () => {

        if (localStorage.getItem('role') !== 'admin') {
            return this.props.history.push('/');
        }
        await this.props.fetch()
        this.setState({ data: this.props.reciepients })


    }
    render() {
        const { show, reciepient, showReject } = this.state
        return (
            <Layout >
                <Toast position="bottom-left" message={this.state.message} hideToast={() => this.hideToast()} show={this.state.notify} variant={this.state.variant} />
                <div className="content-container">
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>

                                <th>Name</th>
                                <th>Type</th>
                                <th>Country</th>
                                <th>Contact </th>
                                <th>Sorce of funds </th>
                                <th>Donation Type </th>
                                <th>Action </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map((dat, i) => (
                                <tr key={i}>
                                    <td>{dat.name}</td>
                                    <td>{dat.type}</td>
                                    <td>{dat.country}</td>
                                    <td>{dat.tel}</td>
                                    <td>{dat.funds}</td>
                                    <td>{dat.category.name}</td>
                                    <td style={{ justifyContent: 'space-between', display: 'flex' }}> {dat.valid === "off" ? dat.rejected === "off" ? <Button className='bt-xs' onClick={() => this.validate(dat)}>Validate</Button> : null : <Button className='bt-xs' onClick={() => this.validate(dat)}>Validated</Button>}
                                        {dat.rejected === "off" ? dat.valid === "off" ? <Button className='bt-xs' style={{ backgroundColor: '#e57373' }} onClick={() => this.reject(dat)}>Reject</Button> : null : <Button className='bt-xs' style={{ backgroundColor: 'red' }} onClick={() => this.reject(dat)}>Rejected</Button>}
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </Table>
                </div>
                <Modal show={show} onHide={() => this.setState({ show: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ textTransform: 'capitalize', color: '#10104d' }}>{reciepient.valid === "off" ? 'Validating' : null} {reciepient.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Row>
                            <Col>
                                <Form.Label>Duly Registered</Form.Label>
                                <Form.Text className="text-muted">
                                    Yes.</Form.Text>
                            </Col>
                            <Col>


                                <Form.Label>Country</Form.Label>
                                <Form.Text className="text-muted">
                                    {reciepient.country}
                                </Form.Text>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Label>County/State</Form.Label>
                                <Form.Text className="text-muted">
                                    {reciepient.physical_address}
                                </Form.Text>
                            </Col>
                            <Col>
                                <Form.Label>Fund category:</Form.Label>
                                <Form.Text className="text-muted">
                                    {this.state.category.name}
                                </Form.Text>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Label>Tax Compliance Certificate:</Form.Label>
                                <Form.Text >
                                    <Button variant="light"><a href={reciepient.tax_cert} as Link to={reciepient.tax_cert}>Download</a> </Button>
                                </Form.Text>
                            </Col>

                            <Col>
                                <Form.Label>Tax compliant</Form.Label>
                                {reciepient.valid}
                                <Form.Check type="checkbox" name="valid" checked={reciepient.valid === "off" ? false : true} onChange={(e) => this.handleinputChange(e)} label="Valid" />
                            </Col>
                        </Form.Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ show: false })}>
                            Close
          </Button>
                        {reciepient.valid === "off" ? <Button variant="primary" onClick={() => this.submitvalidation(`${reciepient._id}`)}>
                            Validate
          </Button> : null}
                    </Modal.Footer>
                </Modal>

                <Modal show={showReject} onHide={() => this.setState({ showReject: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ textTransform: 'capitalize', color: '#10104d' }}>{reciepient.reject === "off" ? 'Rejecting' : null} {reciepient.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Row>
                            <Col>
                                <Form.Label>Duly Registered</Form.Label>
                                <Form.Text className="text-muted">
                                    Yes.</Form.Text>
                            </Col>
                            <Col>


                                <Form.Label>Country</Form.Label>
                                <Form.Text className="text-muted">
                                    {reciepient.country}
                                </Form.Text>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Label>County/State</Form.Label>
                                <Form.Text className="text-muted">
                                    {reciepient.physical_address}
                                </Form.Text>
                            </Col>
                            <Col>
                                <Form.Label>Fund category:</Form.Label>
                                <Form.Text className="text-muted">
                                    {this.state.category.name}
                                </Form.Text>
                            </Col>

                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Label>Tax Compliance Certificate:</Form.Label>
                                <Form.Text >
                                    <Button variant="light"><a href={reciepient.tax_cert} as Link to={reciepient.tax_cert}>Download</a> </Button>
                                </Form.Text>
                            </Col>

                            <Col>
                                <Form.Label>Tax compliant</Form.Label>
                                {reciepient.rejected}
                                <Form.Check type="checkbox" name="valid" checked={reciepient.rejected === "off" ? false : true} onChange={(e) => this.handleinputChange(e)} label="Rejected" />
                            </Col>

                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Label>Reasons for rejecting</Form.Label>
                                <Form.Control as="textarea" required value={this.state.reasons} rows={5} onChange={(e) => this.handleinputChange(e)} name="reasons" placeholder="Enter yor reasons for rejecting  this application" />
                            </Col>
                        </Form.Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ showReject: false })}>
                            Close
          </Button>
                        {reciepient.rejected === "off" ? <Button variant="primary" onClick={() => this.submitRejection(`${reciepient._id}`)}>
                            Reject
          </Button> : null}
                    </Modal.Footer>
                </Modal >

            </Layout >

        )
    }
}
const mapStateToProps = (state) => {
    return {
        reciepients: state.recipientData.reciepients,
        reciepient: state.recipientData.recipient,

    }

};

export default connect(mapStateToProps, { fetch, reject, postrecipient, validate, fetchOne })(withRouter(recipients));
