import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class OnTablePlayerTimer extends Component {
  static contextTypes = {
    getServerNowDifference: PropTypes.func
  }

  componentWillMount () {
    this.serverNowDifference = this.context.getServerNowDifference()
  }

  componentDidMount () {
    this.tick = setInterval(this.forceUpdate.bind(this), 100)
  }

  componentWillUnmount () {
    clearInterval(this.tick)
  }

  serverNow () {
    const now = new Date()
    return new Date(now.getTime() - this.serverNowDifference)
  }

  percentage () {
    let referenceTime = this.props.referenceTime.getTime()
    let limit = (this.props.decisionLimitTime - referenceTime)
    return ((this.props.decisionLimitTime - this.serverNow().getTime()) / limit) * 100
  }

  render () {
    return (
      <div className='time-to-talk'>
        <div className='time' style={{ width: `${this.percentage()}%` }} />
      </div>
    )
  }
}
