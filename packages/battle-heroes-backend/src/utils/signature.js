//ethersモジュール読み込み
const { ethers } = require('ethers')

const makeMessage = function (
  addr,
  nonce,
  timestamp,
  cid,
  tid,
  exp,
  lv,
  status
) {
  let msg =
    String(addr).toLowerCase() +
    '|' +
    String(nonce) +
    '|' +
    String(timestamp) +
    '|' +
    String(cid) +
    '|' +
    String(tid) +
    '|' +
    String(exp) +
    '|' +
    String(lv)
  for (let i = 0; i < 11; i++) {
    if (i < status.length) {
      msg = msg + '|' + String(status[i])
    } else {
      msg = msg + '|0'
    }
  }
  return msg
}

const makeMessageBytes = function (
  addr,
  nonce,
  timestamp,
  cid,
  tid,
  exp,
  lv,
  status
) {
  return ethers.utils.arrayify(
    ethers.utils.id(
      makeMessage(addr, nonce, timestamp, cid, tid, exp, lv, status)
    )
  )
}
const makeMsgExp = function (addr, nonce, timestamp, cid, tid, dExp, inc) {
  let sgn = '+'
  if (!inc) sgn = '-'
  let msg =
    String(addr).toLowerCase() +
    '|' +
    String(nonce) +
    '|' +
    String(timestamp) +
    '|' +
    String(cid) +
    '|' +
    String(tid) +
    '|' +
    sgn +
    String(dExp)
  return msg
}

const makeMsgExpBytes = function (addr, nonce, timestamp, cid, tid, dExp, inc) {
  return ethers.utils.arrayify(
    ethers.utils.id(makeMsgExp(addr, nonce, timestamp, cid, tid, dExp, inc))
  )
}

const signature = {
  makeMessage,
  makeMessageBytes,
  makeMsgExp,
  makeMsgExpBytes
}

//module.exports = { deployContract, makeMessage, makeMessageBytes};
module.exports = { signature }
