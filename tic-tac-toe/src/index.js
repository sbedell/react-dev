/**
 * Tutorial from https://reactjs.org/tutorial/tutorial.html
 * 
 * This is basically just a loader for the named file of tic-tac-toe.js, which 
 * is where the main game code lives now.
 */

import React from 'react';
import ReactDOM from 'react-dom';

import Game from "./tic-tac-toe.js";

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
