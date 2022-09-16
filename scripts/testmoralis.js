const Moralis = require('moralis/node')
require('dotenv').config()

const addMoralisTokenExp = async (collectionId, tokenId, dexp) => {
  console.log('getMoralisUpdateTokenExp')
  const tokenExps = await Moralis.Cloud.run('getTokenExps', {
    collectionIds: [collectionId],
    tokenIds: [tokenId]
  })
  console.log(tokenExps[0].exp + dexp)
  let param = {
    collectionId: collectionId,
    tokenId: tokenId,
    payload: {
      exp: tokenExps[0].exp + dexp
    }
  }
  if (param.payload.exp < 0) param.payload.exp = 0
  console.log(param.payload)
  const newTokenExp = await Moralis.Cloud.run('setTokenExp', param)
  return newTokenExp
}

async function main() {
  console.log(await addMoralisTokenExp(1, 3, 15))
}

Moralis.start({
  serverUrl: process.env.MORALIS_SERVER_URL,
  appId: process.env.MORALIS_APPLICATION_ID
})

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
