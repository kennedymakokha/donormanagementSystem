import React, { Component } from 'react'
import Layout from './Layout';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { Table, Modal, Col, Button, Badge } from 'react-bootstrap'

import { fetchapplicants } from './../axios/actions/applications'
import donations from './donations';


class myapplications extends Component {

    componentDidMount = async () => {
        await this.props.fetchapplicants()
        console.log(this.props.applicants)
    }
    render() {
        return (
            <Layout>
                <div className="content-container">
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>status</th>

                            </tr>
                        </thead>
                        <tbody>

                            {this.props.applicants === undefined ? null : this.props.applicants.map((dat, i) => (
                                <tr key={i}>
                                    <td>{dat.donation_id.name}</td>
                                    <td>{dat.category_id.name}</td>
                                    <td><Badge variant={`${dat.status}`}>{dat.status === "warning" ? "Panding" : dat.status === "secondary" ? "processing" : dat.status === "success" ? "approved" : dat.status === "danger" ? "disapproved" : null}</Badge></td>
                            
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Layout>
        )
    }
}
const mapStateToProps = (state) => {
    return {

        applicants: state.applicantsData.applicants,

    }

};

export default connect(mapStateToProps, { fetchapplicants })(withRouter(myapplications));
