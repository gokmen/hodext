import _debug from 'debug'
const debug = _debug('hodext:controller')

import { clipboard } from 'electron'
import { EventEmitter } from 'events'
import { getFrontApp } from './macutils'

export class HodextController extends EventEmitter {

  constructor ( options = {} ) {

    options.repeatEvery = options.repeatEvery || 400

    super()

    this.options = options
    this.current = clipboard.readText()

    debug('Loaded and watching for changes every', options.repeatEvery, 'miliseconds')

    this.watchClipboard()

  }

  tick () {

    let content = clipboard.readText()
    if (content.trim() == '') return

    if (this.current !== content) {
      debug('New item found!')
      var app = getFrontApp()
      this.current = content
      if (this.checkSafety(app)) {
        this.emit('SaveItem', { content, app })
      } else {
        debug('Dropped unsafe item')
      }
    }

  }

  watchClipboard () {
    this.timer = setInterval(() =>
      this.tick()
    , this.options.repeatEvery)
  }

  setClipboard (content) {
    clipboard.writeText(content)
    this.tick()
  }

  checkSafety () {
    return !clipboard.has('org.nspasteboard.ConcealedType') ||
           !clipboard.has('com.agilebits.onepassword')
  }

}