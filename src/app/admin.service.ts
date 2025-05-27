import { Injectable } from '@angular/core';
import { Admin } from './admin';
import { Admins } from './admins';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private admins:Admin[]=Admins;

  constructor() { }

  getAdmins():Admin[]{
    return this.admins;
  }
  
}
