import React, { Component } from 'react'
import Layout from './Layout';
import './css/landing.css';
import { Image, Button, Modal } from 'react-bootstrap'
import Don from './imgs/bgImage.jpg'
import { connect } from 'react-redux'
import Dashboard from './dashboard'
import { fetch } from './../axios/actions/categories'
import { fetchdonationpercategory } from './../axios/actions/donations'
import { withRouter } from 'react-router-dom';
class landing extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            donations: [],
            show: false,
            category: {}
        }
    }
    getDonationDetails = async (data) => {
        await this.props.fetchdonationpercategory(`${data._id}`)
        this.setState({ donations: this.props.donations, category: data, show: true })

    }
    componentDidMount = async () => {
        await this.props.fetch()
        this.setState({ data: this.props.categories })
        // console.log(result.data)
    }
    render() {
        const { category, show, donations } = this.state
        console.log(donations)
        return (
            <Layout>
                <div className="content-container">
                    <div className='row landing-content'>
                        <div className='col-md-6 col-xs-12' >
                            <div className='home-details'>
                                <h1>Donate To Save Life</h1>
                                <p style={{ textAlign: 'center' }}> Doner Content Management System (CMS). Agents can register and manage donors easily</p>
                                <div className='buttons_Container'>
                                    <Button className='primarybtn'>Join Now</Button>
                                    <Button className='primarybtn'>Contact Us</Button>
                                </div>
                            </div>

                        </div>
                        <div className='col-md-6 col-xs-12 '>
                            <Image src={Don} className='donner_Image' style={{ objectFit: 'cover', height: '100%' }} />
                        </div>

                    </div>
                    <div className="doners-body">
                        <h2>Our Available Donors</h2>
                        <div className='row'>
                            {this.state.data.map((dat, i) => (
                                <div className="doner_Item col-md-3" key={i}>
                                    <h2>{dat.name}</h2>
                                    <Button className='primarybtn' onClick={() => this.getDonationDetails(dat)}>View all</Button>
                                </div>
                            ))}

                        </div>

                    </div>
                </div>
                    <Modal
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        show={show} onHide={() => this.setState({ show: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ textAlign: 'center' }}>Donation Under {category.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul>
                            {donations.map((cat, i) => (
                                <li key={i}>{cat.name}</li>
                            ))}
                        </ul>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ show: false })}>
                            Close
</Button>
                    </Modal.Footer>
                </Modal>

            </Layout>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        categories: state.categoryData.categories,
        donations: state.donationData.donations
    }

};

export default connect(mapStateToProps, { fetch, fetchdonationpercategory })(withRouter(landing));
