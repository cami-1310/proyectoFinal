import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface QueryCondition {
  fieldPath: string;
  opStr: '==' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in' | 'array-contains-any' | '!=' | 'not-in';
  value: any;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  apiURL='http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  //leer todo
  getAll(collectionName: string): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiURL}/${collectionName}`);
  }

  //altas
  add(collectionName: string, data: any): Observable<{ id: string }>{
    return this.http.post<{ id: string }>(`${this.apiURL}/${collectionName}`, data);
  }

  //bajas
  delete(collectionName: string, id: string): Observable<any>{
    return this.http.delete<any>(`${this.apiURL}/${collectionName}/${id}`);
  }

  //consulta condicional
  getWhere(collectionName: string, conditions: QueryCondition[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiURL}/query/${collectionName}`, { conditions });
  }

  /*
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
  }*/
}