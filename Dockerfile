# 使用 nginx 作为基础镜像
FROM nginx:alpine

# 复制网站文件到 nginx 的默认网站目录
COPY webapp/ /usr/share/nginx/html/

# 暴露 80 端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"] 