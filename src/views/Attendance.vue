<template>
  <v-container fluid>
    <FAB title="Attendance" :open="() => dialog = true" />

    <!-- List page -->
    <DataTable :header="header" :items="attendance" :actions="actions" @action="action" />
      
    <!-- Add Dialogue -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card>
        <CardTitle :title="editId === null ? 'New Attendance' : 'Update Attendance'" :close="closeDialog" />
        <v-card-text class="pt-5">
          <v-form ref="form" lazy-validation v-model="valid" class="d-flex flex-column" style="grid-gap: 12px;" @submit.prevent>
            <v-autocomplete :disabled="editId !== null" v-model="form.employeeIds" :items="employee" dense outlined hide-details chips color="primary" label="Employees*" :item-text="item => item['.key']" multiple :rules="[v => !!v || '']">
              <template v-slot:selection="data">
                <v-chip v-bind="data.attrs" :input-value="data.selected" close @click="data.select" @click:close="remove(data.item)">
                  <v-avatar left>
                    <v-img :src="data.item.image" :lazy-src="data.item.image" />
                  </v-avatar>
                  <!-- {{ data.item.name }} -->
                </v-chip>
              </template>
              <template v-slot:item="data">
                <v-list-item-avatar>
                  <v-img :src="data.item.image" :lazy-src="data.item.image" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-html="data.item.name" />
                  <v-list-item-subtitle v-html="`Rs. ${data.item.rate}`" />
                </v-list-item-content>
              </template>
            </v-autocomplete>
            <div class="d-flex" style="grid-gap: 12px;">
              <v-text-field label="No. of Attendance*" v-model="form.noOfAttendance" dense outlined hide-details :rules="[v => !!v || '']" />
              <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="form.date" label="Date*" readonly outlined dense hide-details v-bind="attrs" v-on="on" :rules="[v => !!v || '']" />
                </template>
                <v-date-picker v-model="form.date" @input="menu = false" :max="new Date().toISOString().substr(0, 10)" />
              </v-menu>
            </div>
            <v-autocomplete label="Project" v-model="form.projectId" dense outlined hide-details :items="projects" item-text="title" :item-value="item => item['.key']" />
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
    editId: null,
    menu: false,
    form: {
      employeeIds: null,
      noOfAttendance: null,
      projectId: null,
      date: new Date().toISOString().substr(0, 10),
    },
    attendance: [],
    employee: [],
    projects: [],
    header: [
      { text: 'S.N.',  align: 'center', sortable: false, value: 'sno', class: 'primary white--text' },
      { text: 'Employee', align: 'start', sortable: false, value: 'employee', class: 'primary name white--text' },
      { text: 'Project', align: 'start', sortable: false, value: 'projectName', class: 'primary white--text' },
      { text: 'Attendance', align: 'center', sortable: false, value: 'noOfAttendance', class: 'primary white--text' },
      { text: 'Amount(Rs.)', align: 'end', sortable: false, value: 'amount', class: 'primary white--text' },
      { text: 'Date', align: 'center', value: 'date', class: 'primary date white--text' },
      { text: 'Action (s)', align: 'center', value: 'actions', sortable: false, class: 'primary action white--text' },
    ],
    actions: [
      { name: 'Edit', icon: 'mdi-pencil', color: 'success', type: 2 },
      { name: 'Delete', icon: 'mdi-delete', color: 'red', type: 3 }
    ],
  }),
  methods: {
    action({data, type}) {
      console.log(data)
      if(type === 2) {
        this.form.employeeIds = data.employeeId
        this.form.noOfAttendance = data.noOfAttendance
        this.form.projectId = data.projectId
        this.form.date = data.date
        this.editId = data['.key']
        this.dialog = true
      } else if(type === 3) this.$store.dispatch({ type: 'alertDialog', text: 'Delete', actionType: 3, collection: 'attendance', id: data['.key'] })
    },
    async get() {
      await this.$binding("employee", db.collection('employee').where('status', '==', true).orderBy('createdAt', 'desc'))
      await this.$binding("projects", db.collection('projects').where('status', '==', true).orderBy('createdAt', 'desc'))
      await this.$binding("attendance", db.collection('attendance').where('status', '==', true).orderBy('createdAt', 'desc')).then(docs => {
        docs.forEach(doc => {
          let y = this.employee.find(x => x['.key'] === doc.employeeId)
          doc.employeeName = y.name
          doc.employeeImage = y.image
          doc.employeeMobile = y.mobile
          if(doc.projectId != null) {
            let p = this.projects.find(y => y['.key'] === doc.projectId)
            doc.projectName = p.title
          }
        })
      })
    },
    remove (item) {
      const index = this.form.employeeIds.indexOf(item['.key'])
      if (index >= 0) this.form.employeeIds.splice(index, 1)
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
        this.form['noOfAttendance'] = parseFloat(this.form['noOfAttendance'])
        return new Promise((resolve, reject) => {
          Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, save it!`
          }).then(async result => {
            if (result.isConfirmed) {
              this.$store.commit('SET_OVERLAY', true)
              await this.form.employeeIds.forEach(async empId => {
                let emp = this.employee.find(a => a['.key'] === empId)
                let rate = parseFloat(emp.rate)
                let amount = parseFloat(this.form.noOfAttendance * rate)
                await db.collection('attendance').add({
                  employeeId: empId,
                  employeeName: null,
                  employeeImage: null,
                  employeeMobile: null,
                  projectId: this.form.projectId,
                  date: this.form.date,
                  noOfAttendance: this.form.noOfAttendance,
                  amount: amount,
                  createdAt: new Date().getTime(),
                  updatedAt: new Date().getTime(),
                  status: true
                }).then(async attendanceDoc => {
                  await db.collection('khatabook').doc(empId).get().then( async khataDoc => {
                    if(khataDoc.exists) {
                      let ta = khataDoc.data().totalAmount + amount
                      await db.collection('khatabook').doc(empId).update({ 
                        totalAmount: ta,
                        updatedAt: new Date().getTime(),
                      }).catch( e => Swal.fire('Error!', e.message, 'error'))
                    } else {
                      await db.collection('khatabook').doc(empId).set({ 
                        createdAt: new Date().getTime(),
                        updatedAt: new Date().getTime(),
                        totalAmount: amount 
                      }).catch( e => Swal.fire('Error!', e.message, 'error'))
                    }
                    await db.collection('khatabook').doc(empId).collection('history').add({
                      salary: amount,
                      attendanceId: attendanceDoc.id,
                      date: this.form.date,
                      createdAt: new Date().getTime(),
                      updatedAt: new Date().getTime(),
                      status: true
                    }).catch( e => Swal.fire('Error!', e.message, 'error'))
                    resolve()
                  })                 
                }).catch( e => Swal.fire('Error!', e.message, 'error'))
              })
              this.get()
            } else reject()
          })
        }).then(() => {
          Swal.fire('Saved!', 'Your all data has been saved successfully.', 'success')
          this.reset()
        }).catch(() => this.dialog = true).finally(() => this.$store.commit('SET_OVERLAY', false))
      }
    },
    async edit() {
      if(this.$refs.form.validate()) {
        this.dialog = false
        return new Promise((resolve, reject) => {
          this.form.noOfAttendance = parseFloat(this.form.noOfAttendance)
          let emp = this.employee.find(a => a['.key'] === this.form.employeeIds)
          let rate = parseFloat(emp.rate)
          let amount = parseFloat(this.form.noOfAttendance * rate)
          db.collection('attendance').doc(this.editId).update({
            projectId: this.form.projectId,
            date: this.form.date,
            noOfAttendance: this.form.noOfAttendance,
            amount: amount,
            updatedAt: new Date().getTime(),
          }).then(async () => {
            await db.collection('khatabook').doc(this.form.employeeIds).update({ 
              updatedAt: new Date().getTime(),
              totalAmount: amount 
            }).then(async () => {
              await db.collection('khatabook').doc(this.form.employeeIds).collection('history').where('attendanceId', '==', this.editId).update({
                salary: amount,
                date: this.form.date,
                updatedAt: new Date().getTime(),
              }).then(() => resolve()).catch( e => {
                Swal.fire('Error!', e.message, 'error')
                reject()
              })
            }).catch( e => {
              Swal.fire('Error!', e.message, 'error')
              reject()
            })          
          }).catch( e => {
            Swal.fire('Error!', e.message, 'error')
            reject()
          })
        }).catch(() => this.dialog = true).finally(() => this.$store.commit('SET_OVERLAY', false))
      }
    },
    deleteItem(item) {
      // this.$store.dispatch({ type: 'alertDialog', text: 'Delete', actionType: 3, collection: 'attendance', id: id })
      console.log(item)
    },
  },
  created() {
    this.get()
  }
}
</script>