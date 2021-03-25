import React, { Component } from 'react'
import './css/layout.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMailBulk, faPhone, } from '@fortawesome/free-solid-svg-icons'
import { Button, Nav, Navbar, Row, Image, Modal, Form, Col, NavDropdown, Dropdown } from "react-bootstrap"
import DatePicker from "react-datepicker";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import "react-datepicker/dist/react-datepicker.css";
import Logo from './imgs/oCtalogo.png'
import NoImage from './imgs/noimage.jpg'
import { connect } from 'react-redux'
import { loginUser, authorised, logout } from './../axios/actions/users'
import { fetch } from './../axios/actions/categories'
import { fetchdonations } from './../axios/actions/donations'
import { post as postdoner } from './../axios/actions/doner'
import { post as postrecipient } from './../axios/actions/recipient'
import { withRouter } from 'react-router-dom';
import Toast from './toast'
import toastify from './toastify'


const animatedComponents = makeAnimated();


class Layout extends Component {

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            showdoner: false,
            email: '',
            password: '',
            password_confirm: '',
            user: {},
            role: '',
            data: [],
            auth: false,
            name: '',
            mobile: '',
            dob: new Date(),
            area: '',
            contact: '',
            contact_phone: '',
            comp: false,
            showrecepient: '',
            type: 'individual',
            funds: '',
            registrationNo: '',
            category: '',
            country: '',
            physical_address: '',
            postal_address: '',
            postal_code: '',
            tel: '',
            tax_cert: '',
            donations: [],
            donation: [],
            value: '',
            toast: true,
            message: '',
            variant: '',
            showlogin: false


        }
    }

    handleinputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value

        })
    }
    showToast = () => {
        const j = toastify('pass', 'danger')
        this.setState({ show: 'notification-show', message: j.message, variant: j.variant })
    }
    hideToast = () => {
        this.setState({ show: 'notification-hide' })
    }
    handleFile = (e) => {
        this.setState({
            tax_cert: e.target.files[0]
        })
    }
    setStartDate = (d) => {
        this.setState({
            dob: d
        })
    }

    captureSelectValue = (e) => {
        const { donations } = this.state

        var i;
        for (i = 0; i < e.length; i++) {
            donations.push(e[i].value)
        }
    }
    logout = async () => {
        this.props.logout()
        localStorage.clear()
        this.setState({
            user: {},
            auth: this.props.auth,
            role: '',

        })
        return this.props.history.push('/');
    }
    login = async () => {

        try {

            const { email, password } = this.state
            const data = { email, password }
            await this.props.loginUser(data)
            const j = toastify(`Loged in Succesfully`, 'success')
            this.setState({
                user: this.props.user,
                showlogin: false,
                auth: this.props.auth,
                role: this.props.user.role,
                show: 'notification-show', message: j.message, variant: j.variant
            })



        } catch (error) {
            const j = toastify(`${error.response.data.message}`, 'danger')
            this.setState({
                show: 'notification-show', message: j.message, variant: j.variant
            })
        }

    }
    RegisterDoner = async () => {

        try {

            const { name, email, mobile, donations, registrationNo, password_confirm, dob, area, contact, contact_phone, password } = this.state

            const data = { name, email, donations, registrationNo, password_confirm, mobile, dob, area, contact, contact_phone, password }
            const results = await this.props.postdoner(data)
            const j = toastify(`${results.data.message}`, 'success')
            this.setState({ showdoner: false, show: 'notification-show', message: j.message, variant: j.variant })

        } catch (error) {
            const j = toastify(`${error.response.data.message}`, 'danger')
            this.setState({
                show: 'notification-show', message: j.message, variant: j.variant
            })

        }

    }
    RegisterRecipient = async () => {
        try {
            const { type, name, funds, category, country, tax_cert, email, physical_address, registrationNo, postal_address, postal_code, tel, } = this.state
            const data = { type, name, funds, category, tax_cert, email, password: 'password123', registrationNo, country, physical_address, postal_address, postal_code, tel }
            const result = await this.props.postrecipient(data)
            this.setState({ showrecepient: false })
            const j = toastify(`${result.data.message}`, 'success')
            this.setState({ showdoner: false, show: 'notification-show', message: j.message, variant: j.variant })


        } catch (error) {
            const j = toastify(`${error.response.data.message}`, 'danger')
            this.setState({
                show: 'notification-show', message: j.message, variant: j.variant
            })
        }


    }
    componentDidMount = async () => {
        let id = localStorage.getItem('user_id');
        let token = localStorage.getItem('token');
        if (id) {
            let auth = await this.props.authorised(id, token)
            if (auth) {
                this.setState({ user: this.props.user, role: this.props.user.role })
            }
        }
        await this.props.fetch();
        await this.props.fetchdonations();
        this.setState({ data: this.props.categories, donation: this.props.donations })

    }
    render() {
        const { showlogin, showdoner, comp, showrecepient, donation, type, data } = this.state

        const options = []
        donation.map(i => (
            options.push({ value: `${i._id}`, label: `${i.name}` })
        ))


        return (

            <div className="cont" >
                <Toast position="bottom-left" message={this.state.message} hideToast={() => this.hideToast()} show={this.state.show} variant={this.state.variant} />
                <div className="navigation-container row">
                    <div className="navigation-left col-md-6 col-xs-12">
                        <h5><FontAwesomeIcon icon={faMailBulk} />support@octagonltd.co.ke </h5> <h5><FontAwesomeIcon icon={faPhone} /> +254 713 361005</h5>
                    </div>

                    <div className="navigation-right col-md-6 col-xs-12">

                        {!this.props.auth ? <Button className='primarybtn' onClick={() => this.setState({ showlogin: true })}>Login</Button> : <> <h5 style={{ paddingTop: "10px", textTransform: 'capitalize' }}>{this.props.user.role === "admin" ? this.props.user.firstname : null} {this.props.user.surname}  </h5>
                            <Dropdown>
                                <Dropdown.Toggle variant="success" style={{ backgroundColor: 'transparent', border: 'none' }} id="dropdown-basic">
                                    <Image src={this.props.user.avatar ? `${this.props.user.avatar}` : `${NoImage}`} rounded height={35} width={35} style={{ borderRadius: '35px' }} />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-1">Profile</Dropdown.Item>
                                    {/* <Dropdown.Item href="#/action-2">Another action</Dropdown.Item> */}
                                    <Dropdown.Item onClick={() => this.logout()}>Log out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <div >

                                <div className="logout">
                                    <Button className='primarybtn' variant='link' onClick={() => this.logout()}>Logout</Button>
                                </div>
                            </div>
                        </>}
                    </div>
                </div>

                <Navbar collapseOnSelect expand="lg" bg="light" variant="light" className="nav-container" >
                    <Navbar.Brand to="/" href="/" >
                        <Image src={Logo} height="50px" /><span style={{ color: '#950098' }}>Octagon</span> <span style={{ color: '#009893' }}>Dynamics</span></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link to="/" href="/">{!localStorage.getItem('token') ? 'Home' : 'Dashboard'}</Nav.Link>
                            {!localStorage.getItem('token') ? <Nav.Link to="/about-us" href="/about-us">About</Nav.Link> : null}
                            {this.props.user.role === "admin" ? <Nav.Link to="/donations-categories" href="/donations-categories">Donation Categories</Nav.Link> : null}
                            {this.props.user.role === "admin" ? <Nav.Link to="/donations-view" href="/donations-view">Donations</Nav.Link> : null}
                            {this.props.user.role === "admin" ? <Nav.Link to="/recipients" href="/recipients">Recipients</Nav.Link> : null}
                            {this.props.user.role === "admin" ? <Nav.Link to="/applicants" href="/applicants">Applicants</Nav.Link> : null}
                            {this.props.user.role === "admin" ? <Nav.Link to="/doners-view" href="/doners-view">Donors</Nav.Link> : null}
                            {this.props.user.role === "reciever" ? <Nav.Link to="/donations-view" href="/donations-view">Available donations</Nav.Link> : null}
                            {this.props.user.role === "donner" ? <Nav.Link to="/donations-view" href="/donations-view">My donations</Nav.Link> : null}
                            {this.props.user.role === "donner" ? <Nav.Link to="/donor-applicants" href="/donor-applicants">My Applicants</Nav.Link> : null}

                            {!localStorage.getItem('token') ? <Nav.Link to="/blogs" href="/blogs">Blog</Nav.Link> : null}
                            {!localStorage.getItem('token') ? <Nav.Link to="/contact-us" href="/contact-us">Contact</Nav.Link> : null}
                        </Nav>
                        {!this.props.auth ? <Nav>
                            {/* <Nav.Link href="#deets">More deets</Nav.Link> */}
                            <Nav.Link eventKey={2}>
                                <Button className='primarybtn' onClick={() => this.setState({ showdoner: true })}> Donor</Button>
                            </Nav.Link>
                            <Nav.Link eventKey={2}>
                                <Button className='secondaryybtn' onClick={() => this.setState({ showrecepient: true })}>Recipient</Button>
                            </Nav.Link>
                        </Nav> : null}
                    </Navbar.Collapse>

                </Navbar>
                { this.props.children}
                <div className='footer' >
                    <Row>
                        <Col>
                            <h3>Who We Are?</h3>
                        </Col>
                        <Col >
                            <h3>Follow Us</h3>
                        </Col>
                        <Col><h3>Contact Us</h3></Col>
                    </Row>
                </div>

                <Modal show={showlogin} onHide={() => this.setState({ showlogin: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ textAlign: 'center' }}>Login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="inputContainer">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" onChange={(e) => this.handleinputChange(e)} name="email" placeholder="Enter email" />
                        </div>
                        <div className="inputContainer">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" onChange={(e) => this.handleinputChange(e)} name="password" placeholder="password" />
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ showlogin: false })}>
                            Close
          </Button>
                        <Button variant="primary" onClick={() => this.login()}>
                            Login
          </Button>
                    </Modal.Footer>
                </Modal>
                <Modal
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={showdoner} onHide={() => this.setState({ showdoner: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ textAlign: 'center' }}>Register Donor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Row>
                            <Col>
                                <div className="inputContainer">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" onChange={(e) => this.handleinputChange(e)} name="name" placeholder={comp ? `Enter Company Name` : `Enter your Name`} />
                                </div>
                            </Col>
                            <Col>
                                <div className="inputContainer">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" onChange={(e) => this.handleinputChange(e)} name="email" placeholder={comp ? `Enter Company email` : `Enter your email`} />
                                </div>
                            </Col>

                        </Form.Row>

                        <Form.Row>
                            <Col>
                                <div className="inputContainer">
                                    <Form.Label>Mobile</Form.Label>
                                    <Form.Control type="text" onChange={(e) => this.handleinputChange(e)} name="mobile" placeholder="Enter Phone" />
                                </div>
                            </Col>
                            <Col>
                                {!comp ? <div className="inputContainer">
                                    <Form.Label>D.O.B </Form.Label><br />
                                    <DatePicker selected={this.state.dob} onChange={date => this.setStartDate(date)} />
                                </div> : <div className="inputContainer">
                                    <Form.Label>Company Registration Year</Form.Label><br />
                                    <DatePicker selected={this.state.dob} onChange={date => this.setStartDate(date)} />
                                </div>}
                            </Col>
                        </Form.Row>

                        {comp ? <Form.Row>
                            <Col>
                                <div className="inputContainer">
                                    <Form.Label>Mobile</Form.Label>
                                    <Form.Control type="text" onChange={(e) => this.handleinputChange(e)} name="mobile" placeholder="Enter Phone" />
                                </div>
                            </Col>
                            <Col>
                                <div className="inputContainer">
                                    <Form.Label>Area</Form.Label><br />
                                    <Form.Control type="text" onChange={(e) => this.handleinputChange(e)} name="area" placeholder="Enter email" />
                                </div>
                            </Col>
                        </Form.Row> : null}

                        <Form.Row>

                            <Col>
                                <div className="inputContainer">
                                    <Form.Label>Donations</Form.Label><br />
                                    <Select
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        defaultValue={[]}
                                        isMulti
                                        onChange={(e) => this.captureSelectValue(e)}
                                        options={options}
                                    />
                                </div>
                            </Col>
                            <Col>
                                <div className="inputContainer">
                                    <Form.Label>Area</Form.Label><br />
                                    <Form.Control type="text" onChange={(e) => this.handleinputChange(e)} name="area" placeholder="Enter area" />
                                </div>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <div className="inputContainer">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" onChange={(e) => this.handleinputChange(e)} name="password" placeholder="password" />
                                </div>
                            </Col>

                            <Col>
                                <div className="inputContainer">
                                    <Form.Label>Password Confirm</Form.Label><br />
                                    <Form.Control type="password" onChange={(e) => this.handleinputChange(e)} name="password_confirm" placeholder="Enter password confirm" />
                                </div>
                            </Col>
                        </Form.Row>


                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ showdoner: false })}>
                            Close
          </Button>
                        <Button variant="primary" onClick={() => this.RegisterDoner()}>
                            submit
          </Button>
                    </Modal.Footer>
                </Modal>
                <Modal
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={showrecepient} onHide={() => this.setState({ showrecepient: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ textAlign: 'center' }}>Register new Recipient</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form action="" method="post" encType="multipart/form-data">
                            <Form.Row>
                                <Col>
                                    <div className="inputContainer">
                                        <Form.Label>Type</Form.Label>
                                        <Form.Control as="select" name="type" onChange={(e) => this.handleinputChange(e)}>
                                            <option>Kindly select type of reciepient</option>
                                            <option value="organisation">Organisation</option>
                                            <option value="individual">Individual</option>
                                        </Form.Control>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="inputContainer">
                                        <Form.Label>{type === 'individual' ? "Name" : "Organisation Name"}</Form.Label>
                                        <Form.Control type="text" onChange={(e) => this.handleinputChange(e)} name="name" placeholder={comp ? `Enter Company Name` : `Enter your Name`} />
                                    </div>
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                <Col>
                                    <div className="inputContainer">
                                        <Form.Label>{type === 'individual' ? "Email" : "Organisation Email address"}</Form.Label>
                                        <Form.Control type="email" onChange={(e) => this.handleinputChange(e)} name="email" placeholder={comp ? `Enter Company email address` : `Enter your email address`} />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="inputContainer">
                                        <Form.Label>{type === 'individual' ? "Identification Number" : "Organisation Registration Number"}</Form.Label>
                                        <Form.Control type="text" onChange={(e) => this.handleinputChange(e)} name="registrationNo" placeholder={comp ? `Enter Company PIN No` : `Enter ID No`} />
                                    </div>
                                </Col>

                            </Form.Row>

                            <Form.Row>
                                <Col>
                                    <div className="inputContainer">
                                        <Form.Label>Source of funds </Form.Label>
                                        <Form.Control as="select" name="funds" onChange={(e) => this.handleinputChange(e)}>
                                            <option>Kindly select your source of funds </option>
                                            <option value="government">Government</option>
                                            <option value="donors">Donors</option>
                                            <option value="grands">Grants</option>

                                        </Form.Control>
                                    </div>
                                </Col>
                                <Col>
                                    <Form.Label>Country </Form.Label>
                                    <Form.Control as="select" name="country" onChange={(e) => this.handleinputChange(e)}>
                                        <option>Kindly select your country</option>
                                        <option value="kenya">Kenya</option>
                                        <option value="ethiopia">Ethiopia</option>
                                        <option value="tanzania">Tanzania</option>

                                    </Form.Control>
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                <Col>
                                    <div className="inputContainer">
                                        <Form.Label>Physical Address</Form.Label>
                                        <Form.Control type="text" onChange={(e) => this.handleinputChange(e)} name="physical_address" placeholder="Enter physical address eg Kenya" />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="inputContainer">
                                        <Form.Label>Postal Address</Form.Label><br />
                                        <Form.Control type="text" onChange={(e) => this.handleinputChange(e)} name="postal_address" placeholder="Enter postal address  " />
                                    </div>
                                </Col>

                            </Form.Row>
                            <Form.Row>

                                <Col>
                                    <div className="inputContainer">
                                        <Form.Label>Postal Code</Form.Label><br />
                                        <Form.Control type="text" onChange={(e) => this.handleinputChange(e)} name="postal_code" placeholder="Enter postal code" />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="inputContainer">
                                        <Form.Label>Telephone</Form.Label>
                                        <Form.Control type="text" onChange={(e) => this.handleinputChange(e)} name="tel" placeholder="Enter Phone Number" />
                                    </div>
                                </Col>

                            </Form.Row>
                            <Form.Row>
                                <Col>
                                    <div className="inputContainer">
                                        <Form.Label>Donation Category</Form.Label>
                                        <Form.Control as="select" name="category" onChange={(e) => this.handleinputChange(e)}>
                                            <option>Kindly select donation  category</option>
                                            {data.map((category, i) => (
                                                <option value={category._id} key={i}>{category.name}</option>
                                            ))}
                                        </Form.Control>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="inputContainer">
                                        <Form.Label>Tax compliance Cert</Form.Label><br />
                                        <Form.Control type="file" onChange={(e) => this.handleFile(e)} name="tax_cert" />
                                    </div>
                                </Col>

                            </Form.Row>

                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ showrecepient: false })}>
                            Close
          </Button>
                        <Button variant="primary" onClick={() => this.RegisterRecipient()}>
                            Submit
          </Button>
                    </Modal.Footer>
                </Modal>

            </div >
        )
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.userData.user,
        auth: state.userData.authorised,
        categories: state.categoryData.categories,
        donations: state.donationData.donations
    }

};

export default connect(mapStateToProps, { loginUser, authorised, fetch, fetchdonations, postdoner, postrecipient, logout })(withRouter(Layout));