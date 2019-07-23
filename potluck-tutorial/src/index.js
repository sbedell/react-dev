import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './index.css';

import FunFood from './fun-food-friends';
import Login from './pages/login/login.js';
import AccountSettings from "./pages/account-settings/account-settings.js"
import SignUpPage from "./pages/sign-up/sign-up.js";
import ForgotPasswordPage from "./pages/forgot-password/forgot-password.js";
import * as serviceWorker from './serviceWorker';

// Reference - https://codeburst.io/getting-started-with-react-router-5c978f70df91
const routing = (
  <Router>
    <Route exact path="/" component={FunFood} />
    <Route path="/login" component={Login} />
    <Route path="/account-settings" component={AccountSettings} />
    <Route path="/sign-up" component={SignUpPage} />
    <Route path="/forgot-password" component={ForgotPasswordPage} />
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
