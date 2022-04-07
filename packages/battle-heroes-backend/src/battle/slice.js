const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  entities: {},
  ids: []
}

module.exports = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    add: (state, { payload: battle }) => {
      console.log('battle/add', battle)

      state.entities[battle.id] = battle
      state.ids.push(battle.id)
    },
    remove: (state, { payload: battleId }) => {
      console.log('battle/remove', battleId)

      delete state.entities[battleId]

      const index = state.ids.findIndex(id => id === battleId)
      if (index !== -1) state.ids.splice(index, 1)
    },
    update: (state, { payload }) => {
      console.log('battle/update', payload)

      const { battleId, payload: newState } = payload

      state.entities[battleId] = { ...state.entities[battleId], ...newState }
    },
    join: (state, { payload }) => {
      console.log('battle/join', payload)

      const { battleId, playerId, NFTId } = payload

      state.entities[battleId].players[2].id = playerId
      state.entities[battleId].NFTs[2].id = NFTId
    },
    changeTurn: (state, { payload: battleId }) => {
      console.log('battle/changeTurn', battleId)

      state.entities[battleId].turn++

      state.entities[battleId].current_move =
        state.entities[battleId].current_move === 1 ? 2 : 1
    },
    updateStatus: (state, { payload }) => {
      console.log('battle/updateStatus', payload)

      const { battleId, playerNumber, payload: newState } = payload

      state.entities[battleId].status[playerNumber] = {
        ...state.entities[battleId].status[playerNumber],
        ...newState
      }
    }
  }
})
