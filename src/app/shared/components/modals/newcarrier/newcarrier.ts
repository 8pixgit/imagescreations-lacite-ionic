import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-modal-newcarrier',
  templateUrl: 'newcarrier.html',
  styleUrls: ['newcarrier.scss'],

})

export class NewcarrierModal {

  public note: string;
  public title: string;
  public titleButton: string;

  constructor(
    private translate: TranslateService,
    private modalCtrl: ModalController,
    public params: NavParams,
  ) {
    this.note = params.get('note') || '';
    this.title = params.get('title') || '';
    this.titleButton = this.translate.instant(params.get('title') ? 'CARRIER_EDIT' : 'CARRIER_CREATE');
  }

  public create(): void {
    this.modalCtrl.dismiss({
      note: this.note,
      title: this.title,
    });
  }

}
