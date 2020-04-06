import React from 'react'

export const VOLUME_LEVELS = [
  { name: 'off', volume: 0 },
  { name: 'med', volume: 0.25 },
  { name: 'high', volume: 1 }
]

export const VERSIONS = [
  {
    number: '0.1.45',
    date: '03/25/2020',
    changes: [
      <span>
        If the Poker Now system needs to restart, we will pause the games before the restart to avoid the last days' annoyance.
      </span>,
      <span>
        Some other internal adjustments. We are working hard to offer to you the best experience. You can read the full situation <a target='_blank' href={window.situationLink}>clicking here</a>.
      </span>
    ]
  },
  {
    number: '0.1.44',
    date: '03/19/2020',
    changes: [
      <span>
        Some internal performance improvements to these quarantine days.
      </span>
    ]
  },
  {
    number: '0.1.43',
    date: '03/14/2020',
    changes: [
      <span>
        <strong>Full log:</strong> now you can check your full game log instead of the last 100 entries. But it will be available for a limited time. I am working to allow download the full log.
      </span>,
      <span>
        <strong>More complete log:</strong> now the log shows to you a lot of new game events.
      </span>
    ]
  },
  {
    number: '0.1.42',
    date: '03/12/2020',
    changes: [
      <span>
        Fixed a bug when some players were getting redirects making it impossible to access the app.
      </span>
    ]
  },
  {
    number: '0.1.41',
    date: '02/25/2020',
    changes: [
      <span>
        <strong>Now you can manage your friend's wallet integrated with Poker Now through Discord with the Poker Now bot. <a target='_blank' href={`${window.NETWORK_PUBLIC_URL}/poker_club_discord_bots`}>Click here for more infos!</a></strong>
      </span>,
      <span>
        Fixed some bugs in the transfer game ownership and the update player actions that weren't working properly.
      </span>
    ]
  },
  {
    number: '0.1.40',
    date: '02/23/2020',
    changes: [
      <span>
        Preparing the Poker Now to Poker Clubs managed by the Discord Bot. :)
      </span>
    ]
  },
  {
    number: '0.1.39',
    date: '02/01/2020',
    changes: [
      <span>
        Fix the terminology in the call button when you are calling a bet completing a previously placed value.
      </span>
    ]
  },
  {
    number: '0.1.38',
    date: '01/27/2020',
    changes: [
      <span>
        Now you can mute other players in the table. Just click in the player name in the table and hit the mute button.
      </span>
    ]
  },
  {
    number: '0.1.37',
    date: '01/19/2020',
    changes: [
      <span>
        Reverting the tweak that was keeping AFK players in tournaments until the end of the game or the end of his stack. This was badly accepted by the community. Now AFK players, after 20 seconds, will have their decision time reduce to 1 second and after 3 minutes of disconnection, these players will be removed.
      </span>
    ]
  },
  {
    number: '0.1.36',
    date: '01/18/2020',
    changes: [
      <span>Won't be removed the empty seats between players when you are playing to help keep the mental notes about players by position.</span>,
      <span>AFK players in the <a href='https://tournament.pokernow.club'>tournaments</a> will not be disconnected anymore, instead, their decision time will be cut to 2 seconds after a period of inactivity.</span>,
      <span>Will be shown the <a href='https://tournament.pokernow.club'>tournaments</a> leaderboard position in the player name in the table (players that never played a game in the season will not have the position shown).</span>,
      <span>Check our roadmap and the current suggested things at our <a href='https://trello.com/b/m4sZ3pJ8/poker-now-development' target='_blank'>Trello</a>.</span>
    ]
  },
  {
    number: '0.1.35',
    date: '12/23/2019',
    changes: [
      <span><strong>Possibility of separated values for big and small blind.</strong></span>,
      <span>Added a little button locking in the action buttons when your turn to act starts to avoid misclicking.</span>,
      <span>Added a little blinking signal to help you notice that it is your time to take the action.</span>
    ]
  },
  {
    number: '0.1.34',
    date: '12/15/2019',
    changes: [
      <span>Fix a bug that was introduced in the previous release in the "games finish" logic.</span>
    ]
  },
  {
    number: '0.1.33',
    date: '12/15/2019',
    changes: [
      <span>Fix a bug that was preventing the win counter to be shown.</span>,
      <span>Fix a bug in the game order when the small blind player in heads up enter in all in with a value bellow the small blind.</span>
    ]
  },
  {
    number: '0.1.32',
    date: '11/23/2019',
    changes: [
      <span>Showing all hands when all players are in all in situation. This can be disabled at the Options > Game > Show all hands in all in situations.</span>,
      <span>Fix a bug that was freezing the game when all players that placed a bet folded left only a player that haven't place a bet.</span>
    ]
  },
  {
    number: '0.1.31',
    date: '11/16/2019',
    changes: [
      <span>Fix a bug that was stopping the chat after a certain quantity of messages.</span>,
      <span>Added disconnection feedback.</span>
    ]
  },
  {
    number: '0.1.30',
    date: '11/13/2019',
    changes: [
      <span>Fix a bug that was not giving the third and so on side pots in certain situations.</span>
    ]
  },
  {
    number: '0.1.29',
    date: '11/12/2019',
    changes: [
      <span>Fix a bug that was returning the bet value to players that standing up with a bet placed.</span>,
      <span>Better chat messages connection issues messages. We are working to improve the chat quality.</span>
    ]
  },
  {
    number: '0.1.28',
    date: '11/10/2019',
    changes: [
      <span>Fix the "esc" key not closing the new message form.</span>,
      <span>Possibility to close the raise controls with the "esc" key.</span>,
      <span>Fix a bug where the "check/fold" button was folding when the player could check with a bet in the pre-flop.</span>
    ]
  },
  {
    number: '0.1.27',
    date: '11/10/2019',
    changes: [
      <span>Preventing the "check/fold" action being wiped when the villain places a bet. In this case, the "fold" action must be respected.</span>
    ]
  },
  {
    number: '0.1.26',
    date: '11/09/2019',
    changes: [
      <span>Added the "call any" and "check/fold" buttons.</span>,
      <span>Messages bubbles in the player name to become more noticeable when a player talks.</span>,
      <span>The fold button when it doesn't make sense fold is back, but now it will ask confirmation before an unnecessary fold.</span>
    ]
  },
  {
    number: '0.1.25',
    date: '11/02/2019',
    changes: [
      <span><strong>Four colors deck:</strong> go in Options > Preferences and choose the four colors deck if you want!</span>,
      <span><strong>Correct button passing:</strong> now Poker Now correctly passes the button avoiding give it to players that just entered in the hand.</span>,
      <span><strong>Dead button logic:</strong> now Poker Now uses the dead button logic.</span>,
      <span><strong>Missed blinds:</strong> Poker Now will take the missed blinds of standing up players that skipped the blinds.</span>
    ]
  },
  {
    number: '0.1.24',
    date: '10/09/2019',
    changes: [
      <span>Alone and want to play some poker for fun? Check out our brand new <a href='https://tournament.pokernow.club'>Sit & Go tournaments</a>!</span>
    ]
  },
  {
    number: '0.1.23',
    date: '09/17/2019',
    changes: [
      <span>Doesn't show the fold button when doesn't make sense to fold.</span>,
      <span>Hiding the "show hand" button when it's about half-second to next hand start to avoid misclicking in the fold button.</span>,
      <span>Raise controller plus/minus buttons now increase/decrease a blind value.</span>,
      <span>Random dealer at first hand. Previously the host was always the first dealer.</span>
    ]
  },
  {
    number: '0.1.22',
    date: '08/25/2019',
    changes: [
      <span>Fix a bug when calculating side pot with splitting in certain scenarios. Thank you 'chubbygoat' for the report.</span>
    ]
  },
  {
    number: '0.1.21',
    date: '08/08/2019',
    changes: [
      <span>Some tweaks to improve the deck randomness. Please send your feedback about it in Discord.</span>
    ]
  },
  {
    number: '0.1.20',
    date: '07/28/2019',
    changes: [
      <span>Allowing the player to choose his seat at the table.</span>,
      <span>Fix the wrong rule that was giving cards to standing up players.</span>
    ]
  },
  {
    number: '0.1.19',
    date: '07/20/2019',
    changes: [
      <span>Allowing players to show his hands when the game goes straight to showdown.</span>,
      <span>Adding 1 second in the game result screen per player that shows his hands to help give time to players see the hand.</span>
    ]
  },
  {
    number: '0.1.18',
    date: '07/17/2019',
    changes: [
      <span>Fix the values applied by the raise shortcuts and correct some terms in game decision.</span>
    ]
  },
  {
    number: '0.1.17',
    date: '07/17/2019',
    changes: [
      <span>Speeding up the showdown showing just the last aggressor's hand and the winner's hand. Without last aggressor in the river, only the winner's hand going to be shown. The losers can always show their hands. Thank you, Discord friends, to point this out!</span>
    ]
  }
]
