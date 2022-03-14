const axios = require('axios')
const moment = require('moment')
const store = require('./store')
const { getNFTsForAddress } = require('./NFT')
const { COLLECTIONS, OPENSEA_API_URL, PLAYER_STATE } = require('./constants')

const LOGIN = 'LOGIN'

const PROCESS = {
  [LOGIN]: false
}

// wait for finish processing to avoid duplicate processing
const waitProcess = name => {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    let interval = setInterval(() => {
      if (!PROCESS[name]) {
        clearInterval(interval)
        resolve(true)
      }
    }, 5000)
  })
}

module.exports = (io, socket) => {
  const getUserProfile = async user => {
    const profile = {
      name: 'NO NAME',
      avatar_url: ''
    }

    try {
      const { data: openSeaUser } = await axios.get(
        `${OPENSEA_API_URL}/user/${user.address}`
      )

      const { account } = openSeaUser

      profile.name = openSeaUser.username
      profile.avatar_url = account.profile_img_url

      return profile
    } catch (error) {
      return profile
    }
  }

  const createPlayer = async (user, tokenIds) => {
    const profile = await getUserProfile(user)

    return {
      id: user.id,
      user_id: user.id,
      name: profile.name,
      avatar_url: profile.avatar_url,
      address: user.address,
      socket_ids: [socket.id],
      token_ids: tokenIds,
      level: 1,
      state: PLAYER_STATE.IDLE
    }
  }

  const createMessage = text => {
    const player = store
      .getState()
      .players.find(player => player.socket_ids.includes(socket.id))

    return {
      player,
      text,
      posted_at: moment().unix()
    }
  }

  const onLogin = async (user, callback) => {
    await waitProcess(LOGIN)

    PROCESS.LOGIN = true

    console.log('onLogin', socket.id)

    const { players } = store.getState()

    const player = players.find(player => player.user_id === user.id)

    if (player) {
      player.socket_ids.push(socket.id)

      store.dispatch({
        type: 'UPDATE_PLAYER',
        payload: { player }
      })

      const { players, messages } = store.getState()

      // to all clients except the sender
      socket.broadcast.emit('player:players', players)

      // to the sender
      callback({
        status: true,
        players,
        messages
      })
    } else {
      const tokenIds = {}

      for (const collection of COLLECTIONS) {
        tokenIds[collection.id] = []

        try {
          const NFTs = await getNFTsForAddress(collection.id, user.address)

          tokenIds[collection.id] = NFTs.map(NFT => NFT.token_id).sort(
            (a, b) => a - b
          )
        } catch (error) {
          console.log(error)
          return callback({ status: false })
        }
      }

      try {
        const player = await createPlayer(user, tokenIds)

        store.dispatch({
          type: 'ADD_PLAYER',
          payload: { player }
        })

        const { players, messages } = store.getState()

        // to all clients except the sender
        socket.broadcast.emit('player:players', players)

        // to the sender
        callback({
          status: true,
          players,
          messages
        })
      } catch (error) {
        console.log(error)
        callback({ status: false })
      }
    }

    PROCESS.LOGIN = false
  }

  const onLogout = async callback => {
    console.log('onLogout', socket.id)

    const player = store
      .getState()
      .players.find(player => player.socket_ids.includes(socket.id))

    try {
      const index = player.socket_ids.findIndex(
        socketId => socketId === socket.id
      )

      player.socket_ids.splice(index, 1)

      store.dispatch({
        type: 'UPDATE_PLAYER',
        payload: { player }
      })

      const { players } = store.getState()

      io.emit('player:players', players)

      callback({ status: true })
    } catch (error) {
      callback({ status: false })
    }
  }

  const onPlayerStandBy = () => {
    console.log('onPlayerStandBy', socket.id)

    const player = store
      .getState()
      .players.find(player => player.socket_ids.includes(socket.id))

    player.state = PLAYER_STATE.STANDBY

    store.dispatch({
      type: 'UPDATE_PLAYER',
      payload: { player }
    })

    const { players } = store.getState()

    io.emit('player:players', players)
  }

  const onPlayerIdle = () => {
    console.log('onPlayerIdle', socket.id)

    const player = store
      .getState()
      .players.find(player => player.socket_ids.includes(socket.id))

    player.state = PLAYER_STATE.IDLE

    const { players } = store.getState()

    io.emit('player:players', players)
  }

  const onNewMessage = text => {
    console.log('onNewMessage', socket.id)

    const message = createMessage(text)

    store.dispatch({
      type: 'SET_MESSAGE',
      payload: { message }
    })

    io.emit('chat:message', message)
  }

  const onDisconnect = () => {
    console.log('onDisconnect', socket.id)

    const player = store
      .getState()
      .players.find(player => player.socket_ids.includes(socket.id))

    if (!player) return

    const index = player.socket_ids.findIndex(
      socketId => socketId === socket.id
    )

    player.socket_ids.splice(index, 1)

    store.dispatch({
      type: 'UPDATE_PLAYER',
      payload: { player }
    })

    const { players } = store.getState()

    io.emit('player:players', players)
  }

  socket.on('game:login', onLogin)
  socket.on('game:logout', onLogout)
  socket.on('player:standBy', onPlayerStandBy)
  socket.on('player:idle', onPlayerIdle)
  socket.on('chat:newMessage', onNewMessage)
  socket.on('disconnect', onDisconnect)
}
