import React, { Component } from 'react'
import ConfigMenu from './configMenu'
import axios from 'axios'
import ConfigPlayerForm from './configPlayerForm'
import PropTypes from 'prop-types'

export default class ConfigPlayer extends Component {
  static contextTypes = {
    showAlert: PropTypes.func,
    showConfirmation: PropTypes.func
  }

  constructor () {
    super(...arguments)

    this.state = {
      stack: this.props.player.stack || 1000,
      loading: false,
      errors: {}
    }
  }

  submitForm = (evt) => {
    evt.preventDefault()

    this.setState({ loading: true })

    axios({
      url: `/games/${this.props.game.id}/${this.props.player.status === 'requestedGameIngress' ? 'approve_player' : 'update_player'}`,
      method: 'post',
      timeout: 2000,
      data: {
        playerID: this.props.player.id,
        stack: this.state.stack
      }
    })
      .then((response) => {
        this.context.showAlert('Player successfully updated!')

        this.setState({ loading: false }, () =>
          this.openScreen({ name: 'configPlayers' })
        )
      })
      .catch((error) => {
        let state = { loading: false, errors: {} }

        if (error.response.status === 422) {
          state.errors = error.response.data
        }

        this.setState(state)
      })
  }

  openScreen = (screen) => {
    if (!this.state.loading) {
      this.props.openScreen(screen)
    }
  }

  tryTransferOwnership = () => {
    this.context.showConfirmation(
      'Are you sure that you want transfer the game ownership?',
      this.transferOwnership
    )
  }

  transferOwnership = () => {
    this.setState({ loading: true })

    axios({
      url: `/games/${this.props.game.id}/transfer_ownership`,
      method: 'post',
      timeout: 10000,
      data: {
        playerID: this.props.player.id
      }
    })
      .then((response) => {
        this.context.showAlert('Game ownership successfully transferred.')

        this.setState({ loading: false }, () =>
          this.openScreen({ name: 'game' })
        )
      })
  }

  removePlayer = () => {
    this.setState({ loading: true })

    axios({
      url: `/games/${this.props.game.id}/remove_player`,
      method: 'post',
      timeout: 10000,
      data: {
        playerID: this.props.player.id
      }
    })
      .then((response) => {
        this.context.showAlert('Player successfully removed.')

        this.setState({ loading: false }, () =>
          this.openScreen({ name: 'configPlayers' })
        )
      })
  }

  renderRemovePlayerButton () {
    const { player, currentPlayer } = this.props

    if (player.id === currentPlayer.id || player.status !== 'inGame') { return }

    return (
      <button
        className='red button-1'
        onClick={this.removePlayer}
        disabled={this.state.loading}
        type='button-1'>
        Remove Player
      </button>
    )
  }

  renderTransferOwnernshipButton () {
    const { player, currentPlayer } = this.props

    if (player.id === currentPlayer.id || player.status !== 'inGame') { return }

    return (
      <button
        className='red button-1'
        onClick={this.tryTransferOwnership}
        disabled={this.state.loading}
        type='button-1'>
        Transfer Game Ownership
      </button>
    )
  }

  render () {
    const chipsMode = this.props.game.mode === 'chips'

    const cantUpdate = (chipsMode && this.props.player.status !== 'requestedGameIngress')

    let buttonText = 'Update on Next Turn'

    if (this.props.game.status === 'waiting') {
      buttonText = 'Update Player'
    }

    if (cantUpdate) {
      buttonText = 'Can\'t Update'
    }

    if (this.state.loading) {
      buttonText = 'Loading…'
    }

    return (
      <div className='main-container'>
        <ConfigMenu
          active='players'
          openScreen={this.openScreen} />

        <div className='config-content'>
          <h1 className='title-1'>
            {this.props.playerName}
          </h1>

          <ConfigPlayerForm
            playerName={this.props.player.name}
            stack={this.state.stack}
            stackError={this.state.errors.stack}
            updateStack={(value) => this.setState({ stack: value })}
            buttonText={buttonText}
            disabled={this.state.loading || cantUpdate}
            onSubmit={this.submitForm} />

          <div className='config-player-column config-col-2'>
            {this.renderRemovePlayerButton()}
            {this.renderTransferOwnernshipButton()}
          </div>
        </div>
      </div>
    )
  }
}
