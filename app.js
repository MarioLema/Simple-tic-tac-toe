const CROSS = `<svg version="1.1" id="Capa_2" class="cross-circle" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 47.971 47.971" style="enable-background:new 0 0 47.971 47.971;" xml:space="preserve">
<g>
<path d="M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88
   c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242
   C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879
   s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z"/>
</g>
</svg>`;
const CIRCLE = `<svg version="1.1" id="Capa_1" class="cross-circle" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
width="438.533px" height="438.533px" viewBox="0 0 438.533 438.533" style="enable-background:new 0 0 438.533 438.533;"
xml:space="preserve">
<g>
<path d="M409.133,109.203c-19.608-33.592-46.205-60.189-79.798-79.796C295.736,9.801,259.058,0,219.273,0
   c-39.781,0-76.47,9.801-110.063,29.407c-33.595,19.604-60.192,46.201-79.8,79.796C9.801,142.8,0,179.489,0,219.267
   c0,39.78,9.804,76.463,29.407,110.062c19.607,33.592,46.204,60.189,79.799,79.798c33.597,19.605,70.283,29.407,110.063,29.407
   s76.47-9.802,110.065-29.407c33.593-19.602,60.189-46.206,79.795-79.798c19.603-33.596,29.403-70.284,29.403-110.062
   C438.533,179.485,428.732,142.795,409.133,109.203z M353.742,297.208c-13.894,23.791-32.736,42.633-56.527,56.534
   c-23.791,13.894-49.771,20.834-77.945,20.834c-28.167,0-54.149-6.94-77.943-20.834c-23.791-13.901-42.633-32.743-56.527-56.534
   c-13.897-23.791-20.843-49.772-20.843-77.941c0-28.171,6.949-54.152,20.843-77.943c13.891-23.791,32.738-42.637,56.527-56.53
   c23.791-13.895,49.772-20.84,77.943-20.84c28.173,0,54.154,6.945,77.945,20.84c23.791,13.894,42.634,32.739,56.527,56.53
   c13.895,23.791,20.838,49.772,20.838,77.943C374.58,247.436,367.637,273.417,353.742,297.208z"/>
</g>
</svg>`;
//=====================================DATA HOLDER================================

let DATA = {
   boardCells: ["", "", "", "", "", "", "", "", ""],
   winComb: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [6, 4, 2]
   ],
   hardMode: false,
   player: CROSS,
   computer: CIRCLE
};


//=====================================VIEW================================
let VIEW = {
   placeMark(target, who) {
      target.innerHTML = DATA[who];
   },

   getTarget(index) {
      let targetId = `local-${index + 1}`;
      return document.getElementById(targetId);
   },

   displayEndGame(message) {
      let result = document.querySelector(".result");
      let resultMessage = document.querySelector(".result-message");
      result.classList.add("result-active");
      resultMessage.innerHTML = message;
   },
   resetView() {
      let result = document.querySelector(".result");
      result.classList.remove("result-active");
      let cells = document.querySelectorAll(".cross-circle");
      for (let i = 0; i < cells.length; i++) {
         cells[i].remove();
      }
   }
};

//=====================================MODIFIER================================
let MODIFIER = {

   //MANAGES EACH TURN
   startTurn(event) {
      let target = event.target;
      let index = target.id[6] - 1;
      if (this.checkPos(index)) { //IF THE SPACE CLICKED IS FREE

         VIEW.placeMark(target, "player"); //PLACE MARKER BOTH IN DOM AND BOARD ARRAY
         DATA.boardCells[index] = "CROSS";

         if (this.checkWin("CROSS", DATA.boardCells)) { // PERFORMS A WIN CHECK FOR PLAYER
            VIEW.displayEndGame("YOU WIN!");
            DATA.boardCells = DATA.boardCells.map(x => x = "PLAYER")
            return;
         };

         let aiMove = this.choosePos(); //CHOOSES A POSITION FOR AI MOVE
         if (aiMove === null) { //IF NO POSITION AVAILABLE, IT IS A TIE
            VIEW.displayEndGame("IT'S A TIE");
            return
         } else { // ELSE MOVE AI MARKER INTO POSITION
            VIEW.placeMark(VIEW.getTarget(aiMove), "computer")
            DATA.boardCells[aiMove] = "CIRCLE";


            if (this.checkWin("CIRCLE", DATA.boardCells)) { //PERFORM A WIN CHECK FOR THE AI
               VIEW.displayEndGame("YOU LOSE!");
               DATA.boardCells = DATA.boardCells.map(x => x = "COMPUTER")
               return;
            };
         }
      };

   },


   //CHECKS IF A POSITION IS ALREADY FILLED
   checkPos(index) {
      return DATA.boardCells[index] === "" ? true : false;
   },



   //CALLS FOR A DIFFERENT FUNCTION TO CHOOSE A POSITION FOR AI
   choosePos() {
      return DATA.hardMode ? this.hardPosition(DATA.boardCells) : this.easyPosition();
   },

   //FINDS A RANDOM INDEX OF AN EMPTY CELL
   easyPosition() {
      let emptyCells = []
      for (let i = 0; i < DATA.boardCells.length; i++) {
         if (DATA.boardCells[i] === "") emptyCells.push(i);
      }
      let random = Math.floor(Math.random() * (emptyCells.length - 1));
      return emptyCells.length <= 0 ? null : emptyCells[random];
   },


   //MIN MAX ALGORITHM
   hardPosition(emptyCells) {
      if (emptyCells.length <= 0) return null;

   },


   //CHEKS FOR A WINNING COMBINATION ON THE BOARD PASSED
   checkWin(player, board) {
      for (let i = 0; i < DATA.winComb.length; i++) {
         let currArr = DATA.winComb[i];
         if (board[currArr[0]] === player && board[currArr[1]] === player && board[currArr[2]] === player) return true;
      }
      return false;
   },


   //RESETS THE BOARD AND THE VIEW
   resetPanel() {
      DATA.boardCells = ["", "", "", "", "", "", "", "", ""];
      VIEW.resetView();
   },


   //CHANGES THE GAME MODE 
   changeGameMode(mode) {
      mode === "easy" ? DATA.hardMode = false : DATA.hardMode = true;
   }
}

