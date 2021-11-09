<template>
  <v-container fluid>
    <FAB title="Project" :open="() => dialog = true" />
    
    <!-- List Projects -->
    <div class="projects">
      <div class="card__item pa-4 d-flex flex-column" style="grid-gap: 8px;" v-for="(project, p) in projects" :key="p">
        <div class="text__overflow text-capitalize" style="line-height: 1; -webkit-line-clamp: 1; font-weight: 500;">{{ project.title }}</div>
        <div class="d-flex justify-space-between">
          <v-chip small label text-color="primary">Rs.{{ project.budget }}</v-chip>
          <v-chip small label :color="project.isRunning === true ? 'amber' : 'success'" v-text="project.isRunning === true ? 'Running' : 'Completed'" />
        </div>
        <p class="text__overflow" style="-webkit-line-clamp: 4;">{{ project.description }}</p>
        <div class="caption font-weight-bold" style="line-height: 1;" v-text="`${project.startDate} - ${project.endDate}`" />
      </div>
    </div>

    <!-- Ad Dialog -->
    <v-dialog v-model="dialog" max-width="700" persistent>
      <v-card>
        <CardTitle :title="editId === null ? 'New Project' : 'Update Project'" :close="closeDialog" />
        <v-card-text class="pt-4">
          <v-form ref="form" lazy-validation v-model="valid" class="d-flex flex-column" style="grid-gap: 12px;">
            <div class="d-flex" style="grid-gap: 12px;">
              <v-text-field label="Title" v-model="form.title" dense outlined hide-details />
              <v-checkbox v-model="form.isRunning" label="Running?" dense hide-details />
            </div>
            <div class="d-flex" style="grid-gap: 12px;">
              <v-text-field label="Mobile Number" type="number" v-model="form.mobile" dense outlined hide-details />
              <v-text-field label="Budget" type="number" v-model="form.budget" dense outlined hide-details />
            </div>
            <v-text-field label="Address" v-model="form.address" dense outlined hide-details />
            <div class="d-flex" style="grid-gap: 12px;">
              <v-menu v-model="menu1" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="form.startDate" label="Start Date" dense outlined hide-details readonly v-bind="attrs" v-on="on" />
                </template>
                <v-date-picker v-model="form.startDate" @input="menu1 = false" />
              </v-menu>
              <v-menu v-model="menu2" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="form.endDate" label="End Date" dense outlined hide-details readonly v-bind="attrs" v-on="on" />
                </template>
                <v-date-picker v-model="form.endDate" @input="menu2 = false" />
              </v-menu>
            </div>
            <v-textarea label="Description" v-model="form.description" dense outlined hide-details />
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
    projects: [],
    form: {
      title: null,
      budget: null,
      mobile: null,
      address: null,
      startDate: null,
      endDate: null,
      description :null,
      isRunning: true
    },
    menu1: false,
    menu2: false,
    editId: null
  }),
  firestore: () => ({
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
        this.form.budget = parseFloat(this.form.budget)
        this.dialog = false
        this.$store.dispatch({
          type: 'alertDialog',
          text: 'save',
          actionType: 1,
          collection: 'projects',
          data: this.form
        }).then( () => { this.reset() }).catch( () => this.dialog = false)
      }
    },
    openEditModel(data) {
      this.form.title = data.name
      this.form.budget = parseFloat(data.budget)
      this.form.mobile = data.mobile
      this.form.address = data.address
      this.form.startDate = data.image
      this.form.endDate = data.rate
      this.form.description
      this.editId = data['.key']
      this.dialog = true
    },
    edit() {
      if(this.$refs.form.validate()) {
        this.dialog = false
        this.form.budget = parseFloat(this.form.budget)
        this.$store.dispatch({ 
          type: 'alertDialog', 
          text: 'Update', 
          actionType: 2,
          collection: 'projects', 
          data: this.form, 
          id: this.editId
        }).then( () => { this.reset() }).catch( () => this.dialog = true)
      }
    },
    deleteItem(id) {
      this.$store.dispatch({ type: 'alertDialog', text: 'Delete', actionType: 3, collection: 'projects', id: id })
    },
  }
}
</script>