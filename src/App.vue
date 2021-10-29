<template>
  <v-app>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <Navbar />
    <Sidebar />
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
export default {
  name: 'App',
  components: { Navbar, Sidebar },
  computed: {
    overlay() {
      return this.$store.state.overlay
    }
  }
};
</script>

<style>
::-webkit-scrollbar { width: 0; }
.v-btn span {
  font-weight: 400 !important;
  font-size: 13px !important;
  text-transform: capitalize !important;
}
img {
  display: block;
  height: 100%;
  width: 100%;
  object-fit: cover;
}
</style>
