import {
  SET_AUDIO,
  INIT_AUDIO,
  PLAY_AUDIO,
  STOP_AUDIO,
  PAUSE_AUDIO,
  RESUME_AUDIO
} from '../mutation-types'
import { MUSIC, SOUND_EFFECT } from '@/utils/constants'
import MusicBattle from '@/assets/audio/music/battle.mp3'
import MusicStandby from '@/assets/audio/music//standby.mp3'
import SoundEffectAttack from '@/assets/audio/effects/attack.mp3'
import SoundEffectAttackCritical from '@/assets/audio/effects/attack-critical.mp3'
import SoundEffectHeal from '@/assets/audio/effects/heal.mp3'
import SoundEffectDamage from '@/assets/audio/effects/damage.mp3'
import SoundEffectSpell from '@/assets/audio/effects/spell.mp3'
import SoundEffectDefence from '@/assets/audio/effects/defence.mp3'
import SoundEffectEncounter from '@/assets/audio/effects/encounter.mp3'
import SoundEffectWin from '@/assets/audio/effects/win.mp3'
import SoundEffectLose from '@/assets/audio/effects/lose.mp3'

// An array of all contexts to resume on the page
const audioContextList = []

// An array of various user interaction events we should listen for
const userInputEventNames = [
  'click',
  'contextmenu',
  'auxclick',
  'dblclick',
  'mousedown',
  'mouseup',
  'pointerup',
  'touchend',
  'keydown',
  'keyup'
]

// A proxy object to intercept AudioContexts and
// add them to the array for tracking and resuming later
window.AudioContext = new Proxy(window.AudioContext, {
  construct(target, args) {
    console.log('audio:AudioContext instanciate!')
    const result = new target(...args)
    audioContextList.push(result)
    return result
  }
})

// To resume all AudioContexts being tracked
// eslint-disable-next-line no-unused-vars
function resumeAllContexts(event) {
  console.log('audio:resumeAllContexts')
  let count = 0

  audioContextList.forEach(context => {
    if (context.state !== 'running') {
      context.resume()
    } else {
      count++
    }
  })

  // If all the AudioContexts have now resumed then we
  // unbind all the event listeners from the page to prevent
  // unnecessary resume attempts
  if (count == audioContextList.length) {
    userInputEventNames.forEach(eventName => {
      document.removeEventListener(eventName, resumeAllContexts)
    })
  }
}

// We bind the resume function for each user interaction
// event on the page
userInputEventNames.forEach(eventName => {
  document.addEventListener(eventName, resumeAllContexts)
})

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
      [SOUND_EFFECT.SPELL]: createAudio(TYPE.SOUND_EFFECT, SoundEffectSpell),
      [SOUND_EFFECT.HEAL]: createAudio(TYPE.SOUND_EFFECT, SoundEffectHeal),
      [SOUND_EFFECT.DEFENCE]: createAudio(
        TYPE.SOUND_EFFECT,
        SoundEffectDefence
      ),
      [SOUND_EFFECT.DAMAGE]: createAudio(TYPE.SOUND_EFFECT, SoundEffectDamage),
      [SOUND_EFFECT.ENCOUNTER]: createAudio(
        TYPE.SOUND_EFFECT,
        SoundEffectEncounter
      ),
      [SOUND_EFFECT.WIN]: createAudio(TYPE.SOUND_EFFECT, SoundEffectWin),
      [SOUND_EFFECT.LOSE]: createAudio(TYPE.SOUND_EFFECT, SoundEffectLose)
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

    // const track = audioContext.createMediaElementSource(
    //   state.sounds[sound].audioElement
    // )
    // const osc = audioContext.createOscillator()

    // track.connect(audioContext.destination)
    // osc.connect(audioContext.destination)

    state.sounds[sound].audioContext = audioContext
    // state.sounds[sound].track = track
    // state.sounds[sound].osc = osc
    state.sounds[sound].state = STATE.STOPPED

    if (state.sounds[sound].type === TYPE.MUSIC) {
      state.sounds[sound].audioElement.loop = true
    }
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
    state.sounds[sound].state = STATE.PLAYING
  },

  [PAUSE_AUDIO](state, { sound }) {
    state.sounds[sound].state = STATE.PAUSED
  },

  [RESUME_AUDIO](state, { sound }) {
    state.sounds[sound].state = STATE.PLAYING
  },

  [STOP_AUDIO](state, { sound }) {
    state.sounds[sound].audioElement.currentTime = 0
    state.sounds[sound].state = STATE.STOPPED
  }
}

export const actions = {
  setAudio({ commit, dispatch, state }, audio) {
    console.log('app/setAudio', audio)

    commit(SET_AUDIO, { audio })

    if (audio) {
      // resume all paused sounds
      Object.keys(state.sounds).forEach(sound => {
        dispatch('resume', sound)
      })
    } else {
      Object.keys(state.sounds).forEach(sound => {
        if (state.sounds[sound].type === TYPE.SOUND_EFFECT) {
          // stop all playing sound effects
          dispatch('stop', sound)
        } else {
          // pause all playing music
          dispatch('pause', sound)
        }
      })
    }
  },

  async play({ commit }, sound) {
    console.log('audio/play', sound)

    if (state.sounds[sound].state === STATE.CREATED) {
      console.log('audio:init', sound)

      commit(INIT_AUDIO, { sound })

      // stop when sound has ended
      state.sounds[sound].audioElement.addEventListener(
        'ended',
        () => {
          console.log('audio:ended', sound)
          commit(STOP_AUDIO, { sound })
        },
        false
      )
    }

    if (state.audio) {
      if (state.sounds[sound].state === STATE.PLAYING) {
        console.log(`audio ${sound} already playing...`)
        state.sounds[sound].audioElement.pause()
        commit(STOP_AUDIO, { sound })
      }

      return state.sounds[sound].audioElement.play().then(() => {
        commit(PLAY_AUDIO, { sound })
      })
    } else {
      if (state.sounds[sound].type === TYPE.SOUND_EFFECT) {
        commit(STOP_AUDIO, { sound })
      } else {
        commit(PAUSE_AUDIO, { sound })
      }

      // emulate sound play if muted
      return new Promise(resolve => setTimeout(resolve, 300))
    }
  },

  pause({ commit }, sound) {
    console.log('audio/pause', sound)

    if (state.sounds[sound].state === STATE.PLAYING) {
      state.sounds[sound].audioElement.pause()
      commit(PAUSE_AUDIO, { sound })
    }
  },

  resume({ commit }, sound) {
    console.log('audio/resume', sound)

    if (state.sounds[sound].state === STATE.PAUSED) {
      state.sounds[sound].audioElement.play()
      commit(RESUME_AUDIO, { sound })
    }
  },

  stop({ commit }, sound) {
    console.log('audio/stop', sound)

    if (
      state.sounds[sound].state === STATE.PLAYING ||
      state.sounds[sound].state === STATE.PAUSED
    ) {
      state.sounds[sound].audioElement.pause()
      commit(STOP_AUDIO, { sound })
    }
  },

  resumeAll({ dispatch }) {
    console.log('audio/resumeAll')

    Object.keys(state.sounds).forEach(sound => {
      dispatch('resume', sound)
    })
  },

  pauseAll({ dispatch }) {
    console.log('audio/pauseAll')

    Object.keys(state.sounds).forEach(sound => {
      dispatch('pause', sound)
    })
  },

  stopAll({ dispatch }) {
    console.log('audio/stopAll')

    Object.keys(state.sounds).forEach(sound => {
      dispatch('stop', sound)
    })
  }
}
