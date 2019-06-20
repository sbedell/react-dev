import firebase from './firebase.js';

/**
 * Call this when the user click "Sign up" or something, after filling in a username/email and password
 */
firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function() {
    console.log("Successfully created user!");
  })
  .catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.error("Error logging in: ", error);
  });