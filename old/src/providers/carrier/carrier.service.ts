import * as _ from 'lodash';
import { AfsService, UserService } from '../../providers';
import { AlertController, Events, ModalController, ToastController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Carrier, FileI, User } from '../../interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewcarrierModal, SendcarrierModal } from '../../modals';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CarrierService {

  private usersCollection: AngularFirestoreCollection<User>;
  public count: number;
  public currentUser: User;

  constructor(
    private afsService: AfsService,
    private alertCtrl: AlertController,
    private event: Events,
    private http: HttpClient,
    private modalCtrl: ModalController,
    private readonly afs: AngularFirestore,
    private toastCtrl: ToastController,
    private translate: TranslateService,
    private user: UserService,
  ) {
    this.currentUser = {
      email: this.user.email,
      carriers: [{}],
    };
    this.event.subscribe('users:loaded', () => {
      this.loadCarrier();
    });
    this.usersCollection = this.afs.collection<User>('users');
  }

  private addFile(file: FileI, carrierIndex: number): void {
    let exist = false;
    this.currentUser.carriers[carrierIndex].files.forEach((filei: FileI) => {
      if (filei.name === file.name) exist = true;
    });
    if (!exist) {
      this.currentUser.carriers[carrierIndex].files.push(file);
      this.usersCollection.doc<User>(this.currentUser.id).update(this.currentUser)
        .then(() => {
          const toast = this.toastCtrl.create({
            message: this.translate.instant('CARRIER_OK'),
            duration: 3000,
            position: 'top',
          });
          this.loadCarrier();
          toast.present();
        })
        .catch((err: Error) => {
          const toast = this.toastCtrl.create({
            cssClass: 'error',
            duration: 3000,
            message: err.message,
            position: 'top',
          });
          toast.present();
        });
    } else {
      const toast = this.toastCtrl.create({
        cssClass: 'error',
        duration: 3000,
        message: this.translate.instant('CARRIER_EXIST'),
        position: 'top',
      });
      toast.present();
    }
  }

  public addToCarrier(file: FileI): void {
    let availableCarrier = null;
    this.currentUser.carriers = this.currentUser.carriers || [];
    this.currentUser.carriers.forEach((carrier: Carrier, i: number) => {
      if (!carrier.lock) availableCarrier = i;
    });
    if (availableCarrier !== null) {
      if (typeof file === 'object') this.addFile(file, availableCarrier);
      else this.addFile({ type: 'url', url: file }, availableCarrier);
    } else {
      this.newCarrier(file);
    }
  }

  public deleteCarrier(carrierIndex: number): void {
    const alert = this.alertCtrl.create({
      title: this.translate.instant('CARRIER_CONFIRM'),
      buttons: [
        {
          text: this.translate.instant('LOGIN_CANCEL'),
          role: 'cancel',
        },
        {
          text: this.translate.instant('CARRIER_DELETE'),
          handler: () => {
            this.currentUser.carriers.splice(carrierIndex, 1);
            this.usersCollection.doc<User>(this.currentUser.id).update(this.currentUser)
              .then(() => {
                const toast = this.toastCtrl.create({
                  message: this.translate.instant('CARRIER_DELETED'),
                  duration: 3000,
                  position: 'top',
                });
                toast.present();
              })
              .catch((err) => {
                const toast = this.toastCtrl.create({
                  cssClass: 'error',
                  message: err,
                  duration: 3000,
                  position: 'top',
                });
                toast.present();
              });
          },
        },
      ],
    });
    alert.present();
  }

  public deleteFile(filePath: string, carrierIndex: number): void {
    this.currentUser.carriers[carrierIndex].files.forEach((file: FileI, i) => {
      if (file.path === filePath) {
        this.currentUser.carriers[carrierIndex].files.splice(i, 1);
        this.usersCollection.doc<User>(this.currentUser.id).update(this.currentUser)
          .then(() => {
            const toast = this.toastCtrl.create({
              message: this.translate.instant('CARRIER_DELETE_FILE'),
              duration: 3000,
              position: 'top',
            });
            toast.present();
          })
          .catch((err) => {
            const toast = this.toastCtrl.create({
              cssClass: 'error',
              message: err,
              duration: 3000,
              position: 'top',
            });
            toast.present();
          });
      }
    });
  }

  public editCarrier(carrierIndex: number): void {
    const modal = this.modalCtrl.create(NewcarrierModal, {
      title: this.currentUser.carriers[carrierIndex].title,
      note: this.currentUser.carriers[carrierIndex].note,
    });
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        this.currentUser.carriers[carrierIndex].note = data.note;
        this.currentUser.carriers[carrierIndex].title = data.title;
        this.usersCollection.doc<User>(this.currentUser.id).update(this.currentUser)
          .then(() => {
            const toast = this.toastCtrl.create({
              message: this.translate.instant('CARRIER_EDITED'),
              duration: 3000,
              position: 'top',
            });
            toast.present();
          })
          .catch((err) => {
            const toast = this.toastCtrl.create({
              cssClass: 'error',
              message: err,
              duration: 3000,
              position: 'top',
            });
            toast.present();
          });
      }
    });
  }

  public loadCarrier(): void {
    this.count = 0;
    if (this.user.email) {
      const user = _.filter(this.afsService.users, (user: User) => { return user.email === this.user.email; })[0];
      this.currentUser = user;
      this.currentUser.carriers = user.carriers || [];
      this.currentUser.carriers = _.orderBy(this.currentUser.carriers, 'creationDate', 'desc');
      this.currentUser.carriers.forEach((carrier: Carrier) => {
        if (!carrier.lock && carrier.files) this.count = carrier.files.length;
      });
    }
  }

  public lockCarrier(carrierIndex: number, closeAll?: boolean): void {
    if (!closeAll) {
      this.currentUser.carriers.forEach((carrier: Carrier, i) => {
        if (i === carrierIndex) carrier.lock = !carrier.lock;
        else carrier.lock = true;
      });
    } else {
      this.currentUser.carriers.forEach((carrier: Carrier) => {
        carrier.lock = true;
      });
    }
    this.usersCollection.doc<User>(this.currentUser.id).update(this.currentUser)
      .then(() => {
        if (!closeAll) {
          const toast = this.toastCtrl.create({
            duration: 3000,
            message: this.translate.instant(this.currentUser.carriers[carrierIndex].lock ? 'CARRIER_LOCK' : 'CARRIER_UNLOCK'),
            position: 'top',
          });
          toast.present();
        }
      })
      .catch((err) => {
        const toast = this.toastCtrl.create({
          cssClass: 'error',
          message: err,
          duration: 3000,
          position: 'top',
        });
        toast.present();
      });
  }

  public newCarrier(file?: FileI): void {
    const modal = this.modalCtrl.create(NewcarrierModal);
    modal.present();
    modal.onDidDismiss((data) => {
      this.lockCarrier(null, true);
      if (data) {
        this.currentUser.carriers.push({
          creationDate: new Date().getTime(),
          files: [],
          lock: false,
          note: data.note,
          title: data.title,
        });
        this.usersCollection.doc<User>(this.currentUser.id).update(this.currentUser)
          .then(() => {
            if (file) this.addFile(file, 0);
            const toast = this.toastCtrl.create({
              duration: 3000,
              message: this.translate.instant('CARRIER_SUCCESS'),
              position: 'top',
            });
            toast.present();
          })
          .catch((err) => {
            const toast = this.toastCtrl.create({
              cssClass: 'error',
              message: err,
              duration: 3000,
              position: 'top',
            });
            toast.present();
          });
        this.currentUser.carriers = _.orderBy(this.currentUser.carriers, ['creationDate'], ['desc']);
      }
    });
  }

  public sendCarrier(carrierIndex: number): void {
    const modal = this.modalCtrl.create(SendcarrierModal);
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        data.message += '<br>';
        this.currentUser.carriers[carrierIndex].files.forEach((file: any) => {
          let title: string;
          if (this.user.lang === 'fr' && file.title) {
            title = file.title;
            if (file.legend1) title += ` - ${file.legend1}`;
          } else if (this.user.lang === 'en' && file.englishTitle) {
            title = file.englishTitle;
            if (file.englishLegend1) title += ` - ${file.englishLegend1}`;
          }
          data.message += `<br>● <a href="${file.downloadUrl || file.url}">${title || file.name || file.url.replace('http://', '').replace('https://', '')}</a>`;
        });
        data.message += '<br><br><br>';
        this.http.post('https://us-central1-la-cite-e6908.cloudfunctions.net/sendEmail', {
          cc: data.cc ? [this.user.email, data.cc] : [this.user.email],
          message: data.message,
          recipients: data.recipients,
          user: {
            email: this.user.email,
            message: data.message,
            name: `${this.currentUser.firstname} ${this.currentUser.lastname}`,
            role: this.user.lang === 'fr' ? this.currentUser.role : this.currentUser.englishRole,
            tel: this.currentUser.tel,
          },
        }).subscribe(
          () => {
            const toast = this.toastCtrl.create({
              duration: 3000,
              message: this.translate.instant('CARRIER_SENT'),
              position: 'top',
            });
            toast.present();
          },
          () => {
            const toast = this.toastCtrl.create({
              cssClass: 'error',
              duration: 3000,
              message: this.translate.instant('CARRIER_ERROR'),
              position: 'top',
            });
            toast.present();
          });
      }
    });
  }

  ngOnDestroy() {
    this.event.unsubscribe('users:loaded');
  }

}
