import React, { Component } from 'react'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

export default class IntegerInput extends Component {
  render () {
    return (
      <MaskedInput
        {...this.props}
        mask={createNumberMask({
          prefix: '',
          includeThousandsSeparator: false,
          allowDecimal: false
        })}
        onChange={(evt) => {
          let value = evt.target.value

          if (value !== '0' && !value) {
            value = null
          } else {
            value = parseInt(value, 10)
          }

          this.props.onChange(evt, value)
        }}
        value={typeof this.props.value === 'number' ? this.props.value.toString() : ''} />
    )
  }
}
