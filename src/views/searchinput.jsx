const debug = _debug('hodext:searchinput')

import React from 'react'
import { ipcRenderer } from 'electron'
import Controller from './viewcontroller'
import { EVENT_HIDE } from '../constants'

export class HodextSearchInput extends React.Component {
  render() {
    return (
      <input
        id="search-input"
        type="text"
        name="search"
        placeholder="type to filter hodext..."
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
      />
    )
  }

  _onKeyDown(event) {
    if (event.keyCode == 40 || (event.keyCode == 74 && event.ctrlKey)) {
      Controller.activate(1)
    } else if (event.keyCode == 38 || (event.keyCode == 75 && event.ctrlKey)) {
      Controller.activate(-1)
    } else if (event.keyCode == 13) {
      Controller.useActive(!event.ctrlKey)
    } else if (event.keyCode == 8 && event.ctrlKey) {
      Controller.removeActive()
    } else if (event.keyCode == 27 || (event.keyCode == 67 && event.ctrlKey)) {
      ipcRenderer.send(EVENT_HIDE)
    } else if (event.keyCode == 9) {
      event.preventDefault()
    }
  }

  _onChange(event) {
    Controller.filter(event.target.value)
  }
}
