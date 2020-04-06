import React, { Component } from 'react'
import Game from './game'
import ConfigPlayers from './configPlayers'
import ConfigGame from './configGame'
import ConfigPlayer from './configPlayer'
import ConfigRequestIngress from './configRequestIngress'
import ConfigPreferences from './configPreferences'
import SocketIO from 'socket.io-client'
import { currentPlayerData, gamePlayerData } from './utils'
import PropTypes from 'prop-types'
import { defineVolume } from '../../audio.js'
import axios from 'axios'
import eventListener from 'add-event-listener'

export default class App extends Component {
  static contextTypes = {
    showDialog: PropTypes.func
  }

  static childContextTypes = {
    getServerNowDifference: PropTypes.func,
    getServerNow: PropTypes.func
  }

  constructor () {
    super(...arguments)

    this.state = {
      screen: { name: 'game' },
      chat: [],
      showingMessages: {},
      intendedGameDecision: {}
    }

    defineVolume(this.props.currentPlayer.sound)
  }

  getChildContext () {
    return {
      getServerNowDifference: this.getServerNowDifference,
      getServerNow: this.getServerNow
    }
  }

  getServerNow = () => {
    const now = new Date()
    return new Date(now.getTime() - this.serverNowDifference)
  }

  startHeartBeat = () => {
    if (this.heartbeat) { return }

    this.heartbeat = setInterval(() => {
      let limit = (this.blurredAt + window.MAX_IDLE_HEARTBEAT_MS)
      let now = (new Date()).getTime()

      if (now < limit) {
        axios.post(`/games/${this.state.data.id}/idle_heartbeat`)
      }
    }, window.IDLE_HEARTBEAT_FREQUENCY_MS)
  }

  stopHeartBeat = () => {
    clearInterval(this.heartbeat)
  }

  startMonitorIdleSocket = () => {
    setInterval(() => {
      let limit = (this.blurredAt + window.LIMIT_TO_DISCONNECT_IDLE_FROM_SOCKET_MS)
      let now = (new Date()).getTime()

      if (this.blurredAt && now > limit) {
        this.socket.disconnect()
        this.startHeartBeat()
      }
    }, 2000)

    eventListener(window, 'blur', () => {
      this.blurredAt = (new Date()).getTime()
    })

    eventListener(window, 'focus', () => {
      this.stopHeartBeat()

      if (this.socket.disconnected) {
        this.socket.connect()
      }

      this.blurredAt = null
    })
  }

  componentDidMount () {
    this.socket = SocketIO('localhost:3001', {
      transports: ['websocket'],
      query: { gameID: window.location.pathname.split('/')[2] }
    })

    this.socket.on('gameChanged', this.onGameChange)

    this.socket.on('newChatMessage', this.addChatMessage)

    this.socket.on('connect', () => this.setState({ disconnected: false }))

    this.socket.on('disconnect', () => this.setState({ disconnected: true }))

    setTimeout(() =>
      this.addChatMessage({
        at: (new Date()),
        playerName: 'Poker Now',
        message: 'Join in our <a target="_blank" href="https://discord.gg/GP6ccu4">Discord Server</a> and find games, send your feedback and more!',
        feedbackMessage: true
      })
    , 300000)

    setTimeout(() =>
      this.addChatMessage({
        at: (new Date()),
        playerName: 'Poker Now',
        message: 'Are you liking Poker Now? You can make a donation at our <a target="_blank" href="https://www.patreon.com/poker_now">Patreon</a>!',
        feedbackMessage: true
      })
    , 600000)

    this.startWatchToHideMessages()

    this.startMonitorIdleSocket()
  }

  startWatchToHideMessages () {
    setInterval(() => {
      let now = (new Date()).getTime()
      let showingMessages = { ...this.state.showingMessages }
      let setState = false

      for (let playerID in showingMessages) {
        if (now >= showingMessages[playerID].hideAt) {
          setState = true
          delete showingMessages[playerID]
        }
      }

      if (setState) {
        this.setState({ showingMessages })
      }
    }, 300)
  }

  addChatMessage = (message) => {
    let showingMessages = { ...this.state.showingMessages }

    if (message.playerID && message.playerID !== this.props.currentPlayer.id) {
      let content = message.message

      if (content.length > 30) {
        content = `${content.substring(0, 30)}…`
      }

      showingMessages[message.playerID] = {
        content,
        hideAt: ((new Date()).getTime() + 2300 + (message.message.split(' ').length * 300))
      }
    }

    this.setState({
      showingMessages,
      disconnected: false,
      chat: [...this.state.chat, message].slice(-100)
    })
  }

  onGameChange = (data) => {
    if (data.version && process.env.npm_package_version !== data.version) {
      return window.location.reload()
    }

    this.memoizeTimeDifferenceFromServer(data.serverNow)

    this.setState({ data, disconnected: false }, this.afterUpdateGameState)
  }

  afterUpdateGameState = () => {
    this.checkTournamentEndMessage()

    this.clearIntendedStaleAction()

    setTimeout(this.executeIntendedGameDecision, 0)
  }

  checkTournamentEndMessage = () => {
    if (this.state.data.mode !== 'tournament') { return }

    if (this.alreadyAnnouncedTournamentEnd) { return }

    let players = Object.entries(this.state.data.playersRank)

    let playerPosition = players.find(player => player[1] === this.props.currentPlayer.id)

    if (!playerPosition) { return }

    this.alreadyAnnouncedTournamentEnd = true

    let message = `You finished this tournament at position ${playerPosition[0]}. Go to Poker Now tournaments to see your points and rank!`

    this.context.showDialog({
      message,
      buttons: [
        {
          label: 'Ok',
          callback: (hideDialog) => {
            this.setState({ gameMountMessage: null })
            hideDialog()
          }
        },
        {
          label: 'Go to Tournaments',
          callback: () => {
            window.location = window.NETWORK_PUBLIC_URL
          }
        }
      ]
    })
  }

