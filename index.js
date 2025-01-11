
function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
  
    // Create a 2d array that will represent the state of the game board
    // For this 2d array, row 0 will represent the top row and
    // column 0 will represent the left-most column.
    // This nested-loop technique is a simple and common way to create a 2d array.
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  
    // This will be the method of getting the entire board that our
    // UI will eventually need to render it.
    const getBoard = () => board;
  
    // In order to add a piece , we need to make sure the X or O has not already been played in that row or column
    // selected column and row are checked for value using getValue
    // if they exist then we return false to our playround and do not switch player
    const playPiece = (row, column, player) => {
      // Our board's outermost array represents the row, innermost is the columns
      // 
      
      if (board[row][column].getValue() == "X" | board[row][column].getValue() == "O"){
        console.log("Invalid piece placement");
        return false;
      }
      board[row][column].addPiece(player);
      return true;
    };
  
    // This method will be used to print our board to the console.
    // It is helpful to see what the board looks like after each turn as we play,
    // but we won't need it after we build our UI
    const printBoard = () => {
      const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
      console.table(boardWithCellValues);
    };
  
    // Here, we provide an interface for the rest of our
    // application to interact with the board
    return { getBoard, playPiece, printBoard };
  }
  
  /*
  ** A Cell represents one "square" on the board and can have one of
  ** 0: no piece is in the square,
  ** 1: Player One's piece,
  ** 2: Player 2's piece
  */
  
  function Cell() {
    let value = " ";
  
    // Accept a player's piece to change the value of the cell
    const addPiece = (player) => {
      value = player;
    };
  
    // How we will retrieve the current value of this cell through closure
    const getValue = () => value;
  
    return {
      addPiece,
      getValue
    };
  }
  
  /* 
  ** The GameController will be responsible for controlling the 
  ** flow and state of the game's turns, as well as whether
  ** anybody has won the game
  */
  function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two",
    winnerValue = "",
    gameOverValue = false,
  ) {
    const board = Gameboard();
  
    const getBoardVal = (row,col) => board.getBoard()[row][col].getValue();
    const getRowVal = (row) =>  {
      let myRow = []
      for( let  i = 0; i <  board.getBoard()[row].length; i++) {
        myRow.push(board.getBoard()[row][i].getValue())
  
      }
      return myRow;
    }
   
    const players = [
      {
        name: playerOneName,
        piece: "X"
      },
      {
        name: playerTwoName,
        piece: "O"
      }
    ];
    let winner = winnerValue;
    let gameOver = gameOverValue;
  
    

    const allequal = arr => arr.every(v => v !== " " &&  v === arr[0]);

    const isgameOver  = () => {
      if(allequal(getRowVal(0))){
        gameOver = true;
    winner = getBoardVal(0,0)

}
if(allequal(getRowVal(1))){
        gameOver = true;
winner = getBoardVal(1,0)

}
  if(allequal(getRowVal(2))){
            gameOver = true;
winner = getBoardVal(2,0)

}

if(allequal([getBoardVal(0,0), getBoardVal(1,0), getBoardVal(2,0)])){
          gameOver = true;
   winner = getBoardVal(0,0)
}
if(allequal([getBoardVal(0,1), getBoardVal(1,1), getBoardVal(2,1)])){
          gameOver = true;
winner = getBoardVal(0,1)
}
 if(allequal([getBoardVal(0,2), getBoardVal(1,2), getBoardVal(2,2)])){
          gameOver = true;
winner = getBoardVal(0,2)
 }
   if(allequal([getBoardVal(0,0), getBoardVal(1,1), getBoardVal(2,2)])){
          gameOver = true;
 winner = getBoardVal(0,0)
}
     if(allequal([getBoardVal(0,2), getBoardVal(1,1), getBoardVal(2,0)])){
          gameOver = true;
   winner = getBoardVal(0,2)
}
  return gameOver;
    }
  let activePlayer = players[0];
    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;
  
    const printNewRound = () => {
      board.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
    };
  
    const playRound = (row, column) => {
      // Drop a piece for the current player
      console.log(
        ` ${getActivePlayer().name} plays ${getActivePlayer().piece} into column ${column} and row ${row}`
      );
      let valid = board.playPiece(row, column, getActivePlayer().piece);
  
      /*  This is where we would check for a winner and handle that logic,
          such as a win message. */
  
      // Switch player turn if the playRound was valid
      if (valid) {
        isgameOver();
        switchPlayerTurn();
      }
      if(!gameOver){
        printNewRound();
          
         
      }
      else if(gameOver) {
        console.log(`Game over ${winner} won the game`);
        
      }
      
      
      
    };
  
    // Initial play game message
    printNewRound();
  
    // For the console version, we will only use playRound, but we will need
    // getActivePlayer for the UI version, so I'm revealing it now
    return {
      playRound,
      getActivePlayer,
      getBoard: board.getBoard,
      isgameOver
    };
  }
  

  //DOM function

  function ScreenController(){
    let game = GameController();
    let playerTurn = document.querySelector(".turn");
    let container = document.querySelector(".container")

    const boardDiv = document.querySelector(".board");


    const updateScreen = () => {
      //board clear
      
      console.log(game.isgameOver())
      
      
  
      boardDiv.textContent = "";

      //get newest version of board and player
      const board = game.getBoard();
      const activePlayer = game.getActivePlayer();


      // 
      //Display player turn
       playerTurn.textContent = `${activePlayer.name}'s turn...`;
      
       // event listener for board
       function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;
        // Make sure I've clicked a column and not the gaps in between
        if (!selectedColumn || !selectedRow) return;
        game.playRound(selectedRow,selectedColumn);
        updateScreen();
      }
      //render each square
      board.forEach((row,rowIndex) => {
        row.forEach((cell, index) => {
          const cellButton = document.createElement("button");
          cellButton.classList.add("cell");
          cellButton.dataset.column = index;
          cellButton.dataset.row = rowIndex;
          cellButton.textContent = cell.getValue();
          cellButton.addEventListener("click", clickHandlerBoard);
          boardDiv.appendChild(cellButton);
        });  
        
        if (game.isgameOver()) {

          playerTurn.textContent = `Game over ${activePlayer.name} has won`;
          const playButton = document.createElement("button");
          playButton.classList.add("play")
          playButton.textContent = "PLay again"
          playButton.addEventListener("click", ()=> { 
            game = GameController()
          });
          container.appendChild(playButton)
        }

        
      });

      

    }
     // Initial render
     updateScreen();
  }
  ScreenController();
