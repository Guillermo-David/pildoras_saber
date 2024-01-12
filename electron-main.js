const { app, BrowserWindow } = require('electron')

function createWindow() {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
    });

    win.loadFile("dist/pildoras_saber/index.html");

    win.on('closed', function () {
        win = null;
    });
}

app.whenReady().then( () => {
    createWindow()
});