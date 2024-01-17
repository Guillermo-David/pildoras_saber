import { app, BrowserWindow } from 'electron';
import path from 'path';
import {start as startExpressApp} from './server/server'; // Esto inicia el servidor Express automáticamente


let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Configura la URL del cliente Angular
  const startUrl = process.env['ELECTRON_START_URL'] || `file://${path.join(__dirname, '/dist/index.html')}`;
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

startExpressApp(); // Inicia el servidor Express

app.on('ready', createWindow);

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
