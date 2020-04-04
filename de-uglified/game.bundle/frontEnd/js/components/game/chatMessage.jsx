import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ChatMessage extends Component {
  static contextTypes = {
    showAlert: PropTypes.func
  }

  constructor () {
    super(...arguments)
    let message = ''

    try {
      message = (window.localStorage.getItem(`chatMessage-${this.props.gameID}`) || '')
    } catch (error) {}

    this.state = { message }
  }

  render () {
    return (
      <form
        ref={ctn => { this.ctn = ctn }}
        onSubmit={this.onSubmit}
        className='chat-message'>
        <input
          maxLength='100'
          ref={(input) => { this.input = input }}
          type='text'
          onChange={(evt) => this.updateMessage(evt.target.value)}
          required
          value={this.state.message}
          disabled={this.state.loading}
          placeholder='Your Message (press Enter to submit)' />
      </form>
    )
  }

  clickContainer = (evt) => {
    if (evt.target === this.ctn || evt.target === this.input) { return }
    this.props.close()
  }

  escFunction = (evt) => {
    if (evt.keyCode === 27) {
      this.props.close(true)
    }
  }

  updateMessage = (message) => {
    this.setState({ message })

    try {
      window.localStorage.setItem(`chatMessage-${this.props.gameID}`, message)
    } catch (error) {}
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.escFunction, false)
    document.removeEventListener('click', this.clickContainer, false)
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.escFunction, false)
    document.addEventListener('click', this.clickContainer, false)

    this.input.focus()
  }

  onSubmit = (evt) => {
    evt.preventDefault()

    if (this.state.message.replace('/fd', '').trim().length === 0) {
      return
    }

    this.setState({ loading: true }, () => {
      this.props.submitMessage(this.state.message)

      this.updateMessage('')

      setTimeout(() => this.setState({ loading: false }, this.props.close), 10)
    })
  }
}
