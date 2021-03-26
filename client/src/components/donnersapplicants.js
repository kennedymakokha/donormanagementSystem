import React, { Component } from 'react'
import Layout from './Layout';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { Table, Modal, Col, Button, Badge } from 'react-bootstrap'
import { fetchOne } from './../axios/actions/doner'
import { fetchOne as fetchappl } from './../axios/actions/applications'
import { authorised } from './../axios/actions/users'
class donnersapplicants extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    componentDidMount = async () => {
        await this.props.authorised(localStorage.getItem('user_id'))
        await this.props.fetchOne(this.props.user.donnerId)

        console.log(this.props.donor)
        const k = []

        var i;
        for (i = 0; i < this.props.donor.applicants.length; i++) {
            await this.props.fetchappl(this.props.donor.applicants[i])
            // console.log(this.props.user)
            k.push(this.props.applicant)
        }

        this.setState({ data: k })

    }
    render() {
        return (
            <Layout>
                <div className="content-container">
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data === undefined ? null : this.state.data.map((dat, i) => (
                                <tr key={i}>
                                    <td>{dat.surname}</td>
                                    <td>{dat.email}</td>
                                    <td>{dat.phone}</td>
                                    {/* <td>{dat.donation_id.name}</td>
                                    <td><Badge variant={`${dat.status}`}>{dat.status === "warning" ? "Panding" : dat.status === "secondary" ? "processing" : dat.status === "success" ? "approved" : dat.status === "danger" ? "disapproved" : null}</Badge></td>*/}
                                    <td> <Button variant="primary" className="float-right" style={{ marginBottom: '10px' }} >Donate</Button> </td>
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
        donor: state.donerData.doner,
        user: state.userData.user,
        applicant: state.applicantsData.applicant,
        Loading: state.donerData.loading
    }

};

export default connect(mapStateToProps, { fetchOne, authorised, fetchappl })(withRouter(donnersapplicants));
