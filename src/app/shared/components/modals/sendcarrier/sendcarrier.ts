import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AfsService, UserService} from '../../../../shared/services';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-modal-sendcarrier',
  templateUrl: 'sendcarrier.html',
  styleUrls: ['sendcarrier.scss'],
})

export class SendCarrierModal {

  public cc: string;
  public message: string;
  public recipients: string[];

  constructor(
    private translate: TranslateService,
    private modalCtrl: ModalController,
    public afsService: AfsService,
    public user: UserService,
  ) {
    this.cc = '';
    this.message = this.translate.instant('SEND_MESSAGE');
    this.recipients = [''];
  }

  public addRecipient(): void {
    this.recipients.push('');
  }

  public create(): void {
    this.modalCtrl.dismiss({
      cc: this.cc,
      message: this.message,
      recipients: this.recipients,
    });
  }

  public trackByFn(index: number): number {
    return index;
  }

}
