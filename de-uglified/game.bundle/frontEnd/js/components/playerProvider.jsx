import React, { Component } from 'react'
import PropTypes from 'prop-types'

function fetchPlayer () {
  let playerData = {}

  try {
    playerData = JSON.parse(window.localStorage.getItem('currentPlayer'))
  } catch (e) {}

  playerData = {
    sound: 'med',
    deckStyle: 'two-color',
    ...playerData,
    version: 1
  }

  try {
    window.localStorage.setItem('currentPlayer', JSON.stringify(playerData))
  } catch (e) {}

  return playerData
}

function persistPlayer (userData) {
  let player = fetchPlayer()

  delete userData.version
  delete userData.id

  let payload = { ...player, ...userData }

  try {
    window.localStorage.setItem('currentPlayer', JSON.stringify(payload))
  } catch (e) {}
}

function loadPlayer (playerData) {
  let player = fetchPlayer()

  player = {
    ...player,
    ...playerData
  }

  return player
}

export default class PlayerProvider extends Component {
  static childContextTypes = {
    updatePlayer: PropTypes.func
  }

  getChildContext () {
    return {
      updatePlayer: this.updatePlayer
    }
  }

  constructor () {
    super(...arguments)

    let player = loadPlayer({
      id: this.props.playerID,
      pncUserID: this.props.pncUserID,
      name: this.props.username,
      clubName: this.props.clubName
    })

    this.state = {
      currentPlayer: player
    }
  }

  updatePlayer = (data) => {
    persistPlayer(data)

    this.setState({ currentPlayer: { ...this.state.currentPlayer, ...data } })
  }

  render () {
    return (
      React.cloneElement(
        this.props.children,
        { currentPlayer: this.state.currentPlayer }
      )
    )
  }
}
