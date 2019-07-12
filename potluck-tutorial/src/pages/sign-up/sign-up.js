import React from 'react';
import firebase from '../../firebase.js';

import "./sign-up.css";

/**
 * TODO
 * 1. Input boxes for username, email, password, button for "Sign Up"
 */

class SignUpPage extends React.Component {
  // constructor() {
  //   super();

  //   this.state = {
  //     stateprop: null
  //   };
  // }

  render() {
    return (
      <main className="sign-up-page">
        <h1>Sign Up</h1>
        <h2>Register For a new account</h2>

        <div className="user-input-section">
          <label>Email:</label>
          <input type="email"></input>
        </div>

        <div className="user-input-section">
          <label>Password:</label>
          <input type="password"></input>
        </div>

        <div className="user-input-section">
          <label>Confirm Password:</label>
          <input type="password"></input>
        </div>

        <div className="user-input-section">
          <label>Username (optional, not used for logging in): </label>
          <input type="text"></input>
        </div>

        <button>Create Account</button>
      </main>
    );
  }
}

/**
 * Call this when the user click "Sign up" or something, after filling in a username/email and password
 */
// eslint-disable-next-line
function signUp(email, password) {
  if (email && password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log("Successfully created user!");
      })
      .catch(error => {
        // let errorCode = error.code;
        // let errorMessage = error.message;
        console.error("Error creating user: ", error);
      });
  } else {
    // some kinda error?
  }
}

export default SignUpPage;
