import { useState } from 'react';
import './App.css';

type Squares = Array<string|null>;

export default function App() {
    const [player, setPlayer] = useState("X");
    const [board, setBoard] = useState(Array<string|null>(9).fill(null));
    const [history, setHistory] = useState([board]);

    function handlePlay() {
        setBoard(board.slice());
        setHistory([...history, board]);

        if (player == "X") {
            setPlayer("O");
        } else {
            setPlayer("X");
        }
    }

    function goToMove(squares: Squares) {
        setBoard(squares);
    }

    const moves = history.slice(1).map((squares, idx) => {
        return (
            <li key={idx}>
                <button onClick={() => goToMove(squares)}>
                    {"go to move #" + (idx + 1)}
                </button>
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board board={board} player={player} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

interface BoardAttributes {
    board: Squares;
    player: string;
    onPlay(): void;
}

function Board(attributes: BoardAttributes) {
    const [winner, setWinner] = useState<string|null>(null);
    const [reds, setReds] = useState(Array<boolean>(9).fill(false));

    function handleBoardClick(idx: number) {
        if (winner || attributes.board[idx]) {
            return;
        }

        attributes.board[idx] = attributes.player;

        let winningLine = getWinningLine(attributes.board);
        if (winningLine) {
            const nextReds = reds.slice();
            winningLine.forEach((k) => {
                nextReds[k] = true;
            });
            setReds(nextReds);
            setWinner(attributes.player);
        } else if (attributes.board.every((value) => value !== null)) {
            setWinner("NOBODY!");
        }

        attributes.onPlay();
    }

    return (
        <>
            <div className="status">
                {winner ? "Winner is " + winner : "Next player: " + attributes.player}
            </div>
            {[0, 3, 6].map((offset, _) => (
                <div className="board-row">
                    {[0, 1, 2].map((idx, _) => (
                        <Square
                            value={attributes.board[offset + idx]}
                            red={reds[offset + idx]}
                            onClick={() => handleBoardClick(offset + idx)}
                        />
                    ))}
                </div>
            ))}
        </>
    );
}

interface SquareAttributes {
    value: string|null;
    red: boolean;
    onClick(): void;
}

function Square(attributes: SquareAttributes) {
    return (
        <button
            className={attributes.red === true ? "square winner" : "square"}
            onClick={attributes.onClick}
        >
            {attributes.value}
        </button>
    );
}

function getWinningLine(board: Squares): number[]|null {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            return lines[i];
        }
    }
    return null;
}
