import { Injectable } from '@angular/core';
import { collection, getDocs, addDoc, deleteDoc, doc, DocumentData, QueryFieldFilterConstraint, where, query } from 'firebase/firestore';
import { db } from '../app/firebase.config';

interface QueryCondition {
  fieldPath: string;
  opStr: '==' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in' | 'array-contains-any' | '!=' | 'not-in';
  value: any;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor() { }

  //leer todo
  async getAll(collectionName: string){
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  //altas
  async add(collectionName: string, data: any) {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, data);
    return docRef.id;
  }

  //bajas
  async delete(collectionName: string, id: string) {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  }

  async getWhere(collectionName: string, conditions: QueryCondition[]): Promise<DocumentData[]> {
    const colRef = collection(db, collectionName);

    // Creamos un array para almacenar las restricciones de la consulta (QueryFieldFilterConstraint)
    const queryConstraints: QueryFieldFilterConstraint[] = [];

    // Iteramos sobre las condiciones y agregamos cada una a las restricciones
    for (const condition of conditions) {
      queryConstraints.push(
        where(condition.fieldPath, condition.opStr, condition.value)
      );
    }

    // Creamos la consulta con todas las restricciones
    const q = query(colRef, ...queryConstraints);

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
