import * as React from 'react';
import { Square } from '../Square/Square';

export type SquareState = 'X' | 'O' | null;

export interface BoardProps {
  onClick(index: number): void;
  squares: Array<SquareState>;
  winnerLine?: Array<number>;
}

class Board extends React.Component<BoardProps> {
  renderSquare(i: number): React.ReactNode {
    const isWinner = this.props.winnerLine && this.props.winnerLine.indexOf(i) > -1;

    return <Square
      value={this.props.squares[i]}
      index={i}
      key={i}
      onClick={this.props.onClick}
      isWinner={isWinner}
    />
  }

  createBoard(row: number, col: number) {
    const board = [];
    let cellCounter: number = 0;

    for (let i = 0; i < row; i += 1) {
      const columns = [];
      for (let j = 0; j < col; j += 1) {
        columns.push(this.renderSquare(cellCounter++));
      }
      board.push(<div key={i} className="board-row">{columns}</div>)
    }

    return board;
  }

  render() {
    return (
      <div>
        {this.createBoard(3, 3)}
      </div>
    )
  }
}

export default Board;