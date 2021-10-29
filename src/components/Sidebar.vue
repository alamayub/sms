<template>
  <v-navigation-drawer v-model="drawer" app color="white" stateless>
    <div style="height: 150px;"></div>
    <v-list dense shaped>
      <v-list-item v-for="(menu, m) in menus" :key="m" :to="menu.to" color="primary">
        <v-list-item-icon class="mr-2 ml-1">
          <v-icon v-text="menu.icon" size="20" />
        </v-list-item-icon>
        <v-list-item-title v-text="menu.title" />
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn block color='red' dark>
          <span>logout</span>
          <v-icon size='20' right>mdi-logout</v-icon>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  computed: {
    drawer: {
      get () {
        return this.$store.state.drawer
      },
      set (val) {
        this.$store.commit('SET_DRAWER', val)
      },
    },      
  }
}
</script>

<style scoped>
.v-list .v-list-item--active { border-left: 3px solid !important; }
</style>