import React, { Component } from 'react'
import axios from 'axios'
import { renderErrorMessage } from './utils'
import IntegerInput from '../integerInput'
import InputWithLumensPrice from '../inputWithLumensPrice'
import { presentLumensValue } from '../../utils'

export default class ConfigRequestIngress extends Component {
  constructor () {
    super(...arguments)

    this.state = {
      name: (this.props.currentPlayer.name || ''),
      stack: null,
      errors: {}
    }
  }

  componentDidMount () {
    if (!this.props.game.lumensChipValue) { return }
    this.fetchPlayer()
  }

  render () {
    return (
      <div className='main-container'>
        <div className='config-top-tabs'>
          <button
            onClick={this.back}
            className='config-top-tab-buttton back'
            type='button'>
            Back
          </button>
        </div>

        <div className='config-content'>
          <div className='config-player-column config-col-1'>
            <form
              onSubmit={this.submitForm}
              className='form-1'>
              <div className='form-1-input-control'>
                <label>
                  Your Name
                </label>

                <input
                  value={this.state.name}
                  autoFocus
                  onClick={(evt) => evt.target.setSelectionRange(0, evt.target.value.length)}
                  maxLength={9}
                  placeholder='Your Name'
                  onChange={(evt) => this.setState({ name: evt.target.value })}
                  type='text' />

                {renderErrorMessage(this.state.errors.playerName)}
              </div>

              {this.renderStackField()}

              <button
                className='button-1'
                disabled={this.state.loading}
                type='submit'>
                {this.state.loading ? 'Requesting…' : 'Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  renderStackField () {
    if (this.props.game.mode !== 'chips') { return }

    return (
      <div className='form-1-input-control'>
        <label>
          Your Stack
        </label>

        <InputWithLumensPrice
          value={this.state.stack}
          multiplier={this.props.game.lumensChipValue}>
          <IntegerInput
            type='text'
            placeholder='Your Stack'
            required
            onChange={(evt, parsedValue) => this.setState({ stack: parsedValue })}
            value={this.state.stack} />

          {renderErrorMessage(this.state.errors.stack)}
        </InputWithLumensPrice>

        <p className='help-message'>
          Chip Price: {presentLumensValue(this.props.game.lumensChipValue)}xlm ~ Your Balance: {this.state.playerLumens}xlm
        </p>
      </div>
    )
  }

  back = () => {
    if (!this.state.loading) {
      this.props.openScreen({ name: 'game' })
    }
  }

  fetchPlayer = () => {
    axios.get('/player-infos', { timeout: 5000 })
      .then((response) => {
        this.setState({
          playerLumens: response.data.lumens
        })
      })
  }

  submitForm = (evt) => {
    evt.preventDefault()

    this.setState({ loading: true })

    axios({
      url: `/games/${this.props.game.id}/request_ingress`,
      method: 'post',
      timeout: 2000,
      data: {
        playerName: this.state.name,
        stack: this.state.stack
      }
    })
      .then((response) => {
        this.props.openScreen({ name: 'game' })
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
