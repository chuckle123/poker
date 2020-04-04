import React, { Component } from 'react'
import ChatMessage from './chatMessage'
import ChatMessages from './chatMessages'
import HotKey from 'react-shortcut'
import PropTypes from 'prop-types'
import { deepEqual as equals } from 'fast-equals'

export default class Chat extends Component {
  static contextTypes = {
    isMobile: PropTypes.bool
  }

  constructor () {
    super(...arguments)

    this.state = {
      showingNewMessageForm: false
    }
  }

  componentWillUnmount () {
    this.props.onChangeMessageVisibility(false)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      !equals(this.props.chat[this.props.chat.length - 1], nextProps.chat[nextProps.chat.length - 1]) ||
      this.state.showingNewMessageForm !== nextState.showingNewMessageForm
    )
  }

  toggleNewMessageForm = (escKey = false) => {
    if (document.activeElement.tagName === 'INPUT' &&
        document.activeElement.type === 'text' &&
        !escKey) { return }

    let visible = this.state.showingNewMessageForm

    this.props.onChangeMessageVisibility(!visible)

    this.setState({
      showingNewMessageForm: !visible
    })
  }

  renderMessageBalloon () {
    if (!this.state.showingNewMessageForm) { return }

    return (
      <ChatMessage
        submitMessage={this.props.submitMessage}
        currentPlayer={this.props.currentPlayer}
        close={this.toggleNewMessageForm}
        gameID={this.props.gameID} />
    )
  }

  applyHotKey () {
    if (this.state.showingNewMessageForm) { return }

    return (
      <HotKey
        keys={['m']}
        onKeysCoincide={() => setTimeout(this.toggleNewMessageForm, 0)} />
    )
  }

  render () {
    return (
      <div className='chat'>
        {this.applyHotKey()}

        {this.renderMessageBalloon()}

        <div className='chat-container'>
          <button
            type='button'
            onClick={this.toggleNewMessageForm}
            className={`new-message ${this.context.isMobile ? '' : 'with-tip'}`}>
            New Message
          </button>

          <ChatMessages chat={this.props.chat} />
        </div>
      </div>
    )
  }
}
