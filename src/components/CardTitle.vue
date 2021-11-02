<template>
  <v-card-title class="grey lighten-3 d-flex justify-space-between">
    <div class="title">{{ title }}</div>
    <v-btn color="red" icon @click="close">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-card-title>  
</template>

<script>
export default {
  props: {
    title: String,
    close:Function  
  }  
}
</script>