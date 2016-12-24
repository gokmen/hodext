const debug = _debug('hodext:searchinput')

import React from 'react'
import { ipcRenderer } from 'electron'
import { getViewController } from './viewcontroller'

let Controller = getViewController()

export class HodextSearchInput extends React.Component {

  constructor (props, context) {
    super(props, context)
    debug('created')
  }

  componentDidMount () { debug('on screen now') }

  render() {
    return (
      <input
        id='search-input'
        type='text'
        name='search'
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
      />
    )
  }

  _onKeyDown (event) {
    if (event.keyCode == 40 || (event.keyCode == 74 && event.ctrlKey )) {
      Controller.activate(1)
    } else if (event.keyCode == 38 || (event.keyCode == 75 && event.ctrlKey )) {
      Controller.activate(-1)
    } else if (event.keyCode == 13) {
      Controller.useActive(!event.ctrlKey)
    } else if (event.keyCode == 8 && event.ctrlKey ) {
      Controller.removeActive()
    } else if (event.keyCode == 27) {
      ipcRenderer.send('HIDE_HODEXT')
    }
  }

  _onChange (event) {
    Controller.filter(event.target.value)
  }

}
