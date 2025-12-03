let video;
let handPose;
let hands = [];
let drawing = [];

function preload() {
  // 加载 handPose（新版 API）
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);

  // 摄像头
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 开始检测
  handPose.detectStart(video, gotHands);

  background(255);
}

function gotHands(results) {
  hands = results; // 存储手部数据
}

function draw() {
  image(video, 0, 0, width, height);

  // 画已记录的轨迹
  stroke(0);
  strokeWeight(4);
  noFill();
  beginShape();
  for (let p of drawing) {
    vertex(p.x, p.y);
  }
  endShape();

  if (hands.length > 0) {
    let hand = hands[0]; // 只用第一只手

    // 找到食指指尖（新版用 name 判断）
    let indexTip = hand.keypoints.find(k => k.name === "index_finger_tip");

    if (indexTip) {
      let x = indexTip.x;
      let y = indexTip.y;

      // 显示红点
      fill(255, 0, 0);
      noStroke();
      circle(x, y, 15);

      // 添加到线条
      drawing.push({ x, y });
    }
  }
}

// 按 C 清空画面
function keyPressed() {
  if (key === "c" || key === "C") {
    drawing = [];
    background(255);
  }
}