//=====================================DOM EVENTS==============================

document.getElementById("main-game").addEventListener("click", MODIFIER.startTurn.bind(MODIFIER));
document.getElementById("reset").addEventListener("click", MODIFIER.resetPanel.bind(MODIFIER));
document.getElementById("easy-mode").addEventListener("click", () => MODIFIER.changeGameMode("easy"));
document.getElementById("hard-mode").addEventListener("click", () => MODIFIER.changeGameMode("hard"));
//=================================================




/*
lets visualize the above game state
                                   O |   | X
                                   ---------
                                   X |   | X
                                   ---------
                                     | O | O
                             //       ||        \\
                O | X | X          O |   | X        O |   | X
                ---------          ---------        ---------
                X |   | X          X | X | X        X |   | X
                ---------          ---------        ---------
                  | O | O            | O | O        X | O | O
              //          \\                     //          \\
        O | X | X          O | X | X        O | O | X       O |   | X
        ---------          ---------        ---------       ---------
        X | O | X          X |   | X        X |   | X       X | O | X
        ---------          ---------        ---------       ---------
          | O | O          O | O | O        X | O | O       X | O | O
                                        //
                                   O | O | X
                                   ---------
                                   X | X | X
                                   ---------
                                   O | O | O
*/
// human
var huPlayer = "O";
// ai
var aiPlayer = "X";

// this is the board flattened and filled with some values to easier asses the Artificial Inteligence.
var origBoard = ["O", 1, "X", "X", 4, "X", 6, "O", "O"];
//var origBoard = [0,1 ,2,3,4 ,5, 6 ,7,8];

//keeps count of function calls
var fc = 0;

// finding the ultimate play on the game that favors the computer
var bestSpot = minimax(origBoard, aiPlayer);

//loging the results
console.log("index: " + bestSpot.index);
console.log("function calls: " + fc);

// the main minimax function
function minimax(newBoard, player) {
   //add one to function calls
   fc++;

   //available spots
   var availSpots = emptyIndexies(newBoard);

   // checks for the terminal states such as win, lose, and tie and returning a value accordingly
   if (winning(newBoard, huPlayer)) {
      return {
         score: -10
      };
   } else if (winning(newBoard, aiPlayer)) {
      return {
         score: 10
      };
   } else if (availSpots.length === 0) {
      return {
         score: 0
      };
   }

   // an array to collect all the objects
   var moves = [];

   // loop through available spots
   for (var i = 0; i < availSpots.length; i++) {
      //create an object for each and store the index of that spot that was stored as a number in the object's index key
      var move = {};
      move.index = newBoard[availSpots[i]];

      // set the empty spot to the current player
      newBoard[availSpots[i]] = player;

      //if collect the score resulted from calling minimax on the opponent of the current player
      if (player == aiPlayer) {
         var result = minimax(newBoard, huPlayer);
         move.score = result.score;
      } else {
         var result = minimax(newBoard, aiPlayer);
         move.score = result.score;
      }

      //reset the spot to empty
      newBoard[availSpots[i]] = move.index;

      // push the object to the array
      moves.push(move);
   }

   // if it is the computer's turn loop over the moves and choose the move with the highest score
   var bestMove;
   if (player === aiPlayer) {
      var bestScore = -10000;
      for (var i = 0; i < moves.length; i++) {
         if (moves[i].score > bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
         }
      }
   } else {

      // else loop over the moves and choose the move with the lowest score
      var bestScore = 10000;
      for (var i = 0; i < moves.length; i++) {
         if (moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
         }
      }
   }

   // return the chosen move (object) from the array to the higher depth
   return moves[bestMove];
}

// returns the available spots on the board
function emptyIndexies(board) {
   return board.filter(s => s != "O" && s != "X");
}

// winning combinations using the board indexies for instace the first win could be 3 xes in a row
function winning(board, player) {
   if (
      (board[0] == player && board[1] == player && board[2] == player) ||
      (board[3] == player && board[4] == player && board[5] == player) ||
      (board[6] == player && board[7] == player && board[8] == player) ||
      (board[0] == player && board[3] == player && board[6] == player) ||
      (board[1] == player && board[4] == player && board[7] == player) ||
      (board[2] == player && board[5] == player && board[8] == player) ||
      (board[0] == player && board[4] == player && board[8] == player) ||
      (board[2] == player && board[4] == player && board[6] == player)
   ) {
      return true;
   } else {
      return false;
   }
}