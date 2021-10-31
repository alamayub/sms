<template>
  <v-app-bar app color="primary" elevate-on-scroll dark height="60">
    <v-app-bar-nav-icon @click="setDrawer(!drawer)" />
    <v-spacer />
    <v-btn icon>
      <v-icon v-text="'mdi-account'" />
    </v-btn>
  </v-app-bar>  
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState(['drawer']),
  },
  methods: {
    ...mapMutations({
      setDrawer: 'SET_DRAWER',
    })
  }
}
</script>

<style>
.v-toolbar__content { padding: 0 12px !important; }
</style>
