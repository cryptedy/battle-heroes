<template>
  <div class="account-menu">
    <BaseList class="account-menu-list">
      <BaseListItem class="account-menu-list-item">
        <router-link
          :to="{ name: 'settings.account' }"
          class="account-menu-list-item-link"
        >
          <FontAwesomeIcon icon="user" />
          ACCOUNT
        </router-link>
      </BaseListItem>
      <BaseListItem class="account-menu-list-item">
        <router-link
          :to="{ name: 'logout' }"
          class="account-menu-list-item-link"
        >
          <FontAwesomeIcon icon="arrow-right-from-bracket" />
          LOGOUT
        </router-link>
      </BaseListItem>
    </BaseList>
  </div>
</template>

<script>
export default {
  name: 'AccountMenu',

  props: {
    player: {
      type: Object,
      required: true
    }
  }
}
</script>
