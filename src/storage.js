const debug = require('debug')('hodext:storage')

import { EventEmitter } from 'events'
import fs from 'fs'

const StorageFile = 'clipboard.json'

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
    let json = JSON.stringify(item) + '\n'

    debug('storing', json)

    fs.appendFile(StorageFile, json, (err) => {
      if (err) throw err
      this.locked = false
      if (this.buffer.length) this.save()
    })

  }


  load () {

    debug('loading storage...')

    this.storage = fs.readFileSync(StorageFile)
      .toString()
      .split('\n')
      .filter(Boolean)
      .map(JSON.parse)

    debug('storage loaded...')

    return this.storage

  }

  getStorage () { return this.storage }

}