import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class AlertProvider extends Component {
  static childContextTypes = {
    showAlert: PropTypes.func,
    showConfirmation: PropTypes.func,
    showDialog: PropTypes.func
  }

  getChildContext () {
    return {
      showAlert: this.showAlert,
      showConfirmation: this.showConfirmation,
      showDialog: this.showDialog
    }
  }

  state = {
    showing: null
  }

  showConfirmation = (message, confirmCallback) => {
    this.setState({
      showing: true,
      message,
      buttons: [
        {
          label: 'Confirm',
          callback: (hideDialog) => {
            confirmCallback()
            hideDialog()
          }
        },
        {
          label: 'Cancel',
          callback: (hideDialog) => hideDialog(),
          className: 'red',
          focused: true
        }
      ]
    }, () => {
      if (this.focusedButton) {
        this.focusedButton.focus()
      }
    })
  }

  showAlert = (message) => {
    this.setState({
      showing: true,
      message,
      buttons: [
        {
          label: 'Ok',
          callback: (hideDialog) => hideDialog(),
          focused: true
        }
      ]
    }, () => {
      if (this.focusedButton) {
        this.focusedButton.focus()
      }
    })
  }

  showDialog = (buttonsInfo) => {
    this.setState({
      showing: true,
      message: buttonsInfo.message,
      buttons: buttonsInfo.buttons
    }, () => {
      if (this.focusedButton) {
        this.focusedButton.focus()
      }
    })
  }

  renderActionButtons () {
    let buttons =
      this.state.buttons.map((button, index) => (
        <button
          key={`dialog-button-${index}`}
          ref={(el) => {
            if (button.focused) {
              this.focusedButton = el
            }
          }}
          onClick={() => button.callback(() => {
            this.setState({ showing: null })
            this.focusedButton = null
          })}
          type='button'
          className={`button-1 ${button.className || 'gray'}`}>
          {button.label}
        </button>
      ))

    return (
      <span>
        {buttons}
      </span>
    )
  }

  renderWindow () {
    if (!this.state.showing) { return }

    return (
      <div className='alert-1-container'>
        <div className='alert-1'>
          <div className='content'>
            {this.state.message}
          </div>

          <div className='alert-1-buttons'>
            {this.renderActionButtons()}
          </div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <React.Fragment>
        {this.renderWindow()}
        {this.props.children}
      </React.Fragment>
    )
  }
}
