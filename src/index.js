import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square value={this.props.squares[i]} onClick={() => {
            this.props.onClick(i)
        }}/>;
    }

    render() {
        return (
            <div>
                <div className="status">{this.props.status}</div>
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
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            stepNumber: 0,
            botActive: true
        };
    }

    calculateWinner(squares) {
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
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (this.calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext || !this.state.botActive ? 'X' : 'O';

        if (this.state.botActive && !this.calculateWinner(squares)) {
            console.log(squares);
            this.calculateSpot('O', squares, 'O')
        }

        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: this.state.botActive ? true : !this.state.xIsNext,
        });
    }

    calculateSpot(player, squares, placement) {
        //Calculating options
        const possibleBot = [
            JSON.stringify([player, player, null]),
            JSON.stringify([null, player, player]),
            JSON.stringify([player, null, player])
        ];

        let theRes1 = JSON.stringify(squares.slice(0, 3));
        let theRes2 = JSON.stringify(squares.slice(3, 6));
        let theRes3 = JSON.stringify(squares.slice(6, 9));
        let theRes4 = JSON.stringify([squares[0], squares[3], squares[6]]);
        let theRes5 = JSON.stringify([squares[1], squares[4], squares[7]]);
        let theRes6 = JSON.stringify([squares[2], squares[5], squares[8]]);
        let theRes7 = JSON.stringify([squares[0], squares[4], squares[8]]);
        let theRes8 = JSON.stringify([squares[2], squares[4], squares[6]]);

        if (theRes1 === possibleBot[0] || theRes6 === possibleBot[1] || theRes8 === possibleBot[1]) {
            squares[2] = placement;
        } else if (theRes1 === possibleBot[1] || theRes4 === possibleBot[1] || theRes7 === possibleBot[1]) {
            squares[0] = placement;
        } else if (theRes2 === possibleBot[0] || theRes6 === possibleBot[2]) {
            squares[5] = placement;
        } else if (theRes2 === possibleBot[1] || theRes4 === possibleBot[2]) {
            squares[3] = placement;
        } else if (theRes3 === possibleBot[0] || theRes6 === possibleBot[0] || theRes7 === possibleBot[0]) {
            squares[8] = placement;
        } else if (theRes4 === possibleBot[0] || theRes8 === possibleBot[0] || theRes3 === possibleBot[1]) {
            squares[6] = placement;
        } else if (theRes5 === possibleBot[0] || theRes3 === possibleBot[2]) {
            squares[7] = placement;
        } else if (theRes5 === possibleBot[1] || theRes1 === possibleBot[2]) {
            squares[1] = placement;
        } else if (theRes2 === possibleBot[2] || theRes5 === possibleBot[2] || theRes7 === possibleBot[2] || theRes8 === possibleBot[2]) {
            squares[4] = placement;
        } else if (player !== placement && !(this.state.stepNumber === 4)) {
            if (!squares[4]) {
                squares[4] = placement;
            } else if (!squares[0]) {
                squares[0] = placement;
            } else {
                let rand;
                do {
                    rand = Math.floor(Math.random() * 10);
                    console.log(rand);
                } while (squares[rand] !== null) ;
                squares[rand] = placement;
            }
        } else {
            if (this.state.stepNumber === 4) {
                return;
            }
            this.calculateSpot('X', squares, 'O');
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        status={status}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const
    root = ReactDOM.createRoot(document.getElementById("root"));
root
    .render(
        <Game/>)
;
