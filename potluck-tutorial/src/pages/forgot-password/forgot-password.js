import firebase from '../../firebase.js';

function sendResetPasswordEmail() {
  let auth = firebase.auth();

  // Get current user and grab their email addr?
  let emailAddress = "user@example.com";
  
  auth.sendPasswordResetEmail(emailAddress).then(() => {
    // Email sent.
  }).catch(error => {
    console.error("Error sending password reset email: ", error);
  });
}