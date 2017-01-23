const debug = require('debug')('hodext:controller')

import { clipboard } from 'electron'
import { EventEmitter } from 'events'
import { getFrontApp } from './macutils'

import { EVENT_WRITE_ITEM } from './constants'

export class HodextController extends EventEmitter {

  constructor ( options = {} ) {

    options.repeatEvery = options.repeatEvery || 250
    options.watchImages = options.watchImages || false

    super()

    this.options = options

    this.readText()
    if (options.watchImages)
      this.readImage()

    debug('Loaded and watching for changes every', options.repeatEvery, 'miliseconds')

    this.watchClipboard()

  }

  tickText () {

    let content = null

    if (content = this.checkTextChange()) {
      debug('New text found!')

      var app = getFrontApp()
      this.currentText = content

      if (this.checkSafety(app)) {
        var now = Date.now()
        this.emit(EVENT_WRITE_ITEM, { content, app, time: now, type: 'text' })
      } else {
        debug('Dropped unsafe item')
      }
    }

  }

  tickImage () {

    let content = null

    if (content = this.checkImageChange()) {
      debug('New image found!')

      var now = Date.now()
      var app = getFrontApp()

      this.emit(EVENT_WRITE_ITEM, { content, app, time: now, type: 'image' })

      this.readImage(content)
      // Update current text accordingly to ignore
      // copied image file name/path as text
      this.currentText = clipboard.readText()

    }

  }

  readImage (image) {
    this.currentImage = image || clipboard.readImage()
    this.currentImage._data = this.currentImage.toDataURL()
    return this.currentImage
  }

  readText () {
    this.currentText = clipboard.readText()
    return this.currentText
  }

  checkTextChange () {
    let text = clipboard.readText()
    if (text.trim() != '' && this.currentText !== text)
      return text
    return false
  }

  checkImageChange () {
    let img = clipboard.readImage()
    if (!img.isEmpty() && this.currentImage._data !== img.toDataURL())
      return img
    return false
  }

  watchClipboard () {

    this.textTimer = setInterval(() =>
      this.tickText()
    , this.options.repeatEvery)

    if (this.options.watchImages) {
      this.imageTimer = setInterval(() =>
        this.tickImage()
      , this.options.repeatEvery * 2)
    }

  }

  setClipboard (content) {
    clipboard.writeText(content)
    this.tick()
  }

  checkSafety (app) {
    return !clipboard.has('org.nspasteboard.ConcealedType') ||
           !clipboard.has('com.agilebits.onepassword')
  }

}