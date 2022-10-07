const { createSlice } = require('@reduxjs/toolkit')
//const store = require('../store')

const initialState = {
  provider: {},
  signer: {},
  vault: {},
  exchange: {},
  erc20: {},
  initialized: false
}

module.exports = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    set: (state, { payload: contracts }) => {
      console.log('contract/set')
      state['initialized'] = true
      state['provider'] = contracts.provider
      state['signer'] = contracts.signer
      state['vault'] = contracts.vault
      state['exchange'] = contracts.exchange
      state['erc20'] = contracts.erc20
    }
  }
  /*  extraReducers: builder => {
    // 正常終了時
    builder.addCase(this.initialize.fulfilled, (state, action) => {
      state.contract = action.payload.initialize // payloadCreatorでreturnされた値
    })
    // 正常終了時
    builder.addCase(this.initialize.rejected, (state, action) => {
      state.contract = { status: 'failed' }
    })
  }*/
})
