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
      startBlockNumber: results[0]?.get('startBlockNumber')
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
  return token.get('startBlockNumber')
})

// コレクションID, トークンIDを渡してpayloadに指定された属性を更新する.
Moralis.Cloud.define('setTokenExp', async request => {
  const logger = Moralis.Cloud.getLogger()
  const { collectionId, tokenId, payload } = request.params
  const TokenExp = Moralis.Object.extend('TokenExp')
  const query = new Moralis.Query(TokenExp)
  query.equalTo('collectionId', collectionId)
  query.equalTo('tokenId', tokenId)
  const findedTokens = await query.find({ useMasterKey: true })
  let token
  // まだフィールドがない場合
  if (findedTokens.length == 0) {
    token = new TokenExp()
    token.set('collectionId', collectionId)
    token.set('tokenId', tokenId)
    token.set('exp', 0)
    token.set('startBlockNumber', undefined)
    // すでにフィールドがある場合
  } else {
    token = findedTokens[0]
  }
  // payloadで更新
  Object.keys(payload).forEach(key => {
    const value = payload[key]
    token.set(key, value)
  })

  await token.save(null, { useMasterKey: true })

  const ret = {
    collectionId: collectionId,
    tokenId: tokenId,
    exp: token.get('exp'),
    startBlockNumber: token.get('startBlockNumber')
  }
  return ret
})

// configの属性を更新する。nameがない場合falseを返す。
Moralis.Cloud.define('setConfig', async request => {
  let result = {
    status: false,
    message: 'specified name does not exist'
  }
  try {
    const logger = Moralis.Cloud.getLogger()
    const { name, data } = request.params
    const config = Moralis.Object.extend('config')
    const query = new Moralis.Query(config)
    query.equalTo('name', name)
    const findedTokens = await query.find({ useMasterKey: true })
    // フィールドがある場合
    if (findedTokens.length != 0) {
      let savedata = findedTokens[0]
      savedata.set('data', JSON.stringify(data))
      await savedata.save(null, { useMasterKey: true })
      result.status = true
      result.message = ''
    }
    return result
  } catch (err) {
    result.message = err.message
    return result
  }
})

// configに新たな属性を作成する。nameがある場合falseを返す
Moralis.Cloud.define('createConfig', async request => {
  let result = {
    status: false,
    message: 'specified name already exists'
  }
  try {
    const logger = Moralis.Cloud.getLogger()
    const { name, data } = request.params
    const config = Moralis.Object.extend('config')
    const query = new Moralis.Query(config)
    query.equalTo('name', name)
    const findedTokens = await query.find({ useMasterKey: true })
    // フィールドがない場合
    if (findedTokens.length == 0) {
      let savedata = new config()
      savedata.set('name', name)
      savedata.set('data', JSON.stringify(data))
      await savedata.save(null, { useMasterKey: true })
      result.status = true
      result.message = ''
    }
    return result
  } catch (err) {
    result.message = err.message
    return result
  }
})

// configの属性ｗｐ取得する。
Moralis.Cloud.define('getConfig', async request => {
  let result = {
    status: false,
    message: 'specified name does not exist'
  }
  try {
    const logger = Moralis.Cloud.getLogger()
    const { name } = request.params
    const config = Moralis.Object.extend('config')
    const query = new Moralis.Query(config)
    query.equalTo('name', name)
    const findedTokens = await query.find({ useMasterKey: true })
    // フィールドがある場合
    if (findedTokens.length != 0) {
      let getdata = findedTokens[0]
      result['data'] = JSON.parse(getdata.get('data'))
      result.status = true
      result.message = ''
    }
    return result
  } catch (err) {
    result.message = err.message
    return result
  }
})
