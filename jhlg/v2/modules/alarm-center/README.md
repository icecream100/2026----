# 告警中心新增功能 - 产品原型

本目录包含根据 [PRD-告警中心新增功能-v1.0.md](/Users/wangjingang/Library/Mobile%20Documents/iCloud~md~obsidian/Documents/alex/claudecode/pmtools/prd/告警中心新增功能/PRD-告警中心新增功能-v1.0.md) 修订后的 B 端 PC 原型。

本次原型已按最新 PRD 调整信息架构：

- `事件监听`不再作为独立配置页，而是在`仪表盘`中以概览指标展示
- `告警工作流程配置`、`告警处置`改为左侧导航`告警配置`下的三级页面
- `告警记录`恢复为只读查询页，不再承担处置主入口

## 页面清单与 PRD 映射

| 原型页面 | 文件路径 | 对应 PRD 章节 | 页面说明 |
|---|---|---|---|
| 仪表盘原型 | `index.html` | 6.1 | 展示告警统计、事件监听概览指标、监听异常波动和处置闭环概况。 |
| 告警配置原型 | `pages/alarm_config.html` | 5.1、7.1 | 保留原有告警规则配置页，展示告警规则与工作流的关联关系。 |
| 告警工作流程配置原型 | `pages/workflow_config.html` | 6.2 | 展示按“告警类型 + 告警级别”绑定的工作流配置、启停和编辑逻辑。 |
| 告警处置原型 | `pages/alarm_disposal.html` | 6.3 | 展示处置单生成、分派、接单、转派、处理、关闭和第三方回写流程。 |
| 告警记录原型 | `pages/alarm_records.html` | 7.2 | 展示原始告警记录查询与关联工单查看，不承载处置动作。 |

## 已落实的关键约束

- 仪表盘事件监听仅展示概览，不提供明细弹窗、列表跳转和启停操作
- 工作流按“告警类型 + 告警级别”统一绑定
- 未匹配工作流的告警仍自动生成处置单，并进入`待分派`
- 第三方回写以内部工单号 `ticket_no` 作为唯一匹配键
- 本期默认一条告警生成一条处置单，不建设告警合并策略
- 第三方回写失败仅展示失败状态与失败原因，不提供人工重试入口

## 交互说明

- `index.html`
  - 查看事件监听概览指标
  - 跳转到工作流配置、告警处置、告警记录

- `pages/alarm_config.html`
  - 支持规则筛选
  - 支持启用/禁用模拟
  - 支持查看关联工作流

- `pages/workflow_config.html`
  - 支持新增、编辑、启停、删除工作流
  - 内置同一“告警类型 + 告警级别”只允许一条启用工作流的校验

- `pages/alarm_disposal.html`
  - 支持待分派、待接单、处理中、待回写、已完成等状态展示
  - 支持分派、转派、接单、提交处理结果、关闭、模拟第三方回写

- `pages/alarm_records.html`
  - 支持原始告警记录筛选和详情查看
  - 支持跳转到处置页查看关联工单

## 技术实现

- 纯 HTML5
- TailwindCSS CDN
- Font Awesome 图标
- 页面内嵌 JavaScript 实现轻量交互

## 使用方式

直接在浏览器中打开 `index.html` 即可浏览原型，页面间已通过链接联通。

后续可执行：

```bash
/test-prototype "/Users/wangjingang/Library/Mobile Documents/iCloud~md~obsidian/Documents/alex/claudecode/pmtools/prototype/告警中心新增功能" "/Users/wangjingang/Library/Mobile Documents/iCloud~md~obsidian/Documents/alex/claudecode/pmtools/prd/告警中心新增功能/PRD-告警中心新增功能-v1.0.md"
```
