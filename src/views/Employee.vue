<template>
  <div>
    <v-fab-transition>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" fab fixed bottom right v-bind="attrs" v-on="on" @click="dialog = true">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>New Employee</span>
      </v-tooltip>
      
    </v-fab-transition>
    <v-container fluid class="employee">
      <div class="employee__item px-3 py-6 white d-flex flex-column justify-center align-center text-center" v-for="(user, i) in users" :key="i">
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
        <v-card-title class="grey lighten-3 d-flex justify-space-between">
          <div class="title">{{ isSave ? 'New' : 'Edit' }} Employee</div>
          <v-btn color="red" icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-5">
          <v-form ref="form" lazy-validation v-model="valid" class="d-flex flex-column" style="grid-gap: 12px;">
            <div class="employee__form">
              <div class="d-flex flex-column" style="grid-gap: 12px;">
                <v-text-field v-model="form.name" label="Full Name*" :rules="[ v => !!v || 'Name is required' ]" dense hide-details outlined />
                <v-text-field v-model="form.mobile" label="Phone Number*" :rules="[ v => !!v || 'Mobile Number is required' ]" dense hide-details outlined type="number" />
              </div>
              <label class="employee__img grey lighten-3" for="file">
                <div v-if="img !== null" style="height: 100%; width: 100%;">
                  <img :src="img">
                </div>
                <div v-else class="d-flex justify-center align-center" style="height: 100%; width: 100%;">
                  <v-icon size="90">mdi-camera</v-icon>
                </div>
                <input type="file" id="file" accept="image/*" class="d-none" @change="fileUpload">
              </label>
            </div>
            <v-text-field v-model="form.address" label="Address*" :rules="[ v => !!v || 'Address is required' ]" dense hide-details outlined />
          </v-form>
        </v-card-text>
        <v-card-actions class="px-6 py-4 grey lighten-3">
          <v-spacer />
          <v-btn color="red" dark @click="reset">reset</v-btn>
          <v-btn color="success" @click="isSave ? save : edit()">{{ isSave ? 'save' : 'edit' }}</v-btn>
        </v-card-actions>
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
    img: null,
    form: {
      name: null,
      mobile: null,
      address: null,
      image: null
    },
    editId: null,
    isSave: true,
    users: []
  }),
  firestore: () =>({
    users: db.collection('employee').where('status', '==', true).orderBy('createdAt', 'desc')
  }),
  methods: {
    fileUpload(e) { 
      this.file = e.target.files[0]
      this.img = URL.createObjectURL(this.file) 
    },
    reset() { 
      this.$refs.form.reset()
      this.file = null
      this.img = null
      this.editId = null
      this.isSave = true
    },
    save() {
      if(this.$refs.form.validate()) {
        this.dialog = false
        this.$store.dispatch({
          type: 'alertDialog',
          text: 'Save',
          actionType: 1,
          folder: 'employee',
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
      this.img = data.image
      this.editId = data['.key']
      this.dialog = true
      this.isSave = false
    },
    edit() {
      console.log('called')
      if(this.$refs.form.validate()) {
        this.dialog = false
        this.isSave ? this.form['image'] = this.img : null
        this.$store.dispatch({ 
          type: 'alertDialog', 
          text: 'Edit', 
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
.employee {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18%, 1fr));
  grid-gap: 12px;  
}
.employee__item {
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 10px 0 #3cbf7736; 
  position: relative; 
  cursor: pointer;
}
.employee__form {
  display: grid;
  grid-template-columns: calc(100% - 112px) 100px;
  grid-gap: 12px;
}
.employee__img {
  height: 100%;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}
@media (max-width: 1100px) {
  .employee { grid-template-columns: repeat(auto-fill, minmax(23%, 1fr)); }  
}
@media (max-width: 960px) {
  .employee { grid-template-columns: repeat(auto-fill, minmax(30%, 1fr)); }  
}
@media (max-width: 760px) {
  .employee { grid-template-columns: repeat(auto-fill, minmax(48%, 1fr)); }  
}
</style>