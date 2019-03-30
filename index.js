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
	boardCells: [0, 1, 2, 3, 4, 5, 6, 7, 8],
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
	difficultyMode: "normal",
	humanSVG: CROSS,
	aiSVG: CIRCLE,
	human: "X",
	ai: "O",
};


//=====================================VIEW================================
let VIEW = {

	//PLACES THE CORRESPONDING SVG MARK IN THE TARGETED CELL
	placeMark(target, player) {
		let mark = player === DATA.human ? DATA.humanSVG : DATA.aiSVG;
		document.getElementById(target).innerHTML = mark;
	},


// DISPLAYS THE END GAME MESSAGE
	displayEndGame(message) {
		let result = document.querySelector(".result");
		let resultMessage = document.querySelector(".result-message");
		result.classList.add("result-active");
		resultMessage.innerHTML = message;
	},

//RESETS THE VIEW FOR A NEW GAME
	resetView() {
		let result = document.querySelector(".result");
		result.classList.remove("result-active");
		let cells = document.querySelectorAll(".cross-circle");
		for (let i = 0; i < cells.length; i++) {
			cells[i].remove();
		}
	},

	displayDifficulty(){
		let difficulty = document.getElementById("difficulty-display");
		difficulty.innerHTML = `PLAYING ON: ${DATA.difficultyMode} MODE`
	},

	weaponDisplay(){
		let cross = document.getElementById("cross-icon");
		let circle = document.getElementById("circle-icon");
		if(DATA.human === "X"){
			cross.classList.add("icon-active");
			circle.classList.remove("icon-active");
		}else{
			cross.classList.remove("icon-active");
			circle.classList.add("icon-active");
		}
	}
};


