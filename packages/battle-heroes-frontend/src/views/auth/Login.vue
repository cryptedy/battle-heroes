<template>
  <LayoutHome>
    <LoginButton />
  </LayoutHome>
</template>

<script>
import LayoutHome from '@/components/LayoutHome'
import LoginButton from '@/components/LoginButton'

export default {
  name: 'Login',

  components: {
    LayoutHome,
    LoginButton
  }
}
</script>
