<template>
  <v-container fluid>
    <FAB title="Payment" :open="() => dialog = true" /> 
  
    <v-radio-group v-model="paymentType" row class="pb-3 ma-0" dense hide-details>
      <v-radio label="Payment In" :value="1"></v-radio>
      <v-radio label="Payment Out" :value="2"></v-radio>
    </v-radio-group>
       <!-- List Expenses -->
    <DataTable :header="paymentType == 1 ? paymentInHeader: paymentOutHeader" :items="attendances" :actions="actions" @action="action" />
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card>
        <CardTitle :title="editId === null ? 'New Payment' : 'Update Payment'" :close="closeDialog" />
        <v-card-text class="pt-5">
          <v-form ref="form" lazy-validation v-model="valid" class="d-flex flex-column" style="grid-gap: 12px;" @submit.prevent>
             <v-autocomplete v-if="paymentType == 1" v-model="form.projectId" label="Project*" outlined hide-details dense :items="projects" item-text="title"  :item-value="item => item['.key']"></v-autocomplete>
             <v-autocomplete v-else v-model="form.employeeId" :disabled="editId !== null" :items="employees" dense outlined hide-details color="primary" label="Employee*" 
                  :item-value="item => item['.key']" :rules="[ v => !!v || 'Employee is required' ]">
                <template v-slot:selection="data">
                  <v-chip v-bind="data.attrs" :input-value="data.selected">
                    <v-avatar left>
                      <v-img :src="data.item.image" :lazy-src="data.item.image"></v-img>
                    </v-avatar>
                    <div>
                      <div class="caption font-weight-bold" style="line-height: 1;">{{ data.item.name }}</div>
                      <small style="line-height: 1;">{{ data.item.rate }}</small>
                    </div>
                  </v-chip>
                </template>
                <template v-slot:item="data">
                  <v-list-item-avatar>
                      <img :src="data.item.image">
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-html="data.item.name"></v-list-item-title>
                      <v-list-item-subtitle v-html="`Rs. ${data.item.rate}`"></v-list-item-subtitle>
                    </v-list-item-content>
                </template></v-autocomplete>
             
             <div class="d-flex justify-space-between align-center" style="grid-gap: 4px;">
                  <v-text-field type="number" label="Amount (Rs.)*" v-model="form.amount" :rules="[ v => !!v || 'No. of attendance required.']" 
                     dense outlined hide-details :min="0" />
                  <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="form.date" label="Date*" dense outlined hide-details readonly v-bind="attrs" v-on="on" :rules="[ v => !!v || 'Date is required' ]" />
                    </template>
                    <v-date-picker v-model="form.date" @input="menu = false" :max="new Date().toISOString().substr(0, 10)" />
                  </v-menu>
             </div>
          </v-form>
        </v-card-text>
        <CardAction :valid="valid" :reset="reset" :save="editId === null ? save : edit" />
      </v-card>
    </v-dialog>
  </v-container>  
</template>

