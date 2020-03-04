import React, { useState } from "react";
import "./App.css";
import { GameControls } from "../GameControls/GameControls";
import Board, { SquareState } from "../Board/Board";
import { isNullOrUndefined } from "util";
import { calculateWinner, getWinnerLine } from "../Functions/Functions";

export interface BoardState {
  boardState: Array<SquareState>;
  latestMove: number;
}

export interface AppState {
  history: Array<BoardState>;
  stepNumber: number;
  winner: SquareState;
  winnerLine?: Array<number>;
  xIsNext: boolean;
  isAscending: boolean;
}

const App: React.FC<{}> = () => {
  const [history, setHistory] = useState<Array<BoardState>>([
    {
      boardState: Array(9).fill(null),
      latestMove: 0
    }
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [winner, setWinner] = useState<SquareState>(null);
  const [winnerLine, setWinnerLine] = useState<Array<number> | undefined>(
    undefined
  );
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [isAscending, setIsAscending] = useState<boolean>(true);

  const reset = () => {
    setHistory([
      {
        boardState: Array(9).fill(null),
        latestMove: 0
      }
    ]);
    setStepNumber(0);
    setWinner(null);
    setWinnerLine(undefined);
    setXIsNext(true);
    setIsAscending(true);
  };

  const handleBoardClick = (i: number) => {
    const currentHistory = history.slice(0, stepNumber + 1);
    const current = currentHistory[currentHistory.length - 1];
    const boardState = current.boardState.slice() as Array<SquareState>;

    if (!isNullOrUndefined(boardState[i]) || winner) {
      return;
    }

    boardState[i] = xIsNext ? "X" : "O";
    const currentWinner = calculateWinner(boardState);
    const currentWinnerLine = getWinnerLine(boardState);

    setHistory(
      currentHistory.concat([{ boardState: boardState, latestMove: i }])
    );
    setStepNumber(currentHistory.length);
    setWinner(currentWinner);
    setWinnerLine(currentWinnerLine);
    setXIsNext(!xIsNext);
  };

  const handleSortToggle = () => {
    setIsAscending(!isAscending);
  };

  const jumpTo = (step: number) => {
    if (!winner) {
      setStepNumber(step);
      setXIsNext(step % 2 === 0 ? false : true);
    }
  };

  const getStatusText = () => {
    if (winner) {
      return `Winner: ${winner}`;
    } else if (stepNumber >= 9) {
      return "It's a tie!";
    }

    return `Current turn: ${xIsNext ? "X" : "O"}`;
  };

  const getPosition = (i: number) => {
    const positions = [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2]
    ];
    return positions[i];
  };

  const current = history[stepNumber];
  const status = getStatusText();
  const moves = history.map((step, move) => {
    const position = getPosition(step.latestMove);
    const desc = move
      ? `Go to move #${move} (${position[0]}, ${position[1]})`
      : "Go to game start";
    const bold = move === stepNumber ? "bold" : "";

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)} className={bold}>
          {desc}
        </button>
      </li>
    );
  });

  if (!isAscending) {
    moves.reverse();
  }

  return (
    <div className="App">
      <div className="Board">
        <Board
          squares={current.boardState}
          winnerLine={winnerLine}
          onClick={handleBoardClick}
        />
      </div>

      <GameControls reset={reset} />
      <div className="game-info">
        <div className="text-center">{status}</div>
        <button onClick={() => handleSortToggle()}>
          {isAscending ? "Set to descending order" : "Set to ascending order"}
        </button>
        <div>
          <ol>{moves}</ol>
        </div>
      </div>
    </div>
  );
};

export default App;
