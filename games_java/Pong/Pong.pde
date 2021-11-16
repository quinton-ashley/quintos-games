// screen resolution is 256x192

PImage imgBall = spriteArt(
"..wwww..\n" +
".wwyyww.\n" +
"wwywwyww\n" +
"wyyyyyyw\n" +
"wyyyyyyw\n" +
"wwywwyww\n" +
".wwyyww.\n" +
"..wwww..");

PImage imgPaddle = spriteArt(".wwwwww.\nwwwwwwww\n" + "www..www\nww.ww.ww\n".repeat(21) + "wwwwwwww\n.wwwwww.");

PImage imgWall = spriteArt(("c".repeat(320) + "\n").repeat(8));

Sprite ball = createSprite(imgBall);
Sprite paddleL = createSprite(imgPaddle);
Sprite paddleR = createSprite(imgPaddle);
Sprite wallTop = createSprite(imgWall);
Sprite wallBottom = createSprite(imgWall);

PImage imgNet = spriteArt("w.\n.w\n".repeat(80));

PImage imgCenterLine = spriteArt("w".repeat(5) + ".".repeat(31) + "w".repeat(144) + ".".repeat(31) + "w".repeat(5) + "\n");

void setup() {
  size(256, 192);
  // places a ball in center of the screen
  ball.x = width / 2;
  ball.y = height / 2;
  ball.velocity.x = -1;
  ball.velocity.y = 1;
  
  // place paddles 5px from the sides, center vertically
  paddleL.x = 5;
  paddleL.immovable = true;
  
  paddleR.x = width - paddleR.w - 5;
  paddleR.immovable = true;
  
  // place walls on the top and bottom of the screen
  wallTop.x = 0;
  wallTop.y = 0;
  wallTop.immovable = true;
  
  wallBottom.x = 0;
  wallBottom.y = height - wallBottom.h;
  wallBottom.immovable = true;
}

void draw() {
  background(colorPal('r'));
  fill(colorPal('c'));
  stroke(colorPal('w'));
  rect(20, 16, 216, 20); // top
  rect(20, 36, 36, 140); // left
  rect(200, 36, 36, 140); // right
  rect(20, 156, 216, 20); // bottom
  image(imgNet, width / 2 - 2, 16);
  image(imgCenterLine, 20, height / 2);

  paddleL.y = mouseY - paddleL.h;
  paddleR.y = mouseY - paddleR.h;

  ball.bounce(paddleL);
  ball.bounce(paddleR);
  ball.bounce(wallTop);
  ball.bounce(wallBottom);

  // if the ball leaves the screen
  if (ball.x < -10 || ball.x > width + 10) {
    ball.x = width / 2;
    ball.y = height / 2;
  }

  drawSprites();
}
