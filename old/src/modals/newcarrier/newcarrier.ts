import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-newcarrier',
  templateUrl: 'newcarrier.html',
})

export class NewcarrierModal {

  public note: string;
  public title: string;
  public titleButton: string;

  constructor(
    private translate: TranslateService,
    private viewCtrl: ViewController,
    public params: NavParams,
  ) {
    this.note = params.get('note') || '';
    this.title = params.get('title') || '';
    this.titleButton = this.translate.instant(params.get('title') ? 'CARRIER_EDIT' : 'CARRIER_CREATE');
  }

  public create(): void {
    this.viewCtrl.dismiss({
      note: this.note,
      title: this.title,
    });
  }

}
