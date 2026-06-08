# EnerCloud H5 大屏项目 - 开发与部署完整指南

本文档总结了本项目的整体工作流，包括初期利用 Stitch MCP 辅助开发、如何连接 AWS EC2 服务器，以及前端部署和网络防风控指南。可作为后续项目交接和排障的参考手册。

---

## 1. 工具篇：如何连接并使用 Stitch MCP

**Stitch MCP (Model Context Protocol)** 是一套用于让 AI 代理（如我）直接连接并操作 UI/UX 设计系统的后台标准协议。在这个项目中，我们用它来高保真还原页面。

- **如何连接**：作为您的 AI 编程助手，系统已经通过读取您本地环境目录下的 MCP 配置文件，**自动为我建立了与 Stitch MCP 的连接**。对于您（开发者）而言，无需任何手动抓包或编写接口连接代码。
- **如何使用**：您只需在对话框中用自然语言向我下达指令（例如：“调用 Stitch 帮我生成一个深色主题的仪表盘页面”、“帮我获取当前的屏幕设计”），我就会在后台全自动调用诸如 `generate_screen_from_text` 或 `apply_design_system` 等内部工具，把精美的 React 组件和 CSS 样式直接写进您的项目源码里。

---

## 2. 连接篇：如何连接您的 AWS EC2 服务器

当您的 EC2 服务器在云端创建好（前提：网络安全组中必须允许 `SSH 端口 22` 来源设为 `0.0.0.0/0`），主要有两种连接方式：

### 方式一：网页端直连 (EC2 Instance Connect) —— 🔥 强烈推荐
由于国内网络环境（尤其是开启本地 VPN 时）极易拦截终端的底层 TCP 请求导致超时，这是最简单、最稳妥的方法：
1. 登录 AWS 管理控制台，进入 EC2 实例列表。
2. 鼠标勾选您的服务器，点击页面右上角的 **“连接 (Connect)”**。
3. 选择默认的 **EC2 Instance Connect** 选项卡，直接点击下方的橙色连接按钮。
4. 浏览器会弹出一个黑色的终端页面。恭喜，您已成功进入服务器！全程不需要配置任何密钥。

### 方式二：本地终端 SSH 连接（备用方案）
如果您关闭了代理且网络畅通，想在本地终端直接控制服务器：
1. 建服务器时，保存好下载的 `.pem` 密钥文件。
2. 打开 PowerShell 或 Mac 终端，执行连接命令：
   ```bash
   ssh -i "C:\您的路径\Enercloud.pem" ubuntu@您的公网IP
   ```
   *(注：如果卡住不动或报错 `Connection timed out`，说明您的本地网络出海受限，请立刻退回使用“方式一”)*。

---

## 3. 部署篇：如何把前端项目部署到 EC2

前端 React/Vite 项目编译后其实就是一堆纯静态的文件（HTML/JS/CSS），它们不需要 Node.js 后端服务来运行，只需借助 **Nginx** 即可发布到公网。

### 首次一键部署脚本
在您通过上述“方式一”连接到服务器的黑色终端后，**一次性复制并粘贴**以下脚本回车执行。它会自动完成所有环境安装、代码拉取和网页挂载：

```bash
# 1. 更新系统并安装所需环境 (Nginx, Node.js, Git)
sudo apt update
sudo apt install -y nginx curl git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 2. 从 Github 拉取最新代码并打包编译
cd ~
git clone https://github.com/zhenggjuan518/enercloud-app.git
cd enercloud-app
npm install
npm run build   # 这步会把源码变成可以发布的纯静态产物存放在 dist/ 文件夹里

# 3. 将编译好的纯静态文件拷贝到 Nginx 对外服务的目录下
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/

# 4. 配置 Nginx 路由规则 (解决 React 路由刷新 404 的问题)
sudo bash -c 'cat > /etc/nginx/sites-available/default <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    root /var/www/html;
    index index.html index.htm;
    server_name _;
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF'

# 5. 重启 Nginx
sudo systemctl restart nginx
```
此时，直接在浏览器中访问您的 EC2 **公有 IPv4 地址** 即可看到大屏页面。

### 日常后续更新（极速替换）
只要在本地电脑改完代码并推送到了 GitHub (`git push`)，只需要回到服务器终端，执行下面 4 行命令来热更新：
```bash
cd ~/enercloud-app
git pull
npm run build
sudo cp -r dist/* /var/www/html/
```

---

## 4. AWS 账号防风控排坑指南 (重要)

如果您的账号顶部飙红报错：`Account is currently blocked...`，这说明您触发了 AWS 的反欺诈冻结系统。

**如何避免新账号被封（风控红线）：**
1. **切勿开 VPN**：注册账号和日常操作控制台时，绝不要使用代理软件，使用国内真实家庭宽带最安全。
2. **切勿使用虚拟信用卡**：必须绑定国内各大银行发行的实体双币信用卡（Visa/Mastercard），拒绝虚拟货币美元卡。
3. **选定亚洲区域**：注册成功后，立刻在右上角将区域切换到 **亚太地区 (东京)** 等离国内近的节点建机，这样国内访问速度极快，且不容易被 GFW 墙。
4. **切勿频繁跨大洲建机**：不要在短时间内在美国建台机器，立刻删了又跑去日本建机器，极易被判定为脚本盗刷。
