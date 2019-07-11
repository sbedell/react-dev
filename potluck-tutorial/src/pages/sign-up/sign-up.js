import React from 'react';
import firebase from '../../firebase.js';

class SignUpPage extends React.Component {
  // constructor() {
  //   super();

  //   this.state = {
  //     currentUser: null
  //   };
  // }

  render() {
    return (
      <h1>Sign Up Page</h1>
    );
  }
}

/**
 * Call this when the user click "Sign up" or something, after filling in a username/email and password
 */
// eslint-disable-next-line
function signUp(email, password, username = "") {
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
