# N9 `html-antd` 独立技术验证原型

本目录用于验证 PM Workflow V5 的正式原型方案：

- HTML
- Ant Design 6.4.3 官方静态 CSS（本地固定版本）
- 原生 JavaScript
- 少量产品专用 CSS，用于页面骨架、轨迹地图和业务示意图

本验证原型不会替换 `../n9-target-analysis/` 中的既有 N9 原型，也不代表 N9 产品范围发生变化。

## 打开方式

在项目根目录执行：

```bash
python3 -m http.server 8766 --bind 127.0.0.1 --directory output/2026-08-N9-目标研判预警组件/05-prototype
```

浏览器访问：

```text
http://127.0.0.1:8766/html-antd-test/
```

不需要安装依赖，不需要构建，不访问 CDN。

## 验证范围

原型覆盖一条可操作的 N9 核心链路：

1. 上传演示人像或从 N11 目标库选择目标。
2. 选择检索时间、地点和相似度阈值。
3. 校验未开启轨迹分析、部分覆盖等边界状态。
4. 查看并确认候选目标。
5. 查看轨迹地图、时间轴和抓拍详情。
6. 模拟轨迹回放、录像不可用降级和报告生成。

## 文件说明

- `index.html`：单页多状态原型。
- `assets/antd-6.4.3.css`：固定版本的 Ant Design 官方静态 CSS。
- `assets/ant-prototype.css`：V5 原型公共适配层。
- `assets/ant-prototype.js`：V5 公共交互辅助脚本。
- `assets/n9-test.css`：N9 页面专用布局和业务视觉。
- `assets/n9-test.js`：N9 原生 JavaScript 交互。
- `assets/asset-manifest.json`：资产版本与校验信息。
- `assets/ANT-DESIGN-LICENSE.txt`：Ant Design 许可证。

## 当前边界

- 文件上传、检索、录像和报告下载均为前端模拟，不调用真实接口。
- 本次未实现车辆轨迹、多目标对比、分析接入管理和未授权访问页。
- 本次只验证一条核心用户任务，不验证原 17 页的跨页状态管理。

