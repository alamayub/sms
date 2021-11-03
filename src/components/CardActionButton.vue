<template>
  <div style="position: absolute; top: 6px; right: 6px;">
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn small v-bind="attrs" v-on="on" icon>
          <v-icon small>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list dense class="py-0">
        <v-list-item color="primary" @click="editFunc">
          <v-list-item-icon class="mr-1">
            <v-icon small v-text="'mdi-pencil'" color="primary" />
          </v-list-item-icon>
          <v-list-item-title v-text="'Edit'" class="primary--text" />
        </v-list-item>
          <v-list-item color="red" @click="deleteFunc">
            <v-list-item-icon class="mr-1">
              <v-icon small v-text="'mdi-delete'" color="red" />
            </v-list-item-icon>
            <v-list-item-title v-text="'Delete'" class="red--text" />
          </v-list-item>
        </v-list>
      </v-menu>
  </div>  
</template>

<script>
export default {
  props: {
    editFunc: Function,
    deleteFunc: Function  
  }  
}
</script>