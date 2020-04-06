import React, { Component } from 'react'
import DepositPopover from './depositPopover'
import WithdrawPopover from './withdrawPopover'
import axios from 'axios'

export default class Bank extends Component {
  constructor () {
    super(...arguments)

    this.focused = true

    this.state = {
      loading: true,
      lumens: null,
      depositMemo: '',
      popover: null
    }
  }

  componentDidMount () {
    this.fetchPlayerCancelToken = axios.CancelToken.source()
    this.fetchPlayer()
    window.addEventListener('focus', this.onFocus)
    window.addEventListener('blur', this.onBlur)
  }

  componentWillUnmount () {
    this.fetchPlayerCancelToken.cancel('Canceling')
    window.removeEventListener('focus', this.onFocus)
    window.removeEventListener('blur', this.onBlur)
  }

  onBlur = () => {
    this.focused = false
  }

  onFocus = () => {
    this.focused = true
  }

  fetchPlayer = () => {
    if (this.fetchPlayerCancelToken.token.reason) { return }

    if (!this.focused) {
      return this.secheduleNextFetch()
    }

    axios.get('https://www.pokernow.club/player-infos', {
      params: {
        playerID: this.props.currentPlayer.id,
        playerToken: this.props.currentPlayer.token
      },
      timeout: 10000,
      cancelToken: this.fetchPlayerCancelToken.token
    })
      .then((response) => {
        this.setState({
          loading: false,
          depositMemo: response.data.deposit_memo,
          lumens: response.data.lumens,
          stellarBaseFee: response.data.stellar_base_fee
        })
        this.secheduleNextFetch()
      })
      .catch((err) => {
        if (axios.isCancel(err)) { return }
        this.secheduleNextFetch()
      })
  }

  secheduleNextFetch = () => {
    setTimeout(this.fetchPlayer, 10000)
  }

  render () {
    return (
      <div className='home-bank-container'>
        <div className='balance-container'>
          <p className='balance-label'>Balance</p>
          <p className='balance-value'>{this.state.loading ? 'loading…' : <span>{this.state.lumens} <small>xlm</small></span>}</p>
        </div>

        <div className='home-bank-buttons'>
          <div className='home-bank-button-ctn'>
            {this.renderDepositPopover()}

            <button
              className='button-1 button-small'
              onClick={() => this.openPopover('deposit')}
              type='button'>
              Deposit
            </button>
          </div>

          <div className='home-bank-button-ctn'>
            {this.renderWithdrawPopover()}

            <button
              className='button-1 button-small'
              onClick={() => this.openPopover('withdraw')}
              type='button'>
              Withdraw
            </button>
          </div>
        </div>
      </div>
    )
  }

  openPopover (popover) {
    if (this.state.locked) { return }
    this.setState({ popover })
  }

  updateLock = (locked) => {
    this.setState({ locked })
  }

  renderDepositPopover () {
    if (this.state.popover !== 'deposit') { return }

    return (
      <DepositPopover
        loading={this.state.loading}
        onClose={() => this.openPopover(null)}
        depositMemo={this.state.depositMemo} />
    )
  }

  renderWithdrawPopover () {
    if (this.state.popover !== 'withdraw') { return }

    return (
      <WithdrawPopover
        updateLock={this.updateLock}
        stellarBaseFee={this.state.stellarBaseFee}
        onClose={() => this.openPopover(null)}
        currentPlayer={this.props.currentPlayer} />
    )
  }
}
