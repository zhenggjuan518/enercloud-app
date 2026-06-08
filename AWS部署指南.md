# EnerCloud H5 大屏项目 - AWS 部署与排坑完整指南

本文档总结了本项目在 AWS EC2 上从零部署的全过程，记录了遇到的典型网络与账号风控问题及其解决办法，可作为后续项目部署和排障的参考手册。

---

## 1. AWS 账号注册与防风控指南

新注册的 AWS 账号极易触发反欺诈冻结系统（Account Blocked），一旦触发需要提交繁琐的纸质账单申诉。为确保顺利注册和使用，请遵循以下核心原则：

> [!WARNING]
> **风控红线（绝对不要做）**
> - **切勿开 VPN**：注册和日常访问控制台时，绝不要使用 VPN 或代理。共享机房 IP 会被秒封。
> - **切勿使用虚拟卡**：绝不能绑定 Depay、OneKey 等加密货币虚拟美元卡，必须使用国内实体双币信用卡（Visa/Mastercard）。
> - **切勿频繁跨区**：新号不要在短时间内（如 10 分钟内）在美国区建了机器马上删掉，又跑去日本区建机器。

> [!TIP]
> **安全最佳实践**
> 1. 使用国内家庭宽带或手机热点直连 `aws.amazon.com` 注册。
> 2. 账单地址如实填写国内真实的居住地址（拼音）。
> 3. 注册完成后，**立刻在右上角将区域切换到亚洲（如“东京 ap-northeast-1”）**，然后安静地部署一台机器，平稳度过新手期。

---

## 2. EC2 服务器选型与网络配置

为了确保国内用户能够**不挂 VPN 极速直连访问**，服务器的物理位置和防火墙配置至关重要。

### 2.1 区域与配置
- **区域选择**：放弃默认的美国东部（`us-east-1`），强烈建议选择 **亚太地区 (东京)** 或 **亚太地区 (香港)**。
- **实例类型**：选择 Ubuntu 系统，配置选用符合免费套餐的 `t3.micro`（或 `t2.micro`）。
- **密钥对**：创建并下载 `.pem` 文件。注意：`.pem` 是本地 SSH 登录用的钥匙，**绝对不能提交到 GitHub 代码库中**。

### 2.2 防火墙（安全组）设置
建机器时，在网络设置模块必须勾选以下两项入站规则：
- **允许 SSH 流量 (端口 22)**：来源选 `0.0.0.0/0`（Anywhere）。
- **允许 HTTP 流量 (端口 80)**：来源选 `0.0.0.0/0`（Anywhere）。如果漏选此项，网页将无法访问。

---

## 3. 极速部署流程 (绕过本地 SSH)

由于本地开启 VPN 或代理常导致终端 SSH 命令超时（`Connection timed out`），我们推荐直接使用 AWS 官方的浏览器终端。

### 3.1 首次一键部署
1. 在 AWS 实例列表中，选中刚开的东京服务器。
2. 点击右上角 **连接 (Connect)** -> 选择 **EC2 Instance Connect**。
3. 在浏览器弹出的黑色终端中，一次性粘贴并执行以下脚本：

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
npm run build

# 3. 将构建好的文件拷贝到 Nginx 目录下
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/

# 4. 配置 Nginx 以支持 React 单页应用 (解决刷新 404 问题)
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

# 5. 重启 Nginx 使其生效
sudo systemctl restart nginx
```
部署完成后，直接在浏览器中访问这台 EC2 的 **公有 IPv4 地址** 即可查看大屏。

### 3.2 日常版本更新（手动拉取）
当您在本地修改了代码并 `git push` 到 GitHub 后，只需回到 EC2 Instance Connect 的黑框框中，执行这 4 行简短命令即可完成热更新：

```bash
cd ~/enercloud-app
git pull
npm run build
sudo cp -r dist/* /var/www/html/
```

---

## 4. 历史排坑记录 (Troubleshooting)

| 症状 / 报错信息 | 根本原因 | 解决方案 |
| :--- | :--- | :--- |
| 本地终端运行 `ssh -i xxx.pem` 一直卡住报 Timeout | 本地代理/VPN 拦截了 SSH 的原生 TCP 请求，或 AWS 安全组源 IP 限制过严。 | 1. 安全组入站规则 SSH 改为 `0.0.0.0/0`。<br>2. 放弃本地 SSH，改用网页版 **EC2 Instance Connect**。 |
| 关闭 VPN 后，访问美国区 IP 打不开网页 | 该美国 IP 段已被国内网络防火墙（GFW）阻断/封锁。 | 彻底放弃美国区，在 AWS 控制台将区域切换到 **东京 (Tokyo)** 重新建机部署。 |
| AWS 控制台顶部飙红报错：`Account is currently blocked...` | 典型的触发风控。原因可能是：挂着 VPN 注册、绑定了虚拟信用卡、短时间内跨大洲频繁创建并删除实例。 | 方案 A：点进链接提交账单材料申诉（耗时 1-2 天）。<br>方案 B：重新用真实无 VPN 国内网络 + 真实双币卡注册新号。 |
| GitHub Actions 报错：`account is locked due to a billing issue` | 您的 GitHub 账号存在账单异常、欠费或超出了免费自动化流水线的额度限制。 | 方案 A：去 GitHub 设置中心解决账单问题。<br>方案 B：暂停自动化部署，改用 **3.2 节** 的 4 行代码手动部署法。 |
