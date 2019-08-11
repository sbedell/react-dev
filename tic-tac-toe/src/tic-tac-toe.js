/**
 * Tutorial from https://reactjs.org/tutorial/tutorial.html
 * 
 * Some TODOs from that page:
 * If you have extra time or want to practice your new React skills, here are some 
 * ideas for improvements that you could make to the tic-tac-toe game,
 * which are listed in order of increasing difficulty:
 *  DONE - 1. Display the location for each move in the format (col, row) in the move history list.
 *  DONE - 2. Bold the currently selected item in the move list.
 *  4. Add a toggle button that lets you sort the moves in either ascending or descending order.
 *  DONE - 5. When someone wins, highlight the three squares that caused the win.
 *  DONE - 6. When no one wins, display a message about the result being a draw.
 */

import React from 'react';
import './tic-tac-toe.css';

// Called a "controlled component", as Board has full control over Square.
// This is also now a "Function Component"
function Square(props) {
  let squareClassName = "square";
  if (props.value) {
    squareClassName += ` ${props.value}`;
  }

  if (props.isWinningSquare) {
    squareClassName += " winning-square";
  }

  return (
    <button className={squareClassName} onClick={props.onClick} >
      { props.value }
    </button>
  );
}

class Board extends React.Component {
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }

  renderSquare(i) {
    if (this.props.winningSquares) {
      for (let x = 0; x < this.props.winningSquares.length; x++) {
        if (this.props.winningSquares[x] === i) {
          return (<Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} isWinningSquare={true} />);
        }
      }
    }
    
    return (
      <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{
        squares: Array(9).fill(null),
        move: {
          player: null,
          row: null,
          col: null
        }
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const moves = history.map((step, move) => {
      const desc = move ? `Go to move #${move}. ${step.move.player} 
                        (${step.move.col}, ${step.move.row})` 
        : 'Go to game start';

      let btnClassName = "move-btn";
      if (this.state.stepNumber === move) {
        btnClassName += " current-move";
      }

      return (
        <li key={move}>
          <button className={btnClassName} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    let winningSquares;
    const winner = calculateWinner(current.squares);
    
    if (winner) {
      status = 'Winner: ' + winner.winningPlayer;
      winningSquares = winner.winningSquares;
    } else if (current.squares.every(val => val !== null)) {
      // Checks if every square is not null, indicating a full game board
      status = "Tie! Cats game.";
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    
    return (
      <main className="game">
        <section>
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} winningSquares={winningSquares} />
          
          <div className="game-status">{status}</div>
        </section>
        
        <section className="game-info">
          <ul>{moves}</ul>
        </section>
      </main>
    );
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    let newSquares = current.squares.slice();

    if (calculateWinner(newSquares) || newSquares[i]) {
      return;
    }

    let playerXO = this.state.xIsNext ? 'X' : 'O';
    let position = calculatePosition(i);
    newSquares[i] = playerXO;
    
    this.setState({
      history: history.concat([{
        squares: newSquares,
        move: {
          player: playerXO,
          row: position.row,
          col: position.col
        }
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
}

// ========================================

function calculateWinner(squares) {
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winningLines.length; i++) {
    const [a, b, c] = winningLines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winningPlayer: squares[a],
        winningSquares: winningLines[i] 
      }
    }
  }

  return null;
}

function calculatePosition(i) {
  switch(i) {
    case 0: return { row: 1, col: 1 };
    case 1: return { row: 1, col: 2 };
    case 2: return { row: 1, col: 3 };
    case 3: return { row: 2, col: 1 };
    case 4: return { row: 2, col: 2 };
    case 5: return { row: 2, col: 3 };
    case 6: return { row: 3, col: 1 };
    case 7: return { row: 3, col: 2 };
    case 8: return { row: 3, col: 3 };
    default: return { row: 0, col: 0}; // basically an error...
  }
}

export default Game;
