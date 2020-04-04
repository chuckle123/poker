import React, { Component } from 'react'
import OnTablePlayerTimer from './onTablePlayerTimer'
import { deepEqual as equals } from 'fast-equals'
import TablePlayerHand from './tablePlayerHand'
import { FOLD_AUDIO, CHECK_AUDIO, CHIPS_AUDIO } from '../../audio.js'

function renderCards (gameStatus, player) {
  if (gameStatus === 'waiting') { return false }

  return (player.status === 'inGame')
}

export default class TablePlayer extends Component {
  state = { showingPlayerMenu: false }

  shouldComponentUpdate (nextProps, nextState) {
    return !equals(this.props.data, nextProps.data) || !equals(this.state, nextState)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.onClickOutside, false)
  }

  togglePlayerMenu = () => {
    if (this.props.data.player.isCurrentPlayer) { return }

    this.setState({ showingPlayerMenu: !this.state.showingPlayerMenu }, () => {
      if (this.state.showingPlayerMenu) {
        document.addEventListener('click', this.onClickOutside, false)
      }
    })
  }

  onClickOutside = (e) => {
    if (!this.container.contains(e.target)) {
      this.setState({ showingPlayerMenu: false })
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.data.player.isCurrentPlayer && this.props.data.bigBlindCheck) {
      CHECK_AUDIO.play()
    }

    if (prevProps.data.player.currentBet !== 'check' &&
        this.props.data.player.currentBet === 'check') {
      CHECK_AUDIO.play()
    }

    if (prevProps.data.player.gameStatus !== 'fold' &&
        this.props.data.player.gameStatus === 'fold') {
      FOLD_AUDIO.play()
    }

    if (!['check', undefined].includes(this.props.data.player.currentBet) &&
        this.props.data.player.currentBet !== prevProps.data.player.currentBet) {
      CHIPS_AUDIO.play()
    }
  }

  renderBet () {
    if (!this.props.data.player.currentBet) { return }

    return <p className='table-player-bet-value'>{this.props.data.player.currentBet}</p>
  }

  renderStatusIcon () {
    const { gameStatus, player } = this.props.data

    if (renderCards(gameStatus, player)) { return false }

    let message
    let className = ''

    if (gameStatus === 'waiting') {
      message = 'Waiting'
      className = 'waiting'
    }

    if (player.status === 'standingUp') {
      message = 'Standing Up'
      className = 'standing-up'
    }

    if (player.status === 'waitingNextGameToEnter') {
      message = 'In Next Hand'
      className = 'waiting-next-hand'
    }

    if (player.status === 'quiting') {
      message = 'Quitting'
      className = 'quitting'
    }

    if (player.disconnectedSince) {
      message += ' (Offline)'
    }

    return <p className={`table-player-status-icon ${className}`}>{message}</p>
  }

  renderCards () {
    const { tableCards, gameStatus, player } = this.props.data

    if (!renderCards(gameStatus, player)) { return false }

    let message
    let isBlackWhite = false

    if (player.gameStatus === 'fold') {
      isBlackWhite = true
      message = 'Fold'
    }

    if (player.disconnectedSince) {
      message = 'Offline'
    }

    return (
      <TablePlayerHand
        data={{
          isWinner: (player.gameResult && player.gameResult.position === 1),
          playerID: player.id,
          blackWhite: isBlackWhite,
          message,
          tableCards,
          cards: player.cards
        }} />
    )
  }

  renderDealerButton () {
    if (!this.props.data.player.isDealer) { return }

    return <div className='signal'><p className='dealer-button'>Dealer</p></div>
  }

  renderOwnerButton = () => {
    if (this.props.data.player.isOwner) {
      return <div className='signal'><abbr title='The room owner'><p className='owner-signal'>Owner</p></abbr></div>
    }
  }

  renderWinCount () {
    if (this.props.data.player.winCount) {
      return (
        <div className='win-count signal numbers-signal'>
          {this.props.data.player.winCount}
        </div>
      )
    }
  }

  renderTournamentRank () {
    if (this.props.data.player.rankPosition) {
      return (
        <div className='rank-level signal numbers-signal'>
          <abbr title='Player SNG tournament rank position'>
            {this.props.data.player.rankPosition}
          </abbr>
        </div>
      )
    }
  }

  renderQuitCount () {
    if (this.props.data.player.quitCount) {
      return (
        <div className='rebuy-count signal numbers-signal'>
          <abbr title='How many times this player left this table.'>{this.props.data.player.quitCount}</abbr>
        </div>
      )
    }
  }

  renderChatMessage () {
    if (!this.props.data.showingMessage) { return }

    return (
      <div className='table-player-chat-message'>
        {this.props.data.showingMessage.content}
      </div>
    )
  }

  renderMutedSignal () {
    if (!this.props.data.player.isMuted) { return }

    return (
      <div className='muted-signal signal numbers-signal' />
    )
  }

  renderPlayerMenu () {
    if (!this.state.showingPlayerMenu) { return }

    return (
      <div className='popover-1 request-ingress-popover'>
        <button
          onClick={this.props.toogleMute}
          className='button-1 small-button red'
          style={{ width: '100%' }}>
          {this.props.data.player.isMuted ? 'Unmute' : 'Mute'}
        </button>
      </div>
    )
  }

  render () {
    const { player } = this.props.data

    let className = `table-player table-player-${player.position}`

    if (player.disconnectedSince) {
      className += ' offline'
    }

    return (
      <div
        ref={(el) => { this.container = el }}
        key={`on-table-${player.id}`}
        className={className}
        onClick={this.togglePlayerMenu}>
        {this.renderBet()}

        {this.renderCards()}

        {this.renderStatusIcon()}

        {this.renderChatMessage()}

        <div className='player-table-signals-container'>
          {this.renderDealerButton()}
          {this.renderWinCount()}
          {this.renderQuitCount()}
          {this.renderTournamentRank()}
        </div>

        {this.renderPlayerMenu()}

        <div className='player-table-signals-container bottom'>
          {this.renderMutedSignal()}
        </div>

        <div className={this.playerContainerClassName()}>
          <p className='table-player-name'>
            {player.name}
          </p>

          <p className='table-player-stack'>
            {this.renderStack()}
          </p>

          {this.renderOnTablePlayerTimer()}
        </div>
      </div>
    )
  }

  renderOnTablePlayerTimer () {
    if (!this.props.data.player.actionStartedAt || !this.props.data.scheduledNextActionAt) { return }

    return (
      <OnTablePlayerTimer
        decisionLimitTime={this.props.data.scheduledNextActionAt}
        referenceTime={new Date(this.props.data.player.actionStartedAt)} />
    )
  }

  playerContainerClassName () {
    const { player } = this.props.data

    let className = 'table-player-infos-ctn'

    if (player.isCurrentPlayer) {
      className += ' you-player '
    }

    if (player.status === 'inGame') {
      if (player.turnSituation === 'deciding') {
        className += ' decision-current '
      }

      if (player.gameStatus === 'fold') {
        className += ' fold '
      }
    }

    if (player.gameResult && player.gameResult.position === 1) {
      className += ' winner '
    }

    return className
  }

  renderStack () {
    const { player } = this.props.data

    let stack = (player.stack - (player.currentBet !== 'check' ? (player.currentBet || 0) : 0))

    if (player.gameResult && player.gameResult.gained) {
      stack = <span>{(stack - player.gameResult.gained)} + <span className='table-player-stack-prize'>{player.gameResult.gained}</span></span>
    }

    return stack
  }
}
