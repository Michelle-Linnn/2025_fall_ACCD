// --- GLOBAL VARIABLES ---
let orbs = [];
let numOrbs = 20;
let img;
let sound;

function preload() {
  // Add your own image and sound file paths here
  img = loadImage("orb_texture.jpeg"); // e.g. small glowing circle image
  sound = loadSound("ambient.mp3");   // e.g. ambient background sound
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  imageMode(CENTER);

  // Create orbs with random noise offsets
  for (let i = 0; i < numOrbs; i++) {
    orbs.push(new Orb(random(1000), random(1000), random(50, 150)));
  }

  // Play ambient sound loop
  sound.loop();
}

function draw() {
  background(10, 20, 30, 30); // semi-transparent background for trail effect

  for (let orb of orbs) {
    orb.move();
    orb.display();
  }
}

class Orb {
  constructor(xoff, yoff, size) {
    this.xoff = xoff;
    this.yoff = yoff;
    this.size = size;
    this.color = color(random(100,255), random(100,255), random(200,255), 180);
  }

  move() {
    // Non-linear smooth motion using Perlin noise
    this.x = noise(this.xoff) * width;
    this.y = noise(this.yoff) * height;

    // Gradually shift noise offsets
    this.xoff += 0.002;
    this.yoff += 0.002;
  }

  display() {
    tint(this.color);
    image(img, this.x, this.y, this.size, this.size);
  }
}
