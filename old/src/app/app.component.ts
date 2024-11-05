import { AfsService, CarrierService, UserService } from '../providers';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { Component, ViewChild } from '@angular/core';
import { Events, ModalController, Nav, Platform, ViewController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SyncModal } from '../modals';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'app.component.html',
})

export class MyApp {

  @ViewChild(Nav) public nav: Nav;
  public currentPage: string;
  public rootPage: any;
  public uiHidden: boolean;

  constructor(
    private afsService: AfsService,
    private androidFullScreen: AndroidFullScreen,
    private event: Events,
    private keyboard: Keyboard,
    private modalCtrl: ModalController,
    private platform: Platform,
    private screenOrientation: ScreenOrientation,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    public carrier: CarrierService,
    public user: UserService,
  ) {

    this.keyboard.onKeyboardShow().subscribe(() => {
      if (document.getElementsByClassName('modal-wrapper')) {
        const element: any = document.getElementsByClassName('modal-wrapper')[0];
        element.style.height = '53%';
        element.style.top = '0';
      }
    });
    this.keyboard.onKeyboardHide().subscribe(() => {
      if (document.getElementsByClassName('modal-wrapper')) {
        const element: any = document.getElementsByClassName('modal-wrapper')[0];
        element.style.height = '60%';
        element.style.top = 'calc(50% - (60% / 2))';
      }
    });

    this.initTranslate();

    this.platform.ready().then(() => {

      if (this.platform.is('mobile')) {
        this.androidFullScreen.isImmersiveModeSupported().then(() => this.androidFullScreen.immersiveMode());
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
        this.splashScreen.hide();
        this.statusBar.backgroundColorByHexString('#222');
        this.statusBar.overlaysWebView(false);
        this.statusBar.styleLightContent();
      }

      this.nav.viewDidEnter.subscribe((item: ViewController) => {
        const viewController = item;
        this.currentPage = viewController.id;
      });

      setTimeout(() => {
        this.afsService.loadAfs();
        this.nav.setRoot((localStorage.getItem('email') && localStorage.getItem('email') !== 'null' && localStorage.getItem('email') !== 'undefined') ? 'HomePage' : 'LoginPage');
      },         500);

    });

  }

  private initTranslate(): void {
    this.translate.setDefaultLang(localStorage.getItem('lang') || 'fr');
  }

  public changeLang(lang: string): void {
    localStorage.setItem('lang', lang);
    this.event.publish('lang:changed');
    this.translate.use(lang);
    this.user.lang = lang;
  }

  public logout(): void {
    this.user.logout();
    this.nav.setRoot('LoginPage');
  }

  public openPage(page: string): void {
    this.nav.setRoot(page);
  }

  public openPush(page: string): void {
    this.nav.push(page);
  }

  public openSync(): void {
    this.modalCtrl.create(SyncModal).present();
  }

}
