/* ============================================================
 * 站内信模块 - 右上角消息入口弹窗（共享组件）
 * 统一能力：
 *   1. 右上角铃铛 → 最近消息面板（默认 5 条 + 底部"查看更多"）【CR-20260820-001】
 *   2. 弹窗点击分流：有跳转目标 → 直达来源处理页（点击即已读）；纯公告 → 详情页【CR-20260821-001】
 *   3. 已读模型：打开详情/去处理自动已读 + 全部已读，无单条"标为已读"【CR-20260821-002】
 * 用法：
 *   MSG_PANEL.setData(messages);              // 注册消息数组（引用同一数组对象，页面共享已读状态）
 *   MSG_PANEL.init({ onChange: fn });         // 初始化；onChange=弹窗内数据变化后回调页面（刷新列表/侧栏角标）
 *   页面自身已读操作（markAutoRead/goProcess/markAllRead）后调用 MSG_PANEL.refresh() 同步弹窗
 * ============================================================ */
window.MSG_PANEL = (function () {
  var PANEL_LIMIT = 5;
  var CATEGORY_TAG = { '告警': 'ant-tag-red', '任务': 'ant-tag-blue', '系统公告': 'ant-tag-purple', '运维': 'ant-tag-orange' };
  var MSG = [];          // 共享消息数组（页面 setData 注册）
  var onChangeFn = null; // 弹窗数据变化后的页面回调
  var els = {};

  /* ---------- 弹窗样式注入（弹窗专属，不入 proto-ui.css） ---------- */
  (function injectStyle() {
    var style = document.createElement('style');
    style.textContent = [
      '.msg-entry-wrap { position: relative; margin-left: 12px; }',
      '.msg-panel { position:absolute; top:44px; right:0; width:380px; max-width:calc(100vw - 24px); background:#fff; border-radius:8px;',
      '  box-shadow:0 6px 16px rgba(0,0,0,0.12); border:1px solid var(--ant-border-secondary); z-index:100; overflow:hidden; }',
      '.msg-panel-head { display:flex; align-items:center; gap:8px; padding:12px 16px; border-bottom:1px solid var(--ant-border-secondary); }',
      '.msg-panel-title { font-size:15px; font-weight:600; color:var(--ant-text); }',
      '.msg-panel-sub { font-size:12px; color:var(--ant-text-tertiary); }',
      '.msg-panel-head .ant-btn { margin-left:auto; }',
      '.msg-panel-list { max-height:420px; overflow-y:auto; }',
      '.panel-msg { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:12px 16px; border-bottom:1px solid var(--ant-border-secondary); transition:background 0.15s; }',
      '.panel-msg:hover { background:#fafafa; }',
      '.panel-msg-unread { background:#f5faff; }',
      '.panel-msg-strong { background:#fff7e6; }',
      '.panel-msg-main { flex:1; min-width:0; text-decoration:none; color:inherit; }',
      '.panel-msg-head { display:flex; align-items:center; gap:6px; }',
      '.msg-dot { width:8px; height:8px; border-radius:50%; background:var(--ant-error); flex-shrink:0; }',
      '.msg-dot-read { background:transparent; }',
      '.panel-msg-title { font-size:13px; color:var(--ant-text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }',
      '.panel-msg-unread .panel-msg-title { font-weight:600; }',
      '.msg-jump-arrow { margin-left:4px; font-size:11px; color:var(--ant-primary); flex-shrink:0; }',
      '.panel-msg-summary { margin-top:4px; padding-left:14px; font-size:12px; color:var(--ant-text-tertiary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }',
      '.panel-msg-side { display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0; }',
      '.panel-msg-time { font-size:11px; color:var(--ant-text-tertiary); }',
      '.msg-panel-more { display:flex; align-items:center; justify-content:center; gap:4px; padding:11px 16px; font-size:13px; color:var(--ant-primary); text-decoration:none; border-top:1px solid var(--ant-border-secondary); }',
      '.msg-panel-more:hover { background:var(--ant-primary-bg); }'
    ].join('\n');
    document.head.appendChild(style);
  })();

  /* ---------- 工具 ---------- */
  function unreadCount() { return MSG.filter(function (m) { return m.unread; }).length; }

  /* 轻提示（独立实现，不依赖页面 showToast） */
  function toast(msg) {
    var wrap = document.querySelector('.toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      wrap.setAttribute('role', 'status');
      wrap.setAttribute('aria-live', 'polite');
      document.body.appendChild(wrap);
    }
    var el = document.createElement('div');
    el.className = 'toast-msg';
    el.innerHTML = '<i class="fa-solid fa-circle-info" style="color:#1677ff;"></i>' + msg;
    wrap.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('show'); });
    setTimeout(function () { el.classList.remove('show'); setTimeout(function () { el.remove(); }, 300); }, 2000);
  }

  /* ---------- 弹窗 DOM 注入（header spacer 之后） ---------- */
  function buildDom() {
    var header = document.querySelector('.header');
    if (!header) return;
    var spacer = header.querySelector('.spacer');
    var wrap = document.createElement('div');
    wrap.className = 'msg-entry-wrap';
    wrap.innerHTML =
      '<button type="button" class="nav-action" id="msgEntry" aria-haspopup="true" aria-expanded="false" style="background:none;border:none;display:flex;align-items:center;gap:6px;cursor:pointer;">' +
        '<span style="position:relative;display:inline-flex;">' +
          '<i class="fa-regular fa-bell" style="font-size:18px;"></i>' +
          '<span class="badge-count" id="headerBadge" style="position:absolute;top:-6px;right:-10px;"></span>' +
        '</span>' +
        '<span class="hidden sm:inline">消息</span>' +
      '</button>' +
      '<div id="msgPanel" class="msg-panel hidden" role="dialog" aria-label="最近消息列表">' +
        '<div class="msg-panel-head">' +
          '<span class="msg-panel-title">消息通知</span>' +
          '<span class="msg-panel-sub" id="panelUnread"></span>' +
          '<button type="button" class="ant-btn ant-btn-text ant-btn-sm" id="panelMarkAllRead"><i class="fa-solid fa-check-double"></i> 全部已读</button>' +
        '</div>' +
        '<div id="panelList" class="msg-panel-list"></div>' +
        '<div id="panelEmpty" class="empty-state hidden" style="padding:24px 0;">' +
          '<div class="empty-state-icon"><i class="fa-regular fa-envelope-open"></i></div>' +
          '<div class="empty-state-title">暂无消息</div>' +
        '</div>' +
        '<a href="message-center.html" class="msg-panel-more" id="panelMore">查看全部消息 <span id="panelTotal">0</span> 条 <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i></a>' +
      '</div>';

    if (spacer && spacer.nextSibling) {
      spacer.parentNode.insertBefore(wrap, spacer.nextSibling);
    } else if (spacer) {
      spacer.parentNode.appendChild(wrap);
    } else {
      header.appendChild(wrap);
    }

    els.entry = wrap.querySelector('#msgEntry');
    els.panel = wrap.querySelector('#msgPanel');
    els.badge = wrap.querySelector('#headerBadge');
    els.panelUnread = wrap.querySelector('#panelUnread');
    els.panelList = wrap.querySelector('#panelList');
    els.panelEmpty = wrap.querySelector('#panelEmpty');
    els.panelMore = wrap.querySelector('#panelMore');
    els.panelTotal = wrap.querySelector('#panelTotal');
    els.markAllBtn = wrap.querySelector('#panelMarkAllRead');

    els.entry.addEventListener('click', function (e) { e.stopPropagation(); togglePanel(); });
    els.markAllBtn.addEventListener('click', function (e) { e.stopPropagation(); markAllRead(); });
    // 点击弹层外关闭
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) closePanel();
    });
    // Esc 关闭
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePanel();
    });
  }

  /* ---------- 弹层渲染（最近 5 条：未读优先 + 时间倒序；已读常驻保留） ---------- */
  function renderPanel() {
    if (!els.panelList) return;
    var sorted = MSG.slice().sort(function (a, b) {
      var rank = function (m) { return (m.strong && m.unread) ? 0 : m.unread ? 1 : 2; };
      var ra = rank(a), rb = rank(b);
      if (ra !== rb) return ra - rb;
      return (b.sortTime || 0) - (a.sortTime || 0);
    });
    var rows = sorted.slice(0, PANEL_LIMIT);

    els.panelList.innerHTML = rows.map(function (m) {
      var main = m.jump
        ? '<a class="panel-msg-main" href="javascript:void(0)" onclick="MSG_PANEL.jumpDirect(' + m.id + ')" title="去处理">'
        : '<a class="panel-msg-main" href="message-detail.html?id=' + m.id + '" onclick="MSG_PANEL.markAutoRead(' + m.id + ')" title="查看详情">';
      return '' +
        '<div class="panel-msg ' + (m.unread ? 'panel-msg-unread' : '') + ' ' + (m.strong && m.unread ? 'panel-msg-strong' : '') + '">' +
          main +
            '<div class="panel-msg-head">' +
              (m.unread ? '<span class="msg-dot"></span>' : '<span class="msg-dot msg-dot-read"></span>') +
              '<span class="ant-tag ' + (CATEGORY_TAG[m.cat] || 'ant-tag-gray') + '">' + m.cat + '</span>' +
              '<span class="panel-msg-title">' + m.title + '</span>' +
              (m.jump ? '<span class="msg-jump-arrow"><i class="fa-solid fa-arrow-right"></i></span>' : '') +
            '</div>' +
            '<div class="panel-msg-summary">' + m.summary + '</div>' +
          '</a>' +
          '<div class="panel-msg-side"><span class="panel-msg-time">' + m.time + '</span></div>' +
        '</div>';
    }).join('');

    els.panelEmpty.classList.toggle('hidden', rows.length > 0);
    els.panelMore.classList.toggle('hidden', rows.length === 0);
    els.panelTotal.textContent = MSG.length;
  }

  /* ---------- 角标同步 + 页面联动 ---------- */
  function syncPanel() {
    var n = unreadCount();
    els.badge.textContent = n;
    els.badge.style.display = n === 0 ? 'none' : '';
    els.panelUnread.textContent = n === 0 ? '无未读' : n + ' 条未读';
    if (onChangeFn) onChangeFn();
  }

  /* ---------- 弹窗开关 ---------- */
  function togglePanel() {
    var willOpen = els.panel.classList.contains('hidden');
    els.panel.classList.toggle('hidden', !willOpen);
    els.entry.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) { renderPanel(); syncPanel(); }
  }
  function closePanel() {
    els.panel.classList.add('hidden');
    els.entry.setAttribute('aria-expanded', 'false');
  }

  /* ---------- 已读操作（与页面共享同一数组） ---------- */
  function markAllRead() {
    MSG.forEach(function (m) { m.unread = false; });
    renderPanel(); syncPanel();
    toast('全部已读');
  }
  function markAutoRead(id) {
    var m = MSG.find(function (x) { return x.id === id; });
    if (m && m.unread) { m.unread = false; renderPanel(); syncPanel(); }
  }
  function jumpDirect(id) {
    var m = MSG.find(function (x) { return x.id === id; });
    if (m && m.unread) { m.unread = false; renderPanel(); syncPanel(); }
    toast('原型演示：已直达「' + (m ? m.jumpTo : '来源处理页') + '」，消息已自动标记已读');
  }

  /* ---------- 对外 API ---------- */
  return {
    setData: function (arr) { MSG = arr; },
    init: function (opts) {
      if (opts && typeof opts.onChange === 'function') onChangeFn = opts.onChange;
      buildDom();
      renderPanel();
      syncPanel();
    },
    refresh: function () { renderPanel(); syncPanel(); },
    unreadCount: unreadCount,
    markAllRead: markAllRead,
    markAutoRead: markAutoRead,
    jumpDirect: jumpDirect
  };
})();
