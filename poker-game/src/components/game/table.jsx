import React, { Component } from 'react'
import { gamePlayerData } from './utils'
import TableCards from './tableCards'
import TablePlayer from './tablePlayer'
import GameInviteMessage from './gameInviteMessage'
import TableSpot from './tableSpot'

export default class Table extends Component {
  renderPausedGameWarning () {
    if (!this.props.game.isPaused) { return }

    return (
      <div className='table-warning-ctn waiting-players-ctn'>
        <p>
          <strong>The Poker Now system needed to be paused for an unexpected reason.<br />Please wait, your game will resume soon. Sorry for this inconvenience.<br />The timers will be reset when the system backs.</strong>
        </p>
      </div>
    )
  }

  render () {
    let seats

    let seatsIndex =
        this.props.game.seats.reduce((memo, seat) => ({ ...memo, [seat[0]]: seat[1] }), {})

    let seatsWithEmpty = []

    for (let i = 0; i < 10; i++) {
      if (seatsIndex[i + 1]) {
        seatsWithEmpty[i] = seatsIndex[i + 1]
      } else {
        seatsWithEmpty[i] = null
      }
    }

    seats = seatsWithEmpty

    let organizedSeats = seats

    if (seats.includes(this.props.currentPlayer.id)) {
      organizedSeats = [this.props.currentPlayer.id]

      let currentPlayerPositon = seats.indexOf(this.props.currentPlayer.id)

      organizedSeats = organizedSeats.concat(seats.slice((currentPlayerPositon + 1), seats.length))

      organizedSeats = organizedSeats.concat(seats.slice(0, currentPlayerPositon))
    }

    let currentPlayer = this.props.currentPlayer

    return (
      <div className='table'>
        {this.renderPausedGameWarning()}

        {this.renderInvite()}

        {this.renderTournamentStart()}

        <p className='table-pot-size'>
          {this.props.game.pot}
        </p>

        <TableCards
          gameResult={this.props.game.gameResult}
          cards={this.props.game.onTableCards} />

        {organizedSeats.reduce((memo, playerID, index) => {
          if (!playerID && (this.props.game.mode === 'tournament' || currentPlayer.status !== 'watching')) {
            return memo
          }

          if (!playerID && currentPlayer.status === 'watching') {
            return memo.concat(
              <TableSpot
                currentPlayer={currentPlayer}
                game={this.props.game}
                key={`spot-${index}`}
                position={index + 1} />
            )
          }

          let player = this.props.game.players[playerID]

          let isCurrentPlayer = player.id === currentPlayer.id

          let data = {
            player: {
              ...gamePlayerData(this.props.game, player.id),
              isCurrentPlayer,
              isMuted: this.props.currentPlayer.muted.includes(player.id),
              position: (index + 1)
            },
            scheduledNextActionAt: this.props.game.scheduledNextActionAt,
            showingMessage: this.props.showingMessages[playerID],
            decisionLimitTime: this.props.game.decisionLimitTime,
            bigBlindCheck: this.props.game.bigBlindCheck,
            tableCards: this.props.game.onTableCards,
            gameStatus: this.props.game.status
          }

          return memo.concat(
            <TablePlayer
              data={data}
              toogleMute={() => {
                this.props.submitAction({
                  type: 'TOGGLE_MUTE_PLAYER',
                  otherPlayerID: player.id
                })
              }}
              key={`on-table-player-${player.id}`} />
          )
        }, [])}
      </div>
    )
  }

  renderTournamentStart () {
    if (this.props.game.mode !== 'tournament' ||
        this.props.game.gameNumber > 0 ||
        this.props.game.status !== 'waiting') { return }

    let startingAt =
      new Date(this.props.game.startingAt)
        .toLocaleTimeString('en-US', {
          timeZone: 'UTC',
          timeZoneName: 'short',
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })

    return (
      <div className='table-warning-ctn'>
        <p>
          This tournament will start at {startingAt}
        </p>
      </div>
    )
  }

  renderInvite () {
    if (!this.props.showInvite) { return }
    return <GameInviteMessage />
  }
}
