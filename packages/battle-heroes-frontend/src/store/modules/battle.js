import { socket } from '@/plugins/socket'
import { BATTLE_TYPE } from '@/utils/constants'
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
    getters.all.find(
      battle =>
        battle.players[1].id === player.id ||
        (battle.players[2].id === player.id &&
          battle.type === BATTLE_TYPE.HUMAN)
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

    const index = state.ids.findIndex(id => id === battle.id)
    if (index === -1) state.ids.push(battle.id)
  },

  [UPDATE_BATTLE](state, { battle }) {
    state.entities[battle.id] = battle
  },

  [REMOVE_BATTLE](state, { battleId }) {
    const index = state.ids.findIndex(id => id === battleId)
    if (index !== -1) state.ids.splice(index, 1)

    delete state.entities[battleId]
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
  },

  async create({ dispatch }, { NFTId, timeout }) {
    console.log('battle/create', NFTId)

    return new Promise((resolve, reject) => {
      socket.emit(
        'battle:create',
        NFTId,
        timeout,
        ({ status, message, battle, player }) => {
          console.log('battle:created', status, message, battle, player)

          if (status) {
            dispatch('add', battle)
            dispatch('player/update', player, { root: true })

            resolve({ message, battle, player })
          } else {
            reject({ message })
          }
        }
      )
    })
  },

  async join({ dispatch }, { battleId, NFTId }) {
    console.log('battle/join', battleId, NFTId)

    return new Promise((resolve, reject) => {
      socket.emit(
        'battle:join',
        battleId,
        NFTId,
        ({ status, message, battle, player1, player2 }) => {
          console.log(
            'battle:joined',
            status,
            message,
            player1,
            player2,
            battle
          )

          if (status) {
            dispatch('player/update', player1, { root: true })
            dispatch('player/update', player2, { root: true })
            dispatch('update', battle)

            resolve({ message, player1, player2, battle })
          } else {
            reject({ message })
          }
        }
      )
    })
  },

  async rush({ dispatch }, { battleId, NFTId }) {
    console.log('battle/rush', battleId, NFTId)

    return new Promise((resolve, reject) => {
      socket.emit(
        'battle:rush',
        battleId,
        NFTId,
        ({ status, message, battle, player1, player2 }) => {
          console.log(
            'battle:rushed',
            status,
            message,
            battle,
            player1,
            player2
          )

          if (status) {
            dispatch('player/update', player1, { root: true })
            dispatch('player/update', player2, { root: true })
            dispatch('add', battle)
            // delete old battle
            dispatch('remove', battleId)

            resolve({ message, battle, player1, player2 })
          } else {
            reject({ message })
          }
        }
      )
    })
  },

  async delete({ dispatch }, battleId) {
    console.log('battle/delete', battleId)

    return new Promise((resolve, reject) => {
      socket.emit(
        'battle:delete',
        battleId,
        // eslint-disable-next-line no-unused-vars
        ({ status, message, battleId }) => {
          console.log('battle:deleted', status, message, battleId)

          if (status) {
            dispatch('remove', battleId)

            resolve({ message, battleId })
          } else {
            reject({ message })
          }
        }
      )
    })
  }
}
