import React, { Component } from 'react'
import ConfigMenu from './configMenu'
import PropTypes from 'prop-types'

export default class ConfigPreferences extends Component {
  static contextTypes = {
    updatePlayer: PropTypes.func
  }

  defineDeckStyle (styleName) {
    this.context.updatePlayer({ deckStyle: styleName })
  }

  render () {
    return (
      <div className='main-container'>
        <ConfigMenu
          active='preferences'
          showAdminMenus={this.props.currentPlayer.isOwner}
          openScreen={this.props.openScreen} />

        <div className='config-content'>
          <div className='form-1-input-control'>
            <label>
              Deck Style
            </label>

            <button
              className={`${this.props.currentPlayer.deckStyle === 'four-color' ? 'green' : 'gray'} button-1`}
              onClick={() => this.defineDeckStyle('four-color')}>
              Four Colors
            </button>
            &nbsp;
            <button
              className={`${this.props.currentPlayer.deckStyle === 'two-color' ? 'green' : 'gray'} button-1`}
              onClick={() => this.defineDeckStyle('two-color')}>
              Two Colors
            </button>
          </div>
        </div>
      </div>
    )
  }
}
