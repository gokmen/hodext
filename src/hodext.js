import _debug from 'debug'
const debug = _debug('hodext')

import { app } from 'electron'
import { HodextController } from './hodextcontroller'

const Controller = new HodextController()

app.dock.hide();

app.on('ready', () => {

  Controller.on('SaveItem', (item) => {
    debug('Save item', item.content, 'from app', item.app.name)
  })

  debug('APP is ready.')

});
