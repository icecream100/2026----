(function () {
  'use strict';

  const previousFocus = new WeakMap();
  const viewTitles = new Map();

  function focusFirst(container) {
    const target = container.querySelector('[autofocus]:not([disabled])') || container.querySelector(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (target) target.focus();
  }

  function showView(name) {
    document.querySelectorAll('[data-ant-view-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.antViewPanel !== name;
    });
    document.querySelectorAll('[data-ant-view]').forEach((item) => {
      const active = item.dataset.antView === name;
      item.classList.toggle('ant-menu-item-selected', active);
      if (active) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
    if (viewTitles.has(name)) {
      document.querySelectorAll('[data-ant-view-title]').forEach((title) => {
        title.textContent = viewTitles.get(name);
      });
    }
  }

  function showOverlay(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    previousFocus.set(overlay, document.activeElement);
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    focusFirst(overlay);
  }

  function closeOverlay(overlay) {
    if (!overlay) return;
    overlay.hidden = true;
    if (!document.querySelector('.ant-prototype-modal-root:not([hidden]), .ant-prototype-drawer-root:not([hidden])')) {
      document.body.style.overflow = '';
    }
    const trigger = previousFocus.get(overlay);
    if (trigger && typeof trigger.focus === 'function') trigger.focus();
  }

  function message(text, type) {
    let host = document.querySelector('.ant-prototype-message-host');
    if (!host) {
      host = document.createElement('div');
      host.className = 'ant-prototype-message-host ant-message ant-message-top ant-message-css-var css-var-_R_0_';
      host.setAttribute('role', 'status');
      host.setAttribute('aria-live', 'polite');
      document.body.appendChild(host);
    }

    const notice = document.createElement('div');
    notice.className = 'ant-message-notice';
    const content = document.createElement('div');
    content.className = 'ant-message-notice-content';
    const custom = document.createElement('div');
    custom.className = 'ant-message-custom-content';
    const icon = document.createElement('span');
    icon.className = `ant-prototype-message-icon${type === 'error' ? ' is-error' : ''}`;
    icon.textContent = type === 'error' ? '!' : '✓';
    const label = document.createElement('span');
    label.textContent = text;
    custom.append(icon, label);
    content.appendChild(custom);
    notice.appendChild(content);
    host.appendChild(notice);
    window.setTimeout(() => notice.remove(), 2400);
  }

  function activateTab(tab) {
    const group = tab.closest('[data-ant-tabs]');
    if (!group) return;
    const name = tab.dataset.antTab;
    group.querySelectorAll('[data-ant-tab]').forEach((item) => {
      const active = item.dataset.antTab === name;
      item.classList.toggle('ant-tabs-tab-active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    group.querySelectorAll('[data-ant-tab-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.antTabPanel !== name;
    });
  }

  document.querySelectorAll('[data-ant-view]').forEach((item) => {
    const name = item.dataset.antView;
    if (item.dataset.antTitle || !viewTitles.has(name)) {
      viewTitles.set(name, item.dataset.antTitle || item.textContent.trim());
    }
  });

  document.addEventListener('click', (event) => {
    const view = event.target.closest('[data-ant-view]');
    if (view) showView(view.dataset.antView);

    const tab = event.target.closest('[data-ant-tab]');
    if (tab) activateTab(tab);

    const openModal = event.target.closest('[data-ant-open-modal]');
    if (openModal) showOverlay(openModal.dataset.antOpenModal);

    const openDrawer = event.target.closest('[data-ant-open-drawer]');
    if (openDrawer) showOverlay(openDrawer.dataset.antOpenDrawer);

    const close = event.target.closest('[data-ant-close]');
    if (close) closeOverlay(close.closest('.ant-prototype-modal-root, .ant-prototype-drawer-root'));

    const toast = event.target.closest('[data-ant-message]');
    if (toast) message(toast.dataset.antMessage, toast.dataset.antMessageType || 'success');
  });

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-ant-form]');
    if (!form) return;
    event.preventDefault();
    if (!form.reportValidity()) {
      message('请检查并补充必填信息', 'error');
      return;
    }
    const overlay = form.closest('.ant-prototype-modal-root, .ant-prototype-drawer-root');
    if (overlay) closeOverlay(overlay);
    message(form.dataset.antSuccessMessage || '操作成功', 'success');
    if (form.dataset.antSuccessView) showView(form.dataset.antSuccessView);
  });

  document.addEventListener('keydown', (event) => {
    const view = event.target.closest('[data-ant-view]');
    if (view && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      showView(view.dataset.antView);
      return;
    }
    if (event.key === 'Escape') {
      const overlay = document.querySelector('.ant-prototype-modal-root:not([hidden]), .ant-prototype-drawer-root:not([hidden])');
      if (overlay) closeOverlay(overlay);
    }
  });

  window.AntPrototype = {
    showView,
    showModal: showOverlay,
    showDrawer: showOverlay,
    closeOverlay,
    message
  };
})();
