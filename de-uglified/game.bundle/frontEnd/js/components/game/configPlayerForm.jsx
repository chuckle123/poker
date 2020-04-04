import React, { Component } from 'react'
import { renderErrorMessage } from './utils'
import IntegerInput from '../integerInput'
import InputWithLumensPrice from '../inputWithLumensPrice'

export default class ConfigPlayerForm extends Component {
  render () {
    return (
      <div className='config-player-column config-col-1'>
        <form
          onSubmit={this.props.onSubmit}
          className='form-1'>
          <div className='form-1-input-control'>
            <label>
              Player's Stack
            </label>

            <InputWithLumensPrice
              value={this.props.stack}
              multiplier={this.props.lumensChipValue}>
              <IntegerInput
                type='text'
                autoFocus
                disabled={this.props.disabled}
                placeholder='Stack'
                required
                onChange={(evt, parsedValue) => this.props.updateStack(parsedValue)}
                value={this.props.stack} />

              {renderErrorMessage(this.props.stackError)}
            </InputWithLumensPrice>
          </div>

          <button
            disabled={this.props.disabled}
            className='button-1'
            type='submit'>
            {this.props.buttonText}
          </button>
        </form>
      </div>
    )
  }
}
