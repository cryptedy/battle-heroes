const view = path => () =>
  import(/* webpackChunkName: "" */ `@/views/${path}`).then(
    module => module.default || module
  )

export default [
  {
    path: '/',
    name: 'index',
    meta: { middleware: ['guest'] },
    component: view('Index')
  },
  {
    path: '/login',
    name: 'login',
    meta: { middleware: ['guest'] },
    component: view('Login')
  },
  {
    path: '/logout',
    name: 'logout',
    meta: { middleware: ['auth'] },
    component: view('Logout')
  },
  {
    path: '/home',
    name: 'home',
    meta: { middleware: ['auth', 'game', 'battle'] },
    component: view('Home')
  },
  {
    path: '/players',
    name: 'players',
    meta: { middleware: ['auth', 'game', 'battle'] },
    component: view('Players')
  },
  {
    path: '/messages',
    name: 'messages',
    meta: { middleware: ['auth', 'game', 'battle'] },
    component: view('Messages')
  },
  {
    path: '/battles',
    name: 'battles',
    meta: { middleware: ['auth', 'game', 'battle'] },
    component: view('Battles')
  },
  {
    path: '/battles/:battleId',
    name: 'game',
    meta: { middleware: ['auth', 'game'] },
    component: view('Game')
  },
  {
    path: '/settings',
    name: 'settings',
    meta: { middleware: ['auth', 'game', 'battle'] },
    redirect: { name: 'settings.account' },
    component: view('settings/Index'),
    children: [
      {
        path: 'account',
        name: 'settings.account',
        component: view('settings/Account')
      }
    ]
  }
]
