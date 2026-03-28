# 木鱼音效资源说明

## 需要的音频文件

1. `audio/knock.mp3` - 敲击音效（必选）
   - 时长：建议 0.1-0.3 秒
   - 格式：MP3
   - 来源：可使用在线音效或自行录制

## 快速获取音效的方法

### 方法1：使用在线音效库
- 访问 freesound.org 搜索 "knock" 或 "wooden"
- 选择合适的短音效下载为 MP3 格式
- 重命名为 knock.mp3 放入 audio 目录

### 方法2：自行录制
- 使用手机录制敲击木鱼的声音
- 剪辑为 0.1-0.3 秒的短音频
- 转换为 MP3 格式

### 方法3：使用命令行生成测试音效（macOS）
```bash
# 使用 sox 生成简单的敲击音
brew install sox
sox -n audio/knock.mp3 synth 0.1 sin 440 vol 0.8
```

## 放置位置

```
wooden-fish/
├── audio/
│   └── knock.mp3          # 敲击音效
├── images/
│   └── wooden-fish-fallback.png  # 备用木鱼图片
└── ...
```

## 图片资源说明

### 主图（index.js 中配置）
- 使用网络图片：https://img.icons8.com/color/400/wooden-fish.png
- 备用图片：images/wooden-fish-fallback.png（需要自行准备）

### 获取木鱼图片
1. 在网上搜索木鱼图片
2. 保存为 PNG 格式
3. 放入 images 目录
4. 确保命名为 wooden-fish-fallback.png
