# 金华理工物联网平台 UI 设计规范 v1.0

> 本文档定义物联网平台产品原型的统一UI规范，基于参考设计稿和现有实现提炼。所有HTML原型需严格遵循本规范。

---

## 1. 设计理念

| 维度               | 规范                                                   |
| :----------------- | :----------------------------------------------------- |
| **主题风格** | 企业级蓝白主题（Blue Sidebar + White Content）         |
| **设计语言** | 简洁、专业、高效                                       |
| **框架依赖** | 原生HTML+CSS（参考Ant Design设计语言，不强制引入JS库） |
| **响应式**   | 固定侧边栏宽度，主内容区自适应                         |

---

## 2. 色彩体系

### 2.1 主色板

```css
:root {
    /* 主色 Primary */
    --primary: #2563eb;           /* Blue 600 - 主按钮、选中态 */
    --primary-hover: #1d4ed8;     /* Blue 700 - 悬停态 */
  
    /* 侧边栏色 Sidebar */
    --sidebar-bg: #0f172a;        /* Slate 900 - 侧边栏背景 */
    --sidebar-text: #e2e8f0;      /* Slate 200 - 侧边栏文字 */
    --sidebar-text-muted: #94a3b8;/* Slate 400 - 侧边栏次要文字 */
    --sidebar-active-bg: #2563eb; /* Blue 600 - 选中菜单项 */
  
    /* 内容区色 Content */
    --bg-body: #f1f5f9;           /* Slate 100 - 页面背景 */
    --bg-card: #ffffff;           /* White - 卡片/面板背景 */
    --border-color: #e2e8f0;      /* Slate 200 - 边框色 */
  
    /* 文字色 Text */
    --text-main: #1e293b;         /* Slate 800 - 主文字 */
    --text-secondary: #475569;    /* Slate 600 - 次要文字 */
    --text-muted: #94a3b8;        /* Slate 400 - 占位符/禁用态 */
  
    /* 功能色 Semantic */
    --success: #10b981;           /* 成功/在线 */
    --warning: #f59e0b;           /* 警告/待处理 */
    --danger: #ef4444;            /* 错误/离线 */
  
    /* 来源标识色 Source Dots */
    --source-platform: #f59e0b;   /* Yellow - 下级平台 */
    --source-manual: #10b981;     /* Green - 手动创建 */
    --source-iot: #8b5cf6;        /* Purple - 物联网设备 */
}
```

### 2.2 状态标签色

| 状态                  | 背景色      | 文字色      | 使用场景           |
| :-------------------- | :---------- | :---------- | :----------------- |
| **成功/在线**   | `#dcfce7` | `#15803d` | 设备在线、任务完成 |
| **警告/待处理** | `#fef3c7` | `#b45309` | 待派单、待审批     |
| **错误/离线**   | `#fee2e2` | `#b91c1c` | 设备离线、审批驳回 |
| **中性**        | `#f1f5f9` | `#64748b` | 未启用、草稿       |

---

## 3. 布局规范

### 3.1 整体布局

