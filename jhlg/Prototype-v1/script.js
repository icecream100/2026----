/* 
   Shared Interaction Logic 
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Navigation Highlight
    const currentPath = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        if (item.getAttribute('href') === currentPath) {
            item.classList.add('active');
        }
    });

    // 2. Modal Handling
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const closeButtons = document.querySelectorAll('[data-modal-close]');

    modalTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
            }
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Click outside to close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });

    // 3. Tab Switching
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            // Find parent tab container
            const container = trigger.closest('.tab-container');
            if (!container) return;

            // Remove active from all triggers
            container.querySelectorAll('.tab-trigger').forEach(t => t.classList.remove('active'));
            trigger.classList.add('active');

            // Show target content
            const targetId = trigger.getAttribute('data-tab-target');

            // Fix: Tab content is usually a sibling of the container, not a child
            // We search in the parent of the tab-container
            const context = container.parentElement || document;
            context.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            const target = document.getElementById(targetId);
            if (target) target.classList.add('active');
        });
    });
});

// Utility: Simulated Toast Notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `glass-panel toast toast-${type}`;
    toast.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        padding: 12px 24px; border-radius: 8px;
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid var(--glass-border);
        color: white; font-size: 14px;
        transform: translateY(-20px); opacity: 0;
        transition: all 0.3s ease; z-index: 2000;
        display: flex; align-items: center; gap: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;

    // Add Icon
    let icon = '✓';
    if (type === 'error') icon = '✕';
    if (type === 'warning') icon = '!';

    toast.innerHTML = `<span style="color: var(--${type}); font-weight:bold;">${icon}</span> ${message}`;

    document.body.appendChild(toast);

    // Animation
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        toast.style.transform = 'translateY(-20px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Utility: Confirm Dialog
function showConfirm(message, onConfirm) {
    const modalId = 'confirm-' + Date.now();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.id = modalId;
    overlay.style.zIndex = '3000'; // Higher than normal modals

    overlay.innerHTML = `
        <div class="modal-content" style="width: 400px; height: auto;">
            <div class="modal-header">
                <h3 class="modal-title">确认提示</h3>
                <button class="modal-close" onclick="closeConfirm('${modalId}')">×</button>
            </div>
            <div class="modal-body" style="padding: 24px; font-size: 14px; color: var(--text-main);">
                ${message}
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeConfirm('${modalId}')">取消</button>
                <button class="btn btn-primary" id="btn-${modalId}">确定</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Bind Confirm
    document.getElementById(`btn-${modalId}`).addEventListener('click', () => {
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
        closeConfirm(modalId);
    });

    // Close on click outside
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeConfirm(modalId);
    });
}

function closeConfirm(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 200);
    }
}
