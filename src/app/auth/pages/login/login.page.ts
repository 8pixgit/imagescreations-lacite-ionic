import {Component} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {LoadingController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {AfsService, CarrierService, UserService} from '../../../shared/services';


@Component({
  selector: 'page-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})

export class LoginPage {

  loginErrorString: string;
  password: string;
  userSelected: string;
  lang = 'fr';

  constructor(
    private carrier: CarrierService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private toastCtrl: ToastController,
    private translate: TranslateService,
    private user: UserService,
    private translateService: TranslateService,
    public afsService: AfsService,
  ) {
    translate.onLangChange.subscribe(lang => {
      this.lang = lang.lang;
    });
    this.lang = translateService.currentLang;
    this.password = '';
    this.userSelected = '';
    this.translate.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    });
  }

  async doLogin() {
    const loader = await this.loadingCtrl.create({
      message: this.translate.instant('LOGIN_WAIT'),
    });
    await loader.present();

    this.user.login({
      email: this.userSelected,
      password: this.password,
    }).subscribe(async () => {
      await loader.dismiss();
      //this.carrier.loadCarrier();
      this.router.navigate(['']);
    }, async () => {
      await loader.dismiss();
      const toast = await this.toastCtrl.create({
        cssClass: 'error',
        message: this.loginErrorString,
        duration: 3000,
        position: 'top',
      });
      await toast.present();
    });
  }

}
