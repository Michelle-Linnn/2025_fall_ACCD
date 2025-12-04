// ===================================
// ** 核心概念：页面导航 (currentPage) & 数据结构**
// ===================================

// 定义所有页面名称
const PAGES = {
    COVER: '封面页',
    FLAVOR_SELECT: '口味选择页',
    ABSTRACT_SELECT: '抽象图片页',
    MOOD_SELECT: '心情小人页',
    ANIMATION: '魔法混合动画',
    REPORT: '测试报告'
};

// 变量：当前用户在哪个页面
let currentPage = PAGES.COVER; 

let canvasWidth = 800;
let canvasHeight = 600;

// 数据结构
const FLAVOR_COUNT = 24;
let flavors = []; 

const ABSTRACT_IMAGE_COUNT = 12; 
let abstractImages = [];

const MOOD_IMAGE_COUNT = 12; 
let moodImages = [];

// 动画和报告相关
let selectedItems = []; 
let animationStartTime;
const ANIMATION_DURATION = 4000; // 4000毫秒 = 4秒

// ===================================
// ** 初始化函数 **
// ===================================

function initializeFlavors() {
    for (let i = 1; i <= FLAVOR_COUNT; i++) {
        flavors.push({
            id: i,
            name: `口味 ${i}`, 
            isSelected: false 
        });
    }
}

function initializeAbstractImages() {
    // 随机颜色作为抽象图片的占位
    const colors = [
        color(255, 0, 0), color(0, 0, 255), color(0, 255, 0), 
        color(255, 255, 0), color(255, 0, 255), color(0, 255, 255),
        color(100), color(200), color(150, 50, 200), color(250, 150, 0),
        color(50, 100, 150), color(150, 50, 50)
    ];

    for (let i = 0; i < ABSTRACT_IMAGE_COUNT; i++) {
        abstractImages.push({
            id: `A${i + 1}`,
            placeholderColor: colors[i % colors.length],
            isSelected: false 
        });
    }
}

function initializeMoodImages() {
    // 随机颜色作为心情小人的占位
    const moodColors = [
        color(255, 165, 0), color(135, 206, 250), color(255, 105, 180), 
        color(60, 179, 113), color(218, 165, 32), color(147, 112, 219),
        color(240, 128, 128), color(128, 0, 0), color(0, 128, 128), color(0, 0, 128),
        color(128, 128, 0), color(0, 128, 0)
    ];
    
    for (let i = 0; i < MOOD_IMAGE_COUNT; i++) {
        moodImages.push({
            id: `M${i + 1}`,
            placeholderColor: moodColors[i % moodColors.length],
            isSelected: false 
        });
    }
}

// p5.js setup 函数：只执行一次
function setup() {
    createCanvas(canvasWidth, canvasHeight);
    textAlign(CENTER, CENTER);
    
    initializeFlavors();
    initializeAbstractImages();
    initializeMoodImages(); 
    console.log("程序初始化完成，当前页面：", currentPage);
}

// ===================================
// ** 绘制函数：主循环 **
// ===================================

