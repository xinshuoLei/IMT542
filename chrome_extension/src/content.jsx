import React from 'react';
import { createRoot } from 'react-dom/client';
import PackageHealthPanel from './components/PackageHealthPanel';

let panelContainer = null;
let root = null;
let isVisible = false;

function getSelectedText() {
  const selection = window.getSelection();
  return selection ? selection.toString().trim() : '';
}

function createPanel(selectedText = '') {
  if (panelContainer) {
    // Update existing panel with new selected text
    if (root && selectedText) {
      root.render(<PackageHealthPanel onClose={hidePanel} selectedText={selectedText} />);
    }
    return;
  }

  // Create container for the floating panel
  panelContainer = document.createElement('div');
  panelContainer.id = 'package-health-extension-panel';
  panelContainer.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 28rem;
    height: 100vh;
    z-index: 2147483647;
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  `;

  // Inject into page
  document.body.appendChild(panelContainer);

  // Create React root and render
  root = createRoot(panelContainer);
  root.render(<PackageHealthPanel onClose={hidePanel} selectedText={selectedText} />);
}

function showPanel(selectedText = '') {
  if (!panelContainer) {
    createPanel(selectedText);
  } else if (selectedText && root) {
    // Update with new selected text
    root.render(<PackageHealthPanel onClose={hidePanel} selectedText={selectedText} />);
  }
  
  requestAnimationFrame(() => {
    panelContainer.style.transform = 'translateX(0)';
  });
  isVisible = true;
}

function hidePanel() {
  if (panelContainer) {
    panelContainer.style.transform = 'translateX(100%)';
  }
  isVisible = false;
}

function togglePanel() {
  const selectedText = getSelectedText();
  
  if (isVisible) {
    hidePanel();
  } else {
    showPanel(selectedText);
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'togglePanel') {
    togglePanel();
    sendResponse({ success: true });
  }
});
