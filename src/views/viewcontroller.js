const debug = _debug('hodext:viewcontroller')

import Fuse from 'fuse.js'
import { clipboard, ipcRenderer } from 'electron'
import { EventEmitter } from 'events'
import { focus } from './helpers'

import {
  ITEM_HEIGHT,
  MAX_CHAR_COUNT,
  SCROLL_THRESHOLD,
  MAX_ITEM_COUNT,
  ACTION_LOAD,
  EVENT_HIDE,
  EVENT_PASTE,
  EVENT_LOADED,
  EVENT_WRITE_ITEM,
  EVENT_DELETE_ITEM,
  EVENT_USE_DARK,
  EVENT_CLIPBOARD_CHANGED,
} from '../constants'

class HodextViewController extends EventEmitter {
  constructor(options = {}) {
    super()

    this.items = []
    this.options = options
    this.selectedItem = 0
    this.visibleCount = 0

    this.fuseOptions = {
      tokenize: true,
      threshold: 0.2,
      location: 0,
      distance: 100,
      shouldSort: true,
      matchAllTokens: true,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['content', 'app'],
    }

    this.updateFuseIndex()

    ipcRenderer.on(EVENT_USE_DARK, (event, dark) => {
      if (dark) {
        document.body.classList.remove('white')
      } else {
        document.body.classList.add('white')
      }
    })

    ipcRenderer.on(EVENT_LOADED, (event, items) => {
      this.loadStoredItems(items)
    })

    ipcRenderer.send(ACTION_LOAD)

    ipcRenderer.on(EVENT_WRITE_ITEM, (event, data) => {
      debug('adding new item to view', data)
      this.addItem(data)
      this.dataChanged()
    })

    debug('ViewController created')
  }

  loadStoredItems(items) {
    this.items = []
    this.selectedItem = 0

    items.forEach((item, index) => {
      if (index <= MAX_ITEM_COUNT) this.addItem(item, true)
    })

    this.updateFuseIndex()

    this.visibleCount = this.items.length
    this.dataChanged()
  }

  checkItemLimits() {
    if (this.visibleCount > MAX_ITEM_COUNT)
      this.removeItem(this.visibleCount - 1, false)
  }

  filter(pattern) {
    if (pattern == '') {
      this.visibleCount = this.items.length

      for (let item of this.items) {
        item.visible = true
      }
    } else {
      let found = this.fuse.search(pattern)

      debug('found:', found)
      this.visibleCount = found.length

      for (let item of this.items) {
        item.visible = !!found.find(i => i.key == item.key)
      }
    }

    this.selectedItem = 0
    this.dataChanged({ updateScrolls: false })
  }

  activate(direction = 1) {
    if (direction < 0 && this.selectedItem == 0)
      this.selectedItem = this.visibleCount - 1
    else if (direction > 0 && this.selectedItem == this.visibleCount - 1)
      this.selectedItem = 0
    else this.selectedItem = this.selectedItem + direction

    this.dataChanged()
  }

  activateByKey(key) {
    if (!key) return

    const visibleItems = this.items.filter(item => item.visible)
    const index = visibleItems.findIndex(item => item.key == key)

    if (index >= 0) {
      this.selectedItem = index
      this.dataChanged({ updateScrolls: false })
    }

    focus()
  }

  useByKey(key) {
    this.activateByKey(key)
    this.useActive()
  }

  setClipboard(newContent, paste) {
    this.selectedItem = 0
    this.current = null

    clipboard.writeText(newContent)

    if (paste) {
      ipcRenderer.send(EVENT_HIDE)
      ipcRenderer.send(EVENT_PASTE)
    }
  }

  useActive(paste = true) {
    this.setClipboard(this.removeActive(true), paste)
  }

  getActiveItem() {
    return this.items[this.getActiveItemIndex()]
  }

  getActiveItemIndex(key) {
    let index = 0
    let itemIndex = 0

    for (let item of this.items) {
      if (item.visible) {
        if (key) {
          if (key == item.key) return itemIndex
        } else if (index == this.selectedItem) {
          return itemIndex
        }
        index++
      }
      itemIndex++
    }
  }

  removeActive(asActive) {
    if (this.visibleCount > 0)
      return this.removeItem(this.getActiveItemIndex(), true, asActive)
  }

  addItem(item, initial = false) {
    this.visibleCount++
    this.items.unshift({
      key: item.time,
      visible: true,
      app: item.app.name,
      content: item.content,
      shortcut: '',
    })
    if (!initial) this.updateFuseIndex()
  }

  removeItem(index, emitChange = true, asActive = false) {
    let item = this.items[index]

    debug('current items:', this.items)
    debug('item to remove:', index, item)

    ipcRenderer.send(EVENT_DELETE_ITEM, item, asActive)

    this.items.splice(index, 1)
    this.updateFuseIndex()

    this.visibleCount--

    if (this.selectedItem > 0) this.selectedItem--
    else this.selectedItem = 0

    if (emitChange) this.dataChanged()

    return item.content
  }

  updateScrolls() {
    let diff = this.selectedItem - SCROLL_THRESHOLD
    let itemContainer = document.getElementById('hodext-items')
    if (itemContainer) itemContainer.scrollTop = ITEM_HEIGHT * diff
  }

  dataChanged(options = {}) {
    let { updateScrolls = true } = options

    if (updateScrolls) this.updateScrolls()

    this.items.filter(item => item.visible).forEach((item, i) => {
      if (i < 9) item.shortcut = `⌘ ${i + 1}`
      else item.shortcut = ''
    })

    this.emit(EVENT_CLIPBOARD_CHANGED)
  }

  updateFuseIndex() {
    this.fuse = new Fuse(this.items, this.fuseOptions)
  }
}

export default new HodextViewController()
