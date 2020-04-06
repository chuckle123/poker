import React, { Component } from 'react'
import axios from 'axios'
import { renderErrorMessage } from '../game/utils'
import IntegerInput from '../integerInput'
import FloatInput from '../floatInput'
import InputWithLumensPrice from '../inputWithLumensPrice'

export default class NewGameForm extends Component {
  constructor () {
    super(...arguments)

    this.state = {
      playerStack: 1000,
      smallBlind: 10,
      bigBlind: 20,
      playerName: (this.props.currentPlayer.name || ''),
      lumensChipValue: { floatValue: 0, stringValue: '0' },
      errors: {}
    }
  }

  render () {
    return (
      <div className='intro-main-form-container'>
        <h2 className='title-2'>
          Create a Private Game
        </h2>

        <form className='main-form-1' onSubmit={this.onSubmit}>
          <div className='form-1-input-control'>
            <label htmlFor='player-name'>Your Name</label>
            <input
              id='player-name'
              autoFocus
              type='text'
              maxLength={9}
              placeholder='Your Name'
              value={this.state.playerName}
              onChange={(evt) => this.setState({ playerName: evt.target.value })} />
            {renderErrorMessage(this.state.errors.playerName)}
          </div>

          <div className='form-1-two-columns'>
            <div className='form-1-input-control'>
              <label htmlFor='game-big-blind'>Small Blind Value</label>
              <InputWithLumensPrice
                value={this.state.smallBlind}
                multiplier={this.state.lumensChipValue.floatValue}>
                <IntegerInput
                  id='game-big-blind'
                  type='text'
                  required
                  onChange={(evt, parsedValue) => this.setState({ smallBlind: parsedValue })}
                  value={this.state.smallBlind} />
              </InputWithLumensPrice>
              {renderErrorMessage(this.state.errors.smallBlind)}
            </div>

            <div className='form-1-input-control'>
              <label htmlFor='game-big-blind'>Big Blind Value</label>
              <InputWithLumensPrice
                value={this.state.bigBlind}
                multiplier={this.state.lumensChipValue.floatValue}>
                <IntegerInput
                  id='game-big-blind'
                  type='text'
                  required
                  onChange={(evt, parsedValue) => this.setState({ bigBlind: parsedValue })}
                  value={this.state.bigBlind} />
              </InputWithLumensPrice>
              {renderErrorMessage(this.state.errors.bigBlind)}
            </div>
          </div>

          <div className='form-1-two-columns'>
            <div className='form-1-input-control'>
              <label htmlFor='player-stack'>Your Stack</label>
              <InputWithLumensPrice
                value={this.state.playerStack}
                multiplier={this.state.lumensChipValue.floatValue}>
                <IntegerInput
                  id='game-player-stack'
                  type='text'
                  required
                  onChange={(evt, parsedValue) => this.setState({ playerStack: parsedValue })}
                  value={this.state.playerStack} />
              </InputWithLumensPrice>
              {renderErrorMessage(this.state.errors.playerStack)}
            </div>

            <div className='form-1-input-control'>
              <label htmlFor='game-chip-value'>Chip Price (XLM)</label>
              <FloatInput
                id='game-chip-value'
                type='text'
                required
                onChange={(evt, parsedValue) => this.setState({ lumensChipValue: parsedValue })}
                value={this.state.lumensChipValue.stringValue} />
              {renderErrorMessage(this.state.errors.lumensChipValue)}
            </div>
          </div>

          <input
            className='button-1'
            disabled={this.state.loading}
            type='submit'
            value={this.state.loading ? 'Loading…' : 'Create Game'} />
        </form>
      </div>
    )
  }

  onSubmit = (evt) => {
    evt.preventDefault()

    this.setState({ loading: true })

    axios.post('/new-game', {
      playerID: this.props.currentPlayer.id,
      playerName: this.state.playerName,
      playerToken: this.props.currentPlayer.token,
      playerStack: this.state.playerStack,
      lumensChipValue: this.state.lumensChipValue.floatValue,
      clubID: window.clubID,
      bigBlind: this.state.bigBlind,
      smallBlind: this.state.smallBlind
    })
      .then(function (response) {
        window.location = `/games/${response.data.gameID}`
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