```
┌─────────────────────────────────────────────────────────────────────┐
│  Sidebar (240px)  │                 Main Content                    │
│                   │  ┌─────────────────────────────────────────┐   │
│  - Brand Logo     │  │  Top Bar (64px) - 页面标题 + 用户头像   │   │
│  - Nav Menu       │  ├─────────────────────────────────────────┤   │
│                   │  │                                         │   │
│                   │  │  Content Area (自适应)                   │   │
│                   │  │  - Filter Bar                           │   │
│                   │  │  - Data Table / Form / Cards            │   │
│                   │  │                                         │   │
│                   │  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 尺寸规范

| 元素                   | 尺寸        | 说明                   |
| :--------------------- | :---------- | :--------------------- |
| **侧边栏宽度**   | 240px       | 固定宽度               |
| **顶部栏高度**   | 64px        | 包含页面标题和用户信息 |
| **内容区内边距** | 24px 32px   | 上下24px，左右32px     |
| **栅格间距**     | 16px / 24px | 组件间距               |
| **树形面板宽度** | 280px       | 左侧目录树             |

### 3.3 圆角规范

```css
--radius-sm: 4px;   /* 小组件：标签、徽章 */
--radius-md: 6px;   /* 中等组件：按钮、输入框 */
--radius-lg: 8px;   /* 大组件：卡片、弹窗 */
```

---

## 4. 组件规范

### 4.1 按钮 Button

**主按钮（Primary）**

```html
<button class="btn btn-primary">查询</button>
```

- 背景色：`--primary`
- 文字色：白色
- 高度：36px（padding: 8px 16px）
- 使用场景：主要操作（查询、保存、确定）

**次要按钮（Secondary）**

```html
<button class="btn btn-secondary">重置</button>
```

- 背景色：白色
- 边框：`--border-color`
- 文字色：`--text-secondary`
- 使用场景：次要操作（重置、取消、导出）

**危险按钮（Danger）**

```html
<button class="btn btn-danger">删除</button>
```

- 背景色：`--danger`
- 文字色：白色
- 使用场景：删除、停用等破坏性操作

### 4.2 输入框 Input

```html
<div class="input-group">
    <label class="input-label">设备名称</label>
    <input type="text" class="glass-input" placeholder="请输入设备名称">
</div>
```

| 属性       | 值                           |
| :--------- | :--------------------------- |
| 高度       | 38px                         |
| 边框       | 1px solid `--border-color` |
| 圆角       | 6px                          |
| 内边距     | 8px 12px                     |
| 聚焦态边框 | `--primary` + 2px外发光    |

### 4.3 下拉选择 Select

```html
<select class="glass-input">
    <option value="">请选择</option>
    <option value="1">选项一</option>
</select>
```

样式与输入框保持一致。

### 4.4 数据表格 Table

```html
<div class="glass-panel">
    <table class="data-table">
        <thead>
            <tr>
                <th>列标题</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>数据内容</td>
            </tr>
        </tbody>
    </table>
</div>
```

| 元素         | 样式                           |
| :----------- | :----------------------------- |
| 表头背景     | `#f8fafc`                    |
| 表头文字     | 12px 大写 `--text-secondary` |
| 单元格内边距 | 16px                           |
| 行悬停背景   | `#f8fafc`                    |
| 行边框       | 1px solid `--border-color`   |

### 4.5 状态标签 Tag

```html
<span class="status-tag status-success">在线</span>
<span class="status-tag status-warning">待审批</span>
<span class="status-tag status-danger">离线</span>
```

### 4.6 树形面板 Tree Panel

```html
<div class="tree-panel">
    <div class="tree-search-box">
        <input type="text" class="glass-input" placeholder="搜索...">
        <span class="tree-search-icon">🔍</span>
    </div>
    <div class="tree-content">
        <div class="tree-node active">📂 根组织 (100/100)</div>
        <div class="tree-node">📂 子组织 (50/50)</div>
    </div>
</div>
```

### 4.7 弹窗 Modal

```html
<div class="modal-overlay" id="myModal">
    <div class="modal-content" style="width: 600px;">
        <div class="modal-header">
            <h3 class="modal-title">弹窗标题</h3>
            <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <div class="modal-body">
            <!-- 内容区 -->
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">取消</button>
            <button class="btn btn-primary" onclick="submit()">确定</button>
        </div>
    </div>
</div>
```

```

### 4.8 穿梭框关联面板 Transfer Panel

用于批量关联场景（如标签关联设备）。

```html
<div class="modal-body" style="display: flex; gap: 16px;">
    <!-- 左侧：资源树 -->
    <div style="width: 240px; border-right: 1px solid var(--border-color);">
        <!-- 树组件 -->
    </div>
  
    <!-- 右侧：选择列表 -->
    <div style="flex: 1; display: flex; flex-direction: column;">
        <!-- Tab切换: 待选 / 已选 -->
        <div class="tab-group">...</div>
        <!-- 列表内容 -->
    </div>
