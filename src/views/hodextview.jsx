const debug = _debug('hodext:view')

import React from 'react'
import { focus, getViewController } from './viewcontroller'
import { HodextSearchInput } from './searchinput'
import { HodextItem } from './item'

const Controller = getViewController()

export default class HodextView extends React.Component {

  constructor (props, context) {
    super(props, context)
    this.state = { items: [] }

    debug('created')

  }


  componentDidMount () {

    debug('on screen now')

    this.setState({ items: Controller.items })

    Controller.on('ClipboardChanged', () => {
      this.setState({ items: Controller.items })
    })

    focus()

  }


  render() {

    let items = this.state.items
      .filter ( (item) => item.visible )
      .map ( (item, index) =>
        <HodextItem
          data={item}
          key={item.key}
          active={index == Controller.selectedItem}
        />
      )

    return (
      <div>
        <HodextSearchInput />
        <div id='hodext-items'>
          {items}
        </div>
      </div>
    )
  }

}
