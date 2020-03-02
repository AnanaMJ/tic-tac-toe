import * as React from 'react';
import './App.css';
import { GameControls } from '../GameControls/GameControls';
import Board, { SquareState } from '../Board/Board';
import { isUndefined, isNullOrUndefined } from 'util';
import { calculateWinner, getWinnerLine } from '../Functions/Functions';

export interface BoardState {
  boardState: Array<SquareState>,
  latestMove: number,
}

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
    const history = [{
      boardState: Array(9).fill(null),
      latestMove: 0
    }];


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
    const boardState = current.boardState.slice() as Array<SquareState>;
    // const latestMove = current.latestMove;

    if (!isNullOrUndefined(boardState[i]) || this.state.winner) {
      return;
    }

    boardState[i] = this.state.xIsNext ? 'X' : 'O';
    const winner = calculateWinner(boardState);
    const winnerLine = getWinnerLine(boardState);

    this.setState({
      history: history.concat([{boardState:boardState, latestMove: i}]),
      stepNumber: history.length,
      winner,
      winnerLine,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step: number) {
    if (!this.state.winner) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0 ? false : true,
      })
    }
  }

  getStatusText() {
    if (this.state.winner) {
      return `Winner: ${this.state.winner}`;
    } else if (this.state.stepNumber >= 9) {
      return "It's a tie!";
    }

    return `Current turn: ${this.state.xIsNext ? 'X' : 'O'}`;
  }

  getPosition(i: number) {
    const positions = [[0,0], [0,1], [0,2], [1,0], [1,1], [1,2], [2,0], [2,1], [2,2]];
    return positions[i];
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const status = this.getStatusText();
    const moves = history.map((step, move) => {
      const position = this.getPosition(step.latestMove);
      const desc = move ? `Go to move #${move} (${position[0]}, ${position[1]})` : 'Go to game start';
      const bold = move === this.state.stepNumber ? 'bold' : '';

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className={bold}>{desc}</button>
        </li>
      )
    });

    return (
      <div className="App">

        <div className="Board">
          <Board
            squares={current.boardState}
            winnerLine={this.state.winnerLine}
            onClick={this.handleBoardClick}
          />
        </div>

        <GameControls
          reset={this.reset}
        />
        <div className="game-info">
          <div className="text-center">{status}</div>
          <div><ol>{moves}</ol></div>
        </div>
      </div>
    )
  }
}

export default App;