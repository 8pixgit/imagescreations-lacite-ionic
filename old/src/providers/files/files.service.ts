import { AngularFirestore } from '@angular/fire/firestore';
import { Category, FileI, Key, Point, Space, User } from '../../interfaces';
import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class AfsService {

  public files: FileI[];
  public keys: Key[];
  public points: Point[];
  public spaces: Space[];
  public toolboxCategories: Category[];
  public totalFiles: number;
  public users: User[];

  constructor(
    private event: Events,
    private readonly afs: AngularFirestore,
  ) {
    this.files = [];
    this.keys = [];
    this.points = [];
    this.spaces = [];
    this.toolboxCategories = [];
    this.users = [];
  }

  public loadAfs(): void {

    this.afs.collection<FileI>('files').valueChanges().subscribe((files: FileI[]) => {
      this.files = files;
      this.totalFiles = files.length;
    });

    this.afs.collection<Key>('keys').snapshotChanges().pipe(
      map(actions => actions.map((a) => {
        const data = a.payload.doc.data() as Key;
        const id = a.payload.doc.id;
        return { id, ...data };
      })),
    ).subscribe((keys: Key[]) => {
      this.keys = keys;
    });

    this.afs.collection<Point>('points').valueChanges().subscribe((points: Point[]) => {
      this.points = points;
    });

    this.afs.collection<Space>('spaces', ref => ref.orderBy('title', 'asc')).valueChanges().subscribe((spaces: Space[]) => {
      this.spaces = spaces;
    });

    this.afs.collection<Category>('toolbox-categories', ref => ref.orderBy('title')).snapshotChanges().pipe(
      map(actions => actions.map((a) => {
        const data = a.payload.doc.data() as Category;
        const id = a.payload.doc.id;
        return { id, ...data };
      })),
    ).subscribe((categories: Category[]) => {
      this.toolboxCategories = categories;
    });

    this.afs.collection<User>('users', ref => ref.orderBy('firstname')).snapshotChanges().pipe(
      map(actions => actions.map((a) => {
        const data = a.payload.doc.data() as User;
        const id = a.payload.doc.id;
        return { id, ...data };
      })),
    ).subscribe((users: User[]) => {
      this.users = users;
      this.event.publish('users:loaded');
    });

  }

}
