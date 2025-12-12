// GelatoTest/sketch.js - iPad Pro 横屏 (1194x834) 适配版 - 修复文字对齐问题

const BACKEND_URL = 'http://localhost:3000';

const PAGES = {
  COVER: '封面页',
  FLAVOR_SELECT: '口味选择页',
  ABSTRACT_SELECT: '抽象图片页',
  MOOD_SELECT: '心情小人页',
  ANIMATION: '魔法混合动画',
  REPORT: '测试报告'
};

let currentPage = PAGES.COVER; 
let canvasWidth = 1194;
let canvasHeight = 834;

// *** 字体声明 ***
let kapakanaFont;

// *** 动态数据结构 ***
let flavorList = []; 
let abstractList = []; 
let moodList = []; 

// 动画和报告相关
let selectedItems = []; 
let animationStartTime;
const ANIMATION_DURATION = 5000;

// 图片加载占位符
let loadedImages = {}; 
let assetsLoaded = false; 

// ===================================
// ** 【设计风格常量】 **
// ===================================
const COLOR_BG = [232, 204, 191];
const COLOR_ACCENT = [196, 170, 170];
const COLOR_TEXT = [70, 70, 70];
const COLOR_ITEM_BG = [255, 255, 255];
const COLOR_SELECTED_BORDER = [219, 163, 163];

const ROUND_RADIUS = 20;
const SHADOW_OFFSET = 5;
const SHADOW_COLOR = [0, 0, 0, 40];
const COLOR_TITLE_BG = [196, 170, 170];

// ===================================
// ** 导航布局常量 (统一管理) **
// ===================================
const NAV_Y = 50;           // 导航栏 Y 坐标
const TITLE_Y = 50;         // 标题 Y 坐标 (与导航栏同高)
const BACK_BTN_X = 100;     // Back 按钮 X 坐标
const NEXT_BTN_X = 1094;    // Next 按钮 X 坐标 (width - 100)
const NAV_BTN_W = 160;
const NAV_BTN_H = 60;
const TITLE_BOX_W = 500;    // 标题框宽度
const TITLE_BOX_H = 60;     // 标题框高度

// ===================================
// ** 数据加载和预加载函数 **
// ===================================

function preload() {
  // kapakanaFont = loadFont('Your/Path/To/Kapakana.otf'); 
  loadBackendConfig();
}

function getURLParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

async function loadBackendConfig() {
  const archiveName = getURLParam('config') || 'A'; 
  try {
    const response = await fetch(`${BACKEND_URL}/api/config/${archiveName}`);
    if (!response.ok) { throw new Error(`无法加载 Config ${archiveName}。`); }
    const data = await response.json();
    flavorList = data.flavorList ? data.flavorList.map(f => ({ ...f, isSelected: false })) : [];
    abstractList = data.abstractList ? data.abstractList.map(a => ({ ...a, isSelected: false })) : [];
    moodList = data.moodList ? data.moodList.map(m => ({ ...m, isSelected: false })) : [];
    const allItems = [...flavorList, ...abstractList, ...moodList];
    const imagePromises = allItems.filter(item => item.url).map(item => {
      return new Promise(resolve => {
        const fullUrl = BACKEND_URL + item.url; 
        loadImage(fullUrl, (img) => {
          loadedImages[item.id] = img;
          resolve();
        }, (err) => {
          loadedImages[item.id] = null; 
          resolve(); 
        });
      });
    });
    await Promise.all(imagePromises);
    assetsLoaded = true;
  } catch (error) {
    console.error("加载后端配置失败:", error);
    alert("错误：无法连接到后台服务器或加载配置。");
  }
}

// ===================================
// ** 初始化函数 **
// ===================================

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
}

// ===================================
// ** 绘制函数：主循环 **
// ===================================

function draw() {
  background(COLOR_BG); 

  if (!assetsLoaded) {
    fill(COLOR_TEXT);
    textSize(40);
    if (kapakanaFont) textFont(kapakanaFont);
    text('loading...', width / 2, height / 2);
    return;
  }

  if (currentPage === PAGES.COVER) {
    drawCoverPage();
  } else if (currentPage === PAGES.FLAVOR_SELECT) {
    drawFlavorPage();
  } else if (currentPage === PAGES.ABSTRACT_SELECT) {
    drawAbstractPage();
  } else if (currentPage === PAGES.MOOD_SELECT) { 
    drawMoodPage();
  } else if (currentPage === PAGES.ANIMATION) { 
    drawAnimation();
  } else if (currentPage === PAGES.REPORT) { 
    drawReportPage();
  }
}

