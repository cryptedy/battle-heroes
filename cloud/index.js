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
  const tokenExps = [];
  const query = new Moralis.Query('TokenExp')
  return await query.find({ useMasterKey: true })

})

// コレクションID, トークンID配列を渡して、TokenExp DBの配列を受け取る
// ファイル破損などにより通しidがずれるとDBの壊滅的破壊が起きかねないため、確実性のある2つの値を組み合わせてプライマリーキーとする
Moralis.Cloud.define('initTokenExps', async request => {
  const { collectionIds, tokenIds } = request.params
  const tokenExps = [];
  const query = new Moralis.Query('TokenExp')
  return await query.find({ useMasterKey: true })

})

// コレクションID, トークンIDを渡してstartBlockNumberを取得する
Moralis.Cloud.define('getTokenStartBlockNumber', async request => {
  const { collectionId, tokenId } = request.params
  const query = new Moralis.Query('TokenExp')
  query.equalTo('collectionId', collectionId)
  query.equalTo('tokenId', tokenId)
  const token = await query.first({ useMasterKey: true })
  return token.startBlockNumer
})
/*
// コレクションID, トークンIDを渡してpayloadに指定された属性を更新する
Moralis.Cloud.define('updateTokenExp', async request =>{
  const { collectionId, tokenId, payload} = request.params
  const query = new Moralis.Query('TokenExp')
  query.equalTo('collectionId', collectionId).equalTo('tokenId', tokenId)
  const token = await query.first({ useMasterKey: true })
  Object.keys(payload).forEach(key => {
    const value = payload[key]
    token.set(key, value)
  })
  await token.save(null, { useMasterKey: true})
  return token
})
*/