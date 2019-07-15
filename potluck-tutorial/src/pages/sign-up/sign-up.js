import React from 'react';
import { Redirect } from "react-router-dom";

import firebase from '../../firebase.js';
import "./sign-up.css";

class SignUpPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userEmail: '',
      successfulSignup: false,
      signUpErrorMessage: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    if (this.state.successfulSignup) {
      return <Redirect to="/" />;
    }

    return (
      <main className="sign-up-page">
        <h1>Sign Up</h1>
        <h2>Register for a new account</h2>

        <form onSubmit={this.handleSubmit}>
          <div className="user-input-section">
            <label>Email:</label>
            <input type="email" name="userEmail"
                value={this.state.userEmail} onChange={this.handleChange} />
          </div>

          <div className="user-input-section">
            <label htmlFor="user-password">Password:</label>
            <input id="user-password" type="password"></input>
          </div>

          <div className="user-input-section">
            <label htmlFor="pass-confirm">Confirm Password:</label>
            <input id="pass-confirm" type="password"></input>
          </div>

          {/* <div className="user-input-section">
            <label>Username (optional, not used for logging in): </label>
            <input type="text" name="userDisplayName" 
                value={this.state.userDisplayName} onChange={this.handleChange}></input>
          </div> */}

          <button className="main-btn">Create Account</button>
        </form>

        <p className="error-msg">{this.state.signUpErrorMessage}</p>
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

    // console.log("e.target", e.target);

    let userEmail = this.state.userEmail.trim();
    let password = document.getElementById("user-password").value.trim();
    let passConfirm = document.getElementById("pass-confirm").value.trim();
    
    // console.log("User email: ", userEmail);
    // console.log("Do the passwords match? ", password === passConfirm);

    if (!userEmail) {
      this.setState({signUpErrorMessage: "Please enter an email address"});
    } else if (!password) {
      this.setState({signUpErrorMessage: "Please enter a password!"});
    } else if (password !== passConfirm) {
      this.setState({signUpErrorMessage: "Error: Passwords don't match!"});
    } else if (userEmail && (password === passConfirm)) {
      this.signUpFirebaseUser(userEmail, password);
    }
  }

  signUpFirebaseUser(email, password) {
    if (email && password) {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
          console.log("Successfully created user! ", email);

          this.setState({ successfulSignup: true });
        })
        .catch(error => {
          // let errorCode = error.code;
          // let errorMessage = error.message;
          console.error("Error creating user: ", error);

          this.setState({signUpErrorMessage: error.message});
        });
    }
  }
}

export default SignUpPage;
