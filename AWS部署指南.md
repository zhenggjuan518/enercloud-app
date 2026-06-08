# EnerCloud H5 大屏项目 - 开发、部署与自动化发布指南

本文档全面记录了本项目从 AI 辅助开发、云端资源配置、环境搭建，一直到构建 CI/CD 全自动发布流水线的完整流程。可作为后续项目交接和排障的权威参考手册。

---

## 1. 辅助开发：如何使用 Stitch MCP

**Stitch MCP (Model Context Protocol)** 是一套标准协议，允许 AI 代理无缝接入专业的 UI/UX 设计系统。

### 1.1 连接机制
系统通过读取本地目录中的 MCP 配置，已经**全自动**为 AI（如我）和本地运行的 Stitch 服务建立了通信。开发者不需要编写任何接口代码，也不需要配置网络抓包或代理。

### 1.2 实际应用场景
在开发时，您只需输入自然语言指令，例如：
- *"帮我生成一个深色主题的控制台仪表盘"*
- *"根据设计系统的规范，生成各种状态的按钮变体"*

AI 会在后台自动调用 `generate_screen_from_text`、`apply_design_system` 等 MCP 工具，直接在您的 React 项目中生成精美且符合规范的高保真组件源码。

---

## 2. 云端准备：配置 AWS EC2 服务器

为了让您的网页在公网可访问，我们需要在 AWS 上租用一台虚拟机（EC2）。

### 2.1 避开风控红线（非常重要）
新注册的 AWS 账号极其敏感，请务必遵守以下规则以防账号被封禁（Account Blocked）：
- **全程关闭 VPN**：使用国内家庭宽带或手机流量访问 AWS 控制台。
- **绑定实体信用卡**：仅使用国内银行发行的实体双币卡（Visa/MasterCard），绝不使用加密货币虚拟卡。
- **避免短时跨区**：不要在美国区建了机器马上删掉，又跑去日本区新建，这种行为会被判定为恶意脚本盗刷。

### 2.2 建机与网络配置步骤
1. 登录控制台后，在**右上角**将区域切换为离国内更近的 **亚太地区 (东京) ap-northeast-1**，这能保证极快的国内直连速度。
2. 点击“启动实例 (Launch Instance)”，系统选用 **Ubuntu**，机型选择免费的 **t3.micro**。
3. **创建密钥对**：输入名称（如 `enercloud-tokyo`），格式选 `.pem` 并下载保存。此文件为后续安全验证的唯一凭证，**严禁提交到 GitHub**。
4. **配置安全组 (防火墙)**：勾选以下入站规则：
   - 允许 **SSH 流量**（端口 22），源选 `0.0.0.0/0`
   - 允许 **HTTP 流量**（端口 80），源选 `0.0.0.0/0` **（如果不勾选这个，网页打不开）**

---

## 3. 连接服务器：两种方式对比

### 方式一：网页端直连 (EC2 Instance Connect) —— 🔥 强烈推荐
国内网络环境下，传统的 SSH 命令常常超时。这是最稳妥的零配置方案：
1. 选中“正在运行”的机器，点击右上角 **连接 (Connect)**。
2. 停留在 **EC2 Instance Connect** 标签，直接点击橙色的连接按钮。
3. 浏览器会自动打开一个黑色的 Linux 终端环境，开箱即用。

### 方式二：本地终端 SSH 连接（备用）
如果您网络环境极佳：
打开电脑终端（如 PowerShell），使用刚才下载的 `.pem` 文件连接：
```bash
ssh -i "C:\您的路径\enercloud-tokyo.pem" ubuntu@您的服务器IP
```

---

## 4. 手动部署前端项目 (首次环境搭建)

React/Vite 项目编译后是纯静态文件，需要借助 Nginx 作为 Web 服务器。

在黑色终端内，复制粘贴以下完整脚本并回车：

