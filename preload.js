const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('sentinelAPI', {
  checkSecurity: (url) => ipcRenderer.invoke('verify-url-threat', url),
  onTrackerBlocked: (callback) => ipcRenderer.on('tracker-blocked', (e, val) => callback(val)),
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close')
});
