import React, { Component } from 'react'
import NewGameForm from './newGameForm'
import Bank from './bank'
import AlertProvider from '../alertProvider'
import DynamicSizeCanvas from '../dynamicSizeCanvas'
import DeviceContext from '../deviceContext'
import ChangelogModal from '../shared/changelogModal'

export default class App extends Component {
  state = {
    showingChangelog: false
  }

  renderChangelogModal () {
    if (!this.state.showingChangelog) { return }

    return (
      <ChangelogModal
        close={() => this.setState({ showingChangelog: false })} />
    )
  }

  renderWarning () {
    if (!window.locked) { return }

    return (
      <div className='intro-main-form-container'>
        <h1 className='warning-title'>Warning</h1>

        <p className='high-load-warning'>
          Due to the high load at our servers at this moment, the new games are closed until the current rooms are finishing. We are working hard in our servers and app to allow everyone to play when they want. <a href={window.situationLink} target='_blank'>Read more about this situation clicking here</a>.
        </p>
      </div>
    )
  }

  renderNewGameForm () {
    if (window.locked) { return }

    return (
      <NewGameForm currentPlayer={this.props.currentPlayer} />
    )
  }

  render () {
    return (
      <DeviceContext>
        <AlertProvider>
          <DynamicSizeCanvas>
            <div className='main-call'>
              {this.renderChangelogModal()}
              <p className='beta-sign'>
                Beta
              </p>
              <h1 className='title'>
                Poker Now
              </h1>

              <p className='call'>
                No download and no register, just send the room link and play
              </p>
            </div>

            <a className='discord-home-link' target='_blank' href='https://discord.gg/EqPx5Pe'>
              join at our Discord channel
            </a>

            <p className='feedback-email'>
              <a target='_blank' href='http://poker-now-feedback.herokuapp.com'>Send your feedback!</a>
            </p>

            <div id='main-home-container'>
              {this.renderWarning()}
              {this.renderNewGameForm()}

              <div className='home-division'>
                <p>
                  Or
                </p>
              </div>

              <Bank currentPlayer={this.props.currentPlayer} />

              <div className='games-list-container'>
                <a href={window.NETWORK_PUBLIC_URL} className='home-sng-call-link'>
                  Join in our for fun <span>Sit & Go Tournaments</span>
                </a>
              </div>
              <a
                href='#'
                onClick={() => this.setState({ showingChangelog: true })}
                className='version-link version-link-in-home'>
                version {process.env.npm_package_version}
              </a>
            </div>
          </DynamicSizeCanvas>
        </AlertProvider>
      </DeviceContext>
    )
  }
}
