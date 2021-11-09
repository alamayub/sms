<template>
  <v-container fluid>
    <FAB title="Attendance" :open="() => dialog = true" />

    <!-- List page -->
    <v-list class="attendance py-0">
      <v-list-item v-for="(user, i) in attendance" :key="i" class="card__item py-2">
        <v-list-item-avatar size="60">
          <v-img :src="getEmployee(user.employeeId).image" :lazy-src="getEmployee(user.employeeId).image" :alt="getEmployee(user.employeeId).name" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="getEmployee(user.employeeId).name" />
          <v-list-item-subtitle class="caption" v-text="`Attendance ${user.noOfAttendance}`" />
          <v-list-item-subtitle class="caption" v-text="user.date" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
      
    <!-- Add Dialogue -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card>
        <CardTitle :title="editId === null ? 'New Employee' : 'Update Employee'" :close="closeDialog" />
        <v-card-text class="pt-5">
          <v-form ref="form" lazy-validation v-model="valid" class="d-flex flex-column" style="grid-gap: 12px;" @submit.prevent>
            <v-autocomplete v-model="form.employeeIds" :items="employee" dense outlined hide-details chips color="primary" label="Employees*" :item-text="item => item['.key']" multiple :rules="[v => !!v || '']">
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
    projects: []
  }),
  firestore: () =>({
    employee: db.collection('employee').where('status', '==', true).orderBy('createdAt', 'desc'),
    attendance: db.collection('attendance').where('status', '==', true).orderBy('createdAt', 'desc'),
    projects: db.collection('projects').where('status', '==', true).orderBy('createdAt', 'desc')
  }),
  methods: {
    getEmployee(id) {
      return this.employee.find(x => x['.key'] === id)
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
            } else reject()
          })
        }).then(() => {
          Swal.fire('Saved!', 'Your all data has been saved successfully.', 'success')
          this.reset()
        }).catch(() => this.dialog = true).finally(() => this.$store.commit('SET_OVERLAY', false))
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