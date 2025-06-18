import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  banderaPago: boolean=false;
  total: number=0;

  constructor() { }
}