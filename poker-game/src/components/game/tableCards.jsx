import React, { Component } from 'react'
import { renderFlipperCard } from './utils'
import { Hand } from 'pokersolver'
import { deepEqual as equals } from 'fast-equals'
import { CARD_PLACE_AUDIO } from '../../audio'

export default class TableCards extends Component {
  state = {
    flipped: []
  }

  shouldComponentUpdate (nextProps, nextState) {
    this.updatedCards = !equals(this.props.cards, nextProps.cards)
    this.updatedFlipped = !equals(this.state.flipped, nextState.flipped)
    this.updatedGameResult = !equals(this.props.gameResult, nextProps.gameResult)

    return (
      this.updatedCards ||
      this.updatedFlipped ||
      this.updatedGameResult
    )
  }

  componentWillMount () {
    this.highlightCards = this.getHighlightCards(this.props.gameResult, this.props.cards)
  }

  componentDidMount () {
    if (this.props.cards.length > 1) {
      this.setState({ flipped: this.props.cards })
    }
  }

  getHighlightCards = (gameResult, cards) => {
    if (!gameResult || cards.length !== 5) { return }

    let winnerHand

    for (let playerID in gameResult) {
      if (gameResult[playerID].position === 1 && gameResult[playerID].hand) {
        winnerHand = gameResult[playerID].hand
      }
    }

    if (!winnerHand) { return }

    const solve = Hand.solve([...cards, ...winnerHand])

    return solve.cards.map(card => `${card.value}${card.suit}`)
  }

  componentWillUpdate = (nextProps, nextState) => {
    if (this.updatedCards || this.updatedGameResult) {
      this.highlightCards = this.getHighlightCards(nextProps.gameResult, nextProps.cards)
    }
  }

  componentDidUpdate = (prevProps) => {
    if (!this.updatedCards) {
      return
    }

    if (!this.props.cards.length) {
      this.setState({ flipped: [] })
      return
    }

    let newCards = this.props.cards.filter(card => !prevProps.cards.includes(card))

    this.setState({ newCards: newCards })

    if (!newCards.length) { return }

    if (this.interval) { return }

    let lastCardFlipped = (new Date()).getTime()

    this.interval = setInterval(() => {
      let now = (new Date()).getTime()

      if ((now - lastCardFlipped) >= 100) {
        lastCardFlipped = (new Date()).getTime()

        this.flipCard(newCards.shift())

        if (!newCards.length) {
          clearInterval(this.interval)
          delete this.interval
        }
      }
    }, 40)
  }

  flipCard (card) {
    CARD_PLACE_AUDIO.play()
    this.setState({ flipped: this.state.flipped.concat(card) })
  }

  isFlipped (card) {
    return !window.chrome || this.state.flipped.includes(card)
  }

  renderCard = (card, index) => {
    let className = ''

    if (this.highlightCards && !this.highlightCards.includes(card)) {
      className += ' hide '
    }

    return (
      renderFlipperCard(card, index, 'table', this.isFlipped(card), className)
    )
  }

  render () {
    return (
      <div className='table-cards'>
        {this.props.cards.map(this.renderCard)}
      </div>
    )
  }
}
