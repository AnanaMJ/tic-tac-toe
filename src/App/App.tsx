import * as React from 'react';
import './App.css';
import { GameControls } from '../GameControls/GameControls';
import Board, { SquareState } from '../Board/Board';
import { isUndefined, isNullOrUndefined } from 'util';
import { calculateWinner, getWinnerLine } from '../Functions/Functions';

type BoardState = Array<SquareState>;

export interface AppState {
  history: Array<BoardState>;
  stepNumber: number;
  winner: SquareState;
  winnerLine?: Array<number>;
  xIsNext: boolean;
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.reset();
  }

  reset = () => {
    const history = [
      Array(9).fill(null)
    ];

    const state = {
      history,
      stepNumber: 0,
      winner: null,
      winnerLine: undefined,
      xIsNext: true,
    };

    if (isUndefined(this.state)) {
      this.state = state;
    } else {
      this.setState(state);
    }
  }

  handleBoardClick = (i: number) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const boardState = current.slice() as BoardState;

    if (!isNullOrUndefined(boardState[i]) || this.state.winner) {
      return;
    }

    boardState[i] = this.state.xIsNext ? 'X' : 'O';
    const winner = calculateWinner(boardState);
    const winnerLine = getWinnerLine(boardState);

    this.setState({
      history: history.concat([boardState]),
      stepNumber: history.length,
      winner,
      winnerLine,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0 ? false : true,
    })
  }

  getStatusText() {
    if (this.state.winner) {
      return `Winner: ${this.state.winner}`;
    } else if (this.state.stepNumber >= 9) {
      return "It's a tie!";
    }

    return `Current turn: ${this.state.xIsNext ? 'X' : 'O'}`;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const status = this.getStatusText();
    const moves = history.map( (step, move) => {
      const desc = move ? `Go to move #${move}` : 'Go to game start';
      return (
        <li key = {move}>
          <button onClick= {() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    });

    return (
      <div className="App">

        <div className="Board">
          <Board
            squares={current}
            winnerLine={this.state.winnerLine}
            onClick={this.handleBoardClick}
          />
        </div>

        <GameControls
          reset={this.reset}
        />
        <div className="game-info">
          <div className="text-center">{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

export default App;