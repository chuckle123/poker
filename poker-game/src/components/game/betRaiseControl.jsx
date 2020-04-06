import React, { Component } from 'react'
import HotKey from 'react-shortcut'
import { onlyNumbers, initialBetValue, canBet } from '../game/utils'
import PropTypes from 'prop-types'

export default class BetRaiseControl extends Component {
  static contextTypes = {
    isMobile: PropTypes.bool
  }

  constructor () {
    super(...arguments)

    let playerStack = this.props.currentPlayer.stack
    let allIn = playerStack
    let pot = this.props.game.pot
    let bigBlind = this.props.game.bigBlind
    let min = this.props.game.minimumRaise

    if (min > playerStack) {
      min = playerStack
    }

    if (this.props.game.maxAllowedValueToBet < playerStack) {
      allIn = this.props.game.maxAllowedValueToBet
    }

    this.options = {
      'min': { label: 'Min Raise', value: min },
      'allIn': { label: 'All In', value: allIn },
      'firstOption': { label: '3 BB', value: bigBlind * 3 },
      'secondOption': { label: '4 BB', value: bigBlind * 4 },
      'thirdOption': { label: '5 BB', value: bigBlind * 5 }
    }

    if (pot !== 0) {
      let base = 0

      if (this.props.game.currentHigherBet) {
        base = this.props.game.minimumRaise
      }

      this.options.firstOption = { label: '1/2 Pot', value: (base + (pot / 2)) }
      this.options.secondOption = { label: '3/4 Pot', value: (base + ((pot / 4) * 3)) }
      this.options.thirdOption = { label: 'Pot', value: (base + pot) }
    }

    this.state = {
      value: initialBetValue(
        this.props.game.maxAllowedValueToBet,
        this.props.game.currentHigherBet,
        playerStack,
        bigBlind,
        this.props.game.minimumRaise
      ),
      stackIncrease: this.props.game.bigBlind
    }
  }

  escFunction = (evt) => {
    if (evt.keyCode === 27) {
      this.props.cancel()
    }
  }

  componentDidMount () {
    document.addEventListener('keydown', this.escFunction, false)

    if (!this.context.isMobile) {
      this.input.focus()
    }
  }

  valueValid () {
    if (this.props.currentPlayer.currentBet === this.state.value) {
      return false
    }

    return canBet(
      this.state.value,
      this.props.game.maxAllowedValueToBet,
      this.props.game.currentHigherBet,
      this.props.currentPlayer.stack,
      this.props.game.bigBlind,
      this.props.game.minimumRaise
    )
  }

  updateValue (value) {
    let bet = value

    if (value && typeof value === 'string') {
      bet = parseInt(onlyNumbers(value), 10)
    }

    bet = Math.floor(bet)

    this.setState({ value: bet })
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.escFunction, false)
    this.props.onClose()
  }

  decreaseBlind = () => {
    let value = this.state.value - this.state.stackIncrease

    if (value < 0) {
      value = 0
    }

    this.updateValue(value)
  }

  increaseBlind = () => {
    let playerStack = this.props.currentPlayer.stack
    let value = this.state.value + this.state.stackIncrease

    if (value >= playerStack) {
      value = playerStack
    }

    this.updateValue(value)
  }

  renderBetLabel () {
    if (!this.props.game.currentHigherBet) {
      return 'Bet'
    }

    if (this.state.value > (this.props.game.currentHigherBet || this.props.game.bigBlind)) {
      return 'Raise'
    } else {
      return 'Call'
    }
  }

  render () {
    return (
      <form onSubmit={(evt) => {
        evt.preventDefault()
        this.props.confirmBet(this.state.value)
      }}>
        <div key='bet-buttons' className='bet-buttons'>
          <div className={`raise-bet-value ${this.valueValid() ? '' : 'invalid'}`}>
            <p className='label'>Your bet</p>
            <input
              ref={(el) => { this.input = el }}
              onChange={(evt) => this.updateValue(evt.target.value)}
              value={this.state.value}
              type='text'
              className='value' />
          </div>

          <div className='raise-controller'>
            <div className='bet-buttons'>
              <button
                className='button-1 bet-button'
                type='button'
                onClick={() => this.updateValue(this.options.min.value)}>
                {this.options.min.label}
              </button>

              <button
                className='button-1 bet-button'
                type='button'
                onClick={() => this.updateValue(this.options.firstOption.value)}>
                {this.options.firstOption.label}
              </button>

              <button
                className='button-1 bet-button'
                type='button'
                onClick={() => this.updateValue(this.options.secondOption.value)}>
                {this.options.secondOption.label}
              </button>

              <button
                className='button-1 bet-button'
                type='button'
                onClick={() => this.updateValue(this.options.thirdOption.value)}>
                {this.options.thirdOption.label}
              </button>

              <button
                className='button-1 bet-button'
                type='button'
                onClick={() => this.updateValue(this.options.allIn.value)}>
                {this.options.allIn.label}
              </button>
            </div>

            <div className='slider'>
              <button
                className='control-button decrease'
                type='button'
                onClick={() => this.decreaseBlind()}>
                -
              </button>

              <input
                className='slider-control'
                type='range'
                min='0' max={this.props.currentPlayer.stack}
                value={this.state.value}
                onChange={(evt) => this.updateValue(evt.target.value)}
                step='1' />

              <button
                className='control-button increase'
                type='button'
                onClick={() => this.increaseBlind()}>
                +
              </button>
            </div>
          </div>
        </div>

        <div key='actions' className='action-buttons right-controls'>
          <button
            className='button-1 green'
            disabled={!this.valueValid()}
            type='submit'>
            {this.renderBetLabel()}
          </button>

          <React.Fragment>
            <HotKey
              keys={['b']}
              onKeysCoincide={this.props.cancel} />

            <button
              onClick={this.props.cancel}
              className='button-1 with-tip back'
              type='button'>
              Back
            </button>
          </React.Fragment>
        </div>
      </form>
    )
  }
}
