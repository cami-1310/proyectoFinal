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

  //cambios
  update(collectionName: string, id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiURL}/${collectionName}/${id}`, data);
  }

  //consulta condicional
  getWhere(collectionName: string, conditions: QueryCondition[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiURL}/query/${collectionName}`, { conditions });
  }
}