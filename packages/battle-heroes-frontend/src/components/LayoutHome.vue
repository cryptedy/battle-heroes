<template>
  <BaseGrid>
    <BaseGridRow>
      <BaseGridColumn>
        <slot />
      </BaseGridColumn>
    </BaseGridRow>
  </BaseGrid>
</template>

<script>
export default {
  name: 'LayoutHome'
}
</script>
