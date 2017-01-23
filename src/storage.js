const debug = require('debug')('hodext:storage')

import { EventEmitter } from 'events'
import fs from 'fs'

import { STORAGE_FILE, NEWLINE } from './constants'

export class HodextStorage extends EventEmitter {

  constructor ( options = {} ) {

    super()

    this.options = options
    this.writeBuffer = []
    this.locked = false

    this.load()

  }


  write (data) {

    this.writeBuffer.push(data)
    this.sync()

  }



  sync () {

    if (this.locked) {
      debug('file locked trying again in 500ms')
      return setTimeout(this.sync, 500)
    }

    this.locked = true

    if (this.writeBuffer.length) {

      let item = this.writeBuffer.pop()
      let key  = item.time.toString()
      let json = key + '-' + JSON.stringify(item) + NEWLINE

      debug('storing', json)

      fs.appendFile(STORAGE_FILE, json, (err) => {
        this.locked = false
        if (this.writeBuffer.length)
          this.write()
      })



    } else {
      this.locked = false
    }

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
      .map((line) => { return JSON.parse(line.slice(14)) })
    debug('storage loaded with', this.storage.length, 'items')

    return this.storage

  }

  getStorage () { return this.storage }

}