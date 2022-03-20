<template>
  <LayoutHome>
    <BaseGrid>
      <BaseGridRow>
        <BaseGridColumn>
          <LoginButton />
        </BaseGridColumn>
      </BaseGridRow>
    </BaseGrid>
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
