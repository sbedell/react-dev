import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './index.css';

import FunFood from './fun-food-friends';
import Login from './pages/login/login.js';
import UpdateAccount from "./pages/update-account/update-account.js"
import * as serviceWorker from './serviceWorker';

// Reference - https://codeburst.io/getting-started-with-react-router-5c978f70df91
const routing = (
  <Router>
    <Route exact path="/" component={FunFood} />
    <Route path="/login" component={Login} />
    <Route path="/update-account" component={UpdateAccount} />
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
