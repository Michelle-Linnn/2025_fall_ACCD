// ===================================
// ** 核心概念：页面导航 (currentPage) & 数据结构**
// ===================================

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
let canvasWidth = 800;
let canvasHeight = 600;

// *** 动态数据结构 ***
let flavorList = [];        // 存储从后端加载的口味列表
let abstractList = [];      // 存储从后端加载的抽象图片列表
let moodList = [];          // 存储从后端加载的心情小人列表

// 动画和报告相关
let selectedItems = []; 
let animationStartTime;
const ANIMATION_DURATION = 4000; // 4000毫秒 = 4秒

// 图片加载占位符 (p5.js image 对象)
let loadedImages = {}; 
let assetsLoaded = false; // 标记数据和图片是否加载完成

// ===================================
// ** 数据加载和预加载函数 **
// ===================================

// p5.js 函数：在 setup 之前执行，用于加载外部资源
function preload() {
    loadBackendConfig();
}

// 异步加载后端配置和图片
// 辅助函数：从 URL 获取参数
function getURLParam(name) {
    // window.location.search 包含了 ?config=B 这样的部分
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 异步加载后端配置和图片
async function loadBackendConfig() {
    // **核心修改：动态获取存档名称，默认为 'A'**
    const archiveName = getURLParam('config') || 'A'; 

    console.log(`正在从后端加载 Config ${archiveName} ...`);
    try {
        // 使用动态获取的 archiveName
        const response = await fetch(`${BACKEND_URL}/api/config/${archiveName}`);
        if (!response.ok) {
            throw new Error(`无法加载 Config ${archiveName}。`);
        }
        const data = await response.json();
        
        // 1. 更新前端数据结构
        flavorList = data.flavorList ? data.flavorList.map(f => ({ ...f, isSelected: false })) : [];
        abstractList = data.abstractList ? data.abstractList.map(a => ({ ...a, isSelected: false })) : [];
        moodList = data.moodList ? data.moodList.map(m => ({ ...m, isSelected: false })) : [];

        console.log(`成功加载 ${flavorList.length} 种口味, ${abstractList.length} 张抽象图, ${moodList.length} 个心情小人.`);
        
        // 2. 异步加载图片
        const allItems = [...flavorList, ...abstractList, ...moodList];
        const imagePromises = allItems
            .filter(item => item.url)
            .map(item => {
                return new Promise(resolve => {
                    loadImage(BACKEND_URL + item.url, (img) => {
                        loadedImages[item.id] = img;
                        resolve();
                    }, (err) => {
                        console.error(`加载图片失败: ${item.url}`, err);
                        loadedImages[item.id] = null; 
                        resolve(); 
                    });
                });
            });
            
        await Promise.all(imagePromises);
        assetsLoaded = true;
        console.log("所有资源加载完成，可以开始测试！");

    } catch (error) {
        console.error("加载后端配置失败:", error);
        alert("错误：无法连接到后台服务器或加载配置。请确保 Node.js 服务器已启动在 3000 端口。");
    }
}


// ===================================
// ** 初始化函数 **
// ===================================

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    textAlign(CENTER, CENTER);
}


// ===================================
// ** 绘制函数：主循环 **
// ===================================

function draw() {
    background(255); 

    if (!assetsLoaded) {
        // 正在加载中的画面
        fill(50);
        textSize(30);
        text('正在加载配置和图片...', width / 2, height / 2);
        return;
    }

    // 根据当前页面变量，绘制对应的画面
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


// P1 绘制 (封面页)
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

    // --- 新增：存档切换按钮 ---
    const btnY = height - 50;
    const btnW = 80;
    const btnH = 30;
    const spacing = 10;
    
    // 按钮位置计算 (居中排列)
    const totalWidth = 3 * btnW + 2 * spacing;
    let startX = (width - totalWidth) / 2;

    const currentArchive = getURLParam('config') || 'A';
    
    const archives = ['A', 'B', 'C'];
    
    for (let i = 0; i < archives.length; i++) {
        const archive = archives[i];
        const x = startX + i * (btnW + spacing);
        
        // 如果是当前加载的存档，使用高亮颜色
        if (archive === currentArchive) {
            fill(50, 150, 50); // 选中绿色
        } else {
            fill(180); // 未选中灰色
        }
        
        rectMode(CORNER);
        rect(x, btnY, btnW, btnH, 5);
        
        // 绘制文字
        fill(archive === currentArchive ? 255 : 50);
        textSize(16);
        text(`Config ${archive}`, x + btnW / 2, btnY + btnH / 2);
    }
}



// P2 绘制 (口味) - **使用 flavorList 动态数据**
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

    for (let i = 0; i < flavorList.length; i++) {
        let flavor = flavorList[i];
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
        // 使用后端提供的口味名称
        text(flavor.name, x + itemSize / 2, y + itemSize / 2); 
    }
    
    drawNextButton();
}

