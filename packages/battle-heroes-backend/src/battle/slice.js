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
    }
  }
})
