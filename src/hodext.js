import _debug from 'debug'
const debug = _debug('hodext')

import { app } from 'electron'
import { HodextController } from './controller'
import { HodextStorage } from './storage'

const Controller = new HodextController({
  watchImages: false,
  repeatEvery: 250
})

const Storage = new HodextStorage()

app.dock.hide();

app.on('ready', () => {

  Controller.on('SaveItem', (item) => {
    debug('Save item', item)
    Storage.store(item)
  })

  debug('APP is ready.')

});
