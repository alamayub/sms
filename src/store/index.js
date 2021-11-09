import Vue from 'vue'
import Vuex from 'vuex'
import { fb, db } from '../firebase'
import Swal from 'sweetalert2'
import router from '../router/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawer: null,
    overlay: false
  },
  mutations: {
    SET_DRAWER: (state, val) => state.drawer = val,
    SET_OVERLAY: (state, val) => state.overlay = val
  },
  actions: {
    // login
    login({ commit },  { email, password }) {
      commit('SET_OVERLAY', true)
      return new Promise((resolve, reject) => {
        fb.auth().signInWithEmailAndPassword(email, password).then( user => {
          router.replace('/')
          resolve(user.user)
        }).catch( e => {
          Swal.fire('Error!', e.message, 'error')
          reject(e)
        })
      }).finally( () => commit('SET_OVERLAY', false))
    },
    // logout 
    logout({commit}) {
      commit('SET_OVERLAY', true)
      return new Promise((resolve, reject) => {
        fb.auth().signOut().then( () => {
          router.replace('/login')
          resolve()
        }).catch( e => {
          Swal.fire('Error!', e.message, 'error')
          reject(e)
        })
      }).finally( () => commit('SET_OVERLAY', false))
    },
    // alert
    // eslint-disable-next-line no-empty-pattern
    alertDialog({ dispatch },{ text, actionType, collection, file, data, id }) {
      return new Promise((resolve, reject) => {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: `Yes, ${text} it!`
        }).then(async (result) => {
          if (result.isConfirmed) {
            // type 1 id save, type 2 is update, type 3 is delete
            if(actionType === 1) {
              file ? await dispatch({ type: 'uploadImage', folder: collection, file: file }).then( url => {
                data['image'] = url
                dispatch({ type: 'save', collection: collection, data: data })
              }) : dispatch({ type: 'save', collection: collection, data: data })
            } else if (actionType === 2) {
              file ? await dispatch({ type: 'uploadImage', folder: collection, file: file }).then( url => {
                data['image'] = url
                dispatch({ type: 'edit', collection: collection, id: id, data: data })
              }) : await dispatch({ type: 'edit', collection: collection, id: id, data: data })
            }
            else if(actionType === 3) await dispatch({ type: 'deleteItem', collection: collection, id: id })
            resolve()
          } else reject()
        })
      })
    },
    // save data
    save({ commit }, { collection, data }) {
      commit('SET_OVERLAY', true)
      return new Promise((resolve, reject) => {
        data['createdAt'] = new Date().getTime()
        data['updatedAt'] = new Date().getTime()
        data['status'] = true
        db.collection(collection).add(data).then( () => {
          Swal.fire('Saved!', 'Your file has been saved successfully.', 'success')
          resolve()
        }).catch( e => {
          Swal.fire('Error!', e.message, 'error')
          reject(e)
        })
      }).finally(() => commit('SET_OVERLAY', false))
    },
    // image upload 
    uploadImage({ commit }, { folder, file }) {
      commit('SET_OVERLAY', true)
      return new Promise( (resolve, reject) => {
        var storageRef = fb.storage().ref(folder+'/'+`${new Date().getTime()}`)
        let uploadTask = storageRef.put(file)
        uploadTask.on('state_changed', snapshot => {
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress)
        }, e => {
          Swal.fire('Error!', e.message, 'error')
          reject(false)
        }, () => {
          uploadTask.snapshot.ref.getDownloadURL().then( url => {
            resolve(url)
          })
        })
      }).finally(() => commit('SET_OVERLAY', false))
    },
    // delete item
    deleteItem({ commit }, { collection, id }) {
      commit('SET_OVERLAY', true)
      return new Promise((resolve, reject) => {      
        db.collection(collection).doc(id).update({
          status: false,
          updatedAt: new Date().getTime()
        }).then( () => {
          Swal.fire('Deleted!', 'Your file has been deleted successfully.', 'success')
          resolve()
        }).catch( e => {
          Swal.fire('Error!', e.message, 'error')
          reject(e)
        })
      }).finally(() => commit('SET_OVERLAY', false))
    },
    // edit item
    edit({ commit }, { collection, id, data }) {
      commit('SET_OVERLAY', true)
      return new Promise((resolve, reject) => {  
        data['updatedAt'] = new Date().getTime()
        db.collection(collection).doc(id).update(data).then( () => {
          Swal.fire('Updated!', 'Your file has been updated successfully.', 'success')
          resolve()
        }).catch( e => {
          Swal.fire('Error!', e.message, 'error')
          reject(e)
        })
      }).finally(() => commit('SET_OVERLAY', false))
    }
  },
})
