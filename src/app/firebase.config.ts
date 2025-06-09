import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDQFVMVSPPlXESs__t7D7DMEwrFWpPMVpc",
  authDomain: "proyectofinal-web-42f3b.firebaseapp.com",
  projectId: "proyectofinal-web-42f3b",
  storageBucket: "proyectofinal-web-42f3b.appspot.com", // Corregido: "proyectofinal-web-42f3b.firebasestorage.app"
  messagingSenderId: "904328738986",
  appId: "1:904328738986:web:d516f95d81bf4dcea9f8d3",
  measurementId: "G-QN169PDZSM"
};

// Inicializa Firebase y Firestore
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);