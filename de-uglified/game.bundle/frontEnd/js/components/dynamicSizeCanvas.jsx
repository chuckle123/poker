import React, { Component } from 'react'
import { calculateCanvasSize } from '../utils.js'
import PropTypes from 'prop-types'

export default class DynamicSizeCanvas extends Component {
  static contextTypes = {
    isIOS: PropTypes.bool,
    isAndroid: PropTypes.bool
  }

  state = {
    canvasSize: {}
  }

  componentDidMount () {
    window.addEventListener('resize', this.updateCanvas, true)

    if (this.context.isIOS) {
      window.addEventListener('orientationchange', this.updateCanvas, true)
    }

    this.updateCanvas()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateCanvas, true)

    if (this.context.isIOS) {
      window.removeEventListener('orientationchange', this.updateCanvas, true)
    }

    document.getElementsByTagName('html')[0].style.fontSize = ''
  }

  updateCanvas = () => {
    let size = calculateCanvasSize(window, this.context.isIOS, this.context.isAndroid)

    document.getElementsByTagName('html')[0].style.fontSize = `${size.fontSize}px`

    this.setState({ canvasSize: size })
  }

  render () {
    return (
      <div
        style={{
          marginTop: this.state.canvasSize.marginTop,
          marginLeft: this.state.canvasSize.marginLeft,
          width: this.state.canvasSize.width,
          height: this.state.canvasSize.height
        }}
        id='canvas'>
        {this.props.children}
      </div>
    )
  }
}
