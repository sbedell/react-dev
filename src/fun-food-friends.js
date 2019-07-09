/**
 * My Tutorial / Demo for learning React js
 * 
 * https://reactjs.org/docs/handling-events.html
 * https://reactjs.org/docs/state-and-lifecycle.html
 * 
 * TODOs:
 * 0. Login page - basically done / working right now :D.
 *    -  Need to reset form on login, could/should probably just make it it's own page
 * 1. "Forgot password" button/link (new page or modal)
 * 2. Sign-up page (link from the login page?)
 * 3. Update user info page, can update displayName, email, and password
 */

import React, { Component } from 'react';
import { Link } from "react-router-dom";

import Modal from './components/modal/modal';
import firebase from './firebase.js';

import './fun-food-friends.css';

class FunFood extends Component {
  constructor() {
    super();

    this.state = {
      showLoginModal: false,
      user: null,
      items: [],
      loginErrorMessage: ''
    };

    this.handleAddItemButtonClick = this.handleAddItemButtonClick.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  render() {
    // console.log("Render called");
    return (
      <div className='app'>
        <header className="my-header">
          <h1>Fun Food Friends</h1>
          {this.state.user ?
            <span className="logout-section">
              <Link to="/account-settings">{this.state.user.email}</Link>
              <button onClick={this.logOut}>Log Out</button>
            </span>
            :
            <button onClick={this.showModal}>Log In</button>
            // <Link to="/login">Log In</Link>
          }
        </header>

        {this.state.user ?
          <div className='container'>
            <section className='add-item'>
              <input id="input-current-item" type="text" className="user-input" name="currentItem" placeholder="What are you bringing?" />
              
              {this.state.user.displayName ? 
                <p>User: {this.state.user.displayName}</p>
                :
                <p>User: {this.state.user.email}</p>
              }
              
              <button type="button" className="form-button" onClick={this.handleAddItemButtonClick}>Add Item</button>
            </section>
            
            <section className='display-item'>
              <div className='wrapper'>
                <ul className="item-list">
                  {this.state.items.map(item => {
                    return (
                      <li className="food-item" key={item.id}>
                        <h3 className="item-header">{item.itemName}</h3>
                        { item.userName ? 
                          <p>Brought by: {item.userName}</p>
                          :
                          <p>Brought by: {item.userEmail}</p>
                        }
                                                
                        { item.userName === this.state.user.displayName || item.userEmail === this.state.user.email ?
                          <button type="button" className="remove-button" onClick={() => this.removeItem(item.id)}>Remove Item</button>
                          :
                          null
                        }
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          </div>
          :
          <div className='container'>
            <p>Please log in to see the potluck list and submit to it.</p>
          </div>
        }

        <Modal show={this.state.showLoginModal} handleClose={this.hideModal}>
          <h1>Log In</h1>
          
          <label htmlFor="user-email">Email:</label>
          <input id="user-email" type="email"></input>

          <label htmlFor="user-password">Password:</label>
          <input id="user-password" type="password"></input> 

          <p className="error">{this.state.loginErrorMessage}</p>

          <button className="login-btn" onClick={this.logIn}>Log In</button>
          <br></br>
          <button>Forgot Password</button>
          <p>Don't have an account?</p><Link to="/sign-up" className="modal-link-btn">Sign Up</Link>
        </Modal>

      </div>
    );
  }

  /**
   * From Firebase docs:
   * "The componentDidMount() method runs after the component output has been rendered to the DOM." 
   */
  componentDidMount() {
    // Check login state:
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in, set state:
        console.log("onAuthStateChanged, user exists, setting user in state");
        // console.log(user);

        this.setState({ 
          user: user 
        });
        this.getItemsFromFirebase();
      }
    }); 
  }

  getItemsFromFirebase() {
    // TODO - Maybe move the firebase.firestore calls into their own functions to call for adding and removing.
    firebase.firestore().collection("items").onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        // console.log("change: ", change);

        if (change.type === "added") {
          // console.log("Added: ", change.doc.data());

          let item = {
            id: change.doc.id,
            itemName: change.doc.data().itemName,
            userName: change.doc.data().userName,
            userEmail: change.doc.data().userEmail
          };

          // Add the new item to the state:
          // calling setState re-calls render()
          this.setState(prevState => ({
            items: [...prevState.items, item]
          }));
        }
        
        if (change.type === "modified") {
          console.log("Modified: ", change.doc.data());
        }
        
        if (change.type === "removed") {
          // Can also access the id via change.doc.id
          console.log("Removed: ", change.doc.data());

          // Remove the item from the current state:
          this.setState(prevState => ({
            items: prevState.items.filter(item => {
              return item.id !== change.doc.id;
            })
          }));
        }
      });
    }, err => {
      console.error("Encountered error: ", err);
    });
  }

  // TODO - Switch from the handleChange and handleSubmit functions to this one that pulls via ID:
  handleAddItemButtonClick() {
    let inputItemName = document.getElementById("input-current-item").value.trim();
    let item = {};

    if (inputItemName) {
      // Eventually you're probably just going to want to link this up to the user as a "foreign key"
      // then pull the email and user/displayName from that ..."link"
      item = {
        itemName: inputItemName,
        userName: this.state.user.displayName,
        userEmail: this.state.user.email
      };

      addItemToFirebase(item);

      // reset the input
      document.getElementById("input-current-item").value = "";
    } else {
      alert("Error: item cannot be blank!");
    }
  }

  removeItem(itemId) {
    firebase.firestore().collection("items").doc(itemId)
      .delete()
      .then(() => {
        console.log("Item successfully deleted!");
      }).catch(error => {
        console.error("Error removing document: ", error);
      });;
  }

  /**
   * Handle Log in button action
   */
  logIn() {
    let email = document.getElementById("user-email").value;
    let password = document.getElementById("user-password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log("Successfully logged in!");
        this.hideModal();

        // reset form values?
        document.getElementById("user-email").value = "";
        document.getElementById("user-password").value = "";
      })
      .catch(error => {
        // Error Codes: auth/invalid-email, auth/user-disabled, auth/user-not-found, auth/wrong-password
        // let errorCode = error.code;
        // let errorMessage = error.message;
        console.error("Error logging in: ", error);
        this.setState({
          loginErrorMessage: error.message
        });
      });
  }

  logOut() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful. Reset the entire state:
      this.setState({
        showLoginModal: false,
        user: null,
        items: [],
        loginErrorMessage: ''
      });
    }).catch(error => {
      console.error("Error logging out: ", error);
    });
  }

  showModal = () => {
    this.setState({
      showLoginModal: true
    });
  };
  
  hideModal = () => {
    this.setState({
      showLoginModal: false
    });
  };
}

// "Outer" function since it doesn't actually touch the state at all:
function addItemToFirebase(item) {
  firebase.firestore().collection("items").add(item)
    .then(docRef => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(error => {
      console.error("Error adding document: ", error);
    });
}

export default FunFood;
