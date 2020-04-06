import React, { Component } from 'react'
import axios from 'axios'
import { renderErrorMessage } from '../game/utils'
import FloatInput from '../floatInput'
import PropTypes from 'prop-types'

function defaultState () {
  return {
    quantity: { floatValue: null, stringValue: '' },
    memo: '',
    receiverAddress: '',
    errors: {}
  }
}

export default class NewWithdrawPopoverBody extends Component {
  static contextTypes = {
    showAlert: PropTypes.func
  }

  constructor () {
    super(...arguments)

    this.state = defaultState()
  }

  render () {
    return (
      <div>
        <h1 className='title'>
          New Stellar Lumens Withdraw
        </h1>

        <form
          onSubmit={this.onSubmit}>
          <div className='form-2-input-control'>
            <label htmlFor='receiver-address'>Receiver Address (required)</label>
            <input
              disabled={this.state.loading}
              placeholder='Receiver Address'
              id='receiver-address'
              type='text'
              value={this.state.receiverAddress}
              onChange={(evt) => this.setState({ receiverAddress: evt.target.value })} />
            {renderErrorMessage(this.state.errors.receiverAddress)}
          </div>

          <div className='form-2-input-control'>
            <label htmlFor='value'>Value (required)</label>
            <FloatInput
              id='value'
              placeholder='Quantity'
              type='text'
              disabled={this.state.loading}
              value={this.state.quantity.valueString}
              onChange={(evt, value) => this.setState({ quantity: value })} />
            {renderErrorMessage(this.state.errors.quantity)}
          </div>

          <div className='form-2-input-control'>
            <label htmlFor='memo'>Text Memo</label>
            <input
              id='memo'
              placeholder='Memo'
              disabled={this.state.loading}
              type='text'
              value={this.state.memo}
              onChange={(evt) => this.setState({ memo: evt.target.value })} />
            {renderErrorMessage(this.state.errors.memo)}
          </div>

          <p className='text-tip-1' style={{ marginBottom: '0.3rem' }}>
            Stellar transaction fee: {this.props.stellarBaseFee}
          </p>

          <input
            className='button-3 green'
            style={{ marginBottom: 10 }}
            disabled={this.state.loading}
            type='submit'
            value={this.state.loading ? 'Loading…' : 'Withdraw'} />

          <button
            className='button-3 gray'
            onClick={this.props.openMyWithdraws}
            disabled={this.state.loading}
            type='button'>
            My Withdraws
          </button>
        </form>
      </div>
    )
  }

  onSubmit = (evt) => {
    evt.preventDefault()

    this.props.updateLock(true)
    this.setState({ loading: true })

    axios.post('/new-withdraw', {
      playerID: this.props.currentPlayer.id,
      playerToken: this.props.currentPlayer.token,
      quantity: this.state.quantity.floatValue,
      receiverAddress: this.state.receiverAddress,
      memo: this.state.memo
    })
      .then((response) => {
        window.alert('Withdraw successfully enqueued!')
        this.props.updateLock(false)
        this.setState({ ...defaultState(), loading: false })
      })
      .catch((error) => {
        this.props.updateLock(false)

        let state = { loading: false, errors: {} }

        if (error.response.status === 422) {
          state.errors = error.response.data
        }

        this.setState(state)
      })
  }
}
