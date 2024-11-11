import { Component, ViewChild } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import {
  IonTabs,
  MenuController,
  ModalController,
  Platform,
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import {
  AfsService,
  CarrierService,
  EventService,
  UserService,
} from '../shared/services';

@Component({
  selector: 'app-auth',
  templateUrl: 'main.component.html',
  styleUrls: ['main.component.scss'],
})
export class MainComponent {
  public uiHidden: boolean;
  public tab1Root: string;
  public tab2Root: string;
  public tab3Root: string;
  public tab4Root: string;
  public currentRoute = '';
  public version = environment.version;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild('myTabs') private tabRef: IonTabs;

  constructor(
    private translate: TranslateService,
    private platform: Platform,
    public carrier: CarrierService,
    public user: UserService,
    private event: EventService,
    private afsService: AfsService,
    private modalCtrl: ModalController,
    private router: Router,
    private menu: MenuController
  ) {
    this.tab1Root = 'destination';
    this.tab2Root = 'lacite';
    this.tab3Root = 'spaces';
    this.tab4Root = 'services';
    this.event.gestureDblclickObserve().subscribe((uiHidden) => {
      this.uiHidden = uiHidden;
    });
    // eslint-disable-next-line @typescript-eslint/no-shadow
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        console.log(event);
      }
    });
  }

  openPage(page: string): void {
    this.menu.close('menu');
    this.router.navigate([page]);
  }

  logout(): void {
    this.user.logout();
    this.router.navigate(['auth/signin']);
  }
}
