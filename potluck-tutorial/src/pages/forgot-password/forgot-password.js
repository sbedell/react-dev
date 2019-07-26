import React from 'react';
// import { Redirect, Link } from "react-router-dom";

import firebase from '../../firebase.js';
import "./forgot-password.css";

class ForgotPasswordPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userEmail: "",
      userEmailConfirm: "",
      errorMessage: "",
      resetEmailSent: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendResetPasswordEmail = this.sendResetPasswordEmail.bind(this);
  }

  render() {
    return (
      <main className="forgot-password-page">
        <h1>Forgot Password?</h1>
        <h2>Send password reset email</h2>

        <form onSubmit={this.handleSubmit}>
          <div className="user-input-section">
            <label>Email</label>
            <input type="email" name="userEmail"
                value={this.state.userEmail} onChange={this.handleChange} />
          </div>

          <div className="user-input-section">
            <label>Confirm Email</label>
            <input type="email" name="userEmailConfirm"
                value={this.state.userEmailConfirm} onChange={this.handleChange} />
          </div>

          <button className="main-btn">Send Password Reset Email</button>
        </form>

        <p className="error-msg">{this.state.errorMessage}</p>
      </main>
    );
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    let userEmail = this.state.userEmail.trim();
    let userEmailConfirm = this.state.userEmailConfirm.trim();

    if (!userEmail) {
      this.setState({ errorMessage: "Error: Please enter an email address!" });
    } else if (userEmail === userEmailConfirm) {
      this.sendResetPasswordEmail(userEmail);
    } else {
      this.setState({ errorMessage: "Error: Email addresses don't match!" });
    }   
  }

  sendResetPasswordEmail(emailAddress) {
    if (emailAddress && window.confirm("Are you sure you want to reset your password?")) {
      firebase.auth().sendPasswordResetEmail(emailAddress).then(() => {
        this.setState({
          errorMessage: "",
          resetEmailSent: true
        });
        alert("Password reset email sent. Hit the back button to go back home.");
      }).catch(error => {
        console.error("Error sending password reset email: ", error);
        this.setState({ errorMessage: `Error: ${error.message}`});
      });
    }
  }
}

export default ForgotPasswordPage;
