<template>
  <Header />

  <h2>Login</h2>

  <LoginButtoon />
</template>

<script>
import Header from '@/components/Header'
import LoginButtoon from '@/components/LoginButtoon'

export default {
  name: 'Login',

  components: {
    Header,
    LoginButtoon
  }
}
</script>
