import React, { Component } from 'react'
import axios from 'axios'

export default class MyWithdrawsPopoverBody extends Component {
  constructor () {
    super(...arguments)

    this.state = {
      withdraws: [],
      loading: true
    }
  }

  componentDidMount () {
    this.fetch()
  }

  fetch () {
    axios.get('/my-withdraws', {
      params: {
        playerID: this.props.currentPlayer.id,
        playerToken: this.props.currentPlayer.token
      },
      timeout: 5000
    })
      .then((response) => {
        this.setState({ withdraws: response.data, loading: false })
      })
      .catch(() => {
        this.context.showAlert('Whoops, something went wrong…')
        this.setState({ loading: false })
      })
  }

  renderWithdraw = (withdraw) => {
    return (
      <div key={`withdraw-${withdraw.id}`} className='withdraw-container'>
        <div className='infos'>
          <p><strong>id</strong> {withdraw.id}</p>
          <p><strong>address</strong> <abbr title={withdraw.receiver_address}>{withdraw.receiver_address.substring(0, 13)}…{withdraw.receiver_address.slice(-12)}</abbr></p>
          <p><strong>quantity</strong> {withdraw.quantity} - <abbr title={`The Stellar Network transaction fee was ${withdraw.paid_fee}`}>fee</abbr></p>
          <p><strong>at</strong> {(new Date(withdraw.created_at)).toUTCString()}</p>
        </div>

        <p className='status'>{withdraw.status}</p>
      </div>
    )
  }

  renderBody () {
    if (this.state.loading) {
      return <p className='withdraw-list-blank'>Loading…</p>
    } else if (!this.state.withdraws.length) {
      return <p className='withdraw-list-blank'>No Withdraw found</p>
    } else {
      return this.state.withdraws.map(this.renderWithdraw)
    }
  }

  render () {
    return (
      <div>
        <h1 className='title'>
          Your last 50 Stellar Lumens Withdraws
        </h1>

        <div className='withdraw-list'>
          {this.renderBody()}
        </div>

        <button
          className='button-3 gray'
          onClick={this.props.openNewWithdraws}
          type='buttom'>
          Back
        </button>
      </div>
    )
  }
}
