<template>
  <v-card class="elevation-0 pt-0">
    <v-card-title class="pa-0 mb-2">
      <v-text-field v-model="search" outlined dense append-icon="mdi-magnify" label="Search" hide-details />
    </v-card-title>
    <v-data-table :loading="table_load" fixed-header :headers="header" :items="items" :search="search" :page.sync="page" :items-per-page="itemsPerPage" hide-default-footer @page-count="pageCount = $event">
      <template v-slot:[`item.sno`]="{ item }">
        <v-chip outlined x-small class="font-weight-bold">{{ getSNO(item)+1 }}</v-chip>
      </template>
      <template v-slot:[`item.actions`]="{  }">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" small icon v-bind="attrs" v-on="on">
              <v-icon small>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>
          <v-list nav dense class="pa-0" width="200">
            <v-list-item dense v-for="(a, index) in actions" :key="index" >
              <v-list-item-icon class="mx-2">
                <v-icon small :color="a.color" v-text="a.icon" />
              </v-list-item-icon>
              <v-list-item-content class="caption font-weight-bold" v-text="a.name" />
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
    <div class="text-center pt-1">
      <v-pagination v-model="page" circle :length="pageCount" />
    </div>
  </v-card>  
</template>

<script>
export default {
  props: {
    header: Array,
    items: Array,
    actions: Array,
  },
  data: () => ({
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    search: '',
  }),
  computed: {
    table_load() {
      return this.$store.state.table_load
    },
  },
  methods: {
    getSNO(item) {
      return this.items.indexOf(item)
    },  
  }
}
</script>