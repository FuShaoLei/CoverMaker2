#!/bin/bash

# 构建
npm run build

# 进入 dist 目录
cd dist

# 初始化 git
git init

# 添加远程仓库
git remote add origin git@github.com:FuShaoLei/CoverMaker.git

# 添加所有文件
git add .

# 提交
git commit -m 'update'

# 强制推送到 master 分支
git push -f --set-upstream origin HEAD:gh-page
