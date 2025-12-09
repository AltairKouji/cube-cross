# 部署指南

## 部署到 GitHub Pages

本项目已配置好GitHub Pages部署。

### 第一次部署

1. 确保你已经推送了所有代码到GitHub
2. 运行部署命令：

```bash
npm run deploy
```

这个命令会：
- 自动构建生产版本
- 创建/更新 `gh-pages` 分支
- 将构建文件推送到 `gh-pages` 分支

### 访问你的应用

部署完成后，你可以在以下地址访问应用：

```
https://altairkouji.github.io/cube-cross
```

### GitHub Pages 设置

1. 访问你的仓库：https://github.com/AltairKouji/cube-cross
2. 点击 **Settings** > **Pages**
3. 确认 **Source** 设置为 `gh-pages` 分支
4. 如果没有自动设置，手动选择 `gh-pages` 分支并保存

### 更新部署

每次更新代码后，只需再次运行：

```bash
npm run deploy
```

### 本地开发

```bash
npm start        # 启动开发服务器
npm run build    # 构建生产版本
npm test         # 运行测试
```

## 功能说明

### 1. 交互式3D魔方
- 使用鼠标拖动旋转魔方（桌面）
- 使用手指拖动旋转魔方（移动设备）
- 360度自由观察魔方状态

### 2. 解法验证系统
- 输入你的Cross解法
- 自动验证是否正确
- 与最优解比较
- 获得详细的分析和建议

### 3. 手动操作
- 12个基本移动按钮
- 打乱魔方功能
- 撤销功能
- 移动历史记录

## 疑难解答

### 部署失败

如果部署失败，检查：
1. 是否已安装所有依赖：`npm install`
2. 是否有构建错误：`npm run build`
3. 是否有权限推送到GitHub

### 404错误

如果访问页面出现404：
1. 等待几分钟，GitHub Pages需要时间构建
2. 检查GitHub仓库的Pages设置
3. 确认`package.json`中的`homepage`字段正确

### 样式或功能异常

1. 清除浏览器缓存
2. 检查控制台是否有错误
3. 确认使用了最新的代码：`git pull`
