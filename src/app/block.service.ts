import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlockService {
  banderaBloqueado: boolean=false;

  constructor() { }
}