# 🚀 推送到 GitHub 指南

## ⚠️ 网络连接问题

当前遇到网络连接失败，请尝试以下解决方案：

## 方案 1：检查网络和代理

```bash
# 检查是否使用了代理
echo $http_proxy
echo $https_proxy

# 如果有代理，可能需要取消代理再推送
unset http_proxy
unset https_proxy

# 或者设置 Git 代理
git config --global http.proxy ""
git config --global https.proxy ""
```

## 方案 2：使用 SSH 方式

```bash
# 1. 生成本地 SSH 密钥（如果还没有）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 2. 查看公钥
cat ~/.ssh/id_rsa.pub

# 3. 添加到 GitHub
# 访问 https://github.com/settings/keys
# 点击 "New SSH key"
# 粘贴公钥

# 4. 修改远程仓库为 SSH 方式
git remote set-url origin git@github.com:cstdr/mini-wooden-fish.git

# 5. 推送
git push -u origin main
```

## 方案 3：使用 GitHub CLI

```bash
# 1. 安装 GitHub CLI
# macOS: brew install gh
# Ubuntu: sudo apt install gh

# 2. 登录
gh auth login

# 3. 推送
gh repo clone cstdr/mini-wooden-fish || true
git push -u origin main
```

## 方案 4：手动方式（推荐）

### 步骤 1：下载代码包

我可以帮你生成一个代码压缩包，然后你手动上传：

```bash
# 生成代码包
cd /Users/ningningmao/Documents/ai-project/20260328-wooden-fish
git archive -o wooden-fish.zip HEAD
```

### 步骤 2：手动上传

1. 访问 https://github.com/cstdr/mini-wooden-fish
2. 点击 "Add file" → "Upload files"
3. 拖拽 `wooden-fish.zip` 文件
4. 填写提交信息："feat: 初始化木鱼功德机微信小程序"
5. 点击 "Commit changes"

## 快速检查清单

- [ ] 检查网络连接
- [ ] 确认 GitHub 账号已登录
- [ ] 确认仓库 `cstdr/mini-wooden-fish` 已创建
- [ ] 检查是否有写入权限

## 网络诊断

```bash
# 测试 GitHub 连接
ping github.com

# 测试特定端口
telnet github.com 443

# 查看 Git 远程配置
git remote -v
```

## 获取帮助

如果以上方法都不行：

1. 访问 https://github.com/cstdr/mini-wooden-fish
2. 点击 "Upload files"
3. 直接拖拽整个项目文件夹到网页上
4. GitHub 会自动处理

## 当前配置

```bash
远程仓库: https://github.com/cstdr/mini-wooden-fish.git
分支: main
提交次数: 3 次
待推送文件: 43 个
```

---

**提示**: 网络问题通常是临时的，可以多尝试几次或稍后再试。