```bash
# 1. 更新系统并安装所需环境
sudo apt update
sudo apt install -y nginx curl git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 2. 从您的 Github 拉取代码并构建
cd ~
git clone https://github.com/zhenggjuan518/enercloud-app.git
cd enercloud-app
npm install
npm run build   # 编译出静态产物存放在 dist 目录

# 3. 将文件拷贝到 Nginx 服务目录
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/

# 4. 配置 Nginx 以支持 React 前端路由 (解决刷新页面变 404 的报错)
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
完成后，直接在浏览器访问服务器的**公有 IPv4 地址**即可看到网页。

---

## 5. 全自动部署流：配置 GitHub Actions (CI/CD)

为了免去每次更新代码都要手动去终端敲命令的繁琐，本项目已集成了基于 GitHub Actions 的全自动流水线。配置完成后，**只要本地执行 `git push origin main`，服务器就会在几十秒内自动完成更新发布**。

### 5.1 工作流文件解析
在项目源码的 `.github/workflows/deploy.yml` 中，我们定义了如下规则：
只要 `main` 分支发生推送，GitHub 就会在一台云端的虚拟容器里执行 SSH 登录，并向您的 EC2 服务器发送部署指令（即自动执行 `git pull` -> `npm install` -> `npm run build` -> 替换文件 -> 重启 Nginx）。

### 5.2 必须的手动配置（GitHub Secrets）
为了让 GitHub 的云端机器人有权限登录并修改您的服务器，您必须去 GitHub 网页端为其提供加密验证凭证（大门钥匙）。

1. 打开您的 GitHub 仓库网页，点击顶部的 **Settings (设置)**。
2. 左边栏找到 **Secrets and variables**，点击子菜单 **Actions**。
3. 点击绿色按钮 **New repository secret**，依次添加以下 3 个保密变量：

| Name (变量名) | Secret (对应的值) | 说明 |
| :--- | :--- | :--- |
| `EC2_HOST` | `您的公网IP地址` | 纯数字，例如：`13.112.45.67` |
| `EC2_USERNAME` | `ubuntu` | AWS EC2 Ubuntu 系统的默认管理员账号名 |
| `EC2_SSH_KEY` | `-----BEGIN RSA PR...` | 用记事本打开您下载的 `.pem` 文件，**将里面的文本内容连同第一行的 `-----BEGIN` 和最后一行的 `KEY-----` 全部复制**并粘贴进去 |

### 5.3 触发自动部署
配置完毕后，在本地编写完代码即可走正常提交流程：
```bash
git add .
git commit -m "feat: 更新首页样式"
git push origin main
```
推送上去后，点击 GitHub 网页顶部的 **Actions** 选项卡，您就能看到名为 `Deploy App` 的任务正在运行。当它变成绿色的对勾 ✅，您的外网大屏就已经同步刷新了！

---

## 6. 排障对照指南 (Troubleshooting)

| 症状 / 报错信息 | 根本原因 | 解决方案 |
| :--- | :--- | :--- |
| 本地终端运行 SSH 卡住或报 Timeout | 本地代理/VPN 拦截了 TCP 请求，或 AWS 安全组源 IP 限制过严。 | 改用上文 **第 3 节** 的网页版 **EC2 Instance Connect** 连接即可解决。 |
| AWS 控制台顶部飙红报错：`Account is currently blocked...` | 典型的触发风控。原因：挂着 VPN 注册、使用了虚拟信用卡、或短时间内频繁跨大洲建机。 | 方案 A：点进链接提交账单和身份材料申诉（耗时 1-2 天）。<br>方案 B：重新用真实无 VPN 的国内网络 + 真实双币卡注册新号，且只在亚洲建机。 |
| GitHub Actions 报 `account is locked due to a billing issue` | 您 GitHub 账户未绑定支付方式、超出免费配额或触发异常风控。 | 方案 A：去 GitHub 账户设置中心解决账单问题。<br>方案 B：暂时回归手动部署，在 EC2 终端执行 `cd ~/enercloud-app && git pull && npm run build && sudo cp -r dist/* /var/www/html/`。 |
| 网页访问返回 `404 Not Found` | React 单页应用的路由没有被 Nginx 正确接管，导致刷新子页面找不到文件。 | 重新执行 **第 4 节** 中的 Nginx `try_files` 路由配置脚本，并确保重启 Nginx。 |