// P3 绘制 (抽象图片) - **使用 abstractList 动态数据和加载的图片**
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

    for (let i = 0; i < abstractList.length; i++) {
        let img = abstractList[i];
        let row = floor(i / cols);
        let col = i % cols;

        let x = startX + col * (itemSize + spacing);
        let y = startY + row * (itemSize + spacing);
        
        const p5Image = loadedImages[img.id];

        if (p5Image) {
            // 绘制真实图片
            image(p5Image, x, y, itemSize, itemSize);
        } else {
            // 绘制无图片的占位符 (如果图片加载失败或没有 url)
            fill(150);
            rect(x, y, itemSize, itemSize, 15);
            fill(255);
            textSize(14);
            text("无图", x + itemSize / 2, y + itemSize / 2);
        }
        
        // 绘制选中边框
        if (img.isSelected) {
            noFill();
            stroke(255, 0, 0); 
            strokeWeight(5);
            rect(x, y, itemSize, itemSize, 15);
            noStroke(); 
        }
    }
    
    drawBackButton();
    drawNextButton();
}

// P4 绘制 (心情小人) - **使用 moodList 动态数据和加载的图片**
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

    for (let i = 0; i < moodList.length; i++) {
        let mood = moodList[i];
        let row = floor(i / cols);
        let col = i % cols;

        let x = startX + col * (itemSize + spacing);
        let y = startY + row * (itemSize + spacing);
        
        const p5Image = loadedImages[mood.id];

        if (p5Image) {
            // 绘制真实图片
            image(p5Image, x, y, itemSize, itemSize);
        } else {
             // 绘制无图片的占位符
            fill(150);
            rect(x, y, itemSize, itemSize, 15);
            fill(255);
            textSize(14);
            text("无图", x + itemSize / 2, y + itemSize / 2);
        }

        // 绘制选中边框
        if (mood.isSelected) {
            noFill();
            stroke(0, 0, 255); 
            strokeWeight(5);
            rect(x, y, itemSize, itemSize, 15);
            noStroke(); 
        }
    }
    
    drawBackButton();
    drawNextButton();
}

// P5 绘制 (魔法动画) (保持不变，但元素现在来自 selectedItems)
function drawAnimation() {
    // ... (保持 drawAnimation 函数不变)
    const center = { x: width / 2, y: height / 2 };
    const bucketSize = 150;
    
    // 绘制光芒/背景效果
    noStroke();
    for (let i = 0; i < 5; i++) {
        fill(150, 150, 255, 50 - i * 10); 
        ellipse(center.x, center.y, bucketSize * 2 + i * 20, bucketSize * 2 + i * 20);
    }
    
    fill(50, 50, 150, 200); 
    ellipse(center.x, center.y, bucketSize, bucketSize + 50);

    text('混合中...请稍候', width / 2, height / 2 + 100);
    
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
        
        let currentSize = lerp(30, 15, easedT); 

        if (item.type === 'flavor') {
            rect(currentX, currentY, currentSize, currentSize); 
        } else if (item.type === 'abstract') {
            triangle(currentX, currentY - currentSize, currentX - currentSize, currentY + currentSize, currentX + currentSize, currentY + currentSize); 
        } else { // mood
            ellipse(currentX, currentY, currentSize, currentSize); 
        }
    }
    
    if (t >= 1) {
        currentPage = PAGES.REPORT;
    }
}

// P6 绘制 (报告页) - **新增计算推荐口味的逻辑**
function drawReportPage() {
    fill(50);
    textSize(40);
    text('✨ 魔法冰淇淋报告 ✨', width / 2, 100);
    
    // 调用推荐算法 (简化版)
    const recommendedFlavor = calculateRecommendation();

    textSize(25);
    fill(255, 0, 0); 
    text(`【您的推荐口味】: ${recommendedFlavor || '暂无推荐'}`, width / 2, height / 2);
    
    fill(100);
    textSize(18);
    text(`您选择了 ${selectedItems.length} 个元素进行混合。`, width / 2, height / 2 + 50);
    
    const flavorCount = selectedItems.filter(i => i.type === 'flavor').length;
    const abstractCount = selectedItems.filter(i => i.type === 'abstract').length;
    const moodCount = selectedItems.filter(i => i.type === 'mood').length;
    
    text(`口味(${flavorCount}) | 抽象图(${abstractCount}) | 心情小人(${moodCount})`, width / 2, height / 2 + 80);
    
    textSize(14);
    text('（推荐基于您在后台设置的权重。）', width / 2, height - 30);
}


// ===================================
// ** 推荐算法核心 **
// ===================================

