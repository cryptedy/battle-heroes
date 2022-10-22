<template>
  <h1>{{ message }}</h1>

  <hr />

  <p>{{ player.name }}</p>

  <hr />

  <BaseButton type="primary" @click="addTokenExp"> Add Exp </BaseButton>&nbsp;
  <BaseButton type="primary" @click="getTokenExp"> Get Exp </BaseButton>&nbsp;
  <BaseButton type="primary" @click="mintTokenExp">
    Transfer Exp to Chain
  </BaseButton>
  &nbsp;
  <BaseButton type="primary" @click="connect"> Connect Wallet </BaseButton>
  <div>CollectionId:</div>
  <input v-model="colId1" type="number" style="color: #000000" />
  <div>TokenId:</div>
  <input v-model="tokenId1" type="number" style="color: #000000" />
  <div>Delta Exp:</div>
  <input v-model="exp1" type="number" style="color: #000000" />

  <hr />
  <h3>Config</h3>
  <BaseButton type="primary" @click="getConfig"> Get </BaseButton>&nbsp;
  <BaseButton type="primary" @click="setConfig"> Set </BaseButton>&nbsp;
  <BaseButton type="primary" @click="createConfig"> Create </BaseButton>
  <div>name:</div>
  <input v-model="configName" style="color: #000000" />
  <div>data:</div>
  <input v-model="configData" style="color: #000000" />

  <div v-if="shownResult">
    <hr />
    <h3 style="white-space: pre-wrap">{{ result.title }}</h3>
    <div style="word-wrap: break-word; white-space: pre-wrap">
      {{ result.content }}
    </div>
    <BaseButton type="primary" @click="close"> CLOSE </BaseButton>
  </div>
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
      shownResult: false,
      colId1: 1,
      tokenId1: 1,
      exp1: 0,
      configName: 'processedBlockNumber',
      configData: '-1',
      result: { title: '', content: '' }
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
    },

    close() {
      console.log('close result!')

      this.shownResult = false
    },

    addTokenExp() {
      console.log(
        'AddExp called!',
        parseInt(this.colId1),
        parseInt(this.tokenId1),
        parseInt(this.exp1)
      )
      this.clearResult()

      this.$socket.emit(
        'tokenExp:add',
        parseInt(this.colId1),
        parseInt(this.tokenId1),
        parseInt(this.exp1),
        ({ status, message, payload }) => {
          console.log('Received callback to add exp', message, payload)
          this.shownResult = true
          if (status) {
            this.result.title = 'AddExpの結果:'
            this.result.content = `NFT Id: [${payload.collectionId}, ${payload.tokenId}], `
            this.result.content += `Exp : ${payload.exp}, `
            this.result.content += `StartBlockNumber : ${payload.startBlockNumber}`
          }
        }
      )
      this.message = 'AddExp caled!'
    },

    getTokenExp() {
      console.log(
        'GetExp called!',
        parseInt(this.colId1),
        parseInt(this.tokenId1)
      )
      this.clearResult()

      this.$socket.emit(
        'tokenExp:get',
        parseInt(this.colId1),
        parseInt(this.tokenId1),
        ({ status, message, payload }) => {
          console.log('Received callback to get exp', message, payload)
          this.shownResult = true
          if (status) {
            this.result.title = 'GetExpの結果:'
            this.result.content = `NFT Id: [${payload.collectionId}, ${payload.tokenId}], `
            this.result.content += `Exp : ${payload.exp}, `
            this.result.content += `StartBlockNumber : ${payload.startBlockNumber}`
          }
        }
      )
      this.message = 'GetExp caled!'
    },

    async mintTokenExp() {
      console.log(
        'Transfer Exp called!',
        parseInt(this.colId1),
        parseInt(this.tokenId1),
        parseInt(this.exp1)
      )
      this.clearResult()

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
              await vault.mintExp(
                blockNumber,
                collectionId,
                tokenId,
                dexp,
                hash
              )
            } catch (err) {
              console.log(err)
            }

            //成功した場合の処理
            //            if (true) {
            //            }
            this.addNotification({
              message:
                'The transaction minting EXP is under going. Waiting a moment.',
              type: NOTIFICATION_TYPE.SUCCESS
            })
          } else {
            this.addNotification({
              message: 'Minting token was failed.',
              type: NOTIFICATION_TYPE.ERROR
            })
          }
        }
      )
      this.message = 'AddExp caled!'
    },

    getConfig() {
      console.log('GetConfig called!', this.configName)
      this.clearResult()

      this.$socket.emit(
        'config:get',
        this.configName,
        ({ status, message, payload }) => {
          console.log('Received callback to get config', message, payload)
          this.result.title = 'Get Configの結果:'
          this.shownResult = true
          if (status) {
            this.result.content = `name: ${payload.name}, `
            this.result.content += `data : ${payload.data}`
          } else {
            this.result.content = `エラー: ${message}`
          }
        }
      )
      this.message = 'GetConfig caled!'
    },

    setConfig() {
      console.log('SetConfig called!', this.configName, this.configData)
      this.clearResult()

      this.$socket.emit(
        'config:set',
        this.configName,
        parseInt(this.configData),
        ({ status, message, payload }) => {
          console.log('Received callback to set config', message)
          this.shownResult = true
          this.result.title = 'Set Configの結果:'
          this.result.content = `${payload.name} : ${status} `
          if (!status) {
            this.result.content += `エラー : ${message}`
          }
        }
      )
      this.message = 'SetConfig caled!'
    },

    createConfig() {
      console.log('CreateConfig called!', this.configName, this.configData)
      this.clearResult()

      this.$socket.emit(
        'config:create',
        this.configName,
        parseInt(this.configData),
        ({ status, message, payload }) => {
          console.log('Received callback to create config', message)
          this.shownResult = true
          this.result.title = 'Set Configの結果:'
          this.result.content = `${payload.name} : ${status} `
          if (!status) {
            this.result.content += `エラー : ${message}`
          }
        }
      )
      this.message = 'CreateConfig caled!'
    },

    clearResult() {
      this.shownResult = false
      this.result.title = ''
      this.result.content = ''
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
