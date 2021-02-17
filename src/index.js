import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

class Square extends React.Component {
    render() {
        return (
            <button
                className="square"
                onClick={() => this.props.onClick()}
            >
                {this.props.value}
            </button>
        )
    }
}

class Board extends React.Component {

    renderBoard() {
        return Array(3).fill(null).map((_,row) =>
            (
                <div
                    key={row}
                    className="board-row"
                >
                    {this.renderRow(row)}
                </div>
            )
        );
    }

    renderRow(row) {
        return Array(3).fill(null).map((_,col) =>
            this.renderSquare(row*3 + col)
        );
    }

    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                {this.renderBoard()}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastHand: null,
            }],
            historyInc: true,
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = Array.from(current.squares);
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares,
                lastHand: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    historyOrderSwap() {
        const historyInc = !this.state.historyInc;
        this.setState({
            historyInc
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let status;
        if (winner === null) {
            status = `Player: ${this.state.xIsNext ? 'X' : 'O'}`;
        } else {
            status = `Winner: ${winner}`;
        }

        const moves = history.map((step, move) => {
            const desc = step.lastHand === null ?
                `Go to game Start` :
                `Go to move #${move} ${move % 2 ? 'X' : 'O'}(${step.lastHand % 3},${Math.floor(step.lastHand / 3)})`;
            return (
                <li key={move} className={this.state.stepNumber === move ? "history-current-step" : "history-other-step"}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div>
                    <div className="game-info">
                        <div>{status}</div>
                        <div className="game-history">
                            <label >
                                HistoryOrder:
                                <button
                                    value="history-order"
                                    onClick={() => this.historyOrderSwap()}
                                    className={`history-button-${this.state.historyInc ? 'increase' : 'decrease'}`}
                                >
                                    {this.state.historyInc ? 'INC' : 'DEC' }
                                </button>
                            </label>
                        </div>
                        <div>
                            Histories:
                            <ol>
                                {this.state.historyInc ? moves : moves.reverse()}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
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

ReactDOM.render(
  // <React.StrictMode>
  <Game />,
  // </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
