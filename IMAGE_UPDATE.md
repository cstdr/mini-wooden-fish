# 🖼️ 木鱼图片更新说明

## ✅ 已完成

### 图片替换
- **来源**: 用户提供的真实木鱼图片
- **路径**: `/images/wooden-fish.png`
- **大小**: 209KB
- **格式**: PNG

### 代码修改

#### 1. index.js
```javascript
// 改回使用图片
data: {
  woodenFishImage: '/images/wooden-fish.png',
  // 移除了 woodenFishEmoji
}
```

#### 2. index.wxml
```xml
<!-- 使用 image 组件 -->
<view class="wooden-fish-wrapper {{isShaking ? 'shake' : ''}}" bindtap="onWoodenFishTap">
  <image 
    class="wooden-fish-image" 
    src="{{woodenFishImage}}" 
    mode="aspectFit"
  ></image>
</view>
```

#### 3. index.wxss
```css
.wooden-fish-image {
  width: 400rpx;
  height: 400rpx;
  max-width: 70vw;
  max-height: 70vh;
  object-fit: contain;
  filter: drop-shadow(4rpx 4rpx 8rpx rgba(0, 0, 0, 0.15));
}
```

## 🎯 测试步骤

### 微信开发者工具测试

1. **重新编译**
   ```
   Cmd+R (Mac) / Ctrl+R (Windows)
   ```

2. **检查图片显示**
   - ✅ 真实的木鱼图片应该显示在屏幕中央
   - ✅ 图片大小适中（400rpx）
   - ✅ 有阴影效果

3. **测试点击交互**
   - ✅ 点击图片有抖动动画
   - ✅ +1 动画正常显示
   - ✅ 功德值正常累加

## 📐 图片规格

### 尺寸优化
- **原始尺寸**: 未知
- **显示尺寸**: 400rpx × 400rpx
- **最大宽度**: 70vw
- **最大高度**: 70vh

### 显示效果
```
┌─────────────────────────┐
│     功德累计             │
│       12345            │
│                         │
│      ┌─────────┐       │
│      │  木鱼   │       │
│      │  图片   │       │
│      └─────────┘       │
│                         │
│       ⚙ 设置            │
└─────────────────────────┘
```

## 🎨 样式调整

### 图片阴影
```css
filter: drop-shadow(4rpx 4rpx 8rpx rgba(0, 0, 0, 0.15));
```
- 柔和的阴影效果
- 增加层次感
- 避免生硬

### 自适应布局
```css
max-width: 70vw;   /* 最大宽度70%屏幕宽度 */
max-height: 70vh;  /* 最大高度70%屏幕高度 */
```
- 大屏幕：显示更大的图片
- 小屏幕：自动缩小适应

## 🔄 替换其他图片

如果未来想更换木鱼图片：

1. **准备新图片**
   - 格式：PNG、JPG、WebP
   - 推荐尺寸：1024×1024 以上
   - 文件大小：< 2MB

2. **替换文件**
   ```
   替换 /images/wooden-fish.png
   ```

3. **重新编译**
   - 自动使用新图片
   - 无需修改代码

## 💡 优化建议

### 图片压缩
如果图片加载慢，可以：

1. **压缩工具**
   - TinyPNG: https://tinypng.com/
   - Squoosh: https://squoosh.app/

2. **压缩设置**
   - PNG: 压缩率 70-80%
   - 目标大小：< 100KB

3. **格式转换**
   - PNG → WebP（更小）
   - PNG → JPEG（更小，但无透明）

### 渐进式加载
添加加载占位符：

```javascript
// index.js
data: {
  imageLoaded: false
}

// image 加载完成
onImageLoad() {
  this.setData({ imageLoaded: true });
}

// index.wxml
<view class="image-container">
  <image wx:if="{{imageLoaded}}" src="{{woodenFishImage}}" />
  <view wx:else class="loading-placeholder">加载中...</view>
</view>
```

## 🐛 常见问题

### Q: 图片不显示？

**检查**：
1. 图片路径是否正确
2. 文件是否存在
3. 控制台是否有错误

**解决方案**：
```bash
# 检查文件
ls -la /images/wooden-fish.png

# 清除缓存重新编译
工具 → 清除缓存 → 清除全部
```

### Q: 图片太大/太小？

**调整样式**：
```css
.wooden-fish-image {
  width: 300rpx;    /* 改小 */
  height: 300rpx;   /* 改小 */
  /* 或 */
  width: 500rpx;    /* 改大 */
  height: 500rpx;   /* 改大 */
}
```

### Q: 图片失真？

**优化显示模式**：
```xml
<!-- 保持比例，完整显示 -->
mode="aspectFit"

<!-- 填充，可能裁剪 -->
mode="aspectFill"

<!-- 拉伸填满 -->
mode="scaleToFill"
```

## 📱 响应式适配

### 不同屏幕尺寸
```css
/* 小屏幕 */
@media (max-width: 375px) {
  .wooden-fish-image {
    width: 300rpx;
    height: 300rpx;
  }
}

/* 大屏幕 */
@media (min-width: 768px) {
  .wooden-fish-image {
    width: 500rpx;
    height: 500rpx;
  }
}
```

## ✅ 验证清单

测试图片显示：

```
□ 图片正常显示
□ 图片大小合适
□ 图片位置居中
□ 阴影效果正常
□ 点击有动画
□ 无加载错误
```

---

**更新时间**: 2026-03-28  
**图片大小**: 209KB  
**格式**: PNG  
**状态**: ✅ 已应用
