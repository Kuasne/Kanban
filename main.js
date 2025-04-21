const { app, BrowserWindow } = require('electron');

let splashWindow;
let mainWindow;

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 300,
    height: 300,
    frame: false, // Remove a barra de título da janela
    transparent: true, // Torna a janela transparente (opcional)
    alwaysOnTop: true, // Mantém a splash screen em cima de outras janelas
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  splashWindow.loadFile('splash.html'); // Carrega a tela de splash

  // Após 3 segundos, cria a janela principal e fecha a splash screen
  setTimeout(() => {
    createMainWindow();
    splashWindow.close();
  }, 3000); // Tempo de exibição da splash screen (3 segundos)
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
   fullscreen: true, // Abre a janela principal em tela cheia
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html'); // Carrega a tela de login ou a página principal
}

app.whenReady().then(createSplashWindow); // Inicia com a tela de splash

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
