const log = console.log;

player.walk = function (direction) {
	let aniName = 'walk-lr';
	if (direction == 'up') {
		this.velocity.x = 0;
		this.velocity.y = -1.5;
		aniName = 'walk-up';
	} else if (direction == 'down') {
		this.velocity.x = 0;
		this.velocity.y = 1.5;
		aniName = 'walk-down';
	} else if (direction == 'left') {
		this.velocity.x = -1.5;
		this.velocity.y = 0;
	} else if (direction == 'right') {
		this.velocity.x = 1.5;
		this.velocity.y = 0;
	}

	// the name of the current animation being used
	let curAniName = this.getAnimationLabel();

	// player is already walking that way or turning
	// no need to change animation
	if (curAniName == aniName || curAniName == 'idle-turn') return;

	// have the player turn before walking upwards
	if (direction != 'up') {
		this.changeAnimation(aniName);
	} else {
		this.changeAnimation('idle-turn');
		this.animation.onComplete = () => {
			this.changeAnimation('walk-up');
		};
	}

	if (direction == 'left') {
		this.mirrorX(-1); // flip the character left
	} else {
		this.mirrorX(1);
	}
};

player.idle = function () {
	// stop player from moving
	this.velocity.x = 0;
	this.velocity.y = 0;

	let _this = this;

	function _idle() {
		let chance = Math.random();

		if (chance > 0.4) {
			_this.changeAnimation('idle-stand');
		} else if (chance > 0.2) {
			_this.changeAnimation('idle-blink');
		} else if (chance > 0.1) {
			_this.changeAnimation('idle-think');
		} else if (chance > 0.05) {
			_this.changeAnimation('idle-scratch');
		} else {
			_this.changeAnimation('idle-yawn');
		}
		_this.animation.onComplete = _idle;
	}

	// the name of the current animation being used
	let curAniName = this.getAnimationLabel();

	if (curAniName == 'walk-up') {
		this.changeAnimation('idle-turn');
		this.animation.changeFrame(2);
		this.animation.goToFrame(0);
		this.animation.onComplete = () => {
			this.changeAnimation('idle-stand');
			this.animation.onComplete = _idle;
		};
	} else if (!curAniName.includes('idle')) {
		this.changeAnimation('idle-stand');
		this.animation.onComplete = _idle;
	}
};

player.action = function () {
	if (keyDown('up')) {
		this.walk('up');
	} else if (keyDown('down')) {
		this.walk('down');
	} else if (keyDown('left')) {
		this.walk('left');
	} else if (keyDown('right')) {
		this.walk('right');
	} else {
		this.idle();
	}
};

//          new Tiles(rows, cols, tileSize, x, y)
let world = new Tiles(40, 10, 64, 120, 55);
let walls = new Group();

let row = 0;
let col = 0;
for (let i = 0; i < 10; i++) {
	world.add(row, col + 1 + i, wallUp, walls);
	world.add(row + 11, col + 1 + i, wallDown, walls);
	world.add(row + 1 + i, col, wallLeft, walls);
	world.add(row + 1 + i, col + 11, wallRight, walls);
}

let boxes = new Group();
world.add(2, 2, box, boxes);

function draw() {
	clear();
	background(0);

	player.action();

	player.collide(walls); // handles player collisions with walls
	player.displace(boxes); // player move boxes by displacing them
	boxes.collide(walls);

	// p5.play function for drawing all sprites
	drawSprites();
}
