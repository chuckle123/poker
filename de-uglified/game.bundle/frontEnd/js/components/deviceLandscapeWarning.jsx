import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class DeviceLandscapeWarning extends Component {
  static contextTypes = {
    currentOrientation: PropTypes.func,
    onChangeOrientation: PropTypes.func
  }

  constructor () {
    super(...arguments)

    this.state = {
      orientation: this.context.currentOrientation(),
      skipWarning: (JSON.parse(window.localStorage.getItem('skipDeviceWarning')) || false)
    }
  }

  componentDidMount () {
    this.removeOrientationChangeListener =
      this.context.onChangeOrientation((orientation) => this.setState({ orientation }))
  }

  componentWillUnmount () {
    this.removeOrientationChangeListener()
  }

  skipWarning = () => {
    this.setState({ skipWarning: true })

    try {
      window.localStorage.setItem('skipDeviceWarning', true)
    } catch (e) {}
  }

  renderWarning () {
    return (
      <div className='landscape-warning'>
        <h1 className='title'>
          Poker Now
        </h1>

        <p className='instructions'>
          Poker Now was designed to landscape mode only. For the best experience please rotate your device.
        </p>

        <button
          onClick={this.skipWarning}
          type='button'>
          I'm Ok!
        </button>
      </div>
    )
  }

  render () {
    if (this.state.orientation === 'landscape' || this.state.skipWarning) {
      return this.props.children
    } else {
      return this.renderWarning()
    }
  }
}
