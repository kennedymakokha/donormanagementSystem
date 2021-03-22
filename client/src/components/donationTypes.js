import React, { Component } from 'react'
import Layout from './Layout';
import { Table, Modal, Col, Button, Form } from 'react-bootstrap'
import { connect } from 'react-redux'
import { fetch, post, deleteType, EditType } from './../axios/actions/categories'
import { withRouter } from 'react-router-dom';
import Toast from './toast'
import Loader from './loader'
import toastify from './toastify'
class donationType extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            show: false,
            showadd: false,
            name: '',
            showDelete: false,
            item: {},
            showedit: false
        }
    }
    handleinputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value

        })
    }
    submit = async () => {
        try {
            const { name } = this.state
            const data = { name }
            const result = await this.props.post(data)
            await this.props.fetch()
            this.setState({ data: this.props.categories })
            const j = toastify(`${result.data.message}`, 'success')
            this.setState({ show: 'notification-show', message: j.message, variant: j.variant, showadd: false })

        } catch (error) {
            const j = toastify(`${error.response.data.message}`, 'danger')
            this.setState({
                show: 'notification-show', message: j.message, variant: j.variant, showadd: false
            })
        }
    }
    delete = async () => {
        try {
            const id = this.state.item._id
            await this.props.deleteType(id)
            await this.props.fetch()
            this.setState({ data: this.props.categories, showDelete: false })
            // const j = toastify(`${result.data.message}`, 'success')
        } catch (error) {

        }

    }
    hideToast = () => {
        this.setState({ show: 'notification-hide' })
    }
    ShowDel = (del) => {
        this.setState({ showDelete: true, item: del })
    }
    openEdit = (del) => {
        this.setState({ showedit: true, name: del.name, item: del })
    }
    submitEdit = async () => {

        try {
            const data = { name: this.state.name, id: this.state.item._id }
            await this.props.EditType(data)
            await this.props.fetch()
            this.setState({ data: this.props.categories, showedit: false })
        } catch (error) {

        }
    }

    componentDidMount = async () => {
        if (localStorage.getItem('role') !== 'admin') {
            return this.props.history.push('/')
        }
        await this.props.fetch()

        this.setState({ data: this.props.categories })

    }
    render() {
        const { showadd, showDelete, item, showedit } = this.state
        return (
            <Layout >
                <Toast position="top-left" message={this.state.message} hideToast={() => this.hideToast()} show={this.state.showadd} variant={this.state.variant} />
                {this.props.loading ? <Loader /> : <div className="content-container">
                    <Button variant="primary" className="float-right" style={{ marginBottom: '10px' }} onClick={() => this.setState({ showadd: true })}>Add</Button>
                    <Table striped bordered hover size="sm">

                        <thead>
                            <tr>
                                <th>Name</th>
                                <th style={{ width: '20%' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map((dat, i) => (
                                <tr key={i}>
                                    <td>{dat.name}</td>
                                    <td style={{ display: 'flex', justifyContent: 'space-between', }}><Button variant="primary" onClick={() => this.openEdit(dat)}>Edit</Button>  <Button variant="danger" onClick={() => this.ShowDel(dat)}>Delete</Button></td>
                                </tr>
                            ))}

                        </tbody>
                    </Table>
                </div>}
                <Modal

                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={showadd} >
                    <Modal.Header closeButton>
                        <Modal.Title style={{ textAlign: 'center' }}>Register New Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Row>
                            <Col>
                                <div className="inputContainer">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" onChange={(e) => this.handleinputChange(e)} name="name" placeholder="Enter your Name" />
                                </div>
                            </Col>

                        </Form.Row>


                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ showadd: false })}>
                            Close
          </Button>
                        <Button variant="primary" onClick={() => this.submit()}>
                            submit
          </Button>
                    </Modal.Footer>
                </Modal>

                <Modal

                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={showedit} >
                    <Modal.Header closeButton>
                        <Modal.Title style={{ textAlign: 'center' }}>Edit {item.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Row>
                            <Col>
                                <div className="inputContainer">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" value={this.state.name} onChange={(e) => this.handleinputChange(e)} name="name" placeholder="Enter your Name" />
                                </div>
                            </Col>

                        </Form.Row>


                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ showedit: false })}>
                            Close
</Button>
                        <Button variant="primary" onClick={() => this.submitEdit()}>
                            submit
</Button>
                    </Modal.Footer>
                </Modal>


                <Modal
                    show={showDelete}
                    onHide={() => this.setState({ showDelete: false })}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Delete {item.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to Delete {item.name} ?
        </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ showDelete: false })}>
                            Close
          </Button>
                        <Button variant="danger" onClick={() => this.delete()}>Delete</Button>
                    </Modal.Footer>
                </Modal>

            </Layout>
        )
    }
}

const mapStateToProps = (state) => {
    return {

        categories: state.categoryData.categories,
        loading: state.categoryData.loading,

    }

};

export default connect(mapStateToProps, { fetch, EditType, post, deleteType })(withRouter(donationType));