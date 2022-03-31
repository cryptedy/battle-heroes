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
