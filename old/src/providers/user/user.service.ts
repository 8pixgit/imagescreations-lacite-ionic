import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { NextObserver, Observable } from 'rxjs';
import { Password } from '../../interfaces';
import { take } from 'rxjs/operators';

@Injectable()
export class UserService {

  public email: string;
  public lang: string;

  constructor(
    private readonly afs: AngularFirestore,
  ) {
    this.email = localStorage.getItem('email') || null;
    this.lang = localStorage.getItem('lang') || 'fr';
  }

  public login(account: { email: string, password: string }): Observable<boolean> {

    return Observable.create((observer: NextObserver<boolean>) => {

      this.afs.collection<AngularFirestoreCollection>('settings').doc<Password>('users-password').valueChanges().pipe(
        take(1),
      ).subscribe((res) => {
        if (res['last-password'] === account.password) {
          localStorage.setItem('email', account.email);
          this.email = account.email;
          observer.next(true);
          observer.complete();
        } else {
          observer.error(false);
          observer.complete();
        }
      });

    });

  }

  public logout(): void {
    localStorage.clear();
    this.email = null;
  }

}