<script>
import { db } from '../firebase'
import Swal from 'sweetalert2'
export default {
  data: () => ({
    dialog: false,
    valid: true,
    menu: false,
    paymentType: 1,
    form: {
      employeeId: null,
      amount: null, 
      projectId: null,
      date: new Date().toISOString().substr(0, 10)
    },
    editId: null,
    employees: [],
    projects: [],
    attendances: [],
    paymentInHeader: [
      { text: 'S.N.',  align: 'center', sortable: false, value: 'sno', class: 'primary white--text' },
      { text: 'Date',align: 'center', value: 'date', class: 'primary date white--text' },
      { text: 'Project ', align: 'start', value: 'projectName', class: 'primary name white--text' },
      { text: 'Amount (Rs.)', align: 'center', value: 'amount', class: 'primary name white--text' },
      { text: 'Action (s)', align: 'center', value: 'actions', sortable: false, class: 'primary action white--text' },
    ],
    paymentOutHeader: [
      { text: 'S.N.',  align: 'center', sortable: false, value: 'sno', class: 'primary white--text' },
      { text: 'Date',align: 'center', value: 'date', class: 'primary date white--text' },
      { text: 'Employee ', align: 'start', value: 'employeeName', class: 'primary name white--text' },
      { text: 'Amount (Rs.)', align: 'center', value: 'amount', class: 'primary name white--text' },
      { text: 'Action (s)', align: 'center', value: 'actions', sortable: false, class: 'primary action white--text' },
    ],
    actions: [
      { name: 'Edit', icon: 'mdi-pencil', color: 'success', type: 2 },
      { name: 'Delete', icon: 'mdi-delete', color: 'red', type: 3 }
    ],
  }),
  methods: {
    action({data, type}) {
      if(type === 2) {
         this.form.employeeId = data.employeeId
         this.form.amount = data.amount,
         this.form.projectId = data.projectId
         this.form.date = data.date
        this.editId = data['.key']
        this.dialog = true}
    //   } else if(type === 3) this.$store.dispatch({ type: 'alertDialog', text: 'Delete', actionType: 3, collection: 'expenseCategory', id: data['.key'] })
    },
    
    closeDialog() {
      this.file = null
      this.reset()
      this.editId = null
      this.isSave = true
      this.dialog = false
    },

    reset() { 
      this.$refs.form.reset()
      this.editId = null
    },

    // save
    save() {
      if(this.$refs.form.validate()) {
        this.dialog = false
        return new Promise((resolve, reject) => {
          Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, save it!`
          }).then( async result => {
            if(result.isConfirmed) {
              this.$store.commit('SET_OVERLAY', true)
              let amount = parseFloat(this.form.amount)
              await db.collection('payment').add({
                amount: amount,
                date: this.form.date,
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime(), 
                employeeId: this.form.employeeId,
                projectId: this.form.projectId
              }).then(async payment => {
                let khatabook = db.collection('khatabook').doc(this.form.employeeId)
                if(this.form.employeeId !== null) {
                  await khatabook.get().then(async emp => {
                    if(emp.exists) {
                      let totalAmount = parseFloat(emp.data().totalAmount) - parseFloat(this.form.amount)  
                      await khatabook.update({
                        totalAmount: totalAmount,
                        updatedAt: new Date().getTime()  
                      }).catch(e => {
                        Swal.fire('Error!', e.message, 'error')
                        reject()  
                      })
                    } else {
                      await khatabook.set({
                        totalAmount: (-parseFloat(this.form.amount)),
                        updatedAt: new Date().getTime(),
                        createdAt: new Date().getTime()  
                      }).catch(e => {
                        Swal.fire('Error!', e.message, 'error')
                        reject()  
                      })  
                    }
                  })  
                } 
                khatabook.collection('history').doc(payment.id).set({
                  amount: amount,
                  paymentId: payment.id,
                  date: this.form.date,
                  createdAt: new Date().getTime(),
                  updatedAt: new Date().getTime(),  
                }).then(() => {
                  Swal.fire('Saved!', 'Payment has been saved successfully.', 'success')
                  this.reset()  
                  this.get()
                  resolve()
                }).catch(e => {
                  Swal.fire('Error!', e.message, 'error')
                  reject()  
                })
              }).catch(e => {
                Swal.fire('Error!', e.message, 'error')
                reject()  
              })
            } else reject()
          })  
        }).finally(() => this.$store.commit('SET_OVERLAY', false))  
      }  
    },

    deleteItem(id) {
      this.$store.dispatch({ type: 'alertDialog', text: 'Delete', actionType: 3, collection: 'attendance', id: id })
    },

    remove (item) {
        const index = this.form.employeeIds.indexOf(item['.key'])
        if (index >= 0) this.form.employeeIds.splice(index, 1)
    },
    async get() {
      await this.$binding("projects", db.collection('projects').orderBy('createdAt', 'desc'))
      await this.$binding("employees", db.collection('employee').orderBy('createdAt', 'desc'))
    },
  },
  created() {
    this.get()
  }
}
</script>