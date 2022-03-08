<template>
  <LayoutHome>
    <LoginButtoon />
  </LayoutHome>
</template>

<script>
import LayoutHome from '@/components/LayoutHome'
import LoginButtoon from '@/components/LoginButtoon'

export default {
  name: 'Home',

  components: {
    LayoutHome,
    LoginButtoon
  }
}
</script>
