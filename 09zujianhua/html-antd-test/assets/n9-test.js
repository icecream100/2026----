(function () {
  'use strict';

  const state = {
    imageReady: false,
    scope: 'partial',
    scopeLabel: '东区园区（6/8 台已开启）',
    currentTarget: 'P-00231',
    timer: null
  };

  const captureRows = [
    ['09:12:08', '东区办公楼东侧', 'CAM-E-012', '92%'],
    ['09:45:31', '访客中心入口', 'CAM-E-027', '89%'],
    ['10:23:16', '北门通道', 'CAM-N-003', '82%'],
    ['11:07:42', '停车区域西侧', 'CAM-P-009', '79%']
  ];
  const timelineTimes = ['09:12', '09:45', '10:23', '11:07', '13:15', '15:30'];

  function $(selector) { return document.querySelector(selector); }
  function $$(selector) { return Array.from(document.querySelectorAll(selector)); }

  function showView(name) {
    $$('[data-n9-panel]').forEach((panel) => { panel.hidden = panel.dataset.n9Panel !== name; });
    $('[data-n9-title]').textContent = name === 'search' ? '人员轨迹查询' : name === 'candidates' ? '候选人员确认' : '人员轨迹结果';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function setImageReady(ready, source) {
    state.imageReady = ready;
    $('#upload-placeholder').hidden = ready;
    $('#upload-preview').hidden = !ready;
    $('#image-error').hidden = true;
    if (ready && source === 'library') {
      $('#upload-preview strong').textContent = 'N11 · 重点目标 A-017';
      $('#upload-preview p').textContent = '已通过公开 API 读取目标线索';
    } else {
      $('#upload-preview strong').textContent = '演示人员线索.jpg';
      $('#upload-preview p').textContent = '已识别可用的人体特征 · 1.2 MB';
    }
  }

  function closeModal(id) {
    window.AntPrototype.closeOverlay(document.getElementById(id));
  }

  function resetSearch() {
    setImageReady(false);
    state.scope = 'partial';
    state.scopeLabel = '东区园区（6/8 台已开启）';
    $('[data-scope-label]').textContent = state.scopeLabel;
    $('#threshold').value = '75';
    $('#threshold-value').textContent = '75%';
    $('#search-text').value = '';
    $('#text-error').hidden = true;
    $('#scope-error').hidden = true;
  }

  function validateAndSearch(event) {
    event.preventDefault();
    $('#image-error').hidden = true;
    $('#text-error').hidden = true;
    $('#scope-error').hidden = true;
    const activeTab = $('[data-ant-tab].ant-tabs-tab-active').dataset.antTab;
    if (state.scope === 'none') {
      $('#scope-error').hidden = false;
      $('#scope-button').focus();
      return;
    }
    if (activeTab === 'image' && !state.imageReady) {
      $('#image-error').textContent = '请上传 1 张人像照片，或载入演示照片。';
      $('#image-error').hidden = false;
      return;
    }
    if (activeTab === 'text' && $('#search-text').value.trim().length < 10) {
      $('#text-error').textContent = '请输入 10—200 字的人员特征描述。';
      $('#text-error').hidden = false;
      $('#search-text').focus();
      return;
    }
    const button = $('#query-button');
    const label = $('[data-query-label]');
    button.disabled = true;
    label.textContent = '查询中…';
    window.setTimeout(() => {
      button.disabled = false;
      label.textContent = '查询';
      showView('candidates');
      window.AntPrototype.message('已找到 5 个候选，请人工确认', 'success');
    }, 420);
  }

  function confirmTarget(target) {
    state.currentTarget = target;
    $$('[data-target-id]').forEach((item) => { item.textContent = target; });
    $('#timeline').value = '0';
    updateTimeline(0);
    showView('trajectory');
    window.AntPrototype.message(`已确认目标 ${target}`, 'success');
  }

  function updateTimeline(value) {
    const index = Number(value);
    $('#timeline-time').textContent = timelineTimes[index];
    $$('[data-map-node]').forEach((node, nodeIndex) => node.classList.toggle('is-reached', nodeIndex <= index));
    $$('[data-capture-row]').forEach((row, rowIndex) => row.classList.toggle('is-current', rowIndex === Math.min(index, captureRows.length - 1)));
  }

  function togglePlayback() {
    const button = $('#play-button');
    const label = $('[data-play-label]');
    if (state.timer) {
      window.clearInterval(state.timer);
      state.timer = null;
      button.setAttribute('aria-pressed', 'false');
      label.textContent = '播放';
      return;
    }
    if (Number($('#timeline').value) >= 5) $('#timeline').value = '0';
    button.setAttribute('aria-pressed', 'true');
    label.textContent = '暂停';
    updateTimeline($('#timeline').value);
    state.timer = window.setInterval(() => {
      const next = Number($('#timeline').value) + 1;
      if (next > 5) {
        window.clearInterval(state.timer);
        state.timer = null;
        button.setAttribute('aria-pressed', 'false');
        label.textContent = '播放';
        return;
      }
      $('#timeline').value = String(next);
      updateTimeline(next);
    }, 650);
  }

  function openCapture(index) {
    const row = captureRows[index - 1] || captureRows[0];
    $('[data-capture-time]').textContent = row[0];
    $('[data-capture-place]').textContent = row[1];
    $('[data-capture-code]').textContent = row[2];
    $('[data-capture-score]').textContent = row[3];
    window.AntPrototype.showModal('capture-modal');
  }

  function resetExport() {
    $('#export-config').hidden = false;
    $('#export-success').hidden = true;
    $('#generate-report').hidden = false;
    $('#finish-export').hidden = true;
    $('[data-generate-label]').textContent = '生成报告';
    $('#generate-report').disabled = false;
  }

  function generateReport() {
    const title = $('#report-title');
    if (!title.value.trim()) {
      title.focus();
      window.AntPrototype.message('请填写报告标题', 'error');
      return;
    }
    $('#generate-report').disabled = true;
    $('[data-generate-label]').textContent = '生成中…';
    window.setTimeout(() => {
      $('#export-config').hidden = true;
      $('#export-success').hidden = false;
      $('#generate-report').hidden = true;
      $('#finish-export').hidden = false;
      $('#finish-export').focus();
    }, 520);
  }

  document.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]');
    if (!action) return;
    switch (action.dataset.action) {
      case 'nav-person': case 'back-search': case 'none-match': showView('search'); break;
      case 'choose-file': $('#person-image').click(); break;
      case 'load-demo': setImageReady(true, 'demo'); break;
      case 'remove-image': setImageReady(false); break;
      case 'choose-library-target': setImageReady(true, 'library'); closeModal('library-modal'); window.AntPrototype.message('已从 N11 目标库带入线索', 'success'); break;
      case 'choose-scope':
        state.scope = action.dataset.scope;
        state.scopeLabel = action.dataset.label;
        $('[data-scope-label]').textContent = state.scopeLabel;
        $$('.n9-scope-option').forEach((option) => option.classList.toggle('is-selected', option === action));
        closeModal('scope-modal');
        break;
      case 'confirm-target': confirmTarget(action.dataset.target); break;
      case 'back-candidates': showView('candidates'); break;
      case 'play-route': togglePlayback(); break;
      case 'open-capture': openCapture(Number(action.dataset.capture)); break;
      case 'locate-map': window.AntPrototype.message('已定位到对应轨迹节点', 'success'); break;
      case 'video-unavailable': window.AntPrototype.message('该摄像头暂无录像，请查看其他节点', 'error'); break;
      case 'open-export': resetExport(); break;
      case 'generate-report': generateReport(); break;
      case 'finish-export': window.AntPrototype.message('报告生成流程验证完成', 'success'); break;
      case 'reset-search': window.setTimeout(resetSearch, 0); break;
      default: break;
    }
  });

  document.addEventListener('change', (event) => {
    if (event.target.id === 'person-image' && event.target.files.length) setImageReady(true, 'file');
    if (event.target.id === 'threshold') $('#threshold-value').textContent = `${event.target.value}%`;
    if (event.target.matches('.ant-checkbox-input')) event.target.closest('.ant-checkbox').classList.toggle('ant-checkbox-checked', event.target.checked);
  });

  document.addEventListener('input', (event) => {
    if (event.target.id === 'timeline') updateTimeline(event.target.value);
  });

  $('#search-form').addEventListener('submit', validateAndSearch);
  updateTimeline(0);
})();
