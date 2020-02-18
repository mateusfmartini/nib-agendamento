import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Agenda from './screens/Agenda';
import Cadastro from './screens/Cadastro';
import Login from './screens/Login';
import * as serviceWorker from './serviceWorker';
import axios from 'axios'
import { baseApiUrl } from './global'
import { Router, Redirect } from 'react-router';
import { Route } from 'react-router-dom'
import history from './history'

class Routing extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.validateToken()
  }

  validateToken = async () => {

    const json = localStorage.getItem('userKey')
    const userData = JSON.parse(json)
    localStorage.setItem('userKey', null)

    if (!userData) {
      history.push("/")
    }

    const res = await axios.post(`${baseApiUrl}/validateToken`, userData)

    if (res.data) {
      localStorage.setItem('userKey', JSON.stringify(userData))
    } else {
      localStorage.removeItem('userKey')
      history.push("/")
    }

  }

  render() {
    return (
      <Router history={history} >
        <link rel="shortcut icon" href="./assets/icone.jpg" />
        <div>
          <Route path="/cadastro" component={Cadastro} />
          <Route path="/agenda" component={Agenda} />
          <Route exact path="/" component={Login} />
          <Redirect path="/agenda" />
        </div>
      </Router>
    )
  }
}
ReactDOM.render(<Routing />, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
