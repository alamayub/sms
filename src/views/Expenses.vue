<template>
  <v-container fluid>
    <FAB title="Employee" :open="() => dialog = true" />
    <!-- List -->
    <DataTable :header="header" :items="items" :actions="actions" />
    <!-- Add Dialogue -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card>
        <CardTitle :title="editId === null ? 'New Employee' : 'Update Employee'" :close="closeDialog" />
        <v-card-text class="pt-5">
          <v-form ref="form" lazy-validation v-model="valid" class="d-flex flex-column" style="grid-gap: 12px;" @submit.prevent>
            <v-text-field label="Title*" v-model="form.title" dense outlined hide-details :rules="[v => !!v || 'Name is required.']" />
            <v-textarea label="Remarks" v-model="form.remarks" dense outlined hide-details />              
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
    form: {
      name: null,
      remarks: null,
    },
    editId: null,
    header: [
      { text: 'S.N.',  align: 'center', sortable: false, value: 'sno', class: 'primary white--text' },
      { text: 'Name', align: 'start', value: 'name', class: 'primary name white--text' },
      { text: 'Remarks', align: 'center', value: 'remarks', class: 'primary name white--text' },
      { text: 'Created Date',align: 'center', value: 'createdAt', class: 'primary date white--text' },
      { text: 'Action (s)', align: 'center', value: 'actions', sortable: false, class: 'primary action white--text' },
    ], 
    actions: [
      { name: 'Edit', icon: 'mdi-pencil', color: 'success' },
      { name: 'Delete', icon: 'mdi-delete', color: 'red', url: 'expenses' }
    ],
    items: [] 
  }),
  firestore: () =>({
    users: db.collection('expenses').where('status', '==', true).orderBy('createdAt', 'desc')
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
      if(this.$refs.form.validate()) console.log('validated')
      else console.log('not validated')  
    },
    edit() {
      if(this.$refs.form.validate()) console.log('validated')
      else console.log('not validated')  
    }
  }
}
</script>