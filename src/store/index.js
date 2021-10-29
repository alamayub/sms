import Vue from 'vue'
import Vuex from 'vuex'
import { fb, db } from '../firebase'
import Swal from 'sweetalert2'

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
    // alert
    // eslint-disable-next-line no-empty-pattern
    alertDialog({ dispatch },{ text, actionType, collection, folder, file, data, id }) {
      console.log(text)
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
              await dispatch({ type: 'uploadImage', folder: folder, file: file }).then( url => {
                data['image'] = url
                dispatch({ type: 'save', collection: collection, data: data })
              })
            } else if (actionType === 2) {
              file ?
              await dispatch({ type: 'uploadImage', folder: folder, file: file }).then( url => {
                data['image'] = url
                dispatch({ type: 'edit', collection: collection, id: id, data: data })
              }) : await dispatch({ type: 'edit', collection: collection, id: id, data: data })
            }
            else if(actionType === 3) await dispatch({ type: 'deleteItem', collection: collection, id: id })
            Swal.fire(`${text}ed!`, `Your file has been ${text}ed.`, 'success')
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
          commit('SET_OVERLAY', false)
          resolve()
        }).catch( e => {
          console.log(e)
          commit('SET_OVERLAY', false)
          reject(e)
        })
      })
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
          console.log(e)
          commit('SET_OVERLAY', false)
          reject(false)
        }, () => {
          uploadTask.snapshot.ref.getDownloadURL().then( url => {
            commit('SET_OVERLAY', false)
            resolve(url)
          })
        })
      })
    },
    // delete item
    deleteItem({ commit }, { collection, id }) {
      commit('SET_OVERLAY', true)
      return new Promise((resolve, reject) => {      
        db.collection(collection).doc(id).update({
          status: false,
          updatedAt: new Date().getTime()
        }).then( () => {
          commit('SET_OVERLAY', false)
          resolve()
        }).catch( e => {
          console.log(e)
          commit('SET_OVERLAY', false)
          reject(e)
        })
      })
    },
    // edit item
    edit({ commit }, { collection, id, data }) {
      commit('SET_OVERLAY', true)
      return new Promise((resolve, reject) => {  
        data['updatedAt'] = new Date().getTime()
        db.collection(collection).doc(id).update(data).then( () => {
          commit('SET_OVERLAY', false)
          resolve()
        }).catch( e => {
          console.log(e)
          commit('SET_OVERLAY', false)
          reject(e)
        })
      })
    }
  },
  modules: {
  }
})
