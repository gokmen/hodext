const debug = _debug('hodext:viewcontroller')
const Fuse = require('fuse.js')

import { clipboard, ipcRenderer } from 'electron'
import { EventEmitter } from 'events'

import {
  ITEM_HEIGHT,
  MAX_CHAR_COUNT,
  SCROLL_THRESHOLD,
  MAX_ITEM_COUNT,
  EVENT_HIDE,
  EVENT_PASTE,
  EVENT_SAVEITEM,
  EVENT_USE_DARK,
  EVENT_CLIPBOARD_CHANGED,
} from '../constants'

import { HodextStorage } from '../storage'
const Storage = new HodextStorage()

ipcRenderer.on(EVENT_USE_DARK, (event, dark) => {
  if (dark) {
    document.body.classList.remove('white')
  } else {
    document.body.classList.add('white')
  }
})

export function focus () {
  document.getElementById('search-input').focus()
}

export class HodextViewController extends EventEmitter {

  constructor ( options = {} ) {

    super()

    this.options = options
    this.loadStoredItems()

    ipcRenderer.on(EVENT_SAVEITEM, (event, data) => {
      debug('adding new item to view', data)
      this.addItem(data)
      this.dataChanged()
    })

    debug('ViewController created')

  }

  loadStoredItems () {

    this.items = []
    this.selectedItem = 0

    Storage.getStorage().forEach ( (item, index) => {
      if (index <= MAX_ITEM_COUNT)
        this.addItem(item)
    })

    this.visibleCount = this.items.length

  }

  checkItemLimits () {

    if (this.visibleCount > MAX_ITEM_COUNT)
      this.removeItem(this.visibleCount - 1, false)

  }

  filter (pattern) {

    let re = new RegExp(pattern,"im")
    let isVisible = true
    this.visibleCount = 0

    for (let item of this.items) {

      if (pattern != '')
        isVisible = re.test(item.content)

      item.visible = isVisible

      if (isVisible)
        this.visibleCount++

    }

    this.selectedItem = 0
    this.dataChanged({ updateScrolls: false })

    let options = {
      tokenize: true,
      threshold: 0.2,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['content', 'app']
    }

    debug(this.items)
    let fuse = new Fuse(this.items, options)
    debug(fuse.search(pattern))
  }

  activate (direction = 1) {

    if (direction < 0 && this.selectedItem == 0)
      this.selectedItem = this.visibleCount - 1
    else if (direction > 0 && this.selectedItem == this.visibleCount - 1)
      this.selectedItem = 0
    else
      this.selectedItem = this.selectedItem + direction

    this.dataChanged()

  }

  activateByKey (key) {

    if (!key) return

    let index = this.getActiveItemIndex(key)

    if (index >= 0) {
      this.selectedItem = index
      this.dataChanged({ updateScrolls: false })
    }

    focus()

  }

  useByKey (key) {
    this.activateByKey(key)
    this.useActive()
  }

  setClipboard (newContent, paste) {

    this.selectedItem = 0
    this.current = null

    clipboard.writeText(newContent)

    if (paste) {
      ipcRenderer.send(EVENT_PASTE)
      ipcRenderer.send(EVENT_HIDE)
    }

  }

  useActive (paste = true) {
    this.setClipboard(this.removeActive(), paste)
  }

  getActiveItem () {
    return this.items[this.getActiveItemIndex()]
  }

  getActiveItemIndex (key) {

    let index = 0
    let itemIndex = 0

    for (let item of this.items) {
      if (item.visible) {
        if (key) {
          if (key == item.key)
            return itemIndex
        } else if (index == this.selectedItem) {
          return itemIndex
        }
        index++
      }
      itemIndex++
    }

  }

  removeActive () {

    if (this.visibleCount > 0)
      return this.removeItem(this.getActiveItemIndex())

  }

  addItem (item) {
    this.items.unshift({
      key     : item.time,
      visible : true,
      app     : item.app.name,
      content : item.content
    })
  }

  removeItem (index, emitChange = true) {

    let item = this.items[index]

    this.items.splice(index, 1)

    this.visibleCount--

    if (this.selectedItem > 0)
      this.selectedItem--
    else
      this.selectedItem = 0

    if (emitChange)
      this.dataChanged()

    return item.content

  }

  updateScrolls () {

    let diff = this.selectedItem - SCROLL_THRESHOLD
    let itemContainer = document.getElementById('hodext-items')
    itemContainer.scrollTop = ITEM_HEIGHT * diff

  }

  dataChanged (options = {}) {

    let { updateScrolls = true } = options

    if (updateScrolls)
      this.updateScrolls()

    this.emit(EVENT_CLIPBOARD_CHANGED)

  }

}

let Controller

export function getViewController () {
  return Controller = Controller || new HodextViewController()
}
