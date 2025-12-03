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

  // 绘制已记录路线
  stroke(0);
  strokeWeight(4);
  noFill();
  beginShape();
  for (let p of drawing) {
    vertex(p.x, p.y);
  }
  endShape();

  // 如果检测到手
  if (hands.length > 0) {
    let hand = hands[0];

    // 找到食指指尖
    let indexTip = hand.keypoints.find(k => k.name === "index_finger_tip");

    if (indexTip) {
      let x = indexTip.x;
      let y = indexTip.y;

      // 红点显示
      fill(255, 0, 0);
      noStroke();
      circle(x, y, 15);

      // 添加到画笔轨迹
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
