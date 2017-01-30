const debug = require('debug')('hodext')

import { app, ipcMain } from 'electron'
import { HodextController } from './controller'
import { HodextStorage } from './storage'
import { createHodextWindow } from './window'

import {
  ACTION_LOAD,
  EVENT_LOADED,
  EVENT_WRITE_ITEM,
  EVENT_DELETE_ITEM
} from './constants'

const Controller = new HodextController({
  watchImages: false,
  repeatEvery: 250
})

const Storage = new HodextStorage()

app.on('ready', () => {

  let hodextWindow = createHodextWindow()
    
  Controller.on(EVENT_WRITE_ITEM, (item) => {
    
    debug('Write item', item)
    hodextWindow.webContents.send(EVENT_WRITE_ITEM, item)
    Storage.write(item)

  })

  ipcMain.on(ACTION_LOAD, () => {
    hodextWindow.webContents.send(EVENT_LOADED, Storage.getStorage())
  })

  debug('APP is ready.')

  if (process.argv.includes('--quit')) {
    debug('will quit once window is ready.')
    hodextWindow.on('show', app.quit)
  }

});
