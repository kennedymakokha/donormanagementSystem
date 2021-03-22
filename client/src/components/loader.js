import React, { Component } from 'react'
import { Spinner } from 'react-bootstrap'
export default class loader extends Component {
    render() {
        return (
            <div className="content-container" style={{ height: '70vh', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                <div  >
                    <Spinner animation="border" size="xl" style={{color:'#10104d' }}/>
                    {/* <h3 style={{textAlign:'center'}}>Loading</h3> */}
                </div>
            </div>
        )
    }
}
