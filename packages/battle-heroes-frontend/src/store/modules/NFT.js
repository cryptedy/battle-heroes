import axios from 'axios'
import { API_URL } from '@/utils/constants'
import { RESET_NFTS, SET_NFTS } from '../mutation-types'

const initialState = () => {
  return {
    entities: {},
    ids: []
  }
}

export const state = initialState()

export const getters = {
  all: state => state.ids.map(id => state.entities[id]),
  count: state => state.ids.length,
  find: state => id => state.entities[id],
  byPlayer: (state, getters) => player =>
    player.nft_ids.map(NFTId => getters.find(NFTId)),
  byCollection: (state, getters) => collection =>
    getters.all.filter(NFT => NFT.collection_id === collection.id)
}

export const mutations = {
  [RESET_NFTS](state) {
    const { entities, ids } = initialState()

    state.entities = entities
    state.ids = ids
  },

  [SET_NFTS](state, { NFTs }) {
    const entities = {}

    for (const NFT of NFTs) {
      entities[NFT.id] = NFT
    }

    // bulk assignment for better performance
    state.entities = entities
    state.ids = NFTs.map(NFT => NFT.id).sort((a, b) => a - b)
  }
}

export const actions = {
  async fetch({ commit }) {
    console.log('NFT/fetch')

    try {
      const { data: NFTs } = await axios.get(`${API_URL}/nfts/`)

      commit(SET_NFTS, { NFTs })
    } catch (error) {
      commit(RESET_NFTS)

      throw new Error(error)
    }
  }
}
