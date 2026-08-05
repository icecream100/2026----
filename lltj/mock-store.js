/**
 * mock-store.js — 流量统计分析模块原型跨页共享 Mock 状态
 *
 * 解决问题（review-full-v1 H5/M3）：
 *  - 各页独立硬编码数据 → 无跨页闭环（H5）
 *  - 侧栏 data-role-hide 无 JS 生效、无角色切换（M3）
 *
 * 能力：
 *  1. localStorage 持久化告警规则 + 告警事件 + 当前角色
 *  2. 角色切换器（管理员/运营/只读访客），驱动侧栏 data-role-hide 显隐、visitorTip、导出按钮禁用
 *  3. alert-rule / alert-list / dashboard 三页共享同一数据源，实现"配置→告警→总览"纵向闭环
 *
 * 接入：每个带侧栏页面在 head 加 <script src="../mock-store.js"></script>，
 *       并给 header 用户块加 class="user-block"（内含 .user-avatar 与 .user-name），
 *       在 header 内放一个 <span class="role-switch"></span> 容器；
 *       DOMContentLoaded 时自动 initRoleSwitcher + applyRole。
 */
window.MockStore = (function () {
  var K_RULES = 'flow_alert_rules';
  var K_EVENTS = 'flow_alert_events';
  var K_ROLE = 'flow_role';

  var SEED_RULES = [
    { id: 1, type: '超员', group: '食堂就餐区', threshold: 500, radius: null, duration: 30, level: '紧急', active: true, hit7d: 12, lastHit: '5 分钟前' },
    { id: 2, type: '超员', group: 'B 栋大堂', threshold: 300, radius: null, duration: 30, level: '警告', active: true, hit7d: 8, lastHit: '1 小时前' },
    { id: 3, type: '聚集', group: '广场', threshold: 100, radius: 5, duration: 60, level: '警告', active: true, hit7d: 3, lastHit: '3 小时前' },
    { id: 4, type: '超员', group: 'A 栋办公区', threshold: 800, radius: null, duration: 30, level: '紧急', active: false, hit7d: 0, lastHit: '-' },
    { id: 5, type: '客流异常', group: '食堂就餐区', threshold: 30, radius: null, direction: 'both', duration: 900, level: '警告', active: true, hit7d: 2, lastHit: '2 小时前' }
  ];

  var SEED_EVENTS = [
    { id: 'AE20260716-001', rule: '超员·食堂就餐区（500）', type: '超员', group: '食堂就餐区', level: '紧急', threshold: 500, triggerTime: '2026-07-16 12:35:08', triggerCount: 612, curCount: 598, recoverTime: '', status: '待处理', confirmUser: '', confirmTime: '', handleResult: '', handleRemark: '', handleUser: '', handleTime: '', sla: '' },
    { id: 'AE20260805-001', rule: '客流异常·食堂就餐区（±30%）', type: '客流异常', group: '食堂就餐区', level: '警告', threshold: 30, triggerTime: '2026-08-05 11:45:32', triggerCount: 612, curCount: 612, recoverTime: '', status: '待处理', confirmUser: '', confirmTime: '', handleResult: '', handleRemark: '', handleUser: '', handleTime: '', sla: '' },
    { id: 'AE20260805-002', rule: '客流异常·广场（±30%）', type: '客流异常', group: '广场', level: '警告', threshold: 30, triggerTime: '2026-08-05 10:20:11', triggerCount: 48, curCount: 52, recoverTime: '2026-08-05 10:35:40', status: '处理中', confirmUser: '运营·李', confirmTime: '2026-08-05 10:21:05', handleResult: '', handleRemark: '', handleUser: '', handleTime: '', sla: '' },
    { id: 'AE20260716-002', rule: '超员·B 栋大堂（300）', type: '超员', group: 'B 栋大堂', level: '警告', threshold: 300, triggerTime: '2026-07-16 11:20:33', triggerCount: 342, curCount: 338, recoverTime: '', status: '处理中', confirmUser: '管理员·王', confirmTime: '2026-07-16 11:22:10', handleResult: '', handleRemark: '', handleUser: '', handleTime: '', sla: '' },
    { id: 'AE20260715-003', rule: '聚集·广场（100/5m）', type: '聚集', group: '广场', level: '警告', threshold: 100, triggerTime: '2026-07-15 14:08:12', triggerCount: 118, curCount: 0, recoverTime: '2026-07-15 14:11:40', status: '已关闭', confirmUser: '管理员·王', confirmTime: '2026-07-15 14:09:05', handleResult: '已关闭', handleRemark: '现场疏导，人群散开', handleUser: '管理员·王', handleTime: '2026-07-15 14:10:27', sla: '2分15秒' },
    { id: 'AE20260715-004', rule: '超员·A栋办公区（800）', type: '超员', group: 'A 栋办公区', level: '紧急', threshold: 800, triggerTime: '2026-07-15 09:42:05', triggerCount: 960, curCount: 0, recoverTime: '2026-07-15 09:45:20', status: '误报', confirmUser: '管理员·王', confirmTime: '2026-07-15 09:43:00', handleResult: '误报', handleRemark: '午间短时打卡聚集，非持续超员', handleUser: '管理员·王', handleTime: '2026-07-15 09:46:18', sla: '' },
    { id: 'AE20260714-005', rule: '聚集·食堂就餐区（100/5m）', type: '聚集', group: '食堂就餐区', level: '警告', threshold: 100, triggerTime: '2026-07-14 18:30:44', triggerCount: 105, curCount: 0, recoverTime: '2026-07-14 18:36:12', status: '已恢复', confirmUser: '管理员·王', confirmTime: '2026-07-14 18:32:00', handleResult: '', handleRemark: '系统自动恢复（人数回落），待运营补标记处置', handleUser: '系统', handleTime: '', sla: '' },
    { id: 'AE20260805-003', rule: '客流异常·食堂就餐区（±30%）', type: '客流异常', group: '食堂就餐区', level: '警告', threshold: 30, triggerTime: '2026-08-05 09:32:18', triggerCount: 486, curCount: 486, recoverTime: '', status: '待处理', confirmUser: '', confirmTime: '', handleResult: '', handleRemark: '', handleUser: '', handleTime: '', sla: '' },
    { id: 'AE20260805-004', rule: '客流异常·A 栋办公区（±30%）', type: '客流异常', group: 'A 栋办公区', level: '警告', threshold: 30, triggerTime: '2026-08-05 08:50:42', triggerCount: 355, curCount: 351, recoverTime: '', status: '待处理', confirmUser: '', confirmTime: '', handleResult: '', handleRemark: '', handleUser: '', handleTime: '', sla: '' },
    { id: 'AE20260805-005', rule: '客流异常·地下车库入口（±30%）', type: '客流异常', group: '地下车库入口', level: '警告', threshold: 30, triggerTime: '2026-08-04 18:20:33', triggerCount: 35, curCount: 0, recoverTime: '2026-08-04 18:38:10', status: '已关闭', confirmUser: '运营·李', confirmTime: '2026-08-04 18:22:05', handleResult: '已关闭', handleRemark: '下班离场客流骤减，属正常现象', handleUser: '运营·李', handleTime: '2026-08-04 18:24:40', sla: '4分07秒' },
    { id: 'AE20260804-006', rule: '客流异常·广场（±30%）', type: '客流异常', group: '广场', level: '警告', threshold: 30, triggerTime: '2026-08-04 08:15:26', triggerCount: 22, curCount: 0, recoverTime: '2026-08-04 08:28:15', status: '误报', confirmUser: '运营·李', confirmTime: '2026-08-04 08:16:50', handleResult: '误报', handleRemark: '晨间广播集合造成短暂人流聚集，非真实突增', handleUser: '运营·李', handleTime: '2026-08-04 08:20:12', sla: '' },
    { id: 'AE20260804-007', rule: '客流异常·B 栋大堂（±30%）', type: '客流异常', group: 'B 栋大堂', level: '警告', threshold: 30, triggerTime: '2026-08-04 12:10:05', triggerCount: 488, curCount: 0, recoverTime: '2026-08-04 12:28:40', status: '已恢复', confirmUser: '运营·李', confirmTime: '2026-08-04 12:12:00', handleResult: '', handleRemark: '午间高峰人流，系统自动恢复（偏差回落），待运营补标记处置', handleUser: '系统', handleTime: '', sla: '' },
    { id: 'AE20260805-008', rule: '超员·地下车库入口（400）', type: '超员', group: '地下车库入口', level: '警告', threshold: 400, triggerTime: '2026-08-05 13:05:22', triggerCount: 428, curCount: 412, recoverTime: '', status: '待处理', confirmUser: '', confirmTime: '', handleResult: '', handleRemark: '', handleUser: '', handleTime: '', sla: '' }
  ];

  // ===== 数据版本控制：SEED 变更时递增 STORE_VERSION，自动重置 localStorage 重新播种 =====
  // 修复场景：浏览器已缓存旧版规则/事件数据时，直接打开看不到最新模拟数据
  var STORE_VERSION = '1';
  var K_VERSION = 'flow_store_version';
  (function () {
    try {
      if (localStorage.getItem(K_VERSION) !== STORE_VERSION) {
        localStorage.removeItem(K_RULES);
        localStorage.removeItem(K_EVENTS);
        localStorage.setItem(K_VERSION, STORE_VERSION);
      }
    } catch (e) {}
  })();

  function _clone(o) { return JSON.parse(JSON.stringify(o)); }
  function _get(k, seed) {
    try { var v = localStorage.getItem(k); if (v) return JSON.parse(v); } catch (e) {}
    var s = _clone(seed); try { localStorage.setItem(k, JSON.stringify(s)); } catch (e) {}
    return s;
  }
  function _set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  var ROLE_LABELS = { admin: '管理员·王', operator: '运营·李', visitor: '只读访客·张' };
  var ROLE_AVATAR = { admin: '管', operator: '运', visitor: '访' };
  var ROLE_BG = { admin: '#1677ff', operator: '#52c41a', visitor: '#faad14' };

  return {
    getRules: function () { return _get(K_RULES, SEED_RULES); },
    saveRules: function (r) { _set(K_RULES, r); },
    getEvents: function () {
      var list = _get(K_EVENTS, SEED_EVENTS);
      // 告警关键帧（触发帧/最新帧）：触发帧=触发时抓拍；最新帧语义按事件状态重算（哥拍板：已处理=处理时关键帧）
      //  - 已处理（已关闭/误报）：最新帧=处理时抓拍（handleTime）
      //  - 已恢复（待补标记）：最新帧=恢复时抓拍（recoverTime）
      //  - 待处理/处理中：最新帧=当前帧（实时，展示"刚刚"）
      list.forEach(function (e) {
        var kf = e.keyframes || {};
        kf.triggerTime = e.triggerTime;
        if (e.handleTime) { kf.latestTime = e.handleTime; }
        else if (e.status === '已恢复') { kf.latestTime = e.recoverTime || e.triggerTime; }
        else { kf.latestTime = '刚刚'; }
        e.keyframes = kf;
      });
      return list;
    },
    saveEvents: function (e) { _set(K_EVENTS, e); },
    resetAll: function () { try { localStorage.removeItem(K_RULES); localStorage.removeItem(K_EVENTS); } catch (e) {} },
    getRole: function () { try { return localStorage.getItem(K_ROLE) || 'admin'; } catch (e) { return 'admin'; } },
    setRole: function (r) { try { localStorage.setItem(K_ROLE, r); } catch (e) {} },
    ROLE_LABELS: ROLE_LABELS,
    pendingEvents: function () {
      return this.getEvents().filter(function (e) { return e.status === '待处理'; });
    },
    applyRole: function () {
      var role = this.getRole();
      // 侧栏：data-role-hide 含当前角色则隐藏
      document.querySelectorAll('[data-role-hide]').forEach(function (el) {
        var hide = el.getAttribute('data-role-hide').split(',');
        el.style.display = (hide.indexOf(role) >= 0) ? 'none' : '';
      });
      // 访客提示条
      var tip = document.getElementById('visitorTip');
      if (tip) tip.style.display = (role === 'visitor') ? '' : 'none';
      // 用户块头像与名称（avatar=块内第一个 div，name=块内 span）
      document.querySelectorAll('.user-block').forEach(function (ub) {
        var av = ub.querySelector('div');
        if (av) { av.textContent = ROLE_AVATAR[role]; av.style.background = ROLE_BG[role]; }
        var nm = ub.querySelector('span');
        if (nm) nm.textContent = ROLE_LABELS[role];
      });
      // 导出类按钮：访客禁用
      document.querySelectorAll('[data-role-disable-export]').forEach(function (b) {
        b.disabled = (role === 'visitor');
        if (role === 'visitor') b.classList.add('btn-dim'); else b.classList.remove('btn-dim');
      });
    },
    initRoleSwitcher: function () {
      var self = this;
      var cur = self.getRole();
      var opts = '<option value="admin"' + (cur === 'admin' ? ' selected' : '') + '>管理员</option>'
        + '<option value="operator"' + (cur === 'operator' ? ' selected' : '') + '>运营</option>'
        + '<option value="visitor"' + (cur === 'visitor' ? ' selected' : '') + '>只读访客</option>';
      document.querySelectorAll('.role-switch').forEach(function (c) {
        c.innerHTML = '<label style="color:rgba(255,255,255,.7);font-size:12px;margin-right:4px">角色</label>'
          + '<select onchange="MockStore.setRole(this.value);MockStore.applyRole();" style="background:rgba(255,255,255,.15);color:#fff;border:1px solid rgba(255,255,255,.3);border-radius:4px;padding:2px 6px;font-size:12px;cursor:pointer">' + opts + '</select>';
      });
    },
    init: function () { this.initRoleSwitcher(); this.applyRole(); }
  };
})();
document.addEventListener('DOMContentLoaded', function () { MockStore.init(); });
