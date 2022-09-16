Moralis.Cloud.define('getUsers', async () => {
  const query = new Moralis.Query('User')
  return await query.find({ useMasterKey: true })
})

Moralis.Cloud.define('findUser', async request => {
  const { objectId } = request.params
  const query = new Moralis.Query('User')
  query.equalTo('objectId', objectId)
  return await query.first({ useMasterKey: true })
})

Moralis.Cloud.define('updateUser', async request => {
  const { objectId, payload } = request.params
  const query = new Moralis.Query('User')
  query.equalTo('objectId', objectId)
  const user = await query.first({ useMasterKey: true })
  Object.keys(payload).forEach(key => {
    const value = payload[key]
    user.set(key, value)
  })
  await user.save(null, { useMasterKey: true })
  return user
})

// コレクションID, トークンID配列を渡して、TokenExp DBの配列を受け取る
// ファイル破損などにより通しidがずれるとDBの壊滅的破壊が起きかねないため、確実性のある2つの値を組み合わせてプライマリーキーとする
Moralis.Cloud.define('getTokenExps', async request => {
  const { collectionIds, tokenIds } = request.params
  const tokenExps = []
  const TokenExp = Moralis.Object.extend('TokenExp')
  const len = tokenIds.length
  for (let i = 0; i < len; i++) {
    const query = new Moralis.Query(TokenExp)
    query.equalTo('tokenId', tokenIds[i])
    query.equalTo('collectionId', collectionIds[i])
    const results = await query.find({ useMasterKey: true })
    let exp = results[0]?.get('exp')
    if (!exp) exp = 0
    tokenExps.push({
      collectionId: collectionIds[i],
      tokenId: tokenIds[i],
      exp: exp,
      startBlockNumer: results[0]?.get('startBlockNumer')
    })
  }
  return tokenExps
})

// 全Expデータを取得する
Moralis.Cloud.define('getAllTokenExps', async request => {
  const TokenExp = Moralis.Object.extend('TokenExp')
  const query = new Moralis.Query(TokenExp)
  const tokenExps = await query.find({ useMasterKey: true })
  return tokenExps
})

// コレクションID, トークンIDを渡してstartBlockNumberを取得する
Moralis.Cloud.define('getTokenStartBlockNumber', async request => {
  const { collectionId, tokenId } = request.params
  const TokenExp = Moralis.Object.extend('TokenExp')
  const query = new Moralis.Query(TokenExp)
  query.equalTo('collectionId', collectionId)
  query.equalTo('tokenId', tokenId)
  const token = await query.first({ useMasterKey: true })
  return token.startBlockNumer
})

// コレクションID, トークンIDを渡してpayloadに指定された属性を更新する.
Moralis.Cloud.define('setTokenExp', async request => {
  const logger = Moralis.Cloud.getLogger()
  const { collectionId, tokenId, payload } = request.params
  const TokenExp = Moralis.Object.extend('TokenExp')
  const query = new Moralis.Query(TokenExp)
  query.equalTo('collectionId', collectionId)
  query.equalTo('tokenId', tokenId)
  const findedToken = await query.first({ useMasterKey: true })
  const newToken = new TokenExp()
  newToken.set('collectionId', collectionId)
  newToken.set('tokenId', tokenId)
  //newToken.set('startBlockNumber', findedToken.get('startBlockNumber'))
  Object.keys(payload).forEach(key => {
    const value = payload[key]
    newToken.set(key, value)
  })
  await newToken.save({ useMasterKey: true })
  const ret = {
    collectionId: collectionId,
    tokenId: tokenId,
    exp: newToken.get('exp'),
    startBlockNumer: newToken.get('startBlockNumer')
  }
  return ret
})
