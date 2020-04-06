import App from './components/home/app'
import PlayerProvider from './components/playerProvider'
import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { migratePreviousLocalToken } from './utils'

migratePreviousLocalToken()

const renderApp = () => {
  render(
    <AppContainer>
      <PlayerProvider playerID={window.playerID}>
        <App />
      </PlayerProvider>
    </AppContainer>,
    document.getElementById('main-container')
  )
}

renderApp()

if (module.hot) {
  module.hot.accept('./components/home/app', () => { renderApp() })
}
