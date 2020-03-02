import { SquareState } from '../Board/Board';

export function calculateWinner(squares: Array<SquareState>): SquareState {
  const line = getWinnerLine(squares);

  if (line) {
    return squares[line[0]];
  }

  return null;
}

export function getWinnerLine(squares: Array<SquareState>): Array<number> | undefined {
  const lines = [
    // horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonally
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (const line of lines) {
    const [a,b,c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return line;
    }
  }

  return undefined;
}