  clearIntendedStaleAction = () => {
    if (!this.state.intendedGameDecision) { return }

    if (
      this.state.intendedGameDecision.type === 'CHECK_OR_FOLD' &&
      this.state.intendedGameDecision.forHand === this.state.data.gameNumber &&
      this.state.intendedGameDecision.forGameTurn === this.state.data.gameTurn &&
      !this.state.data.withBetAllowedCheckPlayersIDs.includes(this.props.currentPlayer.id) &&
      this.state.data.currentHigherBet
    ) {
      return this.setState({
        intendedGameDecision: {
          ...this.state.intendedGameDecision,
          type: 'PLAYER_FOLD'
        }
      })
    }

    if (
      this.state.intendedGameDecision.forHand !== this.state.data.gameNumber ||
      this.state.intendedGameDecision.forGameTurn !== this.state.data.gameTurn ||
      (
        this.state.intendedGameDecision.type === 'PLAYER_CALL' &&
        this.state.intendedGameDecision.forCurrentHigherBet !== this.state.data.currentHigherBet
      )
    ) {
      this.setState({ intendedGameDecision: {} })
    }
  }

  executeIntendedGameDecision = () => {
    if (
      this.state.data.playerIDToTalk !== this.props.currentPlayer.id ||
      !this.state.intendedGameDecision
    ) { return }

    let intendedGameDecision = this.state.intendedGameDecision

    this.setState({ intendedGameDecision: {} }, () => {
      if (intendedGameDecision.type === 'CHECK_OR_FOLD') {
        intendedGameDecision.type = 'PLAYER_CHECK'
      }

      if (intendedGameDecision.type === 'CALL_ANY') {
        intendedGameDecision.type = (
          !this.state.data.currentHigherBet ||
          this.state.data.withBetAllowedCheckPlayersIDs.includes(this.props.currentPlayer.id)
        ) ? 'PLAYER_CHECK' : 'PLAYER_CALL'
      }

      this.submitAction(intendedGameDecision)
    })
  }

  submitGameDecision = (decision) => {
    if (this.state.data.playerIDToTalk === this.props.currentPlayer.id) {
      this.submitAction(decision)
    } else {
      let intendedGameDecision = {
        ...decision,
        forGameTurn: this.state.data.gameTurn,
        forHand: this.state.data.gameNumber
      }

      if (intendedGameDecision.type === 'PLAYER_CALL') {
        intendedGameDecision.forCurrentHigherBet = this.state.data.currentHigherBet
      }

      this.setState({ intendedGameDecision })
    }
  }

  memoizeTimeDifferenceFromServer (serverNow) {
    serverNow = new Date(serverNow)
    const now = new Date()
    this.serverNowDifference = (now.getTime() - serverNow.getTime())
  }

  getServerNowDifference = () => {
    return this.serverNowDifference
  }

  submitMessage = (message) => {
    this.blurredAt = null
    return this.socket.binary(false).emit('new-message', message)
  }

  submitAction = (payload) => {
    if (!Object.keys(payload).length) { return }

    if (!this.state.data) { return }

    this.blurredAt = null

    this.socket.binary(false).emit(
      'action',
      {
        ...payload,
        version: this.state.data.version
      }
    )
  }

  openScreen = (screen) => this.setState({ screen })

  render () {
    if (!this.state.data) {
      return <p className='connecting-warning'>Connecting…</p>
    }

    let player =
      currentPlayerData(this.props.currentPlayer, this.state.data)

    if (this.state.screen.name === 'game') {
      return (
        <Game
          disconnected={this.state.disconnected}
          intendedGameDecision={this.state.intendedGameDecision}
          gameMountMessage={this.state.gameMountMessage}
          submitGameDecision={this.submitGameDecision}
          showingMessages={this.state.showingMessages}
          chat={this.state.chat}
          game={this.state.data}
          openScreen={this.openScreen}
          submitMessage={this.submitMessage}
          submitAction={this.submitAction}
          currentPlayer={player} />
      )
    } else if (this.state.screen.name === 'configsPreferences') {
      return (
        <ConfigPreferences
          game={this.state.data}
          currentPlayer={player}
          openScreen={this.openScreen} />
      )
    } else if (this.state.screen.name === 'configsGame') {
      return (
        <ConfigGame
          game={this.state.data}
          currentPlayer={player}
          openScreen={this.openScreen} />
      )
    } else if (this.state.screen.name === 'configPlayers') {
      return (
        <ConfigPlayers
          currentPlayer={player}
          game={this.state.data}
          openScreen={this.openScreen} />
      )
    } else if (this.state.screen.name === 'requestIngress') {
      return (
        <ConfigRequestIngress
          currentPlayer={player}
          game={this.state.data}
          openScreen={this.openScreen} />
      )
    } else if (this.state.screen.name === 'configPlayer') {
      player = gamePlayerData(this.state.data, this.state.screen.playerID)

      return (
        <ConfigPlayer
          player={player}
          game={this.state.data}
          submitAction={this.submitAction}
          openScreen={this.openScreen}
          currentPlayer={this.props.currentPlayer} />
      )
    }
  }
}
