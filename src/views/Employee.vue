<template>
  <div>
    <FAB title="Employee" :open="() => dialog = true" />
    <v-container fluid class="employee">
      <div class="card__item px-3 py-6 d-flex flex-column justify-center align-center text-center" v-for="(user, i) in users" :key="i">
        <div style="position: absolute; top: 6px; right: 6px;">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn small v-bind="attrs" v-on="on" icon>
                <v-icon small>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense class="py-0">
              <v-list-item color="primary" @click="openEditModel(user)">
                <v-list-item-icon class="mr-1">
                  <v-icon small v-text="'mdi-pencil'" color="primary" />
                </v-list-item-icon>
                <v-list-item-title v-text="'Edit'" class="primary--text" />
              </v-list-item>
              <v-list-item color="red" @click="deleteItem(user['.key'])">
                <v-list-item-icon class="mr-1">
                  <v-icon small v-text="'mdi-delete'" color="red" />
                </v-list-item-icon>
                <v-list-item-title v-text="'Delete'" class="red--text" />
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <v-avatar size="100">
          <img :src="user.image" :alt="user.name">
        </v-avatar>  
        <div class="text-center mt-3">
          <div class="font-weight-bold mb-2" style="line-height: 1;">{{ user.name }}</div>  
          <div class="caption font-weight-bold" style="color: rgb(0 0 0 / 40%); line-height: 1;">{{ user.mobile }}</div>
        </div>
      </div>
    </v-container>

    <!-- Add Dialogue -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card>
        <CardTitle :title="isSave === true ? 'New Employee' : 'Update Employee'" :close="closeDialog" />
        <v-card-text class="pt-5">
          <v-form ref="form" lazy-validation v-model="valid" class="d-flex flex-column" style="grid-gap: 12px;" @submit.prevent>
            <div class="employee__form">
              <div class="d-flex flex-column" style="grid-gap: 12px;">
                <v-text-field v-model="form.name" label="Full Name*" :rules="[ v => !!v || 'Name is required' ]" dense hide-details outlined />
                <v-text-field v-model="form.mobile" label="Phone Number*" :rules="[ v => !!v || 'Mobile Number is required' ]" dense hide-details outlined type="number" />
              </div>
              <label class="employee__img grey lighten-3 d-flex justify-center align-center" for="file">
                <img v-if="form.image !== null" :src="form.image">
                <v-icon v-else v-text="'mdi-camera'" />
                <input type="file" id="file" accept="image/*" class="d-none" @change="fileUpload">
              </label>
            </div>
            <v-text-field label="Rate Per Day(Rs.)" v-model="form.rate" :rules="[ v => !!v || '']" dense outlined hide-details />
            <v-text-field v-model="form.address" label="Address*" :rules="[ v => !!v || 'Address is required' ]" dense hide-details outlined />
          </v-form>
        </v-card-text>
        <CardAction :valid="valid" :reset="reset" :save="isSave === true ? save : edit" />
      </v-card>
    </v-dialog>
  </div>  
</template>

<script>
import { db } from '../firebase'
export default {
  data: () => ({
    dialog: false,
    valid: true,
    file: null,
    form: {
      name: null,
      mobile: null,
      address: null,
      image: null,
      rate: null
    },
    editId: null,
    isSave: true,
    users: []
  }),
  firestore: () =>({
    users: db.collection('employee').where('status', '==', true).orderBy('createdAt', 'desc')
  }),
  methods: {
    closeDialog() {
      this.file = null
      this.reset()
      this.editId = null
      this.isSave = true
      this.dialog = false
    },
    fileUpload(e) { 
      this.file = e.target.files[0]
      this.form.image = URL.createObjectURL(this.file) 
    },
    reset() { 
      this.$refs.form.reset()
      this.file = null
      this.form.image = null
      this.editId = null
    },
    save() {
      if(this.$refs.form.validate()) {
        this.dialog = false
        this.$store.dispatch({
          type: 'alertDialog',
          actionType: 1,
          text: 'Save',
          collection: 'employee',
          file: this.file,
          data: this.form
        }).then( () => { this.reset() }).catch( () => this.dialog = false)
      }
    },
    openEditModel(data) {
      this.form.name = data.name
      this.form.mobile = data.mobile
      this.form.address = data.address
      this.form.image = data.image
      this.form.rate = data.rate
      this.editId = data['.key']
      this.dialog = true
      this.isSave = false
    },
    edit() {
      if(this.$refs.form.validate()) {
        this.dialog = false
        this.$store.dispatch({ 
          type: 'alertDialog', 
          text: 'Update', 
          actionType: 2,
          file: this.file,
          collection: 'employee', 
          data: this.form, 
          id: this.editId
        }).then( () => { this.reset() }).catch( () => this.dialog = true)
      }
    },
    deleteItem(id) {
      this.$store.dispatch({ type: 'alertDialog', text: 'Delete', actionType: 3, collection: 'employee', id: id })
    },
  }
}
</script>

<style scoped>
.employee__form {
  display: grid;
  grid-template-columns: calc(100% - 112px) 100px;
  grid-gap: 12px;
}
.employee__img {
  height: 100px;
  width: 100px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}
</style>