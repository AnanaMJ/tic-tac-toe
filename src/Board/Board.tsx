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
      index ={i}
      onClick = {this.props.onClick}
      isWinner = {isWinner}
    />
  }

  renderRow(j: number) {
    return (
      <div className="board-row">
        {this.renderSquare(j)}
        {this.renderSquare(j+1)}
        {this.renderSquare(j+2)}
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderRow(0)}
        {this.renderRow(3)}
        {this.renderRow(6)}
      </div>
    )
  }
}

export default Board;