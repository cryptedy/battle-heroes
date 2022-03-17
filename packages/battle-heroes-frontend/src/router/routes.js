const view = path => () =>
  import(/* webpackChunkName: "" */ `@/views/${path}`).then(
    module => module.default || module
  )

export default [
  {
    path: '/',
    name: 'home',
    meta: { middleware: ['guest'] },
    component: view('Home')
  },
  {
    path: '/login',
    name: 'login',
    meta: { middleware: ['guest'] },
    component: view('auth/Login')
  },
  {
    path: '/logout',
    name: 'logout',
    meta: { middleware: ['auth'] },
    component: view('auth/Logout')
  },
  {
    path: '/players',
    name: 'players',
    meta: { middleware: ['auth'] },
    component: view('players/Index')
  },
  {
    path: '/messages',
    name: 'messages',
    meta: { middleware: ['auth'] },
    component: view('messages/Index')
  },
  {
    path: '/games',
    name: 'games',
    meta: { middleware: ['auth'] },
    component: view('games/Index')
  },
  {
    path: '/games/:gameId',
    name: 'games.show',
    meta: { middleware: ['auth'] },
    component: view('games/Show')
  }
]
