const debug = require('debug')('hodext:storage')

import { EventEmitter } from 'events'
import fs from 'fs'
import path from 'path'

import { STORAGE_FILE, NEWLINE, EVENT_LOADED, INITIAL_DATA } from './constants'

export class HodextStorage extends EventEmitter {
  constructor(options = {}) {
    super()

    this.options = options

    this.writeBuffer = new Array()
    this.deleteBuffer = new Set()

    this.locked = false
  }

  write(data) {
    this.storage.push(data)
    this.writeBuffer.push(data)
    this.sync()
  }

  delete(key) {
    this.deleteBuffer.add(key)
    this.sync()
  }

  sync() {
    if (this.locked) {
      debug('file locked trying again in 500ms')
      return setTimeout(this.sync, 500)
    }

    this.locked = true

    if (this.deleteBuffer.size) {
      this.storage = this.storage.filter(
        item => !this.deleteBuffer.has(item.time)
      )

      debug('storage now:', this.storage)
      this.deleteBuffer.clear()

      this.syncStorage(() => (this.locked = false))
    } else if (this.writeBuffer.length) {
      let json = this.jsonify(this.writeBuffer.pop())

      debug('storing', json)

      fs.appendFile(this.storagePath, json, err => {
        this.locked = false
        if (this.writeBuffer.length) this.sync()
      })
    } else {
      this.locked = false
    }
  }

  getStorage(force = false) {
    debug('loading storage...')

    if (this.storage && !force) {
      debug('storage already loaded skipping')
      return this.storage
    }

    this.storage = this.dumpStorage()
    debug('storage loaded with', this.storage.length, 'items')

    if (this.storage.length == 0) {
      this.addHelpData()
    }

    this.emit(EVENT_LOADED, this.storage)

    return this.storage
  }

  jsonify(item) {
    return item.time.toString() + '-' + JSON.stringify(item) + NEWLINE
  }

  dumpStorage() {
    try {
      fs.accessSync(this.storagePath, fs.constants.R_OK | fs.constants.W_OK)
    } catch (e) {
      fs.writeFileSync(this.storagePath, '')
      debug('created a new storage.')
    }

    return fs
      .readFileSync(this.storagePath)
      .toString()
      .split(NEWLINE)
      .filter(Boolean)
      .map(line => {
        return JSON.parse(line.slice(14))
      })
  }

  syncStorage(cb) {
    let json = this.storage.map(this.jsonify)
    fs.writeFile(this.storagePath, json.join(''), cb)
  }

  addHelpData() {
    let app = { name: 'Hodext' }
    let type = 'text'
    let time = Date.now()

    INITIAL_DATA.reverse().forEach(content => {
      this.storage.push({
        content,
        app,
        time,
        type,
      })
      time += 1
    })
  }

  get storagePath() {
    return path.join(this.options.appData, STORAGE_FILE)
  }
}
