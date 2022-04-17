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
      state.entities[battleId].players[2].NFT_id = NFTId
    }
  }
})
