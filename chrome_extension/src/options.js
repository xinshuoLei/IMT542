// chrome_extension/src/options.js
document.addEventListener('DOMContentLoaded', async () => {
  const apiUrlInput = document.getElementById('apiUrl');
  const saveButton = document.getElementById('save');
  const statusDiv = document.getElementById('status');
  const testButton = document.getElementById('test');
  const resetButton = document.getElementById('reset');

  // Load current settings
  try {
    const result = await chrome.storage.sync.get(['apiUrl']);
    apiUrlInput.value = result.apiUrl || 'http://localhost:8000';
  } catch (error) {
    console.error('Error loading settings:', error);
  }

  // Save settings
  saveButton.addEventListener('click', async () => {
    const apiUrl = apiUrlInput.value.trim();
    
    // Basic URL validation
    if (!apiUrl) {
      showStatus('Please enter an API URL', 'error');
      return;
    }

    try {
      new URL(apiUrl); // This will throw if invalid
    } catch {
      showStatus('Please enter a valid URL (e.g., http://localhost:8000)', 'error');
      return;
    }

    try {
      await chrome.storage.sync.set({ apiUrl });
      showStatus('Settings saved successfully!', 'success');
    } catch (error) {
      showStatus('Error saving settings: ' + error.message, 'error');
    }
  });

  // Test API connection
  testButton.addEventListener('click', async () => {
    const apiUrl = apiUrlInput.value.trim();
    
    if (!apiUrl) {
      showStatus('Please enter an API URL first', 'error');
      return;
    }

    // Validate URL format
    try {
      new URL(apiUrl);
    } catch {
      showStatus('Please enter a valid URL (e.g., http://localhost:8000)', 'error');
      return;
    }

    // Disable button and show loading state
    testButton.disabled = true;
    testButton.textContent = 'Testing...';
    showStatus('Testing connection...', 'info');
    
    try {
      // Set a timeout for the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${apiUrl}/`, {
        signal: controller.signal,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        showStatus(`✓ Connection successful! API is running (${response.status})`, 'success');
        console.log('API Response:', data);
      } else {
        showStatus(`✗ Connection failed: HTTP ${response.status} ${response.statusText}`, 'error');
      }
    } catch (error) {
      let errorMessage = '✗ Connection failed: ';
      
      if (error.name === 'AbortError') {
        errorMessage += 'Request timed out (10s)';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage += 'Cannot reach server. Make sure the API is running and accessible.';
      } else {
        errorMessage += error.message;
      }
      
      showStatus(errorMessage, 'error');
      console.error('Connection test error:', error);
    } finally {
      // Re-enable button
      testButton.disabled = false;
      testButton.textContent = 'Test Connection';
    }
  });

  // Reset to default
  resetButton.addEventListener('click', () => {
    apiUrlInput.value = 'http://localhost:8000';
    showStatus('Reset to default URL', 'info');
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block'; // Make sure it's visible
    
    // Clear status after 5 seconds for success/info messages
    if (type === 'success' || type === 'info') {
      setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'status';
        statusDiv.style.display = 'none';
      }, 5000);
    }
  }
});