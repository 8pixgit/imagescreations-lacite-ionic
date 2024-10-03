import * as _ from 'lodash';


import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {Carrier, FileI, User} from '../interfaces';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AfsService, UserService} from '../services';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {EventService} from './event.service';
import {NewcarrierModal, SendCarrierModal} from '../../main/components/modals';

@Injectable({
  providedIn: 'root'
})
export class CarrierService {

  count;
  currentUser;
  private usersCollection: AngularFirestoreCollection<User>;

  constructor(
    private afsService: AfsService,
    private alertCtrl: AlertController,
    private event: EventService,
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
    this.event.usersLoadedObserve().subscribe(() => {
      //  this.loadCarrier();
    });
    this.usersCollection = this.afs.collection<User>('users');
  }

  public addToCarrier(file: FileI): void {
    let availableCarrier = null;
    this.currentUser.carriers = this.currentUser.carriers || [];
    this.currentUser.carriers.forEach((carrier: Carrier, i: number) => {
      if (!carrier.lock) {
        availableCarrier = i;
      }
    });
    if (availableCarrier !== null) {
      if (typeof file === 'object') {
        this.addFile(file, availableCarrier);
      } else {
        this.addFile({type: 'url', url: file}, availableCarrier);
      }
    } else {
      this.newCarrier(file);
    }
  }

