/**
 * My Tutorial / Demo for learning React js
 * 
 * https://reactjs.org/docs/handling-events.html
 * https://reactjs.org/docs/state-and-lifecycle.html
 */

import React, { Component } from 'react';
import './fun-food-friends.css';
import firebase from './firebase.js';

class FunFood extends Component {
  constructor() {
    super();

    this.state = {
      currentItem: '',
      username: '',
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
              <button onClick={this.logOut}>Log Out</button>                
              :
              <button onClick={this.logIn}>Log In</button>              
            }
          </div>
        </header>

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
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }

  /**
   * From Firebase docs:
   * "The componentDidMount() method runs after the component output has been rendered to the DOM." 
   */
  componentDidMount() {
    // console.log("componentDidMount called");

    // TODO - Maybe move the firebase.firestore calls into their own functions to call for adding and removing. 
    firebase.firestore().collection("items").onSnapshot(snapshot => {
      // console.log("onSnapshot: ", snapshot);

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

    // Check login state:
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, set state:
        this.setState({ user });
      } else {
        // No user is signed in.
      }
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

  // TODO - actually link this up...
  logIn() {
    console.log("login clicked...");
  }

  // Error Codes: auth/invalid-email, auth/user-disabled, auth/user-not-found, auth/wrong-password
  /*
  logIn(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(function(error) {
        // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
        console.error("Error logging in: ", error);
        // ...
      });
  }
  */ 

  // This should be good to go but not totally linked up yet either
  logOut() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful. Set user state back to null: 
      this.setState({
        user: null
      });
    }).catch((error) => {
      // An error happened.
      console.error("Error logging out: ", error);
    });
  }
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