</div>
```

### 4.9 代理配置弹窗 Proxy Config Modal

用于批量/单独配置代理流地址。支持自动生成和手动输入两种模式。

```html
<div class="modal-overlay" id="batchConfigModal">
    <div class="modal-content" style="width: 600px;">
        <div class="modal-header">
            <h3 class="modal-title" id="modalTitle">批量配置代理</h3>
            <button class="icon-btn" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
            <!-- 模式切换（仅单独编辑时显示） -->
            <div class="form-group" id="modeToggleGroup" style="display: none;">
                <label class="form-label">配置模式</label>
                <div style="display: flex; gap: 16px;">
                    <label><input type="radio" name="configMode" value="auto" checked> 自动生成</label>
                    <label><input type="radio" name="configMode" value="manual"> 手动输入</label>
                </div>
            </div>
            
            <!-- 自动生成字段 -->
            <div id="autoGenerateFields">
                <!-- 服务地址、端口、应用名称、流ID规则 -->
                <!-- 主协议（单选 radio） -->
                <div class="form-group">
                    <label class="form-label required">主协议 (Protocol)</label>
                    <div style="display: flex; gap: 16px;">
                        <label><input type="radio" name="protocol" value="http-flv" checked> HTTP-FLV</label>
                        <label><input type="radio" name="protocol" value="hls"> HLS</label>
                        <label><input type="radio" name="protocol" value="rtmp"> RTMP</label>
                        <label><input type="radio" name="protocol" value="rtsp"> RTSP</label>
                    </div>
                </div>
                <!-- 预览区：显示所有协议URL，选中的高亮 -->
                <div class="preview-box" id="previewContent">...</div>
            </div>
            
            <!-- 手动输入字段（默认隐藏） -->
            <div id="manualInputFields" style="display: none;">
                <div class="form-group">
                    <label class="form-label required">代理流地址</label>
                    <input type="text" class="form-control" placeholder="http://...">
                </div>
            </div>
        </div>
        <div class="modal-footer">...</div>
    </div>
</div>
```

**关键交互**：
- 批量配置：不显示模式切换，仅自动生成模式
- 单独编辑：显示模式切换，支持自动生成/手动输入
- 预览区：显示所有4种协议URL，选中的主协议高亮并标注"✓ 主协议"

---

## 5. 页面模板

### 5.1 列表页模板（带左侧树）

适用于：设备管理、标签管理、通道管理等

```html
<div class="layout-grid">
    <!-- 左侧树形面板 -->
    <div class="tree-panel">
        <div class="tree-search-box">...</div>
        <div class="tree-content">...</div>
    </div>
  
    <!-- 右侧内容面板 -->
    <div class="content-panel">
        <!-- 筛选条件栏 -->
        <div class="filter-bar">
            <div style="flex: 1; max-width: 200px;">
                <label class="input-label">名称</label>
                <input type="text" class="glass-input">
            </div>
            <!-- 更多筛选项 -->
            <div style="display: flex; align-items: flex-end; gap: 8px;">
                <button class="btn btn-primary">查询</button>
                <button class="btn btn-secondary">重置</button>
            </div>
        </div>
      
        <!-- 数据表格 -->
        <div class="glass-panel">
            <table class="data-table">...</table>
        </div>
    </div>
</div>
```

### 5.2 列表页模板（无左侧树）

适用于：治理任务、权限审批、应用管理等

```html
<div class="content-area">
    <!-- 筛选条件栏 -->
    <div class="filter-bar">...</div>
  
    <!-- 工具栏 -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
        <div>
            <button class="btn btn-primary">+ 新增</button>
        </div>
        <div>
            <button class="btn btn-secondary">导出</button>
        </div>
    </div>
  
    <!-- 数据表格 -->
    <div class="glass-panel">
        <table class="data-table">...</table>
    </div>
</div>
```

### 5.3 表单弹窗模板

```html
<div class="modal-body">
    <div class="form-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px 24px;">
        <div class="input-group">
            <label class="input-label"><span style="color:red">*</span> 字段名称</label>
            <input type="text" class="glass-input" placeholder="请输入">
        </div>
        <div class="input-group">
            <label class="input-label">选择字段</label>
            <select class="glass-input">
                <option value="">请选择</option>
            </select>
        </div>
        <!-- 跨列字段 -->
        <div class="input-group" style="grid-column: span 2;">
            <label class="input-label">描述</label>
            <textarea class="glass-input" rows="3" placeholder="请输入描述"></textarea>
        </div>
    </div>
