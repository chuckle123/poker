import React, { Component } from 'react'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

export default class FloatInput extends Component {
  render () {
    return (
      <MaskedInput
        {...this.props}
        mask={createNumberMask({
          prefix: '',
          includeThousandsSeparator: false,
          allowDecimal: true,
          decimalLimit: 7
        })}
        onChange={(evt) => {
          let stringValue = evt.target.value
          let floatValue = null

          if (stringValue) {
            floatValue = parseFloat(stringValue)
          }

          this.props.onChange(evt, { stringValue, floatValue })
        }}
        value={this.props.value} />
    )
  }
}
