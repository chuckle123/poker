import React, { Component } from 'react'
import { Hand } from 'pokersolver'
import { renderFlipperCard } from './utils'
import { deepEqual as equals } from 'fast-equals'

export default class TablePlayerHand extends Component {
  shouldComponentUpdate (nextProps) {
    return !equals(this.props.data, nextProps.data)
  }

  handName = () => {
    if (!this.solvedHand) { return }

    return this.solvedHand.name
  }

  getSolvedHand = () => {
    if (!this.props.data.cards) { return null }

    let allCards = this.props.data.cards.concat(this.props.data.tableCards)

    return Hand.solve(allCards)
  }

  highlightCards = () => {
    if (this.solvedHand == null || this.props.data.tableCards.length !== 5 || !this.props.data.isWinner) { return }

    return this.solvedHand.cards.map(card => `${card.value}${card.suit}`)
  }

  render () {
    let cards

    this.solvedHand = this.getSolvedHand()

    let highlightCards = this.highlightCards()

    if (this.props.data.cards) {
      cards = this.props.data.cards.map(card =>
        renderFlipperCard(
          card,
          this.props.data.cards.indexOf(card),
          `hand-${this.props.data.playerID}`,
          true,
          `${highlightCards && !highlightCards.includes(card) ? 'hide' : ''}`
        )
      )
    } else {
      cards = [
        renderFlipperCard('As', 0, `hand-${this.props.data.playerID}`, false),
        renderFlipperCard('Qs', 1, `hand-${this.props.data.playerID}`, false)
      ]
    }

    let className = 'table-player-cards'
    let message = this.props.data.message

    if (this.props.data.blackWhite) {
      className += ' black-and-white '
    }

    let handName = this.handName()

    if (handName) {
      message = handName
    }

    return (
      <div className={className}>
        {message && <p className='message'>{message}</p>}
        {cards}
      </div>
    )
  }
}