  public async deleteCarrier(carrierIndex: number) {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('CARRIER_CONFIRM'),
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
              .then(async () => {
                const toast = await this.toastCtrl.create({
                  message: this.translate.instant('CARRIER_DELETED'),
                  duration: 3000,
                  position: 'top',
                });
                toast.present();
              })
              .catch(async (err) => {
                const toast = await this.toastCtrl.create({
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
          .then(async () => {
            const toast = await this.toastCtrl.create({
              message: this.translate.instant('CARRIER_DELETE_FILE'),
              duration: 3000,
              position: 'top',
            });
            toast.present();
          })
          .catch(async (err) => {
            const toast = await this.toastCtrl.create({
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

  public async editCarrier(carrierIndex: number) {
    const modal = await this.modalCtrl.create(
      {
        component: NewcarrierModal,
        cssClass: 'modal-css',
        componentProps: {
          title: this.currentUser.carriers[carrierIndex].title,
          note: this.currentUser.carriers[carrierIndex].note
        },
      }
    );
    modal.onDidDismiss().then((data: any) => {
      if (data) {
        this.currentUser.carriers[carrierIndex].note = data.note;
        this.currentUser.carriers[carrierIndex].title = data.title;
        this.usersCollection.doc<User>(this.currentUser.id).update(this.currentUser)
          .then(async () => {
            const toast = await this.toastCtrl.create({
              message: this.translate.instant('CARRIER_EDITED'),
              duration: 3000,
              position: 'top',
            });
            toast.present();
          })
          .catch(async (err) => {
            const toast = await this.toastCtrl.create({
              cssClass: 'error',
              message: err,
              duration: 3000,
              position: 'top',
            });
            toast.present();
          });
      }
    });
    await modal.present();
  }

  public loadCarrier(): void {
    this.count = 0;
    if (this.user.email) {
      const user = _.filter(this.afsService.users, (user: User) => user.email === this.user.email)[0];
      this.currentUser = user;
      this.currentUser.carriers = user.carriers || [];
      this.currentUser.carriers = _.orderBy(this.currentUser.carriers, 'creationDate', 'desc');
      this.currentUser.carriers.forEach((carrier: Carrier) => {
        if (!carrier.lock && carrier.files) {
          this.count = carrier.files.length;
        }
      });
    }
  }

  public lockCarrier(carrierIndex: number, closeAll?: boolean): void {
    if (!closeAll) {
      this.currentUser.carriers.forEach((carrier: Carrier, i) => {
        if (i === carrierIndex) {
          carrier.lock = !carrier.lock;
        } else {
          carrier.lock = true;
        }
      });
    } else {
      this.currentUser.carriers.forEach((carrier: Carrier) => {
        carrier.lock = true;
      });
    }
    this.usersCollection.doc<User>(this.currentUser.id).update(this.currentUser)
      .then(async () => {
        if (!closeAll) {
          const toast = await this.toastCtrl.create({
            duration: 3000,
            message: this.translate.instant(this.currentUser.carriers[carrierIndex].lock ? 'CARRIER_LOCK' : 'CARRIER_UNLOCK'),
            position: 'top',
          });
          toast.present();
        }
      })
      .catch(async (err) => {
        const toast = await this.toastCtrl.create({
          cssClass: 'error',
          message: err,
          duration: 3000,
          position: 'top',
        });
        toast.present();
      });
  }

  public async newCarrier(file?: FileI) {
    const modal = await this.modalCtrl.create(
      {
        component: NewcarrierModal,
        cssClass: 'modal-css',
        componentProps: {},
      }
    );
    modal.onDidDismiss().then((data: any) => {
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
          .then(async () => {
            if (file) {
              this.addFile(file, 0);
            }
            const toast = await this.toastCtrl.create({
              duration: 3000,
              message: this.translate.instant('CARRIER_SUCCESS'),
              position: 'top',
            });
            toast.present();
          })
          .catch(async (err) => {
            const toast = await this.toastCtrl.create({
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
    await modal.present();
  }

  public async sendCarrier(carrierIndex: number) {
    const modal = await this.modalCtrl.create(
      {
        component: SendCarrierModal,
        cssClass: 'modal-css',
        componentProps: {},
      }
    );
    modal.onDidDismiss().then((data: any) => {
      {
        if (data) {
          data.message += '<br>';
          this.currentUser.carriers[carrierIndex].files.forEach((file: any) => {
            let title: string;
            if (this.user.lang === 'fr' && file.title) {
              title = file.title;
              if (file.legend1) {
                title += ` - ${file.legend1}`;
              }
            } else if (this.user.lang === 'en' && file.englishTitle) {
              title = file.englishTitle;
              if (file.englishLegend1) {
                title += ` - ${file.englishLegend1}`;
              }
            }
            // eslint-disable-next-line max-len
            data.message += `<br>● <a href='${file.downloadUrl || file.url}'>${title || file.name || file.url.replace('http://', '').replace('https://', '')}</a>`;
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
            async () => {
              const toast = await this.toastCtrl.create({
                duration: 3000,
                message: this.translate.instant('CARRIER_SENT'),
                position: 'top',
              });
              toast.present();
            },
            async () => {
              const toast = await this.toastCtrl.create({
                cssClass: 'error',
                duration: 3000,
                message: this.translate.instant('CARRIER_ERROR'),
                position: 'top',
              });
              toast.present();
            });
        }
      }
    });
    await modal.present();
  }

  /*ngOnDestroy() {
    this.event.unsubscribe('users:loaded');
  }*/

  private async addFile(file: FileI, carrierIndex: number) {
    let exist = false;
    this.currentUser.carriers[carrierIndex].files.forEach((filei: FileI) => {
      if (filei.name === file.name) {
        exist = true;
      }
    });
    if (!exist) {
      this.currentUser.carriers[carrierIndex].files.push(file);
      this.usersCollection.doc<User>(this.currentUser.id).update(this.currentUser)
        .then(async () => {
          const toast = await this.toastCtrl.create({
            message: this.translate.instant('CARRIER_OK'),
            duration: 3000,
            position: 'top',
          });
          this.loadCarrier();
          toast.present();
        })
        .catch(async (err: Error) => {
          const toast = await this.toastCtrl.create({
            cssClass: 'error',
            duration: 3000,
            message: err.message,
            position: 'top',
          });
          toast.present();
        });
    } else {
      const toast = await this.toastCtrl.create({
        cssClass: 'error',
        duration: 3000,
        message: this.translate.instant('CARRIER_EXIST'),
        position: 'top',
      });
      toast.present();
    }
  }

}
