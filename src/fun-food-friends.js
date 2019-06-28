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
// import { Link } from "react-router-dom";

import Modal from './components/modal/modal';
import firebase from './firebase.js';

import './fun-food-friends.css';

class FunFood extends Component {
  constructor() {
    super();

    this.state = {
      currentItem: '',
      username: '',
      showLoginModal: false,
      user: null,
      items: [],
      loginErrorMessage: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
              <span>{this.state.user.email}</span>
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
              <form onSubmit={this.handleSubmit}>
                <input type="text" className="user-input" name="username" placeholder="What's your name?" 
                    onChange={this.handleChange} value={this.state.username} />
                <input type="text" className="user-input" name="currentItem" placeholder="What are you bringing?" 
                    onChange={this.handleChange} value={this.state.currentItem} />
                <button>Add Item</button>
              </form>
            </section>
            
            <section className='display-item'>
              <div className='wrapper'>
                <ul>
                  {this.state.items.map((item) => {
                    return (
                      <li key={item.id}>
                        <h3>{item.itemName}</h3>
                        <p>Brought by: {item.username}</p>
                        <button className="remove-button" onClick={() => this.removeItem(item.id)}>Remove Item</button>
                        
                        {/* { item.user === this.state.user.displayName || item.user === this.state.user.email ?
                          <button onClick={() => this.removeItem(item.id)}>Remove Item</button>
                          :
                          null
                        } */}
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

          <p>{this.state.loginErrorMessage}</p>

          <button onClick={this.logIn}>Log In</button>
          <button>Forgot Password</button>
          <p>Don't have an account?</p><button>Sign Up</button>
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
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, set state:
        console.log("onAuthStateChanged, user exists, setting user in state");
        this.setState({ user });
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
            username: change.doc.data().user
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

  /**
   * Generic function to handle changes to input boxes
   */ 
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const item = {
      itemName: this.state.currentItem,
      user: this.state.username
    }

    addItemToFirebase(item);

    // Clear the state inputs:
    this.setState({
      currentItem: '',
      username: ''
    });
  }

  removeItem(itemId) {
    firebase.firestore().collection("items").doc(itemId)
      .delete()
      .then(function() {
        console.log("Item successfully deleted!");
      }).catch(function(error) {
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

        // Populate items?
        // this.getItemsFromFirebase();
      })
      .catch((error) => {
        // Error Codes: auth/invalid-email, auth/user-disabled, auth/user-not-found, auth/wrong-password
        // let errorCode = error.code;
        // let errorMessage = error.message;
        console.error("Error logging in: ", error);
        this.setState({
          loginErrorMessage: error.message
        });
      });
  }

  // This should be good to go but not totally linked up yet either
  logOut() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful. Reset the entire state:
      this.setState({
        currentItem: '',
        username: '',
        showLoginModal: false,
        user: null,
        items: [],
        loginErrorMessage: ''
      });
    }).catch((error) => {
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
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
}

export default FunFood;
