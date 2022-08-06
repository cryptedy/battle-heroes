import { COLLECTION_ID } from '@/utils/constants'

export function NFTShortName(NFT) {
  if (NFT.collection_id === COLLECTION_ID.PIXEL_HEROES) {
    return `PHS #${NFT.token_id}`
  } else if (NFT.collection_id === COLLECTION_ID.PIXEL_HEROES_X) {
    return `PHX #${NFT.token_id}`
  } else if (NFT.collection_id === COLLECTION_ID.PIXEL_CRYPTO_NINJA_HEROES) {
    return `PCNH #${NFT.token_id}`
  }

  return NFT.name
}
