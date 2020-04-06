import React from 'react'

export function onlyNumbers (value) {
  return value.replace(/[^0-9]/g, '')
}

export function renderErrorMessage (error) {
  return error ? <span className='error-message'>{error}</span> : null
}

function renderCardBody (card) {
  return (
    <React.Fragment>
      <span className='value'>
        {card[0] === 'T' ? '10' : card[0]}
      </span>
      <span className='suit'>
        {card[1]}
      </span>
    </React.Fragment>
  )
}

export function renderSingleCard (card, position, local) {
  return (
    <div
      key={`${local}-${card}`}
      className={`card card-${card[1]} card-p${position + 1}`}>
      {renderCardBody(card)}
    </div>
  )
}

export function renderFlipperCard (card, position, local, flipped, className) {
  return (
    <div
      key={`${local}-${card}`}
      className={`card-container card-${card[1]} card-p${position + 1} ${flipped ? 'flipped' : ''} ${className}`}>
      <div className='card-flipper'>
        <div className='front' />
        <div className='card'>
          {renderCardBody(card)}
        </div>
      </div>
    </div>
  )
}

export function gamePlayerData (game, playerID) {
  let gamePlayerData = game.players[playerID]

  gamePlayerData = {
    ...gamePlayerData,
    isOwner: (game.ownerID === playerID)
  }

  if (game.status === 'waiting') {
    return {
      ...gamePlayerData,
      gameStatus: 'waiting',
      turnSituation: 'waiting'
    }
  }

  let gameStatus = game.playersGameStatus[playerID]
  let gameResult = game.gameResult ? game.gameResult[playerID] : null
  let cards = game.playersCards[playerID] ? game.playersCards[playerID].cards : null
  let turnSituation = 'waiting'

  if (game.currentPlayerID === playerID) {
    turnSituation = 'deciding'
  }

  return {
    ...gamePlayerData,
    gameResult,
    currentBet: game.turnBets[playerID],
    cards,
    isDealer: (game.dealerID === playerID),
    isBigBlind: (game.bigBlindPlayerID === playerID),
    actionStartedAt: (game.playerIDToTalk === playerID) ? game.playerActionStartedAt : null,
    gameStatus,
    turnSituation,
    isQuiting: gamePlayerData.status === 'quiting'
  }
}

export function currentPlayerData (localPlayerData, game) {
  let showingHand = (game.playersCards[localPlayerData.id] && !game.playersCards[localPlayerData.id].hiding)

  return {
    ...localPlayerData,
    ...gamePlayerData(game, localPlayerData.id),
    showingHand
  }
}

export function gameDecisionRules (game, currentPlayer) {
  const allowBigBlindCheck = game.withBetAllowedCheckPlayersIDs.includes(currentPlayer.id)
  const showRaise =
    (game.playerIDToTalk === currentPlayer.id &&
     !game.couldntRaiserPlayerIDs.includes(currentPlayer.id) &&
     currentPlayer.stack > game.currentHigherBet)
  const showCheck = (
    game.currentHigherBet === 'check' ||
    game.currentHigherBet === 0 ||
    allowBigBlindCheck
  )
  const showCall = (
    currentPlayer.gameStatus !== 'allIn' &&
    game.currentHigherBet !== currentPlayer.currentBet &&
    (
      game.playerIDToTalk === currentPlayer.id ||
      game.currentHigherBet
    )
  )
  const showFold = (
    currentPlayer.gameStatus !== 'allIn'
  )
  const showCheckOrFoldButton = (
    game.playerIDToTalk !== currentPlayer.id &&
    currentPlayer.gameStatus !== 'allIn' &&
    (
      !game.currentHigherBet ||
      game.withBetAllowedCheckPlayersIDs.includes(currentPlayer.id)
    )
  )
  const showCallAny = (game.playerIDToTalk !== currentPlayer.id)

  return {
    showCallAny,
    showCheckOrFoldButton,
    showFold,
    showRaise,
    showCheck,
    showCall
  }
}

export function gameTableControlsRules (game, currentPlayer) {
  const showStartGame =
    (currentPlayer.isOwner && Object.values(game.players).filter(player => player.status === 'inGame').length > 1 && game.status === 'waiting')
  const showGameDecision =
    (
      currentPlayer.status === 'inGame' &&
      currentPlayer.gameStatus !== 'fold' &&
      currentPlayer.gameStatus !== 'allIn' &&
      game.status !== 'waiting' &&
      ![
        'NEXT_STEP_AFTER_ACTION_DELAYED',
        'NEXT_STEP_AFTER_GAME_RESULT',
        'NEXT_STEP_AFTER_SHOWDOWN'
      ].includes(game.scheduledNextAction)
    )
  const showShowHandButton = (
    (
      ['gameResult', 'showdown'].includes(game.gameTurn) ||
      (['allIn', 'inGame'].includes(currentPlayer.gameStatus) && game.directToNexTurn)
    ) &&
    currentPlayer.status === 'inGame' &&
    !currentPlayer.showingHand
  )

  return {
    showCancelRequestIngress: (currentPlayer.status === 'requestedGameIngress' && !currentPlayer.isOwner),
    showInvite: (currentPlayer.isOwner && game.seats.length === 1 && currentPlayer.status === 'inGame'),
    showGameDecision,
    showStartGame,
    showGameControl: (showStartGame),
    showChat: !showGameDecision,
    showShowHandButton
  }
}

export function initialBetValue (maxAllowedValueToBet, higherBet, playerStack, bigBlind, minimumRaise) {
  if (playerStack <= (higherBet || bigBlind)) {
    return playerStack
  }

  if (higherBet) {
    if (minimumRaise > playerStack) {
      return playerStack
    } else {
      return minimumRaise
    }
  }

  if (playerStack >= (higherBet || bigBlind)) {
    return (higherBet || bigBlind)
  }

  if (maxAllowedValueToBet < bigBlind) {
    return maxAllowedValueToBet
  }

  return higherBet || bigBlind
}

export function canBet (value, maxAllowedValueToBet, higherBet, playerStack, bigBlind, minimumRaise) {
  if (playerStack <= (higherBet || bigBlind)) {
    return value === playerStack
  }

  if (value === maxAllowedValueToBet) {
    return true
  }

  if (maxAllowedValueToBet < bigBlind) {
    return value === maxAllowedValueToBet
  }

  if (value > playerStack) {
    return false
  }

  if (value === (higherBet || bigBlind)) {
    return true
  }

  if (value !== playerStack && value > higherBet && value < minimumRaise) {
    return false
  }

  if (value > maxAllowedValueToBet) {
    return false
  }

  if (value < (higherBet || bigBlind)) {
    return false
  }

  return true
}
