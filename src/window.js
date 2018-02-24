const debug = require('debug')('hodext:window')

import {
  app,
  systemPreferences,
  globalShortcut,
  BrowserWindow,
  ipcMain,
} from 'electron'

import path from 'path'
import { firePaste } from './macutils'
import { EVENT_HIDE, EVENT_PASTE, EVENT_USE_DARK } from './constants'

let hodextQuit = false
let hodextWindow = null

function hideHodext() {
  hodextWindow.blurWebView()
  hodextWindow.blur()
  app.hide()
}

function showHodext() {
  app.show()
  hodextWindow.focus()
  hodextWindow.focusOnWebView()
}

if (app.makeSingleInstance(() => showHodext())) {
  process.exit()
}

function setHodextTheme() {
  hodextWindow.webContents.send(EVENT_USE_DARK, systemPreferences.isDarkMode())
}

app.setName('Hodext')
app.dock.hide()

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit()
  }
})

app.on('ready', () => {
  globalShortcut.register('Alt+Space', () => {
    if (hodextWindow.isFocused() && hodextWindow.isVisible()) {
      hideHodext()
    } else {
      showHodext()
    }
  })
})

app.on('will-quit', () => globalShortcut.unregisterAll())
app.on('before-quit', () => (hodextQuit = true))

ipcMain.on(EVENT_HIDE, hideHodext)
ipcMain.on(EVENT_PASTE, firePaste)

systemPreferences.subscribeNotification(
  'AppleInterfaceThemeChangedNotification',
  (event, info) => setHodextTheme()
)

export function createHodextWindow() {
  const DEBUG = !!process.env.DEBUG
  const options = {
    frame: DEBUG,
    transparent: !DEBUG,
    resizable: false,
    minimizable: false,
    alwaysOnTop: true,
    width: 500,
    height: 372,
    show: false,
    scrollBounce: true,
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, '/../assets/script/preload.js'),
    },
  }

  hodextWindow = new BrowserWindow(options)

  options.parent = hodextWindow
  let splashScreen = new BrowserWindow(options)
  splashScreen.loadURL(
    path.join('file://', __dirname, '/../assets/splash.html')
  )
  splashScreen.on('closed', () => (splashScreen = null))
  splashScreen.webContents.on('did-finish-load', () => {
    splashScreen.show()
  })

  hodextWindow.loadURL(path.join('file://', __dirname, '/../assets/index.html'))

  debug('HodextWindow created!')

  hodextWindow.setVisibleOnAllWorkspaces(true)

  hodextWindow.on('close', event => {
    if (!hodextQuit) {
      event.preventDefault()
      hideHodext()
      return false
    } else {
      return true
    }
  })

  if (!DEBUG) {
    hodextWindow.on('blur', () => {
      app.hide()
    })

    hodextWindow.on('closed', () => {
      hodextWindow = null
    })
  } else {
    hodextWindow.webContents.openDevTools()
  }

  hodextWindow.webContents.once('dom-ready', setHodextTheme)

  hodextWindow.once('ready-to-show', () => {
    debug('HodextWindow is ready to show!')
    splashScreen.close()
    hodextWindow.show()
  })

  debug('HodextWindow on screen now')

  return hodextWindow
}
