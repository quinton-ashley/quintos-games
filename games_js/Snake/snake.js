// screen size: 160x144 pixels
// text rows: 18 cols: 20

let score = 0; // number of apples eaten
let speed = 0.5; // snake speed

text('SCORE: ' + score, 17, 0);
text('SPEED: ' + score, 17, 11);

let egg = world.createSprite('egg', 5, 10, 1);

for (let i = 0; i < 15; i++) {
	for (let j = 0; j < 20; j++) {
		let rand = Math.floor(Math.random() * 9);
		world.createSprite('grass' + rand, i, j);
	}
}

for (let i = 0; i < 18; i++) {
	let pipeType = 'pipe-middle';
	if (i == 0) {
		pipeType = 'pipe-start';
	} else if (i == 17) {
		pipeType = 'pipe-end';
	}
	pipes.createSprite(pipeType, 0, i + 1, 1);
	pipes.createSprite(pipeType, 14, i + 1, 1);
}

for (let i = 0; i < 13; i++) {
	let pipeType = 'pipe-middle';
	if (i == 0) {
		pipeType = 'pipe-start';
	} else if (i == 12) {
		pipeType = 'pipe-end';
	}
	let pipe = pipes.createSprite(pipeType, i + 1, 0, 1);
	pipe.rotation = 90;
	let pipe2 = pipes.createSprite(pipeType, i + 1, 19, 1);
	pipe2.rotation = 90;
}

pipes.createSprite('pipe-topLeft', 0, 0, 1);
pipes.createSprite('pipe-topRight', 0, 19, 1);
pipes.createSprite('pipe-bottomLeft', 14, 0, 1);
pipes.createSprite('pipe-bottomRight', 14, 19, 1);

let inputDirection = 'up';

snake.createSprite('head-up', 11, 2, 2).direction = 'up';
snake.createSprite('body-up', 12, 2, 2).direction = 'up';
snake.createSprite('tail-up', 13, 2, 2).direction = 'up';

function changeSnakeAni(s, type, direction) {
	if (direction == 'up') {
		s.ani(type + '-up');
		s.mirrorX(1);
		s.mirrorY(1);
	} else if (direction == 'down') {
		s.ani(type + '-up');
		s.mirrorX(1);
		s.mirrorY(-1);
	} else if (direction == 'left') {
		s.ani(type + '-left');
		s.mirrorX(1);
		s.mirrorY(1);
	} else {
		s.ani(type + '-left');
		s.mirrorX(-1);
		s.mirrorY(1);
	}
}

function placeEgg() {
	let avail = [];
	for (let row = 1; row < 14; row++) {
		for (let col = 1; col < 19; col++) {
			let snakeSpace = false;
			for (let i = 0; i < snake.length; i++) {
				if (snake[i].row == row && snake[i].col == col) {
					snakeSpace = true;
				}
			}
			if (snakeSpace == false) {
				avail.push([row, col]);
			}
		}
	}
	log(avail);
	let idx = Math.floor(Math.random() * avail.length);
	let coord = avail[idx];
	egg.row = coord[0];
	egg.col = coord[1];
}

async function moveSnake() {
	let movements = [];
	if (snake[0].row == egg.row && snake[0].col == egg.col) {
		speed += 0.1;
		snake.createSprite(snake[1].getAnimationLabel(), snake[1].row, snake[1].col, 2);
		snake.splice(1, 0, snake.pop());
		movements.push(snake[1].move(snake[0].direction, speed));
		movements.push(snake[0].move(inputDirection, speed));
		await Promise.all(movements);
		placeEgg();
		moveSnake();
		return;
	}
	for (let i = snake.toArray().length - 1; i >= 0; i--) {
		let s = snake[i];
		// move the snake
		let type = s.getAnimationLabel().split('-')[0];
		if (type == 'head' || type == 'eat') {
			if (s.row >= egg.row - 2 && s.row <= egg.row + 2 && s.col >= egg.col - 2 && s.col <= egg.col + 2) {
				type = 'eat';
			} else {
				type = 'head';
			}

			s.direction = inputDirection;
		} else {
			s.direction = snake[i - 1].direction;
		}

		changeSnakeAni(s, type, s.direction);

		if (type == 'head' || type == 'eat') {
			movements.push(s.move(s.direction, speed));
		} else {
			movements.push(s.move(s.direction, speed));
		}
	}
	await Promise.all(movements);
	moveSnake();
}

moveSnake();

function draw() {
	background(colorPal(2));

	snake.collide(pipes);

	drawSprites();
}

function keyPressed() {
	if (key == 'ArrowUp' && snake[0].direction != 'down') {
		inputDirection = 'up';
	} else if (key == 'ArrowDown' && snake[0].direction != 'up') {
		inputDirection = 'down';
	} else if (key == 'ArrowLeft' && snake[0].direction != 'right') {
		inputDirection = 'left';
	} else if (key == 'ArrowRight' && snake[0].direction != 'left') {
		inputDirection = 'right';
	}

	log(inputDirection);
}
