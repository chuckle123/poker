import React, { Component } from 'react'
import MyWithdrawsPopoverBody from './myWithdrawsPopoverBody'
import NewWithdrawPopoverBody from './newWithdrawPopoverBody'

export default class WithdrawPopover extends Component {
  constructor () {
    super(...arguments)

    this.state = {
      showing: 'newWithdraw'
    }
  }

  onClickOut = (evt) => {
    if (!this.props.locked && !this.popover.contains(evt.target)) {
      this.props.onClose()
    }
  }

  componentDidMount () {
    document.addEventListener('click', this.onClickOut, true)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.onClickOut, true)
  }

  render () {
    return (
      <div
        ref={(el) => { this.popover = el }}
        className='popover-1 withdraw-popover'>
        {this.renderBody()}
      </div>
    )
  }

  renderBody () {
    if (this.state.showing === 'newWithdraw') {
      return (
        <NewWithdrawPopoverBody
          stellarBaseFee={this.props.stellarBaseFee}
          updateLock={this.props.updateLock}
          currentPlayer={this.props.currentPlayer}
          openMyWithdraws={() => this.setState({ showing: 'myWithdraws' })} />
      )
    }

    if (this.state.showing === 'myWithdraws') {
      return (
        <MyWithdrawsPopoverBody
          currentPlayer={this.props.currentPlayer}
          openNewWithdraws={() => this.setState({ showing: 'newWithdraw' })} />
      )
    }
  }
}
