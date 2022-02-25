import axios from 'axios'
import { API_URL } from '@/utils/constants'
import Moralis from 'moralis/dist/moralis.min.js'

const SIGNING_MESSAGE = `Login to ${process.env.VUE_APP_TITLE}`

class AuthService {
  async login() {
    const user = await Moralis.authenticate({
      signingMessage: SIGNING_MESSAGE
    })

    if (user) {
      return this.createUser(user)
    }
  }

  async getUser() {
    const user = Moralis.User.current()

    if (user) {
      return this.createUser(user)
    }
  }

  async logout() {
    return Moralis.User.logOut()
  }

  async getProfile(address) {
    return axios.get(`${API_URL}/users/${address}`)
  }

  async createUser(user) {
    const address = user.get('ethAddress')

    const { data: profile } = await this.getProfile(address)

    return {
      id: user.id,
      address: address,
      name: profile.name,
      image_url: profile.image_url
    }
  }
}

export default new AuthService()
