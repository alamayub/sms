<template>
  <v-fab-transition>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" fab fixed bottom right v-bind="attrs" v-on="on" @click="open">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>New {{ title }}</span>
    </v-tooltip>    
  </v-fab-transition>  
</template>

<script>
export default {
  props: {
    title: String,
    open: Function  
  }  
}
</script>