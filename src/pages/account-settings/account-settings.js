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
      currentUser: null,
      editEmail: false,
      editUsername: false
    };

    this.openEditMode = this.openEditMode.bind(this);
    this.saveUsername = this.saveUsername.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
  }

  render() {
    return (
      <div className="account-settings-page">
        <h1>Profile / Account Info</h1>

        {/* TODO - Stuff to display: DisplayName, Email, Email Verified (y/n) */}
        <div className="profile-info-section">
          <label htmlFor="user-email">Email: </label>
          {this.state.currentUser ? 
            <span>{this.state.currentUser.email}</span>
            :
            <span>---</span>
          }
          {this.state.editEmail ?
            <div className="edit-section">
              <label>New Email:</label>
              <input id="user-email" type="email"></input>
              
              <label>Confirm New Email:</label>
              <input type="email"></input>
              
              <label>Current Password:</label>
              <input type="password"></input>
              <button>Save New Email</button>
              <button name="cancel-edit-email" onClick={this.cancelEdit}>Cancel</button>
            </div>
            :
            <button id="edit-email-btn" onClick={this.openEditMode}>Edit Email</button>
          }
        </div>

        <div className="profile-info-section">
          <label>Username: </label>
          {/* Find some way here to do a nested if statement or "renderContent" or somthing to 
          display a message to the user if the username/display name is not set. */}
          {this.state.currentUser ? 
            <span>{this.state.currentUser.displayName}</span>
            :
            <span>---</span>
          }
          {this.state.editUsername ?
            <div className="edit-section">
              <label>New Username:</label>
              <input type="text" id="username-input"></input>
              
              <button name="save-username" onClick={this.saveUsername}>Save New Username</button>
              <button name="cancel-edit-username" onClick={this.cancelEdit} type="button">Cancel</button>
            </div>
            :
            <button id="edit-username-btn" type="button" onClick={this.openEditMode}>Edit Username</button>
          }
        </div>
        
        <div className="profile-info-section">
          <label>Set New Password</label>
          {/* TODO - For this, need to open 3 fucking inputs, 1 for old password (then send to re-verify function),
          and then one for new pass, another one to verify that new pass (check if they match). */}
          <button>Create New Password</button>
        </div>

        {/* TODO - make this a red button, etc, force user to input old password before doing this too */}
        {/* <div className="profile-info-section">
          <button>Delete Account?</button>
        </div> */}
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

  openEditMode(e) {
    // console.log("OpenEditMode, e.target: ", e.target.id);

    if (e.target.id === "edit-email-btn") {
      this.setState({
        editEmail: true
      });
    } else if (e.target.id === "edit-username-btn") {
      this.setState({
        editUsername: true
      });
    }
  }

  cancelEdit(e) {
    console.log("cancelEdit. e.target.name: ", e.target.name);

    if (e.target.name === "cancel-edit-username") {
      this.setState({
        editUsername: false
      });
    }
  }

  /**
   * Remember to setState editEmail to false after saving
   */
  // saveEmail() {
  // }

  /**
   * Update / Save new username in the user's Firebase profil
   * 
   * From Firebase docs: 
   * "You can update a user's basic profile information - 
   * the user's display name and profile photo URL - with the updateProfile method."
   */
  saveUsername(e) {
    // console.log("saveUsername. e.target: ", e.target);
    let newUsername = document.getElementById("username-input").value.trim();

    if (newUsername.match(/\w+/)) {
      // console.log("newUsername = ", newUsername);

      let user = firebase.auth().currentUser;

      let newProfileInfo = {
        displayName: newUsername,
      };

      console.log("Updating profile with newProfileInfo: ", newProfileInfo);

      user.updateProfile(newProfileInfo).then(() => {
        console.log("Successfully updating profile - updated username");

        // reset the input back to empty string:
        document.getElementById("username-input").value = "";

        this.setState({
          editUsername: false
        });
      }).catch(error => {
        console.error("Error updating profile: ", error);
      });
    }
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
