## トークン転送の実装案メモ

- back 準備

  - 起動時に event listener を on にする。終了時には off。

- front:exp 転送のリクエストを受けとる。
  - NFTid(通し番)
  - dexp
  - callback
- back:
  - `const player = this.findSocketPlayer(this.socket.id)`でプレイヤーオブジェクトを取得
  - NFTid を collectionId と tokenId に変換
  - 転送要求 dexp が DB 上の exp 以下であることを確認
  - 現時点での NFT 所有者であることをチェーンに確認(NFT contract)
  - if (startBlockNumber)
    - expireDuration を取得(vault)
    - if (startBlockNumber+expireDuration >= 現在の block.Number)
      - ロック中のため失敗
  - player の wallet の nonce を取得(vault)
  - 署名生成
  - startBlockNumber を現在の block.number に更新
  - callback で以下を返却
    - startBlockNumber
    - collectionId
    - tokenId
    - dexp
    - nonce
    - 署名ハッシュ
- front
  - callback が成功であれば、walle app を起動し tx を起こす
  - tx は valut.mintExp()
    - startBlockNumber
    - collectionId
    - tokenId
    - dexp
    - 署名ハッシュ
- Backend
  - イベントリッスン
    - 該当する collectionId, tokenId の dexp を減らし、startBlockNumber を undefined に更新する
