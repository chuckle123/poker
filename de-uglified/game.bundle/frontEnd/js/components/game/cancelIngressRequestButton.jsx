import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'

export default class CancelIngressRequestButton extends Component {
  static contextTypes = {
    showAlert: PropTypes.func
  }

  constructor () {
    super(...arguments)

    this.state = { loading: false }
  }

  cancel = () => {
    this.setState({ loading: true })

    axios({
      url: `/games/${this.props.gameID}/cancel_request_ingress`,
      method: 'post'
    })
      .catch(() => {
        this.setState({ loading: false })
        this.context.showAlert('Whoops, something wrong happened…')
      })
  }

  render () {
    return (
      <button
        className='button-1 red'
        disabled={this.state.loading}
        onClick={this.cancel}
        type='button'>
        {this.state.loading ? 'Loading…' : 'Cancel Game Ingress Request'}
      </button>
    )
  }
}
