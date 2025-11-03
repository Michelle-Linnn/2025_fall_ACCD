// p5.js version of the Flavors of Hesitation prototype
let flavors = [
  'Vanilla','Chocolate','Matcha','Strawberry','Mango',
  'Coffee','Caramel','Blueberry','Coconut','Mint',
  'Banana','Black Sesame','Milk','Lemon','Taro'
];

let keywords = [
  ['warm','soft','memory','gentle','smooth'],
  ['rich','deep','safe','heavy','dense'],
  ['calm','bitter','quiet','steady','earthy'],
  ['bright','fresh','playful','sweet','light'],
  ['sunny','tropical','juicy','bright','open'],
  ['awake','bitter','focus','quiet','dark'],
  ['warm','sticky','caramelized','comfort','slow'],
  ['soft','cool','evening','violet','gentle'],
  ['smooth','round','tender','rest','quiet'],
  ['cold','fresh','crisp','clean','light'],
  ['soft','round','sweet','slow','childhood'],
  ['deep','roasted','serious','quiet','heavy'],
  ['safe','simple','childhood','soft','pure'],
  ['bright','sharp','awake','fresh','quick'],
  ['soft','purple','calm','slow','evening']
];

let allKeywords = [];
let keywordSelected = {};

let flowers = [];
let phaseTwo = false;
let phaseThree = false;

let submitBtn, nextBtn;

function setup() {
  let c = createCanvas(1100, 800);
  c.parent('canvasContainer');
  textAlign(CENTER, CENTER);
  textSize(12);
  keywords.forEach(arr => arr.forEach(k => { if(!allKeywords.includes(k)) allKeywords.push(k); }));
  allKeywords.forEach(k => keywordSelected[k] = false);
  let centerX = width/2, centerY = height/2;
  let ringR = 260;
  let angleStep = TWO_PI / flavors.length;
  for (let i=0;i<flavors.length;i++) {
    let angle = i*angleStep - PI/2;
    let fx = centerX + cos(angle)*ringR;
    let fy = centerY + sin(angle)*ringR;
    flowers.push(new Flower(fx,fy,flavors[i], keywords[i], angle));
  }
  submitBtn = new Button(width/2 - 90, height-64, 180, 40, 'SUBMIT');
  nextBtn = new Button(width-140, height-64, 100, 40, 'NEXT');
}

function draw() {
  background(248);
  fill(40);
  textSize(20);
  if (!phaseTwo) {
    text('Select words you feel connect to your taste', width/2, 36);
    let perRow = 6;
    let startX=120, startY=80, gapX=160, gapY=60;
    for (let i=0;i<allKeywords.length;i++) {
      let k = allKeywords[i];
      let px = startX + (i%perRow)*gapX;
      let py = startY + floor(i/perRow)*gapY;
      let d = dist(mouseX, mouseY, px, py);
      push();
      translate(px, py);
      let s = d<25 ? 1.15 : 1.0;
      scale(s);
      fill(keywordSelected[k] ? color(255,150,150) : 240);
      stroke(180);
      ellipse(0,0,50,50);
      noStroke();
      fill(30);
      textSize(12);
      text(k, 0, 0);
      pop();
    }
  } else if (phaseTwo && !phaseThree) {
    text('Your taste revealed!', width/2, 36);
    flowers.forEach(f => { f.updateFromSelection(keywordSelected); f.display(); });
  } else if (phaseThree) {
    text('Your final selected flavors', width/2, 36);
    let startX = 120;
    let startY = 150;
    let gapX = 200;
    let gapY = 250;
    let flowersPerRow = floor((width - startX*2) / gapX);
    if (flowersPerRow < 1) flowersPerRow = 1;
    let displayIdx = 0;
    let recommended = null;
    let maxLit = -1;
    for (let i=0;i<flowers.length;i++) {
      let f = flowers[i];
      let litCount = f.countLit();
      if (litCount > 0) {
        let row = floor(displayIdx / flowersPerRow);
        let col = displayIdx % flowersPerRow;
        let fx = startX + col * gapX;
        let fy = startY + row * gapY;
        f.displayAt(fx, fy);
        displayIdx++;
        if (litCount > maxLit) { maxLit = litCount; recommended = f; }
      }
    }
    if (recommended) {
      fill(30);
      textSize(22);
      text('We recommend you choose ' + recommended.name + ' flavor', width/2, height-60);
    }
  }
  if (!phaseTwo) submitBtn.display();
  if (phaseTwo && !phaseThree) nextBtn.display();
  noStroke();
  fill(80);
  textSize(12);
  text('Click words to select → SUBMIT → click petals to toggle → NEXT → Press "1" to reset', width/2, height-28);
}

