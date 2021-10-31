<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col cols="12">
        <div class="pa-4 mx-auto" style="max-width: 350px;">
          <v-form ref="form" lazy-validation v-model="valid" class="d-flex flex-column" style="grid-gap: 12px;">
            <v-text-field label="Email" v-model="form.email" outlined dense hide-details :rules="[ v => !!v || '' ]" />
            <v-text-field label="Password" v-model="form.password" outlined dense hide-details :rules="[ v => !!v || '' ]" /> 
            <v-btn block color="primary" @click="login">login</v-btn>     
          </v-form>
        </div>
      </v-col>  
    </v-row>
  </v-container>  
</template>

<script>
export default {
  data: () => ({
    valid: true,
    form: {
      email: null,
      password: null  
    }  
  }),
  methods: {
    login() {
      if(this.$refs.form.validate()) {
        this.$store.dispatch({
          type: 'login', 
          email: this.form.email,
          password: this.form.password
        })
      }
    } 
  } 
} 
</script>