/**
 * My Tutorial / Demo for learning React js
 * 
 * https://reactjs.org/docs/handling-events.html
 * https://reactjs.org/docs/state-and-lifecycle.html
 * 
 * TODOS:
 * 0. Login page - basically done / working right now :D.
 * 1. "Forgot password" button/link or something too
 * 2. Sign-up page (link from the login page?)
 * 3. Update user info page, can update displayName, email, and password
 */

import React, { Component } from 'react';
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
      items: []
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
        <header>
          <div className='wrapper'>
            <h1>Fun Food Friends</h1>
            {this.state.user ?
              <span className="logout-section">
                <span>{this.state.user.email}</span>
                <button onClick={this.logOut}>Log Out</button>
              </span>
              :
              <button onClick={this.showModal}>Log In</button>              
            }
          </div>
        </header>

        {this.state.user ?
          <div className='container'>
            <section className='add-item'>
              <form onSubmit={this.handleSubmit}>
                <input id="usernameInput" type="text" name="username" placeholder="What's your name?" 
                    onChange={this.handleChange} value={this.state.username} />
                <input id="itemInput" type="text" name="currentItem" placeholder="What are you bringing?" 
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
                        <p>brought by: {item.username}</p>
                        <button onClick={() => this.removeItem(item.id)}>Remove Item</button>
                        
                        {/* { item.user === this.state.user.displayName || item.user === this.state.user.email ?
                          <button onClick={() => this.removeItem(item.id)}>Remove Item</button>
                          :
                          null
                        } */}
                      </li>
                    )
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
          <input id="user-email" type="text"></input>

          <label htmlFor="user-password">Password:</label>
          <input id="user-password" type="password"></input> 

          <p id="login-info"></p>

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
          console.log("Added: ", change.doc.data());

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
      })
      .catch((error) => {
        // Error Codes: auth/invalid-email, auth/user-disabled, auth/user-not-found, auth/wrong-password
        // let errorCode = error.code;
        // let errorMessage = error.message;
        console.error("Error logging in: ", error);
      });
  }

  // This should be good to go but not totally linked up yet either
  logOut() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful. Set user state back to null: 
      this.setState({
        user: null
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
