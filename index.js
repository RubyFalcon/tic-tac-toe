function createGameBoard(row, col) {
    let board = [];
    for (let i = 0 ; i < row; i++){
        let boardRow = [];
        for (let j = 0; j < col; j++) {
            boardRow.push(" ");

        }
        board.push(boardRow);
    }
    return board;
}

function createGame() {
    const gameBoard = createGameBoard(3,3);
    return {
        gameBoard,
    }
}


console.table(gameBoard)