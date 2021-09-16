// screen width is 640, height is 800
const log = console.log;

let imgBall = spriteArt(`
..bbby
.wbbbyb
wbbbyybw
byyyybbb
yybbybbb
wbbbyybb
.bbbbyb
..wbby`);

let imgPlatform = spriteArt(
	' ' +
		'w'.repeat(52) +
		' \n' +
		'w'.repeat(54) +
		'\n' +
		('ww' + ' '.repeat(50) + 'ww\n').repeat(4) +
		'w'.repeat(54) +
		'\n' +
		' ' +
		'w'.repeat(52)
);

class Ball {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.w = r * 2;
		this.h = r * 2;
		this.vel = {
			x: 0,
			y: 0
		};
		this.speed = 1;
	}

	draw() {
		this.vel.y += 0.5;
		/* PART A2: make the ball move */
		this.x += (mouseX - this.x) * 0.02;
		// this.x += this.vel.x;
		this.y += this.vel.y;
		image(imgBall, this.x, this.y);
	}
}

class Platform {
	constructor(x, y, w, h) {
		this.x = x || 0;
		this.y = y || 0;
		this.w = w || 108;
		this.h = h || 16;
		this.vel = {
			x: 0,
			y: 0
		};
		this.speed = 0;
	}

	spawn() {
		// platfromX range btw 54-686
		this.x = 54 + Math.random() * 532;
		this.y = prevPlatY - (dist + Math.random() * 50);
		prevPlatY = this.y;
	}

	draw() {
		this.y += this.vel.y;
		image(imgPlatform, this.x, this.y);
	}
}

let ball = new Ball(350, 400, 8);

function intersectsRect(a, b) {
	// right  zone            left zone
	if (a.x > b.x + b.w || a.x + a.w < b.x || a.y + a.h < b.y || (a.y > b.y + b.h && goingUp == false)) {
		// top                bottom
		return false; //if this is all false the function becomes true
	}
	// log(a, b);
	return true;
}

let levelProgress, dist, score, initialPlatNum, plats, goingUp, prevPlatY;
let restarting = false;

function init() {
	// reset all variables
	levelProgress = 0;
	initialPlatNum = 20;
	dist = 150;
	score = 0;
	plats = [];
	goingUp = false;
	prevPlatY = 780; // position of the last paddle that was positioned (380 to start)
	ball.x = 350;
	ball.y = 400;
	ball.vel.y = 0;
}

init();

function createPlats() {
	for (let i = 0; i < initialPlatNum; i++) {
		let p = new Platform();
		if (i == 0) {
			p.x = 266;
			p.y = prevPlatY;
		} else {
			p.spawn();
		}
		plats.push(p);
		console.log(prevPlatY);
	}
}

createPlats();

function draw() {
	if (ball.y > 830) {
		if (!restarting) restart();
		return;
	}
	pc.text('score', 20, 2);
	pc.text(score, 20, 4);
	background(0);
	// every 1000 increase distance, unless distance is already 300 or more
	if (score - levelProgress > 1000 && dist < 300) {
		dist += 10;
		levelProgress = score;
	}

	for (let p of plats) {
		// top of the ball is above the top of the platform
		// AND bottom of the ball is below the top of the platform
		// AND the ball must be falling
		// AND the ball and platform are intersecting
		if (ball.y < p.y && ball.y + ball.h > p.y && ball.vel.y >= 0 && intersectsRect(ball, p)) {
			ball.vel.y = -20;
			log(ball.vel.y);
		}
	}

	// when the ball reaches it's height, scroll the screen down
	goingUp = ball.y < 200 && ball.vel.y < 0;
	if (goingUp) reachNext();

	ball.draw();

	// if the platform passes the bottom, respawn it above.
	for (let p of plats) {
		if (p.y > 800) p.spawn();
		if (p.y > 0) p.draw();
	}
}

function reachNext() {
	// scroll the platforms downwards at the rate of the ball's velocity
	for (let p of plats) {
		p.y += -ball.vel.y;
	}
	prevPlatY += -ball.vel.y;
	score += -ball.vel.y;
	score = Math.floor(score);

	// keep ball in the same place
	ball.y += -ball.vel.y;
}

async function restart() {
	restarting = true;
	await pc.alert('Game over');
	await pc.erase(); // erase whole screen

	init();

	createPlats();
	restarting = false;
}
