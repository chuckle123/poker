import React, { Component } from 'react'
import copy from 'copy-to-clipboard'

export default class GameInviteMessage extends Component {
  constructor () {
    super(...arguments)

    this.state = {
      message: window.location.href
    }
  }

  onClick = () => {
    copy(window.location.href)

    this.setState({ message: 'Link copied to your clipboard!' })

    this.lastInterval = setTimeout(() => {
      this.setState({ message: window.location.href })
    }, 2000)
  }

  componentWillUnmount () {
    clearTimeout(this.lastInterval)
  }

  render () {
    return (
      <div className='table-warning-ctn waiting-players-ctn'>
        <p>
          <strong>Waiting Players.</strong> Click below to copy the link and send to your friends.
        </p>

        <input
          type='text'
          onClick={this.onClick}
          readOnly
          value={this.state.message} />
      </div>
    )
  }
}
