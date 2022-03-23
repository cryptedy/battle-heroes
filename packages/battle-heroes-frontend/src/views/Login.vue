<template>
  <TheLayoutWeb>
    <LoginButton />
  </TheLayoutWeb>
</template>

<script>
import LoginButton from '@/components/LoginButton'
import TheLayoutWeb from '@/components/TheLayoutWeb'

export default {
  name: 'Index',

  components: {
    LoginButton,
    TheLayoutWeb
  }
}
</script>
