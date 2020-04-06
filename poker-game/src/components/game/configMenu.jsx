import React, { Component } from 'react'

export default class ConfigMenu extends Component {
  render () {
    return (
      <div className='config-top-tabs'>
        <button
          onClick={() => this.props.openScreen({ name: 'game' })}
          className='config-top-tab-buttton back'
          type='button'>
          Back
        </button>

        {this.renderAdminMenus()}

        <button
          onClick={() => this.props.openScreen({ name: 'configsPreferences' })}
          className={`config-top-tab-buttton ${this.props.active === 'preferences' ? 'active' : ''}`}
          type='button'>
          Preferences
        </button>
      </div>
    )
  }

  renderAdminMenus () {
    if (!this.props.showAdminMenus) { return }

    return (
      <React.Fragment>
        <button
          onClick={() => this.props.openScreen({ name: 'configPlayers' })}
          className={`config-top-tab-buttton ${this.props.active === 'players' ? 'active' : ''}`}
          type='button'>
          Players
        </button>

        <button
          onClick={() => this.props.openScreen({ name: 'configsGame' })}
          className={`config-top-tab-buttton ${this.props.active === 'configs' ? 'active' : ''}`}
          type='button'>
          Game
        </button>
      </React.Fragment>
    )
  }
}
