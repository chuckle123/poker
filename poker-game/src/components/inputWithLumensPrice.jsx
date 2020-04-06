import React, { Component } from 'react'
import { presentLumensValue } from '../utils'

export default class InputWithLumensPrice extends Component {
  render () {
    return (
      <div className='field-with-upper-text'>
        {this.renderValue()}

        {this.props.children}
      </div>
    )
  }

  renderValue () {
    if (!this.props.value || !this.props.multiplier) { return }

    let value = this.props.value * this.props.multiplier

    value = presentLumensValue(value)

    return (
      <span className='upper-text'>
        {value}xlm
      </span>
    )
  }
}
