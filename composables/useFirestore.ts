import {
  // getFirestore,
  collection,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
  query,
  where,
  limit,
  orderBy,
  startAfter,
  onSnapshot
} from 'firebase/firestore'
import { list_api, get_api } from './useFirestoreApi'
import { db, globals, settings } from './useFirebase'
import { ref } from 'vue'

// import { useStore } from '~/store/store'

// const db = getFirestore(firebaseApp)
// const store = useStore()
const createId = () => { return btoa(new Date().getTime().toString()).replace(new RegExp('=', 'g'), '') }
// const nick = store.nick
const nick = 'yes'
// console.log('firestore - nick: ', nick)
const getPath = (collection) => {
  let path = `${collection}/${nick}/${collection}`
  if (globals.includes(collection)) path = collection
  if (settings.includes(collection)) path = `settings/${nick}/${collection}`
  // console.log('Path: ', path)
  return path
}

const get = (_col, id) => {
  const path = getPath(_col)
  if (process.client) {
    const docRef = doc(db, path, id)
    const unsub = onSnapshot(docRef, (doc) => {
      return { ...doc.data(), id } 
    }, (e) => { console.log(e) })
    watchEffect((onInvalidate) => {
      onInvalidate(() => unsub())
    })
  } else {
      return get_api(path, id)
  }
}

const add = async (_col, data) => {
  const id = createId()
  const path = getPath(_col)
  const docRef = doc(db, path, id)
  try {
    const res = await setDoc(docRef, { ...data, id })
    return res
  } catch (e) {
    console.log(e)
    return
  }
}

const set = async (_col, id, data) => {
  const path = getPath(_col)
  // console.log(db, path, id, data)
  const docRef = doc(db, path, id)
  try {
    const res = await setDoc(docRef, { ...data, id })
    return res
  } catch (e) {
    console.log(e)
    return
  }
}

const update = async (_col, id, data) => {
  const path = getPath(_col)
  const docRef = doc(db, path, id)
  try {
    const res = await updateDoc(docRef, data)
    return res
  } catch (e) {
    console.log(e)
    return
  }
}

const merge = async (_col, id, data) => {
  const path = getPath(_col)
  const docRef = doc(db, path, id)
  try {
    const res = await setDoc(docRef, { ...data, id }, { merge: true })
    return res
  } catch (e) {
    console.log(e)
    return
  }
}

const remove = async (_col, id) => {
  const path = getPath(_col)
  const docRef = doc(db, path, id)
  try {
    await deleteDoc(docRef)
    return
  } catch (e) {
    console.log(e)
  }
}

const inactivate = async (_col, id) => {
  const path = getPath(_col)
  const docRef = doc(db, path, id)
  try {
    const res = await updateDoc(docRef, { active: false })
    return res
  } catch (e) {
    console.log(e)
  }
}

const list = (_col, args?, api = true) => {
  // console.log('goto api: ', api, args)
  const documents = ref(null)
  const path = getPath(_col)
  if (process.client || api === false) {
    const colRef = collection(db, path)
    const qry = []
    if(args) {
      if (args.where) for (const w of args.where) qry.push(where(w[0], w[1], w[2]))
      if (args.orderBy) qry.push(orderBy(args.orderBy, args.direction ? args.direction : 'asc'))
      if (args.limit) qry.push(limit(args.limit))
      if (args.startAfter) qry.push(startAfter(args.startAfter))
    }
    const q = qry.length ? query(colRef, ...qry) : query(colRef)
    const unsub = onSnapshot(q, (snapshot) => {
        let results = []
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id })
        })
        documents.value = results
      }, (error) => {
        console.log(error)
      }
    )
    watchEffect((onInvalidate) => {
      onInvalidate(() => unsub())
    })
    return documents
  } else {
    const items = ref(list_api(path, args))
    // console.log('list_api', path, args)
    return items
  }
}


// const useFirestore = () => {
//   return {     
//     db,
//     get,
//     set,
//     add,
//     update,
//     merge,
//     remove,
//     inactivate,
//     list 
//   }
// }

export {     
  get,
  set,
  add,
  update,
  merge,
  remove,
  inactivate,
  list 
}