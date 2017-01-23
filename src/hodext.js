const debug = require('debug')('hodext')

import { app } from 'electron'
import { HodextController } from './controller'
import { HodextStorage } from './storage'
import { createHodextWindow } from './window'

import { EVENT_SAVEITEM } from './constants'

const Controller = new HodextController({
  watchImages: false,
  repeatEvery: 250
})

const Storage = new HodextStorage()

app.on('ready', () => {

  let hodextWindow = createHodextWindow()

  Controller.on(EVENT_SAVEITEM, (item) => {
    debug('Save item', item)
    hodextWindow.webContents.send(EVENT_SAVEITEM, item)
    Storage.store(item)
  })

  debug('APP is ready.')

});
