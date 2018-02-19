const debug = require('debug')('hodext:window')

import {
  app,
  systemPreferences,
  globalShortcut,
  BrowserWindow,
  ipcMain,
} from 'electron'

import { firePaste } from './macutils'
import { EVENT_HIDE, EVENT_PASTE, EVENT_USE_DARK } from './constants'

let hodextWindow = null

let hideHodext = () => {
  hodextWindow.blurWebView()
  hodextWindow.blur()
  app.hide()
}

let showHodext = () => {
  app.show()
  hodextWindow.focus()
  hodextWindow.focusOnWebView()
}

export function setHodextTheme() {
  hodextWindow.webContents.send(EVENT_USE_DARK, systemPreferences.isDarkMode())
}

if (app.makeSingleInstance(() => showHodext())) {
  process.exit()
}

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

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

ipcMain.on(EVENT_HIDE, hideHodext)
ipcMain.on(EVENT_PASTE, firePaste)

systemPreferences.subscribeNotification(
  'AppleInterfaceThemeChangedNotification',
  (event, info) => setHodextTheme()
)

export function createHodextWindow() {
  hodextWindow = new BrowserWindow({
    frame: false,
    transparent: true,
    resizable: false,
    width: 500,
    height: 372,
    show: false,
    scrollBounce: true,
    fullscreenable: false,
    webPreferences: {
      preload: __dirname + '/../assets/script/preload.js',
    },
  })

  hodextWindow.loadURL('file://' + __dirname + '/../assets/index.html')

  debug('HodextWindow created!')

  hodextWindow.setAlwaysOnTop(true)
  hodextWindow.setVisibleOnAllWorkspaces(true)

  if (!process.env.DEBUG) {
    hodextWindow.on('blur', () => {
      app.hide()
    })

    hodextWindow.on('closed', () => {
      hodextWindow = null
    })
  }

  hodextWindow.webContents.once('dom-ready', setHodextTheme)

  hodextWindow.once('ready-to-show', () => {
    debug('HodextWindow is ready to show!')
    hodextWindow.show()
  })

  debug('HodextWindow on screen now')

  return hodextWindow
}
