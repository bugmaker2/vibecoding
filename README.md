# Interactive Hello World App

一个简单的交互式网页应用，包含按钮点击效果、彩带动画和祝福语显示功能。

## 功能特点

- 点击按钮触发动画效果
- 显示随机祝福语
- 彩带庆祝效果
- 点击计数器
- 数据持久化存储

## 部署到 Railway

1. Fork 这个仓库
2. 在 Railway 中创建新项目
3. 选择 "Deploy from GitHub repo"
4. 选择你的 fork 仓库
5. Railway 会自动检测配置并部署

## 本地运行

使用 Docker:
```bash
docker build -t hello-world-app .
docker run -d -p 8080:80 hello-world-app
```

访问 http://localhost:8080 查看应用

## 技术栈

- HTML5
- CSS3
- JavaScript
- Nginx
- Docker
