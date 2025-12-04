const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 配置 CORS，允许前端 (p5.js 默认运行在 http://127.0.0.1:5500) 访问
app.use(cors());
app.use(express.json()); // 用于处理 JSON 格式的请求体 (例如保存存档)

// 静态文件服务：允许浏览器直接访问 public 文件夹内的图片
app.use('/public', express.static(path.join(__dirname, 'public')));

// --- 1. Multer 配置：处理图片上传 ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, 'public', 'images');
        // 确保文件夹存在
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // 保持原始文件名，但在前面加上时间戳防止重名
        cb(null, Date.now() + '_' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// API: 图片上传路由
app.post('/api/upload/image', upload.single('imageFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('没有文件被上传。');
    }
    // 返回图片在服务器上的 URL 路径
    const imageUrl = `/public/images/${req.file.filename}`;
    res.json({ success: true, url: imageUrl });
});


// --- 2. 存档路径定义 ---
const ARCHIVES_DIR = path.join(__dirname, 'archives');
if (!fs.existsSync(ARCHIVES_DIR)) {
    fs.mkdirSync(ARCHIVES_DIR);
}
// 辅助函数：获取特定存档文件的完整路径
function getArchivePath(name) {
    return path.join(ARCHIVES_DIR, `config_${name}.json`);
}


// --- 3. API: 加载存档 (用于 P5.js 前端和后台编辑) ---
app.get('/api/config/:name', (req, res) => {
    const archiveName = req.params.name.toUpperCase();
    const filePath = getArchivePath(archiveName);

    if (fs.existsSync(filePath)) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            res.json(JSON.parse(data));
        } catch (error) {
            console.error('读取存档文件失败:', error);
            res.status(500).send('无法解析存档文件。');
        }
    } else {
        // 如果存档不存在，返回一个空的默认结构 (用于初次编辑)
        res.status(404).json({ message: '存档文件不存在，返回默认结构', name: archiveName });
    }
});


// --- 4. API: 保存存档 (用于后台编辑) ---
app.post('/api/save/:name', (req, res) => {
    const archiveName = req.params.name.toUpperCase();
    const filePath = getArchivePath(archiveName);
    const configData = req.body;

    try {
        // 将配置数据写入 JSON 文件
        fs.writeFileSync(filePath, JSON.stringify(configData, null, 2));
        res.json({ success: true, message: `${archiveName} 存档已成功保存。` });
    } catch (error) {
        console.error('保存存档文件失败:', error);
        res.status(500).send('保存存档文件时发生错误。');
    }
});


// 启动服务器
app.listen(PORT, () => {
    console.log(`✨ 后台服务器已启动，监听端口: http://localhost:${PORT}`);
    console.log(`请确保您的 p5.js 前端也已启动 (通常在端口 5500)`);
});