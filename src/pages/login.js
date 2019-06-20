import React from 'react';
import firebase from '../firebase.js';

class Login extends React.Component {
  render() {
    return (
      <div>
        <h1>Log In</h1>
            
        <label htmlFor="user-email">Email:</label>
        <input id="user-email" type="text"></input>

        <label htmlFor="user-password">Password:</label>
        <input id="user-password" type="password"></input> 

        <p id="login-info"></p>

        <button onClick={this.logIn}>Log In</button>
        <button>Forgot Password</button>
        <p>Don't have an account?</p><button>Sign Up</button>
      </div>
    ); 
  }

  logIn() {
    let email = document.getElementById("user-email").value;
    let password = document.getElementById("user-password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log("Successfully logged in!");
        this.hideModal();

        // reset form values
        document.getElementById("user-email").value = "";
        document.getElementById("user-password").value = "";

        // Populate items?
        // this.getItemsFromFirebase();
      })
      .catch((error) => {
        // Error Codes: auth/invalid-email, auth/user-disabled, auth/user-not-found, auth/wrong-password
        // let errorCode = error.code;
        // let errorMessage = error.message;
        console.error("Error logging in: ", error);
      });
  }
}

export default Login;
