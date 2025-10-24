let planetAngle = 0;
let blob;
let lastMoveTime = 0;
let moveInterval = 2000;

function setup() {
  createCanvas(600, 400);
  angleMode(RADIANS);
  blob = new OrganicBlob(width / 2, height / 2, 60);
}

function draw() {
  background(20, 30, 60);


  let orbitRadius = 120;
  let x = width / 2 + cos(planetAngle) * orbitRadius;
  let y = height / 2 + sin(planetAngle) * orbitRadius;
  fill(100, 200, 255);
  noStroke();
  ellipse(x, y, 40);


  fill(255, 180, 50);
  ellipse(width / 2, height / 2, 60);

  planetAngle += 0.02;


  blob.display();
  blob.update();

  if (millis() - lastMoveTime > moveInterval) {
    blob.setNewTarget();
    lastMoveTime = millis();
  }
}

class OrganicBlob {
  constructor(x, y, baseR) {
    this.pos = createVector(x, y);
    this.target = this.pos.copy();
    this.baseR = baseR;
    this.offset = random(1000);
  }

  update() {
    this.pos.lerp(this.target, 0.02);
    this.offset += 0.01;
  }

  setNewTarget() {
    this.target = createVector(random(100, width - 100), random(100, height - 100));
  }

  display() {
    noStroke();
    fill(255, 150, 200, 180);
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      let r = this.baseR + map(noise(this.offset + cos(a), this.offset + sin(a)), 0, 1, -15, 15);
      let x = this.pos.x + r * cos(a);
      let y = this.pos.y + r * sin(a);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}
