import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'

export default class QuitButton extends Component {
  static contextTypes = {
    showAlert: PropTypes.func,
    showConfirmation: PropTypes.func
  }

  constructor () {
    super(...arguments)

    this.state = { loading: false }
  }

  tryQuit = () => {
    this.context.showConfirmation('Are you sure?', this.quit)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.state.loading !== nextState.loading
  }

  quit = () => {
    if (this.state.loading) { return }

    this.setState({ loading: true })

    axios({
      url: `/games/${this.props.gameID}/player_quit`,
      method: 'post'
    })
      .catch(() => {
        this.context.showAlert('Whoops, something wrong happened…')
        this.setState({ loading: false })
      })
  }

  render () {
    return (
      <button
        disabled={this.state.loading}
        className='top-buttons-button quit'
        onClick={this.tryQuit}
        type='button'>
        {this.state.loading ? 'Quiting…' : 'Quit'}
      </button>
    )
  }
}