// ===================================
// ** 辅助绘图函数 **
// ===================================

function drawStyledButton(x, y, w, h, label, isPrimary = true) {
  let baseColor = isPrimary ? COLOR_ACCENT : [200];
  let textColor = isPrimary ? [255] : COLOR_TEXT;
  let hover = mouseX > x - w/2 && mouseX < x + w/2 && mouseY > y - h/2 && mouseY < y + h/2;
  let clickEffect = (hover && mouseIsPressed) ? 0.95 : 1.0;
  
  push();
  translate(x, y);
  scale(clickEffect);
  rectMode(CENTER);
  noStroke();
  
  // 阴影
  fill(SHADOW_COLOR);
  rect(SHADOW_OFFSET, SHADOW_OFFSET, w, h, ROUND_RADIUS);

  // 按钮背景
  fill(baseColor);
  rect(0, 0, w, h, ROUND_RADIUS);
  
  // 按钮文字
  fill(textColor);
  textSize(24); 
  textAlign(CENTER, CENTER);
  if (kapakanaFont) textFont(kapakanaFont);
  text(label, 0, 0); 

  pop();
}

// Next 按钮 (右侧)
function drawNextButton() {
  drawStyledButton(NEXT_BTN_X, NAV_Y, NAV_BTN_W, NAV_BTN_H, 'next', true);
}

// Back 按钮 (左侧)
function drawBackButton() {
  drawStyledButton(BACK_BTN_X, NAV_Y, NAV_BTN_W, NAV_BTN_H, 'back', false);
}

// 绘制标题框和标题文字
function drawTitleBox(title) {
  push();
  rectMode(CENTER);
  noStroke();
  
  // 标题背景框
  fill(COLOR_TITLE_BG);
  rect(width / 2, TITLE_Y, TITLE_BOX_W, TITLE_BOX_H, ROUND_RADIUS);
  
  // 标题文字
  fill(255);
  textSize(28);
  textAlign(CENTER, CENTER);
  if (kapakanaFont) textFont(kapakanaFont);
  text(title, width / 2, TITLE_Y);
  
  pop();
}

// P1 绘制 (封面页)
function drawCoverPage() {
  fill(COLOR_TEXT);
  textSize(50);
  textAlign(CENTER, CENTER);
  if (kapakanaFont) textFont(kapakanaFont);
  text('Gelato choosing trip', width / 2, height / 2 - 100); 

  // "START"按钮
  drawStyledButton(width / 2, height / 2 + 50, 280, 90, 'START', true); 

  // Config buttons (存档切换按钮)
  const archives = ['A', 'B', 'C'];
  const currentArchive = getURLParam('config') || 'A';
  const btnW = 120;
  const btnGap = 20;
  const totalW = 3 * btnW + 2 * btnGap; 
  let startX = (width - totalW) / 2 + btnW / 2;

  for (let i = 0; i < archives.length; i++) {
    const x = startX + i * (btnW + btnGap);
    const isCurrent = archives[i] === currentArchive;
    drawStyledButton(x, height - 80, btnW, 40, `Config ${archives[i]}`, isCurrent); 
  }
}