// p5.js draw 函数：循环执行
function draw() {
    background(255); 

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

// 绘制“下一步”按钮
function drawNextButton() {
    fill(100, 200, 100); 
    rectMode(CORNER);
    rect(width - 120, height - 70, 100, 50, 5);
    fill(255);
    textSize(20);
    text('下一步', width - 70, height - 45);
}

// 绘制“返回”按钮
function drawBackButton() {
    fill(200); 
    rectMode(CORNER);
    rect(20, height - 70, 100, 50, 5);
    fill(50);
    textSize(20);
    text('返回', 70, height - 45);
}

// P1 绘制
function drawCoverPage() {
    fill(50);
    textSize(30);
    text('欢迎来到 Gelato 魔法测试', width / 2, height / 2 - 50);
    
    // 绘制“开始”按钮
    fill(255, 100, 150); 
    rectMode(CENTER); 
    rect(width / 2, height / 2 + 50, 150, 60, 10);
    
    fill(255);
    textSize(28);
    text('开始测试', width / 2, height / 2 + 50);
}

// P2 绘制 (口味)
function drawFlavorPage() {
    fill(50);
    textSize(30);
    text('第二页：请选择您犹豫的口味 (多选)', width / 2, 50);

    const cols = 6;
    const itemSize = 100;
    const spacing = 10;
    
    const totalWidth = cols * itemSize + (cols - 1) * spacing;
    const startX = (width - totalWidth) / 2;
    const startY = 120; 

    rectMode(CORNER); 

    for (let i = 0; i < flavors.length; i++) {
        let flavor = flavors[i];
        let row = floor(i / cols);
        let col = i % cols;

        let x = startX + col * (itemSize + spacing);
        let y = startY + row * (itemSize + spacing);
        
        if (flavor.isSelected) {
            fill(255, 100, 150); 
        } else {
            fill(200); 
        }
        
        rect(x, y, itemSize, itemSize, 8); 

        fill(50);
        if (flavor.isSelected) {
            fill(255); 
        }
        textSize(16);
        text(flavor.name, x + itemSize / 2, y + itemSize / 2);
    }
    
    drawNextButton();
}

// P3 绘制 (抽象图片)
function drawAbstractPage() {
    fill(50);
    textSize(30);
    text('第三页：抽象图片 (多选)', width / 2, 50);

    const cols = 4;
    const itemSize = 150; 
    const spacing = 20;
    
    const totalWidth = cols * itemSize + (cols - 1) * spacing;
    const startX = (width - totalWidth) / 2;
    const startY = 120; 

    rectMode(CORNER); 

    for (let i = 0; i < abstractImages.length; i++) {
        let img = abstractImages[i];
        let row = floor(i / cols);
        let col = i % cols;

        let x = startX + col * (itemSize + spacing);
        let y = startY + row * (itemSize + spacing);
        
        fill(img.placeholderColor);
        rect(x, y, itemSize, itemSize, 15); 

        if (img.isSelected) {
            noFill();
            stroke(255, 0, 0); 
            strokeWeight(5);
            rect(x, y, itemSize, itemSize, 15);
            noStroke(); 
        }
        
        fill(255);
        textSize(14);
        text(img.id, x + itemSize / 2, y + itemSize / 2);
    }
    
    drawBackButton();
    drawNextButton();
}

// P4 绘制 (心情小人)
function drawMoodPage() {
    fill(50);
    textSize(30);
    text('第四页：心情小人 (多选)', width / 2, 50);

    const cols = 4;
    const itemSize = 150; 
    const spacing = 20;
    
    const totalWidth = cols * itemSize + (cols - 1) * spacing;
    const startX = (width - totalWidth) / 2;
    const startY = 120; 

    rectMode(CORNER); 

    for (let i = 0; i < moodImages.length; i++) {
        let mood = moodImages[i];
        let row = floor(i / cols);
        let col = i % cols;

        let x = startX + col * (itemSize + spacing);
        let y = startY + row * (itemSize + spacing);
        
        fill(mood.placeholderColor);
        rect(x, y, itemSize, itemSize, 15); 

        if (mood.isSelected) {
            noFill();
            stroke(0, 0, 255); 
            strokeWeight(5);
            rect(x, y, itemSize, itemSize, 15);
            noStroke(); 
        }
        
        fill(255);
        textSize(14);
        text(mood.id, x + itemSize / 2, y + itemSize / 2);
    }
    
    drawBackButton();
    drawNextButton();
}

// P5 绘制 (魔法动画)
function drawAnimation() {
    // 绘制魔法桶 (中央的汇聚点)
    const center = { x: width / 2, y: height / 2 };
    const bucketSize = 150;
    
    // 绘制光芒/背景效果
    noStroke();
    for (let i = 0; i < 5; i++) {
        fill(150, 150, 255, 50 - i * 10); // 柔和的光晕
        ellipse(center.x, center.y, bucketSize * 2 + i * 20, bucketSize * 2 + i * 20);
    }
    
    fill(50, 50, 150, 200); // 桶的主体颜色
    ellipse(center.x, center.y, bucketSize, bucketSize + 50);

    text('混合中...请稍候', width / 2, height / 2 + 100);
    
    // 动画计时和进度计算
    const elapsedTime = millis() - animationStartTime;
    let t = map(elapsedTime, 0, ANIMATION_DURATION, 0, 1);
    t = constrain(t, 0, 1); 

    // 平滑动画效果
    const easedT = sin(t * PI/2); 

    // 绘制飞入的元素
    for (let i = 0; i < selectedItems.length; i++) {
        let item = selectedItems[i];
        
        // 计算起始位置 (从四个角落分散开始)
        let startX, startY;
        if (i % 4 === 0) { startX = -100; startY = random(height); } 
        else if (i % 4 === 1) { startX = width + 100; startY = random(height); } 
        else if (i % 4 === 2) { startX = random(width); startY = -100; } 
        else { startX = random(width); startY = height + 100; } 

        let currentX = lerp(startX, center.x, easedT);
        let currentY = lerp(startY, center.y, easedT);
        
        fill(item.color);
        noStroke();
        
        let currentSize = lerp(30, 15, easedT); 

        // 绘制为不同形状以区分类型
        if (item.type === 'flavor') {
            rect(currentX, currentY, currentSize, currentSize); // 方块代表口味
        } else if (item.type === 'abstract') {
            triangle(currentX, currentY - currentSize, currentX - currentSize, currentY + currentSize, currentX + currentSize, currentY + currentSize); // 三角形代表抽象图
        } else { // mood
            ellipse(currentX, currentY, currentSize, currentSize); // 圆形代表心情小人
        }
    }
    
    // 动画结束时自动跳转
    if (t >= 1) {
        currentPage = PAGES.REPORT;
        console.log('动画结束，切换到报告页 (P6)');
    }
}

// P6 绘制 (报告页)
function drawReportPage() {
    fill(50);
    textSize(40);
    text('✨ 魔法冰淇淋报告 ✨', width / 2, 100);
    
    // 报告的核心功能 (推荐口味)
    textSize(25);
    fill(255, 0, 0); 
    text('【您的推荐口味】: 待计算!', width / 2, height / 2);
    
    // 汇总信息
    fill(100);
    textSize(18);
    text(`您选择了 ${selectedItems.length} 个元素进行混合。`, width / 2, height / 2 + 50);
    
    // 示例：展示客户选择的元素数量
    const flavorCount = selectedItems.filter(i => i.type === 'flavor').length;
    const abstractCount = selectedItems.filter(i => i.type === 'abstract').length;
    const moodCount = selectedItems.filter(i => i.type === 'mood').length;
    
    text(`口味(${flavorCount}) | 抽象图(${abstractCount}) | 心情小人(${moodCount})`, width / 2, height / 2 + 80);
    
    textSize(14);
    text('（下一步我们将添加推荐算法和后台编辑功能）', width / 2, height - 30);
}


// ===================================
// ** 交互处理函数 **
// ===================================

// p5.js 函数：当鼠标被点击时执行
function mouseClicked() {
    if (currentPage === PAGES.COVER) {
        handleCoverClick();
    } else if (currentPage === PAGES.FLAVOR_SELECT) {
        handleFlavorClick();
    } else if (currentPage === PAGES.ABSTRACT_SELECT) {
        handleAbstractClick();
    } else if (currentPage === PAGES.MOOD_SELECT) {
        handleMoodClick();
    }
    // 动画和报告页不需要点击处理
}

// 收集所有选中的元素 (P5 开始前调用)
function collectSelections() {
    selectedItems = [];
    
    // 1. 收集选中的口味 (P2)
    const selectedFlavors = flavors.filter(f => f.isSelected);
    selectedItems.push(...selectedFlavors.map(f => ({ 
        type: 'flavor', 
        id: f.id, 
        color: color(255, 100, 150) 
    })));

    // 2. 收集选中的抽象图片 (P3)
    const selectedAbstract = abstractImages.filter(a => a.isSelected);
    selectedItems.push(...selectedAbstract.map(a => ({ 
        type: 'abstract', 
        id: a.id, 
        color: a.placeholderColor 
    })));

    // 3. 收集选中的心情小人 (P4)
    const selectedMood = moodImages.filter(m => m.isSelected);
    selectedItems.push(...selectedMood.map(m => ({ 
        type: 'mood', 
        id: m.id, 
        color: m.placeholderColor 
    })));
}

// P1 封面页点击处理
function handleCoverClick() {
    const btnCenterX = width / 2;
    const btnCenterY = height / 2 + 50;
    const btnW = 150;
    const btnH = 60;
    
    if (mouseX > btnCenterX - btnW / 2 && mouseX < btnCenterX + btnW / 2 && 
        mouseY > btnCenterY - btnH / 2 && mouseY < btnCenterY + btnH / 2) {
        
        currentPage = PAGES.FLAVOR_SELECT;
    }
}

// P2 口味选择页点击处理
function handleFlavorClick() {
    // 1. 检查是否点击了“下一步”按钮
    if (checkNextButtonClick()) {
        currentPage = PAGES.ABSTRACT_SELECT;
        return; 
    }
    
    // 2. 检查是否点击了口味方块
    const cols = 6;
    const itemSize = 100;
    const spacing = 10;
    const totalWidth = cols * itemSize + (cols - 1) * spacing;
    const startX = (width - totalWidth) / 2;
    const startY = 120; 

    for (let i = 0; i < flavors.length; i++) {
        let flavor = flavors[i];
        let row = floor(i / cols);
        let col = i % cols;

        let x = startX + col * (itemSize + spacing);
        let y = startY + row * (itemSize + spacing);
        
        if (mouseX > x && mouseX < x + itemSize && 
            mouseY > y && mouseY < y + itemSize) {
            
            flavor.isSelected = !flavor.isSelected;
            return; 
        }
    }
}

// P3 抽象图片选择页点击处理
function handleAbstractClick() {
    // 1. 检查是否点击了“下一步”按钮
    if (checkNextButtonClick()) {
        currentPage = PAGES.MOOD_SELECT; 
        return; 
    }
    
    // 2. 检查是否点击了“返回”按钮
    if (checkBackButtonClick()) {
        currentPage = PAGES.FLAVOR_SELECT; 
        return;
    }

    // 3. 检查是否点击了抽象图片方块
    const cols = 4;
    const itemSize = 150;
    const spacing = 20;
    const totalWidth = cols * itemSize + (cols - 1) * spacing;
    const startX = (width - totalWidth) / 2;
    const startY = 120; 

    for (let i = 0; i < abstractImages.length; i++) {
        let img = abstractImages[i];
        let row = floor(i / cols);
        let col = i % cols;

        let x = startX + col * (itemSize + spacing);
        let y = startY + row * (itemSize + spacing);
        
        if (mouseX > x && mouseX < x + itemSize && 
            mouseY > y && mouseY < y + itemSize) {
            
            img.isSelected = !img.isSelected;
            return; 
        }
    }
}

// P4 心情小人选择页点击处理
function handleMoodClick() {
    // 1. 检查是否点击了“下一步”按钮
    if (checkNextButtonClick()) {
        // 在跳转动画页前，收集所有用户的选择
        collectSelections();
        animationStartTime = millis(); // 记录动画开始的毫秒数
        currentPage = PAGES.ANIMATION; 
        return; 
    }
    
    // 2. 检查是否点击了“返回”按钮
    if (checkBackButtonClick()) {
        currentPage = PAGES.ABSTRACT_SELECT; 
        return;
    }

    // 3. 检查是否点击了心情小人方块
    const cols = 4;
    const itemSize = 150;
    const spacing = 20;
    const totalWidth = cols * itemSize + (cols - 1) * spacing;
    const startX = (width - totalWidth) / 2;
    const startY = 120; 

    for (let i = 0; i < moodImages.length; i++) {
        let mood = moodImages[i];
        let row = floor(i / cols);
        let col = i % cols;

        let x = startX + col * (itemSize + spacing);
        let y = startY + row * (itemSize + spacing);
        
        if (mouseX > x && mouseX < x + itemSize && 
            mouseY > y && mouseY < y + itemSize) {
            
            mood.isSelected = !mood.isSelected;
            return; 
        }
    }
}

// 辅助函数：检查是否点击了“下一步”按钮
function checkNextButtonClick() {
    let btnX = width - 120;
    let btnY = height - 70;
    let btnW = 100;
    let btnH = 50;

    if (mouseX > btnX && mouseX < btnX + btnW && 
        mouseY > btnY && mouseY < btnY + btnH) {
        return true;
    }
    return false;
}

// 辅助函数：检查是否点击了“返回”按钮
function checkBackButtonClick() {
    let btnX = 20;
    let btnY = height - 70;
    let btnW = 100;
    let btnH = 50;

    if (mouseX > btnX && mouseX < btnX + btnW && 
        mouseY > btnY && mouseY < btnY + btnH) {
        return true;
    }
    return false;
}