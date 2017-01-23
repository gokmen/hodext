const debug = require('debug')('hodext:window')

import {
  app, systemPreferences, globalShortcut, BrowserWindow, ipcMain
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

let setHodextTheme = (dark = true) => {
  hodextWindow.webContents.send(EVENT_USE_DARK, dark)
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
  'AppleInterfaceThemeChangedNotification', (event, info) =>
    setHodextTheme(systemPreferences.isDarkMode())
)

export function createHodextWindow () {

  hodextWindow = new BrowserWindow({
    frame: false, transparent: true, resizable: false,
    width: 500, height: 372, show: false,
    scrollBounce: true, fullscreenable: false
  })

  hodextWindow.loadURL('file://' + __dirname + '/../assets/index.html')

  debug('HodextWindow created!')

  hodextWindow.setAlwaysOnTop(true)
  hodextWindow.setVisibleOnAllWorkspaces(true)

  setHodextTheme(systemPreferences.isDarkMode())

  if (!process.env.DEBUG) {

    hodextWindow.on('blur', () => {
      app.hide()
    })

    hodextWindow.on('closed', () => {
      hodextWindow = null
    })
    
  }

  hodextWindow.once('ready-to-show', () => {
    debug('HodextWindow is ready to show!')
    hodextWindow.show()
  })

  debug('HodextWindow on screen now')

  return hodextWindow

}
