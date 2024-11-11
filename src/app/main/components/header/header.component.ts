import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Event,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { EventService, UserService } from '../../../shared/services';
import { SyncModal } from '../modals';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public currentPage: string;
  public lang = 'fr';
  public uiHidden = false;

  constructor(
    private router: Router,
    public user: UserService,
    private event: EventService,
    private translate: TranslateService,
    private modalCtrl: ModalController,
    private translateService: TranslateService,
    private menu: MenuController
  ) {
    this.lang = translateService.currentLang;
    translate.onLangChange.subscribe((lang) => {
      this.lang = lang.lang;
    });
    this.event.gestureDblclickObserve().subscribe((uiHidden) => {
      this.uiHidden = uiHidden;
    });
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        //do something on start activity
        this.currentPage = event.url.split('/')[1];
      }

      if (event instanceof NavigationError) {
        // Handle error
        console.error(event.error);
      }

      if (event instanceof NavigationEnd) {
        //do something on end activity
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {}

  openPage(page: string): void {
    this.currentPage = page;
    this.router.navigate(['/main' + page]);
  }

  changeLang(lang: string): void {
    localStorage.setItem('lang', lang);
    this.event.langChanged(lang);
    this.translate.use(lang);
    this.user.lang = lang;
  }

  async openSync() {
    const modal = await this.modalCtrl.create({
      component: SyncModal,
      cssClass: 'modal-css',
      componentProps: {},
    });
    modal.onDidDismiss().then((data: any) => {});
    await modal.present();
  }

  openMenu() {
    this.menu.open('menu');
  }
}
