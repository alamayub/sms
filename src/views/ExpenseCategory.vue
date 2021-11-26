<template>
  <v-container fluid>
    <FAB title="Expense Category" :open="() => dialog = true" />
    <!-- List -->
    <DataTable :header="header" :items="items" :actions="actions" @action="action" />
    <!-- Add Dialogue -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card>
        <CardTitle :title="editId === null ? 'New Expense' : 'Update Expense'" :close="closeDialog" />
        <v-card-text class="pt-5">
          <v-form ref="form" lazy-validation v-model="valid" class="d-flex flex-column" style="grid-gap: 12px;" @submit.prevent>
            <v-text-field label="Title*" v-model="form.name" dense outlined hide-details :rules="[v => !!v || 'Name is required.']" />
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
      { text: 'Name', align: 'start', value: 'name', class: 'primary white--text' },
      { text: 'Remarks', align: 'start', value: 'remarks', sortable: false, class: 'primary white--text' },
      { text: 'Created Date',align: 'center', value: 'createdAt', sortable: false, class: 'primary date white--text' },
      { text: 'Updated Date',align: 'center', value: 'updatedAt', sortable: false, class: 'primary date white--text' },
      { text: 'Action (s)', align: 'center', value: 'actions', sortable: false, class: 'primary white--text' },
    ], 
    actions: [
      { name: 'Edit', icon: 'mdi-pencil', color: 'success', type: 2 },
      { name: 'Delete', icon: 'mdi-delete', color: 'red', type: 3 }
    ],
    items: [] 
  }),
  firestore: () =>({
    items: db.collection('expensesCategory').where('status', '==', true).orderBy('createdAt', 'desc')
  }),  
  methods: {
    action({data, type}) {
      if(type === 2) {
        this.form.name = data.name
        this.form.remarks = data.remarks
        this.editId = data['.key']
        this.dialog = true
      } else if(type === 3) this.$store.dispatch({ type: 'alertDialog', text: 'Delete', actionType: 3, collection: 'expensesCategory', id: data['.key'] })
    },
    closeDialog() {
      this.reset()
      this.editId = null
      this.dialog = false
      this.form.name = null
      this.form.remarks = null
    },
    reset() {
      this.$refs.form.reset()
    },
    save() {
      if(this.$refs.form.validate()) {
        this.dialog = false
        this.$store.dispatch({
          type: 'alertDialog',
          actionType: 1,
          text: 'Save',
          collection: 'expensesCategory',
          data: this.form
        }).then( () => this.reset()).catch( () => this.dialog = false)
      }  
    },
    edit() {
      if(this.$refs.form.validate()) {
        this.dialog = false
        this.$store.dispatch({ 
          type: 'alertDialog', 
          text: 'Update', 
          actionType: 2,
          collection: 'expensesCategory', 
          data: this.form, 
          id: this.editId
        }).then( () => this.reset()).catch( () => this.dialog = true)
      }
    }
  }
}
</script>