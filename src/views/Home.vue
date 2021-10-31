<template>
  <div class="home">
    <Navbar />
    <Sidebar />
    <router-view :key="$route.path" />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'
export default {
  components: { Navbar, Sidebar },
}
</script>