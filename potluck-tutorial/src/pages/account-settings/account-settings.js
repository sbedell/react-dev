/**
 * Component (page) to handle profile / account updates.
 * https://firebase.google.com/docs/auth/web/manage-users
 * 
 * TODO:
 * 1. Show a label with the value, 
 * then make an "edit" button that turns the value into an input box to let them edit,
 * and then follow off that "edit mode" with a save button and a cancel button. 
 * 2. Make the CSS prettier, pretty much nothing right now...
 */

import React from 'react';
import firebase from '../../firebase.js';

import "./account-settings.css";

class AccountSettings extends React.Component {
  constructor() {
    super();

    this.state = {
      currentUser: firebase.auth().currentUser,
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
          { this.state.currentUser ?
            <main>
              <div className="profile-info-section">
                <label>Username: </label>
                <span>{this.state.currentUser.displayName}</span>

                {this.state.editUsername ?
                  <div className="edit-section">
                    <label>New Username:</label>
                    <input type="text" id="username-input"></input>
                    
                    <div>
                      <button name="save-username" onClick={this.saveUsername} type="button">Save New Username</button>
                      <button name="editUsername" onClick={this.cancelEdit} type="button">Cancel</button>
                    </div>
                  </div>
                  :
                  <button name="editUsername" type="button" onClick={this.openEditMode}>Edit Username</button>
                }
              </div>

              <div className="profile-info-section">
                <label htmlFor="user-email">Email: </label>
                <span>{this.state.currentUser.email}</span>

                {this.state.editEmail ?
                  <div className="edit-section">
                    <div>
                      <label htmlFor="input-new-email">New Email:</label>
                      <input id="input-new-email" type="email"></input>
                    </div>
                    
                    <div>
                      <label htmlFor="input-new-email-confirm">Confirm New Email:</label>
                      <input id="input-new-email-confirm" type="email"></input>
                    </div>
                    
                    <div>
                      <label htmlFor="current-password">Current Password:</label>
                      <input id="current-password" type="password"></input>
                    </div>
                    
                    <button type="button" onClick={this.updateEmailAddr}>Save New Email</button>
                    <button name="editEmail" onClick={this.cancelEdit}>Cancel</button>
                  </div>
                  :
                  <button name="editEmail" onClick={this.openEditMode}>Edit Email</button>
                }
              </div>

              <div className="profile-info-section">
                <label>Email Verified: </label>
                { this.state.currentUser.emailVerified ?
                  <span>Yes</span>
                  :
                  <span>
                    <span>No</span>
                    <button type="button" onClick={this.sendVerificationEmail}>Send Verification Email</button>
                  </span>
                }
              </div>
              
              <div className="profile-info-section">
                {/* TODO - For this, need to open 3 inputs, 1 for old password (then send to re-verify function),
                and then one for new pass, another one to verify that new pass (check if they match). */}
                <button>Create New Password</button>
              </div>

              <div>
                {/* TODO - make this a red button, etc, force user to input old password before doing this too */}
                {/* <div className="profile-info-section">
                  <button>Delete Account?</button>
                </div> */}
              </div>
            </main>
          :
          <main>
            Loading...
          </main>
        }
      </div>
    );
  }

  componentDidMount() {
    // Check login state:
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in, set state:
        console.log("onAuthStateChanged, user exists, setting user in state");
        // console.log(user);

        this.setState({ currentUser: user });
      }
    }); 
  }

  openEditMode(e) {
    // console.log("openEditMode, e.target: ", e.target);
    this.setState({ [e.target.name]: true });
  }

  cancelEdit(e) {
    // console.log("cancelEdit. e.target.name: ", e.target.name);
    this.setState({ [e.target.name]: false });
  }

  /**
   * Update / Save new username in the user's Firebase profile
   * 
   * From Firebase docs: 
   * "You can update a user's basic profile information - 
   * the user's display name and profile photo URL - with the updateProfile method."
   */
  saveUsername() {
    // console.log("saveUsername. e.target: ", e.target);
    let newUsername = document.getElementById("username-input").value.trim();

    if (newUsername.match(/\w+/)) {
      let user = this.state.currentUser;

      let newProfileInfo = {
        displayName: newUsername,
      };

      // console.log("Updating profile with newProfileInfo: ", newProfileInfo);

      user.updateProfile(newProfileInfo).then(() => {
        console.log("Successfully updating profile - updated username");

        // reset the input back to empty string:
        document.getElementById("username-input").value = "";

        this.setState({ editUsername: false });
      }).catch(error => {
        console.error("Error updating profile: ", error);
      });
    }
  }

  updateEmailAddr() {
    let user = firebase.auth().currentUser;
    let newEmail = document.getElementById("input-new-email").value.trim();
    let newEmailConfirm = "";
    
    if (newEmail === newEmailConfirm) {
      user.updateEmail(newEmail).then(() => {
        console.log("Successfully updated profile - updated email address");

        this.setState({ editEmail: false });
      }).catch(error => {
        console.error("Error updating email address: ", error);
      });
    }
  }

  sendVerificationEmail() {
    let user = firebase.auth().currentUser;

    if (window.confirm("Do you want to send a verification email?")) {
      user.sendEmailVerification().then(() => {
        console.log("Verification email sent");
        // probably want to send the user a message on the screen too.
      }).catch(error => {
        console.error("Error sending verification email: ", error);
      });
    }
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
