const { createSlice } = require('@reduxjs/toolkit')
const { COLLECTIONS } = require('../utils/constants')

const initialState = () => {
  const entities = {}
  const ids = []

  for (const collection of COLLECTIONS) {
    entities[collection.id] = collection
    ids.push(collection.id)
  }

  return {
    entities,
    ids
  }
}

module.exports = createSlice({
  name: 'collection',
  initialState: initialState()
})
