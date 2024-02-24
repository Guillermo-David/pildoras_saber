import { app, BrowserWindow } from 'electron';
import path from 'path';
import { start as startExpressApp } from './server/server'; // Esto inicia el servidor Express automáticamente


let mainWindow: BrowserWindow | null;
let serverStarted = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 810,
    webPreferences: {
      nodeIntegration: true
    }
  });
}

function startServer() {
  if (!serverStarted) {
    startExpressApp();
    serverStarted = true; // Marcar el servidor como iniciado
  }
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // ... Tu código para manejar una segunda instancia ...
  });

  app.on('ready', () => {
    // startServer();
    createWindow();
  });
}

// app.on('ready', () => {
//   if (!serverStarted) {
//     startExpressApp(); // Inicia el servidor Express aquí
//     serverStarted = true; // Marca el servidor como iniciado
//   }

//   createWindow();
// });

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
