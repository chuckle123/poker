import React, { Component } from 'react'
import ConfigMenu from './configMenu'
import ConfigPlayerRow from './configPlayerRow'

export default class ConfigPlayers extends Component {
  render () {
    return (
      <div className='main-container'>
        <ConfigMenu
          active='players'
          showAdminMenus={this.props.currentPlayer.isOwner}
          openScreen={this.props.openScreen} />

        <div className='config-content'>
          {this.renderPlayers()}
        </div>
      </div>
    )
  }

  renderPlayers () {
    const { game } = this.props

    return (
      Object.values(game.players).map(player =>
        <ConfigPlayerRow
          key={player.id}
          player={player}
          openScreen={this.props.openScreen}
          currentPlayer={this.props.currentPlayer}
          game={game} />
      )
    )
  }
}
