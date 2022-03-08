<template>
  <LayoutHome>
    <LoginButtoon />
  </LayoutHome>
</template>

<script>
import LayoutHome from '@/components/LayoutHome'
import LoginButtoon from '@/components/LoginButtoon'

export default {
  name: 'Login',

  components: {
    LayoutHome,
    LoginButtoon
  }
}
</script>
