import React from 'react';
// import { Redirect } from "react-router-dom";

import firebase from '../../firebase.js';
import "./forgot-password.css";

class ForgotPasswordPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userEmail: "",
      userEmailConfirm: "",
      errorMessage: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    // if (this.state.successfulSignup) {
    //   return <Redirect to="/" />;
    // }

    return (
      <main className="forgot-password-page">
        <h1>Forgot Password?</h1>
        <h2>Send password reset email</h2>

        <form onSubmit={this.handleSubmit}>
          <div className="user-input-section">
            <label>Email:</label>
            <input type="email" name="userEmail"
                value={this.state.userEmail} onChange={this.handleChange} />
          </div>

          <div className="user-input-section">
            <label>Confirm Email:</label>
            <input type="email" name="userEmailConfirm"
                value={this.state.userEmailConfirm} onChange={this.handleChange} />
          </div>

          <button className="main-btn">Send Password Reset Email</button>
        </form>

        <p className="error-msg">{this.state.errorMessage}</p>
      </main>
    );
  }

  handleSubmit(e) {
    console.log("e: ", e);
  }

  handleChange(e) {
    console.log("e: ", e);
  }
}

function sendResetPasswordEmail() {
  let emailAddress = " ";

  if (window.confirm("Are you sure you want to reset your password?")) {
    firebase.auth().sendPasswordResetEmail(emailAddress).then(() => {
      console.log("Password reset email sent...");
    }).catch(error => {
      console.error("Error sending password reset email: ", error);
    });
  }
}

export default ForgotPasswordPage;
