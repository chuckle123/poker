import React, { Component } from 'react'
import TableSpotPopover from './tableSpotPopover'

export default class TableSpot extends Component {
  constructor () {
    super(...arguments)

    this.state = {
      showingForm: false,
      loading: false,
      name: (this.props.currentPlayer.name || ''),
      stack: null,
      errors: {}
    }
  }

  onClickOut = (evt) => {
    if (!this.popover.contains(evt.target) && this.state.showingForm) {
      this.setState({ showingForm: false })
    }
  }

  componentDidMount () {
    document.addEventListener('click', this.onClickOut)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.onClickOut)
  }

  toggleSitPopover = () => {
    if (this.props.game.chipType === 'external_club_chips' && !this.props.currentPlayer.pncUserID) {
      window.location = `/external-clubs-login?game_redirect=${encodeURIComponent(window.location.pathname)}`
      return
    }

    this.setState({ showingForm: !this.state.showingForm })
  }

  renderForm () {
    if (!this.state.showingForm) { return }

    return (
      <TableSpotPopover
        game={this.props.game}
        position={this.props.position}
        currentPlayer={this.props.currentPlayer} />
    )
  }

  render () {
    let className = `table-player table-player-seat table-player-${this.props.position}`

    if (this.state.showingForm) {
      className += ' selected '
    }

    return (
      <div
        className={className}
        style={{ zIndex: this.state.showingForm ? 5 : 2 }}
        ref={(el) => { this.popover = el }}>
        {this.renderForm()}

        <button
          onClick={this.toggleSitPopover}
          className='table-player-seat-button'
          type='button'>
          Sit
        </button>
      </div>
    )
  }
}
