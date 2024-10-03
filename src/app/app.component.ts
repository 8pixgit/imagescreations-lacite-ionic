import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Platform} from '@ionic/angular';
import {SplashScreen} from '@capacitor/splash-screen';
import {StatusBar, Style} from '@capacitor/status-bar';

import {CarrierService, EventService, UserService} from './shared/services';
import {Capacitor} from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  constructor(
    private translate: TranslateService,
    private platform: Platform,
    public carrier: CarrierService,
    public user: UserService,
    private event: EventService,
  ) {
    this.initTranslate();
    this.platform.ready().then(() => {
      this.init();
    });
  }


  private async init() {
    if (Capacitor.isNativePlatform()) {
      await StatusBar.hide();
      await SplashScreen.hide();
      await StatusBar.setBackgroundColor({color: '#222'});
      await StatusBar.setOverlaysWebView({overlay: false});
      await StatusBar.setStyle({style: Style.Light});
    }


  }

  private initTranslate(): void {
    this.translate.setDefaultLang(localStorage.getItem('lang') || 'fr');
    this.translate.use('fr');
  }
}
