const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 定义关键目录路径
// __dirname 是 Node.js 提供的全局变量，表示当前文件（server.js）所在的目录的绝对路径。
const ARCHIVES_DIR = path.join(__dirname, 'archives');
const PUBLIC_DIR = path.join(__dirname, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

// 确保目录存在
if (!fs.existsSync(ARCHIVES_DIR)) fs.mkdirSync(ARCHIVES_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

// 配置 CORS，允许前端页面访问
app.use(cors());

// 允许解析 JSON 请求体
app.use(express.json());

// =========================================================
// == 关键修复：配置静态文件服务 (必须在所有 API 路由之前) ==
// =========================================================

// 1. 允许访问根目录下的文件 (例如 admin.html)
// 使用正确的 __dirname 变量。这解决了 Cannot GET /admin.html 错误。
app.use(express.static(__dirname));

// 2. 允许通过 /public 路径访问 public 目录下的所有文件 (例如图片)
app.use('/public', express.static(PUBLIC_DIR)); 


// 配置 Multer 用于文件上传
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, IMAGES_DIR);
    },
    filename: (req, file, cb) => {
        // 使用时间戳和随机数确保文件名唯一
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        // 移除文件名中的空格或特殊字符
        const safeName = path.basename(file.originalname, extension).replace(/\s/g, '_');
        cb(null, safeName + '-' + uniqueSuffix + extension);
    }
});
const upload = multer({ storage: storage });

// --- API 路由 ---

// 1. 加载配置存档
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

// 2. 保存配置存档
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

// 3. 图片上传
app.post('/api/upload/image', upload.single('imageFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // 返回的 URL 必须是服务器可访问的相对路径
    const relativePath = `/public/images/${req.file.filename}`; 
    
    res.json({ 
        success: true, 
        url: relativePath, 
        message: 'Upload successful.' 
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // 调试信息：显示服务器认为的当前路径
    console.log(`Server Directory (__dirname): ${__dirname}`);
    console.log(`请确保 admin.html 文件位于此路径下`);
    console.log(`请确保浏览器访问 http://localhost:3000/admin.html`);
});