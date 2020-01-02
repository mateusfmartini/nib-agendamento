import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Agenda from './screens/Agenda';
import Cadastro from './screens/Cadastro';
import * as serviceWorker from './serviceWorker';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

const routing = (
    <Router>
      <link rel="shortcut icon" href="./assets/icone.jpg"/>
      <div>
        <Route path="/cadastro" component={Cadastro} />
        <Route exact path="/" component={Agenda} />
      </div>
    </Router>
  )
  
ReactDOM.render(routing, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
