import React, { Component } from 'react';
// import logo from './logo.svg';
import './fun-food-friends.css';
import firebase from './firebase.js';

class FunFood extends Component {
  constructor() {
    super();

    this.state = {
      currentItem: '',
      username: '',
      items: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div className='app'>
        <header>
          <div className='wrapper'>
            <h1>Fun Food Friends</h1>
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
                      <p>brought by: {item.user}</p>
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

  componentDidMount() {
    let itemsRef = firebase.firestore().collection("items");

    // TODO - Fix this...when I add new items to this, it doesn't populate it correctly on the page. 
    // It only shows the most recently added item, until the user refreshes the page.
    itemsRef.onSnapshot(snapshot => {
      console.log("Received snapshot: ", snapshot);

      // Attempt to set state:
      let newState = [];
      
      let items = snapshot.docChanges();
      items.forEach(item => {
        // console.log("item: ", item);

        newState.push({
          id: item.doc.id,
          itemName: item.doc.data().itemName,
          user: item.doc.data().user
        });
      });

      this.setState({
        items: newState
      });

      // Just do some console logging for sanity sake
      snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          console.log("Added: ", change.doc.data());
        }
        
        if (change.type === "modified") {
          console.log("Modified: ", change.doc.data());
        }
        
        if (change.type === "removed") {
          console.log("Removed: ", change.doc.data());
        }
      });
    }, err => {
      console.error("Encountered error: ", err);
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
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
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
}

export default FunFood;
