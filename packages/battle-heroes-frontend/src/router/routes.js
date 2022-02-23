const view = path => () =>
  import(/* webpackChunkName: "" */ `@/views/${path}`).then(
    module => module.default || module
  )

export default [
  {
    path: '/',
    name: 'home',
    component: view('Home')
  },
  {
    path: '/test',
    name: 'test',
    component: view('Test')
  }
]
