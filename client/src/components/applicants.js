import React, { Component } from 'react'
import Layout from './Layout';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { Table, Modal, Col, Button, Badge } from 'react-bootstrap'
import { fetch, approve } from './../axios/actions/applications'
import { base } from './../axios/actions/baseUrl'
import axios from 'axios'
class applicants extends Component {
    constructor(props) {
        super(props)
        this.state = {
            category: {},
            data: []

        }
    }

    approveit = async (data) => {
        await this.props.approve(data._id)
        const k = await axios.get(`${base}/applications-list`)

        this.setState({ data: k.data.Applications })
    }

    componentDidMount = async () => {

        const k = await axios.get(`${base}/applications-list`)

        this.setState({ data: k.data.Applications })



    }

    render() {
        console.log(this.state.data)
        return (
            <Layout>
                <div className="content-container">
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Donation Applied</th>
                                <th>status</th>
                                <th>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {/* {this.state.data.map((dat, i) => (
                                <tr key={i}>
                                    <td>{dat.applicants_id.surname}</td>
                                    <td>{dat.category_id.name}</td>
                                    <td>{dat.donation_id.name}</td>
                                    <td><Badge variant={`${dat.status}`}>{dat.status === "warning" ? "Panding" : dat.status === "secondary" ? "processing" : dat.status === "success" ? "approved" : dat.status === "danger" ? "disapproved" : null}</Badge></td>
                                    <td>{dat.status === "warning" ? <Button variant={dat.approved === "off" ? "primary" : "secondary"} className="float-right" style={{ marginBottom: '10px' }} onClick={() => this.approveit(dat)}>{dat.approved === "off" ? "Approve" : "Pending"}</Button> : null}</td>
                                </tr>
                            ))} */}

                        </tbody>
                    </Table>
                </div>
            </Layout >
        )
    }
}
const mapStateToProps = (state) => {
    return {
        applicants: state.applicantsData.applicants,
        Loading: state.applicantsData.loading
    }

};

export default connect(mapStateToProps, { fetch, approve })(withRouter(applicants));
