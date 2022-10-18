<template>
  <h1>{{ message }}</h1>

  <hr />

  <p>{{ player.name }}</p>

  <hr />

  <BaseButton type="primary" @click="addTokenExp"> Add Exp </BaseButton>
  <BaseButton type="primary" @click="getTokenExp"> Get Exp </BaseButton>
  <BaseButton type="primary" @click="mintTokenExp">
    Transfer Exp to Chain
  </BaseButton>
  <BaseButton type="primary" @click="connect"> Connect Wallet </BaseButton>
  <P>CollectionId:</P>
  <input v-model="colId1" type="number" style="color: #000000" />
  <P>TokenId:</P>
  <input v-model="tokenId1" type="number" style="color: #000000" />
  <P>Delta Exp:</P>
  <input v-model="exp1" type="number" style="color: #000000" />

  <div v-if="isCalled">
    <p>METHOD CALLED!</p>
    <BaseButton type="primary" @click="reset"> RESET </BaseButton>
  </div>
  <p v-else>DEFAULT</p>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { NOTIFICATION_TYPE } from '../../utils/constants'
import {
  CHAINID_VAULT,
  CONTRACTS
} from '../../../../battle-heroes-utils/constants'
//import Moralis from 'moralis/dist/moralis.min.js'
//const Moralis = require('moralis/node')
import { ethers } from 'ethers'
//import { abi as abiVault } from '../../../../battle-heroes-utils/abi/PHBattleVault.json'

const DEFAULT_MESSAGE = 'Welcome to Labs'

export default {
  name: 'AccountLabsView',

  data() {
    return {
      message: DEFAULT_MESSAGE,
      isCalled: false,
      colId1: 1,
      tokenId1: 1,
      exp1: 0
    }
  },

  computed: {
    ...mapGetters({
      player: 'game/player'
    })
  },

  created() {
    console.log('component created')
  },

  mounted() {
    console.log('component mounted')
  },

  methods: {
    ...mapActions({
      addNotification: 'notification/add'
    }),

    reset() {
      console.log('reset!')

      this.isCalled = false
      this.message = DEFAULT_MESSAGE
    },

    addTokenExp() {
      console.log(
        'AddExp called!',
        parseInt(this.colId1),
        parseInt(this.tokenId1),
        parseInt(this.exp1)
      )

      this.$socket.emit(
        'tokenExp:add',
        parseInt(this.colId1),
        parseInt(this.tokenId1),
        parseInt(this.exp1)
      )
      this.isCalled = true
      this.message = 'AddExp caled!'
    },

    getTokenExp() {
      console.log(
        'GetExp called!',
        parseInt(this.colId1),
        parseInt(this.tokenId1)
      )

      this.$socket.emit(
        'tokenExp:get',
        parseInt(this.colId1),
        parseInt(this.tokenId1)
      )
      this.isCalled = true
      this.message = 'GetExp caled!'
    },

    async mintTokenExp() {
      console.log(
        'Transfer Exp called!',
        parseInt(this.colId1),
        parseInt(this.tokenId1),
        parseInt(this.exp1)
      )

      let res = await handleEthereum()
      if (!res) {
        console.log('Metamask is wrong')
        return
      }

      console.log('emit tokenExp:mint')

      this.$socket.emit(
        'tokenExp:mint',
        parseInt(this.colId1),
        parseInt(this.tokenId1),
        parseInt(this.exp1),
        async ({ status, message, payload }) => {
          console.log('Signature was issued', status, message, payload)
          if (status) {
            console.log(CONTRACTS, ethers)
            res = await handleEthereum()
            if (!res) {
              console.log('Metamask is wrong')
              return
            }
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const vault = await new ethers.Contract(
              CONTRACTS.VAULT.address,
              CONTRACTS.VAULT.abi,
              signer
            )

            // トランザクション発行処理
            const { blockNumber, collectionId, tokenId, dexp, nonce, hash } =
              payload

            //TODO
            try {
              console.log(blockNumber, collectionId, tokenId, dexp, nonce, hash)
              const tx = await vault.mintExp(
                blockNumber,
                collectionId,
                tokenId,
                dexp,
                hash
              )
              await tx.wait()
            } catch (err) {
              console.log(err)
            }

            //成功した場合の処理
            //            if (true) {
            //            }
            this.addNotification({
              message: 'Token was minted on chain.',
              type: NOTIFICATION_TYPE.SUCCESS
            })
          } else {
            this.addNotification({
              message: 'Minting token was failed.',
              type: NOTIFICATION_TYPE.ERROR,
              timeout: 0
            })
          }
        }
      )
      this.isCalled = true
      this.message = 'AddExp caled!'
    },

    async connect() {
      if (window.ethereum) {
        await handleEthereum()
      } else {
        window.addEventListener('ethereum#initialized', await handleEthereum, {
          once: true
        })

        // If the event is not dispatched by the end of the timeout,
        // the user probably doesn't have MetaMask installed.
        setTimeout(await handleEthereum, 3000) // 3 seconds
      }
    }
  }
}

const handleEthereum = async () => {
  const { ethereum } = window
  if (ethereum && ethereum.isMetaMask) {
    console.log('Ethereum successfully detected!')
    // Access the decentralized web!
    try {
      const acccounts = await ethereum.request({
        method: 'eth_requestAccounts'
      })
      if (acccounts.length > 0) {
        console.log(acccounts[0])
        // チェーンIDの切り替え要求 ChainListがない場合に追加を促すう処理は未実装
        let chainId = await ethereum.request({ method: 'eth_chainId' })
        if (chainId != CHAINID_VAULT) {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: toHex(CHAINID_VAULT) }]
          })
        }
        chainId = await ethereum.request({ method: 'eth_chainId' })
        console.log('chain id comparison', chainId, toHex(CHAINID_VAULT))
        if (chainId == toHex(CHAINID_VAULT)) {
          console.log('handleEtherum is success.')
          return true
        }
      }
    } catch (err) {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // ユーザーが接続を拒否するとここに来ます
        console.log('Please connect to MetaMask.')
      } else {
        console.error(err)
      }
    }
  } else {
    console.log('Please install MetaMask!')
  }
  return false
}
function toHex(v) {
  return '0x' + ('0000' + v.toString(16)).substr(-4)
}
</script>
