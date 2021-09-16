const log = console.log;

const title = `
TTTTT IIIII   CCC
  T     I    C
  T     I    C
  T     I    C
  T   IIIII   CCC

TTTTT  AAA    CCC
  T   A   A  C
  T   AAAAA  C
  T   A   A  C
  T   A   A   CCC

TTTTT  OOO   EEEE
  T   O   O  E
  T   O   O  EEE
  T   O   O  E
  T    OOO   EEEE`.slice(1);

pc.text(title, 5, 6);

const bigSpace = '        \n'.repeat(7);

const bigO = `
 OOOOOO
OO    OO
OO    OO
OO    OO
OO    OO
OO    OO
 OOOOOO`.slice(1);

const bigX = `
XX    XX
 XX  XX
  XXXX
   XX
  XXXX
 XX  XX
XX    XX`.slice(1);

const gridX = 26;
const gridY = 3;

/* PART A: finish the grid of 9x8 spaces */
pc.text('─'.repeat(26), gridX, gridY + 7);
pc.text('─'.repeat(26), gridX, gridY + 15); // draw another horizontal line

pc.text('│\n'.repeat(23), gridX + 8, gridY);
pc.text('│\n'.repeat(23), gridX + 17, gridY); // draw another vertical line

// board stores the game data
// in a two dimensional array of spaces
let board = [
	[' ', ' ', ' '],
	[' ', ' ', ' '],
	[' ', ' ', ' ']
];

// create buttons with nested for loop
for (let row = 0; row < 3; row++) {
	for (let col = 0; col < 3; col++) {
		// create button
		pc.button(bigSpace, gridX + col * 9, gridY + row * 8, () => {
			btnClicked(row, col);
		});
	}
}

// called when a button is clicked
async function btnClicked(row, col) {
	if (disableBoard) return;

	// coordinate position of button in btns
	// and the corresponding positions in board
	log(row + ', ' + col);
	let x = gridX + col * 9;
	let y = gridY + row * 8;

	if (board[row][col] != ' ') {
		disableBoard = true;
		await pc.alert('This space is occupied', 57, 20, 20);
		disableBoard = false;
		return;
	}

	let tile;

	if (turnX) {
		tile = 'X';
		board[row][col] = tile;
		// place bigX text
		await pc.text(bigX, x, y);
	} else {
		tile = 'O';
		board[row][col] = tile;
		await pc.text(bigO, x, y);
	}
	// show the board in the console
	log(board.map((el) => el.join('|')).join('\n'));

	// if true there was a winner
	if (winnerCheck(tile)) {
		if (turnX) {
			scoreX += 1;
		} else {
			scoreO += 1;
		}
		updateScore();
		disableBoard = true;
		await pc.alert('Player ' + tile + ' you won!', 57, 20, 20);

		if (turnX && challengeMode && aiLevel < 3) {
			aiLevel++;
			await pc.alert('AI level increased to ' + aiLevel, 57, 20, 20);
		}
		disableBoard = false;
		await reset();
		startGame();
	} else if (drawCheck(board)) {
		disableBoard = true;
		await pc.alert('Draw!', 57, 20, 20);
		disableBoard = false;
		await reset();
		startGame();
	} else {
		// change turns
		turnX = !turnX;
		turnCount++;
		if (turnX) {
			pc.text('Turn : X', 60, 2);
		} else {
			pc.text('Turn : O', 60, 2);
			if (onePlayer) aiTurn();
		}
	}
}

let disableBoard = true;
let onePlayer;
let aiLevel;
let challengeMode = false;

let start1Btn = pc.button('1 Player Start', 60, 14, () => {
	onePlayer = true;
	aiPick();
});
let start2Btn = pc.button('2 Player Start', 60, 16, () => {
	onePlayer = false;
	start1Btn.erase();
	start2Btn.erase();
	startGame();
});

// if turnX is true it is player x's turn
// if turnX is false it is player o's turn
let turnX;
let turnCount = 0;
let scoreX = 0;
let scoreO = 0;

function updateScore() {
	pc.text("X's score : " + scoreX, 60, 4);
	pc.text("O's score : " + scoreO, 60, 6);
}

async function reset() {
	for (let row = 0; row < 3; row++) {
		for (let col = 0; col < 3; col++) {
			board[row][col] = ' ';
			await pc.text(bigSpace, gridX + col * 9, gridY + row * 8);
		}
	}
}

