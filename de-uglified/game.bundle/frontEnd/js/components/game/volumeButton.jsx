import React, { Component } from 'react'
import { defineVolume } from '../../audio.js'
import { VOLUME_LEVELS } from '../../constants'

export default class VolumeButton extends Component {
  render () {
    return (
      <button
        className={`button-1 dark-gray small-button sound-control-button sound-${this.props.sound}`}
        onClick={() => {
          let currentVolume = VOLUME_LEVELS.find(level => level.name === this.props.sound)

          let nextLevel = VOLUME_LEVELS[VOLUME_LEVELS.indexOf(currentVolume) + 1]

          if (!nextLevel) {
            nextLevel = VOLUME_LEVELS[0]
          }

          defineVolume(nextLevel.name)

          this.props.updateSound(nextLevel.name)
        }}
        type='button'>
        Sound
      </button>
    )
  }
}