// 统一的选择页绘制函数 (温馨卡片风格)
function drawStyledSelectionPage(title, list, totalCols) {
  // ** 绘制标题框 **
  drawTitleBox(title);

  // ** 布局计算 (横屏) **
  const numItems = list.length;
  let cols = totalCols; 
  let rows = ceil(numItems / cols);

  if (cols === 6 && rows > 1) { cols = 8; rows = ceil(numItems / 8); }
  if (cols === 4) { cols = 5; rows = ceil(numItems / 5); }
  
  const labelHeight = 30;
  const totalSpacingX = (cols + 1) * 35;
  let itemSize = floor((width - totalSpacingX) / cols);
  let spacing = (width - cols * itemSize) / (cols + 1); 

  if (itemSize < 100) { itemSize = 100; spacing = (width - cols * itemSize) / (cols + 1); }
  
  const startX = spacing;
  const totalGridH = rows * (itemSize + labelHeight) + (rows - 1) * spacing;
  // Grid 的 Y 坐标下移，给顶部导航腾出空间
  const cardGridTopMargin = 120; 
  const startY = cardGridTopMargin + (height - cardGridTopMargin - totalGridH) / 2;

  push();
  rectMode(CORNER); 

  for (let i = 0; i < numItems; i++) {
    let item = list[i];
    let row = floor(i / cols);
    let col = i % cols;

    let x = startX + col * (itemSize + spacing);
    let y = startY + row * (itemSize + labelHeight + spacing);
    const p5Image = loadedImages[item.id];
    let hover = mouseX > x && mouseX < x + itemSize && mouseY > y && mouseY < y + itemSize;
    let lift = item.isSelected ? -1 : (hover ? -3 : 0);
    
    push();
    translate(x, y);
    
    // 阴影
    fill(SHADOW_COLOR);
    rectMode(CORNER);
    rect(SHADOW_OFFSET, SHADOW_OFFSET, itemSize, itemSize, ROUND_RADIUS);

    // 卡片背景
    fill(COLOR_ITEM_BG); 
    rect(0 + lift, 0 + lift, itemSize, itemSize, ROUND_RADIUS); 

    // 图片
    if (p5Image) {
      let imgMargin = 12; 
      image(p5Image, imgMargin + lift, imgMargin + lift, itemSize - 2 * imgMargin, itemSize - 2 * imgMargin);
    } else {
      fill(150);
      textSize(18); 
      textAlign(CENTER, CENTER);
      if (kapakanaFont) textFont(kapakanaFont);
      text("none", itemSize / 2 + lift, itemSize / 2 + lift);
    }
    
    // 选中状态
    if (item.isSelected) {
      noFill();
      stroke(COLOR_SELECTED_BORDER); 
      strokeWeight(6); 
      rect(0 + lift, 0 + lift, itemSize, itemSize, ROUND_RADIUS);
      
      // 勾选标记
      fill(COLOR_SELECTED_BORDER);
      noStroke();
      ellipse(itemSize - 15, 15, 20, 20); 
      fill(255);
      textSize(15);
      textAlign(CENTER, CENTER);
      if (kapakanaFont) textFont(kapakanaFont);
      text('✓', itemSize - 15, 15);
    }
    pop();
    
    // 标签文字
    noStroke();
    fill(COLOR_TEXT);
    textSize(18); 
    textAlign(CENTER, CENTER);
    if (kapakanaFont) textFont(kapakanaFont);
    text(item.name, x + itemSize / 2, y + itemSize + 15);
  }
  pop();
  
  // 绘制导航按钮 
  if (title !== 'Choose your favourite flavors') drawBackButton();
  drawNextButton();
}

// 替换旧的页面绘制函数
function drawFlavorPage() {
  drawStyledSelectionPage('Choose your favourite flavors', flavorList, 6); 
}
function drawAbstractPage() {
  drawStyledSelectionPage('Choose your favourite abstracts', abstractList, 4);
}
function drawMoodPage() {
  drawStyledSelectionPage('Choose your favourite mood', moodList, 4);
}

// P5 绘制 (魔法动画) 
function drawAnimation() {
  background(COLOR_BG);
  const center = { x: width / 2, y: height / 2 };
  const bucketSize = 250; 
  
  noStroke();
  for (let i = 0; i < 5; i++) {
    fill(150, 150, 255, 50 - i * 10); 
    ellipse(center.x, center.y, bucketSize * 2 + i * 40, bucketSize * 2 + i * 40);
  }
  fill(50, 50, 150, 200); 
  ellipse(center.x, center.y, bucketSize, bucketSize + 80);

  fill(COLOR_TEXT);
  textSize(36);
  textAlign(CENTER, CENTER);
  if (kapakanaFont) textFont(kapakanaFont);
  text('Mixing', width / 2, height / 2 + 200);
  
  const elapsedTime = millis() - animationStartTime;
  let t = map(elapsedTime, 0, ANIMATION_DURATION, 0, 1);
  t = constrain(t, 0, 1); 

  const easedT = sin(t * PI/2); 

  for (let i = 0; i < selectedItems.length; i++) {
    let item = selectedItems[i];
    let startX, startY;
    if (i % 4 === 0) { startX = -100; startY = random(height); } 
    else if (i % 4 === 1) { startX = width + 100; startY = random(height); } 
    else if (i % 4 === 2) { startX = random(width); startY = -100; } 
    else { startX = random(width); startY = height + 100; } 

    let currentX = lerp(startX, center.x, easedT);
    let currentY = lerp(startY, center.y, easedT);
    fill(item.color);
    noStroke();
    let currentSize = lerp(40, 25, easedT); 
    if (item.type === 'flavor') {
      rectMode(CENTER);
      rect(currentX, currentY, currentSize, currentSize); 
    } else if (item.type === 'abstract') {
      triangle(currentX, currentY - currentSize, currentX - currentSize, currentY + currentSize, currentX + currentSize, currentY + currentSize); 
    } else { 
      ellipse(currentX, currentY, currentSize, currentSize); 
    }
  }
  
  if (t >= 1) {
    currentPage = PAGES.REPORT;
  }
}

