export function loadSettings() {
  const apiKey = localStorage.getItem('apiKey');
  if (apiKey) {
    document.getElementById('api-key').value = apiKey;
  }

  const apiUrl = localStorage.getItem('apiUrl');
  if (apiUrl) {
    document.getElementById('api-url').value = apiUrl;
  }

  const model = localStorage.getItem('model');
  if (model) {
    document.getElementById('model').value = model;
  }
}

export function initSettings() {
  const settingsButton = document.getElementById('settings-button');
  const settingsDialog = document.getElementById('settings-dialog');

  if (!settingsButton || !settingsDialog) {
    return;
  }

  settingsButton.addEventListener('click', () => settingsDialog.showModal());
  settingsDialog.addEventListener('click', (e) => {
    if (e.target === settingsDialog) {
      settingsDialog.close();
    }
  });

  const saveButton = document.getElementById('save-settings');
  saveButton?.addEventListener('click', () => {
    const apiKey = document.getElementById('api-key').value;
    const apiUrl = document.getElementById('api-url').value;
    const model = document.getElementById('model').value;
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('apiUrl', apiUrl);
    localStorage.setItem('model', model);
    settingsDialog.close();
  });
}
