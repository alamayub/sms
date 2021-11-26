<template>
  <v-container fluid>
    <FAB title="Project" :open="() => dialog = true" />
    
    <!-- List Expenses -->
    <DataTable :header="header" :items="expenses" :actions="actions" @action="action" />
    
    <!-- Ad Dialog -->
    <v-dialog v-model="dialog" max-width="400" persistent>
      <v-card>
        <CardTitle :title="editId === null ? 'Add Expense' : 'Update Expense'" :close="closeDialog" />
        <v-card-text class="pt-4">
          <v-form ref="form" lazy-validation v-model="valid" class="d-flex flex-column" style="grid-gap: 12px;">
             <v-autocomplete label="Expenses Name*" v-model="form.expenseCategoryId" outlined hide-details dense :items="expenseCategory" item-text="name" :item-value="item => item['.key']" :rules="[ v => !!v || 'Expense is required' ]" />
             <v-autocomplete label="Project" v-model="form.projectId" outlined hide-details dense :items="projects" item-text="title" :item-value="item => item['.key']" />
             <v-text-field type="number" label="Amount*" v-model="form.amount" dense outlined hide-details :min="0" step="0.01" oninput="validity.valid||(value=null);" :rules="[ v => !!v || 'Amount is required' ]" />
             <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="form.date" label="Date*" dense outlined hide-details readonly v-bind="attrs" v-on="on" :rules="[ v => !!v || 'Date is required' ]" />
                </template>
                <v-date-picker v-model="form.date" @input="menu = false" :max="new Date().toISOString().substr(0, 10)" />
             </v-menu>
             <v-textarea label="Remarks (If any.)" v-model="form.remarks" dense outlined hide-details />
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
    menu: false,
    form: {
      expenseCategoryId: null,
      expenseName: null,
      amount: null,
      projectId: null,
      projectName: null,
      remarks: null,
      date: new Date().toISOString().substr(0, 10)
    },
    editId: null,
    header: [
      { text: 'S.N.',  align: 'center', sortable: false, value: 'sno', class: 'primary white--text' },
      { text: 'Expense', align: 'start', value: 'expenseName', class: 'primary name white--text' },
      { text: 'Project', align: 'start', value: 'projectName', class: 'primary name white--text' },
      { text: 'Amount (Rs.)', align: 'center', value: 'amount', class: 'primary name white--text' },
      { text: 'Date',align: 'center', value: 'date', class: 'primary date white--text' },
      { text: 'Action (s)', align: 'center', value: 'actions', sortable: false, class: 'primary action white--text' },
    ],
    actions: [
      { name: 'Edit', icon: 'mdi-pencil', color: 'success', type: 2 },
      { name: 'Delete', icon: 'mdi-delete', color: 'red', type: 3 }
    ],
    expenseCategory: [],
    projects: [],
    expenses: []
  }),
  // firestore: () => ({
  //   expenses: db.collection('expenses').where('status', '==', true).orderBy('createdAt', 'desc'),
  //   projects: db.collection('projects').where('status', '==', true).orderBy('createdAt', 'desc'),
  //   expenseCategory: db.collection('expensesCategory').where('status', '==', true).orderBy('createdAt', 'desc'),
  // }),
  methods: {
    action({data, type}) {
      if(type === 2) {
        this.form.expenseCategoryId = data.expenseCategoryId
        this.form.amount = data.amount
        this.form.projectId = data.projectId
        this.form.date = data.date
        this.form.remarks = data.remarks
        this.editId = data['.key']
        this.dialog = true
      } else if(type === 3) this.$store.dispatch({ type: 'alertDialog', text: 'Delete', actionType: 3, collection: 'expenses', id: data['.key'] })
    },
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
        this.form.amount = parseFloat(this.form.amount)
        this.$store.dispatch({
          type: 'alertDialog',
          text: 'save',
          actionType: 1,
          collection: 'expenses',
          data: this.form
        }).then( () => { 
          this.reset() 
          this.get()
        }).catch( () => this.dialog = false)
      }
    },
    edit() {
      if(this.$refs.form.validate()) {
        this.dialog = false
        this.$store.dispatch({ 
          type: 'alertDialog', 
          text: 'Update', 
          actionType: 2,
          collection: 'expenses', 
          data: this.form, 
          id: this.editId
        }).then( () => { 
          this.reset() 
          this.get()
        }).catch( () => this.dialog = true)
      }
    },
    async get() {
      await this.$binding("expenseCategory", db.collection('expensesCategory').where('status', '==', true).orderBy('createdAt', 'desc'))
      await this.$binding("projects", db.collection('projects').where('status', '==', true).orderBy('createdAt', 'desc'))
      await this.$binding("expenses", db.collection('expenses').where('status', '==', true).orderBy('createdAt', 'desc')).then(docs => {
        docs.forEach(doc => {
          let y = this.expenseCategory.find(x => x['.key'] === doc.expenseCategoryId)
          doc.expenseName = y.name
          if(doc.projectId != null) {
            let p = this.projects.find(y => y['.key'] === doc.projectId)
            doc.projectName = p.title
          }
        })
      })
    }
  },
  created() {
    this.get()
  }
}
</script>