// P6 绘制 (报告页) 
function drawReportPage() {
  background(COLOR_BG);
  
  // ** 标题和背景框 **
  push();
  rectMode(CENTER);
  noStroke();
  fill(COLOR_TITLE_BG); 
  rect(width / 2, 150, 500, 70, ROUND_RADIUS);
  
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  if (kapakanaFont) textFont(kapakanaFont);
  text('✨ Gelato Report ✨', width / 2, 150);
  pop();
  
  const recommendedFlavor = calculateRecommendation();

  textSize(36);
  textAlign(CENTER, CENTER);
  fill(COLOR_ACCENT); 
  if (kapakanaFont) textFont(kapakanaFont);
  text(`Recommend: ${recommendedFlavor || 'No recommendations available.'}`, width / 2, height / 2);
  
  fill(COLOR_TEXT);
  textSize(24);
  if (kapakanaFont) textFont(kapakanaFont);
  const flavorCount = selectedItems.filter(i => i.type === 'flavor').length;
  const abstractCount = selectedItems.filter(i => i.type === 'abstract').length;
  const moodCount = selectedItems.filter(i => i.type === 'mood').length;
  text(`You chose ${selectedItems.length} items to mix.`, width / 2, height / 2 + 100);
  text(`Flavors(${flavorCount}) | Abstracts(${abstractCount}) | Moods(${moodCount})`, width / 2, height / 2 + 150);
  
  textSize(20);
  if (kapakanaFont) textFont(kapakanaFont);
  text('Click anywhere to restart', width / 2, height - 100); 
}

// ===================================
// ** 推荐算法核心 & 交互处理 **
// ===================================

function calculateRecommendation() { 
  if (selectedItems.length === 0) { return "Choose at least one"; }
  let totalWeights = {};
  flavorList.forEach(f => totalWeights[f.id] = 0);
  const scoredItems = [...abstractList.filter(a => a.isSelected), ...moodList.filter(m => m.isSelected)];
  scoredItems.forEach(item => {
    for (const flavorId in item.weights) { totalWeights[flavorId] += item.weights[flavorId]; }
  });
  let maxWeight = -1;
  let recommendedFlavorId = null;
  for (const flavorId in totalWeights) {
    if (totalWeights[flavorId] > maxWeight) {
      maxWeight = totalWeights[flavorId];
      recommendedFlavorId = flavorId;
    }
  }
  if (recommendedFlavorId) {
    const recommendedFlavor = flavorList.find(f => f.id === recommendedFlavorId);
    return recommendedFlavor ? recommendedFlavor.name : "Unknown flavor";
  }
  return "(None)";
}

