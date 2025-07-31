import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

async function createWindow(): Promise<void> {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        const debugIndexHtmlUri = `${process.env['ELECTRON_RENDERER_URL']}#`
        await mainWindow.loadURL(debugIndexHtmlUri)
    } else {
        const release_index_html_path = join(__dirname, '../renderer/index.html#')
        await mainWindow.loadFile(release_index_html_path)
    }
}

function onWindowCreationFailed(reason: unknown): void {
    const errorMessage = reason instanceof Error ? reason.message : String(reason)
    console.log(`Can't create window. Reason: ${errorMessage}`)
}

app.whenReady()
    .then(() => {
        electronApp.setAppUserModelId('com.electron')

        app.on('browser-window-created', (_, window) => {
            optimizer.watchWindowShortcuts(window)
        })

        ipcMain.on('ping', () => console.log('pong'))

        createWindow().catch(onWindowCreationFailed)

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow().catch(onWindowCreationFailed)
            }
        })
    })
    .catch((reason) => {
        const errorMessage = reason instanceof Error ? reason.message : String(reason)
        console.log(`Can't start app. Reason: ${errorMessage}`)
    })

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
