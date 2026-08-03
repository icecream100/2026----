# 原型验证报告

## 验证范围

- 页面清单 10 个页面均已配置 HashRouter 路由和侧栏入口。
- 总览、热力图、配置抽屉、告警确认列入 Playwright 冒烟路径。
- 采用 Ant Design Table、Tabs、Modal、Drawer、DatePicker、Select、Slider、Switch 等组件。

## 结果

- `npm run typecheck`：通过。
- `npm run build`：通过，产物输出到 `dist/`；存在 Ant Design 单包体积提示，不影响构建。
- `npm run e2e`：未完成，当前机器缺少 Playwright Chromium 可执行文件；未自动安装浏览器依赖。
- in-app Browser 本地验证：通过总览首屏、热力图切换历史日期/播放、配置抽屉保存、告警确认和 390px 窄屏无横向溢出检查。

## 风险与边界

本原型只使用 Mock 数据和 CSS/SVG 结构化示意图，不连接真实视频、算法中心、告警服务或报表导出服务。实验性建筑关联数据已在页面、导航和表格中明确标注，不进入告警和大屏指标。
