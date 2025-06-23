import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, sendPasswordResetEmail, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { FirestoreService } from './firestore.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$ = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth, private firestoreService: FirestoreService) {}

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  getAdminByEmail(email: string) {
    return this.firestoreService.getByEmail('admins', email);
  }
}
