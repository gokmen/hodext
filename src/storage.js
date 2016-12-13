import _debug from 'debug'
const debug = _debug('hodext:storage')

import { EventEmitter } from 'events'
import fs from 'fs'

const StorageFile = 'clipboard.json'

export class HodextStorage extends EventEmitter {

  constructor ( options = {} ) {

    super()

    this.options = options
    this.storage = []
    this.locked  = false

  }


  store (data) {

    this.storage.push(data)
    this.save()

  }

  save () {

    if (this.locked)
      return

    this.locked = true

    let item = this.storage.pop()
    let json = JSON.stringify(item) + "\n"

    debug('storing', json)

    fs.appendFile(StorageFile, json, (err) => {
      if (err) throw err
      this.locked = false
      if (this.storage.length) this.save()
    })

  }


  load () {

    return fs.readFileSync(StorageFile)
      .toString()
      .split('\n')
      .filter(Boolean)
      .map(JSON.parse)

  }

}