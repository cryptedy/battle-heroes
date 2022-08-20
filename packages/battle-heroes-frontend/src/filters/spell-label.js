import { COLLECTION_ID } from '@/utils/constants'

export function spellLabel(NFT) {
  if (NFT.collection_id === COLLECTION_ID.PIXEL_CRYPTO_NINJA_HEROES) {
    return '忍術'
  }

  return '魔法'
}
