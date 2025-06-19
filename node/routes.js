const express = require('express');
const bcrypt = require('bcrypt'); 
const { db } = require('./firebase.config');
const { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, query, where, getDoc } = require('firebase/firestore');
const { enviarCorreo } = require('./nodemailer.config');

const router = express.Router();

// GET all
router.get('/:collectionName', async (req, res) => {
  try {
    const colRef = collection(db, req.params.collectionName);
    const snapshot = await getDocs(colRef);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log('error en get');
  }
});

// GET by ID
router.get('/:collectionName/:id', async (req, res) => {
  try {
    const { collectionName, id } = req.params;
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    res.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    console.error('Error al obtener documento por ID:', error);
    res.status(500).json({ error: error.message });
  }
});


// POST add
router.post('/:collectionName', async (req, res) => {
  try {
    const colRef = collection(db, req.params.collectionName);
    const docRef = await addDoc(colRef, req.body);

    if (req.params.collectionName === 'formReservas') {
      // Enviar correo de confirmación
      const email = await obtenerEmailPorUsername(req.body.creadoPor);

      await enviarCorreo(email, req.body);
    }
    res.json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log('error en post');
  }
});

// DELETE 
router.delete('/:collectionName/:id', async (req, res) => {
  try {
    const docRef = doc(db, req.params.collectionName, req.params.id);
    await deleteDoc(docRef);
    res.json({ message: 'Documento eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT actualizar registros
router.put('/:collectionName/:id', async (req, res) => {
  try {
    const docRef = doc(db, req.params.collectionName, req.params.id);
    await updateDoc(docRef, req.body);
    res.json({ message: 'Documento actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST getWhere
router.post('/query/:collectionName', async (req, res) => {
  try {
    const { conditions } = req.body;
    const colRef = collection(db, req.params.collectionName);

    let q = colRef;
    if (conditions?.length) {
      const filters = conditions.map(c => where(c.fieldPath, c.opStr, c.value));
      q = query(colRef, ...filters);
    }

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const obtenerEmailPorUsername = async (username) => {
  const colRef = collection(db, 'users');
  const q = query(colRef, where('username', '==', username));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    throw new Error('Usuario no encontrado');
  }
  return snapshot.docs[0].data().email;
};

module.exports = router;