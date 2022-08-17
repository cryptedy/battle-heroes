import {
  SET_AUDIO,
  INIT_AUDIO,
  PLAY_AUDIO,
  STOP_AUDIO,
  PAUSE_AUDIO,
  RESUME_AUDIO,
  STOP_AUDIO_ALL
} from '../mutation-types'
import { MUSIC, SOUND_EFFECT } from '@/utils/constants'
import MusicBattle from '@/assets/audio/music/battle.mp3'
import MusicStandby from '@/assets/audio/music//standby.mp3'
import SoundEffectAttack from '@/assets/audio/effects/attack.mp3'
import SoundEffectAttackCritical from '@/assets/audio/effects/attack-critical.mp3'
import SoundEffectHeal from '@/assets/audio/effects/heal.mp3'
import SoundEffectDamage from '@/assets/audio/effects/damage.mp3'
import SoundEffectEncounter from '@/assets/audio/effects/encounter.mp3'

const AudioContext = window.AudioContext || window.webkitAudioContext

const TYPE = {
  MUSIC: 'MUSIC',
  SOUND_EFFECT: 'SOUND_EFFECT'
}

const STATE = {
  CREATED: 'CREATED',
  STOPPED: 'STOPPED',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED'
}

const createAudio = (type, source) => {
  const audioElement = new Audio(source)

  return {
    type,
    audioElement,
    audioContext: null,
    track: null,
    osc: null,
    state: STATE.CREATED
  }
}

const initialState = () => {
  let audio = false

  if (window.localStorage.getItem('audio')) {
    try {
      audio = JSON.parse(window.localStorage.getItem('audio'))
    } catch (error) {
      window.localStorage.removeItem('audio')
    }
  }

  return {
    loading: false,
    loaded: false,
    error: '',
    audio: audio,
    sounds: {
      [MUSIC.BATTLE]: createAudio(TYPE.MUSIC, MusicBattle),
      [MUSIC.STANDBY]: createAudio(TYPE.MUSIC, MusicStandby),
      [SOUND_EFFECT.ATTACK]: createAudio(TYPE.SOUND_EFFECT, SoundEffectAttack),
      [SOUND_EFFECT.ATTACK_CRITICAL]: createAudio(
        TYPE.SOUND_EFFECT,
        SoundEffectAttackCritical
      ),
      [SOUND_EFFECT.HEAL]: createAudio(TYPE.SOUND_EFFECT, SoundEffectHeal),
      [SOUND_EFFECT.DAMAGE]: createAudio(TYPE.SOUND_EFFECT, SoundEffectDamage),
      [SOUND_EFFECT.ENCOUNTER]: createAudio(
        TYPE.SOUND_EFFECT,
        SoundEffectEncounter
      )
    }
  }
}

export const state = initialState()

export const getters = {
  isAudioEnabled: state => state.audio
}

export const mutations = {
  [INIT_AUDIO](state, { sound }) {
    const audioContext = new AudioContext()

    const track = audioContext.createMediaElementSource(
      new Audio(state.sounds[sound].source)
    )
    const osc = audioContext.createOscillator()

    track.connect(audioContext.destination)
    osc.connect(audioContext.destination)

    state.sounds[sound].audioContext = audioContext
    state.sounds[sound].track = track
    state.sounds[sound].osc = osc
    state.sounds[sound].state = STATE.STOPPED
  },

  [SET_AUDIO](state, { audio }) {
    try {
      window.localStorage.setItem('audio', JSON.stringify(audio))

      state.audio = audio
    } catch (error) {
      window.localStorage.removeItem('audio')

      state.audio = false
    }
  },

  [PLAY_AUDIO](state, { sound }) {
    if (state.sounds[sound].state === 'suspended') {
      state.sounds[sound].audioContext.resume()
    }

    if (state.audio) {
      state.sounds[sound].audioElement.play()
      state.sounds[sound].state = STATE.PLAYING
    } else {
      if (state.sounds[sound].type === TYPE.SOUND_EFFECT) {
        state.sounds[sound].state = STATE.STOPPED
      } else {
        state.sounds[sound].state = STATE.PAUSED
      }
    }
  },

  [PAUSE_AUDIO](state, { sound }) {
    state.sounds[sound].audioElement.pause()
    state.sounds[sound].state = STATE.PAUSED
  },

  [RESUME_AUDIO](state, { sound }) {
    if (state.sounds[sound].state === STATE.PAUSED) {
      state.sounds[sound].audioElement.play()
      state.sounds[sound].state = STATE.PLAYING
    }
  },

  [STOP_AUDIO](state, { sound }) {
    state.sounds[sound].audioElement.pause()
    state.sounds[sound].audioElement.currentTime = 0
    state.sounds[sound].state = STATE.STOPPED
  },

  [STOP_AUDIO_ALL](state) {
    Object.keys(state.sounds).forEach(sound => {
      state.sounds[sound].audioElement.pause()
      state.sounds[sound].audioElement.currentTime = 0
      state.sounds[sound].state = STATE.STOPPED
    })
  }
}

export const actions = {
  reset({ commit }) {
    console.log('audio/reset')

    Object.keys(state.sounds).forEach(sound => {
      if (!state.sounds[sound].state.CREATED) {
        commit(INIT_AUDIO, { sound })

        // stop when sound has ended
        state.sounds[sound].audioElement.addEventListener(
          'ended',
          () => {
            console.log('ended', sound)
            commit(STOP_AUDIO, { sound })
          },
          false
        )
      }
    })
  },

  setAudio({ commit, state }, audio) {
    console.log('app/setAudio', audio)

    commit(SET_AUDIO, { audio })

    if (state.audio) {
      // resume all paused sounds
      Object.keys(state.sounds).forEach(sound => {
        if (state.sounds[sound].state === STATE.PAUSED) {
          commit(PLAY_AUDIO, { sound })
        }
      })
    } else {
      Object.keys(state.sounds).forEach(sound => {
        if (state.sounds[sound].type === TYPE.SOUND_EFFECT) {
          // stop all playing sound effects
          if (state.sounds[sound].state === STATE.PLAYING) {
            commit(STOP_AUDIO, { sound })
          }
        } else {
          // pause all playing music
          if (state.sounds[sound].state === STATE.PLAYING) {
            commit(PAUSE_AUDIO, { sound })
          }
        }
      })
    }
  },

  play({ commit }, sound) {
    commit(PLAY_AUDIO, { sound })
  },

  pause({ commit }, sound) {
    commit(PAUSE_AUDIO, { sound })
  },

  stop({ commit }, sound) {
    commit(STOP_AUDIO, { sound })
  },

  stopAll({ commit }) {
    commit(STOP_AUDIO_ALL)
  }
}
