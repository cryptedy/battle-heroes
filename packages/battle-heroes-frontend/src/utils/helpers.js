export function getScrollbarState(el) {
  const state = { vertical: true, horizontal: true }

  const getRootElement = () => {
    return document.compatMode == 'BackCompat'
      ? document.body
      : document.documentElement
  }

  try {
    const root = el ? el : getRootElement()

    state.vertical = root.scrollHeight > root.clientHeight
    state.horizontal = root.scrollWidth > root.clientWidth
    // eslint-disable-next-line no-empty
  } catch (error) {}

  return state
}

export function getScrollbarWidth() {
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll'

  document.body.appendChild(outer)

  const inner = document.createElement('div')
  outer.appendChild(inner)

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth

  outer.parentNode.removeChild(outer)

  return scrollbarWidth
}

export function scrollToBottom(el, smooth = false) {
  try {
    if (smooth) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth'
      })
    } else {
      el.scrollTo(0, el.scrollHeight)
    }
    // eslint-disable-next-line no-empty
  } catch (error) {
    console.log(error)
  }
}

export function getPlayerFullStats({ exp, win, lose }) {
  exp = exp || 0
  win = win || 0
  lose = lose || 0

  let totalMatch = 0
  let winRate = 0

  totalMatch = win + lose

  if (totalMatch > 0) {
    if (totalMatch > 0) {
      winRate = Math.floor((win / totalMatch) * 100)
    }
  }

  return {
    exp,
    win,
    lose,
    totalMatch,
    winRate
  }
}
