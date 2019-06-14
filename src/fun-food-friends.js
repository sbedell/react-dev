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
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  render() {
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
              <input type="text" name="username" placeholder="What's your name?" onChange={this.handleChange} value={this.state.username} />
              <input type="text" name="currentItem" placeholder="What are you bringing?" onChange={this.handleChange} value={this.state.currentItem} />
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
    // TODO - Fix this...when I add new items to this, it doesn't populate it correctly on the page. 
    // It only shows the most recently added item, until the user refreshes the page.
    firebase.firestore().collection("items").onSnapshot(snapshot => {
      console.log("onSnapshot: ", snapshot);
      let newState = [];

      snapshot.docChanges().forEach(change => {
        // console.log("change: ", change);

        if (change.type === "added") {
          console.log("Added: ", change.doc.data());
          var item = change.doc.data();

          newState.push({
            id: change.doc.id,
            itemName: item.itemName,
            username: item.user
          });
        }
        
        if (change.type === "modified") {
          console.log("Modified: ", change.doc.data());
        }
        
        if (change.type === "removed") {
          console.log("Removed: ", change.doc.data());

          // attempt to remove it from newState
          // pretty sure change.doc.data() isn't going to pull the correct position...need to fix that too
          newState.splice(newState.indexOf(change.doc.data()), 1);
        }
      });

      this.setState({
        items: newState
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

  // Generic function to handle changes to input boxes
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

    // Add a new document with a generated id to "items" table/db.
    firebase.firestore().collection("items").add(item)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);

        // attempt to add this to state?
        this.state.items.push(item);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });

    // clear inputs after successful submit:
    this.setState({
      currentItem: '',
      username: ''
    });
  }

  removeItem(itemId) {
    firebase.firestore().collection("items").doc(itemId).delete();
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

export default FunFood;
