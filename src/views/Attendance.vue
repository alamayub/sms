<template>
  <v-container fluid>
    <FAB title="Attendance" :open="() => dialog = true" />
    <!-- Add Dialogue -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card>
        <CardTitle :title="editId === null ? 'New Employee' : 'Update Employee'" :close="closeDialog" />
        <v-card-text class="pt-5">
          <v-form ref="form" lazy-validation v-model="valid" class="d-flex flex-column" style="grid-gap: 12px;" @submit.prevent>
            <v-autocomplete label="Employees" v-model="form.employeeIds" chips multiple dense outlined hide-details :items="employee" item-text="name" item-value="['.key']" />
            <div class="d-flex" style="grid-gap: 12px;">
              <v-text-field label="No. of Attendance" v-model="form.noOfAttendance" dense outlined hide-details :rules="[v => !!v || '']" />
              <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="form.date" label="Date*" readonly outlined dense hide-details v-bind="attrs" v-on="on" :rules="[v => !!v || '']" />
                </template>
                <v-date-picker v-model="form.date" @input="menu = false" :max="new Date().toISOString().substr(0, 10)" />
              </v-menu>
            </div>
            <v-autocomplete label="Project" v-model="form.projectId" dense outlined hide-details :items="projects" item-text="title" item-value="['.key']" />
          </v-form>
        </v-card-text>
        <CardAction :valid="valid" :reset="reset" :save="editId === null ? save : edit" />
      </v-card>
    </v-dialog>
  </v-container>  
</template>

<script>
import { db } from '../firebase'
export default {
  data: () => ({
    dialog: false,
    valid: true,
    editId: null,
    menu: false,
    form: {
      employeeIds: null,
      noOfAttendance: null,
      projectId: null,
      date: new Date().toISOString().substr(0, 10),
    },
    employee: [],
    projects: []
  }),
  firestore: () =>({
    employee: db.collection('employee').where('status', '==', true).orderBy('createdAt', 'desc'),
    projects: db.collection('projects').where('status', '==', true).orderBy('createdAt', 'desc')
  }),
  methods: {
    closeDialog() {
      this.reset()
      this.editId = null
      this.dialog = false
    },
    reset() { 
      this.$refs.form.reset()
      this.editId = null
    },
    save() {
      if(this.$refs.form.validate()) {
        this.dialog = false
        this.$store.dispatch({
          type: 'alertDialog',
          actionType: 1,
          text: 'Save',
          collection: 'attendance',
          data: this.form
        }).then( () => { this.reset() }).catch( () => this.dialog = false)
      }
    },
    openEditModel(data) {
      console.log(data)
      this.editId = data['.key']
      this.dialog = true
    },
    edit() {
      if(this.$refs.form.validate()) {
        this.dialog = false
        this.$store.dispatch({ 
          type: 'alertDialog', 
          text: 'Update', 
          actionType: 2,
          collection: 'attendance', 
          data: this.form, 
          id: this.editId
        }).then( () => { this.reset() }).catch( () => this.dialog = true)
      }
    },
    deleteItem(id) {
      this.$store.dispatch({ type: 'alertDialog', text: 'Delete', actionType: 3, collection: 'attendance', id: id })
    },
  }
}
</script>