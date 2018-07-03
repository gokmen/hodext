const debug = _debug('hodext:item')

import React from 'react'
import Controller from './viewcontroller'
import moment from 'moment'

export class HodextItem extends React.Component {
  render() {
    let data = this.props.data
    let style = 'hodext-item'
    let boundClick = this.handleClick.bind(this)
    let boundDoubleClick = this.handleDoubleClick.bind(this)

    if (this.props.active) style += ' active'

    return (
      <div
        className={style}
        onClick={boundClick}
        onDoubleClick={boundDoubleClick}
      >
        <p>{data.content}</p>
        <div>
          <span>{data.app}</span>
          <span>{moment(data.key).fromNow()}</span>
        </div>
        <span>{data.shortcut}</span>
      </div>
    )
  }

  handleClick() {
    Controller.activateByKey(this.props.data.key)
  }

  handleDoubleClick() {
    Controller.useByKey(this.props.data.key)
  }
}
