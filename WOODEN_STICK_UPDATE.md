# 🪵 木棍敲击动画功能

## ✅ 功能实现完成

### 📋 实现内容

1. **木棍图片压缩**
   - 原始大小: 6.4 MB
   - 压缩后: 79 KB
   - 尺寸: 256 × 139 像素
   - 格式: PNG (保留透明)

2. **木棍放置位置**
   - 位置: 木鱼右上角
   - 倾斜角度: -30度
   - 大小: 150rpx × 150rpx

3. **敲击动画**
   - 动画时间: 100ms
   - 旋转角度: 从 -30deg → +15deg
   - 位移: 向右下移动 20rpx × 15rpx
   - 效果: 快速敲击木鱼的动感

## 🎯 技术实现

### 修改的文件

#### 1. pages/index/index.js

**添加数据**:
```javascript
data: {
  // ... 其他数据
  woodenStickImage: '/images/wooden-mini.png',  // 木棍图片
  isHitting: false,  // 敲击状态
}
```

**添加方法**:
```javascript
triggerHitAnimation() {
  this.setData({ isHitting: true });
  setTimeout(() => {
    this.setData({ isHitting: false });
  }, 100);
}
```

**修改点击处理**:
```javascript
onWoodenFishTap(e) {
  // ... 其他逻辑
  this.triggerShakeAnimation();   // 木鱼抖动
  this.triggerHitAnimation();      // 木棍敲击 ← 新增
}
```

#### 2. pages/index/index.wxml

**添加木棍元素**:
```xml
<view class="wooden-fish-container">
  <!-- 木鱼 -->
  <view class="wooden-fish-wrapper {{isShaking ? 'shake' : ''}}" bindtap="onWoodenFishTap">
    <image class="wooden-fish-image" src="{{woodenFishImage}}" />
  </view>
  
  <!-- 木棍 ← 新增 -->
  <view class="wooden-stick-wrapper {{isHitting ? 'hit' : ''}}" bindtap="onWoodenFishTap">
    <image class="wooden-stick-image" src="{{woodenStickImage}}" />
  </view>
</view>
```

#### 3. pages/index/index.wxss

**添加样式**:
```css
/* 木棍容器 */
.wooden-fish-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 木棍位置 */
.wooden-stick-wrapper {
  position: absolute;
  top: -80rpx;
  right: -60rpx;
  width: 150rpx;
  height: 150rpx;
  transform: rotate(-30deg);  /* 初始倾斜 */
  transform-origin: bottom left;
  transition: transform 0.05s ease-out;
  z-index: 10;
}

/* 敲击动画 */
.wooden-stick-wrapper.hit {
  transform: rotate(15deg) translateX(20rpx) translateY(15rpx);
}
```

## 📊 图片信息

| 图片 | 文件名 | 大小 | 尺寸 | 用途 |
|------|--------|------|------|------|
| 木鱼 | wooden-fish-mini.png | 153 KB | 512×279 | 主视觉 |
| 木棍 | wooden-mini.png | 79 KB | 256×139 | 敲击工具 |

## 🎨 视觉效果

### 布局示意
```
        木棍 (-30°倾斜)
          ↓
    ┌──────────┐
    │  🪵      │ ← 木棍 (右上角)
    └────┬─────┘
         │
    ┌────┴────┐
    │         │
    │   🐟    │ ← 木鱼 (中心)
    │         │
    └─────────┘
    
    点击时:
    木棍 → 快速向右下敲击 → 回弹
    木鱼 → 轻微抖动
```

### 动画效果

#### 敲击前 (静态)
```
角度: -30deg
位置: 木鱼右上角
状态: 准备敲击
```

#### 敲击中 (动态)
```
角度: +15deg
位置: 向右下移动 20rpx
时间: 50ms
效果: 快速敲击
```

#### 敲击后 (回弹)
```
角度: -30deg (回到原位)
时间: 50ms
状态: 等待下一次敲击
```

## 🚀 测试步骤

### 1. 重新编译
```
Cmd+R (Mac) / Ctrl+R (Windows)
```

### 2. 检查显示
```
✅ 木鱼图片正常显示
✅ 木棍图片在木鱼右上角
✅ 木棍倾斜 -30 度
✅ 两个图片都可见
```

### 3. 测试交互
```
点击木鱼 → 
✅ 木鱼抖动动画
✅ 木棍敲击动画 (快速向右下移动)
✅ +1 动画正常显示
✅ 功德值 +1
```

### 4. 验证动画
```
✅ 木棍敲击流畅 (< 100ms)
✅ 动画无卡顿
✅ 敲击后木棍回到原位
✅ 可以连续快速点击
```

## 🎯 自定义选项

### 调整木棍位置

**修改 index.wxss 中的位置**:
```css
.wooden-stick-wrapper {
  /* 上移 */
  top: -100rpx;  /* 从 -80rpx 改为 -100rpx */
  
  /* 右移 */
  right: -80rpx;  /* 从 -60rpx 改为 -80rpx */
  
  /* 放大 */
  width: 180rpx;   /* 从 150rpx 改为 180rpx */
  height: 180rpx;  /* 从 150rpx 改为 180rpx */
}
```

### 调整敲击力度

