import React, { Component } from 'react'

export default class ClubSignal extends Component {
  render () {
    return (
      <div className='external-club-infos-ctn'>
        <div className='club-infos column'>
          <p className='club-name'>
            {this.props.currentPlayer.clubName}
          </p>
        </div>

        <div className='user-infos column'>
          <p className='username'>
            {this.props.currentPlayer.name}
          </p>

          <a href='/external-clubs-logout' className='logout-button'>
            Logout
          </a>
        </div>
      </div>
    )
  }
}
