<template>
  <div id="header">
    <TheHeader />
  </div>

  <div id="main">
    <TheMain>
      <LoginButton />
    </TheMain>
  </div>
</template>

<script>
import TheMain from '@/components/TheMain'
import TheHeader from '@/components/TheHeader'
import LoginButton from '@/components/LoginButton'

export default {
  name: 'Index',

  components: {
    TheMain,
    TheHeader,
    LoginButton
  }
}
</script>
