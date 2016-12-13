import React from 'react'
import ReactDOM from 'react-dom'
import HodextView from '../src/views/view.jsx'

window.onload = () =>
  ReactDOM.render(<HodextView />, document.getElementById('hodext'))

window.addEventListener('focus', () =>
  document.getElementById('search-input').focus()
)
