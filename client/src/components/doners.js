import React, { Component } from 'react'
import Layout from './Layout';
import { Table } from 'react-bootstrap'
import { connect } from 'react-redux'
import { fetch } from './../axios/actions/doner'
import { withRouter } from 'react-router-dom';

class doners extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }
    componentDidMount = async () => {
        if (localStorage.getItem('role') !== 'admin') {
            return this.props.history.push('/');

        }
        await this.props.fetch()
        this.setState({ data: this.props.doners })

    }
    render() {
        return (
            <Layout >
                <div className="content-container">
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>

                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact </th>
                                <th>Area </th>
                                <th>Donations </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map((dat, i) => (
                                <tr key={i}>
                                    <td>{dat.name}</td>
                                    <td>{dat.email}</td>
                                    <td>{dat.mobile}</td>
                                    <td>{dat.area}</td>
                                    <td>
                                        {dat.donations.map((don, i) => (
                                            <li key={i}>{don.name}</li>
                                        ))}
                                    </td>
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
        doners: state.donerData.doners,

    }

};

export default connect(mapStateToProps, { fetch })(withRouter(doners));
