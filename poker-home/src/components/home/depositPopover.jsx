import React, { Component } from 'react'

export default class DepositPopover extends Component {
  onClickOut = (evt) => {
    if (!this.popover.contains(evt.target)) {
      this.props.onClose()
    }
  }

  componentDidMount () {
    document.addEventListener('click', this.onClickOut)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.onClickOut)
  }

  renderBody () {
    if (this.props.loading) {
      return <p className='text-tip-1'>Loading…</p>
    } else {
      return this.renderDepositBody()
    }
  }

  renderDepositBody () {
    return (
      <div>
        <h1 className='title'>
          Deposit Stellar Lumens
        </h1>

        <div className='form-2-input-control'>
          <label>
            Deposit Address
          </label>
          <input
            readOnly
            type='text'
            onClick={(evt) => evt.target.select()}
            value={window.STELLAR_PUB_KEY} />
        </div>

        <div className='form-2-input-control'>
          <label>
            Deposit Memo
          </label>
          <input
            readOnly
            type='text'
            onClick={(evt) => evt.target.select()}
            value={this.props.depositMemo} />
        </div>

        <p className='text-tip-1 red' style={{ marginBottom: '0.5rem' }}>
          Do not forget to include the CORRECT Deposit Memo! You may lose your XLM in case of wrong deposit memo.
        </p>

        <p className='text-tip-1'>
          Please, don't leave your money in Poker Now. When you finish your game, we strongly recommend you to return your XLM for your wallet.
        </p>
      </div>
    )
  }

  render () {
    return (
      <div
        ref={(el) => { this.popover = el }}
        className='popover-1 deposit-popover'>
        {this.renderBody()}
      </div>
    )
  }
}