</div>
```

---

## 6. 交互规范

### 6.1 Toast 提示

```javascript
function showToast(message, type = 'info') {
    // type: 'info' | 'success' | 'warning' | 'error'
    // 实现见 script.js
}
```

使用场景：

- 保存成功：`showToast('保存成功', 'success')`
- 删除成功：`showToast('删除成功', 'success')`
- 操作失败：`showToast('操作失败，请重试', 'error')`

### 6.2 确认弹窗

```javascript
function showConfirm(message, onConfirm) {
    // 实现见 script.js
}
```

使用场景：删除操作、批量操作、重置操作等

### 6.3 表单校验

```javascript
// 必填校验
if (!value) {
    showToast('请输入xxx', 'warning');
    return false;
}

// 格式校验
if (!/^\d{20}$/.test(code)) {
    showToast('编码必须为20位数字', 'warning');
    return false;
}
```

---

## 7. 图标规范

使用 Emoji 作为图标（轻量无依赖）：

| 图标   | Emoji | 使用场景      |
| :----- | :---: | :------------ |
| 文件夹 |  📂  | 目录节点      |
| 文件   |  📁  | 子目录节点    |
| 设备   |  📹  | 视频设备      |
| 相机   |  📷  | 抓拍设备      |
| 搜索   |  🔍  | 搜索按钮      |
| 导出   |  📥  | 导出按钮      |
| 刷新   |  🔄  | 刷新/重置按钮 |
| 编辑   | ✏️ | 编辑按钮      |
| 删除   | 🗑️ | 删除按钮      |
| 标签   | 🏷️ | 标签管理      |
| 地图   | 🗺️ | 地图相关      |
| 设置   | ⚙️ | 配置/设置     |
| 定位   |  📍  | 位置定位      |

---

## 8. 文件结构规范

```
V1/原型/
├── index.html              # 原型导航首页（GitHub入口）
├── styles.css              # 全局样式（所有页面共用）
├── script.js               # 全局脚本（Toast、Modal等通用功能）
├── UI_SPECIFICATION.md     # UI设计规范文档
│
├── 101_基础设备目录管理.html
├── 101_标签管理.html
├── 101_地图管理.html
├── 101_地图广场.html
│
├── 102_治理任务.html
├── 102_治理参数设置.html
│
├── 103_平台设备管理.html
├── 103_平台通道管理.html
├── 103_设备分组管理.html
│
├── 104_直接共享.html
├── 104_代理共享.html
│
├── 105_需求登记.html
├── 105_需求审批.html
└── 105_授权管理.html
```

---

## 9. 命名规范

### 9.1 文件命名

- 格式：`{序号}_{功能模块}.html`
- 示例：`05_governance_tasks.html`、`11_permission_request.html`

### 9.2 CSS类命名

- 布局类：`layout-grid`、`tree-panel`、`content-panel`
- 组件类：`btn`、`glass-input`、`data-table`、`status-tag`
- 状态类：`active`、`disabled`、`is-editing`

### 9.3 ID命名

- 弹窗：`{功能}Modal`，如 `detailModal`、`addTaskModal`
- 表单：`{功能}Form`，如 `taskForm`、`deviceForm`

---

## 10. 附录

### 10.1 字体规范

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### 10.2 阴影规范

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

### 10.3 动画规范

```css
transition: 0.2s ease-in-out;  /* 默认过渡时长 */
```

---

**文档版本**

| 版本 |    日期    | 作者 | 变更说明 |
| :--: | :--------: | :--: | :------- |
| v1.0 | 2026-02-05 | 系统 | 初始版本 |
| v1.1 | 2026-02-09 | 系统 | 新增代理配置弹窗组件、索引页入口、更新文件结构 |
