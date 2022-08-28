import { COLLECTIONS } from '@/utils/constants'

export function NFTShortName(NFT) {
  const collection = COLLECTIONS.find(
    collection => collection.id === NFT.collection_id
  )

  if (collection) {
    return `${collection.name_short} #${NFT.token_id}`
  }

  return NFT.name
}
