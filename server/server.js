const io = require('socket.io')(3001);

/*
API REQUESTS

POST
/games/${this.props.game.id}/request_ingress
/games/${this.props.gameID}/player_quit
/games/${this.props.game.id}/approve_player
/games/${this.props.game.id}/remove_player
/games/${this.props.game.id}/transfer_ownership
/games/${this.props.game.id}/${this.props.player.status === 'requestedGameIngress' ? 'approve_player' : 'update_player'
/games/${this.props.game.id}/update_game
/games/${this.props.gameID}/cancel_request_ingress
/games/${this.state.data.id}/idle_heartbeat
/new-withdraw
/new-game

GET
/games/${this.props.gameID}/log?after_at=${options.afterAt || ''}&before_at=${options.beforeAt || ''}
/player-infos
/player-infos
/my-withdraws
*/


io.of('/socket.io').on('connection', (socket) => {
  // console.log(socket);

  //  handshake:
  // { headers:
  //    { upgrade: 'websocket',
  //      connection: 'upgrade',
  //      host: 'poker.camspencer.com',
  //      pragma: 'no-cache',
  //      'cache-control': 'no-cache',
  //      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
  //      origin: 'https://poker.camspencer.com',
  //      'sec-websocket-version': '13',
  //      'accept-encoding': 'gzip, deflate, br',
  //      'accept-language': 'en-US,en;q=0.9',
  //      cookie: '_ga=GA1.2.194731343.1583001125',
  //      'sec-websocket-key': '3jqZRf41DmodYJYdSmYxhA==',
  //      'sec-websocket-extensions': 'permessage-deflate; client_max_window_bits' },
  //   time: 'Sun Apr 05 2020 17:16:22 GMT+0000 (UTC)',
  //   address: '::ffff:127.0.0.1',
  //   xdomain: true,
  //   secure: false,
  //   issued: 1586106982918,
  //   url: '/socket.io/?gameID=awd&EIO=3&transport=websocket',
  //   query: { gameID: 'awd', EIO: '3', transport: 'websocket' } },

  io.emit('gameChanged', {
    version: '0.1.45',
    serverNow: `${new Date()}`,

    id: socket.handshake.query.gameID,
    mode: 'chips',

    //playersRank: [],
    gameNumber: 0,
    // gameTurn
    // withBetAllowedCheckPlayersIDs
    // currentHigherBet
    // playerIDToTalk
  });

  socket.on('new-message', (obj) => {
    console.log('new');
    console.log(obj);
  });

  socket.on('action', (obj) => {
    console.log(obj);
  });

  // socket.on('gameChanged', (obj) => {
  //   console.log(obj);
  // version
  // serverNow = new Date();
  // });

  // socket.on('newChatMessage', (obj) => {
  //   console.log(obj);
  // });

  // socket.on('connect', (obj) => {
  //   console.log(obj);
  // });

  // socket.on('disconnect', (obj) => {
  //   console.log(obj);
  // });

  socket.on('disconnect', () => {
    console.log('disconnect');
  });
});

/*

    if (data.version && process.env.npm_package_version !== data.version) {
      return window.location.reload()
    }

    this.memoizeTimeDifferenceFromServer(data.serverNow)
*/
