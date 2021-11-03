<template>
  <v-navigation-drawer v-model="drawer" app color="primary" stateless width="120">
    <div style="height: 100px;"></div>

    <div class="nav pa-2 d-flex flex-column" style="grid-gap: 6px;">
      <v-btn color="white" v-for="(menu, m) in menus" :key="m" :to="menu.to" text>
        <v-icon size="20" v-text="menu.icon" />
        <span v-text="menu.title" />
      </v-btn>
    </div>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn block color='red' dark @click="logout">
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
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style>
.v-list .v-list-item--active { border-left: 3px solid !important; }
.nav .v-btn:not(.v-btn--round).v-size--default {
  height: 70px !important;
}
.nav .v-btn__content {
  flex-direction: column !important;
  grid-gap: 6px !important;
}
</style>