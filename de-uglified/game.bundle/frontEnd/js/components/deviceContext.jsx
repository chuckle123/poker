import { Component } from 'react'
import screenfull from 'screenfull'
import PropTypes from 'prop-types'
import device from 'current-device'

export default class DeviceContext extends Component {
  deviceOrientationChangeEvents = []

  static childContextTypes = {
    screenfull: PropTypes.object,
    isMobile: PropTypes.bool,
    isAndroid: PropTypes.bool,
    isIOS: PropTypes.bool,
    currentOrientation: PropTypes.func,
    onChangeOrientation: PropTypes.func
  }

  constructor () {
    super(...arguments)
    this.screenfull = screenfull
  }

  getChildContext () {
    return {
      screenfull: this.screenfull,
      isMobile: device.mobile(),
      isIOS: device.ios(),
      isAndroid: device.android(),
      currentOrientation: this.currentOrientation,
      onChangeOrientation: this.onChangeOrientation
    }
  }

  componentDidMount () {
    device.onChangeOrientation(this.fireOrientationEvents)
  }

  fireOrientationEvents = (orientation) => {
    this.deviceOrientationChangeEvents.forEach(callback => callback(orientation))
  }

  onChangeOrientation = (callback) => {
    this.deviceOrientationChangeEvents.push(callback)
    return () => this.deviceOrientationChangeEvents.splice(this.deviceOrientationChangeEvents.indexOf(callback), 1)
  }

  currentOrientation = () => {
    return device.orientation
  }

  render () {
    return this.props.children
  }
}
