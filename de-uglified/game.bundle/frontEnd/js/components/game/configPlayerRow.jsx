import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'

export default class ConfigPlayerRow extends Component {
  static contextTypes = {
    showAlert: PropTypes.func
  }

  constructor () {
    super(...arguments)

    this.state = { loading: false }
  }

  className () {
    let className = 'config-player-row'

    if (this.props.player.status === 'requestedGameIngress') {
      className += ' request-game-ingress'
    }

    return className
  }

  openEditScreen = () => {
    this.props.openScreen({ name: 'configPlayer', playerID: this.props.player.id })
  }

  approve = () => {
    if (this.props.game.mode === 'chips') {
      this.approveDirectly()
    } else {
      this.openEditScreen()
    }
  }

  approveDirectly () {
    this.setState({ loading: true })

    axios({
      url: `/games/${this.props.game.id}/approve_player`,
      method: 'post',
      timeout: 10000,
      data: { playerID: this.props.player.id }
    })
      .then((response) => {
        this.context.showAlert('Player successfully approved.')

        this.setState({ loading: false })
      })
      .catch(() => {
        this.context.showAlert('Whoops, something goes wrong.')

        this.setState({ loading: false })
      })
  }

  renderStatus () {
    const { player, game } = this.props

    if (player.status === 'inGame') {
      return `Playing with ${player.stack} stack`
    }

    if (player.status === 'waitingNextGameToEnter') {
      return `Waiting next turn to enter`
    }

    if (player.status === 'requestedGameIngress' && game.mode === 'chips') {
      return `Requested Ingress with ${player.stack} stack`
    }

    if (player.status === 'requestedGameIngress') {
      return 'Requested Ingress'
    }

    if (player.status === 'quiting') {
      return 'Player will quit in the Next Turn'
    }

    return 'Watching'
  }

  renderActionButton () {
    const { player } = this.props

    let button

    if (player.status === 'inGame') {
      button = (
        <button
          className='button-1 config-action-button'
          onClick={this.openEditScreen}
          type='button'>
          Edit
        </button>
      )
    }

    if (player.status === 'requestedGameIngress') {
      button = (
        <button
          className='button-1 config-action-button'
          disabled={this.state.loading}
          onClick={this.approve}
          type='button'>
          {this.state.loading ? 'Approving' : 'Approve'}
        </button>
      )
    }

    return button
  }

  render () {
    return (
      <div
        className={this.className()}>
        <p className='name'>
          {this.props.player.name || '--'}
        </p>
        <p className='status'>
          {this.renderStatus()}
        </p>
        {this.renderActionButton()}
      </div>
    )
  }
}
