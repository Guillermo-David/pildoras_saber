import { app, BrowserWindow } from 'electron';
import path from 'path';
import { start as startExpressApp, stop as stopExpressApp } from './server/server';

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1420,
    height: 800,
    // useContentSize: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Configura la URL del cliente Angular
  const startUrl = process.env['ELECTRON_START_URL'] || `file://${path.join(__dirname, 'pildoras/index.html')}`;
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// startExpressApp();

let serverStarted = false;

app.on('ready', () => {
  if (!serverStarted) {
    startExpressApp();
    serverStarted = true; // Marca el servidor como iniciado
  }

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  stopExpressApp();
});