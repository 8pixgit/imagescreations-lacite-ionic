import { AfsService, CarrierService, UserService } from '../../providers';
import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

  private loginErrorString: string;
  public password: string;
  public userSelected: string;

  constructor(
    private carrier: CarrierService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private translate: TranslateService,
    private user: UserService,
    public afsService: AfsService,
  ) {
    this.password = '';
    this.userSelected = '';
    this.translate.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    });
  }

  public doLogin(): void {
    const loader = this.loadingCtrl.create({
      content: this.translate.instant('LOGIN_WAIT'),
    });
    loader.present();
    this.user.login({
      email: this.userSelected,
      password: this.password,
    }).subscribe(() => {
      loader.dismiss();
      this.carrier.loadCarrier();
      this.navCtrl.push('HomePage');
    },           () => {
      loader.dismiss();
      const toast = this.toastCtrl.create({
        cssClass: 'error',
        message: this.loginErrorString,
        duration: 3000,
        position: 'top',
      });
      toast.present();
    });
  }

}
