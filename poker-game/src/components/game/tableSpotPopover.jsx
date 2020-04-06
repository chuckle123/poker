import React, { Component } from 'react'
import InputWithLumensPrice from '../inputWithLumensPrice'
import IntegerInput from '../integerInput'
import axios from 'axios'
import { renderErrorMessage } from './utils'
import PropTypes from 'prop-types'

export default class TableSpotPopover extends Component {
  static contextTypes = {
    showAlert: PropTypes.func
  }

  constructor () {
    super(...arguments)

    this.state = {
      loading: false,
      name: (this.props.currentPlayer.name || ''),
      stack: null,
      errors: {}
    }
  }

  submitForm = (evt) => {
    evt.preventDefault()

    this.setState({ loading: true })

    axios({
      url: `/games/${this.props.game.id}/request_ingress`,
      method: 'post',
      timeout: 10000,
      data: {
        seat: this.props.position,
        playerName: this.state.name,
        stack: this.state.stack
      }
    })
      .then((response) => {
        if (!this.props.currentPlayer.isOwner) {
          this.context.showAlert('You requested this seat. Wait for the owner approval.')
        }
      })
      .catch((error) => {
        let state = { loading: false, errors: {} }

        if (error.response.status === 422) {
          state.errors = error.response.data
        }

        this.setState(state)
      })
  }

  render () {
    return (
      <div className='popover-1 request-ingress-popover'>
        <form
          onSubmit={this.submitForm}
          className='form-1'>
          <div className='form-2-input-control'>
            <label>
              Your Name
            </label>

            <input
              value={this.state.name}
              disabled={this.props.game.clubID}
              autoFocus={!this.props.game.clubID}
              onClick={(evt) => evt.target.setSelectionRange(0, evt.target.value.length)}
              maxLength={9}
              placeholder='John Wick'
              onChange={(evt) => this.setState({ name: evt.target.value })}
              type='text' />

            {renderErrorMessage(this.state.errors.playerName)}
          </div>

          {this.renderStackField()}

          <button
            className='button-3 green'
            disabled={this.state.loading}
            type='submit'>
            {this.state.loading ? 'Requesting…' : 'Request the Seat'}
          </button>
        </form>
      </div>
    )
  }

  renderStackField () {
    if (
      this.props.game.mode === 'chips' ||
      !this.props.game.ownerID ||
      this.props.currentPlayer.isOwner
    ) {
      return (
        <div className='form-2-input-control'>
          <label>
            Your Stack
          </label>

          <InputWithLumensPrice
            value={this.state.stack}
            multiplier={this.props.game.lumensChipValue}>
            <IntegerInput
              autoFocus={this.props.game.clubID}
              type='text'
              placeholder='Your Stack'
              required
              onChange={(evt, parsedValue) => this.setState({ stack: parsedValue })}
              value={this.state.stack} />

            {renderErrorMessage(this.state.errors.stack)}
          </InputWithLumensPrice>
        </div>
      )
    }
  }
}
