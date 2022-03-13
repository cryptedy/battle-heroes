const axios = require('axios')
const moment = require('moment')
const store = require('./store')
const { getNFTsForAddress } = require('./NFT')
const { COLLECTIONS, OPENSEA_API_URL, PLAYER_STATE } = require('./constants')

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
      socket_id: socket.id,
      token_ids: tokenIds,
      level: 1,
      state: PLAYER_STATE.IDLE
    }
  }

  const findPlayer = socketId => {
    const { players } = store.getState()

    return players.find(player => player.socket_id === socketId)
  }

  const createMessage = text => {
    return {
      player: findPlayer(socket.id),
      text,
      posted_at: moment().unix()
    }
  }

  const onLogin = async (user, callback) => {
    console.log('onLogin', socket.id)

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
        payload: { ...player }
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

  const onLogout = async callback => {
    console.log('onLogout', socket.id)

    try {
      store.dispatch({
        type: 'REMOVE_PLAYER',
        payload: { socket_id: socket.id }
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

    store.dispatch({
      type: 'UPDATE_PLAYER_STATE',
      payload: { id: socket.id, state: PLAYER_STATE.STANDBY }
    })

    const { players } = store.getState()

    io.emit('player:players', players)
  }

  const onPlayerIdle = () => {
    console.log('onPlayerIdle', socket.id)

    store.dispatch({
      type: 'UPDATE_PLAYER_STATE',
      payload: { id: socket.id, state: PLAYER_STATE.IDLE }
    })

    const { players } = store.getState()

    io.emit('player:players', players)
  }

  const onNewMessage = text => {
    console.log('onNewMessage', socket.id)

    const message = createMessage(text)

    store.dispatch({
      type: 'SET_MESSAGE',
      payload: { ...message }
    })

    io.emit('chat:message', message)
  }

  const onDisconnect = () => {
    console.log('onDisconnect', socket.id)

    store.dispatch({
      type: 'REMOVE_PLAYER',
      payload: { socket_id: socket.id }
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
