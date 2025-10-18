let images = [];
let currentImg;
let sound;
let pos, vel;
let noiseOffset = 0;
let started = false; 

function preload() {
  images.push(loadImage("assets/orb_texture.jpeg"));
  images.push(loadImage("assets/photo.php.jpeg"));
  sound = loadSound("assets/sound.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(24);
  fill(255);
  pos = createVector(random(width), random(height));
  vel = p5.Vector.random2D().mult(5);
  currentImg = random(images);
}

function draw() {
  background(0);

  if (!started) {
    
    text("Click anywhere to start", width / 2, height / 2);
    return;
  }

  image(currentImg, pos.x, pos.y, 200, 200);
  pos.add(vel);

  let hitWall = false;
  if (pos.x > width - 100 || pos.x < 100) {
    vel.x *= -1;
    hitWall = true;
  }
  if (pos.y > height - 100 || pos.y < 100) {
    vel.y *= -1;
    hitWall = true;
  }

  if (hitWall) {
    playSoundOnce();
    changeDirection();
    changeImage();
  }
}

function mousePressed() {
  
  if (!started) {
    userStartAudio();
    started = true;
  }
}

function playSoundOnce() {
  if (sound.isPlaying()) sound.stop();
  sound.play();
}

function changeDirection() {
  noiseOffset += 0.1;
  let angle = noise(noiseOffset) * TWO_PI;
  vel.rotate(angle / 5);
}

function changeImage() {
  let newImg = random(images);
  while (newImg === currentImg && images.length > 1) {
    newImg = random(images);
  }
  currentImg = newImg;
}
