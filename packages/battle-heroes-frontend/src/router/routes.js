const view = path => () =>
  import(/* webpackChunkName: "" */ `@/views/${path}`).then(
    module => module.default || module
  )

export default [
  {
    path: '/home',
    redirect: () => ({ name: 'arena' })
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      layout: 'web',
      middleware: ['guest']
    },
    component: view('auth/Login')
  },
  {
    path: '/logout',
    name: 'logout',
    meta: {
      layout: 'web',
      middleware: ['auth']
    },
    component: view('auth/Logout')
  },
  {
    path: '/collections',
    name: 'collections',
    meta: {
      layout: 'web',
      middleware: ['guest']
    },
    component: view('collections/Index'),
    redirect: () => ({ name: 'collections.show', params: { collectionId: 1 } }),
    children: [
      {
        path: ':collectionId',
        name: 'collections.show',
        component: view('collections/_CollectionId')
      }
    ]
  },
  {
    path: '/',
    meta: {
      layout: 'game',
      middleware: ['auth', 'game']
    },
    component: view('arena/Index'),
    children: [
      {
        path: '',
        name: 'arena',
        component: view('arena/Battles')
      },
      {
        path: 'players',
        name: 'arena.players',
        component: view('arena/Players')
      },
      {
        path: 'chat',
        name: 'arena.chat',
        component: view('arena/Messages')
      }
    ]
  },
  {
    path: '/battles/:battleId',
    name: 'battles.show',
    meta: {
      layout: 'game',
      middleware: ['auth', 'game']
    },
    component: view('battle/_BattleId')
  },
  {
    path: '/rankings',
    name: 'rankings',
    meta: {
      layout: 'game',
      middleware: ['auth', 'game']
    },
    component: view('rankings/Index'),
    redirect: () => ({ name: 'rankings.total' }),
    children: [
      {
        path: 'weekly',
        name: 'rankings.weekly',
        component: view('rankings/Weekly')
      },
      {
        path: 'monthly',
        name: 'rankings.monthly',
        component: view('rankings/Monthly')
      },
      {
        path: 'total',
        name: 'rankings.total',
        component: view('rankings/Total')
      }
    ]
  },
  {
    path: '/exchange',
    name: 'exchange',
    meta: {
      layout: 'game',
      middleware: ['auth', 'game']
    },
    component: view('exchange/Index'),
    redirect: () => ({ name: 'exchange.tokens' }),
    children: [
      {
        path: 'tokens',
        name: 'exchange.tokens',
        component: view('exchange/Tokens')
      },
      {
        path: 'items',
        name: 'exchange.items',
        component: view('exchange/Items')
      }
    ]
  },
  {
    path: '/herodex',
    name: 'herodex',
    meta: {
      layout: 'game',
      middleware: ['auth', 'game']
    },
    component: view('herodex/Index'),
    redirect: () => ({ name: 'herodex.show', params: { collectionId: 1 } }),
    children: [
      {
        path: ':collectionId',
        name: 'herodex.show',
        component: view('herodex/_CollectionId')
      }
    ]
  },
  {
    path: '/account',
    name: 'account',
    meta: {
      layout: 'game',
      middleware: ['auth', 'game']
    },
    redirect: { name: 'account.settings' },
    component: view('account/Index'),
    children: [
      {
        path: '',
        name: 'account.settings',
        component: view('account/Settings')
      },
      {
        path: 'labs',
        name: 'account.labs',
        component: view('account/Labs')
      }
    ]
  }
]
