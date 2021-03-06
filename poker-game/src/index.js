import App from './components/game/app'
import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import PlayerProvider from './components/playerProvider'
import DynamicSizeCanvas from './components/dynamicSizeCanvas'
import DeviceContext from './components/deviceContext'
import DeviceLandscapeWarning from './components/deviceLandscapeWarning'
import AlertProvider from './components/alertProvider'
import { migratePreviousLocalToken } from './utils'

import './style.css';

migratePreviousLocalToken()

const renderApp = () => {
  render(
    <AppContainer>
      <DeviceContext>
        <DeviceLandscapeWarning>
          <DynamicSizeCanvas>
            <AlertProvider>
              <PlayerProvider
                username={window.playerUsername}
                clubName={window.clubName}
                playerID={window.playerID}
                pncUserID={window.pncUserID}>
                <App />
              </PlayerProvider>
            </AlertProvider>
          </DynamicSizeCanvas>
        </DeviceLandscapeWarning>
      </DeviceContext>
    </AppContainer>,
    document.getElementById('main-container')
  )
}

renderApp()

if (module.hot) {
  module.hot.accept('./components/game/app', () => { renderApp() })
}
