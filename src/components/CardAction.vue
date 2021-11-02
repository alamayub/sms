<template>
  <v-card-actions class="px-6 py-4 grey lighten-3">
    <v-spacer />
    <v-btn color="red" dark @click="reset">
      <v-icon v-text="'mdi-cached'" left />
      <span v-text="'Reset'" />  
    </v-btn>
    <v-btn color="success" @click="save" :disabled="!valid">
      <v-icon v-text="'mdi-content-save-outline'" left />
      <span v-text="'Save'" />  
    </v-btn>
  </v-card-actions>  
</template>

<script>
export default {
  props: {
    valid: Boolean,
    reset: Function,
    save: Function  
  }  
}
</script>