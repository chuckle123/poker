import { VERSIONS } from './constants'

let initialPreviousHeight

function androidScreenSize (windowObj) {
  let availableHeight = windowObj.innerHeight
  let availableWidth = windowObj.innerWidth

  if (windowObj.screen.orientation.type.includes('landscape')) {
    availableHeight = windowObj.screen.height
    availableWidth = windowObj.screen.width

    if (!initialPreviousHeight && windowObj.outerHeight < windowObj.outerWidth) {
      initialPreviousHeight = windowObj.outerHeight
    }

    if (initialPreviousHeight && initialPreviousHeight < windowObj.outerHeight) {
      availableHeight = windowObj.outerHeight
    }
  }

  return {
    availableHeight,
    availableWidth
  }
}

function iOSScreenSize (windowObj) {
  let availableHeight
  let availableWidth

  if (Math.abs(windowObj.orientation) === 90) {
    availableHeight = windowObj.screen.width + 10
    availableWidth = windowObj.screen.height
  } else {
    availableHeight = windowObj.screen.height
    availableWidth = windowObj.screen.width
  }

  return {
    availableHeight,
    availableWidth
  }
}

function defaultScreenSize (windowObj) {
  return {
    availableHeight: windowObj.innerHeight,
    availableWidth: windowObj.innerWidth
  }
}

export function calculateCanvasSize (windowObj, isIOS, isAndroid) {
  let screenDimensions

  if (isAndroid) {
    screenDimensions = androidScreenSize(windowObj)
  }

  if (isIOS) {
    screenDimensions = iOSScreenSize(windowObj)
  }

  if (!screenDimensions) {
    screenDimensions = defaultScreenSize(windowObj)
  }

  let necessaryHeight = (screenDimensions.availableWidth * 56.25) / 100

  let result = {}

  if (necessaryHeight <= screenDimensions.availableHeight) {
    result.width = screenDimensions.availableWidth
    result.height = necessaryHeight
  } else {
    let usableWidth = (100 * screenDimensions.availableHeight) / 56.25

    result.width = usableWidth
    result.height = screenDimensions.availableHeight
  }

  let tableHeight = (result.height * 80) / 100

  result.marginTop = (screenDimensions.availableHeight - result.height) / 2
  result.marginLeft = (screenDimensions.availableWidth - result.width) / 2
  result.fontSize = (tableHeight * 4 / 100)

  return result
}

export function presentLumensValue (value) {
  return value.toFixed(7).replace(/0+0$|0$/, '').replace(/\.$/, '')
}

export function isVersionGreater (versionA, versionB) {
  versionA = versionA.split('.').map(number => parseInt(number, 10))
  versionB = versionB.split('.').map(number => parseInt(number, 10))

  return (
    versionA[0] > versionB[0] ||
    versionA[1] > versionB[1] ||
    versionA[2] > versionB[2]
  )
}

export function shouldShowTheChangelongModal (lastSeenVersion) {
  for (let i = 0; i < VERSIONS.length; i++) {
    let version = VERSIONS[i]

    if (isVersionGreater(version.number, lastSeenVersion)) {
      return true
    }
  }

  return false
}

export function presentMinutesFromMiliseconds (milliseconds) {
  let seconds = Math.floor((milliseconds / 1000) % 60)
  let minutes = Math.floor((milliseconds / (1000 * 60)) % 60)

  if (milliseconds <= 0) {
    return '00:00'
  }

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export function migratePreviousLocalToken () {
  let currentPlayerData = JSON.parse(window.localStorage.getItem('currentPlayer')) || {}

  if (window.location.search.includes('token_converted')) {
    currentPlayerData.previousToken = currentPlayerData.token

    delete currentPlayerData.token

    window.localStorage.setItem('currentPlayer', JSON.stringify(currentPlayerData))

    window.location = window.location.href.replace(/([?|&]token_converted=true)/, '')

    return
  }

  if (currentPlayerData.token) {
    window.location = `/convert-local-token?token=${currentPlayerData.token}&back_to=${encodeURIComponent(window.location.href)}`
  }
}