function startGame() {
	turnCount = 0;
	turnX = Math.random() < 0.5;
	if (turnX) {
		pc.text('Turn : X', 60, 2);
	} else {
		pc.text('Turn : O', 60, 2);
	}
	updateScore();
	disableBoard = false;
	// human is X, ai is always O
	if (onePlayer && !turnX) aiTurn();
}

//choosing ai level
function aiPick() {
	start1Btn.erase();
	start2Btn.erase();

	let aiBtns = [];
	let aiCMBtn;

	let pick = () => {
		for (let i = 0; i < 4; i++) {
			aiBtns[i].erase();
		}
		aiCMBtn.erase();
		startGame();
	};

	for (let i = 0; i < 4; i++) {
		aiBtns.push(
			pc.button('AI Level ' + i, 60, 12 + i * 2, () => {
				aiLevel = i;
				pick();
			})
		);
	}
	aiCMBtn = pc.button('Challenge Mode', 60, 20, () => {
		aiLevel = 0;
		challengeMode = true;
		pick();
	});
}

function hardAI(tile) {
	// go through whole board
	for (let row = 0; row < 3; row++) {
		for (let col = 0; col < 3; col++) {
			// skip spaces that are not blank
			if (board[row][col] != ' ') continue;
			// make copy of board
			// ... is called the spread operator
			// used here to clone the row arrays of board
			let b = [[...board[0]], [...board[1]], [...board[2]]];
			// put tile in spot
			b[row][col] = tile;
			log(
				'ai test ' + tile + ' at ',
				row,
				col,
				'\n' + b.map((el) => el.join('|')).join('\n-----\n')
			);
			// test tile
			if (winnerCheck(tile, b)) {
				// ai goes in that spot
				btnClicked(row, col);
				return true;
			}
		}
	}
	return false;
}

function aiTurn() {
	log('ai turn');

	if (aiLevel == 3 && turnCount == 0) {
		log('aiLvl 3');
		// always go center first turn
		btnClicked(1, 1);
		return true;
	} else if (aiLevel == 3 && turnCount == 1) {
		log('aiLvl 3');
		// always take center if available, if not take corner
		if (board[1][1] == ' ') {
			btnClicked(1, 1);
			return true;
		} else {
			if (Math.random() < 0.5) {
				i = 0;
			} else {
				i = 2;
			}
			if (Math.random() < 0.5) {
				j = 0;
			} else {
				j = 2;
			}
			btnClicked(i, j);
			log(i, j);
			return true;
		}
	} else if (aiLevel == 2 || aiLevel == 3) {
		log('aiLvl 2');
		// smart ai
		// try to win
		if (hardAI('O')) return; // move was made, return to end aiTurn
		// prevent opponent from winning
		if (hardAI('X')) return;

		// didn't find any winning or blocking moves
	}

	if (aiLevel == 0) {
		log('aiLvl 0');
		// go in the first available space
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (board[i][j] == ' ') {
					// ai make move
					btnClicked(i, j);
					return;
				}
			}
		}
	} else if (aiLevel == 1 || aiLevel == 2 || aiLevel == 3) {
		log('aiLvl 1');
		// available spaces coordinates
		let avail = [];
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (board[i][j] == ' ') {
					avail.push([i, j]);
				}
			}
		}
		/* EXAMPLE:
		board = [
			['X', ' ', ' ']
			[' ', 'O', ' ']
			[' ', 'X', ' ']
		];

		avail = [
			[0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]
		];
		*/
		// pick a random available space coordinates
		let rand = Math.floor(Math.random() * avail.length);
		let pick = avail[rand];
		// ai make move
		btnClicked(pick[0], pick[1]);
	}
}

// checks for winner
// take a tile as input
function winnerCheck(t, b) {
	if (!b) b = board;

	for (let i = 0; i < 3; i++) {
		// checking horizontals
		if (b[i][0] == t && b[i][1] == t && b[i][2] == t) {
			return true;
		}
		// checking verticals
		if (b[0][i] == t && b[1][i] == t && b[2][i] == t) {
			return true;
		}
	}
	// checking diagonals
	if (b[0][0] == t && b[1][1] == t && b[2][2] == t) {
		return true;
	} else if (b[0][2] == t && b[1][1] == t && b[2][0] == t) {
		return true;
	}
	// no winner
	return false;
}

// if there is a draw this function will return true

function drawCheck(b) {
	for (let i = 0; i < 3; i++) {
		// rows
		for (let j = 0; j < 3; j++) {
			// cols
			if (b[i][j] == ' ') {
				return false;
			}
		}
	}
	return true;
}
