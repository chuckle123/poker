import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class FullScreenButton extends Component {
  state = {
    fullscreen: false
  }

  static contextTypes = {
    screenfull: PropTypes.object,
    isMobile: PropTypes.bool
  }

  componentDidMount () {
    if (this.context.screenfull.enabled) {
      this.context.screenfull.on('change', this.updateCanvasCapabilities)
      this.updateCanvasCapabilities()
    }
  }

  componentWillUnmount () {
    if (this.context.screenfull.enabled) {
      this.context.screenfull.off('change', this.updateCanvasCapabilities)
    }
  }

  updateCanvasCapabilities = () => {
    this.setState({ fullscreen: this.context.screenfull.isFullscreen })
  }

  render () {
    if (this.state.fullscreen || !this.context.isMobile || !this.context.screenfull.enabled) { return null }

    return (
      <button
        onClick={() => this.context.screenfull.request()}
        className='full-screen-button'
        type='button'>
        Full Screen
      </button>
    )
  }
}
