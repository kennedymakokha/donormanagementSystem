import React, { Component } from 'react'
import './css/notification.css'
import checkIcon from './assets/check.svg';
import errorIcon from './assets/error.svg';
import infoIcon from './assets/info.svg';
import warningIcon from './assets/warning.svg';
export default class toast extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [

                {
                    id: 3,
                    title: 'Info',
                    description: 'This is an info toast component',
                    backgroundColor: '#5bc0de',
                    icon: infoIcon
                },
                {
                    id: 4,
                    title: 'Warning',
                    description: 'This is a warning toast component',
                    backgroundColor: '#f0ad4e',
                    icon: warningIcon
                }]

        }
    }
    componentDidMount = () => {
        // this.setState
    }
    render() {
        const { position, show, message, variant, hideToast } = this.props;
       
        return (
            <div className={`notification-container ${position}`} >

                <div

                    className={`notification toast ${show} ${position} ${variant}`}

                >
                    <button onClick={() => hideToast()}>
                        X
                            </button>
                    <div className="notification-image">
                        <img src={variant === 'danger' ? errorIcon : checkIcon} alt="" />
                    </div>
                    <div >
                        <p className="notification-title" >{variant === 'danger' ? 'Error' : 'Success'}</p>
                        <p className="notification-message" >
                            {message}
                        </p>
                    </div>
                </div>

            </div>
        )
    }
}
