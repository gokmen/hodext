const debug = _debug('hodext:main')

import React from 'react'
import ReactDOM from 'react-dom'
import HodextView from '../src/views/hodextview.jsx'

window.onload = function () {
  debug('Window loaded')
  ReactDOM.render(<HodextView />, document.getElementById('hodext'))
  debug('Initial render completed')
}

window.addEventListener('focus', () =>
  document.getElementById('search-input').focus()
)
