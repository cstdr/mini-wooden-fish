#!/bin/bash

# Git PR 工作流程设置脚本

echo "========================================="
echo "🐙 木鱼功德机 - Git PR 设置"
echo "========================================="
echo ""

# 检查 Git 状态
if [ ! -d ".git" ]; then
    echo "❌ 错误: 当前目录不是 Git 仓库"
    echo "请先运行: git init"
    exit 1
fi

# 检查远程仓库
echo "📡 检查远程仓库配置..."
if ! git remote -v | grep -q "origin"; then
    echo ""
    echo "⚠️  未配置远程仓库"
    echo ""
    echo "请选择您使用的平台："
    echo "1) GitHub"
    echo "2) GitLab"
    echo "3) Gitee (码云)"
    echo "4) 其他"
    echo ""
    read -p "请输入选项 [1-4]: " choice
    
    case $choice in
        1)
            echo ""
            echo "📝 GitHub 设置说明："
            echo "1. 访问 https://github.com 并登录"
            echo "2. 点击右上角 '+' → 'New repository'"
            echo "3. Repository name: wooden-fish"
            echo "4. 不要勾选 'Initialize this repository with a README'"
            echo "5. 点击 'Create repository'"
            echo "6. 复制仓库 URL（格式: https://github.com/用户名/wooden-fish.git）"
            echo ""
            read -p "请输入 GitHub 仓库 URL: " repo_url
            git remote add origin "$repo_url"
            ;;
        2)
            echo ""
            echo "📝 GitLab 设置说明："
            echo "1. 访问 https://gitlab.com 并登录"
            echo "2. 点击 'New project'"
            echo "3. Project name: wooden-fish"
            echo "4. Visibility level: Private 或 Public"
            echo "5. 点击 'Create project'"
            echo "6. 复制仓库 URL"
            echo ""
            read -p "请输入 GitLab 仓库 URL: " repo_url
            git remote add origin "$repo_url"
            ;;
        3)
            echo ""
            echo "📝 Gitee 设置说明："
            echo "1. 访问 https://gitee.com 并登录"
            echo "2. 点击右上角 '+' → '新建仓库'"
            echo "3. 仓库名称: wooden-fish"
            echo "4. 不要勾选 '使用 README 初始化仓库'"
            echo "5. 点击 '创建'"
            echo "6. 复制仓库 URL"
            echo ""
            read -p "请输入 Gitee 仓库 URL: " repo_url
            git remote add origin "$repo_url"
            ;;
        4)
            echo ""
            read -p "请输入远程仓库 URL: " repo_url
            git remote add origin "$repo_url"
            ;;
        *)
            echo "❌ 无效选项"
            exit 1
            ;;
    esac
else
    echo "✅ 远程仓库已配置"
    git remote -v
fi

echo ""
echo "========================================="
echo "🌿 创建开发分支"
echo "========================================="

# 创建开发分支
git checkout -b develop 2>/dev/null || git checkout develop
echo "✅ 已切换到 develop 分支"

echo ""
echo "========================================="
echo "📋 Git PR 工作流程"
echo "========================================="
echo ""
echo "每次功能开发请遵循以下流程："
echo ""
echo "1. 🆕 创建功能分支"
echo "   git checkout -b feature/功能名称"
echo ""
echo "2. ✏️ 提交代码"
echo "   git add ."
echo "   git commit -m 'feat: 添加新功能'"
echo ""
echo "3. 📤 推送分支"
echo "   git push -u origin feature/功能名称"
echo ""
echo "4. 🔀 创建 Pull Request"
echo "   - 访问您的远程仓库"
echo "   - 点击 'Compare & pull request'"
echo "   - 填写 PR 描述"
echo "   - 点击 'Create pull request'"
echo ""
echo "5. ✅ 合并 PR（合并到 develop 分支）"
echo "   - 审核代码"
echo "   - 点击 'Merge pull request'"
echo "   - 删除功能分支"
echo ""
echo "========================================="
echo "📝 提交信息规范"
echo "========================================="
echo ""
echo "使用语义化提交信息："
echo "  feat:     新功能"
echo "  fix:      修复bug"
echo "  docs:     文档更新"
echo "  style:    代码格式（不影响功能）"
echo "  refactor: 重构（不是新功能或修复bug）"
echo "  perf:     性能优化"
echo "  test:     测试相关"
echo "  build:    构建或依赖更新"
echo "  ci:       CI 配置更新"
echo ""
echo "示例："
echo "  feat: 添加木棍敲击动画"
echo "  fix: 修复木鱼图片加载问题"
echo "  docs: 更新 README"
echo ""
echo "========================================="
echo "🔧 常用 Git 命令"
echo "========================================="
echo ""
echo "查看状态:     git status"
echo "查看差异:     git diff"
echo "查看日志:     git log --oneline"
echo "切换分支:     git checkout 分支名"
echo "拉取更新:     git pull origin develop"
echo "查看分支:     git branch -a"
echo "删除分支:     git branch -d 分支名"
echo ""
echo "========================================="
echo "✅ Git PR 设置完成！"
echo "========================================="