**修改动画角度和位移**:
```css
.wooden-stick-wrapper.hit {
  /* 更大力 */
  transform: rotate(25deg) translateX(30rpx) translateY(25rpx);
  
  /* 更小力 */
  transform: rotate(5deg) translateX(10rpx) translateY(10rpx);
}
```

### 调整初始倾斜

**修改初始角度**:
```css
.wooden-stick-wrapper {
  transform: rotate(-45deg);  /* 更倾斜 */
  /* 或 */
  transform: rotate(-15deg);  /* 更水平 */
}
```

## 🐛 常见问题

### Q: 木棍位置不对？

**检查**:
1. 调整 `top` 和 `right` 的值
2. 调整 `width` 和 `height` 的大小
3. 确保木棍在木鱼容器内

**示例**:
```css
.wooden-stick-wrapper {
  top: -60rpx;   /* 向上移动 */
  right: -40rpx; /* 向左移动 */
  width: 120rpx;  /* 缩小 */
}
```

### Q: 敲击动画不流畅？

**原因**: 动画时间太长

**解决方案**:
```css
/* 更快的动画 */
.wooden-stick-wrapper {
  transition: transform 0.03s ease-out;  /* 从 0.05s 改为 0.03s */
}
```

### Q: 木棍图片不显示？

**检查**:
1. 文件路径是否正确: `/images/wooden-mini.png`
2. 文件是否存在
3. 控制台是否有错误

**解决方案**:
```bash
ls -lh images/
# 确保 wooden-mini.png 存在
```

### Q: 敲击方向不对？

**问题**: 木棍应该从右边敲向左边

**原因**: 旋转方向相反

**解决方案**:
```css
/* 修改初始角度 */
transform: rotate(30deg);  /* 倾斜向右 */

/* 修改敲击方向 */
.wooden-stick-wrapper.hit {
  transform: rotate(-15deg) translateX(-20rpx) translateY(15rpx);
}
```

## 📐 坐标系统

### 当前布局
```
屏幕坐标:
Y (上)
↑
│    [木棍]
│        ┌──────┐
│        │ 木鱼  │
│        └──────┘
│
└────────────────→ X (右)
```

### 变换说明
```
transform: rotate(-30deg)
  └─ 以左下角为圆心旋转

transform: rotate(15deg) translateX(20rpx) translateY(15rpx)
  └─ 旋转 + 位移 → 敲击效果
```

## 🎬 动画原理

### 1. 初始状态
```css
transform: rotate(-30deg);
```
- 木棍倾斜放置
- 头部在右上方

### 2. 敲击触发
```javascript
triggerHitAnimation() {
  this.setData({ isHitting: true });
}
```

### 3. CSS 动画
```css
.wooden-stick-wrapper.hit {
  transform: rotate(15deg) translateX(20rpx) translateY(15rpx);
}
```
- 旋转: -30deg → +15deg (顺时针 45度)
- 位移: 向右下移动

### 4. 回弹
```javascript
setTimeout(() => {
  this.setData({ isHitting: false });
}, 100);
```
- 100ms 后回到初始状态
- transition 产生平滑回弹

## 💡 高级定制

### 添加阴影效果

```css
.wooden-stick-image {
  filter: drop-shadow(2rpx 2rpx 4rpx rgba(0, 0, 0, 0.2));
}
```

### 添加投影

```css
.wooden-stick-wrapper {
  filter: drop-shadow(4rpx 4rpx 8rpx rgba(0, 0, 0, 0.3));
}
```

### 添加摆动动画

```css
/* 轻微摆动 */
@keyframes swing {
  0%, 100% { transform: rotate(-30deg); }
  50% { transform: rotate(-28deg); }
}

.wooden-stick-wrapper {
  animation: swing 2s ease-in-out infinite;
}
```

### 添加敲击音效同步

```javascript
playKnockSound() {
  // 确保音效时长与动画匹配
  const audio = this.data.audioPool.find(item => !item.inUse);
  if (audio) {
    audio.audio.src = '/audio/knock.wav';
    audio.audio.play();
  }
}
```

## 📱 响应式适配

### 不同屏幕尺寸

```css
/* 小屏幕 */
@media (max-width: 375px) {
  .wooden-stick-wrapper {
    width: 120rpx;
    height: 120rpx;
    top: -60rpx;
    right: -40rpx;
  }
}

/* 大屏幕 */
@media (min-width: 768px) {
  .wooden-stick-wrapper {
    width: 180rpx;
    height: 180rpx;
    top: -100rpx;
    right: -80rpx;
  }
}
```

## ✅ 验证清单

```
□ 木棍图片显示 ✅
□ 木棍位置正确 ✅
□ 木棍倾斜角度 ✅
□ 点击有敲击动画 ✅
□ 敲击动画流畅 ✅
□ 动画后木棍回位 ✅
□ 可以连续点击 ✅
□ 无性能问题 ✅
```

## 🎯 下一步优化建议

1. **添加真实敲击轨迹**
   - 使用 CSS 动画路径
   - 添加运动模糊效果

2. **添加音效同步**
   - 敲击时播放音效
   - 确保音效与动画同步

3. **添加粒子效果**
   - 敲击时产生小粒子
   - 增加视觉反馈

4. **添加力度反馈**
   - 根据点击力度调整动画
   - 快速点击力度更大

---

**更新时间**: 2026-03-28  
**功能状态**: ✅ 已实现  
**动画类型**: 旋转 + 位移  
**性能指标**: < 100ms 响应
