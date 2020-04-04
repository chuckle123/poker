import React, { Component } from 'react'
import HotKey from 'react-shortcut'
import PropTypes from 'prop-types'

export default class ShowHandButton extends Component {
  static contextTypes = {
    getServerNow: PropTypes.func
  }

  state = {
    hide: false
  }

  componentDidMount () {
    this.interval = setInterval(() => {
      if ((this.props.nextActionAt - this.context.getServerNow().getTime()) <= 600 &&
          this.props.nextAction === 'NEXT_STEP_AFTER_GAME_RESULT') {
        this.setState({ hide: true })
      }
    }, 200)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render () {
    if (this.state.hide) { return null }

    return (
      <React.Fragment>
        {this.props.applyHotKeys &&
          <HotKey
            keys={['s']}
            onKeysCoincide={this.props.onClick} />}

        <button
          className='button-1 green with-tip show-your-hand'
          onClick={this.props.onClick}
          type='button'>
          Show Hand
        </button>
      </React.Fragment>
    )
  }
}
