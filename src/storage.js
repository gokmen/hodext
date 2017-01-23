const debug = require('debug')('hodext:storage')

import { EventEmitter } from 'events'
import fs from 'fs'

import { STORAGE_FILE, NEWLINE } from './constants'

export class HodextStorage extends EventEmitter {

  constructor ( options = {} ) {

    super()

    this.options = options
    this.buffer  = []
    this.locked  = false

    this.load()

  }


  store (data) {

    this.buffer.push(data)
    this.save()

  }

  save () {

    if (this.locked)
      return

    this.locked = true

    let item = this.buffer.pop()
    let json = JSON.stringify(item) + NEWLINE

    debug('storing', json)

    fs.appendFile(STORAGE_FILE, json, (err) => {
      if (err) throw err
      this.locked = false
      if (this.buffer.length) this.save()
    })

  }


  load () {

    debug('loading storage...')

    try {
      fs.accessSync(STORAGE_FILE, fs.constants.R_OK | fs.constants.W_OK)
    } catch (e) {
      fs.writeFileSync(STORAGE_FILE, '')
      debug('created a new storage.')
    }

    this.storage = fs.readFileSync(STORAGE_FILE)
      .toString()
      .split(NEWLINE)
      .filter(Boolean)
      .map(JSON.parse)

    debug('storage loaded...')

    return this.storage

  }

  getStorage () { return this.storage }

}