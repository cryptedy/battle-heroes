const { createSlice } = require('@reduxjs/toolkit')
//ethersモジュール読み込み
const { ethers } = require('ethers')
//const { BigNumber } = require('ethers')
const {
  CONTRACTS,
  LOCAL_SIGNKEY
} = require('../../../battle-heroes-utils/constants')

const initialState = async () => {
  const provider = await new ethers.getDefaultProvider(
    process.env.DEFAULT_RPC_URL
  )
  const signer = await new ethers.Wallet(LOCAL_SIGNKEY.key)
  const vault = await new ethers.Contract(
    CONTRACTS.VAULT.address,
    CONTRACTS.VAULT.abi,
    provider
  )
  const exchange = await new ethers.Contract(
    CONTRACTS.EXCHANGE.address,
    CONTRACTS.EXCHANGE.abi,
    provider
  )
  const erc20 = await new ethers.Contract(
    CONTRACTS.ERC20.address,
    CONTRACTS.ERC20.abi,
    provider
  )
  return { provider, signer, vault, exchange, erc20 }
}

module.exports = createSlice({
  name: 'contract',
  initialState: initialState()
})
