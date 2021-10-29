<template>
  <v-app-bar app color="white">
    <v-app-bar-nav-icon class="d-block d-sm-none" @click="setDrawer(!drawer)" />
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
  },
  created() {
    window.addEventListener('resize', () => { if(window.innerWidth > 600) this.setDrawer(true) })
    if(window.innerWidth > 600) this.setDrawer(true)
  }
}
</script>

<style>
.v-toolbar__content { padding: 0 12px !important; }
</style>
