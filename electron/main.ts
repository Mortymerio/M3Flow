const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const fs = require('fs');
const { join, dirname, basename } = require('path');

// Configuración de rutas robusta para CommonJS
process.env.DIST_ELECTRON = __dirname;
// En producción, 'dist' suele estar al mismo nivel que 'dist-electron'
process.env.DIST = join(__dirname, '../dist');
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(__dirname, '../public')
  : process.env.DIST;

// Importar la base de datos usando require
const { initDB, databaseAPI, closeDB } = require('./database.ts');

// Bloqueo de instancia única para evitar abrir múltiples veces
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Si se intenta abrir otra instancia, enfocar la ventana principal
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
}

// Catch unhandled errors to help debug production crashes
process.on('uncaughtException', (error) => {
  dialog.showErrorBox('Main Process Exception', error.message + '\n' + error.stack);
});
process.on('unhandledRejection', (reason) => {
  dialog.showErrorBox('Main Process Rejection', reason?.message || String(reason));
});

// Intercomunicación Segura (IPC)
ipcMain.handle('get-notes', () => databaseAPI.getNotes())
ipcMain.handle('save-note', (_, note) => databaseAPI.saveNote(note))
ipcMain.handle('get-notebooks', () => databaseAPI.getNotebooks())
ipcMain.handle('save-notebook', (_, nb) => databaseAPI.saveNotebook(nb))
ipcMain.handle('delete-notebook', (_, id) => databaseAPI.deleteNotebook(id))
ipcMain.handle('delete-note', (_, id) => databaseAPI.deleteNote(id))
ipcMain.handle('db:moveNotebook', (_, id, parentId) => databaseAPI.moveNotebook(id, parentId));
ipcMain.handle('db:moveNote', (_, noteId, notebookId) => databaseAPI.moveNote(noteId, notebookId));
ipcMain.handle('db:updateNoteStatus', (_, noteId, status) => databaseAPI.updateNoteStatus(noteId, status));
ipcMain.handle('db:updateNoteReminder', (_, noteId, reminderAt) => databaseAPI.updateNoteReminder(noteId, reminderAt));
ipcMain.handle('db:getTags', () => databaseAPI.getTags());
ipcMain.handle('db:getNoteTags', () => databaseAPI.getNoteTags());
ipcMain.handle('db:createTag', (_, tag) => databaseAPI.createTag(tag));
ipcMain.handle('db:updateTag', (_, tag) => databaseAPI.updateTag(tag));
ipcMain.handle('db:deleteTag', (_, id) => databaseAPI.deleteTag(id));
ipcMain.handle('db:toggleNoteTag', (_, noteId, tagId) => databaseAPI.toggleNoteTag(noteId, tagId));

ipcMain.handle('window:close', () => win?.close());
ipcMain.handle('window:minimize', () => win?.minimize());
ipcMain.handle('window:maximize', () => {
    if (win?.isMaximized()) { win?.unmaximize(); } else { win?.maximize(); }
});

ipcMain.handle('export-markdown', async (_, { title, content }) => {
  const result = await dialog.showSaveDialog({
    title: 'Export active note to Markdown',
    defaultPath: `${title || 'untitled'}.md`,
    filters: [{ name: 'Markdown', extensions: ['md'] }]
  });
  if (!result.canceled && result.filePath) {
    fs.writeFileSync(result.filePath, content);
    return true;
  }
  return false;
});

ipcMain.handle('export-pdf', async (_, { title }) => {
  const result = await dialog.showSaveDialog({
    title: 'Export active note to PDF',
    defaultPath: `${title || 'untitled'}.pdf`,
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  });
  
  if (!result.canceled && result.filePath) {
    try {
      const data = await win.webContents.printToPDF({
        printBackground: true,
        pageSize: 'A4',
        displayHeaderFooter: false
      });
      fs.writeFileSync(result.filePath, data);
      return true;
    } catch (error) {
      console.error('PDF Export Error:', error);
      return false;
    }
  }
  return false;
});

