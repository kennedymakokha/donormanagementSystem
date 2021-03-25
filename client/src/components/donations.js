import React, { Component } from 'react'
import Layout from './Layout';
import { Table, Modal, Col, Button, Form } from 'react-bootstrap'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { authorised } from './../axios/actions/users'
import { fetchdonations, post, fetchdonationpercategory, deleteDonation, EditDonation } from './../axios/actions/donations'
import { fetchOne as fetchOneDonner } from './../axios/actions/doner'
import { post as postapplication } from './../axios/actions/applications'
import { fetchOne } from './../axios/actions/recipient'
import { fetch, fetchOne as fetchOneCategory } from './../axios/actions/categories'
import Toast from './toast'
import toastify from './toastify'
import Load from './loader'
class doners extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            show: false,
            showadd: false,
            categories: [],
            category_id: '',
            name: '',
            showApply: false,
            loading: true,
            showDelete: false,
            item: {},
            showedit: false,
            category: {}
        }
    }

    handleinputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value

        })
    }
    hideToast = () => {
        this.setState({ show: 'notification-hide' })
    }

    submit = async () => {
        try {
            const { name, category_id } = this.state
            const data = { name, category_id }
            const results = await this.props.post(data)
            await this.props.fetchdonations()
            this.setState({ show: false, data: this.props.donations, })
            const j = toastify(`${results.data.message}`, 'success')
            this.setState({ show: 'notification-show', showadd: false, message: j.message, variant: j.variant })

        } catch (error) {
            const j = toastify(`${error.response.data.message}`, 'danger')
            this.setState({
                show: 'notification-show', message: j.message, variant: j.variant
            })
        }
    }
    delete = async () => {
        try {
            const id = this.state.item._id
            await this.props.deleteDonation(id)
            await this.props.fetchdonations()
            this.setState({ data: this.props.donations, showDelete: false })
            // const j = toastify(`${result.data.message}`, 'success')
        } catch (error) {

        }

    }

    ShowDel = (del) => {
        this.setState({ showDelete: true, item: del })
    }
    openEdit = async (del) => {
        const k = await this.props.fetchOneCategory(del.category_id._id)
        this.setState({ showedit: true, name: del.name, item: del })
    }
    openApply = async (data) => {
        this.setState({ showApply: true, item: data, category: data.category_id })

    }
    apply = async () => {
        try {
            const { category, item } = this.state
            const data = {
                category_id: category._id, donation_id: item._id, applicants_id: localStorage.getItem('user_id')
            }
            const result = await this.props.postapplication(data)
            const j = toastify(`${result.data.message}`, 'success')
            this.setState({
                show: 'notification-show', message: j.message, variant: j.variant, showApply: false
            })

        } catch (error) {
            const j = toastify(`${error.response.data.message}`, 'danger')
            this.setState({
                show: 'notification-show', message: j.message, variant: j.variant
            })
        }

    }

    submitEdit = async () => {

        try {
            const data = { name: this.state.name, id: this.state.item._id, category_id: this.props.category._id }
            await this.props.EditDonation(data)
            await this.props.fetchdonations()
            this.setState({ data: this.props.donations, showedit: false })
        } catch (error) {

        }
    }
    componentDidMount = async () => {
        const uid = localStorage.getItem('user_id');
        await this.props.authorised(uid)
        if (localStorage.getItem('role') === 'reciever') {
            if (this.props.user.recieverId !== undefined) {
                const k = await this.props.fetchOne(this.props.user.recieverId)
                const j = await this.props.fetchdonationpercategory(k.category._id)
                this.setState({ data: this.props.donations, loading: this.props.categoryLoading })
            }



        } else if (localStorage.getItem('role') === 'donner') {
            await this.props.fetchOneDonner(`${this.props.user.donnerId}`)
            this.setState({ data: this.props.donner.donations, loading: this.props.donerLoading })
        } else {
            await this.props.fetch()
            await this.props.fetchdonations()

            this.setState({ data: this.props.donations, categories: this.props.categories, loading: this.props.donationsLoader })
        }


    }

    render() {
        const { categories, showadd, showApply, loading, showDelete, item, showedit } = this.state
        return (
            <Layout >

                <Toast position="bottom-left" message={this.state.message} hideToast={() => this.hideToast()} show={this.state.show} variant={this.state.variant} />
                {loading ? <Load /> : <div className="content-container">
                    <h4 style={{ textAlign: 'center' }}>Funded Donations </h4>
                    {localStorage.getItem('role') === 'admin' ? <Button variant="primary" className="float-right" style={{ marginBottom: '10px' }} onClick={() => this.setState({ showadd: true })}>Add</Button> : null}
                    {localStorage.getItem('role') === 'donner' ? <Button variant="primary" className="float-right" style={{ marginBottom: '10px' }} onClick={() => this.setState({ showaddmore: true })}>Add</Button> : null}
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                {localStorage.getItem('role') === 'donner' ? null : <th>Category</th>}
                                {localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'reciever' ? <th>Action</th> : null}

                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map((dat, i) => (
                                <tr key={i}>
                                    <td>{dat.name}</td>
                                    {localStorage.getItem('role') === 'donner' ? null : <td>{dat.category_id.name}</td>}
                                    {localStorage.getItem('role') === 'reciever' ? <td style={{ display: 'flex', justifyContent: 'flex-end', }}><Button variant="primary" onClick={() => this.openApply(dat)}>Apply </Button></td> : null}
                                    {localStorage.getItem('role') === 'admin' ? <td style={{ display: 'flex', justifyContent: 'space-between', }}><Button variant="primary" onClick={() => this.openEdit(dat)}>Edit</Button>  <Button variant="danger" onClick={() => this.ShowDel(dat)}>Delete</Button></td> : null}

                                </tr>
                            ))}

                        </tbody>
                    </Table>
                </div>}
                <Modal
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={() => this.setState({ showadd: false })}
                    show={showadd} >
                    <Modal.Header closeButton>
                        <Modal.Title style={{ textAlign: 'center' }}>Register New Donation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Row>
                            <Col>
                                <div className="inputContainer">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" onChange={(e) => this.handleinputChange(e)} name="name" placeholder="Enter Name" />
                                </div>
                            </Col>
                            <Col>
                                <div className="inputContainer">
                                    <Form.Label>Donation Category</Form.Label>
                                    <Form.Control as="select" name="category_id" onChange={(e) => this.handleinputChange(e)}>
                                        <option>Kindly select category</option>
                                        {categories.map((category, i) => (
                                            <option value={category._id} key={i}>{category.name}</option>
                                        ))}
                                    </Form.Control>
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
                    size="md"
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
                                    <Form.Control type="text" value={this.state.name} onChange={(e) => this.handleinputChange(e)} name="name" placeholder="Enter Name" />
                                </div>
                            </Col>
                            <Col>
                                <div className="inputContainer">
                                    <Form.Label>Donation Category</Form.Label>
                                    <Form.Control as="select" name="category_id" onChange={(e) => this.handleinputChange(e)}>
                                        <option value={this.props.category._id}>{this.props.category.name}</option>
                                        {categories.map((category, i) => (
                                            <option value={category._id} key={i}>{category.name}</option>
                                        ))}
                                    </Form.Control>
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


                <Modal
                    show={showApply}
                    onHide={() => this.setState({ showApply: false })}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Apply for {item.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5><u>{this.state.category.name}</u></h5>
                        {item.name}  is a donation ......?

        </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ showApply: false })}>
                            Close
          </Button>
                        <Button variant="primary" onClick={() => this.apply()}>Apply Now</Button>
                    </Modal.Footer>
                </Modal>

            </Layout>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        categories: state.categoryData.categories,
        category: state.categoryData.category,
        categoryLoading: state.categoryData.loading,
        donations: state.donationData.donations,
        donationsLoader: state.donationData.loading,
        donner: state.donerData.doner,
        user: state.userData.user,
        donerLoading: state.donerData.loading
    }

};

export default connect(mapStateToProps, { fetch, authorised, postapplication, EditDonation, fetchOneCategory, deleteDonation, fetchOneDonner, fetchdonations, fetchdonationpercategory, fetchOne, post })(withRouter(doners));
// export default doners