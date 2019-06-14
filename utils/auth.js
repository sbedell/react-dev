// need to "import firebase from firebase"

// onAuthStateChanged:
function observeUser() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
    } else {
      // No user is signed in.
    }
  });  
}

function userSignedIn() {
  let user = firebase.auth().currentUser;

  if (user) {
    // User is signed in.
    return true;
  } else {
    // No user is signed in.
    return false;
  }
}

function logIn(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle Errors here.
      // var errorCode = error.code;
      // var errorMessage = error.message;
      console.error("Error logging in: ", error);
      // ...
    });
}

function logOut() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
  }).catch((error) => {
    console.error("Error logging out: ", error);
  });
}