import React, { Component } from 'react'
import { Link } from 'react-router-dom'
export default class dashboard extends Component {
    render() {
        return (
            <div className="content-container" style={{ height: '70vh' }}>
                <div className="row">
                    <Link to='/admin/employees'>
                        <div className="-md4 -xs6 ">
                            Kennedy
                        </div>
                    </Link>
                    <Link to='/admin/employees'>
                        <div className="-md4 -xs6 ">
                            Kennedy
                        </div>
                    </Link>
                    <Link to='/admin/employees'>
                        <div className="-md4 -xs6 ">
                            Kennedy
                        </div>
                    </Link>
                    <Link to='/admin/employees'>
                        <div className="-md4 -xs6 ">
                            Kennedy
                        </div>
                    </Link>

                </div>
            </div>
        )
    }
}
