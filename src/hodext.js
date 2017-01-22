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

  Controller.on(EVENT_SAVEITEM, (item) => {
    debug('Save item', item)
    Storage.store(item)
  })

  createHodextWindow()

  debug('APP is ready.')

});
