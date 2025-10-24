let planetAngle = 0;
let blob;
let lastMoveTime = 0;
let moveInterval = 2000; // 每隔 2 秒移动一次

function setup() {
  createCanvas(600, 400);
  angleMode(RADIANS);
  blob = new OrganicBlob(width / 2, height / 2, 60);
}

function draw() {
  background(20, 30, 60);

  // ----------- 第一部分：周期运动（行星）-----------
  let orbitRadius = 120;
  let x = width / 2 + cos(planetAngle) * orbitRadius;
  let y = height / 2 + sin(planetAngle) * orbitRadius;
  fill(100, 200, 255);
  noStroke();
  ellipse(x, y, 40);

  // 中心太阳
  fill(255, 180, 50);
  ellipse(width / 2, height / 2, 60);

  // 更新角度
  planetAngle += 0.02;

  // ----------- 第二部分：有机 Blob -----------
  blob.display();
  blob.update();

  // 检查时间间隔触发移动
  if (millis() - lastMoveTime > moveInterval) {
    blob.setNewTarget();
    lastMoveTime = millis();
  }
}

// ----------------- Blob 类 -----------------
class OrganicBlob {
  constructor(x, y, baseR) {
    this.pos = createVector(x, y);
    this.target = this.pos.copy();
    this.baseR = baseR;
    this.offset = random(1000);
  }

  update() {
    // 缓慢移动到目标位置
    this.pos.lerp(this.target, 0.02);
    this.offset += 0.01;
  }

  setNewTarget() {
    // 随机一个新的目标位置
    let tx = random(100, width - 100);
    let ty = random(100, height - 100);
    this.target = createVector(tx, ty);
  }

  display() {
    noStroke();
    fill(255, 150, 200, 180);
    beginShape();
    // 用 Perlin noise 创建有机外形
    for (let a = 0; a < TWO_PI; a += 0.1) {
      let r = this.baseR + map(noise(this.offset + cos(a), this.offset + sin(a)), 0, 1, -15, 15);
      let x = this.pos.x + r * cos(a);
      let y = this.pos.y + r * sin(a);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}