ipcMain.handle('import-workspace', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Select Workspace Folder',
    properties: ['openDirectory']
  });
  
  if (result.canceled || result.filePaths.length === 0) return false;
  
  // Limpiar workspace actual para evitar duplicados
  databaseAPI.clearWorkspace();
  
  const rootPath = result.filePaths[0];
  const rootId = 'nb-' + Date.now();
  
  databaseAPI.saveNotebook({ id: rootId, name: basename(rootPath), parentId: null });
  
  const scanDir = (dirPath, pid) => {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      if (item.startsWith('.') || item === 'node_modules') continue;
      const fullPath = join(dirPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const sid = 'nb-' + Math.random().toString(36).substr(2, 9);
        databaseAPI.saveNotebook({ id: sid, name: item, parentId: pid });
        scanDir(fullPath, sid);
      } else if (item.endsWith('.md')) {
        const nid = 'note-' + Math.random().toString(36).substr(2, 9);
        const body = fs.readFileSync(fullPath, 'utf8');
        databaseAPI.saveNote({ id: nid, title: item.replace('.md', ''), body, notebookId: pid });
      }
    }
  };
  
  scanDir(rootPath, rootId);
  return true;
});

let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    transparent: true,
    titleBarStyle: 'hidden',
    show: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
  })

  // Interceptar navegación hacia enlaces externos
  win.webContents.on('will-navigate', (event, url) => {
    // Si la URL no es la del servidor de desarrollo o el archivo local, abrir externamente
    const isDev = process.env.VITE_DEV_SERVER_URL && url.startsWith(process.env.VITE_DEV_SERVER_URL);
    const isFile = url.startsWith('file://');
    
    if (!isDev && !isFile) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  // Interceptar window.open (clics con target="_blank")
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  win.once('ready-to-show', () => {
    win?.show();
  });

  win.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    dialog.showErrorBox('Load Failure', `Failed to load: ${validatedURL}\nError: ${errorDescription} (${errorCode})`);
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    const indexPath = join(process.env.DIST, 'index.html');
    win.loadFile(indexPath).catch(err => {
      dialog.showErrorBox('File Load Error', `Could not load index.html from: ${indexPath}\n${err.message}`);
    });
  }
}

let splashWin = null;

function createSplashWindow() {
  splashWin = new BrowserWindow({
    width: 500,
    height: 350,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    splashWin.loadURL(`${process.env.VITE_DEV_SERVER_URL}splash.html`);
  } else {
    const splashPath = join(process.env.DIST, 'splash.html');
    splashWin.loadFile(splashPath).catch(err => {
      console.error('Failed to load splash screen:', err);
    });
  }
  splashWin.center();
}

async function initializeApp() {
  createSplashWindow();

  const sendLog = (msg) => {
    if (splashWin && !splashWin.isDestroyed()) {
      splashWin.webContents.send('loading-log', msg);
    }
    console.log(`[Init] ${msg}`);
  };

  // Simular un pequeño delay para que se vea el splash (opcional, pero ayuda a la experiencia)
  await new Promise(resolve => setTimeout(resolve, 500));

  sendLog('Cargando motor de base de datos...');
  initDB((msg) => sendLog(msg));

  await new Promise(resolve => setTimeout(resolve, 300));
  sendLog('Preparando interfaz de usuario...');
  
  createWindow();

  // Esperar a que la ventana principal esté lista para mostrarse
  win.once('ready-to-show', () => {
    setTimeout(() => {
      if (splashWin && !splashWin.isDestroyed()) {
        splashWin.close();
      }
      win.show();
    }, 800); // Pequeño buffer para una transición suave
  });
}

app.whenReady().then(initializeApp)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// Asegurar cierre limpio de recursos
app.on('will-quit', () => {
  closeDB();
});

app.on('quit', () => {
  process.exit(0);
});
