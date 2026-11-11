const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const SecurityEngine = require('./security-engine');

let mainWindow;
const engine = new SecurityEngine();
let trackerCount = 0;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#f8fafc',
    frame: false, // Custom futuristic header
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true, // Enables isolated, sandboxed browser engine
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile('index.html');

  // Intercept and block trackers silently
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    if (engine.isTracker(details.url)) {
      trackerCount++;
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('tracker-blocked', { count: trackerCount, url: details.url });
      }
      return callback({ cancel: true });
    }
    callback({ cancel: false });
  });
}

// IPC Handlers: Interface communication
ipcMain.handle('verify-url-threat', async (event, url) => {
  return engine.evaluateUrl(url);
});

ipcMain.on('window-minimize', () => mainWindow.minimize());
ipcMain.on('window-maximize', () => {
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
});
ipcMain.on('window-close', () => mainWindow.close());

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
