import React, { Component } from 'react'
import Chat from './chat'
import ShowHandButton from './showHandButton'
import GameDecision from './gameDecision'
import CancelIngressRequestButton from './cancelIngressRequestButton'
import { gameDecisionRules } from './utils'

export default class GameControls extends Component {
  constructor () {
    super(...arguments)

    this.state = {
      showingRaise: false,
      showingChatMessage: false
    }
  }

  render () {
    let className = 'controls'

    return (
      <div className={className}>
        {this.renderChatAndLog()}
        {this.renderGameControl()}
        {this.renderGameDecision()}
      </div>
    )
  }

  renderChatAndLog () {
    if (this.state.showingRaise) { return }

    return (
      <div className='chat-and-log-ctn'>
        <a
          href='#'
          onClick={this.props.openChangelogModal}
          className='version-link version-link-in-game'>
          version {process.env.npm_package_version}
        </a>
        {this.renderShowLogButton()}
        {this.renderChat()}
      </div>
    )
  }

  renderChat () {
    return (
      <Chat
        submitMessage={this.props.submitMessage}
        chat={this.props.chat}
        onChangeMessageVisibility={(visible) => this.setState({
          showingChatMessage: visible
        })}
        currentPlayer={this.props.currentPlayer}
        gameID={this.props.game.id} />
    )
  }

  renderShowLogButton () {
    return (
      <button
        onClick={this.props.openLog}
        className='button-1 show-log-button small-button dark-gray'
        type='button'>
        Log
      </button>
    )
  }

  renderGameDecision () {
    const { rules, game, submitGameDecision, currentPlayer, intendedGameDecision } = this.props

    if (!rules.showGameDecision) { return }

    return (
      <span className={(game.playerIDToTalk === currentPlayer.id ? '' : 'low')}>
        <GameDecision
          game={game}
          intendedGameDecision={intendedGameDecision}
          rules={gameDecisionRules(game, currentPlayer)}
          showRaise={rules.showRaiseControl}
          applyHotKeys={!this.state.showingChatMessage}
          onChangeRaiseVisibility={(visible) => this.setState({ showingRaise: visible })}
          submitAction={this.props.submitAction}
          submitGameDecision={submitGameDecision}
          currentPlayer={currentPlayer} />
      </span>
    )
  }

  renderGameControl () {
    return (
      <div className={`action-buttons right-controls`}>
        {this.renderStartGame()}
        {this.renderCancelRequestIngress()}
        {this.renderShowHandButton()}
      </div>
    )
  }

  showHand = () => {
    this.props.submitAction({ type: 'SHOW_HAND' })
  }

  renderShowHandButton () {
    if (!this.props.rules.showShowHandButton) { return }

    return (
      <ShowHandButton
        nextActionAt={this.props.game.scheduledNextActionAt}
        nextAction={this.props.game.scheduledNextAction}
        applyHotKeys={!this.state.showingChatMessage}
        onClick={this.showHand} />
    )
  }

  renderCancelRequestIngress () {
    const { rules } = this.props

    if (!rules.showCancelRequestIngress) { return }

    return (
      <CancelIngressRequestButton
        gameID={this.props.game.id}
        currentPlayer={this.props.currentPlayer} />
    )
  }

  renderStartGame () {
    const { submitAction, rules } = this.props

    if (!rules.showStartGame) { return }

    return (
      <button
        className='button-1 green'
        onClick={() => submitAction({ type: 'GAME_START' })}
        type='button'>
        Start Game
      </button>
    )
  }
}
