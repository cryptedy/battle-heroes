import {
  RESET_BATTLES,
  SET_BATTLES,
  ADD_BATTLE,
  UPDATE_BATTLE,
  REMOVE_BATTLE
} from '../mutation-types'

const initialState = () => ({
  entities: {},
  ids: []
})

export const state = initialState()

export const getters = {
  all: state => state.ids.map(id => state.entities[id]),
  find: state => id => state.entities[id],
  count: state => state.ids.length,
  byPlayer: (state, getters) => player =>
    getters.all.find(battle =>
      Object.keys(battle.players).some(
        playerKey => battle.players[playerKey].id === player.id
      )
    ),
  playerKey: (state, getters, rootState, rootGetters) => {
    if (!rootGetters['game/isLogin']) return
    if (!rootGetters['game/playerBattle']) return

    const playerKey = Object.keys(
      rootGetters['game/playerBattle'].players
    ).find(
      playerKey =>
        rootGetters['game/playerBattle'].players[playerKey].id ===
        rootGetters['game/player'].id
    )

    if (Number.parseInt(playerKey) !== isNaN) {
      return Number.parseInt(playerKey)
    }
  },
  playerNFT: (state, getters, rootState, rootGetters) => {
    if (!getters.playerKey) return

    return rootGetters['NFT/find'](
      rootGetters['game/playerBattle'].players[getters.playerKey].NFT_id
    )
  }
}

export const mutations = {
  [RESET_BATTLES](state) {
    const { entities, ids } = initialState()

    state.entities = entities
    state.ids = ids
  },

  [SET_BATTLES](state, { battles }) {
    battles.forEach(battle => {
      state.entities = { ...state.entities, [battle.id]: battle }
    })
    state.ids = battles.map(battle => battle.id)
  },

  [ADD_BATTLE](state, { battle }) {
    state.entities = { ...state.entities, [battle.id]: battle }
    state.ids.push(battle.id)
  },

  [UPDATE_BATTLE](state, { battle }) {
    state.entities[battle.id] = battle
  },

  [REMOVE_BATTLE](state, { battleId }) {
    delete state.entities[battleId]
    const index = state.ids.findIndex(id => id === battleId)
    if (index !== -1) state.ids.splice(index, 1)
  }
}

export const actions = {
  reset({ commit }) {
    console.log('battle/reset')

    commit(RESET_BATTLES)
  },

  set({ commit }, battles) {
    console.log('battle/set', battles)

    commit(SET_BATTLES, { battles })
  },

  add({ commit }, battle) {
    console.log('battle/add', battle)

    commit(ADD_BATTLE, { battle })
  },

  update({ commit }, battle) {
    console.log('battle/update', battle)

    commit(UPDATE_BATTLE, { battle })
  },

  remove({ commit }, battleId) {
    console.log('battle/remove', battleId)

    commit(REMOVE_BATTLE, { battleId })
  }
}
