import React, { Component } from 'react'
import axios from 'axios'

export default class InGameLog extends Component {
  constructor () {
    super(...arguments)
    this.state = { loading: true }
  }

  clickContainer = (evt) => {
    if (evt.target !== this.ctn) { return }
    this.props.close()
  }

  escFunction = (evt) => {
    if (evt.keyCode === 27) {
      this.props.close()
    }
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.escFunction, false)
  }

  componentDidMount () {
    document.addEventListener('keydown', this.escFunction, false)
    this.fetch()
  }

  fetch = (options = {}) => {
    this.setState({ loading: true })

    axios
      .get(`/games/${this.props.gameID}/log?after_at=${options.afterAt || ''}&before_at=${options.beforeAt || ''}`)
      .then((response) => {
        let logs = response.data.logs
        let infos = response.data.infos
        let firstItem = logs[0]
        let lastItem = logs[logs.length - 1]

        this.setState({
          log: logs,
          hasOlderPage: lastItem.created_at !== infos.min,
          hasNewerPage: firstItem.created_at !== infos.max,
          firstItemCreatedAt: firstItem.created_at,
          lastItemCreatedAt: lastItem.created_at,
          loading: false
        })
      })
  }

  renderLog () {
    if (this.state.loading) { return }

    return (
      this.state.log.map((log, index) => (
        <p key={`log-${index}`}>
          <span className='at'>
            {(new Date(log.at)).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
          </span>
          &nbsp;
          {log.msg}
        </p>
      ))
    )
  }

  renderNewerButton () {
    if (!this.state.firstItemCreatedAt || !this.state.hasNewerPage) { return }

    return (
      <button
        type='button'
        className='button-1 gray small-button'
        onClick={(evt) => this.fetch({ afterAt: this.state.firstItemCreatedAt })}>
        « Newer
      </button>
    )
  }

  renderOlderButton () {
    if (!this.state.lastItemCreatedAt || !this.state.hasOlderPage) { return }

    return (
      <button
        type='button'
        className='button-1 gray small-button'
        onClick={(evt) => this.fetch({ beforeAt: this.state.lastItemCreatedAt })}>
        Older »
      </button>
    )
  }

  render () {
    return (
      <div
        onClick={this.clickContainer}
        ref={ctn => { this.ctn = ctn }}
        className='log-ctn'>
        <div className='log-viewer'>
          {this.renderLog()}
          <div style={{ marginTop: '0.2rem' }}>
            {this.renderNewerButton()}
            &nbsp;
            {this.renderOlderButton()}
          </div>
          <button
            type='button'
            onClick={this.props.close}
            className='button-1 gray close-button'>
            Close
          </button>
        </div>
      </div>
    )
  }
}
