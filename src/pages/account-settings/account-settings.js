/**
 * Component (page) to handle profile / account updates.
 * https://firebase.google.com/docs/auth/web/manage-users
 * 
 * TODO:
 * Show a label with the value, 
 * then make an "edit" button that turns the value into an input box to let them edit,
 * and then follow off that "edit mode" with a save button and a cancel button. 
 */

import React from 'react';
import firebase from '../../firebase.js';

import "./account-settings.css";

class AccountSettings extends React.Component {
  constructor() {
    super();

    this.state = {
      currentUser: null
    };
  }

  render() {
    return (
      <div className="account-settings-page">
        <h1>Profile / Account Info</h1>

        {/* TODO - Stuff to display: DisplayName, Email, Email Verified (y/n) */}
            
        {/* <label htmlFor="user-email">Email</label>
        <input id="user-email" type="email"></input> */}
        <div className="profile-info-section">
          <label>Email: </label>
          {this.state.currentUser ? 
            <span>{this.state.currentUser.email}</span>
            :
            <span>-</span>
          }
          <button>Edit Email</button>
        </div>

        <div className="profile-info-section">
          <label>Username: </label>
          {/* Find some way here to do a nested if statement or "renderContent" or somthing to 
          display a message to the user if the username/display name is not set. */}
          {this.state.currentUser ? 
            <span>{this.state.currentUser.displayName}</span>
            :
            <span>-</span>
          }
          <button>Edit Username</button>
        </div>
        
        <div className="profile-info-section">
          <label htmlFor="user-password">Password</label>
          <input id="user-password" type="password"></input>
        </div>
      </div>
    );
  }

  componentDidMount() {
    let user = firebase.auth().currentUser;

    if (user) {
      this.setState({
        currentUser: user
      });
    }
  }

  /**
   * From Firebase docs: 
   * "You can update a user's basic profile information - 
   * the user's display name and profile photo URL - with the updateProfile method."
   */
  updateProfile(newDisplayName, newPhotoUrl) {
    let user = firebase.auth().currentUser;
    let newProfileInfo = {
      displayName: "",
      photoUrl: ""
    };

    user.updateProfile(newProfileInfo).then(() => {
      // Update successful.
    }).catch(error => {
      console.error("Error updating profile: ", error);
    });
  }

  updateEmail(newEmailAddr) {
    let user = firebase.auth().currentUser;
    
    if (newEmailAddr) {
      user.updateEmail(newEmailAddr).then(() => {
        // Update successful.
      }).catch(error => {
        console.error("Error updating email address: ", error);
      });
    }
  }

  sendVerificationEmail() {
    let user = firebase.auth().currentUser;

    user.sendEmailVerification().then(() => {
      // Email sent.
    }).catch(error => {
      // An error happened.
    });
  }

  // Might want to force user to re-auth before doing this?
  // like 1. type oldpass, 2. check it, 3. type newpass
  updatePassword(newPw) {
    let user = firebase.auth().currentUser;

    user.updatePassword(newPw).then(function() {
      // Update successful.
    }).catch(error => {
      console.error("Error updating password: ", error);
    });

  }

  /*
  deleteUser() {
    let user = firebase.auth().currentUser;

    // TODO - do an alert or something to ask them if they are REALLY SURE
    user.delete().then(() => {
      // User deleted.
    }).catch(error => {
      console.error("Error deleting user");
    });
  }
  */

  /**
   * Re-Auth User
   * https://firebase.google.com/docs/auth/web/manage-users#re-authenticate_a_user
   * Need to do this before updating password, setting new email address, or deleting user/account.
   */
  reAuthenticateUser() {
    let user = firebase.auth().currentUser;
    let credential;

    // Prompt the user to re-provide their sign-in credentials

    user.reauthenticateWithCredential(credential).then(() => {
      // User re-authenticated.
    }).catch(error => {
      console.error("Error reauthenticating user: ", error);
    });
  }
}

export default AccountSettings;