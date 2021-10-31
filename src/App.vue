<template>
  <v-app>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
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

/* Input Fields */
.v-text-field input, .v-input .v-label {
  font-size: 13px !important;
  color: rgb(0 0 0 / 80%) !important;
  font-weight: 400 !important;
  letter-spacing: 1px !important;
}
.v-input input { font-size: 13px !important; }
.v-input .v-label { 
  line-height: 1 !important;
  font-size: small !important;
}
.v-text-field--outlined.v-input--is-focused fieldset { border: 1px solid #502989 !important; }
.v-text-field--outlined.v-input--has-state fieldset { border: 1px solid #ff2059 !important; }
.v-input .v-icon.v-icon { font-size: 18px !important; }
.v-text-field--outlined.v-input--dense .v-label { top: 14px !important; }
.v-input__prepend-outer { display: none !important; }
</style>
