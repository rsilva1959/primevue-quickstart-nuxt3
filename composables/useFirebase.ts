import { initializeApp } from 'firebase/app'
import { getFirestore, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCqSOQwtaED9QTOg_IqZxOKgF5N89zO2lQ",
      authDomain: "yes4eutests.firebaseapp.com",
      projectId: "yes4eutests",
      storageBucket: "yes4eutests.appspot.com",
      messagingSenderId: "1062997613231",
      appId: "1:1062997613231:web:a93d4d8f5b49f3ab41125a",
      measurementId: "G-T322ZYB8NT",
      persistence: false
  }
  
// init firebase
const firebaseApp = initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const timestamp = serverTimestamp()
const globals = ['programs', 'langs', 'cards', 'debug', 'movies', 'formsConfig', 'theaters', 'transactionsGateway', '__swap']
const settings = ['campaignCalendars', 'campaignTemplates', 'chains', 'storeCategories', 'storeDisplays', 'storeTypes', 'storeZones']
const apiUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`
 

export { db, timestamp, firebaseApp, globals, settings, apiUrl }