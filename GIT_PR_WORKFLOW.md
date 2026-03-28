# 🐙 Git PR 工作流程指南

## ✅ Git 已初始化完成

### 📊 当前状态
```
✅ Git 仓库已初始化
✅ 首次提交完成 (41 个文件)
✅ .gitignore 已配置
✅ develop 分支已创建
```

## 🌿 分支策略

```
main (生产环境)
  └── develop (开发分支)
        └── feature/xxx (功能分支)
```

## 🚀 快速开始

### 方式 1: 使用设置脚本

```bash
bash scripts/setup-git-pr.sh
```

脚本会引导您完成：
- 配置远程仓库（GitHub/GitLab/Gitee）
- 设置 PR 工作流程
- 显示常用命令

### 方式 2: 手动配置

#### 1. 添加远程仓库

```bash
# GitHub 示例
git remote add origin https://github.com/您的用户名/wooden-fish.git

# GitLab 示例
git remote add origin https://gitlab.com/您的用户名/wooden-fish.git

# Gitee 示例
git remote add origin https://gitee.com/您的用户名/wooden-fish.git
```

#### 2. 创建开发分支

```bash
git checkout -b develop
git push -u origin develop
```

## 📝 每次功能开发的流程

### 步骤 1: 开始新功能

```bash
# 确保在 develop 分支
git checkout develop

# 拉取最新代码
git pull origin develop

# 创建功能分支
git checkout -b feature/木棍动画
```

### 步骤 2: 开发并提交

```bash
# 查看修改
git status

# 添加文件
git add .

# 提交（使用语义化提交信息）
git commit -m "feat: 添加木棍敲击动画"
```

### 步骤 3: 推送到远程

```bash
# 首次推送
git push -u origin feature/木棍动画

# 后续推送
git push
```

### 步骤 4: 创建 Pull Request

#### GitHub
1. 访问您的仓库: `https://github.com/您的用户名/wooden-fish`
2. 点击 **"Compare & pull request"**
3. 选择目标分支: `develop`
4. 填写 PR 信息:
   ```
   Title: feat: 添加木棍敲击动画
   Description: 
   - 添加木棍图片
   - 实现敲击动画
   - 优化位置和样式
   ```
5. 点击 **"Create pull request"**

#### GitLab
1. 访问您的仓库
2. 点击 **"Create merge request"**
3. 选择源分支和目标分支
4. 填写信息并提交

#### Gitee
1. 访问您的仓库
2. 点击 **"发起 Pull Request"**
3. 选择分支并提交

### 步骤 5: 合并 PR

```bash
# 1. 审核代码（在线完成）

# 2. 合并 PR（在网页上点击 "Merge"）

# 3. 删除功能分支（本地）
git checkout develop
git branch -d feature/木棍动画

# 4. 拉取最新代码
git pull origin develop
```

## 📋 提交信息规范

### 格式
```
<type>: <subject>

<body>
```

### 类型 (Type)

| 类型 | 说明 | 示例 |
|------|------|------|
| feat | 新功能 | feat: 添加木棍敲击动画 |
| fix | 修复bug | fix: 修复图片加载失败问题 |
| docs | 文档 | docs: 更新 README |
| style | 格式 | style: 调整代码缩进 |
| refactor | 重构 | refactor: 优化音频池管理 |
| perf | 性能 | perf: 优化动画性能 |
| test | 测试 | test: 添加单元测试 |
| build | 构建 | build: 更新依赖 |
| ci | CI | ci: 配置 GitHub Actions |

### 示例

```bash
# 功能提交
git commit -m "feat: 添加木棍敲击动画
- 实现木棍图片旋转动画
- 优化敲击位置
- 添加透明度效果"

# 修复提交
git commit -m "fix: 修复木鱼图片加载超时问题
- 压缩图片到合适大小
- 添加错误处理"

# 重构提交
git commit -m "refactor: 重构音频管理系统
- 使用音频实例池
- 优化播放逻辑"
```

## 🔧 常用 Git 命令

### 基本操作
```bash
git status          # 查看状态
git diff           # 查看修改
git log --oneline  # 查看提交历史
```

### 分支操作
```bash
git branch              # 查看分支
git branch -a          # 查看所有分支
git checkout 分支名     # 切换分支
git checkout -b 分支名  # 创建并切换
git branch -d 分支名    # 删除分支
```

### 同步操作
```bash
git fetch          # 拉取但不合并
git pull           # 拉取并合并
git push           # 推送
git push -u        # 首次推送并设置上游
```

### 撤销操作
```bash
git checkout -- 文件名    # 撤销工作区修改
git reset HEAD 文件名     # 撤销暂存
git reset --soft HEAD~1  # 撤销提交（保留修改）
git revert HEAD          # 创建新提交来撤销
```

## 🎯 开发场景

### 场景 1: 添加新功能

```bash
git checkout develop
git pull
git checkout -b feature/新功能
# 开发...
git add .
git commit -m "feat: 新功能描述"
git push -u origin feature/新功能
# 创建 PR → 审核 → 合并
```

### 场景 2: 修复 Bug

```bash
git checkout develop
git pull
git checkout -b fix/bug描述
# 修复...
git add .
git commit -m "fix: bug描述"
git push -u origin fix/bug描述
# 创建 PR → 审核 → 合并
```

### 场景 3: 更新文档

```bash
git checkout develop
git pull
git checkout -b docs/更新内容
# 更新文档...
git add .
git commit -m "docs: 更新内容"
git push -u origin docs/更新内容
# 创建 PR → 审核 → 合并
```

## ⚠️ 注意事项

### ✅ 应该做的
- 每次只做一个功能或修复
- 频繁提交（每完成一个小功能就提交）
- PR 要有清晰的描述
- 合并前进行代码审核

### ❌ 不应该做的
- 不要在 main 分支直接开发
- 不要一次性提交太多改动
- 不要提交敏感信息（密钥、密码等）
- 不要强制推送到 develop 分支

## 🐛 问题解决

### 问题 1: 合并冲突

```bash
# 拉取最新代码
git checkout develop
git pull

# 切换到功能分支
git checkout feature/功能名
git merge develop

# 解决冲突后
git add .
git commit -m "fix: 解决合并冲突"
git push
```

### 问题 2: 提交信息写错

```bash
# 修改最后一次提交信息
git commit --amend -m "正确的提交信息"

# 修改并强制推送（谨慎使用）
git push --force-with-lease
```

### 问题 3: 想要撤销提交

```bash
# 查看提交历史
git log --oneline

# 撤销到某个提交（保留修改）
git reset --soft HEAD~1

# 撤销到某个提交（不保留修改）
git reset --hard HEAD~1
```

## 📚 学习资源

- [Git 官方文档](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [语义化提交信息](https://www.conventionalcommits.org/)

---

**项目**: 木鱼功德机  
**版本**: v1.0.0  
**更新时间**: 2026-03-28
