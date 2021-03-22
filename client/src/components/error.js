import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faHome } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
export default class error extends Component {
    render() {
        return (
            // <div className="content-container">
            <div style={{ height: '100vh', backgroundColor: '#10104d', color: 'white', justifyContent: 'center', alignContent: 'center', alignItems: 'center', display: 'flex' }}>
                <div>
                    <h1 style={{ textAlign: 'center' }}>Error 404</h1>
                    <h6 style={{ textAlign: 'center' }}> The resource you are looking for does not exist</h6>
                    <a href='/' as Link to='/'><h6 style={{ textAlign: 'center' }} > <FontAwesomeIcon icon={faHome} />  Go back Home</h6></a>
                </div>
            </div>

            // </div>
        )
    }
}