//=====================================MODIFIER================================
const MODIFIER = {


	//CHANGE THIS TO OUTSIDE CLICK EVENT
	startGame() {
		this.resetGame();
		cells.addEventListener('click', MODIFIER.turn, false);
	},

//RESETS BOARD AND CALLS THE RESETVIEW METHOD
	resetGame() {
		DATA.boardCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
		VIEW.resetView();
		cells.addEventListener('click', MODIFIER.turn, false);
	},

//RUNS A TURN BOTH FOR HUMAN AND AI
	turn(event) {
		if (typeof DATA.boardCells[event.target.id] === 'number') {
			this.playerMove(event.target.id, DATA.human)
			if (!this.checkWin(DATA.boardCells, DATA.human) && !this.checkTie()) this.playerMove(this.aiMove(), DATA.ai);
		}
	},


	//PLACES A MOVE BOTH IN THE BOARD AND IN THE DOM AND CHECKS FOR A WIN
	playerMove(id, player) {
		DATA.boardCells[id] = player;
		VIEW.placeMark(id, player);
		let winner = this.checkWin(DATA.boardCells, player);
		if (winner) this.gameOver(winner);
	},

//CHECKS IF THERE IS A WINNING COMBO FOR THE PLAYER
	checkWin(board, player) {
		for (let i = 0; i < DATA.winComb.length; i++) {
			let currArr = DATA.winComb[i];
			if (board[currArr[0]] === player && board[currArr[1]] === player && board[currArr[2]] === player) return {
				index: i,
				player: player
			};
		}
		return null;
	},

//REMOVES THE EVENT LISTENER AND DISPLAYS THE CORRESPONDING MESSAGE
	gameOver(winning) {
		cells.removeEventListener('click', MODIFIER.turn, false);
		let winner = winning.player === DATA.human ? "YOU WIN!" : winning.player === DATA.ai ? "YOU LOSE!" : "IT'S A TIE!";
		VIEW.displayEndGame(winner);
	},

	//CREATES AN ARRAY WITH THE EMPTY CELLS IN THE BOARD
	emptyCells() {
		let emptyCells = []
		for (let i = 0; i < DATA.boardCells.length; i++) {
		   if (DATA.boardCells[i] !== DATA.ai && DATA.boardCells[i] !== DATA.human) emptyCells.push(i);
		}
		return emptyCells;
	},


	//SELECTS A MOVE FOR THE AI DEPENDING ON THE DIFFICULTY SET
	aiMove() {
		if(DATA.difficultyMode === "hard"){
			return this.smartMove(DATA.boardCells, DATA.ai).index;
		}else if(DATA.difficultyMode === "easy"){
			return this.easyMove();
		}else{
			let toss = Math.random() * 2;
			if(toss > 1.2){
				return this.easyMove();
			}else{
				return this.smartMove(DATA.boardCells, DATA.ai).index;
			}
		}

	},

	//CHECKS IF THERE IS NO MORE CELLS AVAILABLE AND CALLS A TIE IF THERE IS
	checkTie() {
		if (this.emptyCells().length === 0) {
			this.gameOver({index: -1, player: "tie"});
			return true;
		}
		return false;
	},
//CHANGES THE GAMEMODE AT ANY TIME
	changeGameMode(mode){
 DATA.difficultyMode = mode;
 VIEW.displayDifficulty();
	},

	//CHANGES THE ICON THE PLAYER PLAYS WITH
	changeWeapon(weapon){
		if(weapon === "circle"){
			DATA.human = "O";
			DATA.ai = "X";
			DATA.humanSVG = CIRCLE;
			DATA.aiSVG = CROSS;
			VIEW.weaponDisplay();
		}else{
			DATA.human = "X";
			DATA.ai = "O";
			DATA.humanSVG = CROSS;
			DATA.aiSVG = CIRCLE;
			VIEW.weaponDisplay();
		}

	},

//CHOOSES A RANDOM EMPTY CELL FOR THE MOVE
	easyMove() {
		let emptyCells = this.emptyCells();
		let random = Math.floor(Math.random() * (emptyCells.length - 1));
		return emptyCells[random];
		// return emptyCells.length <= 0 ? null : emptyCells[random];
	 },
//MINMAX METHOD RESOLVES THE BEST SPOT FOR THE AI TO MOVE AND WIN
	smartMove(board, player) {
		let emptyCells = this.emptyCells();

		//checks for a winner or a tie during recursion and adds a score depending on the winner
		if (this.checkWin(board, DATA.human)) {
			return {
				score: -10
			};
		} else if (this.checkWin(board, DATA.ai)) {
			return {
				score: 10
			};
		} else if (emptyCells.length === 0) {
			return {
				score: 0
			};
		}
		//creates an array of moves and loops over the empty cells and calls itself for all possible moves
		let possibleMoves = [];
		for (let i = 0; i < emptyCells.length; i++) {
			let move = {};
			move.index = board[emptyCells[i]];
			board[emptyCells[i]] = player;
	
			if (player === DATA.ai) {
				let result = this.smartMove(board, DATA.human);
				move.score = result.score;
			} else {
				let result = this.smartMove(board, DATA.ai);
				move.score = result.score;
			}
			//sets the local image of the board to the move so the next recursion will play the following move
			board[emptyCells[i]] = move.index;
	
			possibleMoves.push(move);
		}
//loops through the moves scores and find the best one for the ai
		let bestMove;
		if (player === DATA.ai) {
			let bestScore = -10000;
			for (let i = 0; i < possibleMoves.length; i++) {
				if (possibleMoves[i].score > bestScore) {
					bestScore = possibleMoves[i].score;
					bestMove = i;
				}
			}
		} else {
			let bestScore = 10000;
			for (let i = 0; i < possibleMoves.length; i++) {
				if (possibleMoves[i].score < bestScore) {
					bestScore = possibleMoves[i].score;
					bestMove = i;
				}
			}
		}
	
		return possibleMoves[bestMove];
	}
}


const cells = document.getElementById("main-game");
MODIFIER.turn =  MODIFIER.turn.bind(MODIFIER);
MODIFIER.startGame();



//=====================================DOM EVENTS==============================

// document.getElementById("main-game").addEventListener("click", MODIFIER.startTurn.bind(MODIFIER));
// document.getElementById("reset").addEventListener("click", MODIFIER.resetPanel.bind(MODIFIER));

//CHANGE DIFFICULTY MODE
document.getElementById("easy-mode").addEventListener("click", () => MODIFIER.changeGameMode("easy"), false);
document.getElementById("hard-mode").addEventListener("click", () => MODIFIER.changeGameMode("hard"), false);
document.getElementById("normal-mode").addEventListener("click", () => MODIFIER.changeGameMode("normal"), false);


//CHANGE ICON TO PLAY WITH
document.getElementById("cross-icon").addEventListener("click", () => MODIFIER.changeWeapon("cross"), false);
document.getElementById("circle-icon").addEventListener("click", () => MODIFIER.changeWeapon("circle"), false);

//RESET GAME
document.getElementById("reset").addEventListener("click", MODIFIER.resetGame , false);
//=================================================