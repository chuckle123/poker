import twoTapsSoundMP3 from '../sounds/two-taps.mp3'
import chipsSoundMP3 from '../sounds/chips.mp3'
import beepMP3 from '../sounds/beep.mp3'
import foldMP3 from '../sounds/fold.mp3'
import cardPlaceMP3 from '../sounds/card-place.mp3'
import { VOLUME_LEVELS } from './constants'
import { Howl, Howler } from 'howler'

export const CHECK_AUDIO = new Howl({ src: [twoTapsSoundMP3] })
export const CHIPS_AUDIO = new Howl({ src: [chipsSoundMP3] })
export const BEEP_AUDIO = new Howl({ src: [beepMP3] })
export const FOLD_AUDIO = new Howl({ src: [foldMP3] })
export const CARD_PLACE_AUDIO = new Howl({ src: [cardPlaceMP3] })
export function defineVolume (level) {
  if (!level) {
    level = 'med'
  }

  let currentVolume = VOLUME_LEVELS.find(i => i.name === level)

  Howler.volume(currentVolume.volume)
}
