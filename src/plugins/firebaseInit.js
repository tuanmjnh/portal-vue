import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'
import 'firebase/database'
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAwMnmy7tyvDjIt283Tnp1-u9T7OubwDhs",
  authDomain: "tm-store-4576e.firebaseapp.com",
  databaseURL: "https://tm-store-4576e.firebaseio.com",
  projectId: "tm-store-4576e",
  storageBucket: "tm-store-4576e.appspot.com",
  messagingSenderId: "45492650401"
}
if (!firebase.apps.length) firebase.initializeApp(config)
const settings = {
  timestampsInSnapshots: true
} // your settings...
export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const FBAuth = firebase.auth()
export const FBStorage = firebase.storage()
export const FBDB = firebase.database()
export const FBStore = firebase.firestore()
export const timestamp = firebase.firestore.FieldValue.serverTimestamp()
FBStore.settings(settings)
// export const FBMessaging = firebase.messaging()
// export const FBFuntions = firebase.functions()
// Functions
export function docChanges({ context, collections, items, resolve, reject }) {
  var item = {}
  collections.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      const source = change.doc.metadata.hasPendingWrites ? 'Local' : 'Server'
      if (items.findIndex(x => x.id === change.doc.id) > -1) return
      item = Object.assign({ id: change.doc.id }, change.doc.data())
      if (change.type === "added") {
        if (source === 'Server') {
          context.commit('PUSH_ITEMS', item)
          // data.push(item)
        }
        console.log("Added: ", change.doc.data())
      }
      if (change.type === "modified") {
        if (source === 'Server') {
          context.commit('UPDATE_ITEMS', item)
        }
        // if (change.oldIndex !== change.newIndex) {
        //   data.splice(change.oldIndex, 1)
        //   data.splice(change.newIndex, 0, item)
        // } else data.splice(change.oldIndex, 1, item)
        // console.log("old ", change.oldIndex)
        // console.log("new ", change.newIndex)
        // console.log("Modified: ", change.doc.data())
      }
      if (change.type === "removed") {
        context.commit('REMOVE_ITEMS', item)
        // console.log("Removed: ", change.doc.data())
      }
      // console.log(source)
    }, (error) => {
      if (typeof reject === 'function') reject(error)
    })
    if (typeof resolve === 'function') resolve(item)
  }, (error) => {
    if (typeof reject === 'function') reject(error)
  })
}

export default firebase
