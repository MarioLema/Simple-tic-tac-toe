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
	hardMode: false,
	humanSVG: CROSS,
	aiSVG: CIRCLE,
	human: "X",
	ai: "O",
};


//=====================================VIEW================================
let VIEW = {
	placeMark(target, player) {
		let mark = player === DATA.human ? DATA.humanSVG : DATA.aiSVG;
		document.getElementById(target).innerHTML = mark;
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
const cells = document.getElementById("main-game");
startGame();

function startGame() {
	clearGame();
	cells.addEventListener('click', turnClick, false);
}

function clearGame() {
	DATA.boardCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	VIEW.resetView();
}


function turnClick(event) {
	console.log(event.target);
	if (typeof DATA.boardCells[event.target.id] === 'number') {
		turn(event.target.id, DATA.human)
		if (!checkWin(DATA.boardCells, DATA.human) && !checkTie()) turn(bestSpot(), DATA.ai);
	}
}

function turn(id, player) {
	DATA.boardCells[id] = player;
	VIEW.placeMark(id, player);
	let gameWon = checkWin(DATA.boardCells, player);
	if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
	for (let i = 0; i < DATA.winComb.length; i++) {
		let currArr = DATA.winComb[i];
		if (board[currArr[0]] === player && board[currArr[1]] === player && board[currArr[2]] === player) return {
			index: i,
			player: player
		};
	}
	return null;
}

function gameOver(gameWon) {
		cells.removeEventListener('click', turnClick, false);
	let winner = gameWon.player === DATA.human ? "YOU WIN!" : gameWon.player === DATA.ai ? "YOU LOSE!" : "IT'S A TIE!";
	VIEW.displayEndGame(winner);
}

function emptySquares() {
	let emptyCells = []
	for (let i = 0; i < DATA.boardCells.length; i++) {
	   if (DATA.boardCells[i] !== DATA.ai && DATA.boardCells[i] !== DATA.human) emptyCells.push(i);
	}
	return emptyCells;
}

function bestSpot() {
	return minimax(DATA.boardCells, DATA.ai).index;
}

function checkTie() {
	if (emptySquares().length === 0) {
		cells.removeEventListener('click', turnClick, false);
		VIEW.displayEndGame("IT'S A TIE");
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, DATA.human)) {
		return {
			score: -10
		};
	} else if (checkWin(newBoard, DATA.ai)) {
		return {
			score: 10
		};
	} else if (availSpots.length === 0) {
		return {
			score: 0
		};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == DATA.ai) {
			var result = minimax(newBoard, DATA.human);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, DATA.ai);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if (player === DATA.ai) {
		var bestScore = -10000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}