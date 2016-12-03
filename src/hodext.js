import _debug from 'debug'
const debug = _debug('hodext')

import { app } from 'electron'
import { HodextController } from './hodextcontroller'

const Controller = new HodextController({
  watchImages: false,
  repeatEvery: 250
})

app.dock.hide();

app.on('ready', () => {

  Controller.on('SaveItem', (item) => {
    debug('Save item', item)
  })

  debug('APP is ready.')

});
