const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = 3000;

// =========================================================
// == 1. 精确路径定义（关键：定位所有文件夹） ==
// =========================================================

// __dirname 是 server.js 所在的目录 (Gelato_1.0/GelatoBackend)
const BACKEND_DIR = __dirname;
const PROJECT_ROOT_DIR = path.join(BACKEND_DIR, '..'); // Gelato_1.0

// index.html 及其资源 (style.css, sketch.js) 所在的目录
const GELATO_TEST_DIR = path.join(PROJECT_ROOT_DIR, 'GelatoTest'); 

// 核心目录
const ARCHIVES_DIR = path.join(BACKEND_DIR, 'archives');
const PUBLIC_DIR = path.join(BACKEND_DIR, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

// 确保目录存在
if (!fs.existsSync(ARCHIVES_DIR)) fs.mkdirSync(ARCHIVES_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

// 配置 CORS 和 JSON 解析
app.use(cors());
app.use(express.json());

// =========================================================
// == 2. 配置静态文件服务（解决 CSS/JS 404 问题） ==
// =========================================================

// **【修复点 1】**：允许浏览器访问 public/ 目录下的静态资源 (图片)
app.use('/public', express.static(PUBLIC_DIR)); 

// **【修复点 2】**：允许浏览器访问 GelatoTest 目录下的资源（style.css, sketch.js）
// 当浏览器请求 /style.css 时，Express 会去 GELATO_TEST_DIR 中查找
app.use(express.static(GELATO_TEST_DIR)); 


// 配置 Multer 用于文件上传
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, IMAGES_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const safeName = path.basename(file.originalname, extension).replace(/\s/g, '_');
        cb(null, safeName + '-' + uniqueSuffix + extension);
    }
});
const upload = multer({ storage: storage });


// =========================================================
// == 3. API 路由 (功能代码) ==
// =========================================================

// 加载配置存档
app.get('/api/config/:archiveName', (req, res) => {
    const fileName = `config_${req.params.archiveName.toUpperCase()}.json`;
    const filePath = path.join(ARCHIVES_DIR, fileName);

    if (fs.existsSync(filePath)) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            res.json(JSON.parse(data));
        } catch (e) {
            console.error('JSON Parse Error:', e);
            res.status(500).json({ success: false, message: 'Invalid JSON format in archive file.' });
        }
    } else {
        res.status(404).json({ success: false, message: 'Archive not found.' });
    }
});

// 保存配置存档
app.post('/api/save/:archiveName', (req, res) => {
    const fileName = `config_${req.params.archiveName.toUpperCase()}.json`;
    const filePath = path.join(ARCHIVES_DIR, fileName);

    try {
        const jsonString = JSON.stringify(req.body, null, 2);
        fs.writeFileSync(filePath, jsonString, 'utf8');
        res.json({ success: true, message: 'Archive saved successfully.' });
    } catch (e) {
        console.error('Save Error:', e);
        res.status(500).json({ success: false, message: 'Failed to write file.' });
    }
});

// 图片上传
app.post('/api/upload/image', upload.single('imageFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const relativePath = `/public/images/${req.file.filename}`; 
    res.json({ 
        success: true, 
        url: relativePath, 
        message: 'Upload successful.' 
    });
});


// =========================================================
// == 4. 精确路由到 HTML 文件（关键：定位 index.html 和 admin.html） ==
// =========================================================

// 1. 路由到后台配置页：admin.html (位于 GelatoBackend 目录)
app.get('/admin.html', (req, res) => {
    const filePath = path.join(BACKEND_DIR, 'admin.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Cannot find admin.html in GelatoBackend folder.');
    }
});

// 2. 路由到前端测试页：index.html (位于 GelatoTest 目录)
app.get(['/', '/index.html'], (req, res) => {
    const filePath = path.join(GELATO_TEST_DIR, 'index.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Cannot find index.html in GelatoTest folder.');
    }
});


// =========================================================
// == 5. 启动服务器 ==
// =========================================================
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`项目根目录: ${PROJECT_ROOT_DIR}`);
    console.log(`前端文件目录: ${GELATO_TEST_DIR}`);
    console.log(`--- 请在 Gelato_1.0 目录下运行 node GelatoBackend/server.js ---`);
    console.log(`访问后台配置: http://localhost:3000/admin.html`);
    console.log(`访问前端测试页: http://localhost:3000/index.html`);
});