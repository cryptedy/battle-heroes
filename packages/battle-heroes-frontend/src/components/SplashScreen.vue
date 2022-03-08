<template>
  <div class="splash-screen">
    <BaseGrid>
      <BaseGridRow>
        <BaseGridColumn>
          <p>
            <BaseSpinner />
            {{ message }}
          </p>
        </BaseGridColumn>
      </BaseGridRow>
    </BaseGrid>
  </div>
</template>

<script>
export default {
  name: 'SplashScreen',

  props: {
    message: {
      type: String,
      default: 'Loading...'
    }
  }
}
</script>
