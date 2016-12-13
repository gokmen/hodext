import { clipboard, ipcRenderer } from 'electron'
import { EventEmitter } from 'events'

import {
  ITEM_HEIGHT,
  MAX_CHAR_COUNT,
  SCROLL_THRESHOLD,
  MAX_ITEM_COUNT,
} from '../constants'

import { HodextStorage } from '../storage'
const Storage = new HodextStorage()

ipcRenderer.on('USE_DARK_THEME', (event, dark) => {
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

    this.items = []
    this.options = options
    this.selectedItem = 0

    this.loadStoredItems()

  }

  loadStoredItems () {

    let loadedItems = Storage.load()

    loadedItems.forEach ( (item, index) => {
      if (index <= MAX_ITEM_COUNT)
        this.items.unshift({
          key     : index,
          visible : true,
          app     : item.app.name,
          content : item.content
        })
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

  }

  activate (direction = 1) {

    if (direction < 0 && this.selectedItem == 0)
      this.selectedItem = this.visibleCount - 1
    else if (direction > 0 && this.selectedItem == this.visibleCount - 1)
      this.selectedItem = 0
    else
      this.selectedItem = this.selectedItem + direction

    this.dataChanged({ updateScrolls: true })

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
      ipcRenderer.send('FIRE_PASTE')
      ipcRenderer.send('HIDE_HODEXT')
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

  removeItem (index, emitChange = true) {

    let item = this.items[index]

    this.items.splice(index, 1)


    this.visibleCount--

    if (this.selectedItem > 0)
      this.selectedItem--
    else
      this.selectedItem = 0

    if (emitChange)
      this.dataChanged({ updateScrolls: true })

    return item.content

  }

  updateScrolls () {

    let diff = this.selectedItem - SCROLL_THRESHOLD
    let itemContainer = document.getElementById('hodext-items')
    itemContainer.scrollTop = ITEM_HEIGHT * diff

  }

  dataChanged (options = {}) {

    let { updateScrolls } = options

    let activeItem = this.getActiveItem()

    if (updateScrolls)
      this.updateScrolls()

    this.emit('ClipboardChanged')

  }

}

let Controller

export function getViewController () {
  return Controller = Controller || new HodextViewController()
}
