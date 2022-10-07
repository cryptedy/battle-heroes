//ethersモジュール読み込み
const { ethers } = require('ethers')
//const { BigNumber } = require('ethers')
const {
  CONTRACTS,
  LOCAL_SIGNER
} = require('../../../battle-heroes-utils/constants')

const { setContracts } = require('./actions')

exports.initialize = async () => {
  console.log('Start initializing contract store')
  const provider = await new ethers.getDefaultProvider(
    process.env.DEFAULT_RPC_URL
  )
  const signer = await new ethers.Wallet(LOCAL_SIGNER.key)
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
  console.log('Finish initializing contract store')

  const contracts = { provider, signer, vault, exchange, erc20 }
  setContracts(contracts)
  //return { provider, signer, vault, exchange, erc20, status }
  //  return { initialize: { provider, signer, vault, exchange, erc20, status } }
}
