const debug = require('debug')('hodext')

import { app } from 'electron'
import { HodextController } from './controller'
import { HodextStorage } from './storage'
import { createHodextWindow } from './window'

import {
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

  debug('APP is ready.')

});
