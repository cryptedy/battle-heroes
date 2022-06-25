const axios = require('axios')
const { selectNFT } = require('../NFT/selectors')

const {
  FRONTEND_URL,
  DISCORD_WEBHOOK_URL,
  DISCORD_POST_TYPE
} = require('../utils/constants')

const USERNAME = 'BATTLE HEROES'

const post = data => {
  return axios.post(DISCORD_WEBHOOK_URL, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

const createBattleCreatedData = (player, battle) => {
  const NFT = selectNFT(battle.players[1].NFT_id)

  return {
    username: USERNAME,
    embeds: [
      {
        title: `${player.name} がバトル挑戦者募集中！`,
        description: player.name,
        url: `${FRONTEND_URL}/battles/${battle.id}`,
        color: 5025360,
        author: {
          name: player.name,
          icon_url: player.avatar_url
        },
        image: {
          url: NFT.image_url
        },
        fields: [
          {
            name: 'EXP',
            value: player.exp,
            inline: true
          },
          {
            name: 'WIN',
            value: player.win,
            inline: true
          },
          {
            name: 'LOSE',
            value: player.lose,
            inline: true
          }
        ]
      }
    ]
  }
}

const createBattleMatchedData = (player1, player2, battle) => {
  const NFT1 = selectNFT(battle.players[1].NFT_id)
  const NFT2 = selectNFT(battle.players[2].NFT_id)

  return {
    username: USERNAME,
    embeds: [
      {
        title: `${player1.name} が ${player2.name} にバトルを挑んだ！`,
        description: player1.name,
        url: `${FRONTEND_URL}/battles/${battle.id}`,
        color: 16750592,
        author: {
          name: player1.name,
          icon_url: player1.avatar_url
        },
        image: {
          url: NFT2.image_url
        },
        thumbnail: {
          url: NFT1.image_url
        },
        fields: [
          {
            name: 'EXP',
            value: player1.exp,
            inline: true
          },
          {
            name: 'WIN',
            value: player1.win,
            inline: true
          },
          {
            name: 'LOSE',
            value: player1.lose,
            inline: true
          }
        ]
      }
    ]
  }
}

const createBattleEndedData = (winnerPlayer, loserPlayer, battle, game) => {
  const winnerPlayerKey = battle.players[1].id === winnerPlayer.id ? 1 : 2
  const loserPlayerKey = winnerPlayerKey === 1 ? 2 : 1

  const winnerNFT = selectNFT(battle.players[winnerPlayerKey].NFT_id)
  const loserNFT = selectNFT(battle.players[loserPlayerKey].NFT_id)

  return {
    username: USERNAME,
    embeds: [
      {
        title: `${winnerPlayer.name} が ${loserPlayer.name} に勝利した！`,
        color: 2201331,
        image: {
          url: winnerNFT.image_url
        },
        thumbnail: {
          url: loserNFT.image_url
        },
        fields: [
          {
            name: '😊 WIN',
            value: winnerPlayer.name,
            inline: true
          },
          {
            name: '😭 LOSE',
            value: loserPlayer.name,
            inline: true
          },
          {
            name: 'TURN',
            value: game.turn + 1,
            inline: true
          }
        ]
      }
    ]
  }
}

const postDiscord = ({ type, payload }) => {
  console.log('postDiscord', type, payload)

  if (!DISCORD_WEBHOOK_URL) return

  if (type === DISCORD_POST_TYPE.BATTLE_CREATED) {
    const { player, battle } = payload

    const data = createBattleCreatedData(player, battle)

    return post(data)
  } else if (type === DISCORD_POST_TYPE.BATTLE_MATCHED) {
    const { player1, player2, battle } = payload

    const data = createBattleMatchedData(player1, player2, battle)

    return post(data)
  } else if (type === DISCORD_POST_TYPE.BATTLE_ENDED) {
    const { winnerPlayer, loserPlayer, battle, game } = payload

    const data = createBattleEndedData(winnerPlayer, loserPlayer, battle, game)

    return post(data)
  } else {
    throw new Error(`Invalid discord post type ${type} given`)
  }
}

module.exports = {
  postDiscord
}
