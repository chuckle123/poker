import React, { Component } from 'react'

export default class ChatMessages extends Component {
  componentDidMount () {
    this.chatDiv.scrollTop = this.chatDiv.scrollHeight
  }

  componentDidUpdate (prevProps) {
    if (this.props.chat === prevProps.chat) { return }
    this.chatDiv.scrollTop = this.chatDiv.scrollHeight
  }

  render () {
    return (
      <div
        className='messages'
        ref={(el) => { this.chatDiv = el }}>
        {this.renderBlankSlate()}
        {this.renderChatMessages()}
      </div>
    )
  }

  renderBlankSlate () {
    if (this.props.chat.length) { return }

    return (
      <p className='blank-slate'>
        It's a bit quiet here.<br />Click on the balloon and send a Message!<br />Tip: send your feedback with <strong>/fd</strong>.
      </p>
    )
  }

  renderChatMessages () {
    return this.props.chat.map((message, index) => {
      const at =
        (new Date(message.at))
          .toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })

      let messageContent = message.message

      if (message.feedbackMessage) {
        messageContent = <span dangerouslySetInnerHTML={{ __html: messageContent }} />
      }

      return (
        <p key={index}>
          <span className='highlight'>{at} ~ {message.playerName || 'guest'}</span> {messageContent}
        </p>
      )
    })
  }
}