function calculateRecommendation() {
    if (selectedItems.length === 0) {
        return "请至少选择一个选项。";
    }

    // 初始化所有口味的总权重
    let totalWeights = {};
    flavorList.forEach(f => totalWeights[f.id] = 0);

    // 1. 遍历所有被选中的抽象图和心情小人
    const scoredItems = [...abstractList.filter(a => a.isSelected), ...moodList.filter(m => m.isSelected)];

    scoredItems.forEach(item => {
        // item.weights 存储了它对每个口味的权重
        for (const flavorId in item.weights) {
            // 累加权重
            totalWeights[flavorId] += item.weights[flavorId];
        }
    });

    // 2. 找到最高权重的口味
    let maxWeight = -1;
    let recommendedFlavorId = null;

    for (const flavorId in totalWeights) {
        if (totalWeights[flavorId] > maxWeight) {
            maxWeight = totalWeights[flavorId];
            recommendedFlavorId = flavorId;
        }
    }

    // 3. 转换为口味名称
    if (recommendedFlavorId) {
        const recommendedFlavor = flavorList.find(f => f.id === recommendedFlavorId);
        return recommendedFlavor ? recommendedFlavor.name : "未知口味";
    }

    return "（未找到相关性最高的口味）";
}


// ===================================
// ** 交互处理函数 **
// ===================================



// 交互处理函数
function mouseClicked() {
    if (!assetsLoaded) return; 

    if (currentPage === PAGES.COVER) {
        handleCoverClick();
        
        // *** 新增：检查存档切换点击 ***
        const btnY = height - 50;
        const btnW = 80;
        const btnH = 30;
        const spacing = 10;
        const totalWidth = 3 * btnW + 2 * spacing;
        let startX = (width - totalWidth) / 2;
        
        const archives = ['A', 'B', 'C'];
        
        for (let i = 0; i < archives.length; i++) {
            const archive = archives[i];
            const x = startX + i * (btnW + spacing);
            
            if (mouseX > x && mouseX < x + btnW && 
                mouseY > btnY && mouseY < btnY + btnH) {
                
                // 强制浏览器跳转到新的 URL 并带上 config 参数
                window.location.href = `index.html?config=${archive}`;
                return; // 阻止同时触发“开始测试”
            }
        }
        // ********************************

    } else if (currentPage === PAGES.FLAVOR_SELECT) {
        handleFlavorClick();
    } else if (currentPage === PAGES.ABSTRACT_SELECT) {
        handleAbstractClick();
    } else if (currentPage === PAGES.MOOD_SELECT) {
        handleMoodClick();
    }
}


// 收集所有选中的元素 (P5 开始前调用)
function collectSelections() {
    selectedItems = [];
    
    // 1. 收集选中的口味 (P2)
    const selectedFlavors = flavorList.filter(f => f.isSelected);
    selectedItems.push(...selectedFlavors.map(f => ({ 
        type: 'flavor', 
        id: f.id, 
        color: color(255, 100, 150) 
    })));

    // 2. 收集选中的抽象图片 (P3)
    const selectedAbstract = abstractList.filter(a => a.isSelected);
    selectedItems.push(...selectedAbstract.map(a => ({ 
        type: 'abstract', 
        id: a.id, 
        // 动画使用一个默认颜色，避免加载图片的复杂性
        color: color(random(255), random(255), random(255)) 
    })));

    // 3. 收集选中的心情小人 (P4)
    const selectedMood = moodList.filter(m => m.isSelected);
    selectedItems.push(...selectedMood.map(m => ({ 
        type: 'mood', 
        id: m.id, 
        // 动画使用一个默认颜色
        color: color(random(255), random(255), random(255)) 
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
    if (checkNextButtonClick()) {
        currentPage = PAGES.ABSTRACT_SELECT;
        return; 
    }
    
    const cols = 6;
    const itemSize = 100;
    const spacing = 10;
    const totalWidth = cols * itemSize + (cols - 1) * spacing;
    const startX = (width - totalWidth) / 2;
    const startY = 120; 

    for (let i = 0; i < flavorList.length; i++) {
        let flavor = flavorList[i];
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
    if (checkNextButtonClick()) {
        currentPage = PAGES.MOOD_SELECT; 
        return; 
    }
    
    if (checkBackButtonClick()) {
        currentPage = PAGES.FLAVOR_SELECT; 
        return;
    }

    const cols = 4;
    const itemSize = 150;
    const spacing = 20;
    const totalWidth = cols * itemSize + (cols - 1) * spacing;
    const startX = (width - totalWidth) / 2;
    const startY = 120; 

    for (let i = 0; i < abstractList.length; i++) {
        let img = abstractList[i];
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
    if (checkNextButtonClick()) {
        collectSelections();
        animationStartTime = millis(); 
        currentPage = PAGES.ANIMATION; 
        return; 
    }
    
    if (checkBackButtonClick()) {
        currentPage = PAGES.ABSTRACT_SELECT; 
        return;
    }

    const cols = 4;
    const itemSize = 150;
    const spacing = 20;
    const totalWidth = cols * itemSize + (cols - 1) * spacing;
    const startX = (width - totalWidth) / 2;
    const startY = 120; 

    for (let i = 0; i < moodList.length; i++) {
        let mood = moodList[i];
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