import React, { Component } from 'react'
import { isVersionGreater } from '../../utils'
import { VERSIONS } from '../../constants'

export default class ChangelogModal extends Component {
  constructor () {
    super(...arguments)

    this.lastSeenVersion = window.localStorage.getItem('lastSeenVersion') || '0.0.0'
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
    window.localStorage.setItem('lastSeenVersion', process.env.npm_package_version)
  }

  renderChanges () {
    return (
      VERSIONS.map(version => (
        <li key={`version-${version.number}`}>
          <span className='modal-list-subtitle'>
            Version {version.number} ({version.date})
          </span>

          <ul>
            {version.changes.map((change, index) => (
              <li
                className={isVersionGreater(version.number, this.lastSeenVersion) ? 'highlight' : ''}
                key={`version-${version.number}-${index}`}>
                {change}
              </li>
            ))}
          </ul>
        </li>
      ))
    )
  }

  render () {
    return (
      <React.Fragment>
        <div className='modal'>
          <div className='modal-header'>
            <h1 className='modal-title'>
              Changelog
            </h1>

            <button
              type='button'
              onClick={this.props.close}
              className='modal-button-close'>
              Close
            </button>
          </div>
          <div className='modal-body'>
            <ul>
              {this.renderChanges()}
            </ul>
          </div>
        </div>
        <div
          onClick={this.props.close}
          className='overflow-black' />
      </React.Fragment>
    )
  }
}
