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
    meta: { middleware: ['auth', 'game'] },
    component: view('Home')
  },
  {
    path: '/players',
    name: 'players',
    meta: { middleware: ['auth', 'game'] },
    component: view('Players')
  },
  {
    path: '/messages',
    name: 'messages',
    meta: { middleware: ['auth', 'game'] },
    component: view('Messages')
  },
  {
    path: '/battles',
    name: 'battles',
    meta: { middleware: ['auth', 'game'] },
    component: view('Battles')
  },
  {
    path: '/battles/:battleId',
    name: 'battle',
    meta: { middleware: ['auth', 'game'] },
    component: view('Battle')
  },
  {
    path: '/settings',
    name: 'settings',
    meta: { middleware: ['auth', 'game'] },
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
