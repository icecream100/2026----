# React 原型交付说明

## 项目目录

`output/2026-08-流量统计分析模块/06-prototype-react/`

## 本地命令

- `npm run dev -- --host 127.0.0.1`
- `npm run typecheck`
- `npm run build`
- `npm run e2e`

本工程使用 HashRouter，GitHub Pages 深链接格式为 `/#/dashboard`、`/#/heatmap` 等。Mock 数据仅用于原型交互，不包含真实接口、密钥或业务数据。

## 页面追溯

| PRD 页面 | 路由 | 关键承载 |
|---|---|---|
| P-001 分析配置 | `#/config` | 分组、设备关联、算法绑定、画线/区域、相机标定 |
| P-002 人流分析总览 | `#/dashboard` | 指标、趋势、排行、热力图缩略、告警 |
| P-003 热力图分析 | `#/heatmap` | 实时/历史、播放、透明度、聚集检测、PNG 导出 |
| P-004 流量统计分析 | `#/stats` | 趋势、排行、停留、对比、导出 |
| P-005 建筑关联分析 | `#/correlation` | ReID 实验性关联、流向摘要、数据质量 |
| P-006 人流报表 | `#/reports` | 筛选、查看详情、PDF/Excel 导出反馈 |
| P-008 建筑人数监测 | `#/region-monitor` | 视频检测框、区域人数、设备状态 |
| P-009 告警规则 | `#/alerts/rules` | 新增、启停、删除、异常行为置灰 |
| P-010 告警列表 | `#/alerts/list` | 筛选、确认、处理、详情抽屉 |
| P-007 监控中心大屏 | `#/screen` | 总览投屏模式、热力图、排行、趋势、告警滚动 |

## Pages workflow

已复制 `.github/workflows/deploy-pages.yml`。发布前需要在仓库 Pages 设置中选择 GitHub Actions；workflow 会将 `VITE_BASE_PATH` 设为当前仓库名。

## 待确认事项

- 热力图底图和实时视频在本原型中使用结构化占位视觉，接入真实资源时替换 Mock 数据与画面组件。
- 历史逐人轨迹是否持久化、ReID 真实园区验收报告、闭园时刻仍以 PRD 待确认事项为准。
