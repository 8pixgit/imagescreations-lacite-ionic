import {Category, FileI, Key, Point, Space, User} from '../interfaces';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {EventService} from './event.service';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {Directory, Encoding, Filesystem} from '@capacitor/filesystem';
import {HttpClient} from '@angular/common/http';
import {getDownloadURL, getStorage, ref} from '@angular/fire/storage';
import {Capacitor} from '@capacitor/core';
import {Network} from "@capacitor/network";

@Injectable()
export class AfsService {

  public files: FileI[];
  public keys: Key[];
  public points: Point[];
  public spaces: Space[];
  public toolboxCategories: Category[];
  public totalFiles: number;
  public users: User[];
  public initAction: number;

  constructor(
    private event: EventService,
    private readonly afs: AngularFirestore,
    private http: HttpClient
  ) {
    this.files = [];
    this.keys = [];
    this.points = [];
    this.spaces = [];
    this.toolboxCategories = [];
    this.users = [];
    this.initAction = 6;
  }

  public loadAfs(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      this.afs.collection<FileI>('files').valueChanges().subscribe((files: FileI[]) => {
        this.files = files;
        this.totalFiles = files.length;
        this.initAction--;
        if (this.initAction === 0) {
          resolve(true);
        }
      });


      this.afs.collection<Key>('keys').snapshotChanges().pipe(
        map((actions: any) => actions.map((a) => {
          const data = a.payload.doc.data() as Key;
          const id = a.payload.doc.id;
          return {id, ...data};
        })),
      ).subscribe((keys: Key[]) => {
        this.keys = keys;
        this.initAction--;
        if (this.initAction === 0) {
          resolve(true);
        }
      });

      const status = await Network.getStatus();
      if (status.connected) {
        this.afs.collection<Point>('points').valueChanges().subscribe((points: Point[]) => {
          this.points = points;
          localStorage.setItem('points', JSON.stringify(points));
          this.initAction--;
          if (this.initAction === 0) {
            resolve(true);
          }
        });
      }
      else{
        this.points = localStorage.getItem('points') ? JSON.parse(localStorage.getItem('points')) : [];
        this.initAction--;
        if (this.initAction === 0) {
          resolve(true);
        }
      }



      this.afs.collection<Space>('spaces', ref => ref.orderBy('title', 'asc')).valueChanges().subscribe((spaces: Space[]) => {
        this.spaces = spaces;
        this.initAction--;
        if (this.initAction === 0) {
          resolve(true);
        }
      });

      this.afs.collection<Category>('toolbox-categories', ref => ref.orderBy('title')).snapshotChanges().pipe(
        map((actions: any) => actions.map((a) => {
          const data = a.payload.doc.data() as Category;
          const id = a.payload.doc.id;
          return {id, ...data};
        })),
      ).subscribe((categories: Category[]) => {
        this.toolboxCategories = categories;
        this.initAction--;
        if (this.initAction === 0) {
          resolve(true);
        }
      });

      this.afs.collection<User>('users', ref => ref.orderBy('firstname')).snapshotChanges().pipe(
        map((actions: any) => actions.map((a) => {
          const data = a.payload.doc.data() as User;
          const id = a.payload.doc.id;
          return {id, ...data};
        })),
      ).subscribe((users: User[]) => {
        this.users = users;
        this.event.usersLoaded(users);
        this.initAction--;
        if (this.initAction === 0) {
          resolve(true);
        }
      });
    });
  }

  checkFile(path, encoding = null): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {

        if (Capacitor.getPlatform() === 'ios') {
          path = Capacitor.convertFileSrc(path);
          path = path.replace('capacitor://localhost/_capacitor_file_/private', 'file://');
        }

        const file:any = await Filesystem.readFile({
          path,
          directory: Directory.Data,
          encoding: encoding ? encoding : Encoding.UTF8,
        });
        resolve(file.data);
        return file.data;


      } catch (e) {
        resolve(null);
        return null;
      }
    });
  }

  download(url: string, path: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const storage = getStorage();
        const url2 = await getDownloadURL(ref(storage, url));
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = async (event) => {
          const blob = xhr.response;

          const reader = new FileReader();
          reader.onerror = reject;
          reader.onload = async () => {
            await Filesystem.writeFile({
              path,
              data: reader.result as string,
              directory: Directory.Data,
              recursive: true,
              encoding: Encoding.UTF8
            }).then(
              (savedFile: any) => {
                resolve({result: savedFile.uri, message: ''});
                //resolve({result: 'savedFile.uri', message: ''});
              }
            ).catch((e: any) => {
              resolve({result: null, message: e});
            });


          };
          reader.readAsDataURL(blob);
        };
        xhr.open('GET', url2);
        xhr.send();


      } catch (e) {
        resolve({result: null, message: e});
        return null;
      }
    });
  }

  async getUri(path: string) {
    try {
      const uri = await Filesystem.readFile({
        path,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
      return uri.data;

      /* const stat = await Filesystem.stat({
         path,
         directory: Directory.Data,
       });
       console.log(stat);
       return Capacitor.convertFileSrc(stat.uri);*/

    } catch (e) {
      console.log(e);
    }
  }
}
