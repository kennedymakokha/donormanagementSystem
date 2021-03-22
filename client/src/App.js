import React, { Component } from 'react'
import Store from './axios/store'
import { Provider } from "react-redux";
import Landing from './components/landing'
import Doners from './components/doners'
import Recipient from './components/recipients'
import Category from './components/donationTypes'
import Donations from './components/donations'
import About from './components/about'
import Error from './components/error'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
export default class App extends Component {
  render() {
    return (
      <div>
        <Provider store={Store}>
          <Router >
            <Switch>
              <Route path="/" exact component={Landing} />
              <Route path="/doners" exact component={Doners} />
              <Route path="/recipients" exact component={Recipient} />
              <Route path="/donations" exact component={Donations} />
              <Route path="/donations-categories" exact component={Category} />
              <Route path="/about-us" exact component={About} />
              <Route exact component={Error} />
            </Switch>
          </Router>
        </Provider>
      </div>
    )
  }
}