function mousePressed() {
  if (!phaseTwo) {
    let perRow=6, startX=120, startY=80, gapX=160, gapY=60;
    for (let i=0;i<allKeywords.length;i++) {
      let px = startX + (i%perRow)*gapX;
      let py = startY + floor(i/perRow)*gapY;
      if (dist(mouseX, mouseY, px, py) < 25) keywordSelected[allKeywords[i]] = !keywordSelected[allKeywords[i]];
    }
  } else if (phaseTwo && !phaseThree) {
    flowers.forEach(f => f.handleClick());
  }
  if (!phaseTwo && submitBtn.isMouseOver()) { phaseTwo = true; }
  if (phaseTwo && !phaseThree && nextBtn.isMouseOver()) { phaseThree = true; }
}

function keyPressed() {
  if (key === '1') {
    phaseTwo = false; phaseThree = false;
    allKeywords.forEach(k => keywordSelected[k]=false);
    flowers.forEach(f => f.reset());
    console.log('System reset for next customer.');
  }
}

// Flower class
class Flower {
  constructor(x, y, name, petals, baseAngle) {
    this.x = x; this.y = y; this.name = name; this.petals = petals.slice(); this.baseAngle = baseAngle;
    this.lit = new Array(this.petals.length).fill(false);
    this.petalDist = 70;
    this.petalW = 36; this.petalH = 66;
  }
  updateFromSelection(sel) {
    for (let i=0;i<this.petals.length;i++) {
      let k = this.petals[i];
      this.lit[i] = !!sel[k];
    }
  }
  countLit() { return this.lit.reduce((a,b)=>a+(b?1:0),0); }
  display() {
    push();
    translate(this.x, this.y);
    let allLit = this.lit.every(v=>v);
    if (allLit) { noStroke(); fill(255,238,160,160); ellipse(0,0,220,220); }
    let n = this.petals.length;
    let startAng = this.baseAngle - PI/2;
    for (let i=0;i<n;i++) {
      let ang = map(i,0,n,0,TWO_PI) + startAng;
      let px = cos(ang)*this.petalDist;
      let py = sin(ang)*this.petalDist;
      let d = dist(mouseX, mouseY, this.x+px, this.y+py);
      let s = d < 48 ? 1.12 : 1.0;
      push();
      translate(px, py);
      rotate(ang+PI/2);
      push(); scale(s);
      fill(this.lit[i] ? color(255,150,150) : 240);
      noStroke();
      ellipse(0,0,this.petalW, this.petalH);
      pop();
      push(); rotate(-(ang+PI/2)); fill(30); textSize(10); text(this.petals[i],0,0); pop();
      pop();
    }
    fill(255); stroke(110); strokeWeight(1); ellipse(0,0,88,88);
    noStroke(); fill(30); textSize(13); text(this.name,0,0);
    pop();
  }
  displayAt(nx, ny) {
    push();
    translate(nx, ny);
    let allLit = this.lit.every(v=>v);
    if (allLit) { noStroke(); fill(255,238,160,160); ellipse(0,0,220,220); }
    let n = this.petals.length;
    let startAng = -PI/2;
    for (let i=0;i<n;i++) {
      let ang = map(i,0,n,0,TWO_PI) + startAng;
      let px = cos(ang)*this.petalDist;
      let py = sin(ang)*this.petalDist;
      push();
      translate(px,py); rotate(ang+PI/2);
      fill(this.lit[i] ? color(255,150,150) : 240);
      noStroke();
      ellipse(0,0,this.petalW,this.petalH);
      push(); rotate(-(ang+PI/2)); fill(30); textSize(10); text(this.petals[i],0,0); pop();
      pop();
    }
    fill(255); stroke(110); strokeWeight(1); ellipse(0,0,88,88);
    noStroke(); fill(30); textSize(13); text(this.name,0,0);
    pop();
  }
  handleClick() {
    let n = this.petals.length;
    let startAng = this.baseAngle - PI/2;
    for (let i=0;i<n;i++) {
      let ang = map(i,0,n,0,TWO_PI) + startAng;
      let px = this.x + cos(ang)*this.petalDist;
      let py = this.y + sin(ang)*this.petalDist;
      if (dist(mouseX, mouseY, px, py) < 48) this.lit[i] = !this.lit[i];
    }
  }
  reset() { this.lit = new Array(this.petals.length).fill(false); }
}

// Button class
class Button {
  constructor(x,y,w,h,label){ this.x=x; this.y=y; this.w=w; this.h=h; this.label=label; }
  display(){
    push(); rectMode(CORNER);
    let over = this.isMouseOver();
    fill(over?220:240); stroke(150); rect(this.x, this.y, this.w, this.h, 12);
    noStroke(); fill(30); textSize(14); text(this.label, this.x + this.w/2, this.y + this.h/2);
    pop();
  }
  isMouseOver(){
    return mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h;
  }
}
