const view = path => () =>
  import(/* webpackChunkName: "" */ `@/views/${path}`).then(
    module => module.default || module
  )

export default [
  {
    path: '/',
    name: 'index',
    meta: {
      layout: 'web',
      middleware: ['guest']
    },
    component: view('Index')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      layout: 'web',
      middleware: ['guest']
    },
    component: view('Login')
  },
  {
    path: '/logout',
    name: 'logout',
    meta: {
      layout: 'web',
      middleware: ['auth']
    },
    component: view('Logout')
  },
  {
    path: '/collections',
    name: 'collections',
    component: view('collections/Index'),
    // eslint-disable-next-line no-unused-vars
    redirect: to => {
      return { name: 'collections-show', params: { collectionId: 1 } }
    },
    children: [
      {
        path: ':collectionId',
        name: 'collections-show',
        component: view('collections/_CollectionId')
      }
    ]
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      layout: 'game',
      middleware: ['auth', 'game']
    },
    component: view('Home')
  },
  {
    path: '/players',
    name: 'players',
    meta: {
      layout: 'game',
      middleware: ['auth', 'game']
    },
    component: view('Players')
  },
  {
    path: '/messages',
    name: 'messages',
    meta: {
      layout: 'game',
      middleware: ['auth', 'game']
    },
    component: view('Messages')
  },
  {
    path: '/battles',
    name: 'battles',
    meta: {
      layout: 'game',
      middleware: ['auth', 'game']
    },
    component: view('Battles')
  },
  {
    path: '/battles/:battleId',
    name: 'battle',
    meta: {
      layout: 'game',
      middleware: ['auth', 'game']
    },
    component: view('Battle')
  },
  {
    path: '/battles/offline',
    name: 'battle-offline',
    meta: {
      layout: 'game',
      middleware: ['auth', 'game']
    },
    component: view('BattleOffline')
  },
  {
    path: '/settings',
    name: 'settings',
    meta: {
      layout: 'game',
      middleware: ['auth', 'game']
    },
    redirect: { name: 'settings.account' },
    component: view('settings/Index'),
    children: [
      {
        path: 'account',
        name: 'settings.account',
        component: view('settings/Account')
      },
      {
        path: 'labs',
        name: 'settings.labs',
        component: view('settings/Labs')
      }
    ]
  }
]
