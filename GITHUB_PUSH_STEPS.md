# 🚀 推送到 GitHub 完整步骤

## 问题诊断

当前状态：
```
✅ GitHub 仓库存在: https://github.com/cstdr/mini-wooden-fish
❌ 远程仓库为空 (origin/main 不存在)
❌ 推送失败 (HTTP 400)
```

## 🔧 解决方案

### 方案 1：使用 GitHub 网页上传（最简单）

#### 步骤 1：在 GitHub 上准备仓库

1. 打开浏览器访问：https://github.com/cstdr/mini-wooden-fish
2. 如果仓库为空，应该能看到 "Quick setup" 页面
3. 点击 **"creating a new file"** 或 **"add a file"**

#### 步骤 2：使用 GitHub CLI（推荐）

```bash
# 如果已安装 gh
gh repo clone cstdr/mini-wooden-fish temp-repo
cd temp-repo

# 从原项目复制文件
cp -r /Users/ningningmao/Documents/ai-project/20260328-wooden-fish/* .
cp -r /Users/ningningmao/Documents/ai-project/20260328-wooden-fish/.* . 2>/dev/null || true

# 提交并推送
git add .
git commit -m "feat: 初始化木鱼功德机微信小程序"
git push origin main
```

#### 步骤 3：使用 GitHub 网页直接拖拽

1. 打开 https://github.com/cstdr/mini-wooden-fish
2. 点击 "Add file" → "Upload files"
3. 打开 Finder 窗口
4. 导航到：`/Users/ningningmao/Documents/ai-project/20260328-wooden-fish`
5. 选择**所有文件和文件夹**（除了 `.git`、`wooden-fish-code.zip` 和 `PUSH_TO_GITHUB.md`）
6. 拖拽到 GitHub 上传区域
7. 填写提交信息："feat: 初始化木鱼功德机微信小程序"
8. 点击 "Commit changes"

### 方案 2：使用 SSH 方式

```bash
# 1. 检查是否有 SSH 密钥
ls -la ~/.ssh/id_rsa.pub

# 2. 如果没有，生成密钥
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 3. 查看公钥
cat ~/.ssh/id_rsa.pub

# 4. 添加到 GitHub
#    访问 https://github.com/settings/keys
#    点击 "New SSH key"
#    粘贴公钥内容

# 5. 修改远程仓库地址
cd /Users/ningningmao/Documents/ai-project/20260328-wooden-fish
git remote set-url origin git@github.com:cstdr/mini-wooden-fish.git

# 6. 推送
git push -u origin main
```

### 方案 3：分步推送（避免大文件问题）

```bash
cd /Users/ningningmao/Documents/ai-project/20260328-wooden-fish

# 1. 先推送核心代码（不含大文件）
git add .
git reset HEAD images/*.png audio/knock.wav  # 排除大文件

git commit -m "feat: 木鱼功德机核心代码（不含媒体文件）"
git push origin main

# 2. 然后单独推送媒体文件
git add images/*.png audio/knock.wav
git commit -m "feat: 添加媒体资源"
git push origin main
```

## 📋 快速检查清单

在推送前，请确认：

- [ ] GitHub 账号已登录
- [ ] 仓库 `cstdr/mini-wooden-fish` 已创建
- [ ] 当前网络连接正常
- [ ] 没有使用公司/学校网络的代理限制

## 🎯 推荐的操作顺序

### 如果你使用 Mac：

1. **打开 Finder**
   ```
   Finder → 前往 → 前往文件夹
   路径: /Users/ningningmao/Documents/ai-project/20260328-wooden-fish
   ```

2. **打开 GitHub**
   ```
   浏览器: https://github.com/cstdr/mini-wooden-fish
   ```

3. **点击上传**
   ```
   GitHub 页面 → "Add file" → "Upload files"
   ```

4. **拖拽文件**
   ```
   Finder 中的所有文件（除了 .git 目录）
   拖拽到 GitHub 上传区域
   ```

5. **提交**
   ```
   Commit message: feat: 初始化木鱼功德机微信小程序
   点击 "Commit changes"
   ```

## 🔍 常见问题

### 问题 1：GitHub 显示 404

**解决**：确认仓库名称正确
```
仓库地址: https://github.com/cstdr/mini-wooden-fish
用户名: cstdr
仓库名: mini-wooden-fish
```

### 问题 2：推送被拒绝

**解决**：远程仓库可能使用不同的分支名称
```bash
git push -u origin main --force
```

### 问题 3：文件太大

**解决**：移除大文件或使用 LFS
```bash
# 使用 Git LFS
git lfs install
git lfs track "*.png"
git lfs track "*.wav"
git add .gitattributes
git push origin main
```

## 📞 获取帮助

如果以上方法都不行：

1. **访问仓库页面**：https://github.com/cstdr/mini-wooden-fish
2. **点击 "Add file"**
3. **选择 "Create new file"**
4. **文件名输入**: `README.md`
5. **内容输入**: `# mini-wooden-fish`
6. **点击 "Commit new file"**
7. **然后重新尝试推送**

---

**提示**：GitHub 网页上传是最可靠的方式，适合初学者！
