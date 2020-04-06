import React, { Component } from 'react'
import Table from './table'
import Controls from './controls'
import { gameTableControlsRules } from './utils'
import InGameLog from './inGameLog'
import QuitButton from './quitButton'
import {
  presentLumensValue,
  shouldShowTheChangelongModal
} from '../../utils'
import TableConfigButton from './tableConfigButton'
import FullScreenButton from './fullScreenButton'
import ChangelogModal from '../shared/changelogModal'
import ClubSignal from '../shared/clubSignal'
import PropTypes from 'prop-types'
import VolumeButton from './volumeButton'
import NextBlindSignal from './nextBlindSignal'

export default class Game extends Component {
  static contextTypes = {
    updatePlayer: PropTypes.func
  }

  constructor () {
    super(...arguments)

    this.state = {
      showingLog: false,
      showingChangelog: shouldShowTheChangelongModal(
        window.localStorage.getItem('lastSeenVersion') || '0.0.0'
      )
    }
  }

  renderSitOutButton () {
    if (!['inGame', 'waitingNextGameToEnter'].includes(this.props.currentPlayer.status)) { return }

    if (this.props.game.mode === 'tournament') { return }

    return (
      <button
        className='top-buttons-button stand-up'
        onClick={() => this.props.submitAction({ type: 'PLAYER_STAND_UP' })}
        type='button'>
        Stand Up
      </button>
    )
  }

  renderSitBackButton () {
    if (this.props.currentPlayer.status !== 'standingUp') { return }

    return (
      <button
        className='top-buttons-button sit-back'
        onClick={() => this.props.submitAction({ type: 'PLAYER_SIT_BACK' })}
        type='button'>
        Sit Back
      </button>
    )
  }

  renderQuitButton () {
    if (!['inGame', 'standingUp'].includes(this.props.currentPlayer.status) ||
        this.props.currentPlayer.isQuiting) { return }

    if (this.props.game.mode === 'tournament' && this.props.game.gameNumber === 0) { return }

    return (
      <QuitButton
        gameID={this.props.game.id}
        currentPlayer={this.props.currentPlayer} />
    )
  }

  renderLog () {
    if (!this.state.showingLog) { return }

    return (
      <InGameLog
        close={() => this.setState({ showingLog: false })}
        gameID={this.props.game.id} />
    )
  }

  renderChangelogModal () {
    if (!this.state.showingChangelog) { return }

    return (
      <ChangelogModal
        close={() => this.setState({ showingChangelog: false })} />
    )
  }

  renderBigBlindIncreaseTime () {
    if (!this.props.game.nextBigBlind) { return }

    return (
      <NextBlindSignal
        nextBigBlind={this.props.game.nextBigBlind}
        increaseBlindAt={this.props.game.increaseBlindAt} />
    )
  }

  renderDisconnectedWarning = () => {
    if (!this.props.disconnected) { return }

    return (
      <div className='disconnect-warning'>
        Disconnected from the server, trying to reconnect…
      </div>
    )
  }

  renderClubUserSignal () {
    if (!this.props.currentPlayer.clubName) { return }

    return (
      <ClubSignal currentPlayer={this.props.currentPlayer} />
    )
  }

  render () {
    const controlRules = gameTableControlsRules(this.props.game, this.props.currentPlayer)

    const deckSchema = this.props.currentPlayer.deckStyle === 'four-color' ? 'four-color' : 'two-color'

    return (
      <div className={`main-container ${deckSchema}`}>
        {this.renderClubUserSignal()}

        {this.renderDisconnectedWarning()}

        {this.renderChangelogModal()}

        <div className='top-buttons'>
          <React.Fragment>
            {this.renderConfigButton()}
            {this.renderQuitButton()}
            {this.renderSitOutButton()}
            {this.renderSitBackButton()}
          </React.Fragment>
        </div>
        {this.renderLog()}
        <FullScreenButton />

        <p className='blind-value'>
          Blind {this.props.game.smallBlind} / {this.props.game.bigBlind}
          {this.renderBigBlindIncreaseTime()}
          {this.renderChipPrice()}
        </p>

        <Table
          submitAction={this.props.submitAction}
          showingMessages={this.props.showingMessages}
          showInvite={controlRules.showInvite}
          currentPlayer={this.props.currentPlayer}
          game={this.props.game} />

        <VolumeButton
          updateSound={(sound) => this.context.updatePlayer({ sound })}
          sound={this.props.currentPlayer.sound} />

        <Controls
          openChangelogModal={() => this.setState({ showingChangelog: true })}
          intendedGameDecision={this.props.intendedGameDecision}
          submitGameDecision={this.props.submitGameDecision}
          submitMessage={this.props.submitMessage}
          chat={this.props.chat}
          submitAction={this.props.submitAction}
          currentPlayer={this.props.currentPlayer}
          rules={controlRules}
          openScreen={this.props.openScreen}
          openLog={() => this.setState({ showingLog: true })}
          game={this.props.game} />
      </div>
    )
  }

  renderChipPrice () {
    if (!this.props.game.lumensChipValue) { return }

    return (
      <span className='chip-price'>
        <br />
        Chip Price: {presentLumensValue(this.props.game.lumensChipValue)}xlm
      </span>
    )
  }

  renderConfigButton () {
    let destiny = this.props.currentPlayer.isOwner ? 'configPlayers' : 'configsPreferences'

    return (
      <TableConfigButton
        showPendingCount={this.props.currentPlayer.isOwner}
        openOptions={() => this.props.openScreen({ name: destiny })}
        players={Object.values(this.props.game.players)} />
    )
  }
}
