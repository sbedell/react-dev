import React, { Component } from 'react';
// import logo from './logo.svg';
import './fun-food-friends.css';
import firebase from './firebase.js';

class FunFood extends Component {
  constructor() {
    super();

    this.state = {
      currentItem: '',
      username: ''
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
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Generic function to handle changes to input boxes
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    // Add to Firebase Database table called "items":
    const item = {
      itemName: this.state.currentItem,
      user: this.state.username
    }

    // Add a new document with a generated id.
    firebase.firestore().collection("items").add(item)
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });

    // clear inputs after submitting:
    this.setState({
      currentItem: '',
      username: ''
    });
  }
}

export default FunFood;