import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Events, IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {

  constructor(
    private event: Events,
    private navCtrl: NavController,
  ) { }

  public goToOtherPage(index: number): void {
    this.navCtrl.push('TabsPage').then(() => {
      this.event.publish('tab:open', {
        index,
      });
    });
  }

}
