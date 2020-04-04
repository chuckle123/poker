import React, { Component } from 'react'
import { renderErrorMessage, onlyNumbers } from './utils'
import ConfigMenu from './configMenu'
import axios from 'axios'
import PropTypes from 'prop-types'

function renderButton (label, active, onClick) {
  return (
    <button
      onClick={onClick}
      type='button'
      className={active ? 'active' : ''}>
      {label}
    </button>
  )
}

export default class ConfigGame extends Component {
  static contextTypes = {
    showAlert: PropTypes.func
  }

  constructor () {
    super(...arguments)

    this.state = {
      bigBlind: this.props.game.bigBlind,
      smallBlind: this.props.game.smallBlind,
      decisionLimitTime: this.props.game.decisionLimitTime,
      showAllHandsWhenBetsFinished: this.props.game.showAllHandsWhenBetsFinished,
      errors: {}
    }
  }

  render () {
    return (
      <div className='main-container'>
        <ConfigMenu
          active='configs'
          showAdminMenus={this.props.currentPlayer.isOwner}
          openScreen={this.props.openScreen} />

        <div className='config-content'>
          <form
            onSubmit={this.submitForm}
            className='form-1'>
            <div className='config-player-column config-col-1'>
              <div className='form-1-input-control'>
                <label>
                  Small Blind
                </label>

                <input
                  value={this.state.smallBlind}
                  maxLength={6}
                  onChange={(evt) => {
                    let value = (onlyNumbers(evt.target.value) || 0)
                    this.setState({ smallBlind: parseInt(value, 10) })
                  }}
                  type='integer' />

                {renderErrorMessage(this.state.errors.smallBlind)}
              </div>

              <div className='form-1-input-control'>
                <label>
                  Big Blind
                </label>

                <input
                  value={this.state.bigBlind}
                  maxLength={6}
                  onChange={(evt) => {
                    let value = (onlyNumbers(evt.target.value) || 0)
                    this.setState({ bigBlind: parseInt(value, 10) })
                  }}
                  type='integer' />

                {renderErrorMessage(this.state.errors.bigBlind)}
              </div>

              <div className='form-1-input-control'>
                <label>
                  Decision Time Limit (seconds) (blank to no limit)
                </label>

                <input
                  value={this.state.decisionLimitTime}
                  maxLength={6}
                  onChange={(evt) => {
                    let value = onlyNumbers(evt.target.value)

                    if (value) {
                      value = parseInt(value, 10)
                    }

                    this.setState({ decisionLimitTime: value })
                  }}
                  type='integer' />

                {renderErrorMessage(this.state.errors.decisionLimitTime)}
              </div>

              <button
                disabled={this.state.loading}
                className='button-1'
                type='submit'>
                Update on Next Turn
              </button>
            </div>

            <div className='config-col-2'>
              <div className='form-1-input-control'>
                <label>
                  Show all hands in all in situations?
                </label>

                <div className='choose-buttons normal-height'>
                  {renderButton(
                    'Yes',
                    this.state.showAllHandsWhenBetsFinished,
                    () => this.setState({ showAllHandsWhenBetsFinished: true })
                  )}
                  {renderButton(
                    'No',
                    !this.state.showAllHandsWhenBetsFinished,
                    () => this.setState({ showAllHandsWhenBetsFinished: false })
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  submitForm = (evt) => {
    evt.preventDefault()

    this.setState({ loading: true })

    axios({
      url: `/games/${this.props.game.id}/update_game`,
      method: 'post',
      timeout: 4000,
      data: {
        bigBlind: this.state.bigBlind,
        smallBlind: this.state.smallBlind,
        decisionLimitTime: this.state.decisionLimitTime,
        showAllHandsWhenBetsFinished: this.state.showAllHandsWhenBetsFinished
      }
    })
      .then((response) => {
        this.context.showAlert('Game successfully updated.')
        this.setState({ loading: false })
      })
      .catch((error) => {
        let state = { loading: false, errors: {} }

        if (error.response.status === 422) {
          state.errors = error.response.data
        }

        this.setState(state)
      })
  }
}
