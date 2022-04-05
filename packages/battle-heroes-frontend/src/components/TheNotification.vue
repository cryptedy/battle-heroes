<template>
  <div
    v-if="notifications.length > 0"
    class="notification"
    :style="styleObject"
  >
    <transition-group
      appear
      tag="ul"
      name="notification-list"
      class="notification-list"
    >
      <li
        v-for="notification in notifications"
        :key="notification.id"
        :title="notification.message"
        class="notification-list-item"
        :class="`is-type-${notification.type.toLowerCase()}`"
      >
        <div class="notification-list-item-label">
          {{ notification.message }}
        </div>
        <div class="notification-list-item-actions">
          <button @click="removeNotification(notification.id)">
            <FontAwesomeIcon icon="xmark" />
          </button>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TheNotification',

  computed: {
    ...mapGetters({
      notifications: 'notification/all'
    }),

    styleObject() {
      return {
        // specifying transform to class interferes with transition properties
        transform: 'translateX(-50%)'
      }
    }
  },

  methods: {
    ...mapActions({
      removeNotification: 'notification/remove'
    })
  }
}
</script>
