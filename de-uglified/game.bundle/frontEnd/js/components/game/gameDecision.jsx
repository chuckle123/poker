import React, { Component } from 'react'
import BetRaiseControl from './betRaiseControl'
import { BEEP_AUDIO } from '../../audio.js'
import HotKey from 'react-shortcut'
import PropTypes from 'prop-types'
import dig from 'object-dig'

export default class GameDecision extends Component {
  static contextTypes = {
    showConfirmation: PropTypes.func,
    isMobile: PropTypes.bool
  }

  constructor () {
    super(...arguments)

    this.state = {
      screen: 'buttons'
    }
  }

  componentDidMount () {
    if (this.props.game.playerIDToTalk === this.props.currentPlayer.id) {
      BEEP_AUDIO.play()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.game.playerIDToTalk !== nextProps.game.playerIDToTalk &&
        nextProps.game.playerIDToTalk === this.props.currentPlayer.id) {
      if (this.props.currentPlayer.sound) {
        BEEP_AUDIO.play()
      }

      this.setState({ blockingUntil: ((new Date()).getTime() + 400) })

      this.interval = setInterval(this.unlock, 50)
    }
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  unlock = () => {
    let now = (new Date()).getTime()

    if (now > this.state.blockingUntil) {
      this.setState({ blockingUntil: null })
      clearInterval(this.interval)
    }
  }

  render () {
    return [
      this.renderActionButtons(),
      this.renderRaiseButtons()
    ]
  }

  renderRaiseButtons () {
    if (this.props.rules.showRaise && this.state.screen === 'raise') {
      return (
        <BetRaiseControl
          key='bet-raise-control'
          currentPlayer={this.props.currentPlayer}
          confirmBet={(value) => {
            if (value > this.props.game.currentHigherBet) {
              this.props.submitGameDecision({
                type: 'PLAYER_RAISE',
                value: value
              })
            } else {
              this.props.submitGameDecision({ type: 'PLAYER_CALL' })
            }
            this.setState({ screen: 'buttons' })
          }}
          onClose={() => this.props.onChangeRaiseVisibility(false)}
          cancel={() => this.setState({ screen: 'buttons' })}
          game={this.props.game} />
      )
    }
  }

  renderCheckButton () {
    if (!this.props.rules.showCheck || this.props.currentPlayer.gameStatus === 'allIn') { return }

    return (
      <React.Fragment>
        {this.props.applyHotKeys && <HotKey keys={['k']} onKeysCoincide={this.check} />}

        <button
          className={`button-1 ${this.context.isMobile ? '' : 'with-tip check'} green ${dig(this.props, 'intendedGameDecision', 'type') === 'PLAYER_CHECK' ? 'highlighted' : ''}`}
          onClick={this.check}
          disabled={this.state.blockingUntil}
          type='button'>
          Check
        </button>
      </React.Fragment>
    )
  }

  renderCallButton () {
    if (!this.props.rules.showCall) { return }

    let currentBet = this.props.currentPlayer.currentBet

    if (!currentBet || currentBet === 'check') {
      currentBet = 0
    }

    let value = (this.props.game.currentHigherBet - currentBet)
    let label = 'Call'

    if (value === 0) {
      value = this.props.game.bigBlind
      label = 'Bet'
    }

    if (value >= this.props.currentPlayer.stack) {
      value = this.props.currentPlayer.stack
      label = 'All In'
    }

    return (
      <React.Fragment>
        {this.props.applyHotKeys && <HotKey keys={['c']} onKeysCoincide={this.call} />}

        <button
          className={`button-1 ${this.context.isMobile ? '' : 'with-tip call'} green ${dig(this.props, 'intendedGameDecision', 'type') === 'PLAYER_CALL' ? 'highlighted' : ''}`}
          onClick={this.call}
          disabled={this.state.blockingUntil}
          type='button'>
          {label} {value}
        </button>
      </React.Fragment>
    )
  }

  raise = () => {
    this.props.onChangeRaiseVisibility(true)
    this.setState({ screen: 'raise' })
  }

  check = () => {
    let decision = (dig(this.props, 'intendedGameDecision', 'type') === 'PLAYER_CHECK') ? {} : { type: 'PLAYER_CHECK' }
    this.props.submitGameDecision(decision)
  }

  fold = () => {
    let decision = (dig(this.props, 'intendedGameDecision', 'type') === 'PLAYER_FOLD') ? {} : { type: 'PLAYER_FOLD' }

    let needConfirmation = (
      !this.props.game.currentHigherBet ||
      this.props.game.withBetAllowedCheckPlayersIDs.includes(this.props.currentPlayer.id)
    )

    let action = this.props.submitGameDecision.bind(this, decision)

    if (needConfirmation) {
      this.context.showConfirmation(
        'Are you sure that you want do an unnecessary fold?',
        action
      )
    } else {
      action()
    }
  }

  checkOrFold = () => {
    let decision = (dig(this.props, 'intendedGameDecision', 'type') === 'CHECK_OR_FOLD') ? {} : { type: 'CHECK_OR_FOLD' }
    this.props.submitGameDecision(decision)
  }

  callAny = () => {
    let decision = (dig(this.props, 'intendedGameDecision', 'type') === 'CALL_ANY') ? {} : { type: 'CALL_ANY' }
    this.props.submitGameDecision(decision)
  }

  call = () => {
    let decision = (dig(this.props, 'intendedGameDecision', 'type') === 'PLAYER_CALL') ? {} : { type: 'PLAYER_CALL' }
    this.props.submitGameDecision(decision)
  }

  renderRaiseButton () {
    if (!this.props.rules.showRaise) { return }

    let label = 'Bet'

    if (this.props.game.currentHigherBet) {
      label = 'Raise'
    }

    return (
      <React.Fragment>
        {this.props.applyHotKeys && <HotKey keys={['r']} onKeysCoincide={this.raise} />}

        <button
          className={`button-1 ${this.context.isMobile ? '' : 'with-tip raise '} green`}
          onClick={this.raise}
          disabled={this.state.blockingUntil}
          type='button'>
          {label}
        </button>
      </React.Fragment>
    )
  }

  renderFoldButton () {
    if (!this.props.rules.showFold) { return }

    return (
      <React.Fragment>
        {this.props.applyHotKeys && <HotKey keys={['f']} onKeysCoincide={this.fold} />}

        <button
          className={`button-1 ${this.context.isMobile ? '' : 'with-tip fold'} red ${dig(this.props, 'intendedGameDecision', 'type') === 'PLAYER_FOLD' ? 'highlighted' : ''}`}
          onClick={this.fold}
          disabled={this.state.blockingUntil}
          type='button'>
          Fold
        </button>
      </React.Fragment>
    )
  }

  renderCheckOrFoldButton () {
    if (!this.props.rules.showCheckOrFoldButton) { return }

    return (
      <React.Fragment>
        {this.props.applyHotKeys && <HotKey keys={['i']} onKeysCoincide={this.checkOrFold} />}

        <button
          className={`button-1 ${this.context.isMobile ? '' : 'with-tip check-fold'} ${dig(this.props, 'intendedGameDecision', 'type') === 'CHECK_OR_FOLD' ? 'highlighted' : ''}`}
          onClick={this.checkOrFold}
          disabled={this.state.blockingUntil}
          type='button'>
          Check/Fold
        </button>
      </React.Fragment>
    )
  }

  renderCallAny () {
    if (!this.props.rules.showCallAny) { return }

    return (
      <React.Fragment>
        {this.props.applyHotKeys && <HotKey keys={['y']} onKeysCoincide={this.callAny} />}

        <button
          className={`button-1 ${this.context.isMobile ? '' : 'with-tip call-any'} ${dig(this.props, 'intendedGameDecision', 'type') === 'CALL_ANY' ? 'highlighted' : ''}`}
          onClick={this.callAny}
          disabled={this.state.blockingUntil}
          type='button'>
          Call Any
        </button>
      </React.Fragment>
    )
  }

  renderActionSignal = () => {
    if (this.props.game.playerIDToTalk !== this.props.currentPlayer.id) { return }

    return <p className='action-signal'>Your Turn</p>
  }

  renderActionButtons () {
    if (this.state.screen === 'buttons') {
      return (
        <div key='action-buttons' className='action-buttons right-controls'>
          {this.renderActionSignal()}

          {this.renderCallAny()}

          {this.renderCheckOrFoldButton()}

          {this.renderCallButton()}

          {this.renderRaiseButton()}

          {this.renderCheckButton()}

          {this.renderFoldButton()}
        </div>
      )
    }
  }
}