function mouseClicked() {
  if (!assetsLoaded) return; 
  
  // 使用统一的导航常量进行点击检测
  const nextBtnX = NEXT_BTN_X;
  const nextBtnY = NAV_Y; 
  const nextBtnW = NAV_BTN_W;
  const nextBtnH = NAV_BTN_H;
  const backBtnX = BACK_BTN_X;
  const backBtnY = NAV_Y; 
  const backBtnW = NAV_BTN_W;
  const backBtnH = NAV_BTN_H;

  if (currentPage === PAGES.COVER) {
    // 检查 START 按钮 (280x90)
    if (mouseX > width / 2 - 140 && mouseX < width / 2 + 140 && 
        mouseY > height / 2 + 50 - 45 && mouseY < height / 2 + 50 + 45) {
      currentPage = PAGES.FLAVOR_SELECT;
      return;
    }
    // 检查 Config 切换
    const archives = ['A', 'B', 'C'];
    const btnW = 120;
    const btnGap = 20;
    const totalW = 3 * btnW + 2 * btnGap;
    let startX = (width - totalW) / 2;
    for (let i = 0; i < archives.length; i++) {
      const x = startX + i * (btnW + btnGap);
      if (mouseX > x && mouseX < x + btnW && mouseY > height - 80 - 20 && mouseY < height - 80 + 20) {
        window.location.href = `index.html?config=${archives[i]}`;
        return;
      }
    }

  } else if (currentPage === PAGES.REPORT) {
    window.location.reload();
    return; 

  } else {
    // Next Button
    if (mouseX > nextBtnX - nextBtnW/2 && mouseX < nextBtnX + nextBtnW/2 && 
        mouseY > nextBtnY - nextBtnH/2 && mouseY < nextBtnY + nextBtnH/2) {
      if (currentPage === PAGES.FLAVOR_SELECT) currentPage = PAGES.ABSTRACT_SELECT;
      else if (currentPage === PAGES.ABSTRACT_SELECT) currentPage = PAGES.MOOD_SELECT;
      else if (currentPage === PAGES.MOOD_SELECT) {
        collectSelections();
        animationStartTime = millis(); 
        currentPage = PAGES.ANIMATION; 
      }
      return;
    }
    // Back Button
    if (mouseX > backBtnX - backBtnW/2 && mouseX < backBtnX + backBtnW/2 && 
        mouseY > backBtnY - backBtnH/2 && mouseY < backBtnY + backBtnH/2) {
      if (currentPage === PAGES.ABSTRACT_SELECT) currentPage = PAGES.FLAVOR_SELECT;
      else if (currentPage === PAGES.MOOD_SELECT) currentPage = PAGES.ABSTRACT_SELECT; 
      return;
    }

    // Card Selection Logic 
    let list = (currentPage === PAGES.FLAVOR_SELECT) ? flavorList : 
               (currentPage === PAGES.ABSTRACT_SELECT) ? abstractList : moodList;
    let totalCols = (currentPage === PAGES.FLAVOR_SELECT) ? 6 : 4;
    let cols = totalCols; 
    let rows = ceil(list.length / cols);
    if (cols === 6 && rows > 1) { cols = 8; rows = ceil(list.length / 8); }
    if (cols === 4) { cols = 5; rows = ceil(list.length / 5); }

    const labelHeight = 30;
    const totalSpacingX = (cols + 1) * 35;
    let itemSize = floor((width - totalSpacingX) / cols);
    let spacing = (width - cols * itemSize) / (cols + 1); 
    if (itemSize < 100) { itemSize = 100; spacing = (width - cols * itemSize) / (cols + 1); }

    const startX = spacing;
    const totalGridH = rows * (itemSize + labelHeight) + (rows - 1) * spacing;
    const cardGridTopMargin = 120; 
    const startY = cardGridTopMargin + (height - cardGridTopMargin - totalGridH) / 2;

    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      let row = floor(i / cols);
      let col = i % cols;

      let x = startX + col * (itemSize + spacing);
      let y = startY + row * (itemSize + labelHeight + spacing);
      
      if (mouseX > x && mouseX < x + itemSize && 
          mouseY > y && mouseY < y + itemSize) {
        item.isSelected = !item.isSelected;
        return; 
      }
    }
  }
}

function collectSelections() {
  selectedItems = [];
  const selectedFlavors = flavorList.filter(f => f.isSelected);
  selectedItems.push(...selectedFlavors.map(f => ({ type: 'flavor', id: f.id, color: color(255, 100, 150) })));

  const selectedAbstract = abstractList.filter(a => a.isSelected);
  selectedItems.push(...selectedAbstract.map(a => ({ type: 'abstract', id: a.id, color: color(random(100, 200), random(100, 200), random(100, 200)) })));

  const selectedMood = moodList.filter(m => m.isSelected);
  selectedItems.push(...selectedMood.map(m => ({ type: 'mood', id: m.id, color: color(random(100, 200), random(100, 200), random(100, 200)) })));
}