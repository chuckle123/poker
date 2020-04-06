import React, { Component } from 'react'

function filterPendingPlayers (players) {
  return players.filter(player => player.status === 'requestedGameIngress')
}

export default class TableConfigButton extends Component {
  shouldComponentUpdate (nextProps) {
    return (
      filterPendingPlayers(this.props.players).length !==
      filterPendingPlayers(nextProps.players).length
    )
  }

  render () {
    return (
      <React.Fragment>
        {this.renderWarning()}

        <button
          key='button-options'
          onClick={this.props.openOptions}
          type='button'
          className='top-buttons-button options'>
          Options
        </button>
      </React.Fragment>
    )
  }

  renderWarning () {
    if (!this.props.showPendingCount) { return }

    let pendingPlayersCount = filterPendingPlayers(this.props.players).length

    if (pendingPlayersCount) {
      return (
        <p className='options-ctn-bubble'>
          {pendingPlayersCount}
        </p>
      )
    }
  }
}
