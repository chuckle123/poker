import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  presentMinutesFromMiliseconds
} from '../../utils'

export default class NextBlindSignal extends Component {
  static contextTypes = {
    getServerNow: PropTypes.func
  }

  constructor () {
    super(...arguments)

    this.localReference = (new Date()).getTime()
    this.serverReference = this.context.getServerNow().getTime()

    this.state = {
      currentTime: this.time()
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.nextBigBlind !== this.props.nextBigBlind || this.state.currentTime !== nextState.currentTime
  }

  time () {
    let localDifference = ((new Date()).getTime() - this.localReference)
    let serverNow = this.serverReference + localDifference

    return presentMinutesFromMiliseconds(this.props.increaseBlindAt - serverNow)
  }

  componentDidMount () {
    this.interval = setInterval(() => {
      this.setState({ currentTime: this.time() })
    }, 300)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render () {
    return (
      <span className='chip-price'>
        <br />
        Next Blind: {this.props.nextBigBlind / 2}/{this.props.nextBigBlind} in {this.state.currentTime}
      </span>
    )
  }
